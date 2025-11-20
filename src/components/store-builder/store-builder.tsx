'use client';

import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Eye,
  Globe,
  Save,
  Smartphone,
  Tablet,
  Monitor,
  Undo,
  Redo,
  Settings,
  Palette,
  Layout,
  ShoppingBag,
  Package2
} from 'lucide-react';
import { ComponentLibrary } from './component-library';
import { CanvasArea } from './canvas-area';
import { PropertiesPanel } from './properties-panel';
import { TemplateSelector } from './template-selector';
import { StoreSettings } from './store-settings';
import { PageComponent } from './page-renderer';
import { toast } from 'sonner';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface StoreBuilderProps {
  onSave?: (components: PageComponent[], settings: any) => void;
  initialComponents?: PageComponent[];
  initialSettings?: any;
}

export function StoreBuilder({
  onSave,
  initialComponents = [],
  initialSettings = {}
}: StoreBuilderProps) {
  const [components, setComponents] = useState<PageComponent[]>(initialComponents);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [storeSettings, setStoreSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('components');
  const [history, setHistory] = useState<PageComponent[][]>([initialComponents]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = useCallback((newComponents: PageComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleAddComponent = useCallback((component: PageComponent) => {
    const newComponents = [...components, component];
    setComponents(newComponents);
    addToHistory(newComponents);
    toast.success('Component added');
  }, [components, addToHistory]);

  const handleUpdateComponent = useCallback((id: string, updates: Partial<PageComponent>) => {
    const newComponents = components.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    );
    setComponents(newComponents);
    addToHistory(newComponents);
  }, [components, addToHistory]);

  const handleDeleteComponent = useCallback((id: string) => {
    const newComponents = components.filter(comp => comp.id !== id);
    setComponents(newComponents);
    addToHistory(newComponents);
    setSelectedComponent(null);
    toast.success('Component deleted');
  }, [components, addToHistory]);

  const handleMoveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    const newComponents = [...components];
    const draggedComponent = newComponents[dragIndex];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, draggedComponent);
    setComponents(newComponents);
    addToHistory(newComponents);
  }, [components, addToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      toast.success('Undone');
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      toast.success('Redone');
    }
  }, [history, historyIndex]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(components, storeSettings);
    }
    toast.success('Store saved successfully!');
  }, [components, storeSettings, onSave]);

  const handlePreview = useCallback(() => {
    // Open preview in new window/tab
    const previewData = {
      components,
      settings: storeSettings,
      deviceType
    };

    // Store preview data in sessionStorage for the preview window
    sessionStorage.setItem('storePreview', JSON.stringify(previewData));

    // Open preview window
    const newWindow = window.open('/dashboard/store-builder/preview', '_blank', 'width=1200,height=800');
    toast.info('Opening store preview...');
  }, [components, storeSettings, deviceType]);

  const handlePublish = useCallback(() => {
    if (components.length === 0) {
      toast.error('Add some components before publishing');
      return;
    }

    // Here you would typically save to database and deploy
    handleSave();
    toast.success('Store published successfully!');
  }, [components, handleSave]);

  const handleLoadTemplate = useCallback((template: PageComponent[]) => {
    setComponents(template);
    addToHistory(template);
    setActiveTab('components');
    toast.success('Template loaded');
  }, [addToHistory]);

  const getDeviceIcon = (device: DeviceType) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getDeviceWidth = (device: DeviceType) => {
    switch (device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-background to-muted/20 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Store Builder</h1>
                <p className="text-xs text-muted-foreground">Design your perfect store</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Draft
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* Device Selector */}
            <div className="flex items-center bg-muted/50 rounded-xl p-1 gap-1">
              {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((device) => (
                <Button
                  key={device}

                  variant={deviceType === device ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceType(device)}
                  className={`h-9 w-9 p-0 rounded-lg transition-all ${deviceType === device
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-background'
                    }`}
                >
                  {getDeviceIcon(device)}
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* History Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="h-9 w-9 p-0 rounded-lg"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="h-9 w-9 p-0 rounded-lg"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSave} className="h-9 px-4 rounded-lg">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handlePreview} className="h-9 px-4 rounded-lg">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handlePublish} className="h-9 px-4 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                <Globe className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 border-r bg-gradient-to-b from-background to-muted/20 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <TabsList className="grid w-full grid-cols-2 gap-1 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="templates" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Layout className="h-4 w-4 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="components" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Package2 className="h-4 w-4 mr-2" />
                    Components
                  </TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2 gap-1 bg-muted/50 p-1 rounded-xl mt-2">
                  <TabsTrigger value="design" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Palette className="h-4 w-4 mr-2" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="templates" className="h-full m-0">
                  <TemplateSelector onLoadTemplate={handleLoadTemplate} />
                </TabsContent>

                <TabsContent value="components" className="h-full m-0">
                  <ComponentLibrary onAddComponent={handleAddComponent} />
                </TabsContent>

                <TabsContent value="design" className="h-full m-0">
                  <PropertiesPanel
                    selectedComponent={selectedComponent ?
                      (components.find(c => c.id === selectedComponent) || null) : null
                    }
                    onUpdateComponent={handleUpdateComponent}
                    storeSettings={storeSettings}
                    onUpdateSettings={setStoreSettings}
                  />
                </TabsContent>

                <TabsContent value="settings" className="h-full m-0">
                  <StoreSettings
                    settings={storeSettings}
                    onUpdateSettings={setStoreSettings}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-muted/20 via-background to-muted/30">
            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-center">
                <div
                  className="bg-white shadow-2xl rounded-2xl border transition-all duration-500 ease-out"
                  style={{
                    width: getDeviceWidth(deviceType),
                    minHeight: '100vh',
                    transform: deviceType === 'mobile' ? 'scale(1)' : deviceType === 'tablet' ? 'scale(0.9)' : 'scale(0.85)'
                  }}
                >
                  <CanvasArea
                    components={components}
                    selectedComponent={selectedComponent}
                    deviceType={deviceType}
                    onSelectComponent={setSelectedComponent}
                    onUpdateComponent={handleUpdateComponent}
                    onDeleteComponent={handleDeleteComponent}
                    onMoveComponent={handleMoveComponent}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
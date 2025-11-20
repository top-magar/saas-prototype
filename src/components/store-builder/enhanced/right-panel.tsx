'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Type,
  Palette,
  Smartphone,
  Link,
  BarChart,
  Layers,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';
import { ContentPanel } from './panels/content-panel';
import { StylePanel } from './panels/style-panel';
import { ResponsivePanel } from './panels/responsive-panel';
import { LayersPanel } from './panels/layers-panel';

const rightPanelTabs = [
  { id: 'content', label: 'Content', icon: Type },
  { id: 'style', label: 'Style', icon: Palette },
  { id: 'responsive', label: 'Responsive', icon: Smartphone },
  { id: 'layers', label: 'Layers', icon: Layers }
];

export function RightPanel() {
  const {
    rightPanelTab,
    isRightPanelCollapsed,
    selectedComponentId,
    setRightPanelTab,
    toggleRightPanel
  } = useStoreBuilder();

  const renderPanelContent = () => {
    if (!selectedComponentId) {
      return (
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl flex items-center justify-center">
            <Settings className="h-8 w-8 opacity-50" />
          </div>
          <h3 className="font-medium mb-2">No Component Selected</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select a component from the canvas to edit its properties
          </p>
        </div>
      );
    }

    switch (rightPanelTab) {
      case 'content':
        return <ContentPanel />;
      case 'style':
        return <StylePanel />;
      case 'responsive':
        return <ResponsivePanel />;
      case 'layers':
        return <LayersPanel />;
      default:
        return <ContentPanel />;
    }
  };

  if (isRightPanelCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col shadow-sm">
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRightPanel}
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator />
        
        <div className="flex-1 flex flex-col gap-1 p-2">
          {rightPanelTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={rightPanelTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setRightPanelTab(tab.id);
                toggleRightPanel();
              }}
              className="w-8 h-8 p-0"
              title={tab.label}
            >
              <tab.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="h-12 border-b flex items-center justify-between px-4">
        <h2 className="font-semibold text-sm">
          {rightPanelTabs.find(tab => tab.id === rightPanelTab)?.label}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleRightPanel}
          className="w-8 h-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {rightPanelTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={rightPanelTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRightPanelTab(tab.id)}
              className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {renderPanelContent()}
      </ScrollArea>
    </div>
  );
}
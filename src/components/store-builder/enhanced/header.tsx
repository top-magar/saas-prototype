'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Save, 
  Eye, 
  Globe, 
  Smartphone, 
  Tablet, 
  Monitor,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';
import { DeviceType } from '@/lib/store-builder/types';
import { toast } from 'sonner';
import { KeyboardShortcuts } from './keyboard-shortcuts';

export function StoreBuilderHeader() {
  const {
    settings,
    deviceType,
    zoom,
    history,
    historyIndex,
    isSaving,
    isPublishing,
    setDeviceType,
    setZoom,
    undo,
    redo,
    save,
    publish
  } = useStoreBuilder();

  const handleSave = async () => {
    try {
      await save();
      toast.success('Store saved successfully!');
    } catch (error) {
      toast.error('Failed to save store');
    }
  };

  const handlePublish = async () => {
    try {
      await publish();
      toast.success('Store published successfully!');
    } catch (error) {
      toast.error('Failed to publish store');
    }
  };

  const handlePreview = () => {
    window.open('/store-builder/preview', '_blank', 'width=1200,height=800');
    toast.info('Opening store preview...');
  };

  const getDeviceIcon = (device: DeviceType) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <header className="h-16 border-b bg-gradient-to-r from-white to-gray-50/50 flex items-center justify-between px-6 shadow-sm backdrop-blur-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Dashboard / Store Builder /</div>
          <Input 
            value={settings.storeName}
            className="h-8 w-32 text-sm font-medium border-0 bg-transparent focus:bg-background focus:border"
            placeholder="Store Name"
          />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              Draft
            </Badge>
            <span className="text-xs text-muted-foreground">Auto-saved 2 min ago</span>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-3">
        {/* Device Selector */}
        <div className="flex items-center bg-muted/50 rounded-lg p-1">
          {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((device) => (
            <Button
              key={device}
              variant={deviceType === device ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType(device)}
              className="h-8 w-8 p-0"
            >
              {getDeviceIcon(device)}
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            disabled={zoom <= 25}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          
          <div className="relative">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              {zoom}%
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            disabled={zoom >= 200}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(100)}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* History Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <KeyboardShortcuts />
        <Button 
          variant="outline" 
          onClick={handleSave}
          disabled={isSaving}
          className="h-9"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>
        
        <Button variant="outline" onClick={handlePreview} className="h-9">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        
        <Button 
          onClick={handlePublish}
          disabled={isPublishing}
          className="h-9 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md transition-all duration-200"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Globe className="h-4 w-4 mr-2" />
          )}
          Publish
        </Button>
      </div>
    </header>
  );
}
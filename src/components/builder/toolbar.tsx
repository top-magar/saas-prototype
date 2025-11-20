'use client';

import { useBuilder } from '@/lib/builder/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Undo, Redo, Save, Eye, Globe, Smartphone, Tablet, Monitor,
  ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

export function Toolbar() {
  const { 
    undo, redo, historyIndex, history, device, setDevice, 
    zoom, setZoom, elements 
  } = useBuilder();

  const handleSave = () => {
    toast.success('Store saved successfully!');
  };

  const handlePublish = () => {
    toast.success('Store published successfully!');
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Store Builder</h1>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {(['desktop', 'tablet', 'mobile'] as const).map((deviceType) => (
            <Button
              key={deviceType}
              variant={device === deviceType ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDevice(deviceType)}
              className="h-8 w-8 p-0"
            >
              {getDeviceIcon(deviceType)}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(zoom - 25)}
            disabled={zoom <= 25}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Badge variant="outline">{zoom}%</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(zoom + 25)}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(100)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline">{elements.length} elements</Badge>
        
        <Button variant="outline" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        
        <Button onClick={handlePublish}>
          <Globe className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
}
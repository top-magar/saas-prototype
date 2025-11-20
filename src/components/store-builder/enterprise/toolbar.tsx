'use client';

import { useEnterpriseStore } from '@/lib/store-builder/enterprise-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Undo, Redo, Save, Eye, Globe, Smartphone, Tablet, Monitor,
  ZoomIn, ZoomOut, Grid3X3, Ruler, Copy, Clipboard, Trash2,
  Play, Square, RotateCcw, Download
} from 'lucide-react';
import { toast } from 'sonner';

export function EnterpriseToolbar() {
  const {
    undo, redo, historyIndex, history, device, setDevice, zoom, setZoom,
    grid, toggleGrid, rulers, toggleRulers, previewMode, setPreviewMode,
    editor, copyElements, pasteElements, deleteElement, performance
  } = useEnterpriseStore();

  const handleSave = async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Saving...',
        success: 'Saved successfully!',
        error: 'Failed to save'
      }
    );
  };

  const handlePublish = async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Publishing...',
        success: 'Published successfully!',
        error: 'Failed to publish'
      }
    );
  };

  const handleExport = () => {
    const data = JSON.stringify(editor.elements, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'store-design.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Design exported!');
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-16 border-b bg-gradient-to-r from-white to-gray-50/50 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-semibold">Enterprise Store Builder</h1>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0} className="h-8">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} className="h-8">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => editor.selectedElement && copyElements([editor.selectedElement])} disabled={!editor.selectedElement} className="h-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => pasteElements('body')} disabled={editor.clipboard.length === 0} className="h-8">
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => editor.selectedElement && deleteElement(editor.selectedElement)} disabled={!editor.selectedElement} className="h-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-muted/50 rounded-lg p-1">
          {(['desktop', 'tablet', 'mobile'] as const).map((deviceType) => (
            <Button key={deviceType} variant={device === deviceType ? 'default' : 'ghost'} size="sm" onClick={() => setDevice(deviceType)} className="h-8 w-8 p-0">
              {getDeviceIcon(deviceType)}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => setZoom(zoom - 25)} disabled={zoom <= 25} className="h-8 w-8 p-0">
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Badge variant="outline" className="text-xs px-2">{zoom}%</Badge>
          <Button variant="outline" size="sm" onClick={() => setZoom(zoom + 25)} disabled={zoom >= 200} className="h-8 w-8 p-0">
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(100)} className="h-8 w-8 p-0">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant={grid.enabled ? 'default' : 'outline'} size="sm" onClick={toggleGrid} className="h-8 w-8 p-0">
            <Grid3X3 className="h-3 w-3" />
          </Button>
          <Button variant={rulers ? 'default' : 'outline'} size="sm" onClick={toggleRulers} className="h-8 w-8 p-0">
            <Ruler className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">{performance.elementCount} elements</Badge>
          <Badge variant="outline" className="text-xs">{performance.renderTime}ms</Badge>
        </div>

        <Button variant="outline" onClick={handleExport} className="h-9">
          <Download className="h-4 w-4 mr-2" />Export
        </Button>
        <Button variant="outline" onClick={handleSave} className="h-9">
          <Save className="h-4 w-4 mr-2" />Save
        </Button>
        <Button variant="outline" onClick={() => setPreviewMode(!previewMode)} className="h-9">
          {previewMode ? <Square className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {previewMode ? 'Edit' : 'Preview'}
        </Button>
        <Button onClick={handlePublish} className="h-9 bg-gradient-to-r from-primary to-primary/90">
          <Globe className="h-4 w-4 mr-2" />Publish
        </Button>
      </div>
    </div>
  );
}
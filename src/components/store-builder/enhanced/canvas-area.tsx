'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Ruler,
  Grid3X3,
  MousePointer2,
  Move,
  RotateCcw,
  Maximize2,
  Eye,
  Layers,
  Settings,
  Copy,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useStoreBuilder } from '@/lib/store-builder/store';
import { PageRenderer } from '../page-renderer';

export function CanvasArea() {
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [canvasMode, setCanvasMode] = useState<'select' | 'move'>('select');

  const {
    pages,
    currentPageId,
    selectedComponentId,
    deviceType,
    zoom,
    setSelectedComponent,
    setZoom
  } = useStoreBuilder();

  const currentPage = pages.find(p => p.id === currentPageId);

  const handleCanvasClick = useCallback(() => {
    setSelectedComponent(null);
  }, [setSelectedComponent]);

  const getDeviceWidth = () => {
    switch (deviceType) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      default: return 1200;
    }
  };

  const canvasScale = zoom / 100;
  const deviceWidth = getDeviceWidth();

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold mb-2">No Page Selected</h3>
          <p className="text-muted-foreground">Select a page to start building</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
      {/* Canvas Toolbar */}
      <div className="h-12 border-b bg-gradient-to-r from-white to-gray-50/50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Badge variant="outline" className="text-xs font-medium bg-white">
              {currentPage.name}
            </Badge>
          </div>
          <div className="h-4 w-px bg-gray-200"></div>
          <span className="text-xs text-muted-foreground">
            {currentPage.components.length} components
          </span>
          <span className="text-xs text-muted-foreground">
            • {deviceWidth}px
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={canvasMode === 'select' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            title="Select Tool"
            onClick={() => setCanvasMode('select')}
          >
            <MousePointer2 className="h-3 w-3" />
          </Button>
          <Button
            variant={canvasMode === 'move' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            title="Move Tool"
            onClick={() => setCanvasMode('move')}
          >
            <Move className="h-3 w-3" />
          </Button>
          <div className="h-4 w-px bg-gray-200 mx-1"></div>
          <Button
            variant={showRulers ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            title="Toggle Rulers"
            onClick={() => setShowRulers(!showRulers)}
          >
            <Ruler className="h-3 w-3" />
          </Button>
          <Button
            variant={showGrid ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            title="Toggle Grid"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Fit to Screen"
            onClick={() => setZoom(100)}
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <div className="h-4 w-px bg-gray-200 mx-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Canvas Options">
                <Settings className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowGrid(!showGrid)}>
                <Grid3X3 className="h-4 w-4 mr-2" />
                {showGrid ? 'Hide' : 'Show'} Grid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowRulers(!showRulers)}>
                <Ruler className="h-4 w-4 mr-2" />
                {showRulers ? 'Hide' : 'Show'} Rulers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto relative" style={{ height: 'calc(100vh - 16rem)' }}>
        {/* Rulers */}
        {showRulers && (
          <>
            <div className="absolute top-0 left-0 right-0 h-6 bg-white border-b flex items-end text-xs text-gray-500 z-10">
              {Array.from({ length: Math.ceil(deviceWidth / 50) }, (_, i) => (
                <div key={i} className="flex-shrink-0 w-12 text-center border-r border-gray-200 last:border-r-0">
                  {i * 50}
                </div>
              ))}
            </div>
            <div className="absolute top-6 left-0 bottom-0 w-6 bg-white border-r flex flex-col justify-start text-xs text-gray-500 z-10">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="flex-shrink-0 h-12 flex items-center justify-center border-b border-gray-200 last:border-b-0">
                  {i * 50}
                </div>
              ))}
            </div>
          </>
        )}

        <div
          className={`flex justify-center min-h-full bg-gradient-to-b from-gray-50/50 to-white ${showRulers ? 'pt-6 pl-6' : 'p-6'
            }`}
          style={{
            backgroundImage: showGrid ?
              'radial-gradient(circle, #e5e7eb 1px, transparent 1px)' : 'none',
            backgroundSize: showGrid ? '20px 20px' : 'auto'
          }}
        >
          {currentPage.components.length === 0 ? (
            <div
              className="bg-white rounded-xl shadow-xl border-2 border-dashed border-gray-200 flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:shadow-2xl relative group"
              style={{
                width: deviceWidth * canvasScale,
                height: 600 * canvasScale,
                transform: `scale(${canvasScale})`,
                transformOrigin: 'top center'
              }}
              onClick={handleCanvasClick}
            >
              {/* Device Frame Indicator */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="text-xs">
                  {deviceType} - {deviceWidth}px
                </Badge>
              </div>

              <div className="text-center p-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Plus className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Start Building Your Store</h3>
                <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                  Drag components from the left panel or click the + button to add your first component
                </p>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    💡 Start with Header Navigation
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    🎨 Then add a Hero Banner
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative group">
              {/* Device Frame Indicator */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                <Badge variant="secondary" className="text-xs">
                  {deviceType} - {deviceWidth}px
                </Badge>
              </div>

              {/* Component Count Indicator */}
              <div className="absolute -top-8 right-0 z-10">
                <Badge variant="outline" className="text-xs bg-white">
                  <Layers className="h-3 w-3 mr-1" />
                  {currentPage.components.length}
                </Badge>
              </div>

              <div
                className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 relative"
                style={{
                  width: deviceWidth * canvasScale,
                  minHeight: 600 * canvasScale,
                  transform: `scale(${canvasScale})`,
                  transformOrigin: 'top center'
                }}
                onClick={handleCanvasClick}
              >
                {/* Canvas Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" className="h-6 w-6 p-0" title="Preview">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-6 w-6 p-0" title="Copy Page">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <PageRenderer
                  components={currentPage.components as any}
                  deviceType={deviceType}
                  selectedComponentId={selectedComponentId}
                  onSelectComponent={setSelectedComponent}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Status Bar */}
      <div className="h-10 border-t bg-gradient-to-r from-white to-gray-50/50 flex items-center justify-between px-4 text-xs shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium">Zoom: {zoom}%</span>
          </div>
          <div className="h-3 w-px bg-gray-300"></div>
          <span className="text-muted-foreground">Device: {deviceWidth}px</span>
          <div className="h-3 w-px bg-gray-300"></div>
          <span className="text-muted-foreground">Components: {currentPage.components.length}</span>
          {showGrid && (
            <>
              <div className="h-3 w-px bg-gray-300"></div>
              <Badge variant="outline" className="text-xs h-5">
                <Grid3X3 className="h-2 w-2 mr-1" />
                Grid
              </Badge>
            </>
          )}
          {showRulers && (
            <>
              <div className="h-3 w-px bg-gray-300"></div>
              <Badge variant="outline" className="text-xs h-5">
                <Ruler className="h-2 w-2 mr-1" />
                Rulers
              </Badge>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedComponentId && (
            <Badge variant="default" className="text-xs h-6 bg-blue-600">
              <MousePointer2 className="h-2 w-2 mr-1" />
              {selectedComponentId.split('-')[0]}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs h-6">
            Mode: {canvasMode}
          </Badge>
        </div>
      </div>
    </div>
  );
}
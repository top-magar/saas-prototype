'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoreHorizontal,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';

export function LayersPanel() {
  const {
    pages,
    currentPageId,
    selectedComponentId,
    setSelectedComponent
  } = useStoreBuilder();

  const currentPage = pages.find(p => p.id === currentPageId);

  if (!currentPage) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No page selected</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Page Info */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-xs">
          {currentPage.name}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {currentPage.components.length} components
        </span>
      </div>

      {/* Components Tree */}
      <div className="space-y-1">
        {currentPage.components.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No components on this page</p>
          </div>
        ) : (
          currentPage.components.map((component, index) => (
            <div
              key={component.id}
              className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedComponentId === component.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedComponent(component.id)}
            >
              {/* Expand/Collapse (for future nested components) */}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 opacity-50"
                disabled
              >
                <ChevronRight className="h-3 w-3" />
              </Button>

              {/* Component Info */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${
                  selectedComponentId === component.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {component.type}
                </div>
                <div className="text-xs text-muted-foreground">
                  Layer {index + 1}
                </div>
              </div>

              {/* Layer Controls */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  title="Toggle visibility"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  title="Lock/unlock"
                >
                  <Unlock className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  title="More options"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Layer Actions */}
      {currentPage.components.length > 0 && (
        <>
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Layer Actions</h4>
            
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start h-8">
                Duplicate Layer
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start h-8">
                Group Layers
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start h-8 text-destructive hover:text-destructive">
                Delete Layer
              </Button>
            </div>
          </div>

          {/* Layer Info */}
          {selectedComponentId && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Layer Properties</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{currentPage.components.find(c => c.id === selectedComponentId)?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visible:</span>
                  <span>Yes</span>
                </div>
                <div className="flex justify-between">
                  <span>Locked:</span>
                  <span>No</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
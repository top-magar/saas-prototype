'use client';

import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  Edit,
  Copy,
  MoveUp,
  MoveDown,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { PageRenderer, PageComponent } from './page-renderer';
import { DraggableComponent } from './draggable-component';
import type { DeviceType } from './store-builder';

interface CanvasAreaProps {
  components: PageComponent[];
  selectedComponent: string | null;
  deviceType: DeviceType;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: Partial<PageComponent>) => void;
  onDeleteComponent: (id: string) => void;
  onMoveComponent: (dragIndex: number, hoverIndex: number) => void;
}

export function CanvasArea({
  components,
  selectedComponent,
  deviceType,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onMoveComponent
}: CanvasAreaProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: () => ({ type: 'canvas' }),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const handleComponentClick = useCallback((e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    onSelectComponent(componentId);
  }, [onSelectComponent]);

  const handleCanvasClick = useCallback(() => {
    onSelectComponent(null);
  }, [onSelectComponent]);

  const handleDuplicateComponent = useCallback((component: PageComponent) => {
    const duplicated: PageComponent = {
      ...component,
      id: `${component.id}-copy-${Date.now()}`
    };
    // Add after the original component
    const index = components.findIndex(c => c.id === component.id);
    const newComponents = [...components];
    newComponents.splice(index + 1, 0, duplicated);
    // This would need to be handled by parent component
  }, [components]);

  const handleMoveUp = useCallback((componentId: string) => {
    const index = components.findIndex(c => c.id === componentId);
    if (index > 0) {
      onMoveComponent(index, index - 1);
    }
  }, [components, onMoveComponent]);

  const handleMoveDown = useCallback((componentId: string) => {
    const index = components.findIndex(c => c.id === componentId);
    if (index < components.length - 1) {
      onMoveComponent(index, index + 1);
    }
  }, [components, onMoveComponent]);

  const handleToggleVisibility = useCallback((componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      onUpdateComponent(componentId, {
        styles: {
          ...component.styles,
          base: {
            ...component.styles.base,
            display: component.styles.base?.display === 'none' ? 'block' : 'none'
          }
        }
      });
    }
  }, [components, onUpdateComponent]);

  if (components.length === 0) {
    return (
      <div
        ref={drop as any}
        className={`min-h-screen flex items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-300 ${isOver
          ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 scale-[1.02]'
          : 'border-muted-foreground/20 hover:border-muted-foreground/40'
          }`}
        onClick={handleCanvasClick}
      >
        <div className="text-center p-12 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center">
            <div className="text-4xl">🎨</div>
          </div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Start Building Your Store
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Drag components from the sidebar to start creating your amazing store experience
          </p>
          <Badge variant="outline" className="bg-muted/50 border-primary/20 text-primary">
            💡 Tip: Try adding a Header Navigation first
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={drop as any}
      className={`min-h-screen transition-colors ${isOver ? 'bg-primary/5' : ''
        }`}
      onClick={handleCanvasClick}
    >
      {components.map((component, index) => (
        <DraggableComponent
          key={component.id}
          component={component}
          index={index}
          isSelected={selectedComponent === component.id}
          onMove={onMoveComponent}
          onClick={(e) => handleComponentClick(e, component.id)}
        >
          <div className="relative group">
            {/* Component Overlay */}
            {selectedComponent === component.id && (
              <div className="absolute inset-0 border-2 border-primary bg-primary/5 pointer-events-none z-10" />
            )}

            {/* Component Controls */}
            <div className={`absolute top-3 right-3 z-20 flex gap-1 transition-all duration-200 ${selectedComponent === component.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
              }`}>
              <div className="flex items-center gap-1 bg-background/95 backdrop-blur-sm border rounded-lg p-1 shadow-lg">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveUp(component.id);
                  }}
                  disabled={index === 0}
                >
                  <MoveUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveDown(component.id);
                  }}
                  disabled={index === components.length - 1}
                >
                  <MoveDown className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleVisibility(component.id);
                  }}
                >
                  {component.styles.base?.display === 'none' ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateComponent(component);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteComponent(component.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Component Label */}
            {selectedComponent === component.id && (
              <div className="absolute top-3 left-3 z-20">
                <Badge variant="default" className="text-xs bg-primary/90 backdrop-blur-sm shadow-sm">
                  {component.type}
                </Badge>
              </div>
            )}

            {/* Drag Handle */}
            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-20 transition-all duration-200 ${selectedComponent === component.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
              }`}>
              <div className="bg-primary/90 text-primary-foreground p-1.5 rounded-lg cursor-move shadow-lg backdrop-blur-sm hover:bg-primary transition-colors">
                <GripVertical className="h-3 w-3" />
              </div>
            </div>

            {/* Render Component */}
            <PageRenderer
              components={[component]}
              deviceType={deviceType}
              isPreview={false}
            />
          </div>
        </DraggableComponent>
      ))}

      {/* Drop Zone at Bottom */}
      <div className={`h-16 border-2 border-dashed rounded-xl mx-4 mb-4 transition-all duration-300 ${isOver
        ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 scale-[1.02]'
        : 'border-transparent hover:border-muted-foreground/20'
        } flex items-center justify-center`}>
        {isOver && (
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            Drop component here
          </Badge>
        )}
      </div>
    </div>
  );
}
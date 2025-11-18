'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { useTenant } from '@/lib/tenant-context';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layout, 
  Type, 
  Image, 
  ShoppingCart, 
  Star, 
  Grid3X3, 
  GripVertical,
  Eye,
  Save,
  Smartphone,
  Monitor,
  Tablet,
  Trash2,
  Settings,
  Copy,
  Plus,
  Store
} from 'lucide-react';

interface ComponentData {
  id: string;
  type: 'navigation' | 'hero' | 'products' | 'text' | 'image' | 'testimonials' | 'cta' | 'footer';
  title: string;
  props: {
    text?: string;
    heading?: string;
    subheading?: string;
    buttonText?: string;
    imageUrl?: string;
    links?: Array<{ text: string; url: string }>;
  };
  styles: {
    base: {
      backgroundColor?: string;
      color?: string;
      textAlign?: 'left' | 'center' | 'right';
    };
  };
  children: ComponentData[];
}

const COMPONENT_TYPES = [
  { id: 'navigation', type: 'navigation', title: 'Navigation', icon: Layout, category: 'Layout' },
  { id: 'hero', type: 'hero', title: 'Hero Section', icon: Layout, category: 'Content' },
  { id: 'text', type: 'text', title: 'Text Block', icon: Type, category: 'Content' },
  { id: 'image', type: 'image', title: 'Image', icon: Image, category: 'Media' },
  { id: 'products', type: 'products', title: 'Product Grid', icon: Grid3X3, category: 'E-commerce' },
  { id: 'testimonials', type: 'testimonials', title: 'Testimonials', icon: Star, category: 'Social' },
  { id: 'cta', type: 'cta', title: 'Call to Action', icon: ShoppingCart, category: 'Marketing' },
  { id: 'footer', type: 'footer', title: 'Footer', icon: Layout, category: 'Layout' },
] as const;

// Sanitization functions moved outside component to prevent recreation
const sanitizeText = (text: string) => {
  if (!text) return '';
  return text.replace(/[<>"'&]/g, (match) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[match] || match;
  }    
  );
};

const sanitizeStyle = (value: string) => {
  if (!value) return '';
  // Only allow valid CSS color values
  const colorRegex = /^(#[0-9a-fA-F]{3,6}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[01]?\.?\d*\)|[a-zA-Z]+)$/;
  return colorRegex.test(value.trim()) ? value.trim() : '';
};

const sanitizeUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return '';
};

function DraggableComponent({ component, isSelected, onSelect, onDelete, onDuplicate }: { 
  component: ComponentData; 
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id }    
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Memoize the rendered component to prevent unnecessary re-renders
  const renderComponent = useMemo(() => {
    const { props, styles } = component;
    const baseStyles = styles?.base || {};
    
    switch (component.type) {
      case 'navigation':
        return (
    
          <div className="bg-white border-b shadow-sm p-4" style={{ backgroundColor: baseStyles.backgroundColor || '#ffffff' }}>
            <div className="flex items-center justify-between">
              <div className="font-bold text-xl" style={{ color: sanitizeStyle(baseStyles.color || '') || '#000000' }}>
                {sanitizeText(props?.heading || 'Store Logo')}
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                {(props?.links || [{ text: 'Home', url: '#' }, { text: 'Products', url: '#' }]).map((link, i) => (
                  <span key={i} className="hover:opacity-75 cursor-pointer" style={{ color: sanitizeStyle(baseStyles.color || '#666666') }}>
                    {sanitizeText(link.text)}
                  </span>
                ))}
              </nav>
              <Button size="sm">{sanitizeText(props?.buttonText || 'Sign Up')}</Button>
            </div>
          </div>
            
  );
      
      case 'hero':
        return (
    
          <div 
            className="p-12 rounded-lg text-center"
            style={{ 
              backgroundColor: baseStyles.backgroundColor || '#3b82f6',
              color: baseStyles.color || '#ffffff',
              textAlign: baseStyles.textAlign || 'center'
            }}
          >
            <h1 className="text-4xl font-bold mb-4">{sanitizeText(props?.heading || 'Welcome to Our Store')}</h1>
            <p className="text-xl mb-8">{sanitizeText(props?.subheading || 'Discover amazing products at great prices')}</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              {sanitizeText(props?.buttonText || 'Shop Now')}
            </Button>
          </div>
            
  );
      
      case 'text':
        return (
    
          <div 
            className="prose max-w-none p-6"
            style={{ 
              backgroundColor: baseStyles.backgroundColor || 'transparent',
              textAlign: baseStyles.textAlign || 'left'
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: sanitizeStyle(baseStyles.color || '#000000') }}>
              {sanitizeText(props?.heading || 'About Our Store')}
            </h2>
            <p style={{ color: sanitizeStyle(baseStyles.color || '#666666') }}>
              {sanitizeText(props?.text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')}
            </p>
          </div>
            
  );
      
      case 'image':
        return (
    
          <div className="p-4">
            {props?.imageUrl ? (
              <img src={sanitizeUrl(props.imageUrl)} alt="" className="w-full h-64 object-cover rounded-lg" />
            ) : (
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
            
  );
      
      case 'products':
        return (
    
          <div className="p-6" style={{ backgroundColor: baseStyles.backgroundColor || 'transparent' }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: sanitizeStyle(baseStyles.color || '#000000') }}>
              {sanitizeText(props?.heading || 'Featured Products')}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 bg-white">
                  <div className="bg-gray-200 h-32 rounded mb-2"></div>
                  <h3 className="font-semibold">Product {i}</h3>
                  <p className="text-sm text-gray-600">$99.99</p>
                </div>
              ))}
            </div>
          </div>
            
  );
      
      case 'testimonials':
        return (
    
          <div className="p-6" style={{ backgroundColor: baseStyles.backgroundColor || '#f9fafb' }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: sanitizeStyle(baseStyles.color || '#000000') }}>
              {sanitizeText(props?.heading || 'What Our Customers Say')}
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic mb-4">&quot;{sanitizeText(props?.text || 'Amazing products and great service!')}&quot;</p>
              <p className="font-semibold">- Happy Customer</p>
            </div>
          </div>
            
  );
      
      case 'cta':
        return (
    
          <div 
            className="p-12 rounded-lg text-center"
            style={{ 
              backgroundColor: baseStyles.backgroundColor || '#10b981',
              color: baseStyles.color || '#ffffff'
            }}
          >
            <h2 className="text-3xl font-bold mb-4">{sanitizeText(props?.heading || 'Ready to Get Started?')}</h2>
            <p className="text-lg mb-6">{sanitizeText(props?.subheading || 'Join thousands of satisfied customers')}</p>
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              {sanitizeText(props?.buttonText || 'Get Started Today')}
            </Button>
          </div>
            
  );
      
      case 'footer':
        return (
    
          <div className="bg-gray-900 text-white p-8" style={{ backgroundColor: baseStyles.backgroundColor || '#111827' }}>
            <div className="grid grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">{sanitizeText(props?.heading || 'Company')}</h3>
                <div className="space-y-2">
                  {(props?.links || [{ text: 'About', url: '#' }, { text: 'Contact', url: '#' }]).slice(0, 3).map((link, i) => (
                    <span key={i} className="block hover:opacity-75 cursor-pointer" style={{ color: sanitizeStyle(baseStyles.color || '#d1d5db') }}>
                      {sanitizeText(link.text)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
            
  );
      
      default:
        return <div className="p-4 border rounded">Component Preview</div>;
    }
  }, [component]); // Only re-render when component data changes

  return (
    
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(component.id)}
      {...attributes}
    >
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 bg-white shadow-lg rounded-md p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDuplicate(component.id); }}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(component.id); }}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="border-2 border-transparent hover:border-blue-200 transition-colors">
        {renderComponent}
      </div>
    </div>
      
  );
}

function ComponentLibrary({ onAddComponent }: { onAddComponent: (type: ComponentData['type']) => void }) {
  const categories = Array.from(new Set(COMPONENT_TYPES.map(c => c.category))    
  );

  return (
    
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Components
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Layout">Layout</TabsTrigger>
            <TabsTrigger value="Content">Content</TabsTrigger>
          </TabsList>
          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-2 mt-4">
              {COMPONENT_TYPES.filter(c => c.category === category).map((componentType) => {
                const Icon = componentType.icon;
                return (
    
                  <Button
                    key={componentType.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onAddComponent(componentType.type)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {componentType.title}
                  </Button>
                    
  );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
      
  );
}

function PropertyPanel({ selectedComponent, onUpdateComponent }: { 
  selectedComponent: ComponentData | null;
  onUpdateComponent: (id: string, updates: Partial<ComponentData>) => void;
}) {
  if (!selectedComponent) {
    return (
    
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a component to edit its properties
          </p>
        </CardContent>
      </Card>
        
  );
  }

  const { props, styles } = selectedComponent;

  return (
    
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {selectedComponent.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input
            value={props?.heading || ''}
            onChange={(e) => onUpdateComponent(selectedComponent.id, { props: { ...props, heading: e.target.value } })}
            placeholder="Enter heading"
          />
        </div>

        {selectedComponent.type !== 'image' && (
          <div className="space-y-2">
            <Label>Text</Label>
            <Textarea
              value={props?.text || props?.subheading || ''}
              onChange={(e) => onUpdateComponent(selectedComponent.id, { 
                props: { ...props, text: e.target.value, subheading: e.target.value }
              })}
              placeholder="Enter text content"
              rows={3}
            />
          </div>
        )}

        {(selectedComponent.type === 'hero' || selectedComponent.type === 'cta') && (
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={props?.buttonText || ''}
              onChange={(e) => onUpdateComponent(selectedComponent.id, { props: { ...props, buttonText: e.target.value } })}
              placeholder="Enter button text"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Background Color</Label>
          <Input
            type="color"
            value={styles?.base?.backgroundColor || '#ffffff'}
            onChange={(e) => onUpdateComponent(selectedComponent.id, { 
              styles: { ...styles, base: { ...styles?.base, backgroundColor: e.target.value } }
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Text Color</Label>
          <Input
            type="color"
            value={styles?.base?.color || '#000000'}
            onChange={(e) => onUpdateComponent(selectedComponent.id, { 
              styles: { ...styles, base: { ...styles?.base, color: e.target.value } }
            })}
          />
        </div>

        {selectedComponent.type === 'text' && (
          <div className="space-y-2">
            <Label>Alignment</Label>
            <Select
              value={styles?.base?.textAlign || 'left'}
              onValueChange={(value) => onUpdateComponent(selectedComponent.id, { 
                styles: { ...styles, base: { ...styles?.base, textAlign: value as 'left' | 'center' | 'right' } }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedComponent.type === 'image' && (
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={props?.imageUrl || ''}
              onChange={(e) => onUpdateComponent(selectedComponent.id, { props: { ...props, imageUrl: e.target.value } })}
              placeholder="Enter image URL"
            />
          </div>
        )}
      </CardContent>
    </Card>
      
  );
}

export default function StoreBuilderPage() {
  const [components, setComponents] = useState<ComponentData[]>([]    
  );
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null    
  );
  const [activeId, setActiveId] = useState<string | null>(null    
  );
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop'    
  );
  const [currentPage, setCurrentPage] = useState<{ id?: string; pageName?: string; pageSlug?: string } | null>(null    
  );
  const [stores, setStores] = useState<{ id: string; storeName: string; pages: unknown[] }[]>([]    
  );
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null    
  );
  const [isLoading, setIsLoading] = useState(false    
  );
  
  const { tenant } = useTenant(    
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
      
  );

  // Load stores and pages
  useEffect(() => {
    if (tenant?.id) {
      loadStores(    
  );
    }
  }, [tenant?.id]    
  );

  const loadStores = async () => {
    // Using demo data for now
    setStores([{
      id: 'demo-store',
      storeName: 'Demo Store',
      pages: []
    }]);
    setSelectedStoreId('demo-store');
  };

  const savePage = async () => {
    console.log('Page saved (demo mode)');
  };

  const selectedComponent = components.find(c => c.id === selectedComponentId) || null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string    
  );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id    
  );
        const newIndex = items.findIndex((item) => item.id === over?.id    
  );
        return arrayMove(items, oldIndex, newIndex    
  );
      }    
  );
    }

    setActiveId(null    
  );
  };

  const addComponent = useCallback((type: ComponentData['type']) => {
    const newComponent: ComponentData = {
      id: `${type}-${Date.now()}`,
      type,
      title: COMPONENT_TYPES.find(c => c.type === type)?.title || 'Component',
      props: {},
      styles: { base: {} },
      children: [],
    };
    setComponents(prev => [...prev, newComponent]    
  );
    setSelectedComponentId(newComponent.id    
  );
  }, []    
  );

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id)    
  );
    if (selectedComponentId === id) {
      setSelectedComponentId(null    
  );
    }
  }, [selectedComponentId]    
  );

  const duplicateComponent = useCallback((id: string) => {
    try {
      const component = components.find(c => c.id === id    
  );
      if (component) {
        const newComponent: ComponentData = {
          ...component,
          id: `${component.type}-${Date.now()}`,
        };
        setComponents(prev => {
          const index = prev.findIndex(c => c.id === id    
  );
          return [...prev.slice(0, index + 1), newComponent, ...prev.slice(index + 1)];
        }    
  );
      }
    } catch (error) {
      console.error('[COMPONENT_DUPLICATE_ERROR]', error    
  );
      alert('Failed to duplicate component. Please try again.'    
  );
    }
  }, [components]    
  );

  const updateComponent = useCallback((id: string, updates: Partial<ComponentData>) => {
    try {
      setComponents(prev => prev.map(c => 
        c.id === id 
          ? { ...c, ...updates }
          : c
      )    
  );
    } catch (error) {
      console.error('[COMPONENT_UPDATE_ERROR]', error    
  );
      alert('Failed to update component. Please try again.'    
  );
    }
  }, []    
  );

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-full';
    }
  };

  const activeComponent = components.find(c => c.id === activeId    
  );

  return (
    
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-6 w-px bg-border" />
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={savePage} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <ComponentLibrary onAddComponent={addComponent} />
        </div>

        <div className="col-span-7">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Canvas</CardTitle>
                <Badge variant="secondary">{components.length} components</Badge>
              </div>
            </CardHeader>
            <CardContent className="h-full overflow-auto">
              <div className={`mx-auto transition-all duration-300 ${getPreviewWidth()}`}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={components} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                      {components.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                          <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">Start Building</h3>
                          <p className="text-gray-500">Add components from the left panel to start building your store</p>
                        </div>
                      ) : (
                        components.map((component) => (
                          <DraggableComponent
                            key={component.id}
                            component={component}
                            isSelected={selectedComponentId === component.id}
                            onSelect={setSelectedComponentId}
                            onDelete={deleteComponent}
                            onDuplicate={duplicateComponent}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeComponent ? (
                      <div className="opacity-75">
                        <DraggableComponent
                          component={activeComponent}
                          isSelected={false}
                          onSelect={() => {}}
                          onDelete={() => {}}
                          onDuplicate={() => {}}
                        />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <PropertyPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={updateComponent}
          />
        </div>
      </div>
    </div>
      
  );
}
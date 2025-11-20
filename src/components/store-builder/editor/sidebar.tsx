'use client';

import { Button } from '@/components/ui/button';
import { Type, Square, Image, Video, Mail, Columns } from 'lucide-react';

const components = [
  { type: 'header-nav', name: 'Header Navigation', icon: Square, description: 'Navigation bar with logo and menu' },
  { type: 'hero-banner', name: 'Hero Banner', icon: Image, description: 'Eye-catching hero section' },
  { type: 'text-section', name: 'Text Section', icon: Type, description: 'Rich text content area' },
  { type: 'product-grid', name: 'Product Grid', icon: Square, description: 'Grid layout for products' },
  { type: 'footer', name: 'Footer', icon: Square, description: 'Footer section' },
  { type: 'container', name: 'Container', icon: Square, description: 'A flexible container' },
  { type: 'two-column', name: 'Two Column', icon: Columns, description: 'Two column layout' }
];

export function EditorSidebar() {
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  return (
    <div className="w-80 border-r bg-white p-4">
      <h3 className="font-medium mb-4">Components</h3>
      <div className="space-y-2">
        {components.map((component) => (
          <div
            key={component.type}
            draggable
            onDragStart={(e) => handleDragStart(e, component.type)}
            className="p-3 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <component.icon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{component.name}</h4>
                <p className="text-xs text-gray-500">{component.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
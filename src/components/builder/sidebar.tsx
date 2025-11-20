'use client';

import { Button } from '@/components/ui/button';
import { Navigation, Zap, Type, Package, Mail } from 'lucide-react';

const components = [
  { type: 'header', name: 'Header', icon: Navigation, description: 'Navigation bar' },
  { type: 'hero', name: 'Hero Section', icon: Zap, description: 'Hero banner' },
  { type: 'text', name: 'Text Block', icon: Type, description: 'Text content' },
  { type: 'products', name: 'Product Grid', icon: Package, description: 'Product showcase' },
  { type: 'footer', name: 'Footer', icon: Mail, description: 'Footer section' }
];

export function Sidebar() {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('type', type);
  };

  return (
    <div className="w-80 bg-white border-r p-4">
      <h2 className="font-semibold mb-4">Components</h2>
      <div className="space-y-2">
        {components.map(component => (
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
                <h3 className="font-medium text-sm">{component.name}</h3>
                <p className="text-xs text-gray-500">{component.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
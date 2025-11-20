'use client';

import { useEditorStore } from '@/lib/store-builder/editor-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function PropertiesPanel() {
  const { editor, updateElement } = useEditorStore();
  
  const findElement = (elements: any[], id: string): any => {
    for (const element of elements) {
      if (element.id === id) return element;
      if (Array.isArray(element.content)) {
        const found = findElement(element.content, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = editor.selectedElement ? 
    findElement(editor.elements, editor.selectedElement) : null;

  if (!selectedElement) {
    return (
      <div className="w-80 border-l bg-white p-4">
        <h3 className="font-medium mb-4">Properties</h3>
        <p className="text-sm text-gray-500">Select an element to edit properties</p>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    updateElement(selectedElement.id, { content: { ...selectedElement.content, ...updates } });
  };

  const renderProperties = () => {
    switch (selectedElement.type) {
      case 'header-nav':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Brand Name</Label>
              <Input
                value={selectedElement.content.heading || ''}
                onChange={(e) => handleUpdate({ heading: e.target.value })}
                placeholder="Your Store"
              />
            </div>
            <div>
              <Label className="text-sm">Button Text</Label>
              <Input
                value={selectedElement.content.buttonText || ''}
                onChange={(e) => handleUpdate({ buttonText: e.target.value })}
                placeholder="Shop Now"
              />
            </div>
          </div>
        );
      
      case 'hero-banner':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Heading</Label>
              <Input
                value={selectedElement.content.heading || ''}
                onChange={(e) => handleUpdate({ heading: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm">Subheading</Label>
              <Textarea
                value={selectedElement.content.subheading || ''}
                onChange={(e) => handleUpdate({ subheading: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label className="text-sm">Button Text</Label>
              <Input
                value={selectedElement.content.buttonText || ''}
                onChange={(e) => handleUpdate({ buttonText: e.target.value })}
              />
            </div>
          </div>
        );
      
      case 'text-section':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Heading</Label>
              <Input
                value={selectedElement.content.heading || ''}
                onChange={(e) => handleUpdate({ heading: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm">Content</Label>
              <Textarea
                value={selectedElement.content.text || ''}
                onChange={(e) => handleUpdate({ text: e.target.value })}
                rows={6}
              />
            </div>
            <div>
              <Label className="text-sm">Alignment</Label>
              <Select
                value={selectedElement.content.alignment || 'left'}
                onValueChange={(value) => handleUpdate({ alignment: value })}
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
          </div>
        );
      
      case 'product-grid':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Title</Label>
              <Input
                value={selectedElement.content.title || ''}
                onChange={(e) => handleUpdate({ title: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm">Columns</Label>
              <Select
                value={selectedElement.content.columns?.toString() || '3'}
                onValueChange={(value) => handleUpdate({ columns: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show Prices</Label>
              <Switch
                checked={selectedElement.content.showPrices || false}
                onCheckedChange={(checked) => handleUpdate({ showPrices: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show Cart Button</Label>
              <Switch
                checked={selectedElement.content.showCartButton || false}
                onCheckedChange={(checked) => handleUpdate({ showCartButton: checked })}
              />
            </div>
          </div>
        );
      
      case 'footer':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Copyright Text</Label>
              <Input
                value={selectedElement.content.copyrightText || ''}
                onChange={(e) => handleUpdate({ copyrightText: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show Social Links</Label>
              <Switch
                checked={selectedElement.content.showSocialLinks || false}
                onCheckedChange={(checked) => handleUpdate({ showSocialLinks: checked })}
              />
            </div>
          </div>
        );
      
      default:
        return <p className="text-sm text-gray-500">No properties available</p>;
    }
  };

  return (
    <div className="w-80 border-l bg-white p-4">
      <h3 className="font-medium mb-4">Properties</h3>
      <div className="mb-4">
        <Label className="text-xs text-gray-500">Selected: {selectedElement.type}</Label>
      </div>
      {renderProperties()}
    </div>
  );
}
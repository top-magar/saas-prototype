'use client';

import { useBuilder } from '@/lib/builder/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function Properties() {
  const { elements, selected, updateElement, deleteElement } = useBuilder();
  
  const findElement = (elements: any[], id: string): any => {
    for (const element of elements) {
      if (element.id === id) return element;
      const found = findElement(element.children, id);
      if (found) return found;
    }
    return null;
  };

  const selectedElement = selected ? findElement(elements, selected) : null;

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l p-4">
        <h3 className="font-semibold mb-4">Properties</h3>
        <p className="text-sm text-gray-500">Select an element to edit</p>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    updateElement(selectedElement.id, { props: { ...selectedElement.props, ...updates } });
  };

  const renderProperties = () => {
    switch (selectedElement.type) {
      case 'header':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={selectedElement.props.title || ''}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                placeholder="Your Store"
              />
            </div>
          </div>
        );
      
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={selectedElement.props.title || ''}
                onChange={(e) => handleUpdate({ title: e.target.value })}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={selectedElement.props.subtitle || ''}
                onChange={(e) => handleUpdate({ subtitle: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={selectedElement.props.buttonText || ''}
                onChange={(e) => handleUpdate({ buttonText: e.target.value })}
              />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label>Heading</Label>
              <Input
                value={selectedElement.props.heading || ''}
                onChange={(e) => handleUpdate({ heading: e.target.value })}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={selectedElement.props.content || ''}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                rows={6}
              />
            </div>
          </div>
        );
      
      case 'products':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={selectedElement.props.title || ''}
                onChange={(e) => handleUpdate({ title: e.target.value })}
              />
            </div>
          </div>
        );
      
      case 'footer':
        return (
          <div className="space-y-4">
            <div>
              <Label>Footer Text</Label>
              <Input
                value={selectedElement.props.text || ''}
                onChange={(e) => handleUpdate({ text: e.target.value })}
              />
            </div>
          </div>
        );
      
      default:
        return <p className="text-sm text-gray-500">No properties available</p>;
    }
  };

  return (
    <div className="w-80 bg-white border-l p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Properties</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => deleteElement(selectedElement.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4">
        <Label className="text-xs text-gray-500">
          Selected: {selectedElement.type}
        </Label>
      </div>
      
      {renderProperties()}
    </div>
  );
}
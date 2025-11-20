'use client';

import { useEditorStore } from '@/lib/store-builder/editor-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function LayersPanel() {
  const { editor, selectElement, deleteElement } = useEditorStore();
  const [expandedElements, setExpandedElements] = useState<Set<string>>(new Set(['body']));

  const toggleExpanded = (elementId: string) => {
    const newExpanded = new Set(expandedElements);
    if (newExpanded.has(elementId)) {
      newExpanded.delete(elementId);
    } else {
      newExpanded.add(elementId);
    }
    setExpandedElements(newExpanded);
  };

  const renderElement = (element: any, depth = 0) => {
    const hasChildren = Array.isArray(element.content) && element.content.length > 0;
    const isExpanded = expandedElements.has(element.id);
    const isSelected = editor.selectedElement === element.id;

    return (
      <div key={element.id}>
        <div
          className={`flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer ${
            isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => selectElement(element.id)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(element.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-4" />
          )}
          
          <span className="flex-1 text-sm">{element.name}</span>
          
          <Badge variant="outline" className="text-xs">
            {element.type}
          </Badge>
          
          {element.type !== 'body' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                deleteElement(element.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {element.content.map((child: any) => renderElement(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 border-l bg-white p-4">
      <h3 className="font-medium mb-4">Layers</h3>
      <div className="space-y-1">
        {editor.elements.map(element => renderElement(element))}
      </div>
    </div>
  );
}
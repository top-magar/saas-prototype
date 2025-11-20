'use client';

import { useEditorStore } from '@/lib/store-builder/editor-store';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ElementWrapperProps {
  elementId: string;
  children: React.ReactNode;
}

export function ElementWrapper({ elementId, children }: ElementWrapperProps) {
  const { editor, selectElement, deleteElement, updateElement } = useEditorStore();
  const { selectedElement } = editor;
  const isSelected = selectedElement === elementId;

  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500'
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(elementId);
      }}
    >
      {children}

      {isSelected && (
        <div className="absolute -top-8 left-0 flex gap-1 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 text-white hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              // Copy element logic
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 text-white hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              // Move element logic
            }}
          >
            <Move className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 text-white hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              deleteElement(elementId);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
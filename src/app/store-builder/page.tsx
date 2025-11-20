'use client';

import { Toolbar } from '@/components/builder/toolbar';
import { Sidebar } from '@/components/builder/sidebar';
import { Canvas } from '@/components/builder/canvas';
import { Properties } from '@/components/builder/properties';
import { useBuilder } from '@/lib/builder/store';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

export default function StoreBuilderPage() {
  const { undo, redo, deleteElement, elements, selected } = useBuilder();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 's':
            e.preventDefault();
            // Save functionality
            break;
        }
      }
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        e.preventDefault();
        deleteElement(selected);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteElement, selected]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Canvas />
        <Properties />
      </div>
      
      <Toaster position="bottom-right" />
    </div>
  );
}
'use client';

import { useEditorStore } from '@/lib/store-builder/editor-store';
import { RecursiveElement } from './recursive-element';
import { Plus } from 'lucide-react';

export function EditorCanvas() {
  const { editor, addElement, selectElement } = useEditorStore();
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    
    if (componentType) {
      const getDefaultContent = (type: string) => {
        switch (type) {
          case 'header-nav':
            return {
              heading: 'Your Store',
              links: [{ text: 'Home', url: '#' }, { text: 'Products', url: '#' }],
              buttonText: 'Shop Now'
            };
          case 'hero-banner':
            return {
              heading: 'Welcome to Our Store',
              subheading: 'Discover amazing products',
              buttonText: 'Shop Now',
              backgroundImage: ''
            };
          case 'text-section':
            return {
              heading: 'Section Heading',
              text: 'Your content here...',
              alignment: 'left'
            };
          case 'product-grid':
            return {
              title: 'Featured Products',
              columns: 3,
              showPrices: true,
              showCartButton: true
            };
          case 'footer':
            return {
              copyrightText: '© 2024 Your Store. All rights reserved.',
              showSocialLinks: true
            };
          case 'container':
          case 'two-column':
            return [];
          default:
            return { innerText: 'Sample text' };
        }
      };
      
      const newElement = {
        id: `${componentType}-${Date.now()}`,
        type: componentType as any,
        name: componentType,
        styles: {},
        content: getDefaultContent(componentType)
      };
      
      // Add to body element
      addElement(newElement, 'body');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const bodyElement = editor.elements.find(el => el.type === 'body');

  return (
    <div
      className="flex-1 bg-white min-h-full relative p-4"
      onClick={() => selectElement(null)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {bodyElement ? (
        <RecursiveElement element={bodyElement} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start Building</h3>
            <p className="text-gray-500">Drag components here to begin</p>
          </div>
        </div>
      )}
    </div>
  );
}
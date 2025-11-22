'use client';

import { useEditorStore } from '@/lib/store-builder/editor-store';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';

interface RecursiveElementProps {
  element: any;
}

export function RecursiveElement({ element }: RecursiveElementProps) {
  const { editor, selectElement } = useEditorStore();
  const isSelected = editor.selectedElement === element.id;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer.getData('componentType');
    if (componentType && Array.isArray(element.content)) {
      const newElement = {
        id: `${componentType}-${Date.now()}`,
        type: componentType as any,
        name: componentType,
        styles: {},
        content: componentType === 'container' || componentType === 'two-column' ? [] : {}
      };

      // Add to this container
      useEditorStore.getState().addElement(newElement, element.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Determine if this is a recursive element (has children)
  const isRecursive = Array.isArray(element.content);

  return (
    <div
      className={cn(
        'relative transition-all duration-200 min-h-[50px]',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isRecursive && 'border border-dashed border-gray-300 p-2'
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={element.styles}
    >
      {/* Render element based on type */}
      <ElementRenderer element={element} />

      {/* Render children if recursive */}
      {isRecursive && element.content.map((child: any) => (
        <RecursiveElement key={child.id} element={child} />
      ))}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          {element.name}
        </div>
      )}
    </div>
  );
}

function ElementRenderer({ element }: { element: any }) {
  const { formatCurrency } = useCurrency();

  switch (element.type) {
    case 'body':
      return null;
    case 'container':
      return (
        <div className="min-h-[100px] border border-gray-200 rounded p-4">
          {Array.isArray(element.content) && element.content.length === 0 && (
            <div className="text-gray-400 text-center">Drop elements here</div>
          )}
        </div>
      );
    case 'header-nav':
      return (
        <nav className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{element.content.heading || 'Your Store'}</h1>
            <div className="flex items-center gap-6">
              {element.content.links?.map((link: any, i: number) => (
                <a key={i} href={link.url} className="text-gray-600 hover:text-gray-900">
                  {link.text}
                </a>
              ))}
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                {element.content.buttonText || 'Shop Now'}
              </button>
            </div>
          </div>
        </nav>
      );
    case 'hero-banner':
      return (
        <div
          className="relative bg-gray-900 text-white py-20 px-6"
          style={{ backgroundImage: element.content.backgroundImage ? `url(${element.content.backgroundImage})` : undefined }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{element.content.heading || 'Welcome to Our Store'}</h1>
            <p className="text-xl mb-8">{element.content.subheading || 'Discover amazing products'}</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg">
              {element.content.buttonText || 'Shop Now'}
            </button>
          </div>
        </div>
      );
    case 'text-section':
      return (
        <div className="py-8 px-6" style={{ textAlign: element.content.alignment || 'left' }}>
          {element.content.heading && (
            <h2 className="text-2xl font-bold mb-4">{element.content.heading}</h2>
          )}
          <p className="text-gray-600 leading-relaxed">{element.content.text || 'Your content here...'}</p>
        </div>
      );
    case 'product-grid':
      return (
        <div className="py-12 px-6">
          <h2 className="text-3xl font-bold text-center mb-8">{element.content.title || 'Featured Products'}</h2>
          <div className={`grid gap-6 max-w-6xl mx-auto`} style={{ gridTemplateColumns: `repeat(${element.content.columns || 3}, 1fr)` }}>
            {[1, 2, 3, 4, 5, 6].slice(0, element.content.columns || 3).map(i => (
              <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Product {i}</h3>
                  {element.content.showPrices && <p className="text-blue-600 font-bold">{formatCurrency(99.99)}</p>}
                  {element.content.showCartButton && (
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded">Add to Cart</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'footer':
      return (
        <footer className="bg-gray-900 text-white py-8 px-6">
          <div className="max-w-6xl mx-auto text-center">
            {element.content.showSocialLinks && (
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-700 rounded"></div>
              </div>
            )}
            <p className="text-gray-400">{element.content.copyrightText || '© 2024 Your Store. All rights reserved.'}</p>
          </div>
        </footer>
      );
    default:
      return <div className="p-4 bg-gray-100">Unknown Element: {element.type}</div>;
  }
}
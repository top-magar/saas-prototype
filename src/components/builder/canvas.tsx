'use client';

import { useBuilder, Element } from '@/lib/builder/store';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export function Canvas() {
  const { elements, selected, selectElement, addElement, device, zoom } = useBuilder();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    if (!type) return;

    const element: Element = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultProps(type),
      styles: {},
      children: []
    };

    addElement(element);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      default: return 1200;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-auto">
      <div className="flex justify-center">
        <div
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          style={{
            width: getDeviceWidth() * (zoom / 100),
            minHeight: 800 * (zoom / 100),
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => selectElement(null)}
        >
          {elements.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-12">
                <Plus className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2">Start Building</h3>
                <p className="text-gray-500">Drag components here</p>
              </div>
            </div>
          ) : (
            elements.map(element => (
              <ElementRenderer key={element.id} element={element} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ElementRenderer({ element }: { element: Element }) {
  const { selected, selectElement } = useBuilder();
  const isSelected = selected === element.id;

  return (
    <div
      className={cn(
        'relative transition-all',
        isSelected && 'ring-2 ring-blue-500'
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      style={element.styles}
    >
      <ComponentRenderer element={element} />
      
      {element.children.map(child => (
        <ElementRenderer key={child.id} element={child} />
      ))}
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          {element.type}
        </div>
      )}
    </div>
  );
}

function ComponentRenderer({ element }: { element: Element }) {
  switch (element.type) {
    case 'header':
      return (
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{element.props.title || 'Your Store'}</h1>
            <nav className="flex gap-6">
              {element.props.links?.map((link: any, i: number) => (
                <a key={i} href="#" className="text-gray-600 hover:text-gray-900">
                  {link.text}
                </a>
              ))}
            </nav>
          </div>
        </header>
      );
    
    case 'hero':
      return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{element.props.title || 'Welcome'}</h1>
            <p className="text-xl mb-8">{element.props.subtitle || 'Build amazing stores'}</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">
              {element.props.buttonText || 'Get Started'}
            </button>
          </div>
        </section>
      );
    
    case 'text':
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{element.props.heading || 'Heading'}</h2>
          <p className="text-gray-600">{element.props.content || 'Your content here...'}</p>
        </div>
      );
    
    case 'products':
      return (
        <section className="py-12 px-6">
          <h2 className="text-3xl font-bold text-center mb-8">{element.props.title || 'Products'}</h2>
          <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white border rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold">Product {i}</h3>
                  <p className="text-blue-600 font-bold">$99.99</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    
    case 'footer':
      return (
        <footer className="bg-gray-900 text-white py-8 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p>{element.props.text || '© 2024 Your Store. All rights reserved.'}</p>
          </div>
        </footer>
      );
    
    default:
      return (
        <div className="p-4 bg-gray-100 border-2 border-dashed border-gray-300">
          <p className="text-gray-500">Unknown component: {element.type}</p>
        </div>
      );
  }
}

function getDefaultProps(type: string) {
  const defaults: Record<string, any> = {
    header: { title: 'Your Store', links: [{ text: 'Home' }, { text: 'Products' }] },
    hero: { title: 'Welcome to Our Store', subtitle: 'Discover amazing products', buttonText: 'Shop Now' },
    text: { heading: 'About Us', content: 'Tell your story here...' },
    products: { title: 'Featured Products' },
    footer: { text: '© 2024 Your Store. All rights reserved.' }
  };
  return defaults[type] || {};
}
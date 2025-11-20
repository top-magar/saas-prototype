'use client';

import { useEnterpriseStore } from '@/lib/store-builder/enterprise-store';
import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function EnterpriseCanvas() {
  const {
    editor, device, zoom, grid, rulers, previewMode,
    addElement, selectElement
  } = useEnterpriseStore();

  const canvasRef = useRef<HTMLDivElement>(null);


  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      default: return 1200;
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');

    if (componentType) {
      const rect = canvasRef.current?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);

      const newElement = {
        id: `${componentType}-${Date.now()}`,
        type: componentType,
        name: componentType,
        styles: {
          position: 'relative',
          left: `${x}px`,
          top: `${y}px`
        },
        content: getDefaultContent(componentType)
      };

      addElement(newElement, 'body');
    }
  }, [addElement]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const deviceWidth = getDeviceWidth();
  const canvasScale = zoom / 100;
  const bodyElement = editor.elements.find(el => el.type === 'body');

  return (
    <div className="flex-1 overflow-auto relative bg-gradient-to-br from-gray-50 to-white">
      {/* Rulers */}
      {rulers && (
        <>
          <div className="absolute top-0 left-0 right-0 h-6 bg-white border-b flex items-end text-xs text-gray-500 z-10">
            {Array.from({ length: Math.ceil(deviceWidth / 50) }, (_, i) => (
              <div key={i} className="flex-shrink-0 w-12 text-center border-r border-gray-200">
                {i * 50}
              </div>
            ))}
          </div>
          <div className="absolute top-6 left-0 bottom-0 w-6 bg-white border-r flex flex-col text-xs text-gray-500 z-10">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="flex-shrink-0 h-12 flex items-center justify-center border-b border-gray-200">
                {i * 50}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Canvas */}
      <div
        className={cn("flex justify-center min-h-full p-8", rulers && "pt-14 pl-14")}
        style={{
          backgroundImage: grid.enabled ?
            `radial-gradient(circle, #e5e7eb 1px, transparent 1px)` : 'none',
          backgroundSize: grid.enabled ? `${grid.size}px ${grid.size}px` : 'auto'
        }}
      >
        <div
          ref={canvasRef}
          className={cn(
            "bg-white shadow-2xl transition-all duration-300 relative overflow-hidden",
            previewMode ? "rounded-none" : "rounded-xl border"
          )}
          style={{
            width: deviceWidth * canvasScale,
            minHeight: 800 * canvasScale,
            transform: `scale(${canvasScale})`,
            transformOrigin: 'top center'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !previewMode && selectElement(null)}
        >
          {/* Device Frame */}
          {!previewMode && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                {device} - {deviceWidth}px
              </div>
            </div>
          )}

          {/* Render Elements */}
          {bodyElement && <RecursiveElement element={bodyElement} />}
        </div>
      </div>

      {/* Performance Overlay */}
      {!previewMode && (
        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs">
          <div>Elements: {editor.elements.length}</div>
          <div>Zoom: {zoom}%</div>
        </div>
      )}
    </div>
  );
}

function RecursiveElement({ element }: { element: any }) {
  const { editor, selectElement, previewMode } = useEnterpriseStore();
  const isSelected = editor.selectedElement === element.id;
  const isMultiSelected = editor.multiSelection.includes(element.id);

  return (
    <div
      className={cn(
        'relative transition-all duration-200',
        !previewMode && isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        !previewMode && isMultiSelected && 'ring-2 ring-purple-500 ring-offset-2',
        element.hidden && 'opacity-50',
        element.locked && 'pointer-events-none'
      )}
      onClick={(e) => {
        if (!previewMode) {
          e.stopPropagation();
          selectElement(element.id, e.ctrlKey || e.metaKey);
        }
      }}
      style={element.styles}
    >
      <ElementRenderer element={element} />

      {Array.isArray(element.content) && element.content.map((child: any) => (
        <RecursiveElement key={child.id} element={child} />
      ))}

      {!previewMode && isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded z-10">
          {element.name}
        </div>
      )}
    </div>
  );
}

function ElementRenderer({ element }: { element: any }) {
  // Same as before but with enterprise features
  return <div>Element: {element.type}</div>;
}

function getDefaultContent(type: string) {
  const defaults: Record<string, any> = {
    'header-nav': { heading: 'Your Store', links: [], buttonText: 'Shop Now' },
    'hero-banner': { heading: 'Welcome', subheading: 'Discover amazing products' },
    'text-section': { heading: 'Section', text: 'Content here...' },
    'product-grid': { title: 'Products', columns: 3, showPrices: true },
    'footer': { copyrightText: '© 2024 Your Store' }
  };
  return defaults[type] || {};
}
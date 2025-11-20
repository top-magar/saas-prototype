'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, Image, Navigation, Type, Grid3X3 } from 'lucide-react';
import { PageComponent } from '@/lib/store-builder/types';
import { DeviceType } from '@/lib/store-builder/types';

interface PageRendererProps {
  components: PageComponent[];
  deviceType: DeviceType;
  selectedComponentId?: string | null;
  onSelectComponent?: (id: string) => void;
}

export function PageRenderer({ 
  components, 
  deviceType,
  selectedComponentId,
  onSelectComponent
}: PageRendererProps) {
  const handleComponentClick = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    onSelectComponent?.(componentId);
  };

  const renderComponent = (component: PageComponent): React.ReactNode => {
    const { props, styles } = component;
    const isSelected = selectedComponentId === component.id;
    
    const mergedStyles = {
      ...styles.base,
      ...(styles.responsive?.[deviceType] || {})
    };

    const componentElement = (() => {
      switch (component.type) {
        case 'header-nav':
          return (
            <nav style={mergedStyles} className="bg-white border-b shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xl">
                  {props.heading || 'Store Logo'}
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  {(props.links || []).map((link: any, i: number) => (
                    <span key={i} className="hover:opacity-75 cursor-pointer">
                      {link.text}
                    </span>
                  ))}
                </div>
                <Button size="sm">{props.buttonText || 'Sign Up'}</Button>
              </div>
            </nav>
          );

        case 'hero-banner':
          return (
            <section style={mergedStyles} className="p-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h1 className="text-4xl font-bold mb-4">{props.heading || 'Welcome to Our Store'}</h1>
              <p className="text-xl mb-8">{props.subheading || 'Discover amazing products'}</p>
              <Button>{props.buttonText || 'Shop Now'}</Button>
            </section>
          );

        case 'text-section':
          return (
            <section style={mergedStyles} className="prose max-w-none p-6">
              <h2 className="text-2xl font-bold mb-4">{props.heading || 'About Our Store'}</h2>
              <p>{props.text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
            </section>
          );

        case 'product-grid':
          return (
            <section style={mergedStyles} className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {props.heading || 'Featured Products'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4 bg-white">
                    <div className="bg-gray-200 h-32 rounded mb-2"></div>
                    <h3 className="font-semibold">Product {i}</h3>
                    <p className="text-sm text-gray-600">$99.99</p>
                  </div>
                ))}
              </div>
            </section>
          );

        default:
          return (
            <div style={mergedStyles} className="p-4 border rounded bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Grid3X3 className="h-4 w-4" />
                <span className="text-sm">Unknown Component: {component.type}</span>
              </div>
            </div>
          );
      }
    })();

    return (
      <div
        key={component.id}
        className={`relative group ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onClick={(e) => handleComponentClick(e, component.id)}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -top-6 left-0 z-10">
            <Badge variant="default" className="text-xs">
              {component.type}
            </Badge>
          </div>
        )}
        
        {/* Component Content */}
        {componentElement}
        
        {/* Hover Overlay */}
        {onSelectComponent && (
          <div className={`absolute inset-0 border-2 border-dashed transition-opacity ${
            isSelected 
              ? 'border-primary bg-primary/5 opacity-100' 
              : 'border-transparent group-hover:border-primary/50 group-hover:bg-primary/5 opacity-0 group-hover:opacity-100'
          }`} />
        )}
      </div>
    );
  };

  return (
    <div className="page-renderer">
      {components.map((component) => renderComponent(component))}
    </div>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Image } from 'lucide-react';

export interface PageComponent {
  id: string;
  type: 'navigation' | 'hero' | 'products' | 'text' | 'image' | 'testimonials' | 'cta' | 'footer';
  props: Record<string, any>;
  styles: {
    base: Record<string, any>;
    responsive?: {
      mobile?: Record<string, any>;
      tablet?: Record<string, any>;
      desktop?: Record<string, any>;
    };
  };
  children: PageComponent[];
}

interface PageRendererProps {
  components: PageComponent[];
  isPreview?: boolean;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

export const PageRenderer: React.FC<PageRendererProps> = ({ 
  components, 
  isPreview = true,
  deviceType = 'desktop'
}) => {
  // URL validation and sanitization functions
  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      // Only allow http, https, and relative URLs
      return ['http:', 'https:'].includes(urlObj.protocol) || url.startsWith('/');
    } catch {
      // If URL constructor fails, check if it's a relative path
      return url.startsWith('/') && !url.includes('javascript:') && !url.includes('data:');
    }
  };
  
  const sanitizeUrl = (url: string): string => {
    if (!url || !isValidUrl(url)) {
      return ''; // Return empty string for invalid URLs
    }
    
    // Remove potentially dangerous protocols
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:')) {
      return '';
    }
    
    return url;
  };
  
  const sanitizeImageUrl = (url: string): string => {
    const sanitized = sanitizeUrl(url);
    if (!sanitized) {
      // Return a safe placeholder image URL
      return '/images/placeholder.jpg';
    }
    return sanitized;
  };
  const renderComponent = (component: PageComponent, index: number): React.ReactNode => {
    const { props, styles } = component;
    const mergedStyles = {
      ...styles.base,
      ...(styles.responsive?.[deviceType] || {})
    };

    switch (component.type) {
      case 'navigation':
        return (
          <nav key={component.id} style={mergedStyles} className="bg-white border-b shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xl">
                {props.heading || 'Store Logo'}
              </div>
              <div className="hidden md:flex items-center space-x-6">
                {(props.links || []).map((link: any, i: number) => {
                  // Validate link URL if it exists
                  const hasValidUrl = link.url && isValidUrl(link.url);
                  
                  return hasValidUrl ? (
                    <a 
                      key={i} 
                      href={sanitizeUrl(link.url)}
                      className="hover:opacity-75 cursor-pointer"
                      rel="noopener noreferrer"
                      target={link.url.startsWith('/') ? '_self' : '_blank'}
                    >
                      {link.text}
                    </a>
                  ) : (
                    <span key={i} className="hover:opacity-75 cursor-pointer">
                      {link.text}
                    </span>
                  );
                })}
              </div>
              <Button size="sm">{props.buttonText || 'Sign Up'}</Button>
            </div>
          </nav>
        );

      case 'hero':
        return (
          <section key={component.id} style={mergedStyles} className="p-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{props.heading || 'Welcome to Our Store'}</h1>
            <p className="text-xl mb-8">{props.subheading || 'Discover amazing products'}</p>
            <Button>{props.buttonText || 'Shop Now'}</Button>
          </section>
        );

      case 'text':
        return (
          <section key={component.id} style={mergedStyles} className="prose max-w-none p-6">
            <h2 className="text-2xl font-bold mb-4">{props.heading || 'About Our Store'}</h2>
            <p>{props.text || 'Lorem ipsum dolor sit amet...'}</p>
          </section>
        );

      case 'image':
        return (
          <div key={component.id} style={mergedStyles} className="p-4">
            {props.imageUrl ? (
              <img 
                src={sanitizeImageUrl(props.imageUrl)} 
                alt={props.alt || 'Component image'} 
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder on image load error
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
            ) : (
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        );

      case 'products':
        return (
          <section key={component.id} style={mergedStyles} className="p-6">
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

      case 'testimonials':
        return (
          <section key={component.id} style={mergedStyles} className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {props.heading || 'What Our Customers Say'}
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="italic mb-4">"{props.text || 'Amazing products and great service!'}"</p>
              <p className="font-semibold">- Happy Customer</p>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={component.id} style={mergedStyles} className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">{props.heading || 'Ready to Get Started?'}</h2>
            <p className="text-lg mb-6">{props.subheading || 'Join thousands of satisfied customers'}</p>
            <Button>{props.buttonText || 'Get Started Today'}</Button>
          </section>
        );

      case 'footer':
        return (
          <footer key={component.id} style={mergedStyles} className="bg-gray-900 text-white p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">{props.heading || 'Company'}</h3>
                <div className="space-y-2">
                  {(props.links || []).slice(0, 3).map((link: any, i: number) => {
                    // Validate link URL if it exists
                    const hasValidUrl = link.url && isValidUrl(link.url);
                    
                    return hasValidUrl ? (
                      <a 
                        key={i} 
                        href={sanitizeUrl(link.url)}
                        className="block hover:opacity-75 cursor-pointer"
                        rel="noopener noreferrer"
                        target={link.url.startsWith('/') ? '_self' : '_blank'}
                      >
                        {link.text}
                      </a>
                    ) : (
                      <span key={i} className="block hover:opacity-75 cursor-pointer">
                        {link.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </footer>
        );

      default:
        return <div key={component.id} className="p-4 border rounded">Unknown Component</div>;
    }
  };

  return (
    <div className="page-renderer">
      {components.map((component, index) => renderComponent(component, index))}
    </div>
  );
};
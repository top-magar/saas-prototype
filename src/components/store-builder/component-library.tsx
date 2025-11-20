'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  Image, 
  Type, 
  Star, 
  ShoppingCart, 
  CreditCard,
  Users,
  MessageSquare,
  Mail,
  MapPin,
  Search,
  Grid3X3,
  Zap,
  Award,
  TrendingUp,
  Heart,
  Share2,
  Play
} from 'lucide-react';
import { PageComponent } from './page-renderer';

interface ComponentLibraryProps {
  onAddComponent: (component: PageComponent) => void;
}

interface ComponentTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  template: Omit<PageComponent, 'id'>;
}

const componentTemplates: ComponentTemplate[] = [
  // Navigation Components
  {
    id: 'header-nav',
    name: 'Header Navigation',
    icon: <Navigation className="h-4 w-4" />,
    category: 'Navigation',
    description: 'Main navigation with logo and menu items',
    template: {
      type: 'navigation',
      props: {
        heading: 'Your Store',
        links: [
          { text: 'Home', url: '/' },
          { text: 'Products', url: '/products' },
          { text: 'About', url: '/about' },
          { text: 'Contact', url: '/contact' }
        ],
        buttonText: 'Shop Now'
      },
      styles: {
        base: {
          backgroundColor: '#ffffff',
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb'
        }
      },
      children: []
    }
  },

  // Hero Components
  {
    id: 'hero-banner',
    name: 'Hero Banner',
    icon: <Zap className="h-4 w-4" />,
    category: 'Hero',
    description: 'Eye-catching hero section with CTA',
    template: {
      type: 'hero',
      props: {
        heading: 'Welcome to Our Amazing Store',
        subheading: 'Discover premium products at unbeatable prices',
        buttonText: 'Shop Now',
        backgroundImage: '/images/hero-bg.jpg'
      },
      styles: {
        base: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '4rem 2rem',
          textAlign: 'center'
        }
      },
      children: []
    }
  },

  // Product Components
  {
    id: 'product-grid',
    name: 'Product Grid',
    icon: <Grid3X3 className="h-4 w-4" />,
    category: 'Products',
    description: 'Grid layout for showcasing products',
    template: {
      type: 'products',
      props: {
        heading: 'Featured Products',
        layout: 'grid',
        columns: 3,
        showPrice: true,
        showRating: true,
        showAddToCart: true
      },
      styles: {
        base: {
          padding: '2rem',
          backgroundColor: '#f9fafb'
        }
      },
      children: []
    }
  },

  {
    id: 'product-showcase',
    name: 'Product Showcase',
    icon: <Award className="h-4 w-4" />,
    category: 'Products',
    description: 'Highlight your best products',
    template: {
      type: 'product-showcase',
      props: {
        heading: 'Best Sellers',
        products: [
          {
            name: 'Premium Product',
            price: '$99.99',
            image: '/images/product1.jpg',
            rating: 5,
            badge: 'Best Seller'
          }
        ]
      },
      styles: {
        base: {
          padding: '3rem 2rem',
          backgroundColor: 'white'
        }
      },
      children: []
    }
  },

  // Content Components
  {
    id: 'text-section',
    name: 'Text Section',
    icon: <Type className="h-4 w-4" />,
    category: 'Content',
    description: 'Rich text content area',
    template: {
      type: 'text',
      props: {
        heading: 'About Our Store',
        text: 'We are passionate about providing high-quality products that enhance your lifestyle. Our carefully curated selection ensures you get the best value for your money.',
        alignment: 'left'
      },
      styles: {
        base: {
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }
      },
      children: []
    }
  },

  {
    id: 'image-banner',
    name: 'Image Banner',
    icon: <Image className="h-4 w-4" />,
    category: 'Content',
    description: 'Full-width image with optional overlay text',
    template: {
      type: 'image',
      props: {
        imageUrl: '/images/banner.jpg',
        alt: 'Store banner',
        overlay: true,
        overlayText: 'New Collection Available',
        overlayButton: 'Explore Now'
      },
      styles: {
        base: {
          position: 'relative',
          height: '400px',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      },
      children: []
    }
  },

  // Social Proof Components
  {
    id: 'testimonials',
    name: 'Customer Reviews',
    icon: <Star className="h-4 w-4" />,
    category: 'Social Proof',
    description: 'Customer testimonials and reviews',
    template: {
      type: 'testimonials',
      props: {
        heading: 'What Our Customers Say',
        testimonials: [
          {
            text: 'Amazing quality and fast shipping! Highly recommend.',
            author: 'Sarah Johnson',
            rating: 5,
            avatar: '/images/avatar1.jpg'
          }
        ]
      },
      styles: {
        base: {
          padding: '3rem 2rem',
          backgroundColor: '#f8fafc'
        }
      },
      children: []
    }
  },

  {
    id: 'trust-badges',
    name: 'Trust Badges',
    icon: <Award className="h-4 w-4" />,
    category: 'Social Proof',
    description: 'Security and trust indicators',
    template: {
      type: 'trust-badges',
      props: {
        badges: [
          { icon: 'shield', text: 'Secure Checkout' },
          { icon: 'truck', text: 'Free Shipping' },
          { icon: 'return', text: '30-Day Returns' },
          { icon: 'support', text: '24/7 Support' }
        ]
      },
      styles: {
        base: {
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'white'
        }
      },
      children: []
    }
  },

  // E-commerce Components
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    icon: <ShoppingCart className="h-4 w-4" />,
    category: 'E-commerce',
    description: 'Mini cart widget',
    template: {
      type: 'cart-widget',
      props: {
        position: 'top-right',
        showItemCount: true,
        showTotal: true
      },
      styles: {
        base: {
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }
      },
      children: []
    }
  },

  {
    id: 'checkout-form',
    name: 'Checkout Form',
    icon: <CreditCard className="h-4 w-4" />,
    category: 'E-commerce',
    description: 'Complete checkout form',
    template: {
      type: 'checkout',
      props: {
        fields: ['email', 'shipping', 'payment'],
        paymentMethods: ['card', 'paypal', 'apple-pay']
      },
      styles: {
        base: {
          padding: '2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }
      },
      children: []
    }
  },

  // Marketing Components
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    icon: <Mail className="h-4 w-4" />,
    category: 'Marketing',
    description: 'Email subscription form',
    template: {
      type: 'newsletter',
      props: {
        heading: 'Stay Updated',
        subheading: 'Get the latest deals and product updates',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe',
        incentive: 'Get 10% off your first order!'
      },
      styles: {
        base: {
          padding: '3rem 2rem',
          backgroundColor: '#1f2937',
          color: 'white',
          textAlign: 'center'
        }
      },
      children: []
    }
  },

  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    icon: <TrendingUp className="h-4 w-4" />,
    category: 'Marketing',
    description: 'Create urgency with countdown',
    template: {
      type: 'countdown',
      props: {
        heading: 'Limited Time Offer',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        showDays: true,
        showHours: true,
        showMinutes: true
      },
      styles: {
        base: {
          padding: '2rem',
          backgroundColor: '#dc2626',
          color: 'white',
          textAlign: 'center'
        }
      },
      children: []
    }
  },

  // Footer Components
  {
    id: 'footer-links',
    name: 'Footer',
    icon: <MapPin className="h-4 w-4" />,
    category: 'Footer',
    description: 'Complete footer with links and info',
    template: {
      type: 'footer',
      props: {
        sections: [
          {
            heading: 'Company',
            links: [
              { text: 'About Us', url: '/about' },
              { text: 'Careers', url: '/careers' },
              { text: 'Contact', url: '/contact' }
            ]
          },
          {
            heading: 'Support',
            links: [
              { text: 'Help Center', url: '/help' },
              { text: 'Returns', url: '/returns' },
              { text: 'Shipping', url: '/shipping' }
            ]
          }
        ],
        socialLinks: [
          { platform: 'facebook', url: '#' },
          { platform: 'twitter', url: '#' },
          { platform: 'instagram', url: '#' }
        ],
        copyright: '© 2024 Your Store. All rights reserved.'
      },
      styles: {
        base: {
          backgroundColor: '#111827',
          color: 'white',
          padding: '3rem 2rem 1rem'
        }
      },
      children: []
    }
  }
];

const categories = Array.from(new Set(componentTemplates.map(t => t.category)));

export function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredComponents = componentTemplates.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddComponent = (template: ComponentTemplate) => {
    const component: PageComponent = {
      id: `${template.id}-${Date.now()}`,
      ...template.template
    };
    onAddComponent(component);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/10">
      {/* Search */}
      <div className="p-4 border-b bg-muted/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-0 rounded-xl focus:bg-background transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('All')}
            className={`rounded-full text-xs h-7 px-3 ${
              selectedCategory === 'All' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted/50'
            }`}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full text-xs h-7 px-3 ${
                selectedCategory === category 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted/50'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredComponents.map(component => (
            <div
              key={component.id}
              className="group border border-border/50 rounded-xl p-4 hover:bg-accent/50 hover:border-primary/20 cursor-pointer transition-all duration-200 hover:shadow-sm"
              onClick={() => handleAddComponent(component)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl text-primary group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                  {component.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{component.name}</h4>
                    <Badge variant="outline" className="text-xs bg-muted/50 border-0">
                      {component.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {component.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Eye, 
  Download,
  Store,
  Shirt,
  Coffee,
  Laptop,
  Heart,
  Camera,
  Book,
  Gamepad2
} from 'lucide-react';
import { PageComponent } from './page-renderer';

interface TemplateSelectorProps {
  onLoadTemplate: (template: PageComponent[]) => void;
}

interface StoreTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  preview: string;
  components: PageComponent[];
  tags: string[];
}

const storeTemplates: StoreTemplate[] = [
  {
    id: 'modern-fashion',
    name: 'Modern Fashion',
    description: 'Clean and elegant design perfect for fashion brands',
    category: 'Fashion',
    icon: <Shirt className="h-5 w-5" />,
    preview: '/images/templates/fashion-preview.jpg',
    tags: ['modern', 'clean', 'fashion', 'elegant'],
    components: [
      {
        id: 'nav-1',
        type: 'navigation',
        props: {
          heading: 'Fashion Store',
          links: [
            { text: 'Home', url: '/' },
            { text: 'Women', url: '/women' },
            { text: 'Men', url: '/men' },
            { text: 'Sale', url: '/sale' }
          ],
          buttonText: 'Account'
        },
        styles: {
          base: {
            backgroundColor: '#ffffff',
            padding: '1rem 2rem',
            borderBottom: '1px solid #e5e7eb'
          }
        },
        children: []
      },
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          heading: 'New Collection 2024',
          subheading: 'Discover the latest trends in fashion with our curated collection',
          buttonText: 'Shop Collection',
          backgroundImage: '/images/fashion-hero.jpg'
        },
        styles: {
          base: {
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/fashion-hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '6rem 2rem',
            textAlign: 'center'
          }
        },
        children: []
      },
      {
        id: 'products-1',
        type: 'products',
        props: {
          heading: 'Featured Products',
          columns: 3,
          showPrice: true,
          showRating: true,
          showAddToCart: true
        },
        styles: {
          base: {
            padding: '4rem 2rem',
            backgroundColor: '#f9fafb'
          }
        },
        children: []
      }
    ]
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    description: 'Warm and inviting design for cafes and coffee shops',
    category: 'Food & Beverage',
    icon: <Coffee className="h-5 w-5" />,
    preview: '/images/templates/coffee-preview.jpg',
    tags: ['warm', 'cozy', 'coffee', 'food'],
    components: [
      {
        id: 'nav-2',
        type: 'navigation',
        props: {
          heading: 'Brew & Bean',
          links: [
            { text: 'Home', url: '/' },
            { text: 'Menu', url: '/menu' },
            { text: 'About', url: '/about' },
            { text: 'Contact', url: '/contact' }
          ],
          buttonText: 'Order Now'
        },
        styles: {
          base: {
            backgroundColor: '#8B4513',
            color: 'white',
            padding: '1rem 2rem'
          }
        },
        children: []
      },
      {
        id: 'hero-2',
        type: 'hero',
        props: {
          heading: 'Freshly Roasted Coffee',
          subheading: 'Start your day with our premium coffee blends',
          buttonText: 'View Menu'
        },
        styles: {
          base: {
            backgroundColor: '#D2691E',
            color: 'white',
            padding: '5rem 2rem',
            textAlign: 'center'
          }
        },
        children: []
      }
    ]
  },
  {
    id: 'tech-store',
    name: 'Tech Store',
    description: 'Modern and sleek design for electronics and gadgets',
    category: 'Electronics',
    icon: <Laptop className="h-5 w-5" />,
    preview: '/images/templates/tech-preview.jpg',
    tags: ['modern', 'tech', 'electronics', 'sleek'],
    components: [
      {
        id: 'nav-3',
        type: 'navigation',
        props: {
          heading: 'TechHub',
          links: [
            { text: 'Home', url: '/' },
            { text: 'Laptops', url: '/laptops' },
            { text: 'Phones', url: '/phones' },
            { text: 'Accessories', url: '/accessories' }
          ],
          buttonText: 'Cart'
        },
        styles: {
          base: {
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '1rem 2rem'
          }
        },
        children: []
      },
      {
        id: 'hero-3',
        type: 'hero',
        props: {
          heading: 'Latest Technology',
          subheading: 'Discover cutting-edge gadgets and electronics',
          buttonText: 'Shop Now'
        },
        styles: {
          base: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '5rem 2rem',
            textAlign: 'center'
          }
        },
        children: []
      }
    ]
  },
  {
    id: 'minimal-store',
    name: 'Minimal Store',
    description: 'Clean and minimal design for any product type',
    category: 'General',
    icon: <Store className="h-5 w-5" />,
    preview: '/images/templates/minimal-preview.jpg',
    tags: ['minimal', 'clean', 'simple', 'versatile'],
    components: [
      {
        id: 'nav-4',
        type: 'navigation',
        props: {
          heading: 'Store',
          links: [
            { text: 'Home', url: '/' },
            { text: 'Products', url: '/products' },
            { text: 'About', url: '/about' }
          ],
          buttonText: 'Cart'
        },
        styles: {
          base: {
            backgroundColor: 'white',
            padding: '1rem 2rem',
            borderBottom: '1px solid #e5e7eb'
          }
        },
        children: []
      },
      {
        id: 'hero-4',
        type: 'hero',
        props: {
          heading: 'Simple. Beautiful. Functional.',
          subheading: 'Quality products for modern living',
          buttonText: 'Explore'
        },
        styles: {
          base: {
            backgroundColor: '#f8fafc',
            padding: '6rem 2rem',
            textAlign: 'center'
          }
        },
        children: []
      }
    ]
  },
  {
    id: 'handmade-crafts',
    name: 'Handmade Crafts',
    description: 'Artistic and creative design for handmade products',
    category: 'Arts & Crafts',
    icon: <Heart className="h-5 w-5" />,
    preview: '/images/templates/crafts-preview.jpg',
    tags: ['artistic', 'handmade', 'creative', 'unique'],
    components: [
      {
        id: 'nav-5',
        type: 'navigation',
        props: {
          heading: 'Artisan Crafts',
          links: [
            { text: 'Home', url: '/' },
            { text: 'Gallery', url: '/gallery' },
            { text: 'Custom Orders', url: '/custom' },
            { text: 'About', url: '/about' }
          ],
          buttonText: 'Shop'
        },
        styles: {
          base: {
            backgroundColor: '#fef3c7',
            padding: '1rem 2rem',
            borderBottom: '2px solid #f59e0b'
          }
        },
        children: []
      },
      {
        id: 'hero-5',
        type: 'hero',
        props: {
          heading: 'Handcrafted with Love',
          subheading: 'Unique, one-of-a-kind pieces made by skilled artisans',
          buttonText: 'Browse Collection'
        },
        styles: {
          base: {
            backgroundColor: '#fbbf24',
            color: 'white',
            padding: '5rem 2rem',
            textAlign: 'center'
          }
        },
        children: []
      }
    ]
  }
];

const categories = Array.from(new Set(storeTemplates.map(t => t.category)));

export function TemplateSelector({ onLoadTemplate }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTemplates = storeTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLoadTemplate = (template: StoreTemplate) => {
    onLoadTemplate(template.components);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/10">
      {/* Search */}
      <div className="p-4 border-b bg-muted/20">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-0 rounded-xl focus:bg-background transition-colors"
          />
        </div>

        {/* Categories */}
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

      {/* Templates Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <div className="aspect-video bg-gradient-to-br from-muted/30 to-muted/60 relative overflow-hidden">
                {/* Template Preview Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-primary">
                      {template.icon}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Preview</p>
                  </div>
                </div>
                
                {/* Preview Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Button size="sm" variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors">{template.name}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs bg-muted/50 border-0 ml-2">
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-muted/30 hover:bg-muted/50 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group-hover:shadow-md transition-all"
                  onClick={() => handleLoadTemplate(template)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
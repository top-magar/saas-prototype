'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Navigation,
  Image,
  Type,
  Star,
  ShoppingCart,
  CreditCard,
  Users,
  Mail,
  Grid3X3,
  Zap,
  Award,
  Package2,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStoreBuilder } from '@/lib/store-builder/store';
import { PageComponent } from '@/lib/store-builder/types';

const componentCategories = [
  { id: 'all', name: 'All', count: 15 },
  { id: 'layout', name: 'Layout', count: 4 },
  { id: 'content', name: 'Content', count: 3 },
  { id: 'ecommerce', name: 'E-commerce', count: 5 },
  { id: 'marketing', name: 'Marketing', count: 3 }
];

const componentTemplates = [
  {
    id: 'header-nav',
    name: 'Header Navigation',
    icon: Navigation,
    category: 'layout',
    description: 'Main navigation with logo and menu'
  },
  {
    id: 'hero-banner',
    name: 'Hero Banner',
    icon: Zap,
    category: 'layout',
    description: 'Eye-catching hero section'
  },
  {
    id: 'product-grid',
    name: 'Product Grid',
    icon: Grid3X3,
    category: 'ecommerce',
    description: 'Grid layout for products'
  },
  {
    id: 'text-section',
    name: 'Text Section',
    icon: Type,
    category: 'content',
    description: 'Rich text content area'
  },
  {
    id: 'image-banner',
    name: 'Image Banner',
    icon: Image,
    category: 'content',
    description: 'Full-width image banner'
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    icon: Star,
    category: 'marketing',
    description: 'Customer reviews section'
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    icon: Mail,
    category: 'marketing',
    description: 'Email subscription form'
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    icon: ShoppingCart,
    category: 'ecommerce',
    description: 'Cart widget'
  }
];

export function ComponentsPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { currentPageId, addComponent } = useStoreBuilder();

  const filteredComponents = componentTemplates.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddComponent = (template: typeof componentTemplates[0]) => {
    if (!currentPageId) return;

    const component: PageComponent = {
      id: `${template.id}-${Date.now()}`,
      type: template.id,
      props: {},
      styles: { base: {} },
      children: []
    };

    addComponent(currentPageId, component);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 border-0 bg-gray-50 focus:bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {componentCategories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory(category.id)}
              className="w-full justify-between h-8 text-sm"
            >
              <span>{category.name}</span>
              <Badge variant="secondary" className="text-xs h-5">
                {category.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Components */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package2 className="h-4 w-4" />
            Components ({filteredComponents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2 pr-4">
              {filteredComponents.map(component => (
                <div
                  key={component.id}
                  className="group border rounded-lg p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => handleAddComponent(component)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg text-blue-600 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                      <component.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{component.name}</h4>
                        <Plus className="h-3 w-3 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        {component.description}
                      </p>
                      <Badge variant="outline" className="text-xs h-5">
                        {component.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {filteredComponents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Package2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No components found</p>
        </div>
      )}
    </div>
  );
}
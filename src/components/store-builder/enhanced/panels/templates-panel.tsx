'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search,
  Download,
  Eye,
  Shirt,
  Coffee,
  Laptop,
  Store,
  Heart
} from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';
import { PageComponent } from '@/lib/store-builder/types';

const templates = [
  {
    id: 'fashion-store',
    name: 'Fashion Store',
    description: 'Modern design for clothing brands',
    category: 'Fashion',
    icon: Shirt,
    preview: '/templates/fashion.jpg',
    components: [] as PageComponent[]
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    description: 'Warm design for cafes',
    category: 'Food & Beverage',
    icon: Coffee,
    preview: '/templates/coffee.jpg',
    components: [] as PageComponent[]
  },
  {
    id: 'tech-store',
    name: 'Tech Store',
    description: 'Sleek design for electronics',
    category: 'Electronics',
    icon: Laptop,
    preview: '/templates/tech.jpg',
    components: [] as PageComponent[]
  },
  {
    id: 'minimal-store',
    name: 'Minimal Store',
    description: 'Clean design for any product',
    category: 'General',
    icon: Store,
    preview: '/templates/minimal.jpg',
    components: [] as PageComponent[]
  }
];

const categories = ['All', 'Fashion', 'Food & Beverage', 'Electronics', 'General'];

export function TemplatesPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { currentPageId, updatePage, pages } = useStoreBuilder();

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: typeof templates[0]) => {
    if (!currentPageId) return;

    const currentPage = pages.find(p => p.id === currentPageId);
    if (!currentPage) return;

    updatePage(currentPageId, {
      components: template.components
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-9"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs h-7"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates */}
      <div className="space-y-3">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="group overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-muted/30 to-muted/60 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <template.icon className="h-6 w-6" />
                  </div>
                  <p className="text-xs text-muted-foreground">Preview</p>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button size="sm" variant="secondary">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => handleUseTemplate(template)}
              >
                <Download className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No templates found</p>
        </div>
      )}
    </div>
  );
}
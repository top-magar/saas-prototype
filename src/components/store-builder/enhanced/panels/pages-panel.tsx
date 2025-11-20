'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  FileText,
  MoreHorizontal,
  Search,
  Home,
  ShoppingBag,
  Info,
  Mail
} from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';

const pageIcons = {
  home: Home,
  products: ShoppingBag,
  about: Info,
  contact: Mail,
  default: FileText
};

export function PagesPanel() {
  const {
    pages,
    currentPageId,
    setCurrentPage,
    addPage
  } = useStoreBuilder();

  const handleAddPage = () => {
    addPage({
      name: 'New Page',
      slug: '/new-page',
      components: [],
      seoSettings: {
        title: 'New Page',
        description: '',
        keywords: []
      }
    });
  };

  const getPageIcon = (slug: string) => {
    const key = slug.replace('/', '') || 'home';
    const Icon = pageIcons[key as keyof typeof pageIcons] || pageIcons.default;
    return Icon;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          className="pl-10 h-9"
        />
      </div>

      {/* Add Page Button */}
      <Button
        onClick={handleAddPage}
        className="w-full justify-start h-9"
        variant="outline"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Page
      </Button>

      {/* Pages List */}
      <div className="space-y-1">
        {pages.map((page) => {
          const Icon = getPageIcon(page.slug);
          const isActive = page.id === currentPageId;
          
          return (
            <div
              key={page.id}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setCurrentPage(page.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon className={`h-4 w-4 flex-shrink-0 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm truncate ${
                    isActive ? 'text-primary' : 'text-foreground'
                  }`}>
                    {page.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {page.slug}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {page.components.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Page Info */}
      {currentPageId && (
        <div className="mt-6 p-3 bg-muted/30 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Page Settings</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div>Components: {pages.find(p => p.id === currentPageId)?.components.length || 0}</div>
            <div>Status: Draft</div>
            <div>Last modified: Just now</div>
          </div>
        </div>
      )}
    </div>
  );
}
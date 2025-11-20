'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Store,
  Palette,
  Globe,
  CreditCard,
  Settings
} from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';

export function StoreSettingsPanel() {
  const { settings } = useStoreBuilder();

  return (
    <div className="p-4 space-y-6">
      {/* Store Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Store Information</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="store-name" className="text-xs">Store Name</Label>
            <Input
              id="store-name"
              value={settings.storeName}
              className="h-8 text-sm"
              placeholder="My Store"
            />
          </div>
          
          <div>
            <Label htmlFor="domain" className="text-xs">Domain</Label>
            <Input
              id="domain"
              value={settings.domain}
              className="h-8 text-sm"
              placeholder="mystore.com"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Theme */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Theme</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="primary-color" className="text-xs">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary-color"
                type="color"
                value={settings.theme.primaryColor}
                className="w-12 h-8 p-1"
              />
              <Input
                value={settings.theme.primaryColor}
                className="h-8 text-sm flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="font-family" className="text-xs">Font Family</Label>
            <Input
              id="font-family"
              value={settings.theme.fontFamily}
              className="h-8 text-sm"
              placeholder="Inter"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* SEO */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">SEO Settings</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="seo-title" className="text-xs">Meta Title</Label>
            <Input
              id="seo-title"
              value={settings.seo.title}
              className="h-8 text-sm"
              placeholder="My Amazing Store"
            />
          </div>
          
          <div>
            <Label htmlFor="seo-description" className="text-xs">Meta Description</Label>
            <Input
              id="seo-description"
              value={settings.seo.description}
              className="h-8 text-sm"
              placeholder="Best products at great prices"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Quick Actions</h3>
        
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Settings
          </Button>
          
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            <Globe className="h-4 w-4 mr-2" />
            Domain Settings
          </Button>
          
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </Button>
        </div>
      </div>

      {/* Store Stats */}
      <div className="mt-6 p-3 bg-muted/30 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Store Statistics</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Pages:</span>
            <span>3</span>
          </div>
          <div className="flex justify-between">
            <span>Components:</span>
            <span>12</span>
          </div>
          <div className="flex justify-between">
            <span>Assets:</span>
            <span>8</span>
          </div>
          <div className="flex justify-between">
            <span>Last saved:</span>
            <span>2 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Palette, 
  Globe, 
  CreditCard,
  Truck,
  Shield,
  Mail,
  Phone,
  MapPin,
  Upload,
  Settings
} from 'lucide-react';

interface StoreSettingsProps {
  settings: any;
  onUpdateSettings: (settings: any) => void;
}

export function StoreSettings({ settings, onUpdateSettings }: StoreSettingsProps) {
  const [activeTab, setActiveTab] = useState('general');

  const updateSetting = (key: string, value: any) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    });
  };

  const updateNestedSetting = (section: string, key: string, value: any) => {
    onUpdateSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </CardTitle>
          <CardDescription>
            Basic information about your store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="store-name">Store Name</Label>
            <Input
              id="store-name"
              value={settings.storeName || ''}
              onChange={(e) => updateSetting('storeName', e.target.value)}
              placeholder="Your Store Name"
            />
          </div>
          
          <div>
            <Label htmlFor="store-description">Store Description</Label>
            <Textarea
              id="store-description"
              value={settings.storeDescription || ''}
              onChange={(e) => updateSetting('storeDescription', e.target.value)}
              placeholder="Describe your store..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="store-logo">Logo URL</Label>
            <Input
              id="store-logo"
              value={settings.logoUrl || ''}
              onChange={(e) => updateSetting('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <Label htmlFor="store-favicon">Favicon URL</Label>
            <Input
              id="store-favicon"
              value={settings.faviconUrl || ''}
              onChange={(e) => updateSetting('faviconUrl', e.target.value)}
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={settings.contactEmail || ''}
              onChange={(e) => updateSetting('contactEmail', e.target.value)}
              placeholder="contact@yourstore.com"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              value={settings.contactPhone || ''}
              onChange={(e) => updateSetting('contactPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="contact-address">Address</Label>
            <Textarea
              id="contact-address"
              value={settings.contactAddress || ''}
              onChange={(e) => updateSetting('contactAddress', e.target.value)}
              placeholder="123 Main St, City, State 12345"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDesignTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Colors
          </CardTitle>
          <CardDescription>
            Define your store's color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary-color"
                type="color"
                value={settings.primaryColor || '#3b82f6'}
                onChange={(e) => updateSetting('primaryColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.primaryColor || '#3b82f6'}
                onChange={(e) => updateSetting('primaryColor', e.target.value)}
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary-color"
                type="color"
                value={settings.secondaryColor || '#64748b'}
                onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.secondaryColor || '#64748b'}
                onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                placeholder="#64748b"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accent-color"
                type="color"
                value={settings.accentColor || '#f59e0b'}
                onChange={(e) => updateSetting('accentColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.accentColor || '#f59e0b'}
                onChange={(e) => updateSetting('accentColor', e.target.value)}
                placeholder="#f59e0b"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Choose fonts for your store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heading-font">Heading Font</Label>
            <Select
              value={settings.headingFont || 'Inter'}
              onValueChange={(value) => updateSetting('headingFont', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
                <SelectItem value="Playfair Display">Playfair Display</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="body-font">Body Font</Label>
            <Select
              value={settings.bodyFont || 'Inter'}
              onValueChange={(value) => updateSetting('bodyFont', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
                <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                <SelectItem value="Lato">Lato</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEcommerceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Settings
          </CardTitle>
          <CardDescription>
            Configure payment options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={settings.currency || 'USD'}
              onValueChange={(value) => updateSetting('currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Payment Methods</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="credit-cards"
                  checked={settings.paymentMethods?.creditCards !== false}
                  onCheckedChange={(checked) => 
                    updateNestedSetting('paymentMethods', 'creditCards', checked)
                  }
                />
                <Label htmlFor="credit-cards">Credit/Debit Cards</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="paypal"
                  checked={settings.paymentMethods?.paypal || false}
                  onCheckedChange={(checked) => 
                    updateNestedSetting('paymentMethods', 'paypal', checked)
                  }
                />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="apple-pay"
                  checked={settings.paymentMethods?.applePay || false}
                  onCheckedChange={(checked) => 
                    updateNestedSetting('paymentMethods', 'applePay', checked)
                  }
                />
                <Label htmlFor="apple-pay">Apple Pay</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="google-pay"
                  checked={settings.paymentMethods?.googlePay || false}
                  onCheckedChange={(checked) => 
                    updateNestedSetting('paymentMethods', 'googlePay', checked)
                  }
                />
                <Label htmlFor="google-pay">Google Pay</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="free-shipping"
              checked={settings.freeShipping || false}
              onCheckedChange={(checked) => updateSetting('freeShipping', checked)}
            />
            <Label htmlFor="free-shipping">Offer Free Shipping</Label>
          </div>

          {settings.freeShipping && (
            <div>
              <Label htmlFor="free-shipping-threshold">Free Shipping Threshold</Label>
              <Input
                id="free-shipping-threshold"
                type="number"
                value={settings.freeShippingThreshold || ''}
                onChange={(e) => updateSetting('freeShippingThreshold', e.target.value)}
                placeholder="50.00"
              />
            </div>
          )}

          <div>
            <Label htmlFor="shipping-zones">Shipping Zones</Label>
            <Textarea
              id="shipping-zones"
              value={settings.shippingZones || ''}
              onChange={(e) => updateSetting('shippingZones', e.target.value)}
              placeholder="List your shipping zones..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSeoTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            SEO Settings
          </CardTitle>
          <CardDescription>
            Optimize your store for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta-title">Meta Title</Label>
            <Input
              id="meta-title"
              value={settings.metaTitle || ''}
              onChange={(e) => updateSetting('metaTitle', e.target.value)}
              placeholder="Your Store - Best Products Online"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(settings.metaTitle || '').length}/60 characters
            </p>
          </div>
          
          <div>
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              value={settings.metaDescription || ''}
              onChange={(e) => updateSetting('metaDescription', e.target.value)}
              placeholder="Discover amazing products at great prices..."
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(settings.metaDescription || '').length}/160 characters
            </p>
          </div>

          <div>
            <Label htmlFor="meta-keywords">Keywords</Label>
            <Input
              id="meta-keywords"
              value={settings.metaKeywords || ''}
              onChange={(e) => updateSetting('metaKeywords', e.target.value)}
              placeholder="ecommerce, online store, products"
            />
          </div>

          <div>
            <Label htmlFor="og-image">Social Media Image</Label>
            <Input
              id="og-image"
              value={settings.ogImage || ''}
              onChange={(e) => updateSetting('ogImage', e.target.value)}
              placeholder="https://example.com/social-image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Track your store performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="google-analytics">Google Analytics ID</Label>
            <Input
              id="google-analytics"
              value={settings.googleAnalyticsId || ''}
              onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div>
            <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
            <Input
              id="facebook-pixel"
              value={settings.facebookPixelId || ''}
              onChange={(e) => updateSetting('facebookPixelId', e.target.value)}
              placeholder="123456789012345"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/10">
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Store Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your store preferences
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-2 gap-1 bg-muted/50 p-1 rounded-xl mb-2">
            <TabsTrigger value="general" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
            <TabsTrigger value="design" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Design</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-2 gap-1 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="ecommerce" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">E-commerce</TabsTrigger>
            <TabsTrigger value="seo" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">SEO</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-4 pb-4">
            <TabsContent value="general" className="mt-0">
              {renderGeneralTab()}
            </TabsContent>

            <TabsContent value="design" className="mt-0">
              {renderDesignTab()}
            </TabsContent>

            <TabsContent value="ecommerce" className="mt-0">
              {renderEcommerceTab()}
            </TabsContent>

            <TabsContent value="seo" className="mt-0">
              {renderSeoTab()}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
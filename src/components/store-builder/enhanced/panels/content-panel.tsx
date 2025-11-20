'use client';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Type, Image, Upload, Link2, Package2, Share2 } from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';

export function ContentPanel() {
  const {
    pages,
    currentPageId,
    selectedComponentId,
    updateComponent
  } = useStoreBuilder();

  const currentPage = pages.find(p => p.id === currentPageId);
  const selectedComponent = currentPage?.components.find(c => c.id === selectedComponentId);

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a component to edit content</p>
      </div>
    );
  }

  const handleUpdateProps = (newProps: any) => {
    if (!currentPageId || !selectedComponentId) return;
    
    updateComponent(currentPageId, selectedComponentId, {
      props: { ...selectedComponent.props, ...newProps }
    });
  };

  const renderContentFields = () => {
    switch (selectedComponent.type) {
      case 'header-nav':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <Type className="h-3 w-3 text-green-600" />
                </div>
                Navigation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nav-heading" className="text-xs font-medium">Brand Name</Label>
              <Input
                id="nav-heading"
                value={selectedComponent.props.heading || ''}
                onChange={(e) => handleUpdateProps({ heading: e.target.value })}
                placeholder="Your Store"
                className="h-8 text-sm"
              />
            </div>
            
            <div>
              <Label className="text-xs font-medium">Navigation Links</Label>
              <div className="space-y-2 mt-2">
                {(selectedComponent.props.links || []).map((link: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Link text"
                      value={link.text}
                      onChange={(e) => {
                        const newLinks = [...(selectedComponent.props.links || [])];
                        newLinks[index] = { ...link, text: e.target.value };
                        handleUpdateProps({ links: newLinks });
                      }}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...(selectedComponent.props.links || [])];
                        newLinks[index] = { ...link, url: e.target.value };
                        handleUpdateProps({ links: newLinks });
                      }}
                      className="h-8 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newLinks = (selectedComponent.props.links || []).filter((_: any, i: number) => i !== index);
                        handleUpdateProps({ links: newLinks });
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newLinks = [...(selectedComponent.props.links || []), { text: 'New Link', url: '#' }];
                    handleUpdateProps({ links: newLinks });
                  }}
                  className="w-full h-8"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Add Link
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="nav-button" className="text-xs font-medium">CTA Button</Label>
              <Input
                id="nav-button"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => handleUpdateProps({ buttonText: e.target.value })}
                placeholder="Shop Now"
                className="h-8 text-sm"
              />
            </div>
            </CardContent>
          </Card>
        );

      case 'hero-banner':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                  <Image className="h-3 w-3 text-purple-600" />
                </div>
                Hero Banner Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero-heading" className="text-xs font-medium">Main Heading</Label>
              <Input
                id="hero-heading"
                value={selectedComponent.props.heading || ''}
                onChange={(e) => handleUpdateProps({ heading: e.target.value })}
                placeholder="Welcome to Our Store"
                className="h-8 text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="hero-subheading" className="text-xs font-medium">Subheading</Label>
              <Textarea
                id="hero-subheading"
                value={selectedComponent.props.subheading || ''}
                onChange={(e) => handleUpdateProps({ subheading: e.target.value })}
                placeholder="Discover amazing products"
                rows={3}
                className="text-sm resize-none"
              />
            </div>

            <div>
              <Label htmlFor="hero-button" className="text-xs font-medium">Button Text</Label>
              <Input
                id="hero-button"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => handleUpdateProps({ buttonText: e.target.value })}
                placeholder="Shop Now"
                className="h-8 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="hero-bg" className="text-xs font-medium">Background Image</Label>
              <div className="flex gap-2">
                <Input
                  id="hero-bg"
                  value={selectedComponent.props.backgroundImage || ''}
                  onChange={(e) => handleUpdateProps({ backgroundImage: e.target.value })}
                  placeholder="Image URL"
                  className="h-8 text-sm flex-1"
                />
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Upload Image">
                  <Upload className="h-3 w-3" />
                </Button>
              </div>
            </div>
            </CardContent>
          </Card>
        );

      case 'text-section':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                  <Type className="h-3 w-3 text-orange-600" />
                </div>
                Text Section Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="text-heading" className="text-xs font-medium">Heading</Label>
                <Input
                  id="text-heading"
                  value={selectedComponent.props.heading || ''}
                  onChange={(e) => handleUpdateProps({ heading: e.target.value })}
                  placeholder="Section Heading"
                  className="h-8 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="text-content" className="text-xs font-medium">Content</Label>
                <Textarea
                  id="text-content"
                  value={selectedComponent.props.text || ''}
                  onChange={(e) => handleUpdateProps({ text: e.target.value })}
                  placeholder="Your content here..."
                  rows={6}
                  className="text-sm resize-none"
                />
              </div>
            </TabsContent>
            <TabsContent value="layout" className="space-y-4">
              <div>
                <Label htmlFor="text-alignment" className="text-xs font-medium">Alignment</Label>
                <Select
                  value={selectedComponent.props.alignment || 'left'}
                  onValueChange={(value) => handleUpdateProps({ alignment: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium">Spacing</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Top</Label>
                    <Input
                      type="number"
                      value={selectedComponent.props.marginTop || 0}
                      onChange={(e) => handleUpdateProps({ marginTop: parseInt(e.target.value) })}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Bottom</Label>
                    <Input
                      type="number"
                      value={selectedComponent.props.marginBottom || 0}
                      onChange={(e) => handleUpdateProps({ marginBottom: parseInt(e.target.value) })}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );

      case 'product-grid':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 rounded flex items-center justify-center">
                  <Package2 className="h-3 w-3 text-emerald-600" />
                </div>
                Product Grid Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="grid-title" className="text-xs font-medium">Section Title</Label>
                <Input
                  id="grid-title"
                  value={selectedComponent.props.title || ''}
                  onChange={(e) => handleUpdateProps({ title: e.target.value })}
                  placeholder="Featured Products"
                  className="h-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="grid-columns" className="text-xs font-medium">Columns</Label>
                  <Select
                    value={selectedComponent.props.columns?.toString() || '3'}
                    onValueChange={(value) => handleUpdateProps({ columns: parseInt(value) })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="grid-gap" className="text-xs font-medium">Gap</Label>
                  <Select
                    value={selectedComponent.props.gap?.toString() || '4'}
                    onValueChange={(value) => handleUpdateProps({ gap: parseInt(value) })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Small</SelectItem>
                      <SelectItem value="4">Medium</SelectItem>
                      <SelectItem value="6">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-prices" className="text-xs font-medium">Show Prices</Label>
                  <Switch
                    id="show-prices"
                    checked={selectedComponent.props.showPrices || false}
                    onCheckedChange={(checked) => handleUpdateProps({ showPrices: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-cart" className="text-xs font-medium">Add to Cart Button</Label>
                  <Switch
                    id="show-cart"
                    checked={selectedComponent.props.showCartButton || false}
                    onCheckedChange={(checked) => handleUpdateProps({ showCartButton: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'footer':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                  <Share2 className="h-3 w-3 text-slate-600" />
                </div>
                Footer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="footer-text" className="text-xs font-medium">Copyright Text</Label>
                <Input
                  id="footer-text"
                  value={selectedComponent.props.copyrightText || ''}
                  onChange={(e) => handleUpdateProps({ copyrightText: e.target.value })}
                  placeholder="© 2024 Your Store. All rights reserved."
                  className="h-8 text-sm"
                />
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-social" className="text-xs font-medium">Social Links</Label>
                  <Switch
                    id="show-social"
                    checked={selectedComponent.props.showSocialLinks || false}
                    onCheckedChange={(checked) => handleUpdateProps({ showSocialLinks: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-newsletter" className="text-xs font-medium">Newsletter Signup</Label>
                  <Switch
                    id="show-newsletter"
                    checked={selectedComponent.props.showNewsletter || false}
                    onCheckedChange={(checked) => handleUpdateProps({ showNewsletter: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-links" className="text-xs font-medium">Footer Links</Label>
                  <Switch
                    id="show-links"
                    checked={selectedComponent.props.showFooterLinks || false}
                    onCheckedChange={(checked) => handleUpdateProps({ showFooterLinks: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Component Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No content options available for this component type.</p>
                <p className="text-xs mt-1">Component: {selectedComponent.type}</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Component Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Type className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <Badge variant="outline" className="text-xs font-medium bg-white">
              {selectedComponent.type}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Content Properties</p>
          </div>
        </div>
      </div>

      {/* Content Fields */}
      <div className="space-y-4">
        {renderContentFields()}
      </div>
    </div>
  );
} 
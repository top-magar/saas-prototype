'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Type,
  Layout, Maximize,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';
import { PageComponent } from './page-renderer';

interface PropertiesPanelProps {
  selectedComponent: PageComponent | null;
  onUpdateComponent: (id: string, updates: Partial<PageComponent>) => void;
  storeSettings: any;
  onUpdateSettings: (settings: any) => void;
}

export function PropertiesPanel({
  selectedComponent,
  onUpdateComponent,
  storeSettings,
  onUpdateSettings
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('content');

  if (!selectedComponent) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted/20 to-muted/10 rounded-2xl flex items-center justify-center">
            <Settings className="h-8 w-8 opacity-50" />
          </div>
          <h3 className="font-medium mb-2">No Component Selected</h3>
          <p className="text-sm leading-relaxed">Select a component from the canvas to edit its properties and styling options</p>
        </div>
      </div>
    );
  }

  const updateProps = (newProps: any) => {
    onUpdateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, ...newProps }
    });
  };

  const updateStyles = (newStyles: any) => {
    onUpdateComponent(selectedComponent.id, {
      styles: {
        ...selectedComponent.styles,
        base: { ...selectedComponent.styles.base, ...newStyles }
      }
    });
  };

  const renderContentTab = () => {
    switch (selectedComponent.type) {
      case 'navigation':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nav-heading">Logo/Brand Name</Label>
              <Input
                id="nav-heading"
                value={selectedComponent.props.heading || ''}
                onChange={(e) => updateProps({ heading: e.target.value })}
                placeholder="Your Store"
              />
            </div>

            <div>
              <Label>Navigation Links</Label>
              <div className="space-y-2 mt-2">
                {(selectedComponent.props.links || []).map((link: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Link text"
                      value={link.text}
                      onChange={(e) => {
                        const newLinks = [...(selectedComponent.props.links || [])];
                        newLinks[index] = { ...link, text: e.target.value };
                        updateProps({ links: newLinks });
                      }}
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...(selectedComponent.props.links || [])];
                        newLinks[index] = { ...link, url: e.target.value };
                        updateProps({ links: newLinks });
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newLinks = (selectedComponent.props.links || []).filter((_: any, i: number) => i !== index);
                        updateProps({ links: newLinks });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newLinks = [...(selectedComponent.props.links || []), { text: 'New Link', url: '#' }];
                    updateProps({ links: newLinks });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="nav-button">Button Text</Label>
              <Input
                id="nav-button"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => updateProps({ buttonText: e.target.value })}
                placeholder="Shop Now"
              />
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-heading">Main Heading</Label>
              <Input
                id="hero-heading"
                value={selectedComponent.props.heading || ''}
                onChange={(e) => updateProps({ heading: e.target.value })}
                placeholder="Welcome to Our Store"
              />
            </div>

            <div>
              <Label htmlFor="hero-subheading">Subheading</Label>
              <Textarea
                id="hero-subheading"
                value={selectedComponent.props.subheading || ''}
                onChange={(e) => updateProps({ subheading: e.target.value })}
                placeholder="Discover amazing products"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="hero-button">Button Text</Label>
              <Input
                id="hero-button"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => updateProps({ buttonText: e.target.value })}
                placeholder="Shop Now"
              />
            </div>

            <div>
              <Label htmlFor="hero-bg">Background Image URL</Label>
              <Input
                id="hero-bg"
                value={selectedComponent.props.backgroundImage || ''}
                onChange={(e) => updateProps({ backgroundImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-heading">Heading</Label>
              <Input
                id="text-heading"
                value={selectedComponent.props.heading || ''}
                onChange={(e) => updateProps({ heading: e.target.value })}
                placeholder="Section Heading"
              />
            </div>

            <div>
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                value={selectedComponent.props.text || ''}
                onChange={(e) => updateProps({ text: e.target.value })}
                placeholder="Your content here..."
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="text-alignment">Text Alignment</Label>
              <Select
                value={selectedComponent.props.alignment || 'left'}
                onValueChange={(value) => updateProps({ alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={selectedComponent.props.imageUrl || ''}
                onChange={(e) => updateProps({ imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={selectedComponent.props.alt || ''}
                onChange={(e) => updateProps({ alt: e.target.value })}
                placeholder="Image description"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="image-overlay"
                checked={selectedComponent.props.overlay || false}
                onCheckedChange={(checked) => updateProps({ overlay: checked })}
              />
              <Label htmlFor="image-overlay">Show Text Overlay</Label>
            </div>

            {selectedComponent.props.overlay && (
              <>
                <div>
                  <Label htmlFor="overlay-text">Overlay Text</Label>
                  <Input
                    id="overlay-text"
                    value={selectedComponent.props.overlayText || ''}
                    onChange={(e) => updateProps({ overlayText: e.target.value })}
                    placeholder="Overlay text"
                  />
                </div>

                <div>
                  <Label htmlFor="overlay-button">Button Text</Label>
                  <Input
                    id="overlay-button"
                    value={selectedComponent.props.overlayButton || ''}
                    onChange={(e) => updateProps({ overlayButton: e.target.value })}
                    placeholder="Button text"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'products':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="products-heading">Section Heading</Label>
              <Input
                id="products-heading"
                value={selectedComponent.props.heading || ''}
                onChange={(e) => updateProps({ heading: e.target.value })}
                placeholder="Featured Products"
              />
            </div>

            <div>
              <Label htmlFor="products-columns">Columns</Label>
              <Select
                value={String(selectedComponent.props.columns || 3)}
                onValueChange={(value) => updateProps({ columns: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-price"
                  checked={selectedComponent.props.showPrice !== false}
                  onCheckedChange={(checked) => updateProps({ showPrice: checked })}
                />
                <Label htmlFor="show-price">Show Prices</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-rating"
                  checked={selectedComponent.props.showRating || false}
                  onCheckedChange={(checked) => updateProps({ showRating: checked })}
                />
                <Label htmlFor="show-rating">Show Ratings</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-cart"
                  checked={selectedComponent.props.showAddToCart || false}
                  onCheckedChange={(checked) => updateProps({ showAddToCart: checked })}
                />
                <Label htmlFor="show-cart">Show Add to Cart</Label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-muted-foreground">
            <p>No content options available for this component type.</p>
          </div>
        );
    }
  };

  const renderStyleTab = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bg-color">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="bg-color"
            type="color"
            value={selectedComponent.styles.base?.backgroundColor || '#ffffff'}
            onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
            className="w-16 h-10 p-1"
          />
          <Input
            value={selectedComponent.styles.base?.backgroundColor || '#ffffff'}
            onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="text-color">Text Color</Label>
        <div className="flex gap-2">
          <Input
            id="text-color"
            type="color"
            value={selectedComponent.styles.base?.color || '#000000'}
            onChange={(e) => updateStyles({ color: e.target.value })}
            className="w-16 h-10 p-1"
          />
          <Input
            value={selectedComponent.styles.base?.color || '#000000'}
            onChange={(e) => updateStyles({ color: e.target.value })}
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <Label>Padding</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label htmlFor="padding-top" className="text-xs">Top</Label>
            <Input
              id="padding-top"
              value={selectedComponent.styles.base?.paddingTop || ''}
              onChange={(e) => updateStyles({ paddingTop: e.target.value })}
              placeholder="0px"
            />
          </div>
          <div>
            <Label htmlFor="padding-bottom" className="text-xs">Bottom</Label>
            <Input
              id="padding-bottom"
              value={selectedComponent.styles.base?.paddingBottom || ''}
              onChange={(e) => updateStyles({ paddingBottom: e.target.value })}
              placeholder="0px"
            />
          </div>
          <div>
            <Label htmlFor="padding-left" className="text-xs">Left</Label>
            <Input
              id="padding-left"
              value={selectedComponent.styles.base?.paddingLeft || ''}
              onChange={(e) => updateStyles({ paddingLeft: e.target.value })}
              placeholder="0px"
            />
          </div>
          <div>
            <Label htmlFor="padding-right" className="text-xs">Right</Label>
            <Input
              id="padding-right"
              value={selectedComponent.styles.base?.paddingRight || ''}
              onChange={(e) => updateStyles({ paddingRight: e.target.value })}
              placeholder="0px"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Margin</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label htmlFor="margin-top" className="text-xs">Top</Label>
            <Input
              id="margin-top"
              value={selectedComponent.styles.base?.marginTop || ''}
              onChange={(e) => updateStyles({ marginTop: e.target.value })}
              placeholder="0px"
            />
          </div>
          <div>
            <Label htmlFor="margin-bottom" className="text-xs">Bottom</Label>
            <Input
              id="margin-bottom"
              value={selectedComponent.styles.base?.marginBottom || ''}
              onChange={(e) => updateStyles({ marginBottom: e.target.value })}
              placeholder="0px"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="border-radius">Border Radius</Label>
        <Input
          id="border-radius"
          value={selectedComponent.styles.base?.borderRadius || ''}
          onChange={(e) => updateStyles({ borderRadius: e.target.value })}
          placeholder="0px"
        />
      </div>

      <div>
        <Label htmlFor="text-align">Text Alignment</Label>
        <Select
          value={selectedComponent.styles.base?.textAlign || 'left'}
          onValueChange={(value) => updateStyles({ textAlign: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="justify">Justify</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary">
                {selectedComponent.type}
              </Badge>
            </div>
            <h3 className="text-sm font-semibold">Component Properties</h3>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-2 gap-1 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="content" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Type className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Palette className="h-4 w-4 mr-2" />
              Style
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-4 pb-4">
            <TabsContent value="content" className="mt-0 space-y-4">
              <div className="bg-muted/20 rounded-xl p-4">
                {renderContentTab()}
              </div>
            </TabsContent>

            <TabsContent value="style" className="mt-0 space-y-4">
              <div className="bg-muted/20 rounded-xl p-4">
                {renderStyleTab()}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
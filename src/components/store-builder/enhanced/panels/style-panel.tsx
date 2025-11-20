'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Palette, Paintbrush, Type, Box, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStoreBuilder } from '@/lib/store-builder/store';

export function StylePanel() {
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
        <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a component to edit styles</p>
      </div>
    );
  }

  const handleUpdateStyles = (newStyles: any) => {
    if (!currentPageId || !selectedComponentId) return;
    
    updateComponent(currentPageId, selectedComponentId, {
      styles: {
        ...selectedComponent.styles,
        base: { ...selectedComponent.styles.base, ...newStyles }
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Component Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <Badge variant="outline" className="text-xs font-medium bg-white">
              {selectedComponent.type}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Style Properties</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="spacing">Layout</TabsTrigger>
          <TabsTrigger value="typography">Text</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Paintbrush className="h-4 w-4" />
                Color Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
        
        <div>
          <Label htmlFor="bg-color" className="text-xs">Background</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="bg-color"
              type="color"
              value={selectedComponent.styles.base?.backgroundColor || '#ffffff'}
              onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              value={selectedComponent.styles.base?.backgroundColor || '#ffffff'}
              onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="text-color" className="text-xs">Text Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="text-color"
              type="color"
              value={selectedComponent.styles.base?.color || '#000000'}
              onChange={(e) => handleUpdateStyles({ color: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              value={selectedComponent.styles.base?.color || '#000000'}
              onChange={(e) => handleUpdateStyles({ color: e.target.value })}
              placeholder="#000000"
              className="h-8 text-sm"
            />
          </div>
        </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spacing" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Box className="h-4 w-4" />
                Layout & Spacing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
        
        <div>
          <Label className="text-xs">Padding</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <Label htmlFor="padding-top" className="text-xs text-muted-foreground">Top</Label>
              <Input
                id="padding-top"
                value={selectedComponent.styles.base?.paddingTop || ''}
                onChange={(e) => handleUpdateStyles({ paddingTop: e.target.value })}
                placeholder="0px"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="padding-bottom" className="text-xs text-muted-foreground">Bottom</Label>
              <Input
                id="padding-bottom"
                value={selectedComponent.styles.base?.paddingBottom || ''}
                onChange={(e) => handleUpdateStyles({ paddingBottom: e.target.value })}
                placeholder="0px"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="padding-left" className="text-xs text-muted-foreground">Left</Label>
              <Input
                id="padding-left"
                value={selectedComponent.styles.base?.paddingLeft || ''}
                onChange={(e) => handleUpdateStyles({ paddingLeft: e.target.value })}
                placeholder="0px"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="padding-right" className="text-xs text-muted-foreground">Right</Label>
              <Input
                id="padding-right"
                value={selectedComponent.styles.base?.paddingRight || ''}
                onChange={(e) => handleUpdateStyles({ paddingRight: e.target.value })}
                placeholder="0px"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs">Margin</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <Label htmlFor="margin-top" className="text-xs text-muted-foreground">Top</Label>
              <Input
                id="margin-top"
                value={selectedComponent.styles.base?.marginTop || ''}
                onChange={(e) => handleUpdateStyles({ marginTop: e.target.value })}
                placeholder="0px"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="margin-bottom" className="text-xs text-muted-foreground">Bottom</Label>
              <Input
                id="margin-bottom"
                value={selectedComponent.styles.base?.marginBottom || ''}
                onChange={(e) => handleUpdateStyles({ marginBottom: e.target.value })}
                placeholder="0px"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
        
        <div>
          <Label htmlFor="font-size" className="text-xs">Font Size</Label>
          <Input
            id="font-size"
            value={selectedComponent.styles.base?.fontSize || ''}
            onChange={(e) => handleUpdateStyles({ fontSize: e.target.value })}
            placeholder="16px"
            className="h-8 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="font-weight" className="text-xs">Font Weight</Label>
          <Select
            value={selectedComponent.styles.base?.fontWeight || 'normal'}
            onValueChange={(value) => handleUpdateStyles({ fontWeight: value })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="lighter">Lighter</SelectItem>
              <SelectItem value="bolder">Bolder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="text-align" className="text-xs">Text Align</Label>
          <Select
            value={selectedComponent.styles.base?.textAlign || 'left'}
            onValueChange={(value) => handleUpdateStyles({ textAlign: value })}
          >
            <SelectTrigger className="h-8">
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Effects & Borders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
        
        <div>
          <Label htmlFor="border-radius" className="text-xs">Border Radius</Label>
          <Input
            id="border-radius"
            value={selectedComponent.styles.base?.borderRadius || ''}
            onChange={(e) => handleUpdateStyles({ borderRadius: e.target.value })}
            placeholder="0px"
            className="h-8 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="box-shadow" className="text-xs">Box Shadow</Label>
          <Input
            id="box-shadow"
            value={selectedComponent.styles.base?.boxShadow || ''}
            onChange={(e) => handleUpdateStyles({ boxShadow: e.target.value })}
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
            className="h-8 text-sm"
          />
        </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
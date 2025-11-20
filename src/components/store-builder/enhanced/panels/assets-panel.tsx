'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload,
  Search,
  Image,
  Video,
  FileText,
  Trash2,
  Download,
  MoreHorizontal,
  FolderOpen
} from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';

const mockAssets = [
  {
    id: '1',
    name: 'hero-image.jpg',
    url: '/images/hero.jpg',
    type: 'image' as const,
    size: 245760,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'product-video.mp4',
    url: '/videos/product.mp4',
    type: 'video' as const,
    size: 5242880,
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    name: 'brand-logo.svg',
    url: '/images/logo.svg',
    type: 'image' as const,
    size: 12288,
    createdAt: '2024-01-13'
  }
];

export function AssetsPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  const { assets, addAsset, deleteAsset } = useStoreBuilder();

  // Use mock data if no assets in store
  const displayAssets = assets.length > 0 ? assets : mockAssets;

  const filteredAssets = displayAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const handleUpload = () => {
    // Mock upload functionality
    const newAsset = {
      id: `asset-${Date.now()}`,
      name: 'new-image.jpg',
      url: '/images/new-image.jpg',
      type: 'image' as const,
      size: 156789,
      createdAt: new Date().toISOString().split('T')[0]
    };
    addAsset(newAsset);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Upload Button */}
      <Button onClick={handleUpload} className="w-full justify-start h-9">
        <Upload className="h-4 w-4 mr-2" />
        Upload Assets
      </Button>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-9"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1">
        {['all', 'image', 'video', 'document'].map(type => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type)}
            className="text-xs h-7 capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="space-y-2">
        {filteredAssets.map(asset => {
          const Icon = getAssetIcon(asset.type);
          
          return (
            <div
              key={asset.id}
              className="group border rounded-lg p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/50 rounded-lg">
                  {asset.type === 'image' ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                  ) : (
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{asset.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {asset.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(asset.size)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {asset.createdAt}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={() => deleteAsset(asset.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No assets found</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload your first asset
          </Button>
        </div>
      )}

      {/* Storage Info */}
      <div className="mt-6 p-3 bg-muted/30 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Storage</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Used:</span>
            <span>2.4 MB / 100 MB</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '2.4%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
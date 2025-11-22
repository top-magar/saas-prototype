'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Share2
} from 'lucide-react';
import { PageRenderer } from '@/components/store-builder/enhanced/page-renderer';
import type { DeviceType, PageComponent } from '@/lib/store-builder/types';

export default function StorePreviewPage() {
  const [previewData, setPreviewData] = useState<{
    components: PageComponent[];
    settings: any;
    deviceType: DeviceType;
  } | null>(null);
  const [currentDevice, setCurrentDevice] = useState<DeviceType>('desktop');

  useEffect(() => {
    // Get preview data from sessionStorage
    const data = sessionStorage.getItem('storePreview');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setPreviewData(parsed);
        setCurrentDevice(parsed.deviceType || 'desktop');
      } catch (error) {
        console.error('Failed to parse preview data:', error);
      }
    }
  }, []);

  const handleGoBack = () => {
    window.close();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: previewData?.settings?.storeName || 'Store Preview',
        text: 'Check out this store preview',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getDeviceIcon = (device: DeviceType) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getDeviceWidth = (device: DeviceType) => {
    switch (device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">No Preview Data</h1>
          <p className="text-gray-600 mb-4">
            Unable to load store preview. Please go back to the store builder.
          </p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">Preview</Badge>
            <span className="text-sm font-medium">
              {previewData.settings?.storeName || 'Store Preview'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="flex items-center border rounded-lg p-1">
            {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((device) => (
              <Button
                key={device}
                variant={currentDevice === device ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentDevice(device)}
                className="h-8 w-8 p-0"
              >
                {getDeviceIcon(device)}
              </Button>
            ))}
          </div>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Button onClick={() => window.open('/', '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Live Site
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div
          className="mx-auto bg-white shadow-lg transition-all duration-300"
          style={{
            width: getDeviceWidth(currentDevice),
            minHeight: '100vh'
          }}
        >
          {previewData.components.length > 0 ? (
            <PageRenderer
              components={previewData.components}
              deviceType={currentDevice}
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-semibold mb-2">Empty Store</h3>
                <p className="text-gray-600">
                  No components to preview. Add some components in the builder.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Footer */}
      <div className="bg-white border-t p-2 text-center text-xs text-gray-500">
        Store Builder Preview - This is how your store will look to customers
      </div>
    </div>
  );
}
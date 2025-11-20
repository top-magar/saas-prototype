'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';
import { DeviceType } from '@/lib/store-builder/types';

export function ResponsivePanel() {
  const {
    pages,
    currentPageId,
    selectedComponentId,
    deviceType,
    setDeviceType
  } = useStoreBuilder();

  const currentPage = pages.find(p => p.id === currentPageId);
  const selectedComponent = currentPage?.components.find(c => c.id === selectedComponentId);

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a component to edit responsive styles</p>
      </div>
    );
  }

  const devices: { type: DeviceType; label: string; icon: any; width: string }[] = [
    { type: 'desktop', label: 'Desktop', icon: Monitor, width: '1200px+' },
    { type: 'tablet', label: 'Tablet', icon: Tablet, width: '768px - 1199px' },
    { type: 'mobile', label: 'Mobile', icon: Smartphone, width: '< 768px' }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Component Info */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-xs">
          {selectedComponent.type}
        </Badge>
        <span className="text-xs text-muted-foreground">Responsive Settings</span>
      </div>

      <Separator />

      {/* Device Selector */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Preview Device</h4>
        
        <div className="space-y-2">
          {devices.map((device) => (
            <div
              key={device.type}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                deviceType === device.type
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => setDeviceType(device.type)}
            >
              <div className="flex items-center gap-3">
                <device.icon className={`h-4 w-4 ${
                  deviceType === device.type ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <div className="flex-1">
                  <div className={`font-medium text-sm ${
                    deviceType === device.type ? 'text-primary' : 'text-foreground'
                  }`}>
                    {device.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {device.width}
                  </div>
                </div>
                {deviceType === device.type && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Responsive Styles Info */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Responsive Styles</h4>
        
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">
            Currently editing styles for <strong>{deviceType}</strong> devices.
          </p>
          <p className="text-xs text-muted-foreground">
            Changes made in the Style panel will apply to the selected device breakpoint.
          </p>
        </div>
      </div>

      <Separator />

      {/* Breakpoint Info */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Breakpoint Information</h4>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mobile:</span>
            <span>0px - 767px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tablet:</span>
            <span>768px - 1199px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Desktop:</span>
            <span>1200px+</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Quick Actions</h4>
        
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            Copy Desktop Styles
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            Reset Mobile Styles
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            Hide on Mobile
          </Button>
        </div>
      </div>
    </div>
  );
}
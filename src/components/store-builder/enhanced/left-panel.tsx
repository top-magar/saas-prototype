'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText,
  Layout,
  Package2,
  FolderOpen,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStoreBuilder } from '@/lib/store-builder/store';
import { PagesPanel } from './panels/pages-panel';
import { TemplatesPanel } from './panels/templates-panel';
import { ComponentsPanel } from './panels/components-panel';
import { AssetsPanel } from './panels/assets-panel';
import { StoreSettingsPanel } from './panels/store-settings-panel';

const leftPanelTabs = [
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'templates', label: 'Templates', icon: Layout },
  { id: 'components', label: 'Components', icon: Package2 },
  { id: 'assets', label: 'Assets', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export function LeftPanel() {
  const {
    leftPanelTab,
    isLeftPanelCollapsed,
    setLeftPanelTab,
    toggleLeftPanel
  } = useStoreBuilder();

  const renderPanelContent = () => {
    switch (leftPanelTab) {
      case 'pages':
        return <PagesPanel />;
      case 'templates':
        return <TemplatesPanel />;
      case 'components':
        return <ComponentsPanel />;
      case 'assets':
        return <AssetsPanel />;
      case 'settings':
        return <StoreSettingsPanel />;
      default:
        return <ComponentsPanel />;
    }
  };

  if (isLeftPanelCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLeftPanel}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator />
        
        <div className="flex-1 flex flex-col gap-1 p-2">
          {leftPanelTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={leftPanelTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setLeftPanelTab(tab.id);
                toggleLeftPanel();
              }}
              className="w-8 h-8 p-0"
              title={tab.label}
            >
              <tab.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="h-12 border-b flex items-center justify-between px-4">
        <h2 className="font-semibold text-sm">
          {leftPanelTabs.find(tab => tab.id === leftPanelTab)?.label}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLeftPanel}
          className="w-8 h-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {leftPanelTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={leftPanelTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLeftPanelTab(tab.id)}
              className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {renderPanelContent()}
      </ScrollArea>
    </div>
  );
}
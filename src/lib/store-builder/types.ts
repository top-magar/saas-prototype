export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  createdAt: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  components: PageComponent[];
  seoSettings: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface PageComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  styles: {
    base: Record<string, any>;
    responsive?: {
      mobile?: Record<string, any>;
      tablet?: Record<string, any>;
      desktop?: Record<string, any>;
    };
  };
  children: PageComponent[];
}

export interface StoreSettings {
  storeName: string;
  domain: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  seo: {
    title: string;
    description: string;
    favicon: string;
  };
}

export interface HistoryState {
  pages: Page[];
  timestamp: number;
  action: string;
}

export interface StoreBuilderState {
  // Core data
  pages: Page[];
  currentPageId: string;
  selectedComponentId: string | null;
  assets: Asset[];
  settings: StoreSettings;
  
  // UI state
  deviceType: DeviceType;
  zoom: number;
  leftPanelTab: string;
  rightPanelTab: string;
  isLeftPanelCollapsed: boolean;
  isRightPanelCollapsed: boolean;
  
  // History
  history: HistoryState[];
  historyIndex: number;
  
  // Loading states
  isSaving: boolean;
  isPublishing: boolean;
}
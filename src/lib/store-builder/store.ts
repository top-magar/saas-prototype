import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { StoreBuilderState, Page, PageComponent, Asset, HistoryState, DeviceType } from './types';

interface StoreBuilderActions {
  // Page management
  addPage: (page: Omit<Page, 'id'>) => void;
  deletePage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  setCurrentPage: (pageId: string) => void;
  
  // Component management
  addComponent: (pageId: string, component: PageComponent) => void;
  updateComponent: (pageId: string, componentId: string, updates: Partial<PageComponent>) => void;
  deleteComponent: (pageId: string, componentId: string) => void;
  moveComponent: (pageId: string, fromIndex: number, toIndex: number) => void;
  setSelectedComponent: (componentId: string | null) => void;
  
  // Asset management
  addAsset: (asset: Asset) => void;
  deleteAsset: (assetId: string) => void;
  
  // UI state
  setDeviceType: (device: DeviceType) => void;
  setZoom: (zoom: number) => void;
  setLeftPanelTab: (tab: string) => void;
  setRightPanelTab: (tab: string) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  addToHistory: (action: string) => void;
  
  // Actions
  save: () => Promise<void>;
  publish: () => Promise<void>;
  
  // Reset
  reset: () => void;
}

const initialState: StoreBuilderState = {
  pages: [{
    id: 'home',
    name: 'Home',
    slug: '/',
    components: [],
    seoSettings: {
      title: 'Home',
      description: '',
      keywords: []
    }
  }],
  currentPageId: 'home',
  selectedComponentId: null,
  assets: [],
  settings: {
    storeName: 'My Store',
    domain: '',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter'
    },
    seo: {
      title: 'My Store',
      description: '',
      favicon: ''
    }
  },
  deviceType: 'desktop',
  zoom: 100,
  leftPanelTab: 'components',
  rightPanelTab: 'content',
  isLeftPanelCollapsed: false,
  isRightPanelCollapsed: false,
  history: [],
  historyIndex: -1,
  isSaving: false,
  isPublishing: false
};

export const useStoreBuilder = create<StoreBuilderState & StoreBuilderActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Page management
      addPage: (page) => {
        const newPage: Page = {
          ...page,
          id: `page-${Date.now()}`
        };
        set((state) => ({
          pages: [...state.pages, newPage],
          currentPageId: newPage.id
        }));
        get().addToHistory('Add page');
      },
      
      deletePage: (pageId) => {
        const state = get();
        if (state.pages.length <= 1) return; // Keep at least one page
        
        const newPages = state.pages.filter(p => p.id !== pageId);
        const newCurrentPageId = state.currentPageId === pageId 
          ? newPages[0].id 
          : state.currentPageId;
          
        set({
          pages: newPages,
          currentPageId: newCurrentPageId,
          selectedComponentId: null
        });
        get().addToHistory('Delete page');
      },
      
      updatePage: (pageId, updates) => {
        set((state) => ({
          pages: state.pages.map(p => 
            p.id === pageId ? { ...p, ...updates } : p
          )
        }));
        get().addToHistory('Update page');
      },
      
      setCurrentPage: (pageId) => {
        set({ currentPageId: pageId, selectedComponentId: null });
      },
      
      // Component management
      addComponent: (pageId, component) => {
        set((state) => ({
          pages: state.pages.map(p => 
            p.id === pageId 
              ? { ...p, components: [...p.components, component] }
              : p
          ),
          selectedComponentId: component.id
        }));
        get().addToHistory('Add component');
      },
      
      updateComponent: (pageId, componentId, updates) => {
        set((state) => ({
          pages: state.pages.map(p => 
            p.id === pageId 
              ? {
                  ...p,
                  components: p.components.map(c => 
                    c.id === componentId ? { ...c, ...updates } : c
                  )
                }
              : p
          )
        }));
        get().addToHistory('Update component');
      },
      
      deleteComponent: (pageId, componentId) => {
        set((state) => ({
          pages: state.pages.map(p => 
            p.id === pageId 
              ? { ...p, components: p.components.filter(c => c.id !== componentId) }
              : p
          ),
          selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId
        }));
        get().addToHistory('Delete component');
      },
      
      moveComponent: (pageId, fromIndex, toIndex) => {
        set((state) => ({
          pages: state.pages.map(p => {
            if (p.id !== pageId) return p;
            
            const newComponents = [...p.components];
            const [movedComponent] = newComponents.splice(fromIndex, 1);
            newComponents.splice(toIndex, 0, movedComponent);
            
            return { ...p, components: newComponents };
          })
        }));
        get().addToHistory('Move component');
      },
      
      setSelectedComponent: (componentId) => {
        set({ selectedComponentId: componentId });
      },
      
      // Asset management
      addAsset: (asset) => {
        set((state) => ({
          assets: [...state.assets, asset]
        }));
      },
      
      deleteAsset: (assetId) => {
        set((state) => ({
          assets: state.assets.filter(a => a.id !== assetId)
        }));
      },
      
      // UI state
      setDeviceType: (device) => set({ deviceType: device }),
      setZoom: (zoom) => set({ zoom }),
      setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      toggleLeftPanel: () => set((state) => ({ isLeftPanelCollapsed: !state.isLeftPanelCollapsed })),
      toggleRightPanel: () => set((state) => ({ isRightPanelCollapsed: !state.isRightPanelCollapsed })),
      
      // History
      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const prevState = state.history[state.historyIndex - 1];
          set({
            pages: prevState.pages,
            historyIndex: state.historyIndex - 1
          });
        }
      },
      
      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const nextState = state.history[state.historyIndex + 1];
          set({
            pages: nextState.pages,
            historyIndex: state.historyIndex + 1
          });
        }
      },
      
      addToHistory: (action) => {
        const state = get();
        const historyEntry: HistoryState = {
          pages: JSON.parse(JSON.stringify(state.pages)),
          timestamp: Date.now(),
          action
        };
        
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(historyEntry);
        
        // Keep only last 50 history entries
        if (newHistory.length > 50) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },
      
      // Actions
      save: async () => {
        set({ isSaving: true });
        try {
          // Implement save logic here
          await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
          set({ isSaving: false });
        }
      },
      
      publish: async () => {
        set({ isPublishing: true });
        try {
          // Implement publish logic here
          await new Promise(resolve => setTimeout(resolve, 2000));
        } finally {
          set({ isPublishing: false });
        }
      },
      
      // Reset
      reset: () => set(initialState)
    }),
    { name: 'store-builder' }
  )
);
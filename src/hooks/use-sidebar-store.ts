import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      openMobile: () => set({ isMobileOpen: true }),
      closeMobile: () => set({ isMobileOpen: false }),
    }),
    {
      name: 'sidebar-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
      // Optionally, specify which parts of the state to persist
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
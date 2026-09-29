import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  /** Desktop sidebar collapsed to icons. */
  sidebarCollapsed: boolean;
  /** Mobile sidebar sheet open. */
  mobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
    }),
    {
      name: "courier-ui",
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
      skipHydration: true, // rehydrated after mount by StoreHydrator
    },
  ),
);

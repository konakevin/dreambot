import { create } from 'zustand';

interface ExploreStore {
  pendingMedium: string | null;
  pendingVibe: string | null;
  searchActive: boolean;
  setFilters: (medium: string | null, vibe: string | null) => void;
  clearPending: () => void;
  setSearchActive: (active: boolean) => void;
}

export const useExploreStore = create<ExploreStore>((set) => ({
  pendingMedium: null,
  pendingVibe: null,
  searchActive: false,
  setFilters: (medium, vibe) => set({ pendingMedium: medium, pendingVibe: vibe }),
  clearPending: () => set({ pendingMedium: null, pendingVibe: null }),
  setSearchActive: (active) => set({ searchActive: active }),
}));

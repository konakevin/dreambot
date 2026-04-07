import { create } from 'zustand';

interface ExploreStore {
  pendingMedium: string | null;
  pendingVibe: string | null;
  setFilters: (medium: string | null, vibe: string | null) => void;
  clearPending: () => void;
}

export const useExploreStore = create<ExploreStore>((set) => ({
  pendingMedium: null,
  pendingVibe: null,
  setFilters: (medium, vibe) => set({ pendingMedium: medium, pendingVibe: vibe }),
  clearPending: () => set({ pendingMedium: null, pendingVibe: null }),
}));

import { create } from 'zustand';

export interface FusionTarget {
  postId: string;
  prompt: string;
  imageUrl: string;
  username: string;
  userId: string;
  recipeId: string | null; // ID in recipe_registry table
}

interface FusionStore {
  target: FusionTarget | null;
  setTarget: (target: FusionTarget | null) => void;
  clear: () => void;
}

export const useFusionStore = create<FusionStore>((set) => ({
  target: null,
  setTarget: (target) => set({ target }),
  clear: () => set({ target: null }),
}));

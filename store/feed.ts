import { create } from 'zustand';
import type { DreamPostItem } from '@/components/DreamCard';

export interface FeedStore {
  // Pinned post — shows as first card on home feed (e.g. deep link, first dream after onboarding)
  pinnedPost: DreamPostItem | null;
  setPinnedPost: (post: DreamPostItem | null) => void;
  // Feed refresh tokens
  resetToken: number;
  bumpReset: () => void;
  refreshToken: number;
  bumpRefresh: () => void;
  // Session seed for feed shuffle
  feedSeed: number;
  regenerateSeed: () => void;
  // Profile tab reset
  profileResetToken: number;
  bumpProfileReset: () => void;
  // Active tab tracking (for programmatic navigation)
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Deep link — post ID to pin when the home screen is ready
  pendingPostId: string | null;
  setPendingPostId: (id: string | null) => void;
  // HUD visibility — toggled by single tap on feed cards
  hudVisible: boolean;
  setHudVisible: (visible: boolean) => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  pinnedPost: null,
  setPinnedPost: (post) => set({ pinnedPost: post }),
  resetToken: 0,
  bumpReset: () => set((s) => ({ resetToken: s.resetToken + 1 })),
  refreshToken: 0,
  bumpRefresh: () => set((s) => ({ refreshToken: s.refreshToken + 1 })),
  feedSeed: Math.random(),
  regenerateSeed: () => set({ feedSeed: Math.random() }),
  profileResetToken: 0,
  bumpProfileReset: () => set((s) => ({ profileResetToken: s.profileResetToken + 1 })),
  activeTab: 'index',
  setActiveTab: (tab) => set({ activeTab: tab }),
  pendingPostId: null,
  setPendingPostId: (id) => set({ pendingPostId: id }),
  hudVisible: true,
  setHudVisible: (visible) => set({ hudVisible: visible }),
}));

import { create } from 'zustand';

export interface PinnedPost {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  username: string;
  avatar_url: string | null;
  created_at: string;
  comment_count: number;
}

export interface FeedStore {
  // Pinned post — shows as first card on home feed (e.g. first dream after onboarding)
  pinnedPost: PinnedPost | null;
  setPinnedPost: (post: PinnedPost | null) => void;
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
}));

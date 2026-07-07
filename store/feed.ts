import { create } from 'zustand';
import type { DreamPostItem } from '@/components/DreamCard';
import type { NotificationRouteData } from '@/lib/notificationRouting';

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
  // Home tab tap-to-top reset (Instagram-style: re-tap active tab → scroll-to-top + refetch)
  homeFeedResetToken: number;
  bumpHomeFeedReset: () => void;
  // Top tab (explore grid) tap-to-top reset
  topGridResetToken: number;
  bumpTopGridReset: () => void;
  // Bots tab re-tap reset — re-tap active Bots tab → reset selection to "All"
  // + clear per-bot scroll memory (feed refresh rides on regenerateSeed).
  botsResetToken: number;
  bumpBotsReset: () => void;
  // Active tab tracking (for programmatic navigation)
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Deep link — post ID to pin when the home screen is ready
  pendingPostId: string | null;
  setPendingPostId: (id: string | null) => void;
  // Push-notification tap that arrived while user was signed OUT. Stashed
  // here so a post-auth consumer effect in app/_layout.tsx can replay the
  // tap once the user signs in. See lib/notificationRouting.ts.
  pendingNotificationData: NotificationRouteData | null;
  setPendingNotificationData: (data: NotificationRouteData | null) => void;
  // HUD visibility — toggled by single tap on feed cards
  hudVisible: boolean;
  setHudVisible: (visible: boolean) => void;
  // True while the user is actively watching their OWN Profile → Dreams grid
  // (focused + Dreams sub-tab). When set, a dream that arrives via realtime is
  // auto-acknowledged (marked seen, no bell/badge, no toast) since the user is
  // literally watching it slide into the grid — the inbox row is still written
  // as pre-read history. Set by app/(tabs)/profile.tsx; read in app/_layout.tsx.
  viewingOwnDreams: boolean;
  setViewingOwnDreams: (viewing: boolean) => void;
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
  homeFeedResetToken: 0,
  bumpHomeFeedReset: () => set((s) => ({ homeFeedResetToken: s.homeFeedResetToken + 1 })),
  topGridResetToken: 0,
  bumpTopGridReset: () => set((s) => ({ topGridResetToken: s.topGridResetToken + 1 })),
  botsResetToken: 0,
  bumpBotsReset: () => set((s) => ({ botsResetToken: s.botsResetToken + 1 })),
  activeTab: 'index',
  setActiveTab: (tab) => set({ activeTab: tab }),
  pendingPostId: null,
  setPendingPostId: (id) => set({ pendingPostId: id }),
  pendingNotificationData: null,
  setPendingNotificationData: (data) => set({ pendingNotificationData: data }),
  hudVisible: true,
  setHudVisible: (visible) => set({ hudVisible: visible }),
  viewingOwnDreams: false,
  setViewingOwnDreams: (viewing) => set({ viewingOwnDreams: viewing }),
}));

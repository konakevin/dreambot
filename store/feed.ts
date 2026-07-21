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
  /** Seed jitter weight passed to get_feed (mig 352): 0.10 cold-load default,
   *  MANUAL_FEED_SHUFFLE after any manual refresh so reshuffles visibly reorder. */
  feedShuffle: number;
  regenerateSeed: () => void;
  /** Raise shuffle strength to the manual-refresh level BEFORE prefetching —
   *  the prefetch and the mounted query must see the same value. */
  bumpShuffle: () => void;
  /** Set a SPECIFIC seed (used by pull-to-refresh: prefetch the new seed's feed,
   *  then swap to it here so the reshuffle is instant with no loading flash). */
  setFeedSeed: (seed: number) => void;
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
  // True while a Home-feed reshuffle (re-tap or pull) is prefetching the new
  // seed. The tab bar swaps the home icon for a small spinner; the feed itself
  // stays fully visible and untouched until the swap commits (2026-07-21 —
  // replaces the heavy full-screen opaque cover during the network wait).
  homeFeedRefreshing: boolean;
  setHomeFeedRefreshing: (v: boolean) => void;
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

// TIKTOK-STYLE COLD OPEN (2026-07-21, Kevin's call after the fossil saga): the
// feed seed is RANDOM per launch, so every app open fetches a fresh,
// impression-penalty-aware ordering — the brand spinner covers the ~0.5-1s
// cold fetch. The old FIXED cold seed existed to key-match the persisted feed
// cache for an instant first paint, but that instant paint was the root of
// "the same landing feed on every open, 10/10 times": staleTime Infinity
// meant the cached entry NEVER refetched, and every in-place/swap scheme to
// freshen it behind the paint janked (see the reverted launch-reshuffle).
// The feed is no longer persisted at all (lib/queryClient.ts PERSISTED_ROOTS).

/** Manual-refresh shuffle strength. Was 0.45 (mig 352, pre-seen-penalty brute
 *  variety); with impression discounting live (mig 388) that much noise made
 *  the mid-feed a random draw over months-old catalog, so the server clamps
 *  jitter to 0.15 (mig 389) and the client constant matches. Exported so the
 *  reshuffle prefetch can build its cache key at this strength WITHOUT
 *  pre-bumping the store (the bump lands atomically via setFeedSeed). */
export const MANUAL_FEED_SHUFFLE = 0.15;

export const useFeedStore = create<FeedStore>((set) => ({
  pinnedPost: null,
  setPinnedPost: (post) => set({ pinnedPost: post }),
  resetToken: 0,
  bumpReset: () => set((s) => ({ resetToken: s.resetToken + 1 })),
  refreshToken: 0,
  bumpRefresh: () => set((s) => ({ refreshToken: s.refreshToken + 1 })),
  feedSeed: Math.random(), // fresh ordering every launch (cold-open model)
  // One shuffle strength everywhere now (the cold-vs-manual split existed to
  // keep the FIXED cold seed deterministic — moot with a random launch seed).
  // The server clamps to 0.15 regardless (mig 389).
  feedShuffle: MANUAL_FEED_SHUFFLE,
  regenerateSeed: () => set({ feedSeed: Math.random(), feedShuffle: MANUAL_FEED_SHUFFLE }),
  bumpShuffle: () => set({ feedShuffle: MANUAL_FEED_SHUFFLE }),
  setFeedSeed: (seed) => set({ feedSeed: seed, feedShuffle: MANUAL_FEED_SHUFFLE }),
  profileResetToken: 0,
  bumpProfileReset: () => set((s) => ({ profileResetToken: s.profileResetToken + 1 })),
  homeFeedResetToken: 0,
  bumpHomeFeedReset: () => set((s) => ({ homeFeedResetToken: s.homeFeedResetToken + 1 })),
  topGridResetToken: 0,
  bumpTopGridReset: () => set((s) => ({ topGridResetToken: s.topGridResetToken + 1 })),
  botsResetToken: 0,
  bumpBotsReset: () => set((s) => ({ botsResetToken: s.botsResetToken + 1 })),
  homeFeedRefreshing: false,
  setHomeFeedRefreshing: (v) => set({ homeFeedRefreshing: v }),
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

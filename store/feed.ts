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
   *  0.45 after any manual refresh so reshuffles visibly reorder. */
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

// Cold-start feed seed: a FIXED constant, not Math.random(). The feed query key
// includes feedSeed, so a random-per-launch seed would change the key every cold
// start and defeat the persisted-cache restore (nothing would match → spinner).
// A stable cold seed keeps the key identical across launches so the persisted
// feed paints instantly; regenerateSeed/setFeedSeed still randomize on an
// explicit pull-to-refresh (mig 352 reshuffle). Trade-off: the pre-refresh cold
// ordering is deterministic (the ranking's near-tie jitter is the same each cold
// launch) — acceptable, and arguably steadier, since the feed is already
// user-specific via follows/blocks/recency.
const FEED_COLD_SEED = 0.5;

/** Manual-refresh shuffle strength (mig 352) — vs the 0.10 cold-load jitter.
 *  Exported so the reshuffle prefetch can build its cache key at this strength
 *  WITHOUT pre-bumping the store (the store bump lands atomically at commit
 *  time via setFeedSeed). */
export const MANUAL_FEED_SHUFFLE = 0.45;

export const useFeedStore = create<FeedStore>((set) => ({
  pinnedPost: null,
  setPinnedPost: (post) => set({ pinnedPost: post }),
  resetToken: 0,
  bumpReset: () => set((s) => ({ resetToken: s.resetToken + 1 })),
  refreshToken: 0,
  bumpRefresh: () => set((s) => ({ refreshToken: s.refreshToken + 1 })),
  feedSeed: FEED_COLD_SEED,
  // 0.10 = the ranking's gentle cold-load jitter; manual refreshes bump to
  // 0.45 so a reshuffle visibly reshuffles (mig 352 — the old fixed 0.10
  // couldn't unseat a top post whose score led by >0.1: "first pic never
  // changed"). One-way ratchet per session: once the user asks for shuffle,
  // every subsequent seed is a real shuffle.
  feedShuffle: 0.1,
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

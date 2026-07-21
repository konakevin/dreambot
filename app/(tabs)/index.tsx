import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, InteractionManager } from 'react-native';
import { Text } from '@/components/AppText';
import type { VerticalPagerHandle } from '@/components/VerticalPager';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';
import { showPremiumGate } from '@/lib/premiumGate';
import { trackFeedTabSelected } from '@/lib/analytics';
import { useFeedStore, MANUAL_FEED_SHUFFLE } from '@/store/feed';
import { colors, ANIM } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useQueryClient } from '@tanstack/react-query';
// The feed query itself lives in hooks/useDreamFeed — the SAME hook + query
// keys the prefetchers write into. (A local copy with a 4-element key used to
// live here; pull-to-refresh prefetched into the shared 5-element key that
// this screen never read, so the "instant swap" never happened on home.)
import { useDreamFeed, prefetchDreamFeed } from '@/hooks/useDreamFeed';
import { supabase } from '@/lib/supabase';
import { asDbResult } from '@/lib/dbResult';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { reconcileWelcomeBonus } from '@/lib/welcomeBonus';
import { POST_SELECT, mapToDreamPost } from '@/lib/mapPost';
// POST_SELECT and mapToDreamPost still used by deep-link fetch below
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { UsernameNudge } from '@/components/UsernameNudge';
import { useUsernameStatus } from '@/hooks/useUsernameStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OverlayPill } from '@/components/OverlayPill';
import { useBotUsers } from '@/hooks/useBotUsers';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { AnnouncementSheet } from '@/components/AnnouncementSheet';
type FeedTab = 'forYou' | 'following';

function FeedTabs({ active, onChange }: { active: FeedTab; onChange: (tab: FeedTab) => void }) {
  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'following', label: 'Following' },
    { key: 'forYou', label: 'Explore' },
  ];

  return (
    <View style={s.feedTabs}>
      {tabs.map((tab) => (
        <OverlayPill
          key={tab.key}
          label={tab.label}
          active={active === tab.key}
          onPress={() => {
            trackFeedTabSelected({ tab: tab.key === 'forYou' ? 'explore' : 'following' });
            onChange(tab.key);
          }}
        />
      ))}
    </View>
  );
}

function EmptyFeed({ tab }: { tab: FeedTab }) {
  const isDreamEligible = useAuthStore((state) => state.isDreamEligible);
  // Only paid/trial users actually GET a nightly dream — don't promise it to a
  // free/lapsed user. For them, the empty state is a soft upsell instead.
  const msgs: Record<FeedTab, { icon: string; title: string; sub: string }> = {
    forYou: {
      icon: 'moon-outline',
      title: 'Your feed is warming up',
      sub: isDreamEligible
        ? 'Your nightly dreams will land here every morning. Check back tomorrow.'
        : 'Get a personalized dream delivered every morning with Basic or Pro.',
    },
    following: {
      icon: 'people-outline',
      title: 'Nobody yet',
      sub: 'Follow some people (or bots) and their dreams show up here. The Bots tab is a great place to start.',
    },
  };
  const m = msgs[tab];
  const showNightlyCta = tab === 'forYou' && !isDreamEligible;
  return (
    <View style={s.emptyWrap}>
      <Ionicons
        name={m.icon as keyof typeof Ionicons.glyphMap}
        size={48}
        color={colors.textSecondary}
      />
      <Text style={s.emptyTitle}>{m.title}</Text>
      <Text style={s.emptySub}>{m.sub}</Text>
      {showNightlyCta ? (
        <TouchableOpacity
          style={s.emptyCta}
          onPress={() => showPremiumGate({ kind: 'nightly_premium' })}
          activeOpacity={0.85}
        >
          <Text style={s.emptyCtaText}>Get nightly dreams</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// "Maybe later" on the username nudge snoozes it for a week so it isn't shown
// every launch (the DB username_confirmed flag is the real source of truth).
const USERNAME_SNOOZE_KEY = 'dreambot.usernameNudge.snoozedAt.v1';
const USERNAME_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const setFeedSeed = useFeedStore((s) => s.setFeedSeed);
  const [activeTab, setActiveTab] = useState<FeedTab>('forYou');
  const { data: botUsers } = useBotUsers();

  // (The post-feed FeedIntroGate was removed 2026-06-18 — bot selection moved into
  // onboarding, so the feed now opens directly after the reveal.)

  // Safety net for the welcome sparkle bonus: if the at-onboarding grant was
  // missed (a network blip during finalizeOnboarding), credit it now. The grant
  // is idempotent server-side AND this runs at most once per device per user, so
  // it's a cheap no-op for everyone who already received it. (lib/welcomeBonus.ts)
  const engineConfig = useEngineConfig();
  useEffect(() => {
    if (user) reconcileWelcomeBonus(user.id, engineConfig.welcomeSparkleBonus);
  }, [user, engineConfig.welcomeSparkleBonus]);

  // One-time "claim your @username" nudge — shown to users still on an auto-
  // assigned handle (username_confirmed=false). Dismissible: "Maybe later"
  // snoozes it (AsyncStorage) for a week so it isn't every-launch. Shows after
  // the feed intro is done so a brand-new OAuth user never sees two at once.
  const { data: usernameStatus } = useUsernameStatus();
  const { announcement, markSeen: markAnnouncementSeen } = useAnnouncement();
  const [usernameSnoozed, setUsernameSnoozed] = useState<boolean | null>(null);
  const [usernameDone, setUsernameDone] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(USERNAME_SNOOZE_KEY).then((v) => {
      const at = v ? parseInt(v, 10) : 0;
      setUsernameSnoozed(Date.now() - at < USERNAME_SNOOZE_MS);
    });
  }, []);
  const snoozeUsername = useCallback(() => {
    AsyncStorage.setItem(USERNAME_SNOOZE_KEY, String(Date.now())).catch(() => {});
    setUsernameSnoozed(true);
  }, []);
  const showUsernameNudge =
    usernameSnoozed === false &&
    !usernameDone &&
    usernameStatus != null &&
    !usernameStatus.confirmed;

  // Prebuffer the two home-screen feeds on mount: warms the TanStack
  // cache for tab-switch latency, then prefetches the first 5 image bytes
  // of each via expo-image so the cards render shimmer-free. Fire-and-
  // forget — best-effort, silent on failure.
  useEffect(() => {
    if (!user) return;
    // Deferred until AFTER the first paint + interactions settle, so warming
    // both home feeds doesn't contend with the ACTIVE tab's own initial fetch on
    // cold start (a big contributor to "spinner for seconds"). The active tab is
    // already served by the mounted useDreamFeed below; this just pre-warms the
    // other tab for an instant switch.
    const handle = InteractionManager.runAfterInteractions(() => {
      prefetchDreamFeed(queryClient, 'following', user.id, feedSeed);
      prefetchDreamFeed(queryClient, 'forYou', user.id, feedSeed);
    });
    return () => handle.cancel();
  }, [user, feedSeed, queryClient]);

  // Also prebuffer the Bots tab on app load — both the "All bots" mixed
  // feed and each individual bot's first page (with first 5 image bytes
  // prefetched). Tapping the Bots footer icon then loads instantly, and
  // swiping between bots is warm because each bot's query cache + first
  // images are already resident.
  useEffect(() => {
    if (!user || !botUsers?.length) return;
    // Deferred behind interactions like the home-feed warming above — the Bots
    // prefetch is a large fan-out (all-bots + one page per bot) that must never
    // block the first paint.
    const handle = InteractionManager.runAfterInteractions(() => {
      // "All bots" mixed feed (selectedBotId = null)
      prefetchDreamFeed(queryClient, 'bots', user.id, feedSeed, null);
      // Each individual bot's first page + first 5 images
      for (const bot of botUsers) {
        prefetchDreamFeed(queryClient, 'bots', user.id, feedSeed, bot.id);
      }
    });
    return () => handle.cancel();
  }, [user, feedSeed, queryClient, botUsers]);

  // Read the feed for the ACTIVE tab (not a deferred copy). The feed is keyed
  // on activeTab, so it already remounts synchronously on tap — deferring only
  // the DATA meant the freshly-remounted feed rendered the OLD tab's posts for
  // a frame (the "Following pill, Explore image" flash, Kevin 2026-07-10). Both
  // key and data now switch together: cached → instant clean swap, uncached →
  // the loading state (never a wrong image). The inactive tab is prefetched on
  // mount below so the first switch is usually already cached.
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDreamFeed(activeTab);
  const pinnedPost = useFeedStore((s) => s.pinnedPost);
  const setPinnedPost = useFeedStore((s) => s.setPinnedPost);
  const pendingPostId = useFeedStore((s) => s.pendingPostId);
  const setPendingPostId = useFeedStore((s) => s.setPendingPostId);
  const homeFeedResetToken = useFeedStore((s) => s.homeFeedResetToken);
  // Bumped when a re-tap reshuffle COMMITS. It's part of FullScreenFeed's key,
  // so the commit REMOUNTS the pager: new posts + top position land in one
  // mount, exactly like a tab switch (the same key mechanism) — no reconcile
  // frames, no jump-to-top, no cover mask (Kevin 2026-07-21: the masked swap
  // still read as a black flash). Pull-to-refresh deliberately does NOT bump
  // it — the pull spinner strip owns that transition and settles in place.
  const [reshuffleEpoch, setReshuffleEpoch] = useState(0);
  // Dedup by id in case the paginated RPC's cursor boundary lets the same post
  // appear on two adjacent pages (can happen when many posts share the same
  // feed_score and the tiebreaker overlaps). Kills both data-level duplicates
  // and the "reappearing post every ~10 scrolls" visual bug they cause.
  const feedPosts = useMemo(() => {
    // Page shape is now { rows, nextCursor } — flatMap rows out, ignore nextCursor metadata
    const rows = data?.pages.flatMap((p) => p.rows) ?? [];
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [data]);
  const listRef = useRef<VerticalPagerHandle>(null);
  const overlayOpacity = useSharedValue(1);
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value < 0.5 ? 'none' : 'auto',
  }));
  const setHudVisible = useFeedStore((s) => s.setHudVisible);
  const handleHudToggle = useCallback(
    (visible: boolean) => {
      overlayOpacity.value = withTiming(visible ? 1 : 0, { duration: ANIM.HUD_FADE_MS });
      setHudVisible(visible);
    },
    [overlayOpacity, setHudVisible]
  );

  // Deep link: when a pending post ID arrives, fetch it and pin to feed
  useEffect(() => {
    if (!pendingPostId) return;
    const id = pendingPostId;
    setPendingPostId(null);
    (async () => {
      const { data: row } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('id', id)
        .single();
      if (row) {
        const post = mapToDreamPost(asDbResult<Record<string, unknown>>(row));
        setPinnedPost(post);
      }
    })();
  }, [pendingPostId, setPendingPostId, setPinnedPost]);

  // Diversity is applied per-page inside useDreamFeed.queryFn (see comment
  // there). feedPosts is already-diversified at the page level — flat-merging
  // pages preserves order, which keeps earlier-page items stable when a new
  // page arrives. NO render-time reorder pass — that was the "wrong post
  // pops in mid-scroll" bug.
  const posts = pinnedPost && activeTab === 'forYou' ? [pinnedPost, ...feedPosts] : feedPosts;

  // Scroll to top when a pinned post appears
  useEffect(() => {
    if (pinnedPost) {
      setTimeout(() => listRef.current?.scrollToOffset(0, false), 100);
    }
  }, [pinnedPost]);

  function handleTabChange(tab: FeedTab) {
    setActiveTab(tab);
    listRef.current?.scrollToOffset(0, false);
    if (pinnedPost) setPinnedPost(null);
  }

  // ── Tap-active-tab gesture (Instagram-style) ──
  // FullScreenFeed handles the whole re-tap via its scrollToTopToken prop: it
  // runs the pager's programmatic refresh(), which invokes our onRefresh below
  // (new-seed prefetch + swap) with the pull-to-refresh spinner. No separate
  // refetch() here — refetching the SAME seed changed almost nothing and the
  // pager's id-anchor hid what little did change.

  return (
    <View style={s.root}>
      <FullScreenFeed
        key={`${activeTab}:${reshuffleEpoch}`}
        posts={posts}
        isLoading={isLoading}
        // Pull-to-refresh = PREFETCH a new random seed's feed, THEN swap to it,
        // so the reshuffle is instant with no loading flash (the old feed stays
        // on screen the whole time; the spinner in the pull gap tracks the
        // prefetch). Swapping only refetched the same seed before → no change.
        onRefresh={async (opts?: { deferSwap?: boolean }) => {
          if (!user) return;
          // In-flight guard: a re-tap while a reshuffle is already prefetching
          // is a no-op (double prefetch + double remount otherwise).
          if (useFeedStore.getState().homeFeedRefreshing) return;
          const newSeed = Math.random();
          // Tab-bar signal: the home icon shows a small spinner for the whole
          // network wait — the feed itself stays fully visible + interactive
          // (2026-07-21; replaces the heavy opaque cover during prefetch).
          useFeedStore.getState().setHomeFeedRefreshing(true);
          try {
            // Prefetch AT the manual-refresh shuffle strength, passed explicitly.
            // Do NOT bumpShuffle() here: feedShuffle is part of the MOUNTED
            // feed's query key, so a store bump mid-flow re-pointed the visible
            // feed at an empty (oldSeed, 0.45) entry whose stray fetch swapped a
            // random card under the user on the first re-tap after launch
            // (Kevin 2026-07-21). setFeedSeed in commit() sets seed + shuffle
            // in ONE store update, landing the mounted key directly on this
            // prefetched entry.
            await prefetchDreamFeed(
              queryClient,
              activeTab,
              user.id,
              newSeed,
              null,
              5,
              MANUAL_FEED_SHUFFLE
            );
          } finally {
            useFeedStore.getState().setHomeFeedRefreshing(false);
          }
          // The ATOMIC swap: clear the pinned self-post (it's shown once right
          // after posting — any refresh clears it, Kevin 2026-07-12), flip to
          // the prefetched seed, and (re-tap only) bump the epoch so the pager
          // REMOUNTS at the new top — one frame, old feed → new feed, the same
          // mechanism as a tab switch. All three land in one React commit.
          const commit = () => {
            setPinnedPost(null);
            setFeedSeed(newSeed);
            if (opts?.deferSwap) setReshuffleEpoch((e) => e + 1);
          };
          // Re-tap path (deferSwap): hand the swap back to FullScreenFeed so it
          // fires only after the prefetch resolved. Pull path: commit now — the
          // pull spinner strip owns that transition and settles in place.
          if (opts?.deferSwap) return commit;
          commit();
        }}
        listRef={listRef}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ListEmptyComponent={<EmptyFeed tab={activeTab} />}
        onHudToggle={handleHudToggle}
        scrollToTopToken={homeFeedResetToken}
      />

      <Animated.View
        style={[
          s.topOverlayWrap,
          { paddingTop: insets.top, paddingBottom: verticalScale(20) },
          overlayStyle,
        ]}
        pointerEvents="box-none"
      >
        <View style={s.topRow}>
          <View style={{ flex: 1, minWidth: 42 }} />
          <FeedTabs active={activeTab} onChange={handleTabChange} />
          <View style={{ flex: 1, minWidth: 42 }} />
        </View>
      </Animated.View>

      {/* One-time "claim your @username" nudge (dismissible). */}
      {showUsernameNudge && usernameStatus && (
        <UsernameNudge
          currentUsername={usernameStatus.username}
          secondaryLabel="Maybe later"
          onSecondary={snoozeUsername}
          onSaved={() => setUsernameDone(true)}
        />
      )}

      {/* DB-driven announcement takeover (migration 333) — highest-priority
          unseen active row, max one per session. Yields to the username nudge
          so two sheets can't stack. */}
      {announcement && !showUsernameNudge && (
        <AnnouncementSheet
          announcement={announcement}
          onClose={() => markAnnouncementSeen(announcement.id)}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { color: colors.textPrimary, fontSize: fontScale(20), fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: fontScale(15), textAlign: 'center' },
  emptyCta: {
    marginTop: verticalScale(8),
    backgroundColor: colors.accent,
    paddingVertical: verticalScale(11),
    paddingHorizontal: verticalScale(22),
    borderRadius: verticalScale(14),
  },
  emptyCtaText: { color: '#FFFFFF', fontSize: fontScale(15), fontWeight: '700' },
  topOverlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  feedTabs: { flexDirection: 'row', gap: 8 },
  searchButton: { padding: 8, marginRight: 4 },
});

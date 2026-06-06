import { useState, useRef, useEffect, useCallback, useMemo, useDeferredValue } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/auth';
import { trackFeedTabSelected } from '@/lib/analytics';
import { useFeedStore } from '@/store/feed';
import { colors, ANIM } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { prefetchDreamFeed } from '@/hooks/useDreamFeed';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, mapRpcToDreamPost, castRows } from '@/lib/mapPost';
// POST_SELECT and mapToDreamPost still used by deep-link fetch below
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { OverlayPill } from '@/components/OverlayPill';
import { useBotUsers } from '@/hooks/useBotUsers';
import type { DreamPostItem } from '@/components/DreamCard';

// Content diversity post-processing — extracted to lib/feedDiversity.ts for unit testing.
import { applyDiversity } from '@/lib/feedDiversity';

type FeedTab = 'forYou' | 'following';
const PAGE_SIZE = 20;

interface FeedCursor {
  score: number;
  id: string;
}

type FeedRow = DreamPostItem & { feed_score?: number };
type FeedPage = { rows: FeedRow[]; nextCursor: FeedCursor | null };

function useDreamFeed(tab: FeedTab) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);

  return useInfiniteQuery({
    queryKey: ['dreamFeed', tab, user?.id, feedSeed],
    queryFn: async ({ pageParam }): Promise<FeedPage> => {
      const { data, error } = await supabase.rpc('get_feed', {
        p_user_id: user!.id,
        p_limit: PAGE_SIZE,
        p_seed: feedSeed,
        p_tab: tab,
        ...(pageParam ? { p_cursor_score: pageParam.score, p_cursor_id: pageParam.id } : {}),
      });
      if (error) throw error;
      const rawRows = castRows(data).map((row) => ({
        ...mapRpcToDreamPost(row),
        feed_score: row.feed_score as number,
      }));
      // Diversify PER-PAGE so each page is order-stable on its own.
      // Earlier pages never reshuffle when fetchNextPage arrives — fixes the
      // "wrong post pops in mid-scroll at the page boundary" bug. Trade-off:
      // streak detection is within-page only, so cross-page-boundary streaks
      // are possible (acceptable at PAGE_SIZE=20).
      const rows: FeedRow[] = applyDiversity(rawRows) as FeedRow[];
      // Compute cursor at FETCH time from raw RPC result, NOT from current
      // cached row count. Otherwise optimistic deletes shrink lastPage.length
      // below PAGE_SIZE → getNextPageParam returns undefined → pagination
      // dies. Cursor is fixed at the moment the page lands and never changes,
      // so deletes can't break "has more pages" detection.
      const last = rawRows[rawRows.length - 1];
      // Terminate ONLY on a genuinely empty page. An undersized page does NOT
      // mean we're at the end — the server-side get_feed filter (blocked
      // users, hidden posts, dedup) can return fewer rows than requested even
      // when more are available below. The old PAGE_SIZE check stranded
      // users at a fake bottom 30 posts in. Trade-off: one trailing empty
      // fetch when the feed is actually exhausted.
      const nextCursor: FeedCursor | null =
        last?.feed_score != null ? { score: last.feed_score, id: last.id } : null;
      return { rows, nextCursor };
    },
    initialPageParam: null as FeedCursor | null,
    getNextPageParam: (lastPage) => {
      // Use the cursor stored at fetch time — survives optimistic deletes.
      return lastPage.nextCursor ?? undefined;
    },
    enabled: !!useAuthStore.getState().user,
  });
}

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
  const msgs: Record<FeedTab, { icon: string; title: string; sub: string }> = {
    forYou: {
      icon: 'moon-outline',
      title: 'Your feed is warming up',
      sub: 'Your nightly dreams will land here every morning. Check back tomorrow.',
    },
    following: {
      icon: 'people-outline',
      title: 'Nobody yet',
      sub: 'Follow some people (or bots) and their dreams show up here. The Bots tab is a great place to start.',
    },
  };
  const m = msgs[tab];
  return (
    <View style={s.emptyWrap}>
      <Ionicons
        name={m.icon as keyof typeof Ionicons.glyphMap}
        size={48}
        color={colors.textSecondary}
      />
      <Text style={s.emptyTitle}>{m.title}</Text>
      <Text style={s.emptySub}>{m.sub}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const [activeTab, setActiveTab] = useState<FeedTab>('forYou');
  const { data: botUsers } = useBotUsers();

  // Prebuffer the two home-screen feeds on mount: warms the TanStack
  // cache for tab-switch latency, then prefetches the first 5 image bytes
  // of each via expo-image so the cards render shimmer-free. Fire-and-
  // forget — best-effort, silent on failure.
  useEffect(() => {
    if (!user) return;
    prefetchDreamFeed(queryClient, 'following', user.id, feedSeed);
    prefetchDreamFeed(queryClient, 'forYou', user.id, feedSeed);
  }, [user, feedSeed, queryClient]);

  // Also prebuffer the Bots tab on app load — both the "All bots" mixed
  // feed and each individual bot's first page (with first 5 image bytes
  // prefetched). Tapping the Bots footer icon then loads instantly, and
  // swiping between bots is warm because each bot's query cache + first
  // images are already resident.
  useEffect(() => {
    if (!user || !botUsers?.length) return;
    // "All bots" mixed feed (selectedBotId = null)
    prefetchDreamFeed(queryClient, 'bots', user.id, feedSeed, null);
    // Each individual bot's first page + first 5 images
    for (const bot of botUsers) {
      prefetchDreamFeed(queryClient, 'bots', user.id, feedSeed, bot.id);
    }
  }, [user, feedSeed, queryClient, botUsers]);

  // activeTab updates synchronously for the pill highlight (instant tap
  // feedback); useDreamFeed reads the deferred copy so the (expensive)
  // feed refetch + remount lags behind the pill animation by a frame or
  // two instead of blocking it. Pill highlight feels snappy.
  const deferredTab = useDeferredValue(activeTab);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useDreamFeed(deferredTab);
  const pinnedPost = useFeedStore((s) => s.pinnedPost);
  const setPinnedPost = useFeedStore((s) => s.setPinnedPost);
  const pendingPostId = useFeedStore((s) => s.pendingPostId);
  const setPendingPostId = useFeedStore((s) => s.setPendingPostId);
  const homeFeedResetToken = useFeedStore((s) => s.homeFeedResetToken);
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
  const listRef = useRef<FlatList>(null) as React.RefObject<FlatList>;
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
        const post = mapToDreamPost(row as unknown as Record<string, unknown>);
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
      setTimeout(() => listRef.current?.scrollToOffset({ offset: 0, animated: false }), 100);
    }
  }, [pinnedPost]);

  function handleTabChange(tab: FeedTab) {
    setActiveTab(tab);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (pinnedPost) setPinnedPost(null);
  }

  // ── Tap-active-tab gesture (Instagram-style) ──
  // FullScreenFeed handles the scroll-to-top via its scrollToTopToken prop.
  // Here we just trigger the refetch.
  const skipFirstFeedReset = useRef(true);
  useEffect(() => {
    if (skipFirstFeedReset.current) {
      skipFirstFeedReset.current = false;
      return;
    }
    refetch();
  }, [homeFeedResetToken, refetch]);

  return (
    <View style={s.root}>
      <FullScreenFeed
        key={activeTab}
        posts={posts}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        listRef={listRef}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ListEmptyComponent={<EmptyFeed tab={activeTab} />}
        onHudToggle={handleHudToggle}
        scrollToTopToken={homeFeedResetToken}
      />

      <Animated.View style={[s.topOverlayWrap, overlayStyle]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)', 'transparent']}
          style={[s.topOverlay, { paddingTop: insets.top, paddingBottom: verticalScale(20) }]}
          pointerEvents="box-none"
        >
          <View style={s.topRow}>
            <View style={{ flex: 1, minWidth: 42 }} />
            <FeedTabs active={activeTab} onChange={handleTabChange} />
            <View style={{ flex: 1, minWidth: 42 }} />
          </View>
        </LinearGradient>
      </Animated.View>
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
  topOverlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topOverlay: {},
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  feedTabs: { flexDirection: 'row', gap: 8 },
  searchButton: { padding: 8, marginRight: 4 },
});

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/auth';
import * as nav from '@/lib/navigate';
import { useFeedStore } from '@/store/feed';
import { colors, ANIM } from '@/constants/theme';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, mapRpcToDreamPost, castRows } from '@/lib/mapPost';
// POST_SELECT and mapToDreamPost still used by deep-link fetch below
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { OverlayPill } from '@/components/OverlayPill';
import type { DreamPostItem } from '@/components/DreamCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
type FeedTab = 'forYou' | 'following';
const PAGE_SIZE = 20;

/**
 * Content diversity post-processing.
 * Reorders scored feed to prevent monotonous sequences:
 * - No more than 2 consecutive posts from the same user
 * - No more than 3 consecutive posts of the same medium
 */
function applyDiversity(posts: DreamPostItem[]): DreamPostItem[] {
  if (posts.length <= 2) return posts;
  const result: DreamPostItem[] = [];
  const deferred: DreamPostItem[] = [];

  for (const post of posts) {
    const len = result.length;
    // Check same-user streak (max 2)
    const sameUser =
      len >= 2 &&
      result[len - 1].user_id === post.user_id &&
      result[len - 2].user_id === post.user_id;
    // Check same-medium streak (max 3)
    const sameMedium =
      len >= 3 &&
      post.dream_medium != null &&
      result[len - 1].dream_medium === post.dream_medium &&
      result[len - 2].dream_medium === post.dream_medium &&
      result[len - 3].dream_medium === post.dream_medium;

    if (sameUser || sameMedium) {
      deferred.push(post);
    } else {
      result.push(post);
    }
  }
  // Append deferred posts at the end (still visible, just not in a streak)
  return result.concat(deferred);
}

interface FeedCursor {
  score: number;
  id: string;
}

function useDreamFeed(tab: FeedTab) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);

  return useInfiniteQuery({
    queryKey: ['dreamFeed', tab, user?.id, feedSeed],
    queryFn: async ({ pageParam }): Promise<(DreamPostItem & { feed_score?: number })[]> => {
      const { data, error } = await supabase.rpc('get_feed', {
        p_user_id: user!.id,
        p_limit: PAGE_SIZE,
        p_seed: feedSeed,
        p_tab: tab,
        ...(pageParam ? { p_cursor_score: pageParam.score, p_cursor_id: pageParam.id } : {}),
      });
      if (error) throw error;
      return castRows(data).map((row) => ({
        ...mapRpcToDreamPost(row),
        feed_score: row.feed_score as number,
      }));
    },
    initialPageParam: null as FeedCursor | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      const last = lastPage[lastPage.length - 1];
      if (last.feed_score == null) return undefined;
      return { score: last.feed_score, id: last.id } as FeedCursor;
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
          onPress={() => onChange(tab.key)}
        />
      ))}
    </View>
  );
}

function EmptyFeed({ tab }: { tab: FeedTab }) {
  const msgs: Record<FeedTab, { icon: string; title: string; sub: string }> = {
    forYou: { icon: 'moon-outline', title: 'No dreams yet', sub: 'Dreams will appear here' },
    following: {
      icon: 'people-outline',
      title: 'No dreams from people you follow',
      sub: 'Follow people to see their creations',
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
  const [activeTab, setActiveTab] = useState<FeedTab>('forYou');
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useDreamFeed(activeTab);
  const pinnedPost = useFeedStore((s) => s.pinnedPost);
  const setPinnedPost = useFeedStore((s) => s.setPinnedPost);
  const pendingPostId = useFeedStore((s) => s.pendingPostId);
  const setPendingPostId = useFeedStore((s) => s.setPendingPostId);
  // Dedup by id in case the paginated RPC's cursor boundary lets the same post
  // appear on two adjacent pages (can happen when many posts share the same
  // feed_score and the tiebreaker overlaps). Kills both data-level duplicates
  // and the "reappearing post every ~10 scrolls" visual bug they cause.
  const feedPosts = useMemo(() => {
    const rows = data?.pages.flat() ?? [];
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
  }, [pendingPostId]);

  // Content diversity: reorder to prevent monotonous sequences
  const diverseFeed = useMemo(() => applyDiversity(feedPosts), [feedPosts]);

  // Prepend pinned post (e.g. deep link, first dream after onboarding)
  const posts = pinnedPost && activeTab === 'forYou' ? [pinnedPost, ...diverseFeed] : diverseFeed;

  // Scroll to top when a pinned post appears
  useEffect(() => {
    if (pinnedPost) {
      setTimeout(() => listRef.current?.scrollToOffset({ offset: 0, animated: false }), 100);
    }
  }, [pinnedPost]);

  function handleTabChange(tab: FeedTab) {
    setActiveTab(tab);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    // Clear pinned post when switching tabs
    if (pinnedPost) setPinnedPost(null);
  }

  return (
    <View style={s.root}>
      <FullScreenFeed
        posts={posts}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        onRefresh={() => refetch()}
        listRef={listRef}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ListEmptyComponent={<EmptyFeed tab={activeTab} />}
        onHudToggle={handleHudToggle}
      />

      <Animated.View style={[s.topOverlayWrap, overlayStyle]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)', 'transparent']}
          style={[s.topOverlay, { paddingTop: insets.top }]}
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
  emptyTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: 15, textAlign: 'center' },
  topOverlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topOverlay: { paddingBottom: 20 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  feedTabs: { flexDirection: 'row', gap: 8 },
  searchButton: { padding: 8, marginRight: 4 },
});

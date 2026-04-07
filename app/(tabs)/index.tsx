import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
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
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { OverlayPill } from '@/components/OverlayPill';
import type { DreamPostItem } from '@/components/DreamCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
type FeedTab = 'forYou' | 'following' | 'dreamers';
const PAGE_SIZE = 20;

function useDreamFeed(tab: FeedTab) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);

  return useInfiniteQuery({
    queryKey: ['dreamFeed', tab, user?.id, feedSeed],
    queryFn: async ({ pageParam = 0 }): Promise<DreamPostItem[]> => {
      if (tab === 'forYou') {
        const { data, error } = await supabase.rpc('get_feed', {
          p_user_id: user!.id,
          p_limit: PAGE_SIZE,
          p_offset: pageParam,
          p_seed: feedSeed,
        });
        if (error) throw error;
        return castRows(data).map(mapRpcToDreamPost);
      }

      let query = supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (tab === 'following') {
        const { data: followData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user!.id);
        const ids = (followData ?? []).map((f: Record<string, string>) => f.following_id);
        if (ids.length === 0) return [];
        query = query.in('user_id', ids);
      } else if (tab === 'dreamers') {
        const { data: friendData } = await supabase.rpc('get_friend_ids', { p_user_id: user!.id });
        const ids = (friendData ?? []).map((f: Record<string, string>) => f.friend_id);
        if (ids.length === 0) return [];
        query = query.in('user_id', ids);
      }

      const { data, error } = await query;
      if (error) throw error;

      return castRows(data).map(mapToDreamPost);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((total, page) => total + page.length, 0);
    },
    enabled: !!useAuthStore.getState().user,
  });
}

function FeedTabs({ active, onChange }: { active: FeedTab; onChange: (tab: FeedTab) => void }) {
  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'following', label: 'Following' },
    { key: 'forYou', label: 'Explore' },
    { key: 'dreamers', label: 'Dreamers' },
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
      sub: 'Follow dreamers to see their creations',
    },
    dreamers: {
      icon: 'heart-outline',
      title: 'No dreams from your dreamers',
      sub: 'Connect with dreamers to see their art',
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
  const feedPosts = data?.pages.flat() ?? [];
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

  // Prepend pinned post (e.g. deep link, first dream after onboarding)
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
            <View style={{ flex: 1 }} />
            <FeedTabs active={activeTab} onChange={handleTabChange} />
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={s.searchButton}
                onPress={() => nav.push('/search')}
                activeOpacity={0.7}
                hitSlop={12}
              >
                <Ionicons name="search" size={26} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>
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
  searchButton: { padding: 8 },
});

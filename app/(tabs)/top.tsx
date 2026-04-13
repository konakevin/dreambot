/**
 * Explore Screen — browse dreams by medium and vibe.
 *
 * Two filter rows: Medium pills and Vibe pills.
 * "All" shows everything. Selecting a medium/vibe filters the feed.
 * Filters by dream_medium and dream_vibe columns on uploads.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useExploreStore } from '@/store/explore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, mapRpcToDreamPost, castRows } from '@/lib/mapPost';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { colors, ANIM } from '@/constants/theme';
import * as nav from '@/lib/navigate';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { OverlayPill } from '@/components/OverlayPill';
import type { DreamPostItem } from '@/components/DreamCard';

const PAGE_SIZE = 20;

interface ExploreCursor {
  score: number;
  id: string;
}

function useExploreDreams(mediums: string[], vibes: string[]) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const medium = mediums[0] ?? null;
  const vibe = vibes[0] ?? null;

  return useInfiniteQuery({
    queryKey: ['explore', medium ?? '', vibe ?? '', feedSeed],
    queryFn: async ({ pageParam }): Promise<(DreamPostItem & { feed_score?: number })[]> => {
      const { data, error } = await supabase.rpc('get_feed', {
        p_user_id: user!.id,
        p_limit: PAGE_SIZE,
        p_seed: feedSeed,
        p_tab: 'forYou',
        ...(pageParam ? { p_cursor_score: pageParam.score, p_cursor_id: pageParam.id } : {}),
        ...(medium ? { p_medium: medium } : {}),
        ...(vibe ? { p_vibe: vibe } : {}),
      });
      if (error) throw error;
      return castRows(data).map((row) => ({
        ...mapRpcToDreamPost(row),
        feed_score: row.feed_score as number,
      }));
    },
    initialPageParam: null as ExploreCursor | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      const last = lastPage[lastPage.length - 1];
      if (last.feed_score == null) return undefined;
      return { score: last.feed_score, id: last.id } as ExploreCursor;
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();
  const MEDIUM_PILLS = useMemo(
    () => [...dbMediums].sort((a, b) => a.label.localeCompare(b.label)),
    [dbMediums]
  );
  const VIBE_PILLS = useMemo(
    () => [...dbVibes].sort((a, b) => a.label.localeCompare(b.label)),
    [dbVibes]
  );
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const pendingMedium = useExploreStore((s) => s.pendingMedium);
  const pendingVibe = useExploreStore((s) => s.pendingVibe);
  const clearPending = useExploreStore((s) => s.clearPending);
  const listRef = useRef<FlatList>(null) as React.RefObject<FlatList>;
  const mediumScrollRef = useRef<ScrollView>(null);
  const vibeScrollRef = useRef<ScrollView>(null);
  const mediumLayoutsRef = useRef<Record<string, { x: number; width: number }>>({});
  const vibeLayoutsRef = useRef<Record<string, { x: number; width: number }>>({});

  // Apply filters from store (e.g. tapping medium+vibe badge on a card)
  useEffect(() => {
    if (pendingMedium !== null || pendingVibe !== null) {
      setSelectedMedium(pendingMedium);
      if (pendingVibe) setSelectedVibe(pendingVibe);
      clearPending();
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      setTimeout(() => {
        scrollPillIntoView(mediumScrollRef, mediumLayoutsRef.current, pendingMedium);
        scrollPillIntoView(vibeScrollRef, vibeLayoutsRef.current, pendingVibe);
      }, 100);
    }
  }, [pendingMedium, pendingVibe, clearPending]);

  // Re-tap Explore tab: scroll feed to top and pills back to selected
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    setTimeout(() => {
      scrollPillIntoView(mediumScrollRef, mediumLayoutsRef.current, selectedMedium);
    }, 100);
  }, [feedSeed]);

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

  const activeMediums = selectedMedium ? [selectedMedium] : [];
  const activeVibes = selectedVibe ? [selectedVibe] : [];

  const { data, isLoading, refetch, isRefetching, fetchNextPage, hasNextPage } = useExploreDreams(
    activeMediums,
    activeVibes
  );
  const posts = data?.pages.flat() ?? [];

  function scrollPillIntoView(
    scrollRef: React.RefObject<ScrollView | null>,
    layouts: Record<string, { x: number; width: number }>,
    key: string | null
  ) {
    if (!key || !layouts[key] || !scrollRef.current) return;
    const { x } = layouts[key];
    scrollRef.current.scrollTo({ x: Math.max(0, x - 8), animated: true });
  }

  function selectMedium(key: string) {
    const next = selectedMedium === key ? null : key;
    setSelectedMedium(next);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (next) scrollPillIntoView(mediumScrollRef, mediumLayoutsRef.current, next);
  }

  function selectVibe(key: string) {
    const next = selectedVibe === key ? null : key;
    setSelectedVibe(next);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (next) scrollPillIntoView(vibeScrollRef, vibeLayoutsRef.current, next);
  }

  const filterLabel =
    [
      selectedMedium ? MEDIUM_PILLS.find((p) => p.key === selectedMedium)?.label : null,
      selectedVibe ? VIBE_PILLS.find((p) => p.key === selectedVibe)?.label : null,
    ]
      .filter(Boolean)
      .join(' + ') || 'all';

  return (
    <View style={s.root}>
      <FullScreenFeed
        posts={posts}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        onRefresh={() => refetch()}
        onEndReached={() => hasNextPage && fetchNextPage()}
        listRef={listRef}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="moon-outline" size={48} color={colors.textSecondary} />
            <Text style={s.emptyTitle}>No {filterLabel?.toLowerCase()} dreams yet</Text>
            <Text style={s.emptySubtitle}>Be the first to create one</Text>
          </View>
        }
        onHudToggle={handleHudToggle}
      />

      <Animated.View style={[s.topOverlayWrap, overlayStyle]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
          style={[s.topOverlay, { paddingTop: insets.top + 4 }]}
          pointerEvents="box-none"
        >
          {/* Search button — top right, matching Home tab */}
          <View style={s.searchRow}>
            <TouchableOpacity onPress={() => nav.push('/search')} hitSlop={12} activeOpacity={0.7}>
              <Ionicons name="search" size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>

          {/* Medium row */}
          <View style={s.filterRow}>
            <View style={s.filterIcon}>
              <Ionicons name="brush-outline" size={14} color="rgba(255,255,255,0.45)" />
            </View>
            <ScrollView
              ref={mediumScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.pillRow}
            >
              {MEDIUM_PILLS.map((m) => (
                <View
                  key={m.key}
                  onLayout={(e) => {
                    mediumLayoutsRef.current[m.key] = {
                      x: e.nativeEvent.layout.x,
                      width: e.nativeEvent.layout.width,
                    };
                  }}
                >
                  <OverlayPill
                    label={m.label}
                    active={selectedMedium === m.key}
                    onPress={() => selectMedium(m.key)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Vibe row */}
          <View style={s.filterRow}>
            <View style={s.filterIcon}>
              <Ionicons name="sparkles-outline" size={14} color="rgba(255,255,255,0.45)" />
            </View>
            <ScrollView
              ref={vibeScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.pillRow}
            >
              {VIBE_PILLS.map((v) => (
                <View
                  key={v.key}
                  onLayout={(e) => {
                    vibeLayoutsRef.current[v.key] = {
                      x: e.nativeEvent.layout.x,
                      width: e.nativeEvent.layout.width,
                    };
                  }}
                >
                  <OverlayPill
                    label={v.label}
                    active={selectedVibe === v.key}
                    onPress={() => selectVibe(v.key)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { color: colors.textSecondary, fontSize: 17, fontWeight: '600' },
  emptySubtitle: { color: colors.textMuted, fontSize: 14 },
  topOverlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topOverlay: { paddingBottom: 16, gap: 6 },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIcon: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  pillRow: { gap: 6, paddingRight: 16 },
});

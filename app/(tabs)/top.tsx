/**
 * Explore Screen — browse dreams by medium and vibe.
 *
 * Two filter rows: Medium pills and Vibe pills.
 * "All" shows everything. Selecting a medium/vibe filters the feed.
 * Filters by dream_medium and dream_vibe columns on uploads.
 */

import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useExploreStore } from '@/store/explore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { DREAM_MEDIUMS, DREAM_VIBES } from '@/constants/dreamEngine';
import { colors } from '@/constants/theme';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { OverlayPill } from '@/components/OverlayPill';
import type { DreamPostItem } from '@/components/DreamCard';

const PAGE_SIZE = 20;

function useExploreDreams(mediums: string[], vibes: string[]) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);

  return useInfiniteQuery({
    queryKey: ['explore', mediums.sort().join(','), vibes.sort().join(','), feedSeed],
    queryFn: async ({ pageParam }): Promise<DreamPostItem[]> => {
      const offset = pageParam as number;
      let query = supabase
        .from('uploads')
        .select('*, users!inner(username, avatar_url)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (mediums.length > 0) {
        query = query.in('dream_medium', mediums);
      }
      if (vibes.length > 0) {
        query = query.in('dream_vibe', vibes);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((row: Record<string, unknown>) => {
        const u = row.users as Record<string, unknown>;
        return {
          id: row.id as string,
          user_id: row.user_id as string,
          image_url: row.image_url as string,
          caption: row.caption as string | null,
          username: u.username as string,
          avatar_url: u.avatar_url as string | null,
          created_at: row.created_at as string,
          comment_count: (row.comment_count as number) ?? 0,
          like_count: (row.like_count as number) ?? 0,
          from_wish: (row.from_wish as string | null) ?? null,
          recipe_id: (row.recipe_id as string | null) ?? null,
          ai_prompt: (row.ai_prompt as string | null) ?? null,
          twin_count: (row.twin_count as number) ?? 0,
          fuse_count: (row.fuse_count as number) ?? 0,
          twin_of: (row.twin_of as string | null) ?? null,
          fuse_of: (row.fuse_of as string | null) ?? null,
          dream_medium: (row.dream_medium as string | null) ?? null,
          dream_vibe: (row.dream_vibe as string | null) ?? null,
        };
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastParam) =>
      lastPage.length < PAGE_SIZE ? undefined : (lastParam as number) + PAGE_SIZE,
    enabled: !!user,
    staleTime: 60_000,
  });
}

// Only show curated mediums (exclude my_mediums, surprise_me)
const MEDIUM_PILLS = DREAM_MEDIUMS.filter((m) => m.directive !== null).sort((a, b) =>
  a.label.localeCompare(b.label)
);
const VIBE_PILLS = DREAM_VIBES.filter((v) => v.directive !== null).sort((a, b) =>
  a.label.localeCompare(b.label)
);

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
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
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
        style={[s.topOverlay, { paddingTop: insets.top + 4 }]}
        pointerEvents="box-none"
      >
        {/* Medium row */}
        <View style={s.filterRow}>
          <Text style={s.filterLabel}>Medium</Text>
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
          <Text style={s.filterLabel}>Vibe</Text>
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
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { color: colors.textSecondary, fontSize: 17, fontWeight: '600' },
  emptySubtitle: { color: colors.textMuted, fontSize: 14 },
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingBottom: 16, gap: 6 },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    width: 56,
    paddingLeft: 16,
  },
  pillRow: { gap: 6, paddingRight: 16 },
});

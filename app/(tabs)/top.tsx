/**
 * Explore Screen — browse dreams by medium and vibe.
 *
 * Two filter rows: Medium pills and Vibe pills.
 * "All" shows everything. Selecting a medium/vibe filters the feed.
 * Filters by dream_medium and dream_vibe columns on uploads.
 */

import { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
        .select(
          'id, user_id, image_url, caption, created_at, comment_count, like_count, from_wish, recipe_id, ai_prompt, twin_count, fuse_count, twin_of, fuse_of, users!inner(username, avatar_url)'
        )
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
const MEDIUM_PILLS = DREAM_MEDIUMS.filter((m) => m.directive !== null);
const VIBE_PILLS = DREAM_VIBES.filter((v) => v.directive !== null);

type ExploreTab = 'medium' | 'vibe';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<ExploreTab>('medium');
  const [selectedMediums, setSelectedMediums] = useState<Set<string>>(new Set());
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(new Set());
  const listRef = useRef<FlatList>(null) as React.RefObject<FlatList>;

  // Only filter by the active tab's selections
  const activeMediums = tab === 'medium' ? [...selectedMediums] : [];
  const activeVibes = tab === 'vibe' ? [...selectedVibes] : [];

  const { data, isLoading, refetch, isRefetching, fetchNextPage, hasNextPage } = useExploreDreams(
    activeMediums,
    activeVibes
  );
  const posts = data?.pages.flat() ?? [];

  function toggleMedium(key: string) {
    setSelectedMediums((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

  function toggleVibe(key: string) {
    setSelectedVibes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

  function switchTab(newTab: ExploreTab) {
    setTab(newTab);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

  const activeSelections = tab === 'medium' ? selectedMediums : selectedVibes;
  const pills = tab === 'medium' ? MEDIUM_PILLS : VIBE_PILLS;
  const filterLabel =
    activeSelections.size === 0
      ? 'all'
      : [...activeSelections]
          .map((k) => pills.find((p) => p.key === k)?.label)
          .filter(Boolean)
          .join(' + ');

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
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
        style={[s.topOverlay, { paddingTop: insets.top + 4 }]}
        pointerEvents="box-none"
      >
        {/* Tab toggles */}
        <View style={s.tabRow}>
          <TouchableOpacity
            style={[s.tab, tab === 'medium' && s.tabActive]}
            onPress={() => switchTab('medium')}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab === 'medium' && s.tabTextActive]}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, tab === 'vibe' && s.tabActive]}
            onPress={() => switchTab('vibe')}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab === 'vibe' && s.tabTextActive]}>Vibe</Text>
          </TouchableOpacity>
        </View>

        {/* Filter pills for active tab */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.pillRow}
        >
          {tab === 'medium'
            ? MEDIUM_PILLS.map((m) => (
                <OverlayPill
                  key={m.key}
                  label={m.label}
                  active={selectedMediums.has(m.key)}
                  onPress={() => toggleMedium(m.key)}
                />
              ))
            : VIBE_PILLS.map((v) => (
                <OverlayPill
                  key={v.key}
                  label={v.label}
                  active={selectedVibes.has(v.key)}
                  onPress={() => toggleVibe(v.key)}
                />
              ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { color: colors.textSecondary, fontSize: 17, fontWeight: '600' },
  emptySubtitle: { color: colors.textMuted, fontSize: 14 },
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingBottom: 16, gap: 8 },
  tabRow: {
    flexDirection: 'row',
    gap: 0,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  pillRow: { gap: 8, paddingHorizontal: 16 },
});

/**
 * Search + Explore Screen — dual-mode tab.
 *
 * BROWSE MODE (default): search bar + fullscreen feed. Clean, no clutter.
 * SEARCH MODE (tap search bar): feed hidden, search results shown.
 *
 * Filter chips appear below the search bar ONLY when a medium or vibe filter
 * is active (e.g., after tapping a MediumVibeBadge on a card). Each chip is
 * tappable to open a picker sheet and change the filter value. Each has a ✕
 * to dismiss that individual filter. Search results respect active filters.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList as RNFlatList,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useExploreStore } from '@/store/explore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapRpcToDreamPost, castRows } from '@/lib/mapPost';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { useSearchUsers, type SearchUser } from '@/hooks/useSearchUsers';
import { useSearchPosts } from '@/hooks/useSearchPosts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useOutgoingFollowRequestIds } from '@/hooks/useFollowRequests';
import { colors, ANIM } from '@/constants/theme';
import * as nav from '@/lib/navigate';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { FilterPickerSheet } from '@/components/FilterPickerSheet';
import { PostTile } from '@/components/PostTile';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import type { DreamPostItem } from '@/components/DreamCard';

// ── Browse mode feed query ───────────────────────────────────────────────────

const FEED_PAGE_SIZE = 20;

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
        p_limit: FEED_PAGE_SIZE,
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
      if (lastPage.length < FEED_PAGE_SIZE) return undefined;
      const last = lastPage[lastPage.length - 1];
      if (last.feed_score == null) return undefined;
      return { score: last.feed_score, id: last.id } as ExploreCursor;
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}

// ── Search result components ─────────────────────────────────────────────────

const TILE_GAP = 2;
const TILE_WIDTH = (Dimensions.get('window').width - TILE_GAP) / 2;

type SearchItem =
  | { type: 'userHeader' }
  | { type: 'user'; user: SearchUser }
  | { type: 'postHeader' }
  | { type: 'postPair'; left: DreamPostItem; right?: DreamPostItem };

function SearchRow({ user }: { user: SearchUser }) {
  const { data: followingIds = new Set<string>() } = useFollowingIds();
  const { data: requestIds = new Set<string>() } = useOutgoingFollowRequestIds();
  const { mutate: toggleFollow } = useToggleFollow();
  const isFollowing = followingIds.has(user.id);
  const hasRequest = requestIds.has(user.id);

  return (
    <TouchableOpacity
      style={s.searchUserRow}
      onPress={() => nav.push(`/user/${user.id}`)}
      activeOpacity={0.7}
    >
      {user.avatarUrl ? (
        <Image
          source={{ uri: resizeAvatar(user.avatarUrl) }}
          style={s.searchAvatar}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={s.searchAvatarFallback}>
          <Text style={s.searchAvatarText}>{(user.username || '?')[0].toUpperCase()}</Text>
        </View>
      )}
      <View style={s.searchUserInfo}>
        <Text style={s.searchUsername}>{user.username}</Text>
      </View>
      <View style={s.searchActions}>
        {isFollowing ? (
          <TouchableOpacity
            style={s.followingPill}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFollow({ userId: user.id, currentlyFollowing: true });
            }}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={s.followingPillText}>Following</Text>
          </TouchableOpacity>
        ) : hasRequest ? (
          <TouchableOpacity
            style={s.followingPill}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFollow({ userId: user.id, currentlyFollowing: false, hasRequest: true });
            }}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={s.followingPillText}>Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={s.followButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFollow({ userId: user.id, currentlyFollowing: false, isPublic: user.isPublic });
            }}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={s.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

function PostPairRow({
  left,
  right,
  albumIds,
}: {
  left: DreamPostItem;
  right?: DreamPostItem;
  albumIds: string[];
}) {
  return (
    <View style={s.postPairRow}>
      <View style={{ width: TILE_WIDTH }}>
        <PostTile item={left} albumIds={albumIds} />
      </View>
      {right ? (
        <View style={{ width: TILE_WIDTH }}>
          <PostTile item={right} albumIds={albumIds} />
        </View>
      ) : (
        <View style={{ width: TILE_WIDTH }} />
      )}
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionHeaderText}>{title}</Text>
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function SearchExploreScreen() {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);

  // ── Medium/vibe data for filter pickers ──
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();
  const mediumItems = useMemo(
    () => [...dbMediums].sort((a, b) => a.label.localeCompare(b.label)),
    [dbMediums]
  );
  const vibeItems = useMemo(
    () => [...dbVibes].sort((a, b) => a.label.localeCompare(b.label)),
    [dbVibes]
  );

  // ── Filter state ──
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [mediumSheetOpen, setMediumSheetOpen] = useState(false);
  const [vibeSheetOpen, setVibeSheetOpen] = useState(false);
  const hasFilters = selectedMedium !== null || selectedVibe !== null;

  const selectedMediumLabel = mediumItems.find((m) => m.key === selectedMedium)?.label ?? null;
  const selectedVibeLabel = vibeItems.find((v) => v.key === selectedVibe)?.label ?? null;

  // ── Pending filter handoff from badge taps ──
  const pendingMedium = useExploreStore((s) => s.pendingMedium);
  const pendingVibe = useExploreStore((s) => s.pendingVibe);
  const clearPending = useExploreStore((s) => s.clearPending);

  useEffect(() => {
    if (pendingMedium !== null || pendingVibe !== null) {
      if (searchActive) deactivateSearch();
      setSelectedMedium(pendingMedium);
      if (pendingVibe !== null) setSelectedVibe(pendingVibe);
      clearPending();
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [pendingMedium, pendingVibe, clearPending]);

  // ── Search state ──
  const [searchActive, setSearchActiveLocal] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const setSearchActiveStore = useExploreStore((s) => s.setSearchActive);

  function activateSearch() {
    setSearchActiveLocal(true);
    setSearchActiveStore(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }

  function deactivateSearch() {
    Keyboard.dismiss();
    setQuery('');
    setSearchActiveLocal(false);
    setSearchActiveStore(false);
  }

  // Search hooks — pass medium/vibe filters so search results are scoped
  const hasQuery = debouncedQuery.trim().length >= 2;
  const { data: userResults = [], isLoading: usersLoading } = useSearchUsers(
    searchActive ? debouncedQuery : ''
  );
  const {
    data: postPages,
    isLoading: postsLoading,
    fetchNextPage: fetchMorePosts,
    hasNextPage: hasMorePosts,
    isFetchingNextPage: fetchingMorePosts,
  } = useSearchPosts(searchActive ? debouncedQuery : '', selectedMedium, selectedVibe);

  const searchPosts = useMemo(() => postPages?.pages.flatMap((p) => p.rows) ?? [], [postPages]);
  const searchAlbumIds = useMemo(() => searchPosts.map((p) => p.id), [searchPosts]);
  const searchLoading = usersLoading || postsLoading;
  const hasResults = userResults.length > 0 || searchPosts.length > 0;

  const searchListData = useMemo(() => {
    if (!hasQuery || !searchActive) return [];
    const items: SearchItem[] = [];
    if (userResults.length > 0) {
      items.push({ type: 'userHeader' });
      for (const user of userResults.slice(0, 3)) {
        items.push({ type: 'user', user });
      }
    }
    if (searchPosts.length > 0) {
      items.push({ type: 'postHeader' });
      for (let i = 0; i < searchPosts.length; i += 2) {
        items.push({ type: 'postPair', left: searchPosts[i], right: searchPosts[i + 1] });
      }
    }
    return items;
  }, [hasQuery, searchActive, userResults, searchPosts]);

  const renderSearchItem = useCallback(
    ({ item }: { item: SearchItem }) => {
      switch (item.type) {
        case 'userHeader':
          return <SectionHeader title="People" />;
        case 'user':
          return <SearchRow user={item.user} />;
        case 'postHeader':
          return <SectionHeader title="Dreams" />;
        case 'postPair':
          return <PostPairRow left={item.left} right={item.right} albumIds={searchAlbumIds} />;
        default:
          return null;
      }
    },
    [searchAlbumIds]
  );

  const searchKeyExtractor = useCallback((item: SearchItem, index: number) => {
    switch (item.type) {
      case 'userHeader':
        return 'uh';
      case 'user':
        return `u-${item.user.id}`;
      case 'postHeader':
        return 'ph';
      case 'postPair':
        return `pp-${item.left.id}`;
      default:
        return `i-${index}`;
    }
  }, []);

  // ── Browse feed ──
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const listRef = useRef<FlatList>(null) as React.RefObject<FlatList>;

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
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

  // ── Render ──

  return (
    <View style={s.root}>
      {/* Browse mode: fullscreen feed */}
      {!searchActive && (
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
              <Text style={s.emptyTitle}>No dreams yet</Text>
              <Text style={s.emptySubtitle}>Be the first to create one</Text>
            </View>
          }
          onHudToggle={handleHudToggle}
        />
      )}

      {/* Search mode: results list */}
      {searchActive && (
        <KeyboardAvoidingView
          style={s.searchContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <View style={[s.searchSafeTop, { paddingTop: insets.top + (hasFilters ? 100 : 60) }]}>
            <RNFlatList
              data={searchListData}
              keyExtractor={searchKeyExtractor}
              renderItem={renderSearchItem}
              keyboardShouldPersistTaps="handled"
              onEndReached={() => {
                if (hasMorePosts && !fetchingMorePosts) fetchMorePosts();
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                fetchingMorePosts ? (
                  <View style={s.searchFooter}>
                    <ActivityIndicator color={colors.textSecondary} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View style={s.searchEmpty}>
                  {searchLoading && hasQuery ? (
                    <ActivityIndicator color={colors.textSecondary} />
                  ) : hasQuery && !hasResults ? (
                    <Text style={s.searchEmptyText}>No results found</Text>
                  ) : (
                    <>
                      <Ionicons
                        name="search"
                        size={40}
                        color={colors.border}
                        style={{ marginBottom: 12 }}
                      />
                      <Text style={s.searchEmptyText}>Search for dreamers and dreams</Text>
                    </>
                  )}
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Overlay: search bar + filter chips */}
      <Animated.View style={[s.topOverlayWrap, searchActive ? undefined : overlayStyle]}>
        <LinearGradient
          colors={
            searchActive
              ? [colors.background, colors.background, colors.background]
              : ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']
          }
          style={[s.topOverlay, { paddingTop: insets.top + 4 }]}
          pointerEvents="box-none"
        >
          {/* Search bar */}
          <View style={s.searchBarRow}>
            <View style={s.searchBarWrap}>
              <Ionicons name="search" size={16} color={colors.textSecondary} style={s.searchIcon} />
              <TextInput
                ref={searchInputRef}
                style={s.searchInput}
                placeholder="Search dreamers and dreams"
                placeholderTextColor={colors.textSecondary}
                value={query}
                onChangeText={setQuery}
                onFocus={activateSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            {searchActive && (
              <TouchableOpacity onPress={deactivateSearch} hitSlop={8} style={s.cancelButton}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips — only visible when filters are active */}
          {hasFilters && (
            <View style={s.chipRow}>
              {selectedMedium && (
                <View style={s.chipGroup}>
                  <TouchableOpacity
                    style={s.chip}
                    onPress={() => setMediumSheetOpen(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={s.chipLabel}>{selectedMediumLabel}</Text>
                    <Ionicons name="chevron-down" size={14} color={colors.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedMedium(null)}
                    hitSlop={8}
                    style={s.chipDismiss}
                  >
                    <Ionicons name="close" size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}
              {selectedVibe && (
                <View style={s.chipGroup}>
                  <TouchableOpacity
                    style={s.chip}
                    onPress={() => setVibeSheetOpen(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={s.chipLabel}>{selectedVibeLabel}</Text>
                    <Ionicons name="chevron-down" size={14} color={colors.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedVibe(null)}
                    hitSlop={8}
                    style={s.chipDismiss}
                  >
                    <Ionicons name="close" size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Picker sheets */}
      <FilterPickerSheet
        visible={mediumSheetOpen}
        onClose={() => setMediumSheetOpen(false)}
        onSelect={(key) => {
          setSelectedMedium(key);
          setMediumSheetOpen(false);
          listRef.current?.scrollToOffset({ offset: 0, animated: false });
        }}
        items={mediumItems}
        selectedKey={selectedMedium}
        title="Medium"
      />
      <FilterPickerSheet
        visible={vibeSheetOpen}
        onClose={() => setVibeSheetOpen(false)}
        onSelect={(key) => {
          setSelectedVibe(key);
          setVibeSheetOpen(false);
          listRef.current?.scrollToOffset({ offset: 0, animated: false });
        }}
        items={vibeItems}
        selectedKey={selectedVibe}
        title="Vibe"
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  // Browse mode
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { color: colors.textSecondary, fontSize: 17, fontWeight: '600' },
  emptySubtitle: { color: colors.textMuted, fontSize: 14 },

  // Overlay
  topOverlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topOverlay: { paddingBottom: 8, gap: 6 },

  // Search bar
  searchBarRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  searchBarWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15, height: 40 },
  cancelButton: { paddingVertical: 8 },
  cancelText: { color: colors.accent, fontSize: 15, fontWeight: '600' },

  // Filter chips
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  chipGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  chipLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipDismiss: {
    padding: 2,
  },

  // Search mode
  searchContainer: { flex: 1, backgroundColor: colors.background },
  searchSafeTop: { flex: 1 },
  searchFooter: { paddingVertical: 20 },
  searchEmpty: { alignItems: 'center', paddingTop: 60 },
  searchEmptyText: { color: colors.textSecondary, fontSize: 14 },

  // Search results — users
  searchUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
    gap: 12,
  },
  searchAvatar: { width: 44, height: 44, borderRadius: 22 },
  searchAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchAvatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  searchUserInfo: { flex: 1, gap: 2 },
  searchUsername: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  searchActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  followButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  followButtonText: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  followingPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  followingPillText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },

  // Search results — posts
  postPairRow: { flexDirection: 'row', gap: TILE_GAP },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionHeaderText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

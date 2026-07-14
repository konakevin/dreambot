/**
 * Search + Explore Screen — dual-mode tab.
 *
 * BROWSE MODE (default): search bar + 2-column grid of thumbnails. Instagram Explore pattern.
 * SEARCH MODE (tap search bar): grid hidden, search results shown.
 *
 * Filter chips appear below the search bar ONLY when a medium or vibe filter
 * is active. Each chip is
 * tappable to open a picker sheet and change the filter value. Each has a ✕
 * to dismiss that individual filter. Search results respect active filters.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
  ActivityIndicator,
  FlatList as RNFlatList,
  RefreshControl,
  Animated,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Text, TextInput } from '@/components/AppText';
import { useExploreStore } from '@/store/explore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapRpcToDreamPost, castRows } from '@/lib/mapPost';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { minRefreshHold } from '@/lib/minRefresh';
import { useRefreshGap } from '@/hooks/useRefreshGap';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { useSearchUsers, type SearchUser } from '@/hooks/useSearchUsers';
import { useSearchPosts } from '@/hooks/useSearchPosts';
import { useSearchHashtags } from '@/hooks/useHashtagPosts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useOutgoingFollowRequestIds } from '@/hooks/useFollowRequests';
import { colors } from '@/constants/theme';
import { NUM_COLUMNS, TILE_GAP, TILE_WIDTH, TRIPLET_TILE_WIDTH } from '@/constants/grid';
import * as nav from '@/lib/navigate';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { FilterPickerSheet } from '@/components/FilterPickerSheet';
import { PostTile } from '@/components/PostTile';
import { GridSkeleton } from '@/components/Skeleton';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { verticalScale, fontScale } from '@/lib/responsive';
import type { DreamPostItem } from '@/components/DreamCard';

// ── Browse mode feed query ───────────────────────────────────────────────────

const FEED_PAGE_SIZE = 20;

interface ExploreCursor {
  score: number;
  id: string;
}

async function fetchExplorePage(
  userId: string,
  medium: string | null,
  vibe: string | null,
  feedSeed: number,
  feedShuffle: number,
  pageParam: ExploreCursor | null
): Promise<(DreamPostItem & { feed_score?: number })[]> {
  const args = {
    p_user_id: userId,
    p_limit: FEED_PAGE_SIZE,
    p_seed: feedSeed,
    p_tab: 'forYou',
    ...(pageParam ? { p_cursor_score: pageParam.score, p_cursor_id: pageParam.id } : {}),
    ...(medium ? { p_medium: medium } : {}),
    ...(vibe ? { p_vibe: vibe } : {}),
  };
  // p_shuffle: mig 352 reshuffle strength; retry without it pre-migration.
  let { data, error } = await supabase.rpc('get_feed', { ...args, p_shuffle: feedShuffle });
  if (error && error.code === 'PGRST202') {
    ({ data, error } = await supabase.rpc('get_feed', args));
  }
  if (error) throw error;
  return castRows(data).map((row) => ({
    ...mapRpcToDreamPost(row),
    feed_score: row.feed_score as number,
  }));
}

function exploreQueryKey(
  medium: string | null,
  vibe: string | null,
  feedSeed: number,
  feedShuffle: number
) {
  return ['explore', medium ?? '', vibe ?? '', feedSeed, feedShuffle] as const;
}

function useExploreDreams(mediums: string[], vibes: string[]) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const feedShuffle = useFeedStore((s) => s.feedShuffle);
  const medium = mediums[0] ?? null;
  const vibe = vibes[0] ?? null;

  return useInfiniteQuery({
    queryKey: exploreQueryKey(medium, vibe, feedSeed, feedShuffle),
    queryFn: ({ pageParam }) =>
      fetchExplorePage(user!.id, medium, vibe, feedSeed, feedShuffle, pageParam),
    initialPageParam: null as ExploreCursor | null,
    getNextPageParam: (lastPage) => {
      // Terminate ONLY on a genuinely empty page. An undersized page (< limit)
      // does NOT mean we're at the end — the server-side get_feed filter
      // (blocked users, hidden posts, dedup) can return fewer rows than
      // requested even when more are available. The old `< FEED_PAGE_SIZE`
      // check stranded the Top grid at a fake bottom. Trade-off: one
      // trailing empty fetch on the genuinely-last page.
      if (lastPage.length === 0) return undefined;
      const last = lastPage[lastPage.length - 1];
      if (last.feed_score == null) return undefined;
      return { score: last.feed_score, id: last.id } as ExploreCursor;
    },
    enabled: !!user,
    // Keep the current grid on screen while a new seed loads (pull-to-refresh),
    // so it never blanks to a loading state — the grid reshuffles in place.
    placeholderData: keepPreviousData,
    // Freeze loaded pages for the session — see hooks/useDreamFeed.ts
    // (2026-07-06): background refetches recompute LIVE feed_scores and
    // reshuffle already-rendered grid content. Pull-to-refresh + the
    // feedSeed rotation remain the intentional refresh channels.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ── Search result components ─────────────────────────────────────────────────

type SearchItem =
  | { type: 'userHeader' }
  | { type: 'user'; user: SearchUser }
  | { type: 'tagHeader' }
  | { type: 'tag'; tag: string; count: number }
  | { type: 'postHeader' }
  | {
      type: 'postTriplet';
      left: DreamPostItem;
      middle?: DreamPostItem;
      right?: DreamPostItem;
    };

// Hashtag result row (migration 331) — # glyph disc + tag + post count,
// pushes the tag page. Mirrors the SearchRow (people) layout.
function TagRow({ tag, count }: { tag: string; count: number }) {
  return (
    <TouchableOpacity
      style={s.searchUserRow}
      onPress={() => nav.push(`/hashtag/${tag}`)}
      activeOpacity={0.7}
    >
      <View style={s.searchAvatarFallback}>
        <Text allowFontScaling={false} style={s.tagGlyph}>
          #
        </Text>
      </View>
      <View style={s.searchUserInfo}>
        <Text style={s.searchUsername}>#{tag}</Text>
        <Text style={s.tagCount}>{count === 1 ? '1 dream' : `${count} dreams`}</Text>
      </View>
    </TouchableOpacity>
  );
}

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
          <Text allowFontScaling={false} style={s.searchAvatarText}>
            {(user.username || '?')[0].toUpperCase()}
          </Text>
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

function PostTripletRow({
  left,
  middle,
  right,
}: {
  left: DreamPostItem;
  middle?: DreamPostItem;
  right?: DreamPostItem;
}) {
  return (
    <View style={s.postTripletRow}>
      <View style={{ width: TRIPLET_TILE_WIDTH }}>
        <PostTile item={left} width={TRIPLET_TILE_WIDTH} />
      </View>
      {middle ? (
        <View style={{ width: TRIPLET_TILE_WIDTH }}>
          <PostTile item={middle} width={TRIPLET_TILE_WIDTH} />
        </View>
      ) : (
        <View style={{ width: TRIPLET_TILE_WIDTH }} />
      )}
      {right ? (
        <View style={{ width: TRIPLET_TILE_WIDTH }}>
          <PostTile item={right} width={TRIPLET_TILE_WIDTH} />
        </View>
      ) : (
        <View style={{ width: TRIPLET_TILE_WIDTH }} />
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

  // ── Search state ──
  const [searchActive, setSearchActiveLocal] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const setSearchActiveStore = useExploreStore((s) => s.setSearchActive);

  // Stable so it can be a clean dependency of the pending-filter effect below.
  const deactivateSearch = useCallback(() => {
    Keyboard.dismiss();
    setQuery('');
    setSearchActiveLocal(false);
    setSearchActiveStore(false);
  }, [setSearchActiveStore]);

  function activateSearch() {
    setSearchActiveLocal(true);
    setSearchActiveStore(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }

  useEffect(() => {
    if (pendingMedium !== null || pendingVibe !== null) {
      // deactivateSearch is idempotent (no-op when search is already off), so
      // we call it unconditionally — preserving behavior while keeping the dep
      // array clean (no `searchActive` read needed).
      deactivateSearch();
      setSelectedMedium(pendingMedium);
      if (pendingVibe !== null) setSelectedVibe(pendingVibe);
      clearPending();
      gridRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [pendingMedium, pendingVibe, clearPending, deactivateSearch]);

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

  // Tag prefix search (migration 331) — works with or without a leading '#'
  // in the query; the hook/RPC normalize it.
  const { data: tagResults = [] } = useSearchHashtags(searchActive ? debouncedQuery : '');

  // Same page-boundary dedup as the explore grid below — see that memo's note.
  const searchPosts = useMemo(() => {
    const rows = postPages?.pages.flatMap((p) => p.rows) ?? [];
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [postPages]);
  const searchLoading = usersLoading || postsLoading;
  const hasResults = userResults.length > 0 || tagResults.length > 0 || searchPosts.length > 0;

  const searchListData = useMemo(() => {
    if (!hasQuery || !searchActive) return [];
    const items: SearchItem[] = [];
    if (userResults.length > 0) {
      items.push({ type: 'userHeader' });
      for (const user of userResults.slice(0, 3)) {
        items.push({ type: 'user', user });
      }
    }
    if (tagResults.length > 0) {
      items.push({ type: 'tagHeader' });
      for (const t of tagResults) {
        items.push({ type: 'tag', tag: t.tag, count: t.post_count });
      }
    }
    if (searchPosts.length > 0) {
      items.push({ type: 'postHeader' });
      for (let i = 0; i < searchPosts.length; i += 3) {
        items.push({
          type: 'postTriplet',
          left: searchPosts[i],
          middle: searchPosts[i + 1],
          right: searchPosts[i + 2],
        });
      }
    }
    return items;
  }, [hasQuery, searchActive, userResults, tagResults, searchPosts]);

  const renderSearchItem = useCallback(({ item }: { item: SearchItem }) => {
    switch (item.type) {
      case 'userHeader':
        return <SectionHeader title="People" />;
      case 'user':
        return <SearchRow user={item.user} />;
      case 'tagHeader':
        return <SectionHeader title="Tags" />;
      case 'tag':
        return <TagRow tag={item.tag} count={item.count} />;
      case 'postHeader':
        return <SectionHeader title="Dreams" />;
      case 'postTriplet':
        return <PostTripletRow left={item.left} middle={item.middle} right={item.right} />;
      default:
        return null;
    }
  }, []);

  const searchKeyExtractor = useCallback((item: SearchItem, index: number) => {
    switch (item.type) {
      case 'userHeader':
        return 'uh';
      case 'user':
        return `u-${item.user.id}`;
      case 'tagHeader':
        return 'th';
      case 'tag':
        return `t-${item.tag}`;
      case 'postHeader':
        return 'ph';
      case 'postTriplet':
        return `pt-${item.left.id}`;
      default:
        return `i-${index}`;
    }
  }, []);

  // ── Browse feed (grid mode) ──
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const regenerateSeed = useFeedStore((s) => s.regenerateSeed);
  const topGridResetToken = useFeedStore((s) => s.topGridResetToken);
  const gridRef = useRef<RNFlatList>(null);

  useEffect(() => {
    gridRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [feedSeed]);

  const activeMediums = selectedMedium ? [selectedMedium] : [];
  const activeVibes = selectedVibe ? [selectedVibe] : [];
  const { data, isLoading, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useExploreDreams(activeMediums, activeVibes);
  // Dedup by id across page boundaries. get_feed's keyset cursor compares
  // LIVE-recomputed feed_scores (time-decay + engagement terms), so a page-1
  // boundary post whose score drifts below the stale cursor by the page-2
  // request is re-emitted — the "same image twice ~20 tiles in" grid bug
  // (2026-07-06). Same guard as the home feed's feedPosts memo.
  const posts = useMemo(() => {
    const rows = data?.pages.flat() ?? [];
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [data]);

  // ── Tap-active-tab gesture (Instagram-style) ──
  // Scroll-to-top is already handled by the feedSeed effect above (regenerateSeed
  // fires on re-tap which bumps feedSeed). Here we add the refetch.
  const skipFirstTopReset = useRef(true);
  useEffect(() => {
    if (skipFirstTopReset.current) {
      skipFirstTopReset.current = false;
      return;
    }
    refetch();
    gridRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [topGridResetToken, refetch]);

  // Local pull-to-refresh spinner — see FullScreenFeed for rationale.
  const [isPulling, setIsPulling] = useState(false);
  const queryClient = useQueryClient();
  // Pull-to-refresh RESEEDS the browse grid — PREFETCH the new seed's page 1,
  // THEN swap the seed, so the old grid never reflows under the held-open gap
  // (the old reseed-first flow swapped mid-gap: the grid popped back up while
  // the spinner kept spinning over the top row — Kevin 2026-07-09). Gap +
  // overlay release together, one frame after the swap commits.
  const handlePullToRefresh = useCallback(async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    setIsPulling(true);
    try {
      useFeedStore.getState().bumpShuffle();
      const newSeed = Math.random();
      const shuffle = useFeedStore.getState().feedShuffle;
      const medium = activeMediums[0] ?? null;
      const vibe = activeVibes[0] ?? null;
      await Promise.all([
        queryClient.prefetchInfiniteQuery({
          queryKey: exploreQueryKey(medium, vibe, newSeed, shuffle),
          queryFn: ({ pageParam }) =>
            fetchExplorePage(
              userId,
              medium,
              vibe,
              newSeed,
              shuffle,
              pageParam as ExploreCursor | null
            ),
          initialPageParam: null as ExploreCursor | null,
        }),
        minRefreshHold(),
      ]);
      useFeedStore.getState().setFeedSeed(newSeed);
    } finally {
      requestAnimationFrame(() => setIsPulling(false));
    }
  }, [queryClient, activeMediums, activeVibes]);

  const overlayHeight = insets.top + 4 + 40 + 8 + (hasFilters ? 36 : 0);

  // Self-held pull gap for the browse grid (native RefreshControl spinner is
  // unreliable on Fabric — see useRefreshGap). Gated with the same condition the
  // spinner uses so the gap never opens mid-pagination.
  const exploreGap = useRefreshGap(isPulling && !isFetchingNextPage);

  // ── Render ──

  return (
    <View style={s.root}>
      {/* Our own gray refresh spinner, resting in the self-held gap below the
          search box (native RefreshControl spinner unreliable on Fabric). */}
      {!searchActive && isPulling && !isFetchingNextPage && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: overlayHeight + verticalScale(14),
            left: 0,
            right: 0,
            zIndex: 5,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" color={colors.textSecondary} />
        </View>
      )}
      {/* Browse mode: 2-column thumbnail grid */}
      {!searchActive && (
        <RNFlatList<DreamPostItem>
          ref={gridRef}
          data={posts}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={s.gridRow}
          contentContainerStyle={{ paddingTop: overlayHeight, paddingBottom: verticalScale(90) }}
          windowSize={7}
          maxToRenderPerBatch={8}
          initialNumToRender={10}
          removeClippedSubviews
          // `refreshing` pinned FALSE — native spinner unreliable on Fabric
          // (react-native#56343); our own spinner rests in the self-held gap
          // (the ListHeaderComponent spacer below, under the search box). The
          // control stays only for its pull gesture (onRefresh).
          refreshControl={<RefreshControl refreshing={false} onRefresh={handlePullToRefresh} />}
          ListHeaderComponent={<Animated.View style={{ height: exploreGap }} />}
          onEndReachedThreshold={0.5}
          onEndReached={() => hasNextPage && fetchNextPage()}
          ListEmptyComponent={
            isLoading ? (
              <GridSkeleton />
            ) : (
              <View style={s.empty}>
                <Ionicons name="moon-outline" size={48} color={colors.textSecondary} />
                <Text style={s.emptyTitle}>No dreams yet</Text>
                <Text style={s.emptySubtitle}>Be the first to create one</Text>
              </View>
            )
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={s.searchFooter}>
                <ActivityIndicator color={colors.textSecondary} />
              </View>
            ) : null
          }
          renderItem={({ item }) => <PostTile item={item} />}
        />
      )}

      {/* Search mode: results list */}
      {searchActive && (
        <KeyboardAvoidingView
          style={s.searchContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <View style={[s.searchSafeTop, { paddingTop: overlayHeight }]}>
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
                        style={{ marginBottom: verticalScale(12) }}
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

      {/* Header overlay: search bar + filter chips */}
      <View style={s.topOverlayWrap}>
        <View
          style={[s.topOverlay, { paddingTop: insets.top + 4, backgroundColor: colors.background }]}
        >
          {/* Search bar */}
          <View style={s.searchBarRow}>
            <View style={s.searchBarWrap}>
              <Ionicons name="search" size={16} color={colors.accent} style={s.searchIcon} />
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
        </View>
      </View>

      {/* Picker sheets */}
      <FilterPickerSheet
        visible={mediumSheetOpen}
        onClose={() => setMediumSheetOpen(false)}
        onSelect={(key) => {
          setSelectedMedium(key);
          setMediumSheetOpen(false);
          gridRef.current?.scrollToOffset({ offset: 0, animated: false });
        }}
        items={mediumItems}
        selectedKey={selectedMedium}
        title="Style"
      />
      <FilterPickerSheet
        visible={vibeSheetOpen}
        onClose={() => setVibeSheetOpen(false)}
        onSelect={(key) => {
          setSelectedVibe(key);
          setVibeSheetOpen(false);
          gridRef.current?.scrollToOffset({ offset: 0, animated: false });
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
  root: { flex: 1, backgroundColor: colors.background },

  // Browse grid
  gridRow: { gap: TILE_GAP, marginBottom: TILE_GAP },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: verticalScale(60),
  },
  emptyTitle: { color: colors.textSecondary, fontSize: fontScale(17), fontWeight: '600' },
  emptySubtitle: { color: colors.textMuted, fontSize: fontScale(14) },

  // Overlay
  topOverlayWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topOverlay: { paddingBottom: verticalScale(8), gap: 6 },

  // Search bar
  searchBarRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  searchBarWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // Lighter fill + a 1px border so the field reads as a tappable input
    // instead of blending into the black background.
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: fontScale(15), height: 40 },
  cancelButton: { paddingVertical: verticalScale(8) },
  cancelText: { color: colors.accent, fontSize: fontScale(15), fontWeight: '600' },

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
    paddingVertical: verticalScale(6),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  chipLabel: {
    color: colors.textPrimary,
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  chipDismiss: {
    padding: 2,
  },

  // Search mode
  searchContainer: { flex: 1, backgroundColor: colors.background },
  searchSafeTop: { flex: 1 },
  searchFooter: { paddingVertical: verticalScale(20) },
  searchEmpty: { alignItems: 'center', paddingTop: verticalScale(60) },
  searchEmptyText: { color: colors.textSecondary, fontSize: fontScale(14) },

  // Search results — users
  searchUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
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
  searchAvatarText: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '700' },
  searchUserInfo: { flex: 1, gap: 2 },
  searchUsername: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '600' },
  // Tag result rows — # disc reuses the avatar-fallback disc.
  tagGlyph: { color: colors.textSecondary, fontSize: fontScale(20), fontWeight: '700' },
  tagCount: { color: colors.textSecondary, fontSize: fontScale(12) },
  searchActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  followButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(5),
  },
  followButtonText: { color: colors.accent, fontSize: fontScale(12), fontWeight: '600' },
  followingPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(5),
  },
  followingPillText: { color: colors.textSecondary, fontSize: fontScale(12), fontWeight: '600' },

  // Search results — posts
  postTripletRow: { flexDirection: 'row', gap: TILE_GAP },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(8),
  },
  sectionHeaderText: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

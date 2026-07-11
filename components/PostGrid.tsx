import { BrandSpinner } from '@/components/BrandSpinner';
import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFavoritePosts } from '@/hooks/useFavoritePosts';
import { useUserReposts } from '@/hooks/useUserReposts';
import { usePublicProfilePosts } from '@/hooks/usePublicProfilePosts';
import { useHashtagPosts } from '@/hooks/useHashtagPosts';
import { useMyDreams } from '@/hooks/useMyDreams';
import { useAuthStore } from '@/store/auth';
import { PostTile } from '@/components/PostTile';
import { useAlbumStore } from '@/store/album';
import { GridSkeleton } from '@/components/Skeleton';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { NUM_COLUMNS, TILE_GAP, ROW_HEIGHT } from '@/constants/grid';
import type { DreamPostItem } from '@/components/DreamCard';
import type { DreamsFilter } from '@/hooks/useMyDreams';

export type PostGridSource =
  | { type: 'own' }
  | { type: 'saved' }
  | { type: 'dreams'; dreamsFilter?: DreamsFilter }
  | { type: 'reposts'; userId: string }
  | { type: 'user'; userId: string }
  | { type: 'hashtag'; tag: string };

interface PostGridProps {
  source: PostGridSource;
  isOwn?: boolean;
  /** Awaited alongside the grid's own invalidation on pull-to-refresh — the
   *  profile passes its header refetch here so a pull refreshes the WHOLE
   *  screen's data (counts/bio/avatar), not just the grid (2026-07-09). */
  onRefreshExtra?: () => Promise<unknown>;
  emptyText?: string;
  ListHeaderComponent?: React.ReactElement;
  highlightPostId?: string;
  scrollToTopToken?: number;
  showPrivateBadge?: boolean;
  /**
   * Fired with the current contentOffset.y on every scroll event. Used by
   * profile screens to reveal a compact sticky top bar once the user
   * scrolls past the avatar block. Throttled via the FlatList's
   * scrollEventThrottle, not here — the callback runs whenever a frame
   * fires.
   */
  onScrollProgress?: (y: number) => void;
  /** Multi-select wiring (bulk delete, 2026-07-10) — see PostTileSelection.
   *  Provided only by grids that support it (the owner's Dreams grid). */
  selection?: {
    active: boolean;
    selectedIds: ReadonlySet<string>;
    onToggle: (id: string) => void;
    onEnter: (id: string) => void;
  };
}

export function PostGrid({
  source,
  isOwn = false,
  emptyText = 'No posts yet',
  ListHeaderComponent,
  highlightPostId,
  scrollToTopToken,
  showPrivateBadge = false,
  onScrollProgress,
  onRefreshExtra,
  selection,
}: PostGridProps) {
  const listRef = useRef<FlatList>(null);
  // Selection order (1-based) from the selected-ids Set's insertion order —
  // drives the numbered badges (see renderItem). Rebuilt per toggle (each
  // toggle produces a fresh Set).
  const selectionOrder = useMemo(() => {
    const m = new Map<string, number>();
    if (selection) {
      let i = 1;
      for (const id of selection.selectedIds) m.set(id, i++);
    }
    return m;
  }, [selection]);
  const [headerHeight, setHeaderHeight] = useState(0);
  // Mirror of headerHeight readable inside the onScroll callback without making
  // it a dependency (keeps the callback identity stable).
  const headerHeightRef = useRef(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      onScrollProgress?.(e.nativeEvent.contentOffset.y);
    },
    [onScrollProgress]
  );

  useEffect(() => {
    if (scrollToTopToken && scrollToTopToken > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToTopToken]);

  const isOwn_ = source.type === 'own';
  const isSaved = source.type === 'saved';
  const isDreams = source.type === 'dreams';
  const isUser = source.type === 'user';
  const isReposts = source.type === 'reposts';
  const isHashtag = source.type === 'hashtag';
  const userId = isUser ? source.userId : isReposts ? source.userId : '';
  const hashtag = source.type === 'hashtag' ? source.tag : '';

  const dreamsFilter = source.type === 'dreams' ? (source.dreamsFilter ?? 'all') : 'all';
  const ownQuery = useUserPosts(isOwn_);
  const savedQuery = useFavoritePosts(isSaved);
  const userQuery = usePublicProfilePosts(userId, isUser);
  const dreamsQuery = useMyDreams(dreamsFilter);
  const repostsQuery = useUserReposts(userId, isReposts);
  const hashtagQuery = useHashtagPosts(hashtag, isHashtag);

  const activeQuery = isOwn_
    ? ownQuery
    : isSaved
      ? savedQuery
      : isDreams
        ? dreamsQuery
        : isReposts
          ? repostsQuery
          : isHashtag
            ? hashtagQuery
            : userQuery;

  // Pull-to-refresh on an infinite query refetches EVERY loaded page in
  // sequence (TanStack Query v5 removed the per-page `refetchPage` opt).
  // After scrolling deep, that's 5+ sequential round-trips. Trim the
  // cache to the first page before invalidating so the refresh is one
  // round-trip — the user keeps scroll position, deeper pages reload as
  // they re-scroll into view.
  //
  // Use invalidateQueries (not query.refetch()) — refetch() reads internal
  // page-count state that doesn't always sync with the prior setQueryData
  // trim and can no-op when a concurrent fetchNextPage is mid-flight
  // (e.g. pendingAutoAnchor effect below). invalidateQueries marks the
  // query stale + triggers refetch atomically, the documented pattern.
  const queryClient = useQueryClient();
  const authUserId = useAuthStore((s) => s.user?.id);
  const activeQueryKey = useMemo(() => {
    if (isOwn_) return ['userPosts', authUserId];
    if (isSaved) return ['favoritePosts', authUserId];
    if (isDreams) return ['my-dreams', authUserId];
    if (isReposts) return ['userReposts', userId];
    if (isHashtag) return ['hashtagPosts', hashtag];
    return ['publicProfilePosts', userId];
  }, [isOwn_, isSaved, isDreams, isReposts, isHashtag, hashtag, userId, authUserId]);
  // Spinner state owned LOCALLY so the RefreshControl reflects ONLY a
  // user-initiated pull — never a programmatic refetch. Binding `refreshing` to
  // activeQuery.isRefetching (the old way) meant any background refetch (screen
  // focus, app foreground, a mutation invalidating this key elsewhere) flipped
  // the RefreshControl on, which iOS renders as a pull — and since there was no
  // real pull gesture, the ScrollView got STUCK in the pulled-down state with
  // the spinner showing forever (Kevin 2026-07-07). This mirrors the fix the
  // profile Followers list already uses.
  const [isPulling, setIsPulling] = useState(false);
  const handleRefresh = useCallback(async () => {
    setIsPulling(true);
    try {
      queryClient.setQueryData<InfiniteData<unknown>>(activeQueryKey, (old) =>
        old ? { pages: old.pages.slice(0, 1), pageParams: old.pageParams.slice(0, 1) } : old
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: activeQueryKey, refetchType: 'active' }),
        onRefreshExtra?.(),
      ]);
    } finally {
      setIsPulling(false);
    }
  }, [queryClient, activeQueryKey, onRefreshExtra]);

  const posts: DreamPostItem[] = useMemo(
    () => activeQuery.data?.pages.flatMap((p) => p.rows) ?? [],
    [activeQuery.data]
  );

  const isLoading = activeQuery.isLoading;
  const hasNextPage = activeQuery.hasNextPage;
  const isFetchingNextPage = activeQuery.isFetchingNextPage;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, activeQuery]);

  // Subscribe to store directly so the latest currentPostId is reflected
  // even if the parent screen's render of the prop is stale. Store value
  // wins — the prop is only a fallback for screens that don't track via
  // the album store (e.g. user/[userId] with ?viewedPost= URL param).
  const storeCurrentPostId = useAlbumStore((s) => s.currentPostId);
  const effectiveHighlightId = storeCurrentPostId ?? highlightPostId ?? undefined;

  const highlightIndex = useMemo(() => {
    if (!effectiveHighlightId) return -1;
    return posts.findIndex((p) => p.id === effectiveHighlightId);
  }, [posts, effectiveHighlightId]);

  const navigation = useNavigation();
  const [highlightDismissed, setHighlightDismissed] = useState(false);
  const [badgeTapped, setBadgeTapped] = useState(false);
  const [isFetchingHighlight, setIsFetchingHighlight] = useState(false);

  useEffect(() => {
    if (!highlightPostId) return;
    return navigation.addListener('blur', () => {
      setHighlightDismissed(true);
    });
  }, [navigation, highlightPostId]);

  // Auto-scroll to the highlighted post on every focus enter — fixes the
  // "lose your place after detail-view scroll" bug. PostTile sets the album
  // store's currentPostId on tap, FullScreenFeed updates it via onIndexChange
  // as the user scrolls through detail view, and on swipe-back this grid
  // refocuses and silently snaps to the row the user was just on.
  // Ref ensures we only run once per focus, even if highlightIndex resolves
  // late (deep-link landing → posts fetch → index resolves).
  const didAutoScrollForFocus = useRef(false);

  // Prefetch full-detail-size image for any tile that scrolls into view, so
  // tapping into the detail view is instant. Skip already-prefetched IDs.
  const prefetchedRef = useRef<Set<string>>(new Set());
  const viewabilityConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 });
  const onGridViewableChanged = useRef(
    ({ viewableItems }: { viewableItems: { item?: DreamPostItem }[] }) => {
      const toPrefetch: string[] = [];
      for (const v of viewableItems) {
        if (!v.item) continue;
        if (prefetchedRef.current.has(v.item.id)) continue;
        prefetchedRef.current.add(v.item.id);
        // Prefetch the small JPEG display variant (~150 KB), not the full
        // image_url (1-2 MB PNG). Detail view reads image_url_display
        // anyway — prefetching the same URL is what actually warms the
        // tap-into-detail cache. Was downloading 10× the bytes needed.
        toPrefetch.push(v.item.image_url_display ?? v.item.image_url);
      }
      if (toPrefetch.length > 0) {
        ExpoImage.prefetch(toPrefetch);
      }
    }
  );

  const scrollToHighlightRow = useCallback(
    (idx: number, opts?: { silent?: boolean }) => {
      if (!listRef.current || idx < 0) return;
      const targetRow = Math.floor(idx / NUM_COLUMNS);
      // Center the row in the visible grid area (below the sticky header)
      // so the tile the user was just viewing lands mid-screen, not at the top.
      const visibleArea = Math.max(ROW_HEIGHT, containerHeight - headerHeight);
      const centeredOffset = headerHeight + targetRow * ROW_HEIGHT - (visibleArea - ROW_HEIGHT) / 2;
      const targetOffset = Math.max(0, centeredOffset);

      // Badge-tap (user-initiated jump) → ANIMATE the scroll. A synchronous
      // jump-to-row across a long distance shows the virtualizer mid-rebuild,
      // which the old code masked with a 300ms dim+spinner overlay — but that
      // overlay sat 300ms after a 1-frame jump, reading as "loading" when
      // nothing was loading. Animated scroll fixes both: smooth slide, no
      // virtualizer chaos to hide, no fake loading state.
      //
      // Silent (background auto-anchor during the back-swipe transition):
      // hard jump. The user is watching the detail-screen slide away — the
      // grid is occluded, so any mid-rebuild garbage is invisible. Animating
      // a background scroll just wastes ~300ms.
      listRef.current.scrollToOffset({ offset: targetOffset, animated: !opts?.silent });
      setBadgeTapped(true);
    },
    [headerHeight, containerHeight]
  );

  useEffect(() => {
    if (isFetchingHighlight && highlightIndex >= 0) {
      setIsFetchingHighlight(false);
      requestAnimationFrame(() => {
        scrollToHighlightRow(highlightIndex);
      });
    }
  }, [isFetchingHighlight, highlightIndex, scrollToHighlightRow]);

  // Auto-anchor on focus enter. The hard case is when the user scrolled past
  // the grid's first page (PAGE_SIZE=18) in detail view: highlightPostId is
  // set, but highlightIndex === -1 because the post isn't in the loaded
  // grid pages yet. We must fetch pages until found, THEN scroll.
  // `pendingAutoAnchor` flag drives both: while true, paginate; when found,
  // scroll once and clear.
  const [pendingAutoAnchor, setPendingAutoAnchor] = useState(false);

  // Live auto-anchor — ONLY for store-driven highlights (i.e. the user
  // came from this profile's photo detail and scrolled there). Triggered
  // by setCurrentPostId calls in PostTile.handlePress + FullScreenFeed
  // onIndexChange. Runs while the grid is blurred so swipe-back lands at
  // the right offset with no visible pop.
  //
  // URL-param highlights (e.g. user/[userId]?viewedPost=X — clicked an
  // avatar from the main feed) deliberately DO NOT trigger auto-anchor.
  // Those just light up the "Just viewed" badge; the user has to tap it
  // to scroll, since they didn't actually drill into that post.
  useEffect(() => {
    if (!storeCurrentPostId) return;
    setHighlightDismissed(false);
    setPendingAutoAnchor(true);
  }, [storeCurrentPostId]);

  // Reset the focus ref on focus enter (kept so the deep-link badge path
  // remains correct).
  useFocusEffect(
    useCallback(() => {
      didAutoScrollForFocus.current = false;
      return undefined;
    }, [])
  );

  // Step 1: paginate until the highlighted post enters the loaded set.
  useEffect(() => {
    if (!pendingAutoAnchor) return;
    if (highlightIndex >= 0) return;
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [pendingAutoAnchor, highlightIndex, activeQuery]);

  // Step 2: once the post is in loaded pages and the layout is measured,
  // silently scroll to it, then clear the pending flag.
  useEffect(() => {
    if (!pendingAutoAnchor) return;
    if (highlightIndex < 0 || containerHeight === 0) return;
    setPendingAutoAnchor(false);
    didAutoScrollForFocus.current = true;
    requestAnimationFrame(() => scrollToHighlightRow(highlightIndex, { silent: true }));
  }, [pendingAutoAnchor, highlightIndex, containerHeight, scrollToHighlightRow]);

  // Keep fetching pages while searching for the highlight post (user tapped badge)
  useEffect(() => {
    if (
      isFetchingHighlight &&
      highlightIndex === -1 &&
      activeQuery.hasNextPage &&
      !activeQuery.isFetchingNextPage
    ) {
      activeQuery.fetchNextPage();
    }
  }, [isFetchingHighlight, highlightIndex, activeQuery]);

  const gridArea = containerHeight - headerHeight;
  const visibleRows = gridArea > 0 ? Math.floor(gridArea / ROW_HEIGHT) : 0;
  const maxVisibleIndex = visibleRows > 0 ? visibleRows * NUM_COLUMNS - 1 : -1;

  const showJustViewedButton =
    !!highlightPostId &&
    !highlightDismissed &&
    !badgeTapped &&
    !isFetchingHighlight &&
    (highlightIndex === -1
      ? !activeQuery.isLoading
      : containerHeight > 0 && highlightIndex > maxVisibleIndex);

  const scrollToHighlight = useCallback(() => {
    if (highlightIndex >= 0) {
      scrollToHighlightRow(highlightIndex);
    } else if (activeQuery.hasNextPage) {
      setIsFetchingHighlight(true);
      activeQuery.fetchNextPage();
    }
  }, [highlightIndex, activeQuery, scrollToHighlightRow]);

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      <FlatList<DreamPostItem>
        ref={listRef}
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        // No getItemLayout: with numColumns the only way to express
        // "items in the same row share an offset" is per-item length =
        // ROW_HEIGHT with shared offsets, which makes FlatList compute
        // sum-of-lengths total content height as N_items × ROW_HEIGHT
        // (3× actual at numColumns=3). That inflated total breaks
        // virtualization windowing — in-viewport tiles get spuriously
        // evicted and remounted during slow drags. Letting FlatList
        // measure is correct and we don't use scrollToIndex anywhere.
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: verticalScale(90) }}
        // Lock scrolling to one axis (iOS): a vertical flick won't pan
        // diagonally and leak horizontal movement into the parent swipe-back.
        directionalLockEnabled
        windowSize={7}
        maxToRenderPerBatch={6}
        initialNumToRender={12}
        removeClippedSubviews={false}
        // Native spinner hidden — the BrandSpinner overlay below is the visual
        // (the RefreshControl still owns the pull gesture + held-open gap).
        refreshControl={
          <RefreshControl
            refreshing={isPulling}
            onRefresh={handleRefresh}
            tintColor="transparent"
          />
        }
        ListHeaderComponent={
          ListHeaderComponent ? (
            <View
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                setHeaderHeight(h);
                headerHeightRef.current = h;
              }}
            >
              {ListHeaderComponent}
            </View>
          ) : undefined
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onGridViewableChanged.current}
        ListEmptyComponent={
          isLoading ? (
            <GridSkeleton />
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.textSecondary} />
            </View>
          ) : null
        }
        // Selection state lives outside the items — extraData makes the
        // FlatList re-render rows when the selected set / mode changes.
        extraData={selection && [selection.active, selection.selectedIds]}
        renderItem={({ item }) => (
          <PostTile
            item={item}
            isOwn={isOwn}
            albumSource={source}
            isHighlighted={!highlightDismissed && item.id === highlightPostId}
            showPrivateBadge={showPrivateBadge}
            allPosts={posts}
            selection={
              selection
                ? {
                    active: selection.active,
                    selected: selection.selectedIds.has(item.id),
                    // 1-based selection order (JS Sets iterate in insertion
                    // order) — the badge shows the number and renumbers live
                    // as tiles toggle, matching the gallery picker. This order
                    // is exactly the album order bulk-Post hands to post/new.
                    order: selectionOrder.get(item.id) ?? null,
                    onToggle: selection.onToggle,
                    onEnter: selection.onEnter,
                  }
                : undefined
            }
          />
        )}
      />
      {isPulling && (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 14, left: 0, right: 0, alignItems: 'center' }}
        >
          <BrandSpinner size={26} />
        </View>
      )}
      {showJustViewedButton && (
        <TouchableOpacity
          style={styles.justViewedButton}
          onPress={scrollToHighlight}
          activeOpacity={0.85}
        >
          <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
          <Text style={styles.justViewedButtonText}>Just viewed</Text>
          <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: TILE_GAP, marginBottom: TILE_GAP },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: verticalScale(60) },
  emptyText: { color: colors.textSecondary, fontSize: fontScale(15) },
  footer: { paddingVertical: verticalScale(20), alignItems: 'center' },
  container: { flex: 1 },
  justViewedButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15,15,26,0.85)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  justViewedButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '600',
  },
});

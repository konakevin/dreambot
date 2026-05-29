import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFavoritePosts } from '@/hooks/useFavoritePosts';
import { usePublicProfilePosts } from '@/hooks/usePublicProfilePosts';
import { useMyDreams } from '@/hooks/useMyDreams';
import { useAuthStore } from '@/store/auth';
import { PostTile } from '@/components/PostTile';
import { useAlbumStore } from '@/store/album';
import { GridSkeleton } from '@/components/Skeleton';
import { colors } from '@/constants/theme';
import { vs } from '@/lib/responsive';
import { NUM_COLUMNS, TILE_GAP, ROW_HEIGHT } from '@/constants/grid';
import type { DreamPostItem } from '@/components/DreamCard';

export type PostGridSource =
  | { type: 'own' }
  | { type: 'saved' }
  | { type: 'dreams' }
  | { type: 'user'; userId: string };

interface PostGridProps {
  source: PostGridSource;
  isOwn?: boolean;
  emptyText?: string;
  ListHeaderComponent?: React.ReactElement;
  highlightPostId?: string;
  scrollToTopToken?: number;
  showPrivateBadge?: boolean;
}

export function PostGrid({
  source,
  isOwn = false,
  emptyText = 'No posts yet',
  ListHeaderComponent,
  highlightPostId,
  scrollToTopToken,
  showPrivateBadge = false,
}: PostGridProps) {
  const listRef = useRef<FlatList>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  // Mirror of headerHeight readable inside the onScroll callback without making
  // it a dependency (keeps the callback identity stable).
  const headerHeightRef = useRef(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // "Back to top" pill — surfaces once the user has scrolled past the album's
  // first row, a quick jump back when they're deep in a long album. Hidden at
  // the top (fresh navigation) and after a jump-to-top, since the scroll offset
  // drops below the threshold. Bottom-left so it never collides with the
  // bottom-right "Just viewed" pill.
  const [showBackToTop, setShowBackToTop] = useState(false);
  const handleScroll = useCallback((e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const y = e.nativeEvent.contentOffset.y;
    const shouldShow = y > headerHeightRef.current + ROW_HEIGHT;
    setShowBackToTop((prev) => (prev === shouldShow ? prev : shouldShow));
  }, []);
  const handleBackToTop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Hide immediately rather than waiting for the scroll animation to cross
    // the threshold.
    setShowBackToTop(false);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  useEffect(() => {
    if (scrollToTopToken && scrollToTopToken > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToTopToken]);

  const isOwn_ = source.type === 'own';
  const isSaved = source.type === 'saved';
  const isDreams = source.type === 'dreams';
  const isUser = source.type === 'user';
  const userId = isUser ? source.userId : '';

  const ownQuery = useUserPosts(isOwn_);
  const savedQuery = useFavoritePosts(isSaved);
  const userQuery = usePublicProfilePosts(userId, isUser);
  const dreamsQuery = useMyDreams();

  const activeQuery = isOwn_ ? ownQuery : isSaved ? savedQuery : isDreams ? dreamsQuery : userQuery;

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
    return ['publicProfilePosts', userId];
  }, [isOwn_, isSaved, isDreams, userId, authUserId]);
  const handleRefresh = useCallback(async () => {
    queryClient.setQueryData<InfiniteData<unknown>>(activeQueryKey, (old) =>
      old ? { pages: old.pages.slice(0, 1), pageParams: old.pageParams.slice(0, 1) } : old
    );
    await queryClient.invalidateQueries({ queryKey: activeQueryKey, refetchType: 'active' });
  }, [queryClient, activeQueryKey]);

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

  const [scrollOverlay, setScrollOverlay] = useState(false);

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
        toPrefetch.push(v.item.image_url);
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

      // Silent mode (auto-scroll on focus return): skip the dim overlay flash.
      // The grid is already visible — a 300ms black overlay is jarring vs the
      // badge-tap path where the user explicitly initiated the jump.
      if (!opts?.silent) setScrollOverlay(true);
      listRef.current.scrollToOffset({ offset: targetOffset, animated: false });

      setTimeout(() => {
        setScrollOverlay(false);
        setBadgeTapped(true);
      }, 300);
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
        contentContainerStyle={{ paddingBottom: vs(90) }}
        windowSize={7}
        maxToRenderPerBatch={6}
        initialNumToRender={12}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={activeQuery.isRefetching && !isFetchingNextPage}
            onRefresh={handleRefresh}
            tintColor="#fff"
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
        renderItem={({ item }) => (
          <PostTile
            item={item}
            isOwn={isOwn}
            albumSource={source}
            isHighlighted={!highlightDismissed && item.id === highlightPostId}
            showPrivateBadge={showPrivateBadge}
            allPosts={posts}
          />
        )}
      />
      {scrollOverlay && (
        <View style={styles.scrollOverlay} pointerEvents="none">
          <ActivityIndicator size="small" color={colors.textSecondary} />
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
      {showBackToTop && (
        <TouchableOpacity
          style={styles.backToTopButton}
          onPress={handleBackToTop}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-up" size={14} color="#FFFFFF" />
          <Text style={styles.backToTopButtonText}>Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: TILE_GAP, marginBottom: TILE_GAP },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: colors.textSecondary, fontSize: 15 },
  footer: { paddingVertical: 20, alignItems: 'center' },
  container: { flex: 1 },
  scrollOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
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
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  justViewedButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  backToTopButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15,15,26,0.85)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  backToTopButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

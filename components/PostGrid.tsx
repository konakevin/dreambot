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
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { feedImageUrl } from '@/lib/imageUrl';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFavoritePosts } from '@/hooks/useFavoritePosts';
import { usePublicProfilePosts } from '@/hooks/usePublicProfilePosts';
import { useMyDreams } from '@/hooks/useMyDreams';
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
  const [containerHeight, setContainerHeight] = useState(0);

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
  }, [hasNextPage, isFetchingNextPage, activeQuery.fetchNextPage]);

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
        toPrefetch.push(feedImageUrl(v.item.image_url));
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
  }, [
    pendingAutoAnchor,
    highlightIndex,
    activeQuery.hasNextPage,
    activeQuery.isFetchingNextPage,
    activeQuery.fetchNextPage,
  ]);

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
  }, [
    isFetchingHighlight,
    highlightIndex,
    activeQuery.hasNextPage,
    activeQuery.isFetchingNextPage,
  ]);

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
  }, [highlightIndex, activeQuery.hasNextPage, activeQuery.fetchNextPage, scrollToHighlightRow]);

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
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          // numColumns=N means item I lives in row floor(I/N) — items in the
          // same row share an offset. Old code used `index * ROW_HEIGHT`
          // which assigned each item a unique offset; FlatList tolerates the
          // mismatch in practice but it can drift on long-list scrollToIndex.
          offset: headerHeight + Math.floor(index / NUM_COLUMNS) * ROW_HEIGHT,
          index,
        })}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: vs(90) }}
        windowSize={5}
        maxToRenderPerBatch={6}
        initialNumToRender={8}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={activeQuery.isRefetching && !isFetchingNextPage}
            onRefresh={() => activeQuery.refetch()}
            tintColor="#fff"
          />
        }
        ListHeaderComponent={
          ListHeaderComponent ? (
            <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
              {ListHeaderComponent}
            </View>
          ) : undefined
        }
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
});

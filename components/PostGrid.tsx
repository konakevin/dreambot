import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFavoritePosts } from '@/hooks/useFavoritePosts';
import { usePublicProfilePosts } from '@/hooks/usePublicProfilePosts';
import { useMyDreams } from '@/hooks/useMyDreams';
import { PostTile } from '@/components/PostTile';
import { GridSkeleton } from '@/components/Skeleton';
import { colors } from '@/constants/theme';
import { vs } from '@/lib/responsive';
import type { DreamPostItem } from '@/components/DreamCard';

const TILE_GAP = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const TILE_SIZE = (SCREEN_WIDTH - TILE_GAP) / 2;
const ROW_HEIGHT = TILE_SIZE + TILE_GAP;

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

  const highlightIndex = useMemo(() => {
    if (!highlightPostId) return -1;
    return posts.findIndex((p) => p.id === highlightPostId);
  }, [posts, highlightPostId]);

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

  const [scrollOverlay, setScrollOverlay] = useState(false);

  const scrollToHighlightRow = useCallback(
    (idx: number, opts?: { silent?: boolean }) => {
      if (!listRef.current || idx < 0) return;
      const targetRow = Math.floor(idx / 2);
      const targetOffset = Math.max(0, headerHeight + targetRow * ROW_HEIGHT - ROW_HEIGHT * 0.3);

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
    [headerHeight]
  );

  useEffect(() => {
    if (isFetchingHighlight && highlightIndex >= 0) {
      setIsFetchingHighlight(false);
      requestAnimationFrame(() => {
        scrollToHighlightRow(highlightIndex);
      });
    }
  }, [isFetchingHighlight, highlightIndex, scrollToHighlightRow]);

  useFocusEffect(
    useCallback(() => {
      didAutoScrollForFocus.current = false;
      return undefined;
    }, [])
  );

  useEffect(() => {
    if (didAutoScrollForFocus.current) return;
    if (!highlightPostId || highlightIndex < 0) return;
    if (containerHeight === 0) return; // wait for layout
    didAutoScrollForFocus.current = true;
    setHighlightDismissed(false);
    requestAnimationFrame(() => scrollToHighlightRow(highlightIndex, { silent: true }));
  }, [highlightPostId, highlightIndex, containerHeight, scrollToHighlightRow]);

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
  const maxVisibleIndex = visibleRows > 0 ? visibleRows * 2 - 1 : -1;

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
        numColumns={2}
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: headerHeight + index * ROW_HEIGHT,
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

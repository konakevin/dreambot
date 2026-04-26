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
const VISIBLE_THRESHOLD = 8;
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
  const headerHeight = useRef(0);

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
  const [hasScrolledToHighlight, setHasScrolledToHighlight] = useState(false);
  const [highlightDismissed, setHighlightDismissed] = useState(false);

  useEffect(() => {
    if (!highlightPostId) return;
    return navigation.addListener('blur', () => {
      setHighlightDismissed(true);
    });
  }, [navigation, highlightPostId]);
  const showJustViewedButton =
    !highlightDismissed && highlightIndex >= VISIBLE_THRESHOLD && !hasScrolledToHighlight;

  const scrollToHighlight = useCallback(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const row = Math.floor(highlightIndex / 2);
      const offset = headerHeight.current + row * ROW_HEIGHT;
      listRef.current.scrollToOffset({ offset, animated: true });
      setHasScrolledToHighlight(true);
    }
  }, [highlightIndex]);

  return (
    <View style={styles.container}>
      <FlatList<DreamPostItem>
        ref={listRef}
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
            <View
              onLayout={(e) => {
                headerHeight.current = e.nativeEvent.layout.height;
              }}
            >
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

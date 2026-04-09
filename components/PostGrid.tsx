import { useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
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

  // Paginated hooks return { pages: { rows }[] }, useMyDreams returns flat array
  const paginatedQuery = isOwn_ ? ownQuery : isSaved ? savedQuery : userQuery;

  const posts: DreamPostItem[] = useMemo(() => {
    if (isDreams) return dreamsQuery.data ?? [];
    return paginatedQuery.data?.pages.flatMap((p) => p.rows) ?? [];
  }, [isDreams, dreamsQuery.data, paginatedQuery.data]);

  const isLoading = isDreams ? dreamsQuery.isLoading : paginatedQuery.isLoading;
  const hasNextPage = isDreams ? false : paginatedQuery.hasNextPage;
  const isFetchingNextPage = isDreams ? false : paginatedQuery.isFetchingNextPage;

  const albumIds = useMemo(() => posts.map((p) => p.id), [posts]);

  const handleEndReached = useCallback(() => {
    if (!isDreams && hasNextPage && !isFetchingNextPage) {
      paginatedQuery.fetchNextPage();
    }
  }, [isDreams, hasNextPage, isFetchingNextPage, paginatedQuery.fetchNextPage]);

  return (
    <FlatList<DreamPostItem>
      ref={listRef}
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingBottom: vs(90) }}
      windowSize={10}
      maxToRenderPerBatch={8}
      initialNumToRender={6}
      removeClippedSubviews
      ListHeaderComponent={ListHeaderComponent}
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
          albumIds={albumIds}
          isHighlighted={item.id === highlightPostId}
          showPrivateBadge={showPrivateBadge}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: { gap: TILE_GAP, marginBottom: TILE_GAP },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: colors.textSecondary, fontSize: 15 },
  footer: { paddingVertical: 20, alignItems: 'center' },
});

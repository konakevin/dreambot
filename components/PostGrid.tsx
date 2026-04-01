import { useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFavoritePosts } from '@/hooks/useFavoritePosts';
import { usePublicProfilePosts } from '@/hooks/usePublicProfilePosts';
import { PostTile } from '@/components/PostTile';
import { colors } from '@/constants/theme';
import type { PostItem } from '@/hooks/useUserPosts';

const TILE_GAP = 2;

export type PostGridSource =
  | { type: 'own' }
  | { type: 'saved' }
  | { type: 'user'; userId: string };

interface PostGridProps {
  source: PostGridSource;
  isOwn?: boolean;
  emptyText?: string;
  ListHeaderComponent?: React.ReactElement;
  highlightPostId?: string;
  scrollToTopToken?: number;
}

export function PostGrid({ source, isOwn = false, emptyText = 'No posts yet', ListHeaderComponent, highlightPostId, scrollToTopToken }: PostGridProps) {
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (scrollToTopToken && scrollToTopToken > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToTopToken]);
  // All three hooks are always called — rules of hooks. Only the active one is enabled.
  const isOwn_ = source.type === 'own';
  const isSaved = source.type === 'saved';
  const isUser = source.type === 'user';
  const userId = isUser ? source.userId : '';

  const ownQuery    = useUserPosts(isOwn_);
  const savedQuery  = useFavoritePosts(isSaved);
  const userQuery   = usePublicProfilePosts(userId, isUser);

  const query = isOwn_ ? ownQuery : isSaved ? savedQuery : userQuery;

  const posts = useMemo(
    () => query.data?.pages.flatMap((p) => p.rows) ?? [],
    [query.data],
  );

  // Album IDs for detail-view swipe navigation — grows as more pages load
  const albumIds = useMemo(() => posts.map((p) => p.id), [posts]);

  const handleEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return (
    <FlatList<PostItem>
      ref={listRef}
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingBottom: 90 }}
      ListHeaderComponent={ListHeaderComponent}
      // Begin fetching the next page when the user is halfway through remaining content
      onEndReachedThreshold={0.5}
      onEndReached={handleEndReached}
      ListEmptyComponent={
        query.isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.textSecondary} />
          </View>
        ) : (
          <View style={styles.center}>
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        )
      }
      ListFooterComponent={
        query.isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.textSecondary} />
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <PostTile item={item} isOwn={isOwn} albumIds={albumIds} isHighlighted={item.id === highlightPostId} />
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

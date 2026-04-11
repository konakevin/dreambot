/**
 * FullScreenFeed — shared vertical paging feed component.
 * Used by Home, Explore, and profile album views.
 *
 * Handles: vertical paging, image prefetching, scroll tracking,
 * end-reached loading. Cards are rendered via DreamCard.
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, StyleSheet, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import { useQueryClient } from '@tanstack/react-query';
import { DreamCard } from '@/components/DreamCard';
import { FeedCardSkeleton } from '@/components/Skeleton';
import { feedImageUrl } from '@/lib/imageUrl';
import type { DreamPostItem } from '@/components/DreamCard';
import { CommentOverlay } from '@/components/CommentOverlay';
import { useFavoriteIds } from '@/hooks/useFavoriteIds';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { useLikeIds } from '@/hooks/useLikeIds';
import { useToggleLike } from '@/hooks/useToggleLike';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/Toast';
import { LikesSheet } from '@/components/LikesSheet';
import { colors } from '@/constants/theme';

const FALLBACK_HEIGHT = Dimensions.get('window').height;

interface Props {
  posts: DreamPostItem[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  /** Index to scroll to on mount (for album deep links) */
  initialIndex?: number;
  /** Called when the visible card changes */
  onIndexChange?: (index: number) => void;
  /** Ref to control the FlatList externally */
  listRef?: React.RefObject<FlatList>;
  /** Content rendered above the feed (absolute positioned overlays go in parent) */
  ListEmptyComponent?: React.ReactElement;
  /** Disable swipe-left-to-profile on cards (for album/detail views) */
  disableSwipeToProfile?: boolean;
  /** Hide tab bar padding (for detail views without a tab bar) */
  hideTabBar?: boolean;
  /** Show the eye/visibility toggle on own posts */
  showVisibilityToggle?: boolean;
  /** Callback when the visibility toggle is pressed */
  onTogglePosted?: (postId: string) => void;
  /** Called when the card HUD is toggled (single tap) */
  onHudToggle?: (visible: boolean) => void;
}

export function FullScreenFeed({
  posts,
  isLoading,
  isRefreshing,
  onRefresh: onRefreshProp,
  onEndReached,
  initialIndex = 0,
  onIndexChange,
  listRef,
  ListEmptyComponent,
  disableSwipeToProfile,
  hideTabBar,
  showVisibilityToggle,
  onTogglePosted,
  onHudToggle,
}: Props) {
  const insets = useSafeAreaInsets();
  const internalRef = useRef<FlatList>(null);
  const ref = listRef ?? internalRef;
  const currentIndex = useRef(0);
  const impressionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedImpressions = useRef<Set<string>>(new Set());
  const isFocused = useIsFocused();

  // Measure the actual container height — this is the true page size
  const [containerHeight, setContainerHeight] = useState(FALLBACK_HEIGHT);
  const pageHeight = containerHeight > 0 ? containerHeight : FALLBACK_HEIGHT;

  const handleLayout = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0 && Math.abs(h - containerHeight) > 1) {
        setContainerHeight(h);
      }
    },
    [containerHeight]
  );

  // Re-snap scroll position when posts change (delete, refetch) or screen regains focus
  useEffect(() => {
    if (isFocused && posts.length > 0) {
      ref.current?.scrollToOffset({
        offset: currentIndex.current * pageHeight,
        animated: false,
      });
    }
  }, [isFocused, posts.length, pageHeight]);

  // Clean up impression timer on unmount
  useEffect(() => {
    return () => {
      if (impressionTimer.current) clearTimeout(impressionTimer.current);
    };
  }, []);

  const handleRefresh = useCallback(() => {
    onRefreshProp?.();
    // Scroll to top after refresh so user sees fresh content
    setTimeout(() => ref.current?.scrollToOffset({ offset: 0, animated: true }), 300);
  }, [onRefreshProp, ref]);

  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const queryClient = useQueryClient();
  const { data: favoriteIds = new Set<string>() } = useFavoriteIds();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { data: likeIds = new Set<string>() } = useLikeIds();
  const { mutate: toggleLike } = useToggleLike();
  const [likesPostId, setLikesPostId] = useState<string | null>(null);
  const [commentPost, setCommentPost] = useState<DreamPostItem | null>(null);

  const handleDelete = useCallback(
    async (uploadId: string) => {
      const idx = currentIndex.current;
      const totalBefore = posts.length;

      // Fetch image URL so we can clean up storage
      const { data: row } = await supabase
        .from('uploads')
        .select('image_url')
        .eq('id', uploadId)
        .single();

      const { error } = isAdmin
        ? await supabase.rpc('admin_delete_upload' as never, { p_upload_id: uploadId } as never)
        : await supabase.from('uploads').delete().eq('id', uploadId);
      if (error) {
        Toast.show('Failed to delete', 'close-circle');
        return;
      }

      // Clean up the image from Supabase Storage
      if (row?.image_url) {
        const match = row.image_url.match(/\/uploads\/(.+)$/);
        if (match?.[1]) {
          supabase.storage.from('uploads').remove([decodeURIComponent(match[1])]);
        }
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Dream deleted', 'checkmark-circle');

      // Invalidate all caches so grids and feeds refresh
      queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfilePosts'] });
      queryClient.invalidateQueries({ queryKey: ['favoritePosts'] });
      queryClient.invalidateQueries({ queryKey: ['albumPosts'] });

      // If this was the only post, go back
      if (totalBefore <= 1) {
        if (router.canGoBack()) router.back();
      } else {
        // Adjust index so the re-snap effect (below) lands on the right page
        const newIdx = idx >= totalBefore - 1 ? Math.max(0, idx - 1) : idx;
        currentIndex.current = newIdx;
      }
    },
    [queryClient, posts, ref]
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const idx = viewableItems[0].index;
        currentIndex.current = idx;
        onIndexChange?.(idx);
        // Reset HUD to visible when scrolling to a new card
        onHudToggle?.(true);
        // Prefetch next 3 images
        const upcoming = posts.slice(idx + 1, idx + 4);
        if (upcoming.length > 0) {
          ExpoImage.prefetch(upcoming.map((p) => feedImageUrl(p.image_url)));
        }
        // Record impression after 1 second of visibility
        if (impressionTimer.current) clearTimeout(impressionTimer.current);
        const post = posts[idx];
        if (post && user && !recordedImpressions.current.has(post.id)) {
          impressionTimer.current = setTimeout(() => {
            recordedImpressions.current.add(post.id);
            supabase
              .rpc('record_impression', {
                p_user_id: user.id,
                p_upload_id: post.id,
              })
              .then(({ error }) => {
                if (error && __DEV__) {
                  console.error('[FullScreenFeed] record_impression failed:', error.message);
                }
              });
          }, 1000);
        }
      }
    },
    [posts, onIndexChange, user]
  );

  if (isLoading) {
    return <FeedCardSkeleton />;
  }

  if (posts.length === 0 && ListEmptyComponent) {
    return ListEmptyComponent;
  }

  return (
    <>
      <FlatList
        ref={ref}
        data={posts}
        keyExtractor={(item) => item.id}
        onLayout={handleLayout}
        pagingEnabled
        disableIntervalMomentum
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        windowSize={7}
        maxToRenderPerBatch={5}
        initialNumToRender={3}
        removeClippedSubviews={true}
        initialScrollIndex={initialIndex > 0 ? initialIndex : undefined}
        getItemLayout={(_, index) => ({
          length: pageHeight,
          offset: pageHeight * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        refreshControl={
          onRefreshProp ? (
            <RefreshControl
              refreshing={!!isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <DreamCard
            item={item}
            bottomPadding={hideTabBar ? 16 + insets.bottom : 60 + insets.bottom}
            cardHeight={pageHeight}
            isLiked={likeIds.has(item.id)}
            onLike={() => toggleLike({ uploadId: item.id, currentlyLiked: false })}
            onToggleLike={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleLike({ uploadId: item.id, currentlyLiked: likeIds.has(item.id) });
            }}
            onComment={() => setCommentPost(item)}
            isSaved={favoriteIds.has(item.id)}
            onToggleSave={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFavorite({ uploadId: item.id, currentlyFavorited: favoriteIds.has(item.id) });
            }}
            disableSwipeToProfile={disableSwipeToProfile}
            onDelete={
              item.user_id === user?.id || isAdmin ? () => handleDelete(item.id) : undefined
            }
            onFamily={() => {
              const params = new URLSearchParams({
                postId: item.id,
                imageUrl: item.image_url,
                username: item.username,
                userId: item.user_id,
                ...(item.ai_prompt ? { prompt: item.ai_prompt } : {}),
              });
              nav.push(`/dreamLikeThis?${params.toString()}`);
            }}
            onLikesPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setLikesPostId(item.id);
            }}
            showVisibilityToggle={showVisibilityToggle && item.user_id === user?.id}
            onTogglePosted={onTogglePosted ? () => onTogglePosted(item.id) : undefined}
            onHudToggle={onHudToggle}
          />
        )}
      />
      {commentPost && (
        <CommentOverlay
          post={commentPost}
          onClose={() => setCommentPost(null)}
          hideTabBar={hideTabBar}
        />
      )}
      <LikesSheet
        uploadId={likesPostId}
        visible={!!likesPostId}
        onClose={() => setLikesPostId(null)}
      />
    </>
  );
}

const s = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

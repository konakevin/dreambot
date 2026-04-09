/**
 * FullScreenFeed — shared vertical paging feed component.
 * Used by Home, Explore, and profile album views.
 *
 * Handles: vertical paging, image prefetching, scroll tracking,
 * end-reached loading. Cards are rendered via DreamCard.
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
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
// fusionStore no longer used for Dream Like This — uses stack screen with route params
import { DreamFamilySheet } from '@/components/DreamFamilySheet';
import { LikesSheet } from '@/components/LikesSheet';
import { colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

  // Re-snap scroll position when the screen regains focus (prevents half-scroll offset)
  useEffect(() => {
    if (isFocused && posts.length > 0) {
      ref.current?.scrollToOffset({
        offset: currentIndex.current * SCREEN_HEIGHT,
        animated: false,
      });
    }
  }, [isFocused]);

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
  const queryClient = useQueryClient();
  const { data: favoriteIds = new Set<string>() } = useFavoriteIds();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { data: likeIds = new Set<string>() } = useLikeIds();
  const { mutate: toggleLike } = useToggleLike();
  const [familyPostId, setFamilyPostId] = useState<string | null>(null);
  const [familyPost, setFamilyPost] = useState<DreamPostItem | null>(null);
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

      const { error } = await supabase.from('uploads').delete().eq('id', uploadId);
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

      // If this was the only post, go back (empty state will show in grid)
      if (totalBefore <= 1) {
        if (router.canGoBack()) router.back();
      } else {
        // At end → scroll up to previous; otherwise stay put (next card fills in)
        const targetIdx = idx >= totalBefore - 1 ? idx - 1 : idx;
        currentIndex.current = targetIdx;
        ref.current?.scrollToOffset({
          offset: targetIdx * SCREEN_HEIGHT,
          animated: false,
        });
      }

      // Optimistically remove from all feed caches so the card disappears immediately
      const feedKeys = ['dreamFeed', 'explore', 'userPosts', 'my-dreams', 'albumPosts'];
      for (const key of feedKeys) {
        queryClient.setQueriesData({ queryKey: [key] }, (old: unknown) => {
          if (Array.isArray(old)) return old.filter((p: { id: string }) => p.id !== uploadId);
          return old;
        });
      }
      queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
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
            supabase.rpc('record_impression', {
              p_user_id: user.id,
              p_upload_id: post.id,
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
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
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
            onDelete={item.user_id === user?.id ? () => handleDelete(item.id) : undefined}
            onFamily={() => {
              if ((item.fuse_count ?? 0) === 0) {
                const params = new URLSearchParams({
                  postId: item.id,
                  imageUrl: item.image_url,
                  username: item.username,
                  userId: item.user_id,
                  ...(item.ai_prompt ? { prompt: item.ai_prompt } : {}),
                });
                nav.push(`/dreamLikeThis?${params.toString()}`);
              } else {
                setFamilyPostId(item.id);
                setFamilyPost(item);
              }
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
      {familyPost && (
        <DreamFamilySheet
          visible={!!familyPostId}
          onClose={() => {
            if (__DEV__) console.log('[Feed] DreamFamilySheet onClose');
            setFamilyPostId(null);
            setFamilyPost(null);
          }}
          post={familyPost}
          uploadId={familyPost.id}
          isAiGenerated={true}
          hideTabBar={hideTabBar}
          onDreamLikeThis={() => {
            if (__DEV__)
              console.log('[Feed] Dream Like This → push stack screen, postId:', familyPost.id);
            const params = new URLSearchParams({
              postId: familyPost.id,
              imageUrl: familyPost.image_url,
              username: familyPost.username,
              userId: familyPost.user_id,
              ...(familyPost.ai_prompt ? { prompt: familyPost.ai_prompt } : {}),
            });
            nav.push(`/dreamLikeThis?${params.toString()}`);
          }}
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

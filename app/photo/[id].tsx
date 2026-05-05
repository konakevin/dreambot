import { useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { useAlbumStore } from '@/store/album';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useAlbumPosts } from '@/hooks/useAlbumPosts';
import { useUserContextFeed } from '@/hooks/useUserContextFeed';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import type { DreamPostItem } from '@/components/DreamCard';
import { Toast } from '@/components/Toast';
import * as Haptics from 'expo-haptics';

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const albumIds = useAlbumStore((s) => s.ids);
  const queryClient = useQueryClient();

  // Two modes:
  //  - Album mode (albumIds populated): bounded list, single useQuery
  //  - Context mode (no album, e.g. tapped from profile/notification/deep-link):
  //    paginated useInfiniteQuery so the user can keep scrolling past 40 posts
  //    without hitting black screen below.
  const isAlbum = albumIds.length > 0;
  const albumQuery = useAlbumPosts(albumIds, id);
  const contextQuery = useUserContextFeed(id, !isAlbum);

  // Flat-merge context-feed pages with defensive dedup (in case the poster
  // creates a new post during the user's scroll session — that would shift
  // offset-pagination and could double-include a boundary row).
  const contextPosts = useMemo(() => {
    const rows = contextQuery.data?.pages.flatMap((p) => p.rows) ?? [];
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [contextQuery.data]);

  const posts: DreamPostItem[] = isAlbum ? (albumQuery.data ?? []) : contextPosts;
  const isLoading = isAlbum ? albumQuery.isLoading : contextQuery.isLoading;
  const refetch = isAlbum ? albumQuery.refetch : contextQuery.refetch;
  const handleEndReached = useCallback(() => {
    if (!isAlbum && contextQuery.hasNextPage && !contextQuery.isFetchingNextPage) {
      contextQuery.fetchNextPage();
    }
  }, [
    isAlbum,
    contextQuery.hasNextPage,
    contextQuery.isFetchingNextPage,
    contextQuery.fetchNextPage,
  ]);

  const overlayOpacity = useSharedValue(1);
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value < 0.5 ? 'none' : 'auto',
  }));
  const handleHudToggle = useCallback(
    (visible: boolean) => {
      overlayOpacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
    },
    [overlayOpacity]
  );

  // Track the visible post in the album store so PostGrid can re-anchor on
  // back-navigation. Without this, scrolling through 50 posts in detail view
  // and swiping back leaves the grid at the originally-tapped tile.
  const setCurrentPostId = useAlbumStore((s) => s.setCurrentPostId);
  const handleIndexChange = useCallback(
    (idx: number) => {
      const post = posts[idx];
      if (post) setCurrentPostId(post.id);
    },
    [posts, setCurrentPostId]
  );

  const initialIndex = useMemo(() => {
    const idx = posts.findIndex((p) => p.id === id);
    return idx >= 0 ? idx : 0;
  }, [posts, id]);

  const handleTogglePosted = useCallback(
    async (postId: string) => {
      if (!user) return;
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      // Never posted → route to New Post screen
      if (!post.posted_at) {
        router.push(
          `/dream/newPost?uploadId=${postId}&imageUrl=${encodeURIComponent(post.image_url)}`
        );
        return;
      }

      // Previously posted → toggle public/private
      const newPublic = !post.is_public;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Optimistic update — write to whichever cache key is active
      // (album mode → albumPosts, context mode → userContextFeed).
      const applyToCaches = (publicValue: boolean) => {
        // Album mode cache shape: DreamPostItem[]
        queryClient.setQueryData(
          ['albumPosts', albumIds.join(','), id],
          (old: DreamPostItem[] | undefined) =>
            old?.map((p) => (p.id === postId ? { ...p, is_public: publicValue } : p))
        );
        // Context mode cache shape: { pages: [{ rows, userId, nextOffset }, ...] }
        queryClient.setQueryData(
          ['userContextFeed', id],
          (
            old:
              | {
                  pages: { rows: DreamPostItem[]; userId: string; nextOffset: number }[];
                  pageParams: unknown[];
                }
              | undefined
          ) =>
            old
              ? {
                  ...old,
                  pages: old.pages.map((page) => ({
                    ...page,
                    rows: page.rows.map((p) =>
                      p.id === postId ? { ...p, is_public: publicValue } : p
                    ),
                  })),
                }
              : old
        );
      };
      applyToCaches(newPublic);

      const { error } = await supabase
        .from('uploads')
        .update({ is_public: newPublic })
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        applyToCaches(!newPublic);
        Toast.show('Failed to update', 'close-circle');
      } else {
        Toast.show(
          newPublic ? 'Shared publicly' : 'Moved to private',
          newPublic ? 'checkmark-circle' : 'lock-closed'
        );
        queryClient.invalidateQueries({ queryKey: ['userPosts'] });
        queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
        queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
      }
    },
    [user, posts, queryClient, albumIds, id, router]
  );

  // Swipe-right-to-back handled by React Navigation's native gesture
  // (fullScreenGestureEnabled: true in SCREEN_PRESETS.MODAL_SWIPEABLE).
  // No custom GestureDetector needed — native gesture coordinates with
  // FlatList scroll automatically.
  return (
    <View style={s.root}>
      <StatusBar hidden />
      <Animated.View style={[s.backButton, overlayStyle]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <View style={s.backCircle}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <FullScreenFeed
        posts={posts}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        initialIndex={initialIndex}
        onIndexChange={handleIndexChange}
        disableSwipeToProfile
        hideTabBar
        showVisibilityToggle
        onTogglePosted={handleTogglePosted}
        onHudToggle={handleHudToggle}
        onEndReached={handleEndReached}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  backButton: { position: 'absolute', top: 54, left: 16, zIndex: 10 },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

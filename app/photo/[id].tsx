import { useMemo, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
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
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFavoritePosts } from '@/hooks/useFavoritePosts';
import { useMyDreams } from '@/hooks/useMyDreams';
import { usePublicProfilePosts } from '@/hooks/usePublicProfilePosts';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import { trackPostViewed } from '@/lib/analytics';
import { saveReadyHdDownload } from '@/lib/imageLongPress';
import type { DreamPostItem } from '@/components/DreamCard';
import { Toast } from '@/components/Toast';
import * as Haptics from 'expo-haptics';

export default function PhotoDetailScreen() {
  const { id, downloadReady } = useLocalSearchParams<{ id: string; downloadReady?: string }>();
  const user = useAuthStore((s) => s.user);
  const isPro = useAuthStore((s) => s.isPro);
  const albumIds = useAlbumStore((s) => s.ids);
  const queryClient = useQueryClient();

  // Track the context a dream was opened from (own / dreams / saved / user /
  // feed) → how often people view their own posts/dreams vs others'.
  useEffect(() => {
    const src = useAlbumStore.getState().albumSource?.type ?? 'feed';
    trackPostViewed({ source: src, is_own: src === 'own' || src === 'dreams' });
  }, []);

  // Arrived from a "download_ready" notification tap → the HD is cached now;
  // save it straight to Photos (the modal flashes 'Preparing' → 'Saved in HD').
  // Guard with a ref so a re-render / param re-read can't double-fire it.
  const didAutoSaveHd = useRef(false);
  useEffect(() => {
    if (downloadReady === '1' && isPro && id && !didAutoSaveHd.current) {
      didAutoSaveHd.current = true;
      saveReadyHdDownload(id);
    }
  }, [downloadReady, isPro, id]);

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

  // Source-mode: re-subscribe to the SAME TanStack query the grid uses
  // (queryKeys are dedup-shared, so this is the same cache instance — no
  // refetch). PhotoDetailScreen can then call fetchNextPage as the user
  // scrolls past the grid's currently-loaded pages. The albumSource was
  // stashed in the store by PostTile on tap.
  const albumSource = useAlbumStore((s) => s.albumSource);
  const storeModeRef = useRef<boolean | null>(null);
  if (storeModeRef.current === null) {
    storeModeRef.current = useAlbumStore.getState().posts.length > 0;
  }

  // Call all four hooks (TanStack dedupes by queryKey; only the matching
  // one is enabled by source). Always-call is required for hook stability.
  const ownPosts = useUserPosts(albumSource?.type === 'own');
  const savedPosts = useFavoritePosts(albumSource?.type === 'saved');
  const dreamsPosts = useMyDreams();
  const userPosts = usePublicProfilePosts(
    albumSource?.type === 'user' ? albumSource.userId : '',
    albumSource?.type === 'user'
  );
  const sourceQuery =
    albumSource?.type === 'own'
      ? ownPosts
      : albumSource?.type === 'saved'
        ? savedPosts
        : albumSource?.type === 'dreams'
          ? dreamsPosts
          : albumSource?.type === 'user'
            ? userPosts
            : null;
  const sourcePosts: DreamPostItem[] = useMemo(
    () => sourceQuery?.data?.pages.flatMap((p) => p.rows) ?? [],
    [sourceQuery?.data]
  );

  // Initial render: snapshot from store (instant — what the grid already had).
  // After mount: switch to live source-query data so fetchNextPage growth shows.
  const storePosts = useAlbumStore((s) => s.posts);
  const queryPosts: DreamPostItem[] = isAlbum ? (albumQuery.data ?? []) : contextPosts;
  const posts: DreamPostItem[] = storeModeRef.current
    ? sourcePosts.length > storePosts.length
      ? sourcePosts
      : storePosts
    : queryPosts;
  const isLoading = posts.length === 0 && (isAlbum ? albumQuery.isLoading : contextQuery.isLoading);
  const refetch = isAlbum ? albumQuery.refetch : contextQuery.refetch;

  // Context mode (deep link / notification tap) can error if the target
  // upload isn't readable by the current user — RLS-filtered private posts,
  // deleted posts, blocked authors. Postgrest returns PGRST116 ("Cannot
  // coerce the result to a single JSON object") in all three cases.
  // Without this guard the screen renders an empty FullScreenFeed (black).
  const targetUnavailable = !isAlbum && !!contextQuery.error && posts.length === 0;
  const handleEndReached = useCallback(() => {
    // Source mode: paginate the grid's underlying query.
    if (storeModeRef.current && sourceQuery?.hasNextPage && !sourceQuery.isFetchingNextPage) {
      sourceQuery.fetchNextPage();
      return;
    }
    if (!isAlbum && contextQuery.hasNextPage && !contextQuery.isFetchingNextPage) {
      contextQuery.fetchNextPage();
    }
  }, [isAlbum, sourceQuery, contextQuery]);

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

  const photoListRef = useRef<FlatList | null>(null);

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

      // Optimistic update — write to whichever data source is active:
      //  - store mode (grid tap) → mutate album store
      //  - album mode (legacy ids) → setQueryData on ['albumPosts', ...]
      //  - context mode (deep link) → setQueryData on ['userContextFeed', id]
      const applyToCaches = (publicValue: boolean) => {
        if (storeModeRef.current) {
          const current = useAlbumStore.getState().posts;
          useAlbumStore
            .getState()
            .setAlbumPosts(
              current.map((p) => (p.id === postId ? { ...p, is_public: publicValue } : p))
            );
        }
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
    [user, posts, queryClient, albumIds, id]
  );

  // Swipe-right-to-back handled by React Navigation's native gesture
  // (fullScreenGestureEnabled: true in SCREEN_PRESETS.MODAL_SWIPEABLE).
  // No custom GestureDetector needed — native gesture coordinates with
  // FlatList scroll automatically.
  if (targetUnavailable) {
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
        <View style={s.unavailable}>
          <Ionicons name="lock-closed" size={40} color="#9CA3AF" />
          <Text style={s.unavailableTitle}>Post unavailable</Text>
          <Text style={s.unavailableBody}>This dream is private or no longer available.</Text>
          <TouchableOpacity style={s.unavailableBtn} onPress={() => router.back()}>
            <Text style={s.unavailableBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        listRef={photoListRef as React.RefObject<FlatList>}
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
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  unavailableTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  unavailableBody: {
    color: '#9CA3AF',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  unavailableBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  unavailableBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});

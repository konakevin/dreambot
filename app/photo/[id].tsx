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
import { FullScreenFeed } from '@/components/FullScreenFeed';
import type { DreamPostItem } from '@/components/DreamCard';
import { Toast } from '@/components/Toast';
import * as Haptics from 'expo-haptics';

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const albumIds = useAlbumStore((s) => s.ids);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading, refetch, isRefetching } = useAlbumPosts(albumIds, id);

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

      // Optimistic update
      queryClient.setQueryData(
        ['albumPosts', albumIds.join(','), id],
        (old: DreamPostItem[] | undefined) =>
          old?.map((p) => (p.id === postId ? { ...p, is_public: newPublic } : p))
      );

      const { error } = await supabase
        .from('uploads')
        .update({ is_public: newPublic })
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        queryClient.setQueryData(
          ['albumPosts', albumIds.join(','), id],
          (old: DreamPostItem[] | undefined) =>
            old?.map((p) => (p.id === postId ? { ...p, is_public: !newPublic } : p))
        );
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
        isRefreshing={isRefetching}
        onRefresh={() => refetch()}
        initialIndex={initialIndex}
        disableSwipeToProfile
        hideTabBar
        showVisibilityToggle
        onTogglePosted={handleTogglePosted}
        onHudToggle={handleHudToggle}
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

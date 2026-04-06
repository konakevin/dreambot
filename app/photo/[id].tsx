import { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { useAlbumStore } from '@/store/album';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { FullScreenFeed } from '@/components/FullScreenFeed';
import type { DreamPostItem } from '@/components/DreamCard';
import { Toast } from '@/components/Toast';
import * as Haptics from 'expo-haptics';

/** Fetch a single post + user info */
function useAlbumPosts(albumIds: string[], currentId: string) {
  return useQuery({
    queryKey: ['albumPosts', albumIds.join(','), currentId],
    queryFn: async (): Promise<DreamPostItem[]> => {
      if (albumIds.length === 0) {
        // Single post — no album
        const { data, error } = await supabase
          .from('uploads')
          .select(
            'id, user_id, image_url, caption, created_at, comment_count, like_count, from_wish, recipe_id, ai_prompt, twin_count, fuse_count, twin_of, fuse_of, users!inner(username, avatar_url)'
          )
          .eq('id', currentId)
          .single();
        if (error) throw error;
        const u = data.users as Record<string, unknown>;
        return [
          {
            id: data.id,
            user_id: data.user_id,
            image_url: data.image_url,
            caption: data.caption,
            username: u.username as string,
            avatar_url: u.avatar_url as string | null,
            created_at: data.created_at,
            comment_count: data.comment_count ?? 0,
            like_count: data.like_count ?? 0,
            from_wish: data.from_wish ?? null,
            recipe_id: data.recipe_id ?? null,
            ai_prompt: data.ai_prompt ?? null,
            twin_count: data.twin_count ?? 0,
            fuse_count: data.fuse_count ?? 0,
            twin_of: data.twin_of ?? null,
            fuse_of: data.fuse_of ?? null,
          },
        ];
      }

      // Album — fetch all posts in order
      const { data, error } = await supabase
        .from('uploads')
        .select(
          'id, user_id, image_url, caption, created_at, comment_count, like_count, from_wish, recipe_id, ai_prompt, twin_count, fuse_count, twin_of, fuse_of, users!inner(username, avatar_url)'
        )
        .in('id', albumIds);
      if (error) throw error;

      // Sort by album order
      const orderMap = new Map(albumIds.map((id, i) => [id, i]));
      return (data ?? [])
        .map((row: Record<string, unknown>) => {
          const u = row.users as Record<string, unknown>;
          return {
            id: row.id as string,
            user_id: row.user_id as string,
            image_url: row.image_url as string,
            caption: row.caption as string | null,
            username: u.username as string,
            avatar_url: u.avatar_url as string | null,
            created_at: row.created_at as string,
            comment_count: (row.comment_count as number) ?? 0,
            like_count: (row.like_count as number) ?? 0,
            from_wish: (row.from_wish as string | null) ?? null,
            recipe_id: (row.recipe_id as string | null) ?? null,
            ai_prompt: (row.ai_prompt as string | null) ?? null,
            twin_count: (row.twin_count as number) ?? 0,
            fuse_count: (row.fuse_count as number) ?? 0,
            twin_of: (row.twin_of as string | null) ?? null,
            fuse_of: (row.fuse_of as string | null) ?? null,
            dream_medium: (row.dream_medium as string | null) ?? null,
            dream_vibe: (row.dream_vibe as string | null) ?? null,
          };
        })
        .sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
    },
    enabled: true,
    staleTime: 60_000,
  });
}

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const albumIds = useAlbumStore((s) => s.ids);
  const { translateX, panHandlers } = useSwipeBack();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useAlbumPosts(albumIds, id);

  // Track posted state for the current post
  const [postedMap, setPostedMap] = useState<Record<string, boolean>>({});
  const [visibleIndex, setVisibleIndex] = useState(0);

  // Check initial posted state for visible post
  const currentPost = posts[visibleIndex];
  const isOwn = currentPost?.user_id === user?.id;

  // Fetch is_posted for the current post (only for own posts)
  const { data: postStatus } = useQuery({
    queryKey: ['postStatus', currentPost?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('uploads')
        .select('is_posted, is_active')
        .eq('id', currentPost!.id)
        .single();
      return data as { is_posted: boolean; is_active: boolean } | null;
    },
    enabled: !!currentPost && isOwn,
    staleTime: 0,
  });

  const isPosted = postedMap[currentPost?.id] ?? postStatus?.is_posted ?? false;

  const togglePosted = useCallback(async () => {
    if (!currentPost || !user) return;
    const newPosted = !isPosted;

    // Optimistic update
    setPostedMap((prev) => ({ ...prev, [currentPost.id]: newPosted }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { error } = await supabase
      .from('uploads')
      .update({
        is_posted: newPosted,
        is_active: newPosted,
        visibility: newPosted ? 'public' : 'private',
      })
      .eq('id', currentPost.id)
      .eq('user_id', user.id);

    if (error) {
      // Revert
      setPostedMap((prev) => ({ ...prev, [currentPost.id]: !newPosted }));
      Toast.show('Failed to update', 'close-circle');
    } else {
      Toast.show(
        newPosted ? 'Posted to profile' : 'Moved to private',
        newPosted ? 'checkmark-circle' : 'lock-closed'
      );
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['postStatus', currentPost.id] });
    }
  }, [currentPost, user, isPosted, queryClient]);

  const initialIndex = useMemo(() => {
    const idx = posts.findIndex((p) => p.id === id);
    return idx >= 0 ? idx : 0;
  }, [posts, id]);

  return (
    <Animated.View {...panHandlers} style={[s.root, { transform: [{ translateX }] }]}>
      <StatusBar hidden />
      <TouchableOpacity style={s.backButton} onPress={() => router.back()} hitSlop={12}>
        <View style={s.backCircle}>
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* Post/Unpost toggle — only for own posts */}
      {isOwn && currentPost && (
        <TouchableOpacity style={s.postToggle} onPress={togglePosted} activeOpacity={0.7}>
          <View style={[s.postToggleCircle, isPosted && s.postToggleActive]}>
            <Ionicons
              name={isPosted ? 'eye' : 'eye-off'}
              size={20}
              color={isPosted ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
            />
          </View>
        </TouchableOpacity>
      )}

      <FullScreenFeed
        posts={posts}
        isLoading={isLoading}
        initialIndex={initialIndex}
        onIndexChange={setVisibleIndex}
        disableSwipeToProfile
        hideTabBar
      />
    </Animated.View>
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
  postToggle: { position: 'absolute', top: 54, right: 16, zIndex: 10 },
  postToggleCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postToggleActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});

/**
 * New Post Screen — shows the dream image and lets the user add a description
 * before posting publicly. Reached from:
 *   1. Dream Reveal ("Post" button)
 *   2. DLT flow (after generation)
 *   3. Album viewer (tapping "+" on a never-posted dream)
 */

import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import { pinToFeed } from '@/lib/dreamSave';
import { moderateText } from '@/lib/moderation';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';
import type { DreamPostItem } from '@/components/DreamCard';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { Toast } from '@/components/Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 1.3;

export default function NewPostScreen() {
  const { uploadId, imageUrl } = useLocalSearchParams<{
    uploadId: string;
    imageUrl: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);

  async function handlePost() {
    if (!user || !uploadId || posting) return;
    setPosting(true);
    try {
      // Moderate the public description — same wordlist gate every other
      // user-facing free-text field uses (comments, prompts, username).
      const trimmed = description.trim();
      if (trimmed) {
        const mod = await moderateText(trimmed);
        if (!mod.passed) {
          Toast.show(mod.reason ?? "This contains language we don't allow.", 'close-circle');
          setPosting(false);
          return;
        }
      }

      // Update + return the row in one round-trip so we have the fully-mapped
      // DreamPostItem for optimistic cache insertion below.
      const { data: updatedRows, error } = await supabase
        .from('uploads')
        .update({
          is_public: true,
          posted_at: new Date().toISOString(),
          description: trimmed || null,
        })
        .eq('id', uploadId)
        .eq('user_id', user.id)
        .select(POST_SELECT);

      if (error) throw error;

      const updatedPost: DreamPostItem | null =
        updatedRows && updatedRows.length > 0 ? mapToDreamPost(castRows(updatedRows)[0]) : null;

      pinToFeed({
        id: uploadId,
        userId: user.id,
        imageUrl: decodeURIComponent(imageUrl!),
        username: user.user_metadata?.username ?? '',
        avatarUrl: user.user_metadata?.avatar_url ?? null,
        description: trimmed || null,
      });

      // Optimistic cache writes — the profile grid (userPosts / my-dreams)
      // reflects the just-posted dream the instant the user navigates over,
      // without waiting on a refetch round-trip. The background invalidate
      // below reconciles with the server once the cache settles.
      type FeedInfinite = InfiniteData<{
        rows: DreamPostItem[];
        offset: number;
        hasMore: boolean;
      }>;
      if (updatedPost) {
        // Posts tab (is_public=true subset): insert at top of page 0 if not
        // already there; patch in place if it was already in cache.
        queryClient.setQueriesData<FeedInfinite>({ queryKey: ['userPosts', user.id] }, (old) => {
          if (!old?.pages?.length) return old;
          const exists = old.pages.some((p) => p.rows.some((r) => r.id === uploadId));
          if (exists) {
            return {
              ...old,
              pages: old.pages.map((p) => ({
                ...p,
                rows: p.rows.map((r) => (r.id === uploadId ? updatedPost : r)),
              })),
            };
          }
          const [first, ...rest] = old.pages;
          return {
            ...old,
            pages: [{ ...first, rows: [updatedPost, ...first.rows] }, ...rest],
          };
        });
        // Dreams tab: patches every cached variant. setQueriesData's
        // updater signature is single-arg in TanStack v5, so iterate the
        // cache to find each my-dreams variant (key shape:
        // ['my-dreams', userId, privateOnly]) and update with the right
        // strategy. privateOnly=true filters is_public=false → REMOVE the
        // just-posted row; privateOnly=false patches in place.
        const myDreamsKeys = queryClient
          .getQueryCache()
          .findAll({ queryKey: ['my-dreams', user.id] })
          .map((q) => q.queryKey);
        for (const key of myDreamsKeys) {
          const privateOnly = (key as unknown[])[2] === true;
          queryClient.setQueryData<FeedInfinite>(key, (old) => {
            if (!old?.pages?.length) return old;
            return {
              ...old,
              pages: old.pages.map((p) => ({
                ...p,
                rows: privateOnly
                  ? p.rows.filter((r) => r.id !== uploadId)
                  : p.rows.map((r) => (r.id === uploadId ? updatedPost : r)),
              })),
            };
          });
        }
      }

      // Background reconcile — refetchType: 'all' covers inactive queries
      // (profile tab hasn't been mounted yet this session) so the server
      // truth lands as soon as the network call returns.
      queryClient.invalidateQueries({ queryKey: ['userPosts'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['my-dreams'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
      // Clear dream store in case we came from Reveal
      useDreamStore.getState().reset();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Posted', 'checkmark-circle');

      router.replace('/(tabs)');
    } catch {
      Toast.show('Failed to post', 'close-circle');
      setPosting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Post</Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={posting}
            activeOpacity={0.7}
            style={[styles.postButton, posting && styles.postButtonDisabled]}
          >
            <Text style={[styles.postButtonText, posting && styles.postButtonTextDisabled]}>
              {posting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dream preview */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: decodeURIComponent(imageUrl!) }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </View>

        {/* Description input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a description..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: fontScale(16),
  },
  title: {
    color: '#FFFFFF',
    fontSize: fontScale(17),
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: verticalScale(8),
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    fontWeight: '700',
  },
  postButtonTextDisabled: {
    opacity: 0.7,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(16),
  },
  image: {
    width: SCREEN_WIDTH - 64,
    height: IMAGE_HEIGHT,
    borderRadius: 12,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  input: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    minHeight: 80,
    padding: 0,
  },
});

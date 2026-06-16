/**
 * New Post Screen — shows the dream image and lets the user add a description
 * before posting publicly. Reached from:
 *   1. Dream Reveal ("Post" button)
 *   2. DLT flow (after generation)
 *   3. Album viewer (tapping "+" on a never-posted dream)
 */

import { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  Keyboard,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { GradientTitle } from '@/components/GradientTitle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_IMAGE_WIDTH = SCREEN_WIDTH - 64;
const DEFAULT_ASPECT = 768 / 1344; // portrait dream default until the image loads
// Floor the image can shrink to when the keyboard is up, and rough reservations
// for the header + caption box used to size the image so the input always
// clears the keyboard. Clamped, so the estimates are safe across devices.
const MIN_IMAGE_HEIGHT = verticalScale(170);
const HEADER_RESERVE = verticalScale(56);
const INPUT_RESERVE = verticalScale(120);

export default function NewPostScreen() {
  const { uploadId, imageUrl } = useLocalSearchParams<{
    uploadId: string;
    imageUrl: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);

  // Shrink the dream preview as the keyboard rises so the caption input always
  // stays visible above it (the image is too tall to just pad up). Tracks the
  // real keyboard height via the core Keyboard API; LayoutAnimation makes the
  // resize ride the keyboard's slide. Clamped so it's full size at rest and
  // never collapses past a readable floor.
  const [kbHeight, setKbHeight] = useState(0);
  // Real aspect ratio of the dream (w/h) — defaults to portrait until expo-image
  // reports the loaded source dimensions, then we size the box exactly to it.
  const [imgAspect, setImgAspect] = useState(DEFAULT_ASPECT);
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvt, (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKbHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvt, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKbHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Size the preview to the image's real aspect, filling the available space:
  // full width when there's vertical room (keyboard down), shrinking only as the
  // keyboard eats height. No cap, no letterbox, no crop, no artificial narrowing.
  const availHeight =
    SCREEN_HEIGHT - insets.top - HEADER_RESERVE - INPUT_RESERVE - kbHeight - verticalScale(48);
  let imageBoxWidth = MAX_IMAGE_WIDTH;
  let imageBoxHeight = imageBoxWidth / imgAspect;
  if (imageBoxHeight > availHeight) {
    imageBoxHeight = Math.max(MIN_IMAGE_HEIGHT, availHeight);
    imageBoxWidth = imageBoxHeight * imgAspect;
  }

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
      {/* Tapping anywhere off the keyboard (image, black borders, empty space)
          dismisses it — interactive children (input, Cancel/Post) keep their
          own taps. */}
      <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <GradientTitle>New Post</GradientTitle>
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

        {/* Dream preview — sized to the image's real aspect, filling the room
            available (full width when the keyboard is down, shrinking as it
            opens). Tap it to dismiss the keyboard and restore full size. */}
        <View style={styles.imageContainer}>
          <View style={[styles.imageBox, { width: imageBoxWidth, height: imageBoxHeight }]}>
            <Image
              source={{ uri: decodeURIComponent(imageUrl!) }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              cachePolicy="memory-disk"
              onLoad={(e) => {
                const src = e.source;
                if (src?.width && src?.height) setImgAspect(src.width / src.height);
              }}
            />
          </View>
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
      </Pressable>
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
  imageBox: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
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

/**
 * LikesOverlay — who liked a post, in the CommentOverlay morph UX (Kevin
 * 2026-07-08): the dream image shrinks from full-screen to a thumbnail at the
 * top and the likes list slides up underneath. Replaces the old right-side
 * LikesSheet drawer so both post-social surfaces (comments + likes) feel like
 * one family.
 *
 * Deliberately an INLINE overlay, not a Modal — row taps push profiles as
 * swipe-back drawers OVER this overlay (same nav lesson as CommentOverlay:
 * a Modal sits above the navigation stack, so pushes would render underneath).
 * The host screen masks its chrome via onHudToggle while this is open.
 */

import { useRef, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
// FlatList from RNGH (not core RN) so its native scroll gesture can declare
// simultaneity with the sheet's dismiss pan — the core list WON the gesture
// whenever the likes list had content, so swipe-down-to-dismiss only worked on
// short/empty lists (mirrors the CommentOverlay fix).
import { Gesture, GestureDetector, FlatList, type GestureType } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as nav from '@/lib/navigate';
import { avatarUrl } from '@/lib/imageUrl';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { usePostLikes } from '@/hooks/usePostLikes';
import type { DreamPostItem } from '@/components/DreamCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Same geometry as CommentOverlay so the two morphs are visually identical.
const THUMB_HEIGHT = Math.round(SCREEN_HEIGHT * 0.28);
const THUMB_WIDTH = Math.round((THUMB_HEIGHT * 9) / 16);
const THUMB_MARGIN_TOP = 8;
const ANIM_DURATION = 250;
const EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

interface Props {
  post: DreamPostItem;
  onClose: () => void;
}

export function LikesOverlay({ post, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { data: likes = [], isLoading } = usePostLikes(post.id);

  // ── Animation (mirrors CommentOverlay) ────────────────────────────────────
  // 0 = full-screen image, 1 = thumbnail + likes list
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const closing = useRef(false);

  useEffect(() => {
    progress.value = withTiming(1, { duration: ANIM_DURATION, easing: EASING });
  }, [progress]);

  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    progress.value = withTiming(0, { duration: 250, easing: EASING }, () => {
      runOnJS(onClose)();
    });
  }, [onClose, progress]);

  // Swipe down to dismiss — the pan runs SIMULTANEOUSLY with the like list's
  // scroll (withRef + simultaneousHandlers on the FlatList). The sheet follows
  // only drags that STARTED with the list at the top (captured in onBegin);
  // mid-list scrolling never moves it.
  const listScrollY = useSharedValue(0);
  const panStartedAtTop = useSharedValue(true);
  const panRef = useRef<GestureType | undefined>(undefined);
  const panGesture = Gesture.Pan()
    .withRef(panRef)
    // Activate ONLY on a deliberate downward drag, and FAIL (yield to the list's
    // scroll) the moment the finger moves up. The old `.activeOffsetY([10, 300])`
    // activated on the first ~1px in EITHER direction and fought the list; a
    // single positive value = down-only, and failOffsetY hands upward motion to
    // the scroll (mirrors the CommentOverlay fix).
    .activeOffsetY(12)
    .failOffsetY(-12)
    .failOffsetX([-24, 24])
    .onBegin(() => {
      'worklet';
      panStartedAtTop.value = listScrollY.value <= 4;
    })
    .onUpdate((e) => {
      'worklet';
      // Follow the finger only for a downward drag that began — and remains — at
      // the top of the list, so mid-list scrolling can't half-drag the sheet.
      if (panStartedAtTop.value && listScrollY.value <= 4 && e.translationY > 0) {
        dragY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      'worklet';
      if (!panStartedAtTop.value) {
        return;
      }
      // Dismiss on a modest pull OR a quick flick — either alone is enough.
      if (dragY.value > 80 || e.velocityY > 500) {
        runOnJS(dismiss)();
      } else {
        dragY.value = withTiming(0, { duration: 200 });
      }
    });

  const HEADER_HEIGHT = insets.top + THUMB_HEIGHT + THUMB_MARGIN_TOP + 52;
  const thumbLeft = (SCREEN_WIDTH - THUMB_WIDTH) / 2;

  const imageStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const dy = dragY.value;
    const width = interpolate(p, [0, 1], [SCREEN_WIDTH, THUMB_WIDTH]);
    const height = interpolate(p, [0, 1], [SCREEN_HEIGHT, THUMB_HEIGHT]);
    const borderRadius = interpolate(p, [0, 1], [0, 12]);
    const translateX = interpolate(p, [0, 1], [0, thumbLeft]);
    const translateY = interpolate(p, [0, 1], [0, insets.top + THUMB_MARGIN_TOP]) + dy * 0.3;
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width,
      height,
      borderRadius,
      transform: [{ translateX }, { translateY }],
      zIndex: 10,
    };
  });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.6, 1]),
    transform: [{ translateY: dragY.value }],
  }));

  const paneStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [SCREEN_HEIGHT, 0]) + dragY.value;
    return { transform: [{ translateY }] };
  });

  const thumbMetaFade = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.6, 1], [0, 1]),
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="box-none">
        {/* Tap backdrop (above the pane) to dismiss */}
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT }}
          onPress={dismiss}
          activeOpacity={1}
        />

        {/* Floating thumbnail image — tap to dismiss */}
        <Animated.View style={imageStyle}>
          <TouchableOpacity onPress={dismiss} activeOpacity={0.9} style={{ flex: 1 }}>
            <Image
              // Same display variant the feed card rendered — already in the
              // memory-disk cache, so the morph never flashes (CommentOverlay
              // cache lesson).
              source={{ uri: post.image_url_display ?? post.image_url }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={post.thumbhash ? { thumbhash: post.thumbhash } : null}
              placeholderContentFit="cover"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Username + like count + close below thumbnail (fades in) */}
        <Animated.View
          style={[
            styles.thumbMeta,
            { top: insets.top + THUMB_MARGIN_TOP + THUMB_HEIGHT + 8 },
            thumbMetaFade,
          ]}
        >
          <View style={styles.thumbUserRow}>
            <TouchableOpacity
              style={styles.thumbIdentity}
              onPress={() => nav.push(`/user/${post.user_id}?drawer=1`)}
              activeOpacity={0.7}
            >
              {post.avatar_url ? (
                <Image
                  source={{ uri: avatarUrl(post.avatar_url) }}
                  style={styles.thumbAvatar}
                  cachePolicy="memory-disk"
                />
              ) : (
                <View style={styles.thumbAvatarFallback}>
                  <Text allowFontScaling={false} style={styles.thumbAvatarText}>
                    {(post.username || '?')[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.thumbUsername} numberOfLines={1}>
                {post.username}
              </Text>
            </TouchableOpacity>
            <Text style={styles.thumbCount}>
              {likes.length} {likes.length === 1 ? 'like' : 'likes'}
            </Text>
          </View>
          <TouchableOpacity onPress={dismiss} hitSlop={12} style={styles.closeButton}>
            <Ionicons name="chevron-down" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Likes pane */}
        <Animated.View style={[styles.pane, { top: HEADER_HEIGHT }, paneStyle]}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={{ flex: 1 }}>
              {/* Handle */}
              <View style={styles.handleRow}>
                <View style={styles.handle} />
              </View>

              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.accent}
                  style={{ marginTop: verticalScale(40) }}
                />
              ) : (
                <FlatList
                  data={likes}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.row}
                      // PUSH as a drawer over this overlay — back returns to
                      // the likes list exactly as left.
                      onPress={() => nav.push(`/user/${item.id}?drawer=1`)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{
                          uri: item.avatar_url ? avatarUrl(item.avatar_url) : undefined,
                        }}
                        style={styles.avatar}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                      />
                      <Text style={styles.username} numberOfLines={1}>
                        {item.username}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.empty}>
                      <Ionicons name="heart-outline" size={36} color="rgba(255,255,255,0.15)" />
                      <Text style={styles.emptyTitle}>No likes yet</Text>
                      <Text style={styles.emptySub}>Be the first to love this dream</Text>
                    </View>
                  }
                  contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 24 },
                  ]}
                  // Let the sheet's dismiss pan run ALONGSIDE the list scroll —
                  // without this the native scroll gesture wins outright and
                  // swipe-down-to-close only worked on short/empty lists.
                  simultaneousHandlers={panRef}
                  // No rubber-band at the top: the overscroll IS the sheet drag.
                  bounces={false}
                  onScroll={(e) => {
                    listScrollY.value = e.nativeEvent.contentOffset.y;
                  }}
                  scrollEventThrottle={16}
                />
              )}
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  thumbMeta: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 11,
  },
  thumbUserRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thumbIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  thumbAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  thumbAvatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbAvatarText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '700',
  },
  thumbUsername: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '700',
  },
  thumbCount: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    marginTop: verticalScale(2),
  },
  closeButton: {
    padding: 4,
  },
  pane: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(4),
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  listContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: verticalScale(10),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  username: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '600',
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingTop: verticalScale(48),
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  emptySub: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
  },
});

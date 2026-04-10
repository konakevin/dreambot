/**
 * DreamCard — shared full-screen image card.
 * - Double-tap to like
 * - Swipe left to visit profile (disable via prop)
 * - Long press to save image
 * - Pinch to zoom
 */

import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { timeAgo } from '@/lib/timeAgo';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withRepeat,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import { colors, ui, ANIM } from '@/constants/theme';
import { handleImageLongPress } from '@/lib/imageLongPress';
import { Toast } from '@/components/Toast';
import { MediumVibeBadge } from '@/components/MediumVibeBadge';
import { feedImageUrl, avatarUrl } from '@/lib/imageUrl';
import { useExploreStore } from '@/store/explore';
import { useFeedStore } from '@/store/feed';
import { useAuthStore } from '@/store/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface DreamPostItem {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  username: string;
  avatar_url: string | null;
  ai_prompt?: string | null;
  ai_concept?: Record<string, unknown> | null;
  created_at: string;
  comment_count?: number;
  like_count?: number;
  from_wish?: string | null;
  recipe_id?: string | null;
  fuse_count?: number;
  fuse_of?: string | null;
  bot_message?: string | null;
  dream_medium?: string | null;
  dream_vibe?: string | null;
  is_active?: boolean;
  is_posted?: boolean;
}

interface Props {
  item: DreamPostItem;
  bottomPadding: number;
  /** Measured container height — card renders at this height for perfect paging */
  cardHeight?: number;
  isLiked: boolean;
  onLike: () => void;
  onToggleLike: () => void;
  onComment?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  disableSwipeToProfile?: boolean;
  onDelete?: () => void;
  onFuse?: () => void;
  onFamily?: () => void;
  onLikesPress?: () => void;
  /** Show the eye/visibility toggle (only for own posts in album views) */
  showVisibilityToggle?: boolean;
  onTogglePosted?: () => void;
  /** Called when the HUD is toggled (single tap) */
  onHudToggle?: (visible: boolean) => void;
}

/** A single sparkle particle that floats along the border edge */
// Seeded random so sparkle positions are stable per index
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function getSparklePosition(index: number, total: number, seed: number) {
  const perimeter = 2 * (SCREEN_WIDTH + SCREEN_HEIGHT);
  const step = perimeter / total;
  const pos = (step * index + seededRandom(index + seed + 7) * step * 0.6) % perimeter;
  const jitter = seededRandom(index + seed + 13) * 14;

  if (pos < SCREEN_WIDTH) {
    return { left: pos, top: jitter };
  } else if (pos < SCREEN_WIDTH + SCREEN_HEIGHT) {
    return { left: SCREEN_WIDTH - jitter, top: pos - SCREEN_WIDTH };
  } else if (pos < 2 * SCREEN_WIDTH + SCREEN_HEIGHT) {
    return { left: 2 * SCREEN_WIDTH + SCREEN_HEIGHT - pos, top: SCREEN_HEIGHT - jitter };
  } else {
    return { left: jitter, top: perimeter - pos };
  }
}

function WishSparkle({ index, total, seed }: { index: number; total: number; seed: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const { left, top } = getSparklePosition(index, total, seed);
  const delay = seededRandom(index + seed + 3) * 5000;
  const duration = 2500 + seededRandom(index + seed + 11) * 2500;
  const size = 3 + seededRandom(index + 17) * 4;

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.3 }),
          withTiming(0, { duration: duration * 0.7 })
        ),
        -1,
        true
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: duration * 0.3 }),
          withTiming(0.3, { duration: duration * 0.7 })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const color =
    index % 3 === 0
      ? 'rgba(255,223,150,0.95)'
      : index % 3 === 1
        ? 'rgba(196,181,253,0.95)'
        : 'rgba(255,255,255,0.9)';

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowRadius: 6,
          shadowOpacity: 1,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}

export function DreamCard({
  item,
  bottomPadding,
  cardHeight,
  isLiked,
  onLike,
  onToggleLike,
  onComment,
  onShare,
  isSaved,
  onToggleSave,
  disableSwipeToProfile,
  onDelete,
  onFuse,
  onFamily,
  onLikesPress,
  showVisibilityToggle,
  onTogglePosted,
  onHudToggle,
}: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const isOwnPost = currentUser?.id === item.user_id;
  const lastTap = useRef(0);
  const swiped = useRef(false);

  // Wish fairy dust — shimmering hazy border with sparkle particles
  const isWish = !!item.from_wish;
  const hazeOpacity = useSharedValue(0.3);
  useEffect(() => {
    if (isWish) {
      hazeOpacity.value = withRepeat(
        withSequence(withTiming(0.7, { duration: 2000 }), withTiming(0.3, { duration: 2000 })),
        -1,
        true
      );
    }
  }, [isWish]);
  const hazeStyle = useAnimatedStyle(() => ({
    opacity: hazeOpacity.value,
  }));

  // HUD visibility — single tap toggles, fades in/out
  const hudOpacity = useSharedValue(1);
  const hudHidden = useRef(false);

  // Reset HUD when scrolling to a different card
  useEffect(() => {
    hudHidden.current = false;
    hudOpacity.value = 1;
  }, [item.id]);

  const hudStyle = useAnimatedStyle(() => ({
    opacity: hudOpacity.value,
    pointerEvents: hudOpacity.value < 0.5 ? 'none' : 'auto',
  }));

  // Heart burst
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  // Pinch to zoom — Instagram-style: stays zoomed, pan to explore, double-tap resets
  const zoomScale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const zoomTransX = useSharedValue(0);
  const zoomTransY = useSharedValue(0);
  const savedTransX = useSharedValue(0);
  const savedTransY = useSharedValue(0);
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: zoomTransX.value },
      { translateY: zoomTransY.value },
      { scale: zoomScale.value },
    ],
  }));

  function goToProfile() {
    if (swiped.current) return;
    swiped.current = true;
    if (isOwnPost) {
      nav.navigate('/(tabs)/profile');
    } else {
      nav.push(`/user/${item.user_id}?viewedPost=${item.id}`);
    }
    setTimeout(() => {
      swiped.current = false;
    }, 500);
  }

  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleTap() {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap — cancel the pending single tap
      if (singleTapTimer.current) {
        clearTimeout(singleTapTimer.current);
        singleTapTimer.current = null;
      }

      // If zoomed, reset zoom instead of toggling like
      if (savedScale.value > 1) {
        zoomScale.value = withTiming(1, { duration: 200 });
        zoomTransX.value = withTiming(0, { duration: 200 });
        zoomTransY.value = withTiming(0, { duration: 200 });
        savedScale.value = 1;
        savedTransX.value = 0;
        savedTransY.value = 0;
        lastTap.current = 0;
        return;
      }

      onToggleLike();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (!isLiked) {
        heartScale.value = 0;
        heartOpacity.value = 1;
        heartScale.value = withSequence(
          withTiming(1.3, { duration: 200 }),
          withTiming(1, { duration: 100 }),
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 200 })
        );
        heartOpacity.value = withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 200 })
        );
      }
      lastTap.current = 0;
      return;
    }

    lastTap.current = now;

    // Wait to see if a second tap comes — if not, it's a single tap (toggle HUD)
    singleTapTimer.current = setTimeout(() => {
      singleTapTimer.current = null;
      hudHidden.current = !hudHidden.current;
      hudOpacity.value = withTiming(hudHidden.current ? 0 : 1, { duration: ANIM.HUD_FADE_MS });
      onHudToggle?.(!hudHidden.current);
    }, 300);
  }

  function handleLongPress() {
    handleImageLongPress({ id: item.id, imageUrl: item.image_url, onDelete });
  }

  // Gestures
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-15, 15])
    .enabled(!disableSwipeToProfile && savedScale.value <= 1)
    .onEnd((e) => {
      if (e.translationX < -25 || e.velocityX < -200) {
        runOnJS(goToProfile)();
      }
    });

  // Pan when zoomed — slide around the image (only active when zoomed in)
  const zoomPanGesture = Gesture.Pan()
    .minPointers(2)
    .onStart(() => {
      savedTransX.value = zoomTransX.value;
      savedTransY.value = zoomTransY.value;
    })
    .onUpdate((e) => {
      if (savedScale.value <= 1) return;
      // Clamp pan to image boundaries
      const maxX = ((savedScale.value - 1) * SCREEN_WIDTH) / 2;
      const maxY = ((savedScale.value - 1) * SCREEN_HEIGHT) / 2;
      zoomTransX.value = Math.max(-maxX, Math.min(maxX, savedTransX.value + e.translationX));
      zoomTransY.value = Math.max(-maxY, Math.min(maxY, savedTransY.value + e.translationY));
    });

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      focalX.value = e.focalX - SCREEN_WIDTH / 2;
      focalY.value = e.focalY - SCREEN_HEIGHT / 2;
    })
    .onUpdate((e) => {
      const newScale = Math.max(1, Math.min(5, savedScale.value * e.scale));
      zoomScale.value = newScale;
      // Pan toward focal point as you zoom
      zoomTransX.value = savedTransX.value + focalX.value * (1 - e.scale);
      zoomTransY.value = savedTransY.value + focalY.value * (1 - e.scale);
    })
    .onEnd(() => {
      // Always animate back to full size on release — no bounce
      zoomScale.value = withTiming(1, { duration: 200 });
      zoomTransX.value = withTiming(0, { duration: 200 });
      zoomTransY.value = withTiming(0, { duration: 200 });
      savedScale.value = 1;
      savedTransX.value = 0;
      savedTransY.value = 0;
    });

  const composed = Gesture.Simultaneous(
    swipeGesture,
    Gesture.Simultaneous(pinchGesture, zoomPanGesture)
  );

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[s.card, cardHeight ? { height: cardHeight } : undefined]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleTap}
          onLongPress={handleLongPress}
          delayLongPress={500}
        >
          <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
            <Image
              source={{ uri: feedImageUrl(item.image_url) }}
              style={s.fullImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          </Animated.View>

          {/* Wish shimmer border */}
          {isWish && (
            <View style={s.wishGlow} pointerEvents="none">
              {/* Shimmering hazy edge glow */}
              <Animated.View style={[StyleSheet.absoluteFill, hazeStyle]}>
                <LinearGradient
                  colors={['rgba(196,181,253,0.45)', 'rgba(255,223,150,0.2)', 'transparent']}
                  style={s.wishEdgeTop}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(255,223,150,0.2)', 'rgba(196,181,253,0.45)']}
                  style={s.wishEdgeBottom}
                />
                <LinearGradient
                  colors={['rgba(196,181,253,0.4)', 'rgba(255,223,150,0.15)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.wishEdgeLeft}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(255,223,150,0.15)', 'rgba(196,181,253,0.4)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.wishEdgeRight}
                />
              </Animated.View>
              {/* Sparkle particles evenly around the border */}
              {Array.from({ length: 36 }).map((_, i) => (
                <WishSparkle
                  key={i}
                  index={i}
                  total={36}
                  seed={item.id.charCodeAt(0) + item.id.charCodeAt(1) * 7}
                />
              ))}
            </View>
          )}

          {/* Heart burst */}
          <Animated.View style={[s.heartBurst, heartStyle]} pointerEvents="none">
            <Ionicons name="heart" size={80} color="#FFFFFF" />
          </Animated.View>

          {/* HUD — post info + side actions, toggled by single tap */}
          <Animated.View style={[StyleSheet.absoluteFill, hudStyle]} pointerEvents="box-none">
            <View style={[s.postInfo, { paddingBottom: bottomPadding }]}>
              <MediumVibeBadge
                mediumKey={item.dream_medium}
                vibeKey={item.dream_vibe}
                onPress={() => {
                  useExploreStore
                    .getState()
                    .setFilters(item.dream_medium ?? null, item.dream_vibe ?? null);
                  useFeedStore.getState().setActiveTab('top');
                  nav.navigate('/(tabs)/top');
                }}
              />
              <TouchableOpacity
                style={s.usernameRow}
                onPress={() =>
                  isOwnPost
                    ? nav.navigate('/(tabs)/profile')
                    : nav.push(`/user/${item.user_id}?viewedPost=${item.id}`)
                }
                activeOpacity={0.7}
              >
                {item.avatar_url ? (
                  <Image
                    source={{ uri: avatarUrl(item.avatar_url!) }}
                    style={s.avatar}
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <View style={s.avatarFallback}>
                    <Text style={s.avatarText}>{(item.username || '?')[0].toUpperCase()}</Text>
                  </View>
                )}
                <View>
                  <Text style={s.username}>{item.username ?? 'dreamer'}</Text>
                  <Text style={s.timestamp}>{timeAgo(item.created_at)}</Text>
                </View>
              </TouchableOpacity>
              {item.from_wish && (
                <TouchableOpacity
                  onPress={() => Toast.show(`Wished: "${item.from_wish}"`, 'color-wand-outline')}
                  activeOpacity={0.7}
                  hitSlop={8}
                >
                  <Ionicons name="color-wand-outline" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Side actions */}
            <View style={[s.sideActions, { bottom: bottomPadding + 10 }]}>
              {showVisibilityToggle && onTogglePosted && (
                <TouchableOpacity
                  style={ui.sideButton}
                  onPress={onTogglePosted}
                  activeOpacity={0.7}
                >
                  <View style={[s.visibilityCircle, item.is_posted && s.visibilityCircleActive]}>
                    <Ionicons
                      name={item.is_posted ? 'eye' : 'eye-off'}
                      size={20}
                      color={item.is_posted ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                    />
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={ui.sideButton}
                onPress={onToggleLike}
                onLongPress={onLikesPress}
                delayLongPress={400}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={28}
                  color={isLiked ? colors.like : '#FFFFFF'}
                />
                {(item.like_count ?? 0) > 0 && <Text style={ui.sideCount}>{item.like_count}</Text>}
              </TouchableOpacity>
              {onComment && (
                <TouchableOpacity style={ui.sideButton} onPress={onComment} activeOpacity={0.7}>
                  <Ionicons name="chatbubble-outline" size={26} color="#FFFFFF" />
                  {(item.comment_count ?? 0) > 0 && (
                    <Text style={ui.sideCount}>{item.comment_count}</Text>
                  )}
                </TouchableOpacity>
              )}
              {onToggleSave && (
                <TouchableOpacity style={ui.sideButton} onPress={onToggleSave} activeOpacity={0.7}>
                  <Ionicons
                    name={isSaved ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={ui.sideButton}
                onPress={
                  onShare ??
                  (() =>
                    nav.push(
                      `/sharePost?uploadId=${item.id}&username=${encodeURIComponent(item.username)}`
                    ))
                }
                activeOpacity={0.7}
              >
                <Ionicons name="paper-plane-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              {onFamily && (
                <TouchableOpacity style={ui.sideButton} onPress={onFamily} activeOpacity={0.7}>
                  <Ionicons name="color-wand-outline" size={24} color="#FFFFFF" />
                  {(item.fuse_count ?? 0) > 0 && (
                    <Text style={ui.sideCount}>{item.fuse_count}</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const s = StyleSheet.create({
  card: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: '#000' },
  fullImage: { ...StyleSheet.absoluteFillObject },
  wishGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wishEdgeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  wishEdgeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  wishEdgeLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 30,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  wishEdgeRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 30,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  heartBurst: { position: 'absolute', top: '50%', left: '50%', marginTop: -40, marginLeft: -40 },
  sideActions: { position: 'absolute', right: 12, alignItems: 'center', gap: 16 },
  visibilityCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibilityCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  postInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 60,
    paddingHorizontal: 16,
    gap: 6,
    paddingBottom: 4,
  },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  username: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
    marginTop: 1,
  },
});

/**
 * DreamCard — shared full-screen image card.
 * - Double-tap to like
 * - Swipe left to visit profile (disable via prop)
 * - Long press to save image
 * - Pinch to zoom
 */

import { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  TextStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { timeAgo } from '@/lib/timeAgo';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';
import { useCardGestures } from '@/hooks/gestures/useCardGestures';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import { colors, ui, ANIM } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { handleImageLongPress, openDownloadSheet } from '@/lib/imageLongPress';
import { Toast } from '@/components/Toast';
import { avatarUrl } from '@/lib/imageUrl';
import { getModelDisplayName } from '@/constants/imageModels';
import { useAuthStore } from '@/store/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface DreamPostItem {
  id: string;
  user_id: string;
  image_url: string;
  /** 4× upscaled HQ version, populated lazily by upscale-image Edge Function
   * or pre-populated by bot pipeline / Pro user pre-upscale. NULL until first
   * upscale completes. Used by long-press to skip the "this will take ~30s"
   * confirm dialog when HQ is already cached. */
  image_url_hq?: string | null;
  /** Small JPEG display variant served to the feed (~150KB). NULL until the
   * render pipeline / backfill populates it; the card coalesces to image_url. */
  image_url_display?: string | null;
  /** ~25-byte base64 thumbhash preview hash. Fed to expo-image's `placeholder`
   * prop so the card shows a sharp blurry preview the instant it mounts,
   * instead of a surface-tinted void while the image loads. NULL until the
   * render pipeline / backfill populates it; the card falls back to the
   * surface-tinted placeholder when null. */
  thumbhash?: string | null;
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
  /** AI model identifier that rendered this image (e.g. 'openai/gpt-image-2',
   * 'black-forest-labs/flux-1.1-pro'). Populated for new posts by the bot
   * engine + Edge Functions; older posts are null. Powers the bottom-left
   * model badge (above the username). */
  model?: string | null;
  is_public?: boolean;
  posted_at?: string | null;
  description?: string | null;
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
  /** Admin-only one-tap delete (no confirm). Rendered as a red X above the heart. */
  onAdminDeleteImmediate?: () => void;
  onFuse?: () => void;
  onFamily?: () => void;
  onLikesPress?: () => void;
  /** Show the eye/visibility toggle (only for own posts in album views) */
  showVisibilityToggle?: boolean;
  onTogglePosted?: () => void;
  /** Called when the HUD is toggled (single tap) */
  onHudToggle?: (visible: boolean) => void;
  /** True when this is the currently-visible card in FullScreenFeed. The
   *  in-card HUD-reset effect refires when this flips — resetting chrome to
   *  visible as a card becomes active. Replaces the old global hudResetToken:
   *  a per-card boolean only re-renders the two cards involved in a swipe
   *  (outgoing + incoming) instead of every windowed card. Also defends
   *  against FlatList recycling a previously-tapped instance back into view
   *  with stale hudOpacity = 0 (when it becomes active again, isActive flips
   *  true → effect refires). Optional; non-feed callers omit it. */
  isActive?: boolean;
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
  }, [delay, duration, opacity, scale]);

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

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Text
      style={s.description}
      numberOfLines={expanded ? undefined : 1}
      onPress={() => setExpanded((v) => !v)}
    >
      {text}
    </Text>
  );
}

export const DreamCard = memo(function DreamCard({
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
  onAdminDeleteImmediate,
  onFuse,
  onFamily,
  onLikesPress,
  showVisibilityToggle,
  onTogglePosted,
  onHudToggle,
  isActive,
}: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const isOwnPost = currentUser?.id === item.user_id;
  const lastTap = useRef(0);
  const swiped = useRef(false);

  // Image fill mode — every render fills the card edge-to-edge regardless
  // of the source model's aspect ratio. Off-ratio renders (GPT 2:3, square
  // Gemini, etc.) crop instead of letterboxing — the feed reads as one
  // consistent full-bleed stage. (Previously we measured on load and flipped
  // wider-than-9:16 to `contain`; reverted 2026-05-30 per Kevin.)
  // Image load resilience: a failed load (transient network / decode hiccup)
  // used to leave a permanent BLACK card. AUTO-retry silently — cache-busted,
  // with backoff, capped at MAX_IMG_RETRIES. After those, surface a
  // user-tappable "Tap to retry" overlay so a persistent failure isn't a
  // dead end. (The small-JPEG display variant cuts the failure rate; this
  // is the visible safety net for the rare persistent case.)
  const MAX_IMG_RETRIES = 3;
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const [showRetryUi, setShowRetryUi] = useState(false);
  useEffect(
    () => () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    },
    []
  );
  // Prefer the small display variant; fall back to the full image when absent.
  const heroBase = item.image_url_display ?? item.image_url;
  const heroUrl =
    retryNonce > 0 ? `${heroBase}${heroBase.includes('?') ? '&' : '?'}r=${retryNonce}` : heroBase;

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
  }, [isWish, hazeOpacity]);
  const hazeStyle = useAnimatedStyle(() => ({
    opacity: hazeOpacity.value,
  }));

  // HUD visibility — single tap toggles, fades in/out
  const hudOpacity = useSharedValue(1);
  const hudHidden = useRef(false);
  // Pending single-tap timer (hoisted above the reset effect so the
  // effect can clear it when the card is swiped past mid-tap). Used by
  // handleTap further below.
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset HUD when scrolling to a different card. Watches BOTH item.id
  // (handles new mounts) AND isActive (handles FlatList recycling an existing
  // instance back into view with stale hudOpacity = 0 — when it becomes the
  // active card again, isActive flips true and this refires).
  useEffect(() => {
    if (singleTapTimer.current) {
      clearTimeout(singleTapTimer.current);
      singleTapTimer.current = null;
    }
    hudHidden.current = false;
    hudOpacity.value = 1;
  }, [item.id, isActive, hudOpacity]);

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

  // Pinch-to-zoom + swipe-left-to-profile. Single composed gesture — all
  // threshold/animation tuning lives in hooks/gestures/useCardGestures.ts.
  const {
    gesture: cardGesture,
    imageTransformStyle,
    scale: savedScale,
  } = useCardGestures({
    onSwipeLeft: goToProfile,
    disableSwipeLeft: disableSwipeToProfile,
  });

  function handleTap() {
    // Single tap toggles HUD (clean-image view). Double tap likes.
    // To disambiguate, schedule the HUD toggle after a short delay and
    // cancel it if a second tap arrives.
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap — cancel the pending single tap (HUD toggle)
      if (singleTapTimer.current) {
        clearTimeout(singleTapTimer.current);
        singleTapTimer.current = null;
      }

      // If still zoomed (e.g. pinch animation hasn't settled), skip toggling like
      // — user was trying to reset zoom, not double-tap. Pinch release auto-resets
      // scale via useCardGestures.
      if (savedScale.value > 1.05) {
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
    handleImageLongPress({
      id: item.id,
      imageUrl: item.image_url,
      imageUrlHq: item.image_url_hq ?? null,
      onDelete,
    });
  }

  // Gestures composed by useCardGestures above — swipe-left, pinch, two-finger pan.

  return (
    <GestureDetector gesture={cardGesture}>
      <Animated.View style={[s.card, cardHeight ? { height: cardHeight } : undefined]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleTap}
          onLongPress={handleLongPress}
          delayLongPress={500}
        >
          <Animated.View style={[StyleSheet.absoluteFill, imageTransformStyle]}>
            {/* All renders fill the card edge-to-edge regardless of source
                aspect — Flux 9:16, GPT 2:3, square Gemini, etc. all crop to
                fit. Keeps the feed reading as one consistent full-bleed stage
                rather than a mix of full-bleed + letterboxed cards. */}
            <Image
              source={{ uri: heroUrl }}
              style={s.fullImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={item.id}
              transition={150}
              // Tiny blurry preview shown instantly during decode/network,
              // so the card never reads as "broken black void" while
              // expo-image is busy. Falls back to the surface-tinted
              // backgroundColor on fullImage when thumbhash is null
              // (legacy posts pre-219 — backfilled in a separate pass).
              placeholder={item.thumbhash ? { thumbhash: item.thumbhash } : null}
              placeholderContentFit="cover"
              onError={() => {
                if (retryCountRef.current >= MAX_IMG_RETRIES) {
                  // Silent auto-retries exhausted — show the user-tappable
                  // overlay so a persistent failure isn't a dead-end black
                  // card. Tapping the overlay resets and tries again.
                  setShowRetryUi(true);
                  return;
                }
                retryCountRef.current += 1;
                if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
                // backoff: 0.6s, 1.2s, 1.8s — refetch via cache-busted nonce
                retryTimerRef.current = setTimeout(
                  () => setRetryNonce((n) => n + 1),
                  600 * retryCountRef.current
                );
              }}
              onLoad={() => {
                retryCountRef.current = 0;
                if (showRetryUi) setShowRetryUi(false);
              }}
            />
            {/* Tap-to-retry overlay — only shown after the silent auto-retry
                budget is exhausted (3 backoffs over ~3.6s). Sits over the
                thumbhash/surface-tinted placeholder so the user never gets
                stuck looking at a permanent "broken card" state. Reset on
                press: nonce++ refetches, onLoad clears the overlay. */}
            {showRetryUi && (
              <Pressable
                style={s.retryOverlay}
                onPress={() => {
                  retryCountRef.current = 0;
                  setShowRetryUi(false);
                  setRetryNonce((n) => n + 1);
                }}
                hitSlop={20}
              >
                <View style={s.retryPill}>
                  <Ionicons name="refresh" size={16} color={colors.textPrimary} />
                  <Text style={s.retryText}>Tap to retry</Text>
                </View>
              </Pressable>
            )}
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
              {/* Model badge — sits ABOVE the username so Kevin (and users)
                  can see which AI rendered the image at a glance. Friendly
                  name from constants/imageModels; hidden when model is null
                  (legacy posts + user dreams not yet wired through). */}
              {item.model && (
                <View style={s.modelBadgeWrap}>
                  <View style={s.modelBadge}>
                    <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                    <Text style={s.modelBadgeText}>{getModelDisplayName(item.model)}</Text>
                  </View>
                </View>
              )}
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
                <View style={{ flex: 1 }}>
                  <Text style={s.username}>{item.username ?? 'dreamer'}</Text>
                  {item.description ? <ExpandableDescription text={item.description} /> : null}
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
                  {item.posted_at == null ? (
                    <View style={s.visibilityCircle}>
                      <Ionicons name="add" size={24} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={[s.visibilityCircle, item.is_public && s.visibilityCircleActive]}>
                      <Ionicons
                        name={item.is_public ? 'eye' : 'eye-off'}
                        size={20}
                        color={item.is_public ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              {onAdminDeleteImmediate && (
                <TouchableOpacity
                  style={ui.sideButton}
                  onPress={onAdminDeleteImmediate}
                  activeOpacity={0.7}
                  accessibilityLabel="Admin: delete this post immediately"
                >
                  <View style={s.adminDeleteCircle}>
                    <Ionicons name="close" size={22} color="#FFFFFF" />
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
                {/* Always-rendered count slot: opacity-hide when 0 instead of
                    conditionally mounting the Text. Adding/removing the Text
                    expanded/collapsed the button height (~14px) and shoved
                    every subsequent side-rail button up or down — the "janky
                    reflow + phantom number" Kevin reported. Keeping the slot
                    occupied at all times locks the rail's vertical rhythm. */}
                <Text
                  style={[ui.sideCount, !(item.like_count ?? 0) && hiddenCount]}
                  numberOfLines={1}
                >
                  {item.like_count ?? 0}
                </Text>
              </TouchableOpacity>
              {onComment && (
                <TouchableOpacity style={ui.sideButton} onPress={onComment} activeOpacity={0.7}>
                  <Ionicons name="chatbubble-outline" size={26} color="#FFFFFF" />
                  <Text
                    style={[ui.sideCount, !(item.comment_count ?? 0) && hiddenCount]}
                    numberOfLines={1}
                  >
                    {item.comment_count ?? 0}
                  </Text>
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
              <TouchableOpacity
                style={ui.sideButton}
                onPress={() =>
                  openDownloadSheet({
                    id: item.id,
                    imageUrl: item.image_url,
                    imageUrlHq: item.image_url_hq ?? null,
                  })
                }
                activeOpacity={0.7}
                accessibilityLabel="Download this dream"
              >
                <Ionicons name="download-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              {onFamily && (
                <TouchableOpacity style={ui.sideButton} onPress={onFamily} activeOpacity={0.7}>
                  <Ionicons name="color-wand-outline" size={24} color="#FFFFFF" />
                  <Text
                    style={[ui.sideCount, !(item.fuse_count ?? 0) && hiddenCount]}
                    numberOfLines={1}
                  >
                    {item.fuse_count ?? 0}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
});

// Applied to a side-rail count Text when the count is 0: keeps the element
// in the layout (reserving its vertical space) but invisible. Crossing the
// 0↔1 threshold then becomes a visibility flip, not a remount → no reflow.
const hiddenCount = { opacity: 0 } as const;

const s = StyleSheet.create({
  card: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: '#000' },
  // Surface-tinted background under the Image while it decodes/loads —
  // replaces the pure-black gap users were seeing during expo-image's
  // decode window. With colors.surface (~#0F0F14) showing through, a
  // load that takes a beat reads as intentional dim placeholder, not
  // "is this card broken?".
  fullImage: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.surface },
  // Tap-to-retry overlay — covers the failed-Image area, centered pill.
  // Only shown after silent auto-retries are exhausted.
  retryOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: verticalScale(10),
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  retryText: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
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
  adminDeleteCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
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
    paddingBottom: verticalScale(4),
  },
  // Model badge — small chip rendered above the usernameRow. flex-start
  // wrapper keeps the chip hugging its label width (without it, the chip
  // would stretch the full row). Translucent dark fill + tight padding so
  // it doesn't compete with the username/caption typography for attention.
  modelBadgeWrap: { flexDirection: 'row', marginBottom: verticalScale(6) },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: verticalScale(3),
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  modelBadgeText: {
    color: '#FFFFFF',
    fontSize: fontScale(11),
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: verticalScale(8) },
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
  avatarText: { color: '#FFFFFF', fontSize: fontScale(14), fontWeight: '700' },
  username: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  description: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontScale(13),
    fontWeight: '400',
    marginTop: verticalScale(2),
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  } as TextStyle,
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontScale(12),
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
    marginTop: verticalScale(1),
  },
});

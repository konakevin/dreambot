/**
 * DreamCard — shared full-screen image card.
 * - Double-tap to like
 * - Swipe left to visit profile (disable via prop)
 * - Long press to save image
 * - Pinch to zoom
 */

import { useState, useRef, useEffect, memo } from 'react';
import { View, TouchableOpacity, Pressable, StyleSheet, Dimensions, TextStyle } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { timeAgo } from '@/lib/timeAgo';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useCardGestures } from '@/hooks/gestures/useCardGestures';
import { ExpandableDescription } from '@/components/dreamCardBits/ExpandableDescription';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import { colors, ui, ANIM } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { buildPostActionRows } from '@/lib/imageLongPress';
import { PostActionSheet } from '@/components/PostActionSheet';
import { avatarUrl } from '@/lib/imageUrl';
import { getModelDisplayName } from '@/constants/imageModels';
import { useAuthStore } from '@/store/auth';
import { useAdminShowModelBadge } from '@/lib/adminPrefs';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useToggleBlock } from '@/hooks/useBlockUser';
import { useBotUsers } from '@/hooks/useBotUsers';
import { useRepostIds } from '@/hooks/useRepostIds';
import { useToggleRepost } from '@/hooks/useToggleRepost';

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
  repost_count?: number;
  /** Author's repost opt-out (users.allow_reposts). false = this author disabled
   *  reposts → hide the repost button. Defaults to true (allow) when absent. */
  allow_reposts?: boolean;
  recipe_id?: string | null;
  bot_message?: string | null;
  dream_medium?: string | null;
  dream_vibe?: string | null;
  /** AI model identifier that rendered this image (e.g. 'openai/gpt-image-2',
   * 'black-forest-labs/flux-1.1-pro'). Populated for new posts by the bot
   * engine + Edge Functions; older posts are null. Powers the bottom-left
   * model badge (above the username). */
  model?: string | null;
  /** Dream-Cast face-swap marker (migration 310). 'single' | 'dual' when a cast
   * photo was swapped into this dream → HD download is disabled (upscaling an
   * already-rendered AI face is uncanny). NULL/absent → plain render, HD allowed. */
  face_swap_mode?: string | null;
  is_public?: boolean;
  posted_at?: string | null;
  description?: string | null;
  /** Repost surface (get_feed migration 243). 'repost' = this card is reaching
   * the viewer via a followed user's repost; reposter_* carry the attribution. */
  surface_type?: 'original' | 'repost';
  reposter_id?: string | null;
  reposter_name?: string | null;
  reposters_more?: number;
  reposted_at?: string | null;
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
  /** Launch "Dream Like This" from this post (the color-wand side button). */
  onDreamLikeThis?: () => void;
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
  /** Draw a soft black scrim behind the post-info / side actions for
   *  legibility. Off by default — main feeds (index, top) skip it so the
   *  image reads clean; the photo/[id] album viewer opts in since its
   *  description text needs the extra contrast. */
  showBottomScrim?: boolean;
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
  onDreamLikeThis,
  onLikesPress,
  showVisibilityToggle,
  onTogglePosted,
  onHudToggle,
  isActive,
  showBottomScrim,
}: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
  const [showModelBadge] = useAdminShowModelBadge();
  const isOwnPost = currentUser?.id === item.user_id;
  // Inline "Follow" on the card (IG-style) — lets the user follow this account
  // without drilling into the profile. Only shown once the following set has
  // loaded (avoids flashing Follow on accounts you already follow). Cards only
  // ever surface public/bot authors (get_feed returns public posts), so the
  // public instant-follow path is correct here.
  const { data: followingSet } = useFollowingIds();
  const toggleFollow = useToggleFollow();
  const toggleBlock = useToggleBlock();
  const { data: botUsers } = useBotUsers();
  const isBotAuthor = (botUsers ?? []).some((b) => b.id === item.user_id);
  // Long-press context menu (PostActionSheet).
  const [actionsOpen, setActionsOpen] = useState(false);
  // Author controls on the card (non-own posts): a Follow/Following toggle pill
  // (so the user can also unfollow from the feed, not just quick-follow) + a
  // visible "•••" options button that opens Report/Block (a discoverable 1.2
  // entry point alongside long-press). Shown once the following set has loaded.
  const showAuthorControls = !isOwnPost && followingSet !== undefined;
  const isFollowing = !!followingSet?.has(item.user_id);
  // Repost — self-contained (membership Set is one shared cached query; the
  // mutation toggles via the toggle_repost RPC). Hidden on own posts AND on posts
  // whose author opted out (allow_reposts === false) — the server also rejects
  // those, but hiding the button is the correct UX. `!== false` so a surface that
  // hasn't wired the flag through (undefined) still shows it.
  const { data: repostIdsSet } = useRepostIds();
  const toggleRepost = useToggleRepost();
  const isReposted = repostIdsSet?.has(item.id) ?? false;
  const canRepost = !isOwnPost && item.allow_reposts !== false;
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

  // Per-card image fit toggle (top-right HUD button). 'cover' is the default
  // (full-bleed, may crop the sides of off-ratio renders); 'contain'
  // letterboxes so the user can see the full image when something was cropped
  // out. Per-card local state — fresh on every scroll (FlatList recycler
  // unmounts the card → state resets), matches IG-style "tap to peek".
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setActionsOpen(true);
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
              contentFit={fitMode}
              cachePolicy="memory-disk"
              recyclingKey={item.id}
              transition={150}
              // Tiny blurry preview shown instantly during decode/network,
              // so the card never reads as "broken black void" while
              // expo-image is busy. Falls back to the surface-tinted
              // backgroundColor on fullImage when thumbhash is null
              // (legacy posts pre-219 — backfilled in a separate pass).
              placeholder={item.thumbhash ? { thumbhash: item.thumbhash } : null}
              placeholderContentFit={fitMode}
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

          {/* Heart burst */}
          <Animated.View style={[s.heartBurst, heartStyle]} pointerEvents="none">
            <Ionicons name="heart" size={80} color="#FFFFFF" />
          </Animated.View>

          {/* HUD — post info + side actions, toggled by single tap */}
          <Animated.View style={[StyleSheet.absoluteFill, hudStyle]} pointerEvents="box-none">
            {/* Bottom scrim — subtle darken gradient behind the post-info +
                side actions so the username / description / counts stay
                readable over bright image regions. Fades with the HUD on
                single-tap clean view. Content-driven: shown whenever the
                card carries a description (user posts) since the description
                is the text that suffers most on busy images; bot posts (no
                description) skip the scrim and keep the original clean
                main-feed look. showBottomScrim prop forces it on regardless
                (album viewer opts in unconditionally). */}
            {(showBottomScrim || !!item.description) && (
              <LinearGradient
                // Fade in over the top, then HOLD a solid rgba(0,0,0,0.6) through
                // the bottom so the footer matches the active feed pill exactly
                // (OverlayPill.pillActive). Lets the icons read against the pill color.
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)']}
                locations={[0, 0.6, 1]}
                style={s.bottomScrim}
                pointerEvents="none"
              />
            )}
            <View style={[s.postInfo, { paddingBottom: bottomPadding }]}>
              {/* Repost attribution — shown when this card reaches the viewer via
                  a followed user's repost (surface_type='repost'). The card still
                  credits the ORIGINAL author below; this line credits the reposter. */}
              {item.surface_type === 'repost' && item.reposter_name && (
                <View style={s.repostAttribRow}>
                  <Ionicons name="sync" size={14} color={colors.success} />
                  <Text style={s.repostAttribText} numberOfLines={1}>
                    Reposted by @{item.reposter_name}
                    {(item.reposters_more ?? 0) > 0
                      ? ` and ${item.reposters_more} ${item.reposters_more === 1 ? 'other' : 'others'}`
                      : ''}
                  </Text>
                </View>
              )}
              {/* Model badge — owner-only debug chip showing which AI rendered
                  the image. Requires BOTH the supreme-admin designation AND the
                  Settings → ADMIN toggle (so the owner shows/hides it at will).
                  Hidden when model is null (legacy posts + un-wired user dreams). */}
              {isSuperAdmin && showModelBadge && item.model && (
                <View style={s.modelBadgeWrap}>
                  <View style={s.modelBadge}>
                    <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                    <Text style={s.modelBadgeText}>{getModelDisplayName(item.model)}</Text>
                  </View>
                </View>
              )}
              {/* Repost moved to the right-side icon rail (between bookmark and
                  share). The attribution line above still credits a reposter. */}
              <View>
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
                    {/* Row 1: name + time + inline Follow/Following pill — one
                        scan line of author metadata (stacked-pill layout tried
                        2026-07-01, read as a stranded button; reverted). */}
                    <View style={s.usernameLine}>
                      <Text style={s.username}>{item.username ?? 'dreamer'}</Text>
                      <Text style={[s.timestamp, { marginLeft: 6, marginTop: 0 }]}>
                        · {timeAgo(item.created_at)}
                      </Text>
                      {showAuthorControls && (
                        <TouchableOpacity
                          style={[
                            s.followPill,
                            { marginLeft: 10 },
                            isFollowing && s.followPillFollowing,
                          ]}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            toggleFollow.mutate({
                              userId: item.user_id,
                              currentlyFollowing: isFollowing,
                              isPublic: true,
                            });
                          }}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          activeOpacity={0.7}
                        >
                          <Text style={[s.followText, isFollowing && s.followTextFollowing]}>
                            {isFollowing ? 'Following' : 'Follow'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {item.description ? (
                      <ExpandableDescription text={item.description} style={s.description} />
                    ) : null}
                  </View>
                </TouchableOpacity>

                {/* Report/Block live on long-press of the post (imageLongPress)
                    and on the author's profile — no visible "•••" on the card. */}
              </View>
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
                  style={ui.sideIcon}
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
                  <Ionicons
                    name="chatbubble-outline"
                    size={26}
                    color="#FFFFFF"
                    style={ui.sideIcon}
                  />
                  <Text
                    style={[ui.sideCount, !(item.comment_count ?? 0) && hiddenCount]}
                    numberOfLines={1}
                  >
                    {item.comment_count ?? 0}
                  </Text>
                </TouchableOpacity>
              )}
              {/* Repost — above bookmark. Hidden on own posts. No count. Stays
                  white in both states; the reposted state is signalled by a bold
                  white checkmark dropped into the icon's center (MCI check-bold —
                  Ionicons has no bold check). */}
              {canRepost && (
                <TouchableOpacity
                  style={ui.sideButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    toggleRepost.mutate({ uploadId: item.id, currentlyReposted: isReposted });
                  }}
                  activeOpacity={0.7}
                >
                  <View style={s.repostStack}>
                    <Ionicons name="sync" size={26} color="#FFFFFF" style={ui.sideIcon} />
                    {isReposted && (
                      <View style={s.repostCheck} pointerEvents="none">
                        <MaterialCommunityIcons
                          name="check-bold"
                          size={11}
                          color="#FFFFFF"
                          style={ui.sideIcon}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              {onToggleSave && (
                <TouchableOpacity style={ui.sideButton} onPress={onToggleSave} activeOpacity={0.7}>
                  <Ionicons
                    name={isSaved ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color="#FFFFFF"
                    style={ui.sideIcon}
                  />
                </TouchableOpacity>
              )}
              {/* Share is available on ALL posts, including PRIVATE dreams. The
                  shared dreambotapp.com/post/<id> link resolves via the
                  get_shared_post RPC (migration 309 — unlisted-by-UUID), so a
                  recipient with the link can view it even though it is not in
                  the public feed. (Only the owner sees a private post to share
                  it; other users can't see it to begin with.) */}
              <TouchableOpacity
                style={ui.sideButton}
                onPress={
                  onShare ??
                  (() =>
                    nav.push(
                      // The download flow used to live in its own side-rail
                      // icon next to share. Folded into the share sheet's
                      // header (2026-06-06) so the user reaches Copy + Save
                      // from the same surface; thread the image URLs through
                      // as route params so the sheet has what it needs.
                      `/sharePost?uploadId=${item.id}&username=${encodeURIComponent(item.username)}&imageUrl=${encodeURIComponent(item.image_url)}${item.image_url_hq ? `&imageUrlHq=${encodeURIComponent(item.image_url_hq)}` : ''}${item.face_swap_mode ? `&faceSwapMode=${encodeURIComponent(item.face_swap_mode)}` : ''}${isOwnPost ? '&isOwn=1' : ''}`
                    ))
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name="paper-plane-outline"
                  size={24}
                  color="#FFFFFF"
                  style={ui.sideIcon}
                />
              </TouchableOpacity>
              {onDreamLikeThis && (
                <TouchableOpacity
                  style={ui.sideButton}
                  onPress={onDreamLikeThis}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="color-wand-outline"
                    size={24}
                    color="#FFFFFF"
                    style={ui.sideIcon}
                  />
                </TouchableOpacity>
              )}
              {/* Fit toggle — flips contentFit between 'cover' (full-bleed
                  crop) and 'contain' (letterboxed, full image visible).
                  Last item in the side rail; sits below the DLT
                  button. Per-card local state; resets on FlatList recycle. */}
              <TouchableOpacity
                style={ui.sideButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFitMode((m) => (m === 'cover' ? 'contain' : 'cover'));
                }}
                activeOpacity={0.7}
                accessibilityLabel={fitMode === 'cover' ? 'Show full image' : 'Fill screen'}
              >
                <Ionicons name="scan-outline" size={24} color="#FFFFFF" style={ui.sideIcon} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>

        <PostActionSheet
          visible={actionsOpen}
          onClose={() => setActionsOpen(false)}
          bottomInset={bottomPadding}
          rows={buildPostActionRows({
            id: item.id,
            imageUrl: item.image_url,
            imageUrlHq: item.image_url_hq ?? null,
            isOwn: isOwnPost,
            faceSwapMode: item.face_swap_mode ?? null,
            onDelete,
            onDreamLikeThis,
            authorName: item.username ?? undefined,
            isBot: isBotAuthor,
            onBlock: () => toggleBlock.mutate({ userId: item.user_id, currentlyBlocked: false }),
            onToggleVisibility: showVisibilityToggle ? onTogglePosted : undefined,
            isPublic: item.is_public,
          })}
        />
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
  heartBurst: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: verticalScale(-40),
    marginLeft: -40,
  },
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
  // Repost icon + centered checkmark overlay for the reposted state.
  repostStack: { alignItems: 'center', justifyContent: 'center' },
  repostCheck: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  // Bottom scrim — covers roughly the lower third of the card, transparent
  // at the top so it doesn't dim the focal subject. Sits inside the HUD so
  // single-tap "clean image" mode hides it with the rest of the chrome.
  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: verticalScale(220),
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
  // Repost attribution line ("♻ Reposted by @x") at the top of the post info.
  repostAttribRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: verticalScale(6),
  },
  repostAttribText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '600',
    opacity: 0.92,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
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
  // textShadow is a tight 1pt drop shadow underneath the text — readable
  // against both dark and white/light bottoms of the dream image. The old
  // 16pt radius 0-offset halo was too diffuse against pale backdrops and
  // left the text floating. The 0.85-opacity black + 3pt blur gives a
  // crisp contrast line directly below each glyph without looking heavy.
  username: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  usernameLine: { flexDirection: 'row', alignItems: 'center' },
  // Inline "username  [Follow]" — Follow is a readable white chip (the lavender
  // accent washed out on bright images).
  followPill: {
    height: verticalScale(26),
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '700',
  },
  // "Following" — quieter than the accent "Follow" so it isn't noisy on a
  // bot-heavy feed where you follow everything.
  followPillFollowing: {
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  followTextFollowing: { color: 'rgba(255,255,255,0.8)' },
  description: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontScale(13),
    fontWeight: '400',
    marginTop: verticalScale(2),
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  } as TextStyle,
  timestamp: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: fontScale(12),
    fontWeight: '600',
    // Stronger shadow than the username's — the smaller, lighter timestamp needs
    // more separation to stay legible over bright/saturated renders.
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
    marginTop: verticalScale(1),
  },
});

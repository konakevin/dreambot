/**
 * FullScreenFeed — shared vertical paging feed component.
 * Used by Home, Explore, and profile album views.
 *
 * Handles: vertical paging, image prefetching, scroll tracking,
 * end-reached loading. Cards are rendered via DreamCard.
 */

import { memo, useCallback, useRef, useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Dimensions, InteractionManager, AppState, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import { supabase } from '@/lib/supabase';
import { trackDltStarted } from '@/lib/analytics';
import { DreamCard } from '@/components/DreamCard';
import { FeedCardSkeleton } from '@/components/Skeleton';
import type { DreamPostItem } from '@/components/DreamCard';
import { CommentOverlay } from '@/components/CommentOverlay';
import { useFavoriteIds } from '@/hooks/useFavoriteIds';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { useLikeIds } from '@/hooks/useLikeIds';
import { useToggleLike } from '@/hooks/useToggleLike';
import { useDeletePost } from '@/hooks/useDeletePost';
import { useAdminShowDeleteButton } from '@/lib/adminPrefs';
import { useAuthStore } from '@/store/auth';
import { LikesSheet } from '@/components/LikesSheet';
import { VerticalPager, type VerticalPagerHandle } from '@/components/VerticalPager';
import { colors } from '@/constants/theme';

const FALLBACK_HEIGHT = Dimensions.get('window').height;

interface Props {
  posts: DreamPostItem[];
  isLoading?: boolean;
  /** Pull-down-at-top to refresh. The pager owns the spinner; this just runs
   *  the refetch (and jumps to the top once it lands). */
  onRefresh?: () => void | Promise<unknown>;
  onEndReached?: () => void;
  /** Index to scroll to on mount (for album deep links) */
  initialIndex?: number;
  /** Called when the visible card changes */
  onIndexChange?: (index: number) => void;
  /** Imperative handle to control the pager externally (scrollToIndex/Offset). */
  listRef?: React.RefObject<VerticalPagerHandle | null>;
  /** Content rendered above the feed (absolute positioned overlays go in parent) */
  ListEmptyComponent?: React.ReactElement;
  /** Disable swipe-left-to-profile on cards (for album/detail views) */
  disableSwipeToProfile?: boolean;
  /** Hide tab bar padding (for detail views without a tab bar) */
  hideTabBar?: boolean;
  /** Show the eye/visibility toggle on own posts */
  showVisibilityToggle?: boolean;
  /** Callback when the visibility toggle is pressed */
  onTogglePosted?: (postId: string) => void;
  /** Called when the card HUD is toggled (single tap) */
  onHudToggle?: (visible: boolean) => void;
  /** Pass-through to DreamCard — opt-in bottom scrim for album-style views. */
  showBottomScrim?: boolean;
  /**
   * Bumpable token — when its value changes, the feed scrolls to the top
   * AND resets the internal currentIndex (so the auto-resnap on focus/resume
   * doesn't yank the user back). Used by the Instagram-style "tap active tab
   * to jump to top" gesture.
   */
  scrollToTopToken?: number;
}

/**
 * Memoized per-card wrapper (perf fix 2026-05-25). DreamCard is memo()'d, but
 * the old inline renderItem rebuilt ~10 callback closures for EVERY card on
 * every FullScreenFeed render (like / save / comment / swipe), defeating the
 * memo and re-rendering all ~7 windowed full-screen cards at once (multi-second
 * jank + the VirtualizedList "slow to update" warning).
 *
 * FeedCard receives only stable refs (react-query mutators, state setters,
 * useCallback'd handlers, module nav) + primitive per-item flags
 * (isActive / isLiked / isSaved). The per-item closures it builds live INSIDE
 * the memo boundary, so rebuilding them only re-renders THIS card. Net: a like
 * re-renders one card; a swipe re-renders two (outgoing + incoming) instead of
 * the whole window.
 */
type FeedCardProps = {
  item: DreamPostItem;
  isActive: boolean;
  isLiked: boolean;
  isSaved: boolean;
  bottomPadding: number;
  cardHeight: number;
  disableSwipeToProfile?: boolean;
  userId?: string;
  isAdmin: boolean;
  showAdminDelete: boolean;
  showVisibilityToggle?: boolean;
  toggleLike: (vars: { uploadId: string; currentlyLiked: boolean }) => void;
  toggleFavorite: (vars: { uploadId: string; currentlyFavorited: boolean }) => void;
  onComment: (post: DreamPostItem) => void;
  onLikesPress: (id: string) => void;
  onDelete: (id: string) => void;
  onAdminDelete: (id: string) => void;
  onTogglePosted?: (id: string) => void;
  onHudToggle?: (visible: boolean) => void;
  showBottomScrim?: boolean;
};

const FeedCard = memo(function FeedCard({
  item,
  isActive,
  isLiked,
  isSaved,
  bottomPadding,
  cardHeight,
  disableSwipeToProfile,
  userId,
  isAdmin,
  showAdminDelete,
  showVisibilityToggle,
  toggleLike,
  toggleFavorite,
  onComment,
  onLikesPress,
  onDelete,
  onAdminDelete,
  onTogglePosted,
  onHudToggle,
  showBottomScrim,
}: FeedCardProps) {
  const canDelete = item.user_id === userId || isAdmin;
  return (
    <DreamCard
      item={item}
      bottomPadding={bottomPadding}
      cardHeight={cardHeight}
      isLiked={isLiked}
      onLike={() => toggleLike({ uploadId: item.id, currentlyLiked: false })}
      onToggleLike={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleLike({ uploadId: item.id, currentlyLiked: isLiked });
      }}
      onComment={() => onComment(item)}
      isSaved={isSaved}
      onToggleSave={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleFavorite({ uploadId: item.id, currentlyFavorited: isSaved });
      }}
      disableSwipeToProfile={disableSwipeToProfile}
      onDelete={canDelete ? () => onDelete(item.id) : undefined}
      onAdminDeleteImmediate={isAdmin && showAdminDelete ? () => onAdminDelete(item.id) : undefined}
      onDreamLikeThis={() => {
        const params = new URLSearchParams({
          postId: item.id,
          imageUrl: item.image_url,
          username: item.username,
          userId: item.user_id,
          ...(item.ai_prompt ? { prompt: item.ai_prompt } : {}),
        });
        trackDltStarted({ source_post_id: item.id });
        nav.push(`/dreamLikeThis?${params.toString()}`);
      }}
      onLikesPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onLikesPress(item.id);
      }}
      showVisibilityToggle={!!showVisibilityToggle && item.user_id === userId}
      onTogglePosted={onTogglePosted ? () => onTogglePosted(item.id) : undefined}
      onHudToggle={onHudToggle}
      isActive={isActive}
      showBottomScrim={showBottomScrim}
    />
  );
});

export function FullScreenFeed({
  posts,
  isLoading,
  onRefresh: onRefreshProp,
  onEndReached,
  initialIndex = 0,
  onIndexChange,
  listRef,
  ListEmptyComponent,
  disableSwipeToProfile,
  hideTabBar,
  showVisibilityToggle,
  onTogglePosted,
  onHudToggle,
  scrollToTopToken,
  showBottomScrim,
}: Props) {
  const insets = useSafeAreaInsets();
  const internalPagerRef = useRef<VerticalPagerHandle>(null);
  const pagerRef = listRef ?? internalPagerRef;

  // Imperative scroll helpers used by the re-snap (focus/resume) + tap-to-top effects.
  const scrollToIndexImpl = useCallback((index: number, animated: boolean) => {
    pagerRef.current?.scrollToIndex(index, animated);
  }, []);
  const scrollToTopImpl = useCallback((animated: boolean) => {
    pagerRef.current?.scrollToOffset(0, animated);
  }, []);
  // Seed with initialIndex so the post-interaction re-snap below doesn't yank
  // to index 0 on first mount before the pager reports its first active index.
  const currentIndex = useRef(initialIndex);
  const impressionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedImpressions = useRef<Set<string>>(new Set());
  const isFocused = useIsFocused();

  // Id of the currently-active card. Passed down so each card knows if it's
  // active (item.id === activeId) and resets its HUD when it becomes active —
  // including when the pager re-mounts a card back into its window. A per-card
  // boolean (vs the old global token) means a swipe only re-renders the two
  // cards involved (outgoing + incoming), not every windowed card.
  const [activeId, setActiveId] = useState<string | null>(null);

  // Measure the actual container height — this is the true page size
  const [containerHeight, setContainerHeight] = useState(FALLBACK_HEIGHT);
  const pageHeight = containerHeight > 0 ? containerHeight : FALLBACK_HEIGHT;

  const handleLayout = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      // Round: pageHeight is the per-page size the pager positions cards by;
      // fractional values would accumulate drift across pages.
      const h = Math.round(e.nativeEvent.layout.height);
      if (h > 0 && Math.abs(h - containerHeight) > 1) {
        setContainerHeight(h);
      }
    },
    [containerHeight]
  );

  // Re-snap scroll position when posts SHRINK (delete, refetch) or screen regains
  // focus. Waits for InteractionManager so the navigation transition + onLayout
  // have both completed — otherwise pageHeight may be stale and the card shows off.
  //
  // CRITICAL: skip the re-snap on pure pagination GROW. The pager already holds
  // its position when items are appended at the end; re-snapping on a
  // fetchNextPage append would "pop" the view mid-swipe. So fire only on shrink
  // or focus, never on data-grow.
  const prevLength = useRef(posts.length);
  useEffect(() => {
    if (!isFocused || posts.length === 0) {
      prevLength.current = posts.length;
      return;
    }
    const shrank = posts.length < prevLength.current;
    prevLength.current = posts.length;
    if (!shrank) return; // grew = pagination append, no re-snap needed
    const handle = InteractionManager.runAfterInteractions(() => {
      const idx = currentIndex.current;
      if (idx >= 0 && idx < posts.length) {
        scrollToIndexImpl(idx, false);
      }
    });
    return () => handle.cancel();
  }, [isFocused, posts.length, pageHeight, scrollToIndexImpl]);

  // Also re-snap when the APP returns from background. useIsFocused only tracks
  // navigation-stack focus, not app foreground/background — so on minimize+reopen,
  // isFocused doesn't change but the layout often shifts (safe-area inset recalc,
  // status bar visibility, etc.) and the feed ends up off by ~50-100px. The
  // user sees the post shifted down until they tap something that triggers a
  // navigation event. AppState listener catches the resume and re-snaps.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active' && posts.length > 0) {
        InteractionManager.runAfterInteractions(() => {
          const idx = currentIndex.current;
          if (idx >= 0 && idx < posts.length) {
            scrollToIndexImpl(idx, false);
          }
        });
      }
    });
    return () => sub.remove();
  }, [posts.length, scrollToIndexImpl]);

  // Clean up impression timer on unmount
  useEffect(() => {
    return () => {
      if (impressionTimer.current) clearTimeout(impressionTimer.current);
    };
  }, []);

  // Tap-active-tab-to-top gesture (Instagram-style). When the parent bumps
  // scrollToTopToken, jump to index 0 AND reset currentIndex so the next
  // focus/resume re-snap doesn't yank us back to where the user was scrolled.
  const skipFirstScrollToTop = useRef(true);
  useEffect(() => {
    if (skipFirstScrollToTop.current) {
      skipFirstScrollToTop.current = false;
      return;
    }
    currentIndex.current = 0;
    scrollToTopImpl(true);
  }, [scrollToTopToken, scrollToTopImpl]);

  // Pull-to-refresh: the pager owns the spinner, so we just run the refetch
  // and jump back to the top once it lands.
  const handleRefresh = useCallback(async () => {
    if (!onRefreshProp) return;
    await onRefreshProp();
    setTimeout(() => scrollToTopImpl(true), 300);
  }, [onRefreshProp, scrollToTopImpl]);

  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const [showAdminDelete] = useAdminShowDeleteButton();
  const { data: favoriteIds = new Set<string>() } = useFavoriteIds();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { data: likeIds = new Set<string>() } = useLikeIds();
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: deletePost } = useDeletePost();
  const [likesPostId, setLikesPostId] = useState<string | null>(null);
  const [commentPost, setCommentPost] = useState<DreamPostItem | null>(null);

  const handleDelete = useCallback(
    (uploadId: string) => {
      const idx = currentIndex.current;
      const totalBefore = posts.length;

      deletePost(uploadId, {
        onSuccess: () => {
          if (totalBefore <= 1) {
            if (router.canGoBack()) router.back();
          } else {
            const newIdx = idx >= totalBefore - 1 ? Math.max(0, idx - 1) : idx;
            currentIndex.current = newIdx;
          }
        },
      });
    },
    [deletePost, posts.length]
  );

  // Shared "a new card became active" logic, called by the VerticalPager's
  // onActiveIndexChange.
  const handleActiveIndex = useCallback(
    (idx: number) => {
      {
        currentIndex.current = idx;
        onIndexChange?.(idx);
        // Reset HUD to visible when scrolling to a new card
        onHudToggle?.(true);
        // Mark the new card active. Its `isActive` flips true (and the prior
        // card's flips false), refiring each one's in-card HUD-reset effect —
        // only those two cards re-render, not the whole window.
        setActiveId(posts[idx]?.id ?? null);
        // Prefetch next 3 images
        const upcoming = posts.slice(idx + 1, idx + 4);
        if (upcoming.length > 0) {
          ExpoImage.prefetch(upcoming.map((p) => p.image_url_display ?? p.image_url));
        }
        // Record impression after 1 second of visibility. Defensive guard:
        // skip non-UUID ids (e.g., synthetic `temp-{ts}` ids that some
        // upstream code paths used as fallbacks). Postgres rejects those
        // with "invalid input syntax for type uuid" and the toast surfaces
        // for every visible card, polluting the console. Real upload ids
        // are always UUIDs.
        if (impressionTimer.current) clearTimeout(impressionTimer.current);
        const post = posts[idx];
        const isUuid = post && /^[0-9a-f-]{36}$/i.test(post.id);
        if (post && user && isUuid && !recordedImpressions.current.has(post.id)) {
          impressionTimer.current = setTimeout(() => {
            recordedImpressions.current.add(post.id);
            supabase
              .rpc('record_impression', {
                p_user_id: user.id,
                p_upload_id: post.id,
              })
              .then(({ error }) => {
                if (error && __DEV__) {
                  console.error('[FullScreenFeed] record_impression failed:', error.message);
                }
              });
          }, 1000);
        }
      }
    },
    [posts, onIndexChange, user, onHudToggle]
  );

  const bottomPadding = hideTabBar ? 16 + insets.bottom : 60 + insets.bottom;

  // Stable renderItem. Per-item closures live inside the memoized FeedCard, so
  // only cards whose own flags (isActive / isLiked / isSaved) changed re-render.
  const renderItem = useCallback(
    ({ item }: { item: DreamPostItem }) => (
      <FeedCard
        item={item}
        isActive={item.id === activeId}
        isLiked={likeIds.has(item.id)}
        isSaved={favoriteIds.has(item.id)}
        bottomPadding={bottomPadding}
        cardHeight={pageHeight}
        disableSwipeToProfile={disableSwipeToProfile}
        userId={user?.id}
        isAdmin={isAdmin}
        showAdminDelete={showAdminDelete}
        showVisibilityToggle={showVisibilityToggle}
        toggleLike={toggleLike}
        toggleFavorite={toggleFavorite}
        onComment={setCommentPost}
        onLikesPress={setLikesPostId}
        onDelete={handleDelete}
        onAdminDelete={deletePost}
        onTogglePosted={onTogglePosted}
        onHudToggle={onHudToggle}
        showBottomScrim={showBottomScrim}
      />
    ),
    [
      activeId,
      likeIds,
      favoriteIds,
      bottomPadding,
      pageHeight,
      disableSwipeToProfile,
      user?.id,
      isAdmin,
      showAdminDelete,
      showVisibilityToggle,
      toggleLike,
      toggleFavorite,
      handleDelete,
      deletePost,
      onTogglePosted,
      onHudToggle,
      showBottomScrim,
    ]
  );

  if (isLoading) {
    return <FeedCardSkeleton />;
  }

  if (posts.length === 0 && ListEmptyComponent) {
    return ListEmptyComponent;
  }

  return (
    <>
      <View style={{ flex: 1 }} onLayout={handleLayout}>
        <VerticalPager
          ref={pagerRef}
          data={posts}
          keyExtractor={(item) => item.id}
          pageHeight={pageHeight}
          initialIndex={initialIndex}
          renderItem={renderItem}
          onActiveIndexChange={handleActiveIndex}
          onEndReached={onEndReached}
          onEndReachedThreshold={2}
          onRefresh={onRefreshProp ? handleRefresh : undefined}
          refreshTint={colors.textPrimary}
        />
      </View>
      {commentPost && (
        <CommentOverlay
          post={commentPost}
          onClose={() => setCommentPost(null)}
          hideTabBar={hideTabBar}
        />
      )}
      <LikesSheet
        uploadId={likesPostId}
        visible={!!likesPostId}
        onClose={() => setLikesPostId(null)}
      />
    </>
  );
}

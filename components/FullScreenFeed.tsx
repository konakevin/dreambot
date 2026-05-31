/**
 * FullScreenFeed — shared vertical paging feed component.
 * Used by Home, Explore, and profile album views.
 *
 * Handles: vertical paging, image prefetching, scroll tracking,
 * end-reached loading. Cards are rendered via DreamCard.
 */

import { memo, useCallback, useRef, useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Dimensions, RefreshControl, InteractionManager, AppState } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
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
import { colors } from '@/constants/theme';

const FALLBACK_HEIGHT = Dimensions.get('window').height;

interface Props {
  posts: DreamPostItem[];
  isLoading?: boolean;
  /**
   * Pull-to-refresh handler. The spinner is owned internally and only shows
   * while the user-initiated pull resolves — programmatic refetches (e.g.,
   * from AppState resume invalidation) never trigger the spinner. Decoupling
   * RefreshControl from `isRefetching` is what fixes the post-background
   * "scrolled down ~60px until tap" bug: iOS only auto-resets contentOffset
   * after a gesture-driven refresh, so flipping `refreshing` programmatically
   * left the contentInset shift in place.
   */
  onRefresh?: () => void | Promise<unknown>;
  onEndReached?: () => void;
  /** Index to scroll to on mount (for album deep links) */
  initialIndex?: number;
  /** Called when the visible card changes */
  onIndexChange?: (index: number) => void;
  /** Ref to control the FlatList externally */
  listRef?: React.RefObject<FlatList>;
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
      onFamily={() => {
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
}: Props) {
  const insets = useSafeAreaInsets();
  const internalRef = useRef<FlatList>(null);
  const ref = listRef ?? internalRef;
  // Seed with initialIndex so the post-interaction re-snap below doesn't yank
  // to index 0 on first mount when image-cache cold delays onViewableItemsChanged
  // past the navigation transition. Bug: tapping a non-first album tile loaded
  // the latest post on the first navigation; subsequent navigations worked because
  // image cache was warm and the viewability event fired in time.
  const currentIndex = useRef(initialIndex);
  const impressionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedImpressions = useRef<Set<string>>(new Set());
  const isFocused = useIsFocused();

  // Id of the currently-viewable card. Passed down so each card knows if it's
  // active (item.id === activeId) and resets its HUD when it becomes active —
  // including when FlatList recycles a previously-tapped instance back into
  // view. A per-card boolean (vs the old global token) means a swipe only
  // re-renders the two cards involved (outgoing + incoming), not every
  // windowed card. (Perf fix 2026-05-25.)
  const [activeId, setActiveId] = useState<string | null>(null);

  // Measure the actual container height — this is the true page size
  const [containerHeight, setContainerHeight] = useState(FALLBACK_HEIGHT);
  const pageHeight = containerHeight > 0 ? containerHeight : FALLBACK_HEIGHT;

  const handleLayout = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0 && Math.abs(h - containerHeight) > 1) {
        setContainerHeight(h);
      }
    },
    [containerHeight]
  );

  // Re-snap scroll position when posts change (delete, refetch) or screen regains focus.
  // Uses scrollToIndex (which calls getItemLayout for the exact offset) instead of manual
  // offset math. Waits for InteractionManager so the navigation transition and onLayout
  // have both completed — otherwise pageHeight may be stale and the card shows ~100px off.
  //
  // CRITICAL: skip the re-snap on pure pagination grow. FlatList already preserves
  // visible position when items are appended at the end; calling scrollToIndex during
  // a fetchNextPage append fires AFTER the user's swipe via runAfterInteractions and
  // snaps to a stale currentIndex.current (onViewableItemsChanged hadn't fired yet),
  // visually "popping" the view mid-swipe. This regression surfaced after commit
  // 8f77f7b0 ("Fix premature feed stalls") made pagination actually advance —
  // before that fix, fetchNextPage usually stalled so posts.length didn't change
  // and this effect didn't fire. Same family as the May 2026 af4cb949 fix:
  // render-side reordering / re-snap that fires on data-grow when it should only
  // fire on data-shrink or focus.
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
        ref.current?.scrollToIndex({ index: idx, animated: false });
      }
    });
    return () => handle.cancel();
  }, [isFocused, posts.length, pageHeight, ref]);

  // Also re-snap when the APP returns from background. useIsFocused only tracks
  // navigation-stack focus, not app foreground/background — so on minimize+reopen,
  // isFocused doesn't change but the layout often shifts (safe-area inset recalc,
  // status bar visibility, etc.) and the FlatList ends up off by ~50-100px. The
  // user sees the post shifted down until they tap something that triggers a
  // navigation event. AppState listener catches the resume and re-snaps.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active' && posts.length > 0) {
        InteractionManager.runAfterInteractions(() => {
          const idx = currentIndex.current;
          if (idx >= 0 && idx < posts.length) {
            ref.current?.scrollToIndex({ index: idx, animated: false });
          }
        });
      }
    });
    return () => sub.remove();
  }, [posts.length, ref]);

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
    ref.current?.scrollToOffset({ offset: 0, animated: true });
  }, [scrollToTopToken, ref]);

  // Spinner state owned here, not driven from parent's `isRefetching`. iOS only
  // auto-resets contentOffset after a gesture-driven RefreshControl cycle —
  // flipping `refreshing` programmatically (e.g., from AppState resume
  // invalidation) leaves the contentInset shift in place, which is the
  // post-background "scrolled down ~60px until tap" bug.
  const [isPulling, setIsPulling] = useState(false);
  const handleRefresh = useCallback(async () => {
    if (!onRefreshProp) return;
    setIsPulling(true);
    try {
      await onRefreshProp();
    } finally {
      setIsPulling(false);
    }
    setTimeout(() => ref.current?.scrollToOffset({ offset: 0, animated: true }), 300);
  }, [onRefreshProp, ref]);

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

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const idx = viewableItems[0].index;
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
      <FlatList
        ref={ref}
        data={posts}
        keyExtractor={(item) => item.id}
        onLayout={handleLayout}
        pagingEnabled
        disableIntervalMomentum
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        windowSize={7}
        maxToRenderPerBatch={5}
        initialNumToRender={3}
        // removeClippedSubviews was set to true on 2026-04-08 but aggressive
        // cell recycling caused the "duplicate post every ~10 scrolls" visual
        // glitch. Flipping back to false. If the feed starts flickering again
        // in-practice, re-enable and investigate the underlying issue instead.
        removeClippedSubviews={false}
        initialScrollIndex={initialIndex > 0 ? initialIndex : undefined}
        getItemLayout={(_, index) => ({
          length: pageHeight,
          offset: pageHeight * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        refreshControl={
          onRefreshProp ? (
            <RefreshControl
              refreshing={isPulling}
              onRefresh={handleRefresh}
              tintColor={colors.textPrimary}
            />
          ) : undefined
        }
        renderItem={renderItem}
      />
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

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
import { DLT_ENABLED } from '@/constants/features';
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
import { useAlbumStore } from '@/store/album';
import { useCommentDrafts } from '@/store/commentDrafts';
import { LikesOverlay } from '@/components/LikesOverlay';
import { VerticalPager, type VerticalPagerHandle } from '@/components/VerticalPager';
import type { GestureType } from 'react-native-gesture-handler';
import { colors } from '@/constants/theme';

const FALLBACK_HEIGHT = Dimensions.get('window').height;

interface Props {
  posts: DreamPostItem[];
  isLoading?: boolean;
  /** Pull-down-at-top to refresh. The pager owns the spinner; this just runs
   *  the refetch (and jumps to the top once it lands). */
  /** Refresh the feed. `deferSwap` (home re-tap path): prefetch only, then
   *  resolve with a commit() callback that performs the visible swap — the
   *  pager runs it behind a one-beat mask so the reshuffle is a single clean
   *  cut. Without it (finger pull), the swap happens before resolve. */
  onRefresh?: (opts?: { deferSwap?: boolean }) => void | Promise<unknown>;
  onEndReached?: () => void;
  /** Index to scroll to on mount (for album deep links) */
  initialIndex?: number;
  /** The id of the post to open on. Identity anchor that survives a post-mount
   *  `posts` reorder (e.g. a new dream prepended after opening) — a numeric
   *  initialIndex goes stale the moment the array shifts, landing on the wrong
   *  post. When set, the pager seeks to this id once it first appears. */
  initialId?: string;
  /** When set, auto-open the comment thread on this post once it's loaded —
   *  used by comment-notification deep links (Kevin 2026-07-06). One-shot. */
  openCommentsForPostId?: string;
  /** Called when the visible card changes */
  onIndexChange?: (index: number) => void;
  /** Imperative handle to control the pager externally (scrollToIndex/Offset). */
  listRef?: React.RefObject<VerticalPagerHandle | null>;
  /** Receives the pager's Pan gesture (for a screen swipe-back to compose with). */
  panRef?: React.MutableRefObject<GestureType | undefined>;
  /** A screen swipe-back gesture the pager Pan may recognize simultaneously with. */
  simultaneousRef?: React.RefObject<GestureType | undefined>;
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
  onLikesPress: (post: DreamPostItem) => void;
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
      // DLT is hidden from the UI for now (DLT_ENABLED=false): passing undefined
      // here removes BOTH the card's color-wand button and the long-press
      // "Dream like this" item (both gate on this callback). Code/route intact.
      onDreamLikeThis={
        DLT_ENABLED
          ? () => {
              const params = new URLSearchParams({
                postId: item.id,
                imageUrl: item.image_url,
                username: item.username,
                userId: item.user_id,
                ...(item.ai_prompt ? { prompt: item.ai_prompt } : {}),
              });
              trackDltStarted({ source_post_id: item.id });
              nav.push(`/dreamLikeThis?${params.toString()}`);
            }
          : undefined
      }
      onLikesPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onLikesPress(item);
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
  initialId,
  openCommentsForPostId,
  onIndexChange,
  listRef,
  panRef,
  simultaneousRef,
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
  const scrollToIndexImpl = useCallback(
    (index: number, animated: boolean) => {
      pagerRef.current?.scrollToIndex(index, animated);
    },
    [pagerRef]
  );
  const scrollToTopImpl = useCallback(
    (animated: boolean) => {
      pagerRef.current?.scrollToOffset(0, animated);
    },
    [pagerRef]
  );
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

  // Initial-target seek (2026-07-06). The numeric initialIndex is computed by the
  // parent from `posts` at first render; but `posts` can reorder RIGHT AFTER
  // mount (opening a dream just after creating one: the live album query prepends
  // the new post, so every index shifts and the pager — positioned by number —
  // lands on the wrong post, usually index 0). VerticalPager's own id-anchoring
  // can't help because it seeds its anchor from that same wrong index. So once
  // the intended post (initialId) first appears in `posts`, seek to it ONCE by
  // identity. Fires at mount (the tapped post is normally in the stashed grid
  // snapshot immediately) and re-corrects if the array was reordered first;
  // after this one placement, VerticalPager's key-anchor follows the user.
  const anchorCorrected = useRef(false);
  useEffect(() => {
    if (anchorCorrected.current || !initialId || posts.length === 0) return;
    const idx = posts.findIndex((p) => p.id === initialId);
    if (idx < 0) return; // target not loaded into `posts` yet — wait for it
    anchorCorrected.current = true;
    if (idx !== currentIndex.current) {
      currentIndex.current = idx;
      setActiveId(initialId);
      scrollToIndexImpl(idx, false);
    }
  }, [posts, initialId, scrollToIndexImpl]);

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
  // Also dismiss the transient overlays (comment overlay + likes sheet, and
  // with them any comment action sheet nested inside) — a Home re-tap
  // refreshed the feed UNDER a still-open sheet (Kevin 2026-07-05: long-press
  // a comment, tap Home, feed resets behind the orphaned sheet).
  const skipFirstScrollToTop = useRef(true);
  // Latest-ref so the effect below keys ONLY on the token — onRefreshProp is
  // often an inline arrow (new identity per parent render) and putting it in
  // the deps would re-fire the refresh on every re-render.
  const onRefreshPropRef = useRef(onRefreshProp);
  onRefreshPropRef.current = onRefreshProp;
  useEffect(() => {
    if (skipFirstScrollToTop.current) {
      skipFirstScrollToTop.current = false;
      return;
    }
    setCommentPost(null);
    setLikesPost(null);
    // Both overlays mask the host screen's chrome while open — restore it, or
    // a re-tap dismissal strands the pills hidden and untouchable.
    onHudToggle?.(true);
    // Re-tap = QUIET new-seed refresh in two phases (2026-07-21):
    //   1. PREFETCH — nothing on screen changes. The current feed stays fully
    //      visible + interactive; the tab-bar home icon carries the loading
    //      signal (feedStore.homeFeedRefreshing, set by the parent's onRefresh).
    //      deferSwap makes the parent hold the seed swap and hand it back as a
    //      commit() callback, so no data changes under the visible pager.
    //   2. SWAP — commit() flips the seed AND bumps the parent's reshuffle
    //      epoch, which is part of this component's `key`: React REMOUNTS the
    //      pager with the new posts already at the top. One frame, old feed →
    //      new feed — the exact mechanism a tab switch uses, which is why tab
    //      switches never flash. This replaced two generations of masking (a
    //      cover for the whole network wait, then a 3-frame swap mask) that
    //      both read as a black flash (Kevin 2026-07-21). No jump-to-top and
    //      no index reset needed: the fresh mount starts at 0.
    if (onRefreshPropRef.current) {
      Promise.resolve(onRefreshPropRef.current({ deferSwap: true }))
        .then((commit) => {
          if (typeof commit === 'function') (commit as () => void)();
        })
        .catch(() => {
          // Prefetch failed — leave the current feed exactly as it is.
        });
    } else {
      currentIndex.current = 0;
      scrollToTopImpl(true);
    }
  }, [scrollToTopToken, scrollToTopImpl, onHudToggle]);

  // Pull-to-refresh: the pager owns the whole lifecycle — spinner, parked
  // strip, and settling onto the NEW top post when the promise resolves
  // (it drops its key-anchor so the reshuffle is actually visible). No
  // scroll-to-top here; a second scroll would fight the pager's own reset.
  const handleRefresh = useCallback(async () => {
    if (!onRefreshProp) return;
    await onRefreshProp();
  }, [onRefreshProp]);

  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const [showAdminDelete] = useAdminShowDeleteButton();
  const { data: favoriteIds = new Set<string>() } = useFavoriteIds();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { data: likeIds = new Set<string>() } = useLikeIds();
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: deletePost } = useDeletePost();
  const [likesPost, setLikesPost] = useState<DreamPostItem | null>(null);
  const [commentPost, setCommentPost] = useState<DreamPostItem | null>(null);

  // Comment-notification deep link: auto-open the comment thread on the target
  // post once it's loaded into `posts`. One-shot (the ref guard) so it doesn't
  // reopen after the user closes it or as posts paginate.
  const autoOpenedComments = useRef(false);
  useEffect(() => {
    if (autoOpenedComments.current || !openCommentsForPostId) return;
    const target = posts.find((p) => p.id === openCommentsForPostId);
    if (!target) return; // wait until the post is loaded
    autoOpenedComments.current = true;
    setCommentPost(target);
  }, [posts, openCommentsForPostId]);

  // Admin instant-delete is a hard delete (row + storage files) with no undo.
  // No confirm on purpose (Kevin 2026-07-01) — he bulk-prunes bot test renders
  // from the feed and the dialog was friction on every tap.
  const handleAdminDelete = useCallback(
    (uploadId: string) => {
      deletePost(uploadId);
    },
    [deletePost]
  );

  const handleDelete = useCallback(
    (uploadId: string) => {
      const idx = currentIndex.current;
      const totalBefore = posts.length;

      deletePost(uploadId, {
        onSuccess: () => {
          if (totalBefore <= 1) {
            // Deleted the last (or only) item in this view — leave the screen.
            // Use safeBack, NOT a bare router.back(): at a stack root (certain
            // deep-link / notification timings) a bare back is a NO-OP, and with
            // native gestures disabled on photo/[id] that strands the user with a
            // dead back button + dead swipe (the reported inbox-freeze). safeBack
            // escapes to home instead of dead-ending.
            if (__DEV__) {
              const a = useAlbumStore.getState();
              console.log('[FullScreenFeed] delete→back', {
                canGoBack: router.canGoBack(),
                albumIds: a.ids,
                albumSource: a.albumSource?.type ?? null,
                currentPostId: a.currentPostId,
              });
            }
            nav.safeBack();
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
        // Swiping to a new card discards any WIP comment draft on the cards you
        // left (drafts persist only while you're on the same card).
        useCommentDrafts.getState().clearExcept(posts[idx]?.id ?? null);
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
                  // Impression tracking is best-effort. A transient transport
                  // failure ("Network request failed") is environmental noise, not
                  // a bug — warn so it doesn't pop the red LogBox overlay mid-test.
                  // A REAL RPC error (RLS/SQL/missing-fn) still logs loudly.
                  const isNetwork = /network request failed/i.test(error.message ?? '');
                  const log = isNetwork ? console.warn : console.error;
                  log('[FullScreenFeed] record_impression failed:', error.message);
                }
              });
          }, 1000);
        }
      }
    },
    [posts, onIndexChange, user, onHudToggle]
  );

  // Fire the shared active-card path ONCE for the INITIAL card. The pager only
  // emits onActiveIndexChange when the index CHANGES — the landing card at
  // mount never fired it, so the post at the top of every launch/reshuffle
  // never recorded an impression and thus fully ESCAPED the mig-388
  // seen-penalty: the exact posts pinning the top were the ones the penalty
  // could never touch ("same exact post at the top regardless of refreshes",
  // Kevin 2026-07-21). The 1s dwell timer + per-mount dedup inside still
  // apply, so a quick bounce away doesn't count as a view.
  const initialActiveFired = useRef(false);
  useEffect(() => {
    if (initialActiveFired.current || posts.length === 0) return;
    initialActiveFired.current = true;
    handleActiveIndex(currentIndex.current);
  }, [posts, handleActiveIndex]);

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
        onComment={(p) => {
          setCommentPost(p);
          // Mask screen chrome (home pills) while the comment view owns the
          // screen — hidden HUD is also non-interactive.
          onHudToggle?.(false);
        }}
        onLikesPress={(p) => {
          setLikesPost(p);
          // Same chrome-masking as comments: the host screen's pill overlay
          // (home tabs / bot pills) draws ABOVE this subtree and would cover
          // the overlay header. Hidden HUD is faded AND non-interactive.
          onHudToggle?.(false);
        }}
        onDelete={handleDelete}
        onAdminDelete={handleAdminDelete}
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
      handleAdminDelete,
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
          // Prefetch the next page a few cards early so a fast swiper doesn't
          // reach the last loaded card (and the edge rubber-band) before the
          // next page lands.
          onEndReachedThreshold={5}
          // Album/detail views disable swipe-left-to-profile, so nothing
          // horizontal needs the touch — drop the failOffsetX guard so a fast
          // up-swipe's thumb-arc drift can never fail the scroll.
          horizontalFailOffset={disableSwipeToProfile ? null : 16}
          panRef={panRef}
          simultaneousRef={simultaneousRef}
          onRefresh={onRefreshProp ? handleRefresh : undefined}
          // Standard light-gray pull spinner, uniform with the native
          // RefreshControl spinners on the profile / explore grids (Kevin
          // 2026-07-11). Was colors.textPrimary (white) + a gradient swirl.
          refreshTint={colors.textSecondary}
        />
      </View>
      {commentPost && (
        /* Inline overlay ON PURPOSE (not a Modal): profile pushes from
           comment rows must cover it and return to the thread on back — a
           Modal would sit above the nav stack and swallow those pushes. The
           screen chrome problem (home's Following/Explore pills floating
           above + staying tappable, Kevin 2026-07-06) is solved via the HUD
           channel: hidden HUD is faded out AND non-interactive
           (pointerEvents none in the host's overlayStyle). */
        <CommentOverlay
          post={commentPost}
          onClose={() => {
            setCommentPost(null);
            onHudToggle?.(true);
          }}
          hideTabBar={hideTabBar}
        />
      )}
      {likesPost && (
        <LikesOverlay
          post={likesPost}
          onClose={() => {
            setLikesPost(null);
            onHudToggle?.(true);
          }}
        />
      )}
    </>
  );
}

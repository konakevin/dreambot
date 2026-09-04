import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFavoritePosts } from '@/hooks/useFavoritePosts';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { useUserReposts } from '@/hooks/useUserReposts';
import { usePublicProfilePosts, loadPublicProfilePostsUntil } from '@/hooks/usePublicProfilePosts';
import { useHashtagPosts } from '@/hooks/useHashtagPosts';
import { useShadowPosts } from '@/hooks/useShadowPosts';
import { useMyDreams } from '@/hooks/useMyDreams';
import { useAuthStore } from '@/store/auth';
import { PostTile } from '@/components/PostTile';
import { PendingDreamTile } from '@/components/PendingDreamTile';
import type { InFlightDream } from '@/hooks/useInFlightDreams';
import { useAlbumStore } from '@/store/album';
import { useRenderDockStore, FINISHED_RING_TTL_MS } from '@/store/renderDock';
import { useDreamsSeenStore } from '@/store/dreamsSeen';
import { isStaleInFlight } from '@/lib/dockItems';
import { GridSkeleton } from '@/components/Skeleton';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { NUM_COLUMNS, TILE_GAP, ROW_HEIGHT } from '@/constants/grid';
import { minRefreshHold } from '@/lib/minRefresh';
import { useRefreshGap } from '@/hooks/useRefreshGap';
import type { DreamPostItem } from '@/components/DreamCard';
import type { DreamsFilter } from '@/hooks/useMyDreams';

export type PostGridSource =
  | { type: 'own' }
  | { type: 'saved' }
  | { type: 'liked' }
  | { type: 'dreams'; dreamsFilter?: DreamsFilter }
  | { type: 'reposts'; userId: string }
  | { type: 'user'; userId: string }
  | { type: 'hashtag'; tag: string };

/** A grid cell is either a finished post or a "cooking" pending-dream slot woven
 *  in at the top (Dreams tab only). The `pending` discriminator narrows them.
 *  `finished` is set for the brief completion beat — the same tile flips from an
 *  active ring to one that fills to 100% + a check before the real image reveals. */
type PendingSlot = { pending: InFlightDream; finished?: 'ready' | 'failed' };
type GridItem = DreamPostItem | PendingSlot;
const isPending = (item: GridItem): item is PendingSlot => 'pending' in item;

/**
 * Does the stored album's source match THIS grid's source? The "return to your
 * place" anchor (currentPostId) is only valid for the grid it was set from —
 * PostTile stamps `albumSource` = the grid's source on tap. A currentPostId left
 * by a notification/inbox open (which set albumSource=null) or by a DIFFERENT
 * grid must never light this grid's badge / auto-scroll (the leak audited
 * 2026-07-26). For user/hashtag/reposts the id must match too; own/saved/
 * liked/dreams are singletons so the type alone identifies the grid.
 */
function sameSource(a: PostGridSource | null, b: PostGridSource): boolean {
  if (!a || a.type !== b.type) return false;
  if (a.type === 'user' && b.type === 'user') return a.userId === b.userId;
  if (a.type === 'reposts' && b.type === 'reposts') return a.userId === b.userId;
  if (a.type === 'hashtag' && b.type === 'hashtag') return a.tag === b.tag;
  return true; // own / saved / dreams — one grid per app, type match is enough
}

interface PostGridProps {
  source: PostGridSource;
  isOwn?: boolean;
  /** Awaited alongside the grid's own invalidation on pull-to-refresh — the
   *  profile passes its header refetch here so a pull refreshes the WHOLE
   *  screen's data (counts/bio/avatar), not just the grid (2026-07-09). */
  onRefreshExtra?: () => Promise<unknown>;
  emptyText?: string;
  ListHeaderComponent?: React.ReactElement;
  highlightPostId?: string;
  scrollToTopToken?: number;
  showPrivateBadge?: boolean;
  /**
   * Fired with the current contentOffset.y on every scroll event. Used by
   * profile screens to reveal a compact sticky top bar once the user
   * scrolls past the avatar block. Throttled via the FlatList's
   * scrollEventThrottle, not here — the callback runs whenever a frame
   * fires.
   */
  onScrollProgress?: (y: number) => void;
  /** Multi-select wiring (bulk delete, 2026-07-10). Provided only by grids that
   *  support it (the owner's Dreams/Posts/Saved/Reposts). PostGrid flattens this
   *  into per-tile primitive props (selActive/selSelected/…) so PostTile's memo
   *  holds. Reference-stable (memoize it in the caller). */
  selection?: {
    active: boolean;
    selectedIds: ReadonlySet<string>;
    onToggle: (id: string) => void;
    onEnter: (id: string) => void;
  };
  /** Extra bottom padding beyond the tab-bar clearance — the profile tab passes
   *  the render-dock height so the last row clears the dock. Omitted (0) on the
   *  pushed user-profile modal, where no dock is visible. */
  extraBottomInset?: number;
  /** In-flight ("cooking") dreams woven into the top grid cells — passed only by
   *  the own Dreams tab. Each becomes a PendingDreamTile that flows with the
   *  finished tiles and is replaced by the finished tile on completion. */
  pendingDreams?: InFlightDream[];
  /** Author (username/avatar) for dark-launch SHADOW tiles on a `user` grid. When
   *  provided AND the viewer is the supreme admin, this bot's hidden shadow
   *  renders are prepended to the grid (SHADOW-badged, admin-only). The pushed
   *  user-profile screen passes the bot's profile here. See BOT_DARK_LAUNCH_PLAN.md. */
  shadowAuthor?: { username: string; avatar_url: string | null };
}

export function PostGrid({
  source,
  isOwn = false,
  emptyText = 'No posts yet',
  ListHeaderComponent,
  highlightPostId,
  scrollToTopToken,
  showPrivateBadge = false,
  onScrollProgress,
  onRefreshExtra,
  selection,
  extraBottomInset = 0,
  pendingDreams = [],
  shadowAuthor,
}: PostGridProps) {
  const listRef = useRef<FlashListRef<GridItem>>(null);
  // Selection order (1-based) from the selected-ids Set's insertion order —
  // drives the numbered badges (see renderItem). Rebuilt per toggle (each
  // toggle produces a fresh Set).
  const selectionOrder = useMemo(() => {
    const m = new Map<string, number>();
    if (selection) {
      let i = 1;
      for (const id of selection.selectedIds) m.set(id, i++);
    }
    return m;
  }, [selection]);
  const [headerHeight, setHeaderHeight] = useState(0);
  // Mirror of headerHeight readable inside the onScroll callback without making
  // it a dependency (keeps the callback identity stable).
  const headerHeightRef = useRef(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      onScrollProgress?.(e.nativeEvent.contentOffset.y);
    },
    [onScrollProgress]
  );

  useEffect(() => {
    if (scrollToTopToken && scrollToTopToken > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [scrollToTopToken]);

  const isOwn_ = source.type === 'own';
  const isSaved = source.type === 'saved';
  const isLiked = source.type === 'liked';
  const isDreams = source.type === 'dreams';
  const isUser = source.type === 'user';
  const isReposts = source.type === 'reposts';
  const isHashtag = source.type === 'hashtag';
  const userId = isUser ? source.userId : isReposts ? source.userId : '';
  const hashtag = source.type === 'hashtag' ? source.tag : '';

  const dreamsFilter = source.type === 'dreams' ? (source.dreamsFilter ?? 'all') : 'all';
  // Keep the owner's Posts + Saved grids ENABLED across ALL of their own-profile
  // tabs, not only when that tab is the active one. A disabled (`enabled:false`)
  // query cannot be refetched by invalidateQueries — not even refetchType:'all'
  // — so gating these on `isOwn_`/`isSaved` meant a post/visibility mutation
  // fired from another tab (or the viewer) left them stale until a hard reload
  // (the "albums don't live-update" bug, 2026-07-11). Enabling them across the
  // own-profile tabs makes them inactive-but-enabled, which refetchType:'all'
  // DOES refresh. Still disabled on other users' profiles + hashtag views (no
  // waste there); `my-dreams` is already always-enabled for the same reason.
  const isOwnProfile = isOwn_ || isSaved || isLiked || isDreams || isReposts;
  const ownQuery = useUserPosts(isOwnProfile);
  const savedQuery = useFavoritePosts(isOwnProfile);
  const likedQuery = useLikedPosts(isOwnProfile);
  const userQuery = usePublicProfilePosts(userId, isUser);
  const dreamsQuery = useMyDreams(dreamsFilter);
  const repostsQuery = useUserReposts(userId, isReposts);
  const hashtagQuery = useHashtagPosts(hashtag, isHashtag);

  const activeQuery = isOwn_
    ? ownQuery
    : isSaved
      ? savedQuery
      : isLiked
        ? likedQuery
        : isDreams
          ? dreamsQuery
          : isReposts
            ? repostsQuery
            : isHashtag
              ? hashtagQuery
              : userQuery;

  // Pull-to-refresh on an infinite query refetches EVERY loaded page in
  // sequence (TanStack Query v5 removed the per-page `refetchPage` opt).
  // After scrolling deep, that's 5+ sequential round-trips. Trim the
  // cache to the first page before invalidating so the refresh is one
  // round-trip — the user keeps scroll position, deeper pages reload as
  // they re-scroll into view.
  //
  // Use invalidateQueries (not query.refetch()) — refetch() reads internal
  // page-count state that doesn't always sync with the prior setQueryData
  // trim and can no-op when a concurrent fetchNextPage is mid-flight
  // (e.g. pendingAutoAnchor effect below). invalidateQueries marks the
  // query stale + triggers refetch atomically, the documented pattern.
  const queryClient = useQueryClient();
  const authUserId = useAuthStore((s) => s.user?.id);
  // Dark-launch: on a bot's `user` grid, the supreme admin sees this bot's hidden
  // shadow renders prepended (admin-only; the RPC returns [] to everyone else).
  const shadowQuery = useShadowPosts(userId, authUserId, shadowAuthor, isUser);
  const activeQueryKey = useMemo(() => {
    if (isOwn_) return ['userPosts', authUserId];
    if (isSaved) return ['favoritePosts', authUserId];
    if (isLiked) return ['likedPosts', authUserId];
    // Dreams key MUST include the filter — useMyDreams keys on
    // ['my-dreams', userId, filter]. A 2-segment key here still prefix-matches
    // for invalidateQueries, but the setQueryData page-1 trim below is an EXACT
    // write, so a short key silently no-ops the trim and pull-to-refresh refetches
    // every loaded page instead of just page 1 (Kevin 2026-07-19).
    if (isDreams) return ['my-dreams', authUserId, dreamsFilter];
    if (isReposts) return ['userReposts', userId];
    if (isHashtag) return ['hashtagPosts', hashtag];
    return ['publicProfilePosts', userId];
  }, [
    isOwn_,
    isSaved,
    isLiked,
    isDreams,
    isReposts,
    isHashtag,
    hashtag,
    userId,
    authUserId,
    dreamsFilter,
  ]);
  // Spinner state owned LOCALLY so the RefreshControl reflects ONLY a
  // user-initiated pull — never a programmatic refetch. Binding `refreshing` to
  // activeQuery.isRefetching (the old way) meant any background refetch (screen
  // focus, app foreground, a mutation invalidating this key elsewhere) flipped
  // the RefreshControl on, which iOS renders as a pull — and since there was no
  // real pull gesture, the ScrollView got STUCK in the pulled-down state with
  // the spinner showing forever (Kevin 2026-07-07). This mirrors the fix the
  // profile Followers list already uses.
  const [isPulling, setIsPulling] = useState(false);
  // Self-held pull gap the spinner rests in (native RefreshControl is unreliable
  // on Fabric — see useRefreshGap).
  const gapHeight = useRefreshGap(isPulling);
  const handleRefresh = useCallback(async () => {
    setIsPulling(true);
    try {
      queryClient.setQueryData<InfiniteData<unknown>>(activeQueryKey, (old) =>
        old ? { pages: old.pages.slice(0, 1), pageParams: old.pageParams.slice(0, 1) } : old
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: activeQueryKey, refetchType: 'active' }),
        onRefreshExtra?.(),
        minRefreshHold(),
      ]);
    } finally {
      setIsPulling(false);
    }
  }, [queryClient, activeQueryKey, onRefreshExtra]);

  const posts: DreamPostItem[] = useMemo(() => {
    const base = activeQuery.data?.pages.flatMap((p) => p.rows) ?? [];
    // Prepend the admin-only shadow tiles so they sit at the top of the bot's
    // grid for review. Empty for every non-admin (RPC + hook both gate).
    const shadow = shadowQuery.data ?? [];
    return shadow.length > 0 ? [...shadow, ...base] : base;
  }, [activeQuery.data, shadowQuery.data]);

  // Recently-finished dreams (completion beat). Only the Dreams grid (non-posted
  // filter) tracks renders, so only it consumes these. Each lingers ~1.7s so its
  // ring can deliberately fill to 100% + check before the real image reveals.
  const trackFinish = isDreams && dreamsFilter !== 'posted';
  const finishedRings = useRenderDockStore((s) => s.finished);
  const removeFinished = useRenderDockStore((s) => s.removeFinished);

  // "New since last viewed" markers (migration 397): a Dreams-grid tile whose
  // created_at is newer than the session baseline gets a "New" pill. Baseline is
  // captured once on entering the Dreams sub-tab (profile.tsx), so it's stable
  // across a detail-view round trip. Only the owner's Dreams grid marks.
  const dreamsViewBaseline = useDreamsSeenStore((s) => s.viewBaseline);
  const markNew = isDreams && !!dreamsViewBaseline;

  // FlatList re-renders cells only when `data`/`extraData` change. Fold BOTH the
  // selection set and the New-marker baseline in here so a baseline change (album
  // opened → markers appear) actually repaints the tiles. Memoized so the ref is
  // stable except when one of them genuinely changes.
  const gridExtraData = useMemo(
    () => ({ sel: selection?.selectedIds, vb: dreamsViewBaseline }),
    [selection?.selectedIds, dreamsViewBaseline]
  );

  // Weave "cooking" tiles into the top cells (Dreams tab only). They shift the
  // finished posts down by `pendingCount`, so highlight-scroll offsets by it.
  // Ordering: newest-first (created_at DESC) so the grid reads newest → oldest
  // consistently with `posts` (also newest-first).
  //
  // A dream that just completed becomes a `finished` slot at the SAME grid key
  // (`pending-<jobId>`) it held while active, so its tile instance persists and
  // the ring finishes in place. Its real image (upload_id) is SUPPRESSED from
  // `posts` for that beat so the image doesn't pop in beside the finishing ring;
  // when the finished entry clears (TTL below), the tile drops and the image
  // takes its cell (Kevin 2026-07-23: fill to 100% then reveal, don't pop early).
  const { pendingSlots, suppressedUploadIds } = useMemo(() => {
    if (!trackFinish && pendingDreams.length === 0) {
      return { pendingSlots: [] as PendingSlot[], suppressedUploadIds: new Set<string>() };
    }
    const finishedIds = new Set(trackFinish ? finishedRings.map((f) => f.jobId) : []);
    // Drop zombie in-flight rows (a job that never terminated) here too, so a
    // dead render can't leave a "cooking" tile spinning in the album forever —
    // the same self-heal the dock uses (lib/dockItems).
    const now = Date.now();
    const activeSlots = pendingDreams
      .filter((d) => !finishedIds.has(d.id) && !isStaleInFlight(d, now))
      .map((d) => ({ createdAt: d.createdAt, slot: { pending: d } as PendingSlot }));
    const completingSlots = trackFinish
      ? finishedRings.map((f) => ({
          createdAt: f.createdAt,
          slot: {
            pending: {
              id: f.jobId,
              status: 'completed',
              currentStage: null,
              stageUpdatedAt: null,
              model: null,
              createdAt: f.createdAt,
              attemptCount: 0,
            },
            finished: f.kind,
          } as PendingSlot,
        }))
      : [];
    const combined = [...activeSlots, ...completingSlots].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    const suppressed = new Set(
      trackFinish ? finishedRings.map((f) => f.uploadId).filter((id): id is string => !!id) : []
    );
    return { pendingSlots: combined.map((c) => c.slot), suppressedUploadIds: suppressed };
  }, [trackFinish, pendingDreams, finishedRings]);

  const gridData: GridItem[] = useMemo(() => {
    const visiblePosts =
      suppressedUploadIds.size > 0 ? posts.filter((p) => !suppressedUploadIds.has(p.id)) : posts;
    return pendingSlots.length > 0 ? [...pendingSlots, ...visiblePosts] : visiblePosts;
  }, [pendingSlots, posts, suppressedUploadIds]);
  const pendingCount = pendingSlots.length;
  const pendingCountRef = useRef(0);
  pendingCountRef.current = pendingCount;

  // Drop each finished entry after its completion beat → the completing tile
  // leaves and its (previously suppressed) image takes the cell. Scheduled off
  // each entry's own timestamp so a burst of completions each expire on time,
  // not reset by re-renders.
  useEffect(() => {
    if (!trackFinish || finishedRings.length === 0) return;
    const timers = finishedRings.map((f) =>
      setTimeout(
        () => removeFinished(f.jobId),
        Math.max(0, FINISHED_RING_TTL_MS - (Date.now() - f.at))
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [trackFinish, finishedRings, removeFinished]);

  const isLoading = activeQuery.isLoading;
  const hasNextPage = activeQuery.hasNextPage;
  const isFetchingNextPage = activeQuery.isFetchingNextPage;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, activeQuery]);

  // Subscribe to store directly so the latest currentPostId is reflected
  // even if the parent screen's render of the prop is stale. Store value
  // wins — the prop is only a fallback for screens that don't track via
  // the album store (e.g. user/[userId] with ?viewedPost= URL param).
  const storeCurrentPostId = useAlbumStore((s) => s.currentPostId);
  const albumSource = useAlbumStore((s) => s.albumSource);
  // Honor the stored anchor ONLY when it was set from THIS grid (see sameSource).
  // Otherwise a currentPostId left by a notification/search/other-grid tap would
  // light this grid's badge and auto-scroll onto a post never viewed here.
  const anchorId = sameSource(albumSource, source) ? storeCurrentPostId : null;
  const effectiveHighlightId = anchorId ?? highlightPostId ?? undefined;

  const highlightIndex = useMemo(() => {
    if (!effectiveHighlightId) return -1;
    return posts.findIndex((p) => p.id === effectiveHighlightId);
  }, [posts, effectiveHighlightId]);

  const navigation = useNavigation();
  const [highlightDismissed, setHighlightDismissed] = useState(false);
  const [badgeTapped, setBadgeTapped] = useState(false);
  // True while a "Just viewed" deep-jump is bulk-loading the album down to the
  // post; the effect below scrolls to it once it lands in the loaded set.
  const [jumpPending, setJumpPending] = useState(false);

  // Fade + dismiss the "Just viewed" pill when the user starts scrolling instead
  // of tapping it — if they're browsing, they've chosen not to jump (Kevin
  // 2026-07-26). onScrollBeginDrag fires only on a USER drag, so programmatic
  // scrolls (silent auto-anchor / deep-jump) never trigger the fade.
  const badgeOpacity = useRef(new Animated.Value(1)).current;
  const [scrolledAway, setScrolledAway] = useState(false);
  const jumpPendingRef = useRef(false);
  jumpPendingRef.current = jumpPending;
  // A new/changed highlight resets the fade so the pill can appear again.
  useEffect(() => {
    setScrolledAway(false);
    badgeOpacity.setValue(1);
  }, [effectiveHighlightId, badgeOpacity]);
  const fadeBadgeAway = useCallback(() => {
    Animated.timing(badgeOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setScrolledAway(true);
    });
  }, [badgeOpacity]);
  const handleScrollBeginDrag = useCallback(() => {
    if (jumpPendingRef.current) return; // let an in-progress deep-jump finish
    fadeBadgeAway();
  }, [fadeBadgeAway]);

  // Dismiss the highlight on blur (leaving the screen) for EITHER source — the
  // scoped store anchor or the ?viewedPost prop. (Was gated on the raw prop, which
  // the own grid no longer passes; effectiveHighlightId keeps parity.)
  useEffect(() => {
    if (!effectiveHighlightId) return;
    return navigation.addListener('blur', () => {
      setHighlightDismissed(true);
    });
  }, [navigation, effectiveHighlightId]);

  // Auto-scroll to the highlighted post on every focus enter — fixes the
  // "lose your place after detail-view scroll" bug. PostTile sets the album
  // store's currentPostId on tap, FullScreenFeed updates it via onIndexChange
  // as the user scrolls through detail view, and on swipe-back this grid
  // refocuses and silently snaps to the row the user was just on.
  // Ref ensures we only run once per focus, even if highlightIndex resolves
  // late (deep-link landing → posts fetch → index resolves).
  const didAutoScrollForFocus = useRef(false);

  // Prefetch full-detail-size image for any tile that scrolls into view, so
  // tapping into the detail view is instant. Skip already-prefetched IDs.
  const prefetchedRef = useRef<Set<string>>(new Set());
  const viewabilityConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 });
  const onGridViewableChanged = useRef(
    ({ viewableItems }: { viewableItems: { item?: GridItem }[] }) => {
      const toPrefetch: string[] = [];
      for (const v of viewableItems) {
        if (!v.item || isPending(v.item)) continue;
        if (prefetchedRef.current.has(v.item.id)) continue;
        prefetchedRef.current.add(v.item.id);
        // Prefetch the small JPEG display variant (~150 KB), not the full
        // image_url (1-2 MB PNG). Detail view reads image_url_display
        // anyway — prefetching the same URL is what actually warms the
        // tap-into-detail cache. Was downloading 10× the bytes needed.
        toPrefetch.push(v.item.image_url_display ?? v.item.image_url);
      }
      if (toPrefetch.length > 0) {
        ExpoImage.prefetch(toPrefetch);
      }
    }
  );

  // `gridIndex` is the index into `gridData` (i.e. highlightIndex + pendingCount).
  // FlashList's scrollToIndex lands the tile precisely — viewPosition 0.5 centers
  // it in the viewport, and the sticky header offset is handled internally — so
  // the old ROW_HEIGHT / headerHeight / containerHeight offset math (which
  // under-shot far rows without getItemLayout) is gone. animated on a user
  // badge-tap, silent (instant) on the background auto-anchor during back-swipe.
  const scrollToHighlightRow = useCallback((gridIndex: number, opts?: { silent?: boolean }) => {
    if (!listRef.current || gridIndex < 0) return;
    void listRef.current.scrollToIndex({
      index: gridIndex,
      animated: !opts?.silent,
      viewPosition: 0.5,
    });
    setBadgeTapped(true);
  }, []);

  // Reliable scroll for the DEEP-JUMP path. After a big one-shot page append,
  // FlashList v2's data length updates a frame BEFORE its internal layout array +
  // native content size do, so a single-rAF scrollToIndex to the far, just-loaded
  // row either throws "index out of bounds" (silently swallowed) or lands on an
  // estimated offset near the top — the intermittent "spins, finishes, stays at
  // top" bug (root-caused 2026-07-26). Await the scroll, verify it actually landed
  // via computeVisibleIndices(), and retry on a capped rAF loop. Returns whether
  // it landed, so the caller only hides the badge on real success.
  const scrollToHighlightRowReliable = useCallback(async (gridIndex: number): Promise<boolean> => {
    const list = listRef.current;
    if (!list || gridIndex < 0) return false;
    for (let attempt = 0; attempt < 12; attempt++) {
      try {
        await list.scrollToIndex({ index: gridIndex, animated: false, viewPosition: 0.5 });
      } catch {
        // Layout array not yet grown to cover gridIndex — retry next frame.
      }
      const vis = list.computeVisibleIndices?.();
      if (vis && gridIndex >= vis.startIndex && gridIndex <= vis.endIndex) return true;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
    return false;
  }, []);

  // Once the deep-jump bulk-load lands the post in the loaded set, scroll to it —
  // reliably (retry-until-landed), and only hide the badge once it truly lands, so
  // a swallowed FlashList miss can't leave the user stranded at the top with the
  // pill already gone.
  useEffect(() => {
    // Same containerHeight gate as Step 2's silent auto-anchor below — a grid
    // that hasn't been laid out yet (onLayout not fired: fresh profile mount,
    // still animating in) has no real viewport for scrollToIndex to target,
    // so scrollToHighlightRowReliable's retry loop can exhaust itself before
    // layout ever lands. Wait for containerHeight, then scroll (Kevin
    // 2026-09-04: "Just viewed" jump reported flaky on cold profile landings).
    if (!jumpPending || highlightIndex < 0 || containerHeight === 0) return;
    setJumpPending(false);
    const gridIndex = highlightIndex + pendingCountRef.current;
    void scrollToHighlightRowReliable(gridIndex).then((landed) => {
      if (landed) setBadgeTapped(true);
      // Not landed (deeper than the retry window) → leave the badge so the user
      // can tap again rather than being silently left at the top.
    });
  }, [jumpPending, highlightIndex, containerHeight, scrollToHighlightRowReliable]);

  // Auto-anchor on focus enter. The hard case is when the user scrolled past
  // the grid's first page (PAGE_SIZE=18) in detail view: highlightPostId is
  // set, but highlightIndex === -1 because the post isn't in the loaded
  // grid pages yet. We must fetch pages until found, THEN scroll.
  // `pendingAutoAnchor` flag drives both: while true, paginate; when found,
  // scroll once and clear.
  const [pendingAutoAnchor, setPendingAutoAnchor] = useState(false);

  // Live auto-anchor — ONLY for store-driven highlights (i.e. the user
  // came from this profile's photo detail and scrolled there). Triggered
  // by setCurrentPostId calls in PostTile.handlePress + FullScreenFeed
  // onIndexChange. Runs while the grid is blurred so swipe-back lands at
  // the right offset with no visible pop.
  //
  // URL-param highlights (e.g. user/[userId]?viewedPost=X — clicked an
  // avatar from the main feed) deliberately DO NOT trigger auto-anchor.
  // Those just light up the "Just viewed" badge; the user has to tap it
  // to scroll, since they didn't actually drill into that post.
  useEffect(() => {
    if (!anchorId) return;
    setHighlightDismissed(false);
    setPendingAutoAnchor(true);
  }, [anchorId]);

  // Reset the focus ref on focus enter (kept so the deep-link badge path
  // remains correct).
  useFocusEffect(
    useCallback(() => {
      didAutoScrollForFocus.current = false;
      return undefined;
    }, [])
  );

  // Step 1: paginate until the highlighted post enters the loaded set.
  useEffect(() => {
    if (!pendingAutoAnchor) return;
    if (highlightIndex >= 0) return;
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [pendingAutoAnchor, highlightIndex, activeQuery]);

  // Step 2: once the post is in loaded pages and the layout is measured,
  // silently scroll to it, then clear the pending flag.
  useEffect(() => {
    if (!pendingAutoAnchor) return;
    if (highlightIndex < 0 || containerHeight === 0) return;
    setPendingAutoAnchor(false);
    didAutoScrollForFocus.current = true;
    requestAnimationFrame(() =>
      scrollToHighlightRow(highlightIndex + pendingCountRef.current, { silent: true })
    );
  }, [pendingAutoAnchor, highlightIndex, containerHeight, scrollToHighlightRow]);

  const gridArea = containerHeight - headerHeight;
  const visibleRows = gridArea > 0 ? Math.floor(gridArea / ROW_HEIGHT) : 0;
  const maxVisibleIndex = visibleRows > 0 ? visibleRows * NUM_COLUMNS - 1 : -1;

  const showJustViewedButton =
    !!effectiveHighlightId &&
    !highlightDismissed &&
    !badgeTapped &&
    !scrolledAway &&
    (highlightIndex === -1
      ? !activeQuery.isLoading && containerHeight > 0
      : containerHeight > 0 && highlightIndex + pendingCount > maxVisibleIndex);

  const scrollToHighlight = useCallback(() => {
    if (highlightIndex >= 0) {
      // Already loaded (near) → smooth-scroll to it in the grid.
      scrollToHighlightRow(highlightIndex + pendingCountRef.current);
    } else if (effectiveHighlightId && isUser && userId) {
      // Deep in the album (not in the loaded pages). One-shot bulk-load the
      // profile down to it (one round-trip vs ~30s of page-by-page), then the
      // effect above scrolls once it resolves. The "Just viewed" anchor only
      // shows on a public profile, so this path is always the user grid. Keep the
      // button visible (with a spinner) during the load — badgeTapped flips only
      // when scrollToHighlightRow finally fires, hiding it.
      setJumpPending(true);
      void loadPublicProfilePostsUntil(queryClient, userId, effectiveHighlightId).then((found) => {
        if (!found) setJumpPending(false); // deeper than the cap → give up cleanly
      });
    }
  }, [highlightIndex, effectiveHighlightId, isUser, userId, queryClient, scrollToHighlightRow]);

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      <FlashList<GridItem>
        ref={listRef}
        data={gridData}
        keyExtractor={(item) => (isPending(item) ? `pending-${item.pending.id}` : item.id)}
        numColumns={NUM_COLUMNS}
        // Recycle the two cell kinds separately (image tiles vs "cooking" rings).
        getItemType={(item) => (isPending(item) ? 'pending' : 'post')}
        // Keep FlatList's behavior: DON'T auto-anchor scroll on top-insertion
        // (pending "cooking" tiles insert at index 0) — behavior-neutral migration.
        maintainVisibleContentPosition={{ disabled: true }}
        contentContainerStyle={{ paddingBottom: verticalScale(90) + extraBottomInset }}
        // Lock scrolling to one axis (iOS): a vertical flick won't pan
        // diagonally and leak horizontal movement into the parent swipe-back.
        directionalLockEnabled
        // `refreshing` pinned FALSE: the native spinner is unreliable on Fabric
        // (react-native#56343) — FlashList still adds a RefreshControl for the
        // pull GESTURE; we render our own spinner in the self-held gap below.
        onRefresh={handleRefresh}
        refreshing={false}
        ListHeaderComponent={
          <>
            {/* Self-held refresh gap — expands while pulling so the spinner has a
                clean space above the content (mirrors the native refresh gap). */}
            <Animated.View style={{ height: gapHeight }} />
            {ListHeaderComponent ? (
              <View
                onLayout={(e) => {
                  const h = e.nativeEvent.layout.height;
                  setHeaderHeight(h);
                  headerHeightRef.current = h;
                }}
              >
                {ListHeaderComponent}
              </View>
            ) : null}
          </>
        }
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        scrollEventThrottle={16}
        // Fetch the next page ~3 screens BEFORE the end so a fast fling rarely
        // outruns pagination and slams into the loaded-data boundary (the bounce).
        onEndReachedThreshold={3}
        onEndReached={handleEndReached}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onGridViewableChanged.current}
        ListEmptyComponent={
          isLoading ? (
            <GridSkeleton />
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.textSecondary} />
            </View>
          ) : null
        }
        // Selection state lives outside the items — extraData makes the FlatList
        // re-render rows when the selected set changes. The Set is a fresh
        // reference on every toggle / enter / exit (profile.tsx rebuilds it), so
        // this one primitive-ish ref covers all selection transitions without the
        // old fresh-array-every-render that forced a full re-render each frame.
        extraData={gridExtraData}
        renderItem={({ item }) => (
          // FlashList has no columnWrapperStyle; the column gap survives as the
          // fixed-tile-vs-column-width slack, but the ROW gap (old
          // columnWrapperStyle marginBottom) needs restoring here. Isolated to the
          // grid — doesn't touch the shared tile component.
          <View style={styles.cell}>
            {isPending(item) ? (
              <PendingDreamTile dream={item.pending} finished={item.finished} />
            ) : (
              <PostTile
                item={item}
                isOwn={isOwn}
                albumSource={source}
                isHighlighted={!highlightDismissed && item.id === effectiveHighlightId}
                showPrivateBadge={showPrivateBadge}
                isNew={
                  markNew &&
                  !!dreamsViewBaseline &&
                  item.created_at > dreamsViewBaseline &&
                  !item.owner_seen_at
                }
                allPosts={posts}
                // Flat PRIMITIVE selection props (not a per-tile object) so PostTile's
                // React.memo holds — the old object literal here defeated memo and
                // re-rendered every mounted tile on each toggle/scroll (Kevin
                // 2026-07-18). selOrder = 1-based insertion order (JS Sets iterate in
                // insertion order) = the album order bulk-Post hands to post/new.
                selActive={selection?.active ?? false}
                selSelected={selection ? selection.selectedIds.has(item.id) : false}
                selOrder={selectionOrder.get(item.id) ?? null}
                onSelectToggle={selection?.onToggle}
                onSelectEnter={selection?.onEnter}
              />
            )}
          </View>
        )}
      />
      {/* Our own gray spinner, resting in the self-held gap (top ≈ gap center).
          Reliable where the native RefreshControl spinner is not (Fabric). */}
      {isPulling && (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 18, left: 0, right: 0, alignItems: 'center' }}
        >
          <ActivityIndicator size="small" color={colors.textSecondary} />
        </View>
      )}
      {showJustViewedButton && (
        <Animated.View style={[styles.justViewedWrap, { opacity: badgeOpacity }]}>
          <TouchableOpacity
            style={styles.justViewedButton}
            onPress={scrollToHighlight}
            activeOpacity={0.85}
            disabled={jumpPending}
          >
            <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
            <Text style={styles.justViewedButtonText}>Just viewed</Text>
            {jumpPending ? (
              <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
            ) : (
              <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.7)" />
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { marginBottom: TILE_GAP },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: verticalScale(60) },
  emptyText: { color: colors.textSecondary, fontSize: fontScale(15) },
  footer: { paddingVertical: verticalScale(20), alignItems: 'center' },
  container: { flex: 1 },
  justViewedWrap: {
    position: 'absolute',
    bottom: 24,
    right: 16,
  },
  justViewedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15,15,26,0.85)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  justViewedButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: '600',
  },
});

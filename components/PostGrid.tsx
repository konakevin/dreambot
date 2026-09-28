import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { Text } from '@/components/AppText';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useFavoritePosts } from '@/hooks/useFavoritePosts';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { useUserReposts } from '@/hooks/useUserReposts';
import { usePublicProfilePosts } from '@/hooks/usePublicProfilePosts';
import { useHashtagPosts } from '@/hooks/useHashtagPosts';
import { useShadowPosts } from '@/hooks/useShadowPosts';
import { useMyDreams } from '@/hooks/useMyDreams';
import {
  useAlbumMonths,
  useBotUnseenPosts,
  type AlbumMonthsScope,
} from '@/hooks/useAlbumDiscovery';
import { monthsInOrder, type AlbumMonth, type AlbumSort } from '@/lib/albumNav';
import {
  ALBUM_CONTROL_H,
  MonthAlbumBar,
  MonthTile,
  MonthsToggle,
  SortToggle,
} from '@/components/AlbumBrowse';
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
import { verticalScale, fontScale, horizontalScale } from '@/lib/responsive';
import { NUM_COLUMNS, TILE_GAP } from '@/constants/grid';
import { minRefreshHold } from '@/lib/minRefresh';
import { useRefreshGap } from '@/hooks/useRefreshGap';
import type { DreamPostItem } from '@/components/DreamCard';
import type { DreamsFilter } from '@/hooks/useMyDreams';
import { albumBrowse } from '@/lib/albumSources';

export type PostGridSource =
  | { type: 'own' }
  | { type: 'saved' }
  | { type: 'liked' }
  | { type: 'dreams'; dreamsFilter?: DreamsFilter }
  | { type: 'reposts'; userId: string }
  // mode (bot profiles): 'all' = the album, 'unseen' = Haven't seen.
  | { type: 'user'; userId: string; mode?: 'all' | 'unseen' }
  | { type: 'hashtag'; tag: string };

/** A grid cell is either a finished post or a "cooking" pending-dream slot woven
 *  in at the top (Dreams tab only). The `pending` discriminator narrows them.
 *  `finished` is set for the brief completion beat — the same tile flips from an
 *  active ring to one that fills to 100% + a check before the real image reveals. */
type PendingSlot = { pending: InFlightDream; finished?: 'ready' | 'failed' };
/** A grid cell: a post, or a "cooking" tile for a dream still rendering. */
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
  /** Opt-in album browsing (ALBUM_DISCOVERY_PLAN.md): a controls row under the header
   *  (the caller's `left` control, Newest/Oldest, Grid/Months), month headers, the timeline
   *  months view. Omitted = the grid behaves exactly as before. */
  albumControls?: { left?: React.ReactElement };
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
  albumControls,
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
  // The list header's height, readable inside the onScroll callback without making
  // it a dependency (keeps the callback identity stable).
  const headerHeightRef = useRef(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const lastScrollYRef = useRef(0);
  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      lastScrollYRef.current = e.nativeEvent.contentOffset.y;
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
  const userMode = source.type === 'user' ? (source.mode ?? 'all') : 'all';

  // ── Album browsing (opt-in via albumControls) ──
  const browsing = !!albumControls;
  const [sort, setSort] = useState<AlbumSort>('newest');
  const [view, setView] = useState<'grid' | 'months'>('grid');
  // A month tile opens THAT month as its own album ('YYYY-MM-01'); "‹ Months" goes back
  // to the tiles (Kevin 2026-09-26: drill down, one month at a time).
  const [drillMonth, setDrillMonth] = useState<string | null>(null);
  // A different album (profile / filter / mode) always opens at the top.
  // Only the drilled-in month resets. `view` (grid / months) and `sort` deliberately
  // CARRY ACROSS albums: switch tabs in months mode and the next album opens in months
  // too (Kevin 2026-09-26: "i love how the months mode persists across tabs").
  const albumKey = `${source.type}|${userId}|${hashtag}|${dreamsFilter}|${userMode}`;
  useEffect(() => {
    setDrillMonth(null);
  }, [albumKey]);
  // Which albums sort / have months: lib/albumSources.ts (tested).
  const browseRules = browsing ? albumBrowse(source) : null;
  const sortable = browseRules?.sortable ?? false;
  const effSort: AlbumSort = sortable ? sort : 'newest';
  const monthsScope: AlbumMonthsScope | null = browseRules?.monthsScope ?? null;
  const noun = isDreams ? 'dreams' : 'posts';
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
  const ownQuery = useUserPosts(isOwnProfile, {
    sort: isOwn_ ? effSort : 'newest',
    month: isOwn_ ? drillMonth : null,
  });
  const savedQuery = useFavoritePosts(isOwnProfile, {
    sort: isSaved ? effSort : 'newest',
    month: isSaved ? drillMonth : null,
  });
  const likedQuery = useLikedPosts(isOwnProfile, {
    sort: isLiked ? effSort : 'newest',
    month: isLiked ? drillMonth : null,
  });
  const userQuery = usePublicProfilePosts(userId, isUser && userMode === 'all', {
    sort: isUser ? effSort : 'newest',
    month: isUser ? drillMonth : null,
  });
  const dreamsQuery = useMyDreams(dreamsFilter, {
    sort: isDreams ? effSort : 'newest',
    month: isDreams ? drillMonth : null,
  });
  const unseenQuery = useBotUnseenPosts(userId, effSort, isUser && userMode === 'unseen');
  const repostsQuery = useUserReposts(userId, isReposts, { sort: effSort, month: drillMonth });
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
              : userMode === 'unseen'
                ? unseenQuery
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
  const monthsQuery = useAlbumMonths(
    isUser || isReposts ? userId : (authUserId ?? ''),
    monthsScope
  );
  const months = useMemo(() => monthsQuery.data ?? [], [monthsQuery.data]);
  const displayMonths = useMemo(() => monthsInOrder(months, effSort), [months, effSort]);
  const activeQueryKey = useMemo(() => {
    if (isOwn_) return ['userPosts', authUserId, effSort, drillMonth];
    if (isSaved) return ['favoritePosts', authUserId, effSort, drillMonth];
    if (isLiked) return ['likedPosts', authUserId, effSort, drillMonth];
    // Dreams key MUST include the filter — useMyDreams keys on
    // ['my-dreams', userId, filter]. A 2-segment key here still prefix-matches
    // for invalidateQueries, but the setQueryData page-1 trim below is an EXACT
    // write, so a short key silently no-ops the trim and pull-to-refresh refetches
    // every loaded page instead of just page 1 (Kevin 2026-07-19).
    if (isDreams) return ['my-dreams', authUserId, dreamsFilter, effSort, drillMonth];
    if (isReposts) return ['userReposts', userId, effSort, drillMonth];
    if (isHashtag) return ['hashtagPosts', hashtag];
    if (userMode === 'unseen') return ['botUnseenPosts', authUserId, userId, effSort];
    return ['publicProfilePosts', userId, effSort, drillMonth];
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
    effSort,
    userMode,
    drillMonth,
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
  // finished posts down, which is why highlight scrolls use highlightGridIndex.
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

  // "Cooking" tiles belong at the very top of a newest-first album.
  const showPending = pendingSlots.length > 0 && !drillMonth && effSort === 'newest';
  // One continuous grid: no month headers in the main albums (Kevin 2026-09-26: months live
  // behind the calendar button), and no NEW marks or "You're caught up" line on bot profiles
  // (Kevin 2026-09-27: "just show their album grid").
  const gridData: GridItem[] = useMemo(() => {
    const visiblePosts =
      suppressedUploadIds.size > 0 ? posts.filter((p) => !suppressedUploadIds.has(p.id)) : posts;
    return showPending ? [...pendingSlots, ...visiblePosts] : visiblePosts;
  }, [pendingSlots, posts, suppressedUploadIds, showPending]);

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
  // The highlighted post's index in the GRID (cooking tiles + month rows shift it).
  const highlightGridIndex = useMemo(() => {
    if (!effectiveHighlightId) return -1;
    return gridData.findIndex((it) => !isPending(it) && it.id === effectiveHighlightId);
  }, [gridData, effectiveHighlightId]);
  const highlightGridIndexRef = useRef(-1);
  highlightGridIndexRef.current = highlightGridIndex;

  const navigation = useNavigation();
  const [highlightDismissed, setHighlightDismissed] = useState(false);

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

  // `gridIndex` is the index into `gridData` (highlightGridIndex: cooking tiles and
  // month rows included).
  // FlashList's scrollToIndex lands the tile precisely — viewPosition 0.5 centers
  // it in the viewport, and the sticky header offset is handled internally.
  // Silent (instant) on the background auto-anchor during back-swipe.
  const scrollToHighlightRow = useCallback((gridIndex: number, opts?: { silent?: boolean }) => {
    if (!listRef.current || gridIndex < 0) return;
    void listRef.current.scrollToIndex({
      index: gridIndex,
      animated: !opts?.silent,
      viewPosition: 0.5,
    });
  }, []);

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
  // avatar from the main feed) deliberately DO NOT trigger auto-anchor: the
  // tile just shows its "Just viewed" overlay. (The tappable "Just viewed"
  // jump pill was removed 2026-09-27, Kevin: "it never works".)
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
      scrollToHighlightRow(highlightGridIndexRef.current, { silent: true })
    );
  }, [pendingAutoAnchor, highlightIndex, containerHeight, scrollToHighlightRow]);

  // ── Album browsing handlers ──
  const changeSort = useCallback((next: AlbumSort) => {
    setSort(next);
    // Start the new order at the top of the grid, not mid-way down the old one.
    if (lastScrollYRef.current > headerHeightRef.current) {
      listRef.current?.scrollToOffset({ offset: headerHeightRef.current, animated: false });
    }
  }, []);

  // Pinch the grid in for months, out for the grid again.
  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .runOnJS(true)
        .enabled(!!monthsScope)
        .onEnd((e) => {
          if (e.scale < 0.75) {
            setDrillMonth(null);
            setView('months');
          } else if (e.scale > 1.35) setView('grid');
        }),
    [monthsScope]
  );

  const openMonthAlbum = useCallback((month: string) => {
    setDrillMonth(month);
    setView('grid');
  }, []);
  const backToMonths = useCallback(() => {
    setDrillMonth(null);
    setView('months');
  }, []);
  const drillCount = drillMonth
    ? (months.find((m) => m.month === drillMonth)?.count ?? null)
    : null;

  const { width: winW } = useWindowDimensions();
  const monthTileSize = winW / 2 - horizontalScale(12);

  const listHeader = (
    <>
      {/* Self-held refresh gap — expands while pulling so the spinner has a
          clean space above the content (mirrors the native refresh gap). */}
      <Animated.View style={{ height: gapHeight }} />
      {ListHeaderComponent ? (
        <View
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            headerHeightRef.current = h;
          }}
        >
          {ListHeaderComponent}
        </View>
      ) : null}
      {browsing && drillMonth ? (
        <View style={styles.controlsRow}>
          <View style={styles.controlsLeft}>
            <MonthAlbumBar
              month={drillMonth}
              count={drillCount}
              noun={noun}
              onBack={backToMonths}
            />
          </View>
          <View style={styles.controlsSpacer} />
          {sortable ? (
            <View style={styles.controlsFixed}>
              <SortToggle sort={effSort} onChange={changeSort} />
            </View>
          ) : null}
        </View>
      ) : browsing ? (
        <View style={styles.controlsRow}>
          {albumControls?.left ? (
            <View style={styles.controlsLeft}>{albumControls.left}</View>
          ) : null}
          <View style={styles.controlsSpacer} />
          {sortable ? (
            <View style={styles.controlsFixed}>
              <SortToggle sort={effSort} onChange={changeSort} />
            </View>
          ) : null}
          {monthsScope ? (
            <View style={styles.controlsFixed}>
              <MonthsToggle view={view} onChange={setView} />
            </View>
          ) : null}
        </View>
      ) : null}
    </>
  );

  const monthsList =
    view === 'months' && monthsScope ? (
      <FlashList<AlbumMonth>
        key="months"
        data={displayMonths}
        numColumns={2}
        keyExtractor={(m) => m.month}
        // FlashList v2 keeps the first visible item in place by default. Flipping the sort
        // reverses the months, so it chased that tile to the far end and dropped you at
        // the bottom (Kevin 2026-09-26). Stay where you are; the new order starts at the top.
        maintainVisibleContentPosition={{ disabled: true }}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingBottom: verticalScale(90) + extraBottomInset }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={
          monthsQuery.isLoading ? (
            <GridSkeleton />
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.monthCell}>
            <MonthTile
              month={item}
              noun={noun}
              size={monthTileSize}
              onPress={() => openMonthAlbum(item.month)}
            />
          </View>
        )}
      />
    ) : null;

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      <GestureDetector gesture={pinch}>
        <View style={styles.container}>
          {monthsList ?? (
            <FlashList<GridItem>
              ref={listRef}
              data={gridData}
              keyExtractor={(item) => (isPending(item) ? `pending-${item.pending.id}` : item.id)}
              numColumns={NUM_COLUMNS}
              // Recycle the cell kinds separately (image tiles, "cooking" rings).
              getItemType={(item) => (isPending(item) ? 'pending' : 'post')}
              // Keep FlatList's behavior: DON'T auto-anchor scroll on top-insertion
              // (pending "cooking" tiles insert at index 0), and don't chase a tile when the
              // order flips (Newest / Oldest).
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
              ListHeaderComponent={listHeader}
              onScroll={handleScroll}
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
                      albumSort={effSort}
                      albumMonth={drillMonth}
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
          )}
        </View>
      </GestureDetector>
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
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { marginBottom: TILE_GAP },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: verticalScale(60) },
  emptyText: { color: colors.textSecondary, fontSize: fontScale(15) },
  footer: { paddingVertical: verticalScale(20), alignItems: 'center' },
  container: { flex: 1 },
  // Fixed height + chips that never shrink: Newest / Months sit in exactly the same spot on
  // every tab, whether or not there's a filter pill on the left (Kevin 2026-09-26).
  controlsRow: {
    height: ALBUM_CONTROL_H + verticalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(16),
  },
  controlsLeft: { flexShrink: 1 },
  controlsFixed: { flexShrink: 0 },
  controlsSpacer: { flex: 1 },
  monthCell: { alignItems: 'center', marginBottom: verticalScale(8) },
});

/**
 * useDreamFeed — paginated feed loader used by the Home screen.
 * Extracted so both HomeScreen and BotsHorizontalPager (each bot page)
 * share the same query keys and TanStack Query cache (no double-fetching
 * when a user paginates back to a previously-visited bot).
 */

import { useInfiniteQuery, keepPreviousData, type QueryClient } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { supabase } from '@/lib/supabase';
import { mapRpcToDreamPost, castRows } from '@/lib/mapPost';
import { applyDiversity } from '@/lib/feedDiversity';
import type { DreamPostItem } from '@/components/DreamCard';

export type FeedTab = 'forYou' | 'following' | 'bots';
export const PAGE_SIZE = 20;

export interface FeedCursor {
  score: number;
  id: string;
}

export type FeedRow = DreamPostItem & { feed_score?: number };
export type FeedPage = { rows: FeedRow[]; nextCursor: FeedCursor | null };

/**
 * Drop every cached feed entry from a PREVIOUS seed. Feed keys include
 * feedSeed, so each reshuffle mints a whole new key family and ORPHANS the old
 * one — and the bots prefetch re-warms ~17 more per seed. With a 24h gcTime
 * nothing ever left the cache: a heavy session accumulated ~1,600 feed entries,
 * and every optimistic sweep (likes, counts) walked ALL of them with full page
 * copies — 6+ seconds of blocked JS per double-tap, universal button lag
 * (Kevin 2026-07-21, [like-perf] logs). Call at every seed rotation; steady
 * state returns to ~20 live entries. 'explore' keys also carry the seed
 * (position 3) — same treatment.
 */
export function pruneStaleFeedCaches(queryClient: QueryClient, activeSeed: number): void {
  for (const root of ['dreamFeed', 'explore']) {
    queryClient.removeQueries({
      queryKey: [root],
      predicate: (q) => q.queryKey[3] !== activeSeed,
    });
  }
}

function buildQueryKey(
  tab: FeedTab,
  userId: string | undefined,
  feedSeed: number,
  feedShuffle: number,
  botUserId: string | null
) {
  return ['dreamFeed', tab, userId, feedSeed, feedShuffle, botUserId] as const;
}

async function fetchFeedPage(
  tab: FeedTab,
  userId: string,
  feedSeed: number,
  feedShuffle: number,
  botUserId: string | null,
  pageParam: FeedCursor | null
): Promise<FeedPage> {
  const rpcArgs = {
    p_user_id: userId,
    p_limit: PAGE_SIZE,
    p_seed: feedSeed,
    p_tab: tab,
    ...(pageParam ? { p_cursor_score: pageParam.score, p_cursor_id: pageParam.id } : {}),
    ...(tab === 'bots' && botUserId ? { p_bot_user_id: botUserId } : {}),
  };
  // Shuffle strength (mig 352): manual refreshes pass 0.45 so the reshuffle
  // genuinely reorders. EXPLICIT param (never a store peek) — prefetch and
  // the mounted query must produce byte-identical pages or the swap double-
  // renders (the 2026-07-09 "double flicker"). Retry WITHOUT the param on
  // PGRST202 so the app works against a pre-352 database.
  let { data, error } = await supabase.rpc('get_feed', { ...rpcArgs, p_shuffle: feedShuffle });
  if (error && error.code === 'PGRST202') {
    ({ data, error } = await supabase.rpc('get_feed', rpcArgs));
  }
  if (error) throw error;
  const rawRows = castRows(data).map((row) => ({
    ...mapRpcToDreamPost(row),
    feed_score: row.feed_score as number,
  }));
  // Diversify PER-PAGE so each page is order-stable on its own.
  // (See HomeScreen comment for the cross-page-boundary trade-off.)
  const rows: FeedRow[] = tab === 'bots' ? rawRows : (applyDiversity(rawRows) as FeedRow[]);
  const last = rawRows[rawRows.length - 1];
  // Terminate ONLY on a genuinely empty page. An undersized page (< PAGE_SIZE)
  // does NOT mean we're at the end — the server-side get_feed filter (blocked
  // users, hidden posts, dedup) can return fewer rows than requested even
  // when more are available below. The old `rawRows.length === PAGE_SIZE`
  // check terminated prematurely on those, stranding users at a fake bottom
  // 30 posts in. Trade-off: one trailing empty fetch when the feed is
  // actually exhausted.
  const nextCursor: FeedCursor | null =
    last?.feed_score != null ? { score: last.feed_score, id: last.id } : null;
  return { rows, nextCursor };
}

export function useDreamFeed(tab: FeedTab, botUserId?: string | null) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);
  const feedShuffle = useFeedStore((s) => s.feedShuffle);

  return useInfiniteQuery({
    queryKey: buildQueryKey(tab, user?.id, feedSeed, feedShuffle, botUserId ?? null),
    queryFn: ({ pageParam }) =>
      fetchFeedPage(tab, user!.id, feedSeed, feedShuffle, botUserId ?? null, pageParam),
    initialPageParam: null as FeedCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!useAuthStore.getState().user,
    // Keep the current feed on screen while a new seed loads (pull-to-refresh),
    // so isLoading never flips → the full-page spinner never blanks the feed.
    placeholderData: keepPreviousData,
    // Freeze loaded pages for the session (2026-07-06): feed_score is LIVE
    // (age decay + engagement), so any background refetch of already-loaded
    // pages returns shifted rows and swaps the post under the index-anchored
    // pager mid-scroll. Fresh content still arrives through every intentional
    // channel: pull-to-refresh, the >60s-background invalidate in _layout,
    // and the per-session feedSeed (part of the query key).
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Prebuffer a feed: prefetches the first page into TanStack cache so a
 * tab-switch returns instantly, then prefetches the first N image bytes
 * via expo-image so the cards render with no shimmer. Best-effort —
 * swallows errors silently (called from a fire-and-forget useEffect).
 */
export async function prefetchDreamFeed(
  queryClient: QueryClient,
  tab: FeedTab,
  userId: string,
  feedSeed: number,
  botUserId: string | null = null,
  imageCount = 5,
  // Explicit shuffle strength for the prefetched key. The reshuffle flow MUST
  // pass this instead of pre-bumping the store: feedShuffle is part of the
  // MOUNTED feed's query key, so a store bump mid-flow re-pointed the visible
  // feed at an empty (oldSeed, 0.45) entry and its stray fetch swapped a random
  // card under the user on the FIRST re-tap after launch (Kevin 2026-07-21).
  // The commit then sets seed + shuffle atomically (setFeedSeed does both), so
  // the mounted key changes ONCE — straight onto this prefetched entry.
  shuffle?: number
): Promise<void> {
  const feedShuffle = shuffle ?? useFeedStore.getState().feedShuffle;
  const queryKey = buildQueryKey(tab, userId, feedSeed, feedShuffle, botUserId);
  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        fetchFeedPage(
          tab,
          userId,
          feedSeed,
          feedShuffle,
          botUserId,
          pageParam as FeedCursor | null
        ),
      initialPageParam: null as FeedCursor | null,
      // staleTime is LOAD-BEARING here. prefetchQuery only skips the network
      // when cached data is FRESH — and the client default staleTime is 0, so
      // without this every launch + every home/Bots mount re-ran the ENTIRE
      // fan-out (~19 get_feed RPCs + ~95 image prefetches ≈ 13MB) even with a
      // fully warm cache, competing with the visible card's own download and
      // spiking PostgREST connections (Kevin "laggy at launch", 2026-07-21).
      // 15 min: within a session the fan-out runs once; fresh content still
      // arrives via pull-to-refresh / reseed (new feedSeed = new key entirely).
      staleTime: 15 * 60 * 1000,
    });
    const cached = queryClient.getQueryData<{ pages: FeedPage[] }>(queryKey);
    const urls = (cached?.pages?.[0]?.rows ?? [])
      .slice(0, imageCount)
      .map((r) => r.image_url_display ?? r.image_url)
      .filter((u): u is string => !!u);
    if (urls.length) ExpoImage.prefetch(urls);
  } catch {
    /* best-effort */
  }
}

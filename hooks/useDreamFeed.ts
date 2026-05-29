/**
 * useDreamFeed — paginated feed loader used by the Home screen.
 * Extracted so both HomeScreen and BotsHorizontalPager (each bot page)
 * share the same query keys and TanStack Query cache (no double-fetching
 * when a user paginates back to a previously-visited bot).
 */

import { useInfiniteQuery, type QueryClient } from '@tanstack/react-query';
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

function buildQueryKey(
  tab: FeedTab,
  userId: string | undefined,
  feedSeed: number,
  botUserId: string | null
) {
  return ['dreamFeed', tab, userId, feedSeed, botUserId] as const;
}

async function fetchFeedPage(
  tab: FeedTab,
  userId: string,
  feedSeed: number,
  botUserId: string | null,
  pageParam: FeedCursor | null
): Promise<FeedPage> {
  const { data, error } = await supabase.rpc('get_feed', {
    p_user_id: userId,
    p_limit: PAGE_SIZE,
    p_seed: feedSeed,
    p_tab: tab,
    ...(pageParam ? { p_cursor_score: pageParam.score, p_cursor_id: pageParam.id } : {}),
    ...(tab === 'bots' && botUserId ? { p_bot_user_id: botUserId } : {}),
  });
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

  return useInfiniteQuery({
    queryKey: buildQueryKey(tab, user?.id, feedSeed, botUserId ?? null),
    queryFn: ({ pageParam }) =>
      fetchFeedPage(tab, user!.id, feedSeed, botUserId ?? null, pageParam),
    initialPageParam: null as FeedCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!useAuthStore.getState().user,
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
  imageCount = 5
): Promise<void> {
  const queryKey = buildQueryKey(tab, userId, feedSeed, botUserId);
  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) =>
        fetchFeedPage(tab, userId, feedSeed, botUserId, pageParam as FeedCursor | null),
      initialPageParam: null as FeedCursor | null,
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

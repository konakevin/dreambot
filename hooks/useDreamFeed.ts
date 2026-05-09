/**
 * useDreamFeed — paginated feed loader used by the Home screen.
 * Extracted so both HomeScreen and BotsHorizontalPager (each bot page)
 * share the same query keys and TanStack Query cache (no double-fetching
 * when a user paginates back to a previously-visited bot).
 */

import { useInfiniteQuery } from '@tanstack/react-query';
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

export function useDreamFeed(tab: FeedTab, botUserId?: string | null) {
  const user = useAuthStore((s) => s.user);
  const feedSeed = useFeedStore((s) => s.feedSeed);

  return useInfiniteQuery({
    queryKey: ['dreamFeed', tab, user?.id, feedSeed, botUserId ?? null],
    queryFn: async ({ pageParam }): Promise<FeedPage> => {
      const { data, error } = await supabase.rpc('get_feed', {
        p_user_id: user!.id,
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
      const nextCursor: FeedCursor | null =
        rawRows.length === PAGE_SIZE && last?.feed_score != null
          ? { score: last.feed_score, id: last.id }
          : null;
      return { rows, nextCursor };
    },
    initialPageParam: null as FeedCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!useAuthStore.getState().user,
  });
}

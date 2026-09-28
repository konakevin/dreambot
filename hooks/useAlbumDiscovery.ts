/**
 * Data for album navigation + bot discovery (ALBUM_DISCOVERY_PLAN.md).
 *
 * - useAlbumMonths        months of an album (timeline scrubber, months view) — migration 560
 * - useBotUnseenPosts     a bot's posts you haven't seen (Haven't seen) — migration 559
 *
 * useBotUnseenPosts pages like the album grids ({ rows, offset, hasMore }) so PostGrid can
 * use it as its active query unchanged.
 */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';
import { ALBUM_PAGE_SIZE as PAGE_SIZE, albumPaging } from '@/lib/albumPaging';
import type { AlbumMonth, AlbumSort } from '@/lib/albumNav';

export type AlbumMonthsScope =
  | 'dreams_all'
  | 'dreams_private'
  | 'dreams_posted'
  | 'posts'
  // Dated by when you saved / hearted / reposted (migration 562), like those albums' sort.
  | 'saved'
  | 'hearted'
  | 'reposts';

export function useAlbumMonths(userId: string, scope: AlbumMonthsScope | null) {
  const uid = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['albumMonths', userId, scope],
    queryFn: async (): Promise<AlbumMonth[]> => {
      if (!scope) return [];
      const { data, error } = await supabase.rpc('get_album_months', {
        p_user_id: userId,
        p_scope: scope,
      });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        month: r.month,
        count: r.post_count,
        pinned: r.pinned_count,
        cover: r.cover_url ?? null,
      }));
    },
    enabled: !!uid && !!userId && !!scope,
    staleTime: 120_000,
  });
}

export function useBotUnseenPosts(botId: string, sort: AlbumSort, enabled = true) {
  const uid = useAuthStore((s) => s.user?.id);
  return useInfiniteQuery({
    queryKey: ['botUnseenPosts', uid, botId, sort],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .rpc('get_bot_unseen_posts', { p_bot_id: botId })
        .select(POST_SELECT)
        .order('posted_at', { ascending: sort === 'oldest', nullsFirst: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = castRows(data).map(mapToDreamPost);
      return { rows, offset, hasMore: rows.length === PAGE_SIZE };
    },
    ...albumPaging(),
    enabled: !!uid && !!botId && enabled,
    staleTime: 60_000,
  });
}

/**
 * useMyDreams — fetches the current user's AI-generated dreams (both posted and saved).
 * Paginated with useInfiniteQuery for performance.
 * Used by the My Dreams tab on the profile screen.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

/** Dreams album filter: all dreams / only posted (live on feed) / only private. */
export type DreamsFilter = 'all' | 'posted' | 'private';

export function useMyDreams(filter: DreamsFilter = 'all') {
  const userId = useAuthStore((s) => s.user?.id);

  return useInfiniteQuery({
    queryKey: ['my-dreams', userId, filter],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      if (!userId) return { rows: [], offset, hasMore: false };
      // Dreams album = your dreams as loose tiles. A dream that's been composed
      // into an album LEAVES here (album_ref_count > 0) — it lives inside its
      // album now, not as a duplicate unposted tile (Kevin 2026-07-11). Delete
      // the album and its members' ref count drops to 0, so they return here at
      // the top (created_at bumped by the trigger). Galleries themselves
      // (media_count > 1, album_ref_count = 0) still show like single dreams.
      let query = supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', userId)
        .eq('album_ref_count', 0)
        // Quarantined bad renders (admin-flagged) are hidden from every surface,
        // including the owner's own private album (migration 449).
        .is('quarantined_at', null);
      // 'private' = unposted (not live on the feed); 'posted' = live on the feed.
      if (filter === 'private') query = query.eq('is_public', false);
      else if (filter === 'posted') query = query.eq('is_public', true);
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = castRows(data).map((row) => ({
        ...mapToDreamPost(row),
        is_public: (row.is_public as boolean) ?? false,
        posted_at: (row.posted_at as string | null) ?? null,
        description: (row.description as string | null) ?? null,
      }));
      // hasMore captured at fetch time — survives optimistic deletes.
      return { rows, offset, hasMore: rows.length === PAGE_SIZE };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage.offset + PAGE_SIZE : undefined),
    enabled: !!userId,
    staleTime: 60_000,
  });
}

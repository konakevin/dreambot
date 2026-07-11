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
      // Galleries (media_count > 1) live here EXACTLY like single dreams
      // (Kevin 2026-07-11: "study how we do it for single posts and mimic"):
      // All/Posted/Private by is_public, Public badge when live, and they show
      // in the Posts album only while public. The no-gallery-inside-a-gallery
      // rule is enforced by the PICKER (post/new filters media_count > 1), not
      // by hiding galleries from this album — hiding them here made a
      // private gallery invisible everywhere.
      let query = supabase.from('uploads').select(POST_SELECT).eq('user_id', userId);
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

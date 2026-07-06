import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function usePublicProfilePosts(userId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['publicProfilePosts', userId],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      // Order by posted_at — see useUserPosts for the why. Posts grid
      // reflects the publish timeline, not the original generation moment.
      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', userId)
        .eq('is_public', true)
        // Pins first (migration 330) — one ORDER BY keeps range pagination
        // correct with no prepend logic; unpinned rows have NULL pinned_at
        // and sort after every pin.
        .order('pinned_at', { ascending: false, nullsFirst: false })
        // See useUserPosts for the nullsLast rationale (mig 246 + defense
        // against stray NULL posted_at on public uploads).
        .order('posted_at', { ascending: false, nullsFirst: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = castRows(data).map(mapToDreamPost);
      // hasMore captured at fetch time so optimistic deletes don't break
      // pagination by shrinking rows.length below PAGE_SIZE.
      return { rows, offset, hasMore: rows.length === PAGE_SIZE };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.offset + PAGE_SIZE : undefined),
    enabled: !!userId && enabled,
    staleTime: 60_000,
  });
}

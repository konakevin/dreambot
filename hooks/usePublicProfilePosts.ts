import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function usePublicProfilePosts(userId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['publicProfilePosts', userId],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
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

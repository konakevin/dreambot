/**
 * useUserDreams — fetches another user's AI-generated dreams (all uploads).
 * Only visible to friends. Includes both posted and private dreams.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function useUserDreams(userId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['userDreams', userId],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = castRows(data).map(mapToDreamPost);
      return { rows, offset };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage?.rows?.length || lastPage.rows.length < PAGE_SIZE
        ? undefined
        : lastPage.offset + PAGE_SIZE,
    enabled: !!userId && enabled,
    staleTime: 60_000,
  });
}

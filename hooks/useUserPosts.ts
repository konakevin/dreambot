import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function useUserPosts(enabled = true) {
  const user = useAuthStore((s) => s.user);
  return useInfiniteQuery({
    queryKey: ['userPosts', user?.id],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', user!.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = castRows(data).map(mapToDreamPost);
      // hasMore captured at fetch time — survives optimistic deletes.
      return { rows, offset, hasMore: rows.length === PAGE_SIZE };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage.offset + PAGE_SIZE : undefined),
    enabled: !!user && enabled,
    staleTime: 60_000,
  });
}

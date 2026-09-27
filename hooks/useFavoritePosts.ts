import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { mapToDreamPost } from '@/lib/mapPost';
import { asDbResult } from '@/lib/dbResult';
import { monthRange } from '@/lib/albumNav';
import type { AlbumQueryOpts } from '@/lib/albumPaging';

const PAGE_SIZE = 18;

/** Your bookmarked posts, ordered by when you saved them (`sort` flips that order;
 *  `month` = only what you saved that month, the months view's month album). */
export function useFavoritePosts(
  enabled = true,
  { sort = 'newest', month = null }: AlbumQueryOpts = {}
) {
  const user = useAuthStore((s) => s.user);
  return useInfiniteQuery({
    queryKey: ['favoritePosts', user?.id, sort, month],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      let q = supabase
        .from('favorites')
        .select('uploads(*, users!uploads_user_id_fkey!inner(username, avatar_url, allow_reposts))')
        .eq('user_id', user!.id);
      if (month) {
        const { from, to } = monthRange(month);
        q = q.gte('created_at', from).lt('created_at', to);
      }
      const { data, error } = await q
        .order('created_at', { ascending: sort === 'oldest' })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = asDbResult<Record<string, unknown>[]>(data ?? [])
        .map((r) => r.uploads as Record<string, unknown> | null)
        .filter((u): u is Record<string, unknown> => u !== null)
        .map(mapToDreamPost);
      // hasMore captured against the SOURCE data length, not post-filter rows
      // (server returned this many; the filter just drops nulls). Survives
      // optimistic deletes since hasMore is fixed at fetch time.
      return { rows, offset, hasMore: (data?.length ?? 0) === PAGE_SIZE };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage.offset + PAGE_SIZE : undefined),
    enabled: !!user && enabled,
    staleTime: 60_000,
  });
}

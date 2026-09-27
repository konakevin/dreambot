import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { mapToDreamPost } from '@/lib/mapPost';
import { asDbResult } from '@/lib/dbResult';
import { monthRange } from '@/lib/albumNav';
import type { AlbumQueryOpts } from '@/lib/albumPaging';

const PAGE_SIZE = 18;

/** Posts the current user has hearted — the "Hearted" sub-filter of the Saved
 *  album (mirrors useFavoritePosts, which backs "Bookmarked"; `likes` already
 *  carries idx_likes_user_created for this exact user_id + created_at query).
 *  Ordered by when you hearted them; `sort` flips that order, `month` = only what you
 *  hearted that month (the months view's month album). */
export function useLikedPosts(
  enabled = true,
  { sort = 'newest', month = null }: AlbumQueryOpts = {}
) {
  const user = useAuthStore((s) => s.user);
  return useInfiniteQuery({
    queryKey: ['likedPosts', user?.id, sort, month],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      let q = supabase
        .from('likes')
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

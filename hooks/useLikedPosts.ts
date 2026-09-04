import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { mapToDreamPost } from '@/lib/mapPost';
import { asDbResult } from '@/lib/dbResult';

const PAGE_SIZE = 18;

/** Posts the current user has hearted — the "Hearted" sub-filter of the Saved
 *  album (mirrors useFavoritePosts, which backs "Bookmarked"; `likes` already
 *  carries idx_likes_user_created for this exact user_id + created_at query). */
export function useLikedPosts(enabled = true) {
  const user = useAuthStore((s) => s.user);
  return useInfiniteQuery({
    queryKey: ['likedPosts', user?.id],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('likes')
        .select('uploads(*, users!inner(username, avatar_url, allow_reposts))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
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

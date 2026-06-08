import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapToDreamPost } from '@/lib/mapPost';

const PAGE_SIZE = 18;

/**
 * useUserReposts — the posts a given user has reposted, newest-first, for the
 * "Reposts" tab on their profile. Reposts are public, so this works for any
 * userId (own profile + others). Mirrors useFavoritePosts but reads post_reposts
 * and follows the upload_id FK to the original upload.
 */
export function useUserReposts(userId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['userReposts', userId],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('post_reposts')
        .select('uploads(*, users!inner(username, avatar_url))')
        .eq('reposter_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = ((data ?? []) as unknown as Record<string, unknown>[])
        .map((r) => r.uploads as Record<string, unknown> | null)
        .filter((u): u is Record<string, unknown> => u !== null)
        .map(mapToDreamPost);
      return { rows, offset, hasMore: (data?.length ?? 0) === PAGE_SIZE };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage.offset + PAGE_SIZE : undefined),
    enabled: !!userId && enabled,
    staleTime: 60_000,
  });
}

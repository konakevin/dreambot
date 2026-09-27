import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapToDreamPost } from '@/lib/mapPost';
import { asDbResult } from '@/lib/dbResult';
import { monthRange } from '@/lib/albumNav';
import type { AlbumQueryOpts } from '@/lib/albumPaging';

const PAGE_SIZE = 18;

/**
 * useUserReposts — the posts a given user has reposted, newest-first, for the
 * "Reposts" tab on their profile. Reposts are public, so this works for any
 * userId (own profile + others). Mirrors useFavoritePosts but reads post_reposts
 * and follows the upload_id FK to the original upload.
 *
 * Filters active=true — post_reposts is a durable ledger (mig 418) that keeps
 * un-reposted rows as tombstones. Orders by last_reposted_at so a re-repost bumps
 * the dream back to the top of the album (even though it gets no feed bump).
 * `sort` 'oldest' flips it: your earliest reposts first. `month` = only that month's
 * reposts (the months view's month album).
 */
export function useUserReposts(
  userId: string,
  enabled = true,
  { sort = 'newest', month = null }: AlbumQueryOpts = {}
) {
  return useInfiniteQuery({
    queryKey: ['userReposts', userId, sort, month],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      let q = supabase
        .from('post_reposts')
        .select('uploads(*, users!uploads_user_id_fkey!inner(username, avatar_url))')
        .eq('reposter_id', userId)
        .eq('active', true);
      if (month) {
        const { from, to } = monthRange(month);
        q = q.gte('last_reposted_at', from).lt('last_reposted_at', to);
      }
      const { data, error } = await q
        .order('last_reposted_at', { ascending: sort === 'oldest' })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = asDbResult<Record<string, unknown>[]>(data ?? [])
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

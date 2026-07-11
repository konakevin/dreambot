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
      // Order by posted_at, not created_at — a private dream made public
      // weeks later should land at the top of the Posts grid (it was "posted"
      // now), not buried at its original generation date. created_at stays
      // as the "dream was generated" timestamp; posted_at is the publish moment.
      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', user!.id)
        // PUBLIC only — even for the owner (intentional: this album is the
        // public storefront). Private posts, galleries included, live in the
        // Dreams album like every other private dream (Kevin 2026-07-11).
        .eq('is_public', true)
        // Pins first (migration 330) — see usePublicProfilePosts.
        .order('pinned_at', { ascending: false, nullsFirst: false })
        // nullsLast: Postgres sorts NULLs FIRST in DESC by default — before
        // mig 246 backfilled legacy posted_at, that pinned all pre-2026-06
        // public uploads to the top of the grid. nullsLast is defense for
        // any future stragglers that slip past the publish paths.
        .order('posted_at', { ascending: false, nullsFirst: false })
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

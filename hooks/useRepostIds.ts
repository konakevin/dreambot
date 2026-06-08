import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * useRepostIds — the Set of upload_ids the current user has reposted, for
 * filling the repost button's active state. Mirrors useLikeIds: paginated to
 * defeat PostgREST's 1000-row cap, unioned with the optimistic cache to survive
 * read-after-write races, refetch-on-mount for cross-session correctness.
 */
export function useRepostIds() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['repostIds', user?.id],
    queryFn: async () => {
      const all: { upload_id: string }[] = [];
      const PAGE = 1000;
      for (let offset = 0; ; offset += PAGE) {
        const { data, error } = await supabase
          .from('post_reposts')
          .select('upload_id')
          .eq('reposter_id', user!.id)
          .range(offset, offset + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const row of data) all.push(row as { upload_id: string });
        if (data.length < PAGE) break;
      }
      const fresh = new Set(all.map((r) => r.upload_id));
      // UNION with current cache to preserve a pending optimistic repost against
      // read-after-write replication lag (same race useLikeIds documents).
      const current = queryClient.getQueryData<Set<string>>(['repostIds', user!.id]);
      if (current) for (const id of current) fresh.add(id);
      return fresh;
    },
    enabled: !!user,
    // NOTE: unlike useLikeIds (called ONCE at screen level, so it can afford
    // refetchOnMount:'always'), this hook is consumed PER-CARD by DreamCard.
    // 'always' would refetch on every card mount → a storm while scrolling. The
    // initial fetch (no cached data) still runs, and staleTime keeps it fresh
    // cross-session; within a session optimistic state is trusted.
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

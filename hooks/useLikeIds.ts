import { queryOptions, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * The ONE definition of the liked-ids query (key + fetch). The app's boot prewarm
 * (app/_layout.tsx BootFeedPrewarm) starts it alongside the Home feed, so the first card's
 * heart is right on first paint instead of showing empty and filling red a moment later
 * (2026-09-28). Locked by __tests__/lib/queryDefinitionGuard.test.ts.
 */
export function likeIdsQueryOptions(userId: string, queryClient: QueryClient) {
  return queryOptions({
    queryKey: ['likeIds', userId],
    queryFn: async () => {
      // One round trip: get_my_like_ids (migration 575) returns the whole set as one uuid[]
      // row, which the 1000-row PostgREST cap doesn't apply to. The page-by-page read below
      // stays as the fallback if the RPC errors.
      const { data: ids, error: rpcError } = await supabase.rpc('get_my_like_ids');
      const fresh = new Set<string>(!rpcError && ids ? ids : await fetchLikeIdsPaged(userId));
      // Defense-in-depth UNION with current cache (see fetchLikeIdsPaged's note on the
      // read-after-write race).
      const current = queryClient.getQueryData<Set<string>>(['likeIds', userId]);
      if (current) for (const id of current) fresh.add(id);
      return fresh;
    },
    // Always refetch when consuming components mount — fixes cross-session
    // bug where a post the user liked in a prior session shows the like_count
    // but heart is NOT highlighted after app reload, because the cached set
    // was empty and was being served stale.
    refetchOnMount: 'always',
    // No focus refetch: it raced the read-after-write replication of an in-session like and
    // clobbered the optimistic Set (heart un-filled while the count stayed bumped; fixed
    // 2026-05-31). Optimistic state is trusted within a session.
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

/** The fallback read: the user's likes, 1000 rows at a time. */
async function fetchLikeIdsPaged(userId: string): Promise<string[]> {
  // Paginate in 1000-row chunks until exhausted. Supabase's PostgREST
  // applies a hard `max-rows: 1000` cap regardless of the requested
  // .range() — so the previous `.range(0, 9999)` silently truncated
  // to 1000 rows. Anyone with >1000 likes (Kevin had 1114) had ~114
  // likes invisible to the client: the heart un-filled on those
  // posts cross-session even though the server count was correct.
  // And without an explicit .order(), which 1000 PostgREST returned
  // was undefined (physical row order) — a TODAY like could fall out
  // of the slice. Pagination guarantees the full set comes back.
  const all: { upload_id: string }[] = [];
  const PAGE = 1000;
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await supabase
      .from('likes')
      .select('upload_id')
      .eq('user_id', userId)
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const row of data) all.push(row as { upload_id: string });
    if (data.length < PAGE) break;
  }
  return all.map((r) => r.upload_id);
}

export function useLikeIds() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useQuery({ ...likeIdsQueryOptions(user?.id ?? '', queryClient), enabled: !!user });
}

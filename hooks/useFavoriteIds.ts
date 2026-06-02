import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useFavoriteIds() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['favoriteIds', user?.id],
    queryFn: async () => {
      // Paginate in 1000-row chunks until exhausted. Same pattern as
      // useLikeIds.ts — Supabase's PostgREST max-rows: 1000 cap silently
      // truncates a single `.limit(N)` request to 1000. The previous
      // `.limit(500)` here would have started missing favorites once a
      // user passed 500 saves, with the save-icon un-filling cross-session
      // on the dropped posts even though the row exists in the DB.
      const all: { upload_id: string }[] = [];
      const PAGE = 1000;
      for (let offset = 0; ; offset += PAGE) {
        const { data, error } = await supabase
          .from('favorites')
          .select('upload_id')
          .eq('user_id', user!.id)
          .range(offset, offset + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const row of data) all.push(row as { upload_id: string });
        if (data.length < PAGE) break;
      }
      const fresh = new Set(all.map((r) => r.upload_id));

      // Defense-in-depth UNION with current cache — preserves optimistic
      // toggleFavorite adds against a refetch that races read-after-write
      // replication. Same pattern as useLikeIds.ts.
      const current = queryClient.getQueryData<Set<string>>(['favoriteIds', user!.id]);
      if (current) for (const id of current) fresh.add(id);
      return fresh;
    },
    enabled: !!user,
    // Always refetch on mount — fixes cross-session staleness (toggleFavorite
    // happens in a prior session, then on cold reload the cached empty
    // Set could be served stale). One tiny query on screen mount.
    refetchOnMount: 'always',
    staleTime: 60_000,
  });
}

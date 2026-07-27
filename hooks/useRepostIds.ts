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
          .eq('active', true) // ledger keeps un-reposted rows as tombstones (mig 418)
          .range(offset, offset + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const row of data) all.push(row as { upload_id: string });
        if (data.length < PAGE) break;
      }
      const fresh = new Set(all.map((r) => r.upload_id));
      // Reconcile against IN-FLIGHT toggles only (not a blanket union with the
      // cache). A repost toggle goes BOTH ways, so an add-only union could
      // resurrect a just-removed repost during read-after-write lag and leave
      // the icon stuck "reposted". Instead, apply each pending toggle's intended
      // state on top of the authoritative server read: a pending repost adds the
      // id (server INSERT may not have replicated yet), a pending un-repost
      // removes it (server DELETE may not have replicated yet). Once a toggle
      // settles it drops out of this set, so nothing lingers.
      const pending = queryClient.getMutationCache().findAll({
        mutationKey: ['toggleRepost'],
        status: 'pending',
      });
      for (const m of pending) {
        const vars = m.state.variables as
          | { uploadId: string; currentlyReposted: boolean }
          | undefined;
        if (!vars) continue;
        // intended next state = the opposite of what it was when tapped.
        if (vars.currentlyReposted) fresh.delete(vars.uploadId);
        else fresh.add(vars.uploadId);
      }
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

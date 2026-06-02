import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useLikeIds() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['likeIds', user?.id],
    queryFn: async () => {
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
          .eq('user_id', user!.id)
          .range(offset, offset + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const row of data) all.push(row as { upload_id: string });
        if (data.length < PAGE) break;
      }
      const fresh = new Set(all.map((r) => r.upload_id));

      // Defense-in-depth UNION with current cache. Without this, a refetch
      // that races against Supabase read-after-write (the new likes row
      // hasn't replicated to the read path yet) would clobber the optimistic
      // add — the visible symptom is "I hearted this, the count went to 1,
      // but the heart isn't red." Unioning preserves the pending optimistic
      // add against that race. Trade-off: an optimistic un-like that races
      // with a refetch (very narrow window, ~100ms while delete is in
      // flight) could briefly resurface as red until the next refetch.
      // Acceptable — un-likes are rarer + transient.
      const current = queryClient.getQueryData<Set<string>>(['likeIds', user!.id]);
      if (current) for (const id of current) fresh.add(id);
      return fresh;
    },
    enabled: !!user,
    // Always refetch when consuming components mount — fixes cross-session
    // bug where a post the user liked in a prior session shows the like_count
    // but heart is NOT highlighted after app reload, because the cached set
    // was empty and was being served stale. Network cost is one tiny query
    // per mount of the heart-aware screens.
    refetchOnMount: 'always',
    // Disable focus-refetch. The global focusManager.setFocused(true) in
    // lib/queryClient.ts fires on every AppState 'active' (lock-screen peek,
    // Control Center pull, notification banner dismissal, etc). With
    // staleTime: 60_000 + RQ default refetchOnWindowFocus: true, that event
    // refetches likeIds after 60s of session time and races against the
    // read-after-write replication of any in-session like — clobbering the
    // optimistic Set with the still-pre-tap server Set. Symptom: heart goes
    // from red to un-red while like_count (in a separate cache) stays
    // bumped, visible as "I hearted this, scrolled away+back, heart un-fills
    // but count says 1." Optimistic state is trusted within a session;
    // refetchOnMount handles cross-session. (Fixed 2026-05-31.)
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useLikeIds() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['likeIds', user?.id],
    queryFn: async () => {
      // No .limit() — PostgREST default is 1000, override via .range() to be safe.
      // Prev code had .limit(500); admins testing heavily ran past that, causing
      // their old likes to fall out of the cached Set. Heart showed un-highlighted
      // on previously-liked posts; tap re-liked → upsert no-op + optimistic drift
      // (count bumps but heart clears on re-render because new fetch still
      // didn't include the uploadId). UUID rows are tiny — 10k = ~360KB, fine.
      const { data, error } = await supabase
        .from('likes')
        .select('upload_id')
        .eq('user_id', user!.id)
        .range(0, 9999);
      if (error) throw error;
      const fresh = new Set((data ?? []).map((r) => r.upload_id as string));

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

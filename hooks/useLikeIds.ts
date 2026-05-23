import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useLikeIds() {
  const user = useAuthStore((s) => s.user);
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
      return new Set((data ?? []).map((r) => r.upload_id as string));
    },
    enabled: !!user,
    // Always refetch when consuming components mount — fixes cross-session
    // bug where a post the user liked in a prior session shows the like_count
    // but heart is NOT highlighted after app reload, because the cached set
    // was empty and was being served stale. Network cost is one tiny query
    // per mount of the heart-aware screens.
    refetchOnMount: 'always',
    staleTime: 60_000,
  });
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useFollowingIds() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['followingIds', user?.id],
    queryFn: async () => {
      // Paginate in 1000-row chunks. PostgREST caps a single read at 1000 rows
      // regardless of .limit/.range, so the previous flat .limit(500) silently
      // dropped follows for anyone following >500 accounts (their follow-state
      // UI went stale past 500). See useLikeIds for the same pattern + lesson.
      const all: string[] = [];
      const PAGE = 1000;
      for (let offset = 0; ; offset += PAGE) {
        const { data, error } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user!.id)
          .range(offset, offset + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const r of data) all.push(r.following_id as string);
        if (data.length < PAGE) break;
      }
      return new Set(all);
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}

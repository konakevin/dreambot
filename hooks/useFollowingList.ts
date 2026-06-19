import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { FollowUser } from './useFollowersList';

export function useFollowingList(userId: string) {
  return useQuery({
    queryKey: ['followingList', userId],
    queryFn: async () => {
      // Paginate in 1000-row chunks (PostgREST's hard 1000-row cap made the old
      // .limit(500) silently truncate the following list past 500).
      const all: FollowUser[] = [];
      const PAGE = 1000;
      for (let offset = 0; ; offset += PAGE) {
        const { data, error } = await supabase
          .from('follows')
          .select('users!following_id(id, username, avatar_url)')
          .eq('follower_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const r of data) all.push(r.users as FollowUser);
        if (data.length < PAGE) break;
      }
      return all;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

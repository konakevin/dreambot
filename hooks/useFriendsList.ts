import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface FriendUser {
  id: string;
  username: string;
  avatar_url: string | null;
  user_rank: string | null;
}

export function useFriendsList(userId: string) {
  return useQuery({
    queryKey: ['friendsList', userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_friend_ids', { p_user_id: userId });
      if (error) throw error;
      const ids = (data ?? []).map((r: { friend_id: string }) => r.friend_id);
      if (ids.length === 0) return [];

      const { data: users, error: usersErr } = await supabase
        .from('users')
        .select('id, username, avatar_url, user_rank')
        .in('id', ids);
      if (usersErr) throw usersErr;
      // Deduplicate by id
      const seen = new Set<string>();
      return ((users ?? []) as FriendUser[]).filter((u) => {
        if (seen.has(u.id)) return false;
        seen.add(u.id);
        return true;
      });
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

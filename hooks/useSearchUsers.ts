import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface SearchUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  userRank: string | null;
}

export function useSearchUsers(query: string) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['searchUsers', query],
    queryFn: async (): Promise<SearchUser[]> => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url, user_rank')
        .ilike('username', `%${query}%`)
        .neq('id', user!.id)
        .limit(20);

      if (error) throw error;
      return (data ?? []).map((u) => ({
        id: u.id,
        username: u.username,
        avatarUrl: u.avatar_url,
        userRank: u.user_rank,
      }));
    },
    enabled: !!user && query.trim().length >= 2,
    staleTime: 30_000,
  });
}

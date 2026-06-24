import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useBlockedIds } from '@/hooks/useBlockUser';

export interface SearchUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  isPublic: boolean;
}

export function useSearchUsers(query: string) {
  const user = useAuthStore((s) => s.user);
  // Users I've blocked shouldn't surface in search. (The reverse direction —
  // someone who blocked me — is already invisible: their blocked_users rows are
  // RLS-hidden from me, and get_public_profile blocks opening their profile.)
  const { data: blockedIds } = useBlockedIds();

  return useQuery({
    queryKey: ['searchUsers', query, blockedIds ? blockedIds.size : 0],
    queryFn: async (): Promise<SearchUser[]> => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url, is_public')
        .ilike('username', `%${query}%`)
        .neq('id', user!.id)
        .limit(20);

      if (error) throw error;
      return (data ?? [])
        .filter((u) => !blockedIds?.has(u.id))
        .map((u) => ({
          id: u.id,
          username: u.username,
          avatarUrl: u.avatar_url,
          isPublic: ((u as Record<string, unknown>).is_public as boolean) ?? true,
        }));
    },
    enabled: !!user && query.trim().length >= 2,
    staleTime: 30_000,
  });
}

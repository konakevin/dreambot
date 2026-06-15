import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface UsernameStatus {
  username: string;
  /** false until the user deliberately picks/confirms their @handle. Email
   *  signups land true (typed at signup); auto-assigned OAuth handles land
   *  false and can still be changed until confirmed. */
  confirmed: boolean;
}

/**
 * Reads the current user's handle + whether it's been confirmed (locked).
 * Drives the home-tab claim nudge and the Settings username row. A direct
 * select (not the get_public_profile RPC) so the new column needs no RPC
 * change. Invalidate ['usernameStatus', userId] after a confirm.
 */
export function useUsernameStatus() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['usernameStatus', user?.id],
    enabled: !!user?.id,
    staleTime: 60_000,
    queryFn: async (): Promise<UsernameStatus | null> => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('users')
        .select('username, username_confirmed')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return { username: data.username, confirmed: data.username_confirmed };
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface BlockedUser {
  user_id: string;
  username: string;
  avatar_url: string | null;
  blocked_at: string;
}

export function useBlockedIds() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['blockedIds', user?.id],
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('blocked_id')
        .eq('blocker_id', user!.id);

      if (error) throw error;
      return new Set((data ?? []).map((r) => r.blocked_id));
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}

/** Full list of users the current user has blocked (for the management screen). */
export function useBlockedUsers() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['blockedUsers', user?.id],
    queryFn: async (): Promise<BlockedUser[]> => {
      const { data, error } = await supabase.rpc('get_blocked_users');
      if (error) throw error;
      return (data ?? []) as BlockedUser[];
    },
    enabled: !!user,
    staleTime: 30_000,
  });
}

export function useToggleBlock() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      currentlyBlocked,
    }: {
      userId: string;
      currentlyBlocked: boolean;
    }) => {
      if (currentlyBlocked) {
        // Unblock — RLS lets a user delete their own block rows.
        const { error } = await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', user!.id)
          .eq('blocked_id', userId);
        if (error) throw error;
      } else {
        // Block — use the atomic RPC so it ALSO severs follows + follow
        // requests in both directions (a raw insert would skip that).
        const { error } = await supabase.rpc('block_user', { p_blocked_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Block severs follows + hides content both ways, so refresh the social graph.
      queryClient.invalidateQueries({ queryKey: ['blockedIds', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['blockedUsers', user?.id] });
      // block_user severs the follow in BOTH directions server-side, so the
      // cached following set is now stale — without this the Follow/Following
      // pill keeps showing "Following" on a user you just blocked.
      queryClient.invalidateQueries({ queryKey: ['followingIds', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
      queryClient.invalidateQueries({ queryKey: ['shareableVibers', user?.id] });
    },
  });
}

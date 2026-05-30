import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Distinct unread notification GROUPS for the current user (per migration
 * 202's `get_unread_group_count`). 14 likes on one post count as **1**
 * unread — matches IG/TikTok inbox-badge semantics (D6).
 *
 * Sibling to the legacy `useUnreadCount` (per-row count). When the inbox UI
 * rewrite ships, `useBadgeSync` and the profile-tab dot switch over to this.
 *
 * Same refetch strategy as legacy: realtime-driven primary; mount + 30s
 * polling as safety nets.
 */
export function useUnreadGroupCount() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['unreadGroupCount', user?.id],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc('get_unread_group_count', {
        p_user_id: user!.id,
      });
      if (error) return 0;
      return (data as number | null) ?? 0;
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchInterval: 30_000,
  });
}

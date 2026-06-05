import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Count of notification groups created since the user's last inbox view
 * (`users.last_inbox_view_at`). Drives the profile-tab dot and the
 * inbox-bubble pip on the own-profile top bar.
 *
 * Replaces `useUnreadGroupCount` (which counted per-row seen_at).
 * "Viewed = read": opening the inbox sets last_inbox_view_at = now() via
 * useMarkInboxViewed → this count drops to 0 for everything currently in
 * the inbox. The next push or comment that lands afterward bumps it
 * back up.
 *
 * Same refetch strategy as the hook it replaces: realtime-driven primary;
 * mount + 30s polling as safety nets.
 */
export function useNewNotificationCount() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['newNotificationCount', user?.id],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc('get_new_notification_count', {
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

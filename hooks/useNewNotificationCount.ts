import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Count of notifications created since the user's last inbox view
 * (`users.last_inbox_view_at`). Migration 223 model. Drives:
 *   - the profile-tab dot (app/(tabs)/_layout.tsx)
 *   - the iOS app-icon badge (hooks/useBadgeSync)
 *   - the inbox-bubble pip on the own-profile top bar
 *
 * Three writers can flip last_inbox_view_at and clear this count:
 *   - opening the inbox (app/inbox.tsx useFocusEffect)
 *   - tapping any push notification (lib/notificationRouting.ts)
 *   - tapping any inbox row (lib/notificationRouting.ts via markSeen: true)
 *
 * Next push or comment that lands after bumps it back up.
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

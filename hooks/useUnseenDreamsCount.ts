import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Count of the user's dream renders that landed in the Dreams album since they
 * last viewed it (`users.last_dreams_view_at`, migration 397). The album-side
 * companion to useNewNotificationCount — manual (user-made) dreams no longer hit
 * the inbox (migration 396), so this is their "something new" signal. Drives:
 *   - the Profile tab dot (app/(tabs)/_layout.tsx), combined with the inbox count
 *   - the Dreams sub-tab dot (app/(tabs)/profile.tsx)
 *
 * Cleared by useMarkDreamsViewed when the user opens the Dreams album. Same
 * refetch strategy as the notification count: realtime-driven primary (the
 * uploads-INSERT binding in app/_layout.tsx invalidates this key on completion),
 * with mount + 30s polling + foreground as safety nets, since iOS drops the
 * socket in background and postgres_changes never replays.
 */
export function useUnseenDreamsCount() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['unseenDreamsCount', userId],
    queryFn: async (): Promise<number> => {
      if (!userId) return 0;
      const { data, error } = await supabase.rpc('get_unseen_dreams_count', {
        p_user_id: userId,
      });
      if (error) return 0;
      return (data as number | null) ?? 0;
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchInterval: 30_000,
  });
}

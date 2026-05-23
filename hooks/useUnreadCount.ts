import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useUnreadCount() {
  const user = useAuthStore((s) => s.user);

  // Aggressive refetching: the COUNT(*) query is cheap (head-only) and the
  // unread badge is a critical UX surface — users notice when it doesn't
  // update after a render completes. Settings:
  //   • staleTime: 0           — never trust the cache; recompute when asked
  //   • refetchOnMount: always — every screen that reads this gets a fresh value
  //   • refetchInterval: 30s   — catches notifications even if the realtime
  //                              channel dropped (background → foreground edge)
  // Realtime invalidation in app/_layout.tsx still fires on INSERT for the
  // primary "instant" path; these settings are the safety net.
  return useQuery({
    queryKey: ['unreadNotificationCount', user?.id],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user!.id)
        .is('seen_at', null);
      if (error) return 0;
      return count ?? 0;
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchInterval: 30_000,
  });
}

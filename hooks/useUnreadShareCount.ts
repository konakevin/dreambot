import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useUnreadShareCount() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['unreadNotificationCount', user?.id],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc('get_unread_notification_count', {
        p_user_id: user!.id,
      });

      if (error) throw error;
      return (data as number) ?? 0;
    },
    enabled: !!user,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

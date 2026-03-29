import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useUnreadShareCount() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['unreadShareCount', user?.id],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc('get_unread_share_count', {
        p_user_id: user!.id,
      });

      if (error) throw error;
      return (data as number) ?? 0;
    },
    enabled: !!user,
    staleTime: 15_000, // Check frequently for badge freshness
    refetchInterval: 30_000, // Poll every 30s for new shares
  });
}

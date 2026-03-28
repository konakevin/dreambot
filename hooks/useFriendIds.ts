import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useFriendIds() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['friendIds', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_friend_ids', { p_user_id: user!.id });
      if (error) throw error;
      return new Set<string>((data ?? []).map((r: { friend_id: string }) => r.friend_id));
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}

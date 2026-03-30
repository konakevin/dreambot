import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export type FriendshipStatus = 'none' | 'pending_sent' | 'pending_received' | 'friends';

export function useFriendshipStatus(targetId: string) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['friendshipStatus', user?.id, targetId],
    queryFn: async (): Promise<FriendshipStatus> => {
      const userA = user!.id < targetId ? user!.id : targetId;
      const userB = user!.id < targetId ? targetId : user!.id;

      const { data, error } = await supabase
        .from('friendships')
        .select('status, requester')
        .eq('user_a', userA)
        .eq('user_b', userB)
        .maybeSingle();

      if (error) throw error;
      if (!data) return 'none';
      if (data.status === 'accepted') return 'friends';
      if (data.requester === user!.id) return 'pending_sent';
      return 'pending_received';
    },
    enabled: !!user && !!targetId && user.id !== targetId,
    staleTime: 15_000,
    refetchOnMount: 'always',
  });
}

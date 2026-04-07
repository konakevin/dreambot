import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { FriendshipStatus } from '@/hooks/useFriendshipStatus';

export function useSendFriendRequest() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetId: string) => {
      const { error } = await supabase.rpc('send_friend_request', { p_target_id: targetId });
      if (error) throw error;
    },
    onMutate: async (targetId) => {
      // Optimistically flip to "pending_sent" so the button updates instantly
      const key = ['friendshipStatus', user?.id, targetId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<FriendshipStatus>(key);
      queryClient.setQueryData<FriendshipStatus>(key, 'pending_sent');
      return { previous, key };
    },
    onError: (_err, _targetId, context) => {
      if (context) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['friendshipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    },
  });
}

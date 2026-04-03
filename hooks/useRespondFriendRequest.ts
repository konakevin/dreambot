import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { FriendshipStatus } from '@/hooks/useFriendshipStatus';

export function useRespondFriendRequest() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requesterId, accept }: { requesterId: string; accept: boolean }) => {
      const { error } = await supabase.rpc('respond_friend_request', {
        p_requester_id: requesterId,
        p_accept: accept,
      });
      if (error) throw error;
    },
    onMutate: async ({ requesterId, accept }) => {
      // Optimistically update friendship status so UI reacts instantly
      const key = ['friendshipStatus', user?.id, requesterId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<FriendshipStatus>(key);
      queryClient.setQueryData<FriendshipStatus>(key, accept ? 'friends' : 'none');

      // Optimistically remove from pending requests list
      await queryClient.cancelQueries({ queryKey: ['pendingRequests'] });
      const previousPending = queryClient.getQueryData(['pendingRequests', user?.id]);
      queryClient.setQueryData(
        ['pendingRequests', user?.id],
        (old: Record<string, unknown>[] | undefined) =>
          old?.filter((r) => r.requesterId !== requesterId) ?? []
      );

      return { previous, key, previousPending };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(context.key, context.previous);
        queryClient.setQueryData(['pendingRequests', user?.id], context.previousPending);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['friendIds'] });
      queryClient.invalidateQueries({ queryKey: ['friendsList'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
      queryClient.invalidateQueries({ queryKey: ['followersList'] });
      queryClient.invalidateQueries({ queryKey: ['followingList'] });
      queryClient.invalidateQueries({ queryKey: ['followingIds'] });
      queryClient.invalidateQueries({ queryKey: ['friendshipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}

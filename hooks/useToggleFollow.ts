import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

const fromRequests = () => (supabase.from as Function)('follow_requests');

interface ToggleArgs {
  userId: string;
  currentlyFollowing: boolean;
  /** Whether the target account is public. If false (private) and not following, sends a request instead. */
  isPublic?: boolean;
  /** Whether there's already a pending follow request. If true, cancels it. */
  hasRequest?: boolean;
}

export function useToggleFollow() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const followKey = ['followingIds', user?.id];
  const requestKey = ['outgoingFollowRequests', user?.id];

  return useMutation({
    mutationFn: async ({ userId, currentlyFollowing, isPublic = true, hasRequest }: ToggleArgs) => {
      if (currentlyFollowing) {
        // Unfollow — always direct delete
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user!.id)
          .eq('following_id', userId);
        if (error) throw error;
      } else if (hasRequest) {
        // Cancel pending request
        const { error } = await fromRequests()
          .delete()
          .eq('requester_id', user!.id)
          .eq('target_id', userId);
        if (error) throw error;
      } else if (!isPublic) {
        // Private account — send follow request
        const { error } = await fromRequests().insert({
          requester_id: user!.id,
          target_id: userId,
        });
        if (error) throw error;
        // Notify the target
        await supabase.from('notifications').insert({
          recipient_id: userId,
          actor_id: user!.id,
          type: 'follow_request',
          body: null,
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        // Public account — instant follow
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: user!.id, following_id: userId });
        if (error) throw error;
      }
    },
    onMutate: async ({ userId, currentlyFollowing, isPublic = true, hasRequest }) => {
      // Optimistic updates for follow/unfollow
      if (currentlyFollowing || isPublic) {
        await qc.cancelQueries({ queryKey: followKey });
        const previous = qc.getQueryData<Set<string>>(followKey);
        qc.setQueryData<Set<string>>(followKey, (old = new Set()) => {
          const next = new Set(old);
          if (currentlyFollowing) next.delete(userId);
          else if (isPublic) next.add(userId);
          return next;
        });
        return { previous };
      }
      // Optimistic updates for request send/cancel
      if (hasRequest || !isPublic) {
        await qc.cancelQueries({ queryKey: requestKey });
        const previousReqs = qc.getQueryData<Set<string>>(requestKey);
        qc.setQueryData<Set<string>>(requestKey, (old = new Set()) => {
          const next = new Set(old);
          if (hasRequest) next.delete(userId);
          else next.add(userId);
          return next;
        });
        return { previousReqs };
      }
      return {};
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(followKey, ctx.previous);
      if (ctx?.previousReqs) qc.setQueryData(requestKey, ctx.previousReqs);
    },
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['publicProfile', userId] });
      qc.invalidateQueries({ queryKey: ['publicProfile', user?.id] });
      qc.invalidateQueries({ queryKey: ['followersList', userId] });
      qc.invalidateQueries({ queryKey: ['followersList', user?.id] });
      qc.invalidateQueries({ queryKey: ['followingList', user?.id] });
      qc.invalidateQueries({ queryKey: ['followingIds', user?.id] });
      qc.invalidateQueries({ queryKey: ['outgoingFollowRequests', user?.id] });
    },
  });
}

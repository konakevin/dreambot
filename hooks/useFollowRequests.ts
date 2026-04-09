/**
 * Follow request hooks for private account approval flow.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';

// follow_requests table isn't in generated types yet — helper to bypass
const fromRequests = () => (supabase.from as Function)('follow_requests');
const rpc = (name: string, params: Record<string, unknown>) =>
  (supabase.rpc as Function)(name, params);

/** IDs of users we've sent follow requests to (pending) */
export function useOutgoingFollowRequestIds() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['outgoingFollowRequests', userId],
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await fromRequests().select('target_id').eq('requester_id', userId!);
      if (error) throw error;
      return new Set(((data ?? []) as { target_id: string }[]).map((r) => r.target_id));
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

/** Approve a follow request (called by the target user) */
export function useApproveFollowRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requesterId: string) => {
      const { error } = await rpc('approve_follow_request', {
        p_requester_id: requesterId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
      queryClient.invalidateQueries({ queryKey: ['followersList'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
    },
    onError: () => {
      Toast.show('Failed to approve', 'close-circle');
    },
  });
}

/** Deny a follow request (called by the target user) */
export function useDenyFollowRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requesterId: string) => {
      const { error } = await rpc('deny_follow_request', {
        p_requester_id: requesterId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}

/** Cancel an outgoing follow request */
export function useCancelFollowRequest() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: async (targetId: string) => {
      const { error } = await fromRequests()
        .delete()
        .eq('requester_id', userId!)
        .eq('target_id', targetId);
      if (error) throw error;
    },
    onSuccess: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      queryClient.invalidateQueries({ queryKey: ['outgoingFollowRequests'] });
    },
  });
}

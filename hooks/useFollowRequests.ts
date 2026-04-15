/**
 * Follow request hooks for private account approval flow.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';

/** IDs of users we've sent follow requests to (pending) */
export function useOutgoingFollowRequestIds() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['outgoingFollowRequests', userId],
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase
        .from('follow_requests')
        .select('target_id')
        .eq('requester_id', userId!);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.target_id));
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
      const { error } = await supabase.rpc('approve_follow_request', {
        p_requester_id: requesterId,
      });
      if (error) throw error;
    },
    onSuccess: (_data, requesterId) => {
      const userId = useAuthStore.getState().user?.id;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['inbox', userId] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount', userId] });
      queryClient.invalidateQueries({ queryKey: ['followersList', userId] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile', requesterId] });
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
      const { error } = await supabase.rpc('deny_follow_request', {
        p_requester_id: requesterId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      const userId = useAuthStore.getState().user?.id;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      queryClient.invalidateQueries({ queryKey: ['inbox', userId] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount', userId] });
    },
  });
}

/** Approve a follow request AND follow the requester back */
export function useApproveFollowAndFollowBack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requesterId: string) => {
      const { error } = await supabase.rpc('approve_follow_and_follow_back', {
        p_requester_id: requesterId,
      });
      if (error) throw error;
    },
    onSuccess: (_data, requesterId) => {
      const userId = useAuthStore.getState().user?.id;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['inbox', userId] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount', userId] });
      queryClient.invalidateQueries({ queryKey: ['followersList', userId] });
      queryClient.invalidateQueries({ queryKey: ['followingList', userId] });
      queryClient.invalidateQueries({ queryKey: ['followingIds', userId] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile', requesterId] });
    },
    onError: () => {
      Toast.show('Failed to approve', 'close-circle');
    },
  });
}

/** Cancel an outgoing follow request */
export function useCancelFollowRequest() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: async (targetId: string) => {
      const { error } = await supabase
        .from('follow_requests')
        .delete()
        .eq('requester_id', userId!)
        .eq('target_id', targetId);
      if (error) throw error;
    },
    onSuccess: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      queryClient.invalidateQueries({ queryKey: ['outgoingFollowRequests', userId] });
    },
  });
}

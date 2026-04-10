import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';

export function useDeletePost() {
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: async (uploadId: string) => {
      if (isAdmin) {
        // Admin always uses RPC (bypasses RLS)
        const { error } = await supabase.rpc(
          'admin_delete_upload' as never,
          {
            p_upload_id: uploadId,
          } as never
        );
        if (error) throw error;
      } else {
        // Regular user — direct delete (RLS enforces ownership)
        const { error } = await supabase.from('uploads').delete().eq('id', uploadId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Dream deleted', 'checkmark-circle');
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfilePosts'] });
      queryClient.invalidateQueries({ queryKey: ['favoritePosts'] });
    },
    onError: (err) => {
      if (__DEV__) console.error('[useDeletePost] Error:', err);
      Toast.show('Failed to delete dream', 'close-circle');
    },
  });
}

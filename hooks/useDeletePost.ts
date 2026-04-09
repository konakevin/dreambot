import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/Toast';

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uploadId: string) => {
      const { error } = await supabase.from('uploads').delete().eq('id', uploadId);
      if (error) throw error;
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Dream deleted', 'checkmark-circle');
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['dreamFeed'] });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
    },
    onError: (err) => {
      if (__DEV__) console.error('[useDeletePost] Error:', err);
      Toast.show('Failed to delete dream', 'close-circle');
    },
  });
}

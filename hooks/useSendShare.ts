import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

interface SendShareArgs {
  uploadId: string;
  receiverIds: string[];
}

export function useSendShare() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uploadId, receiverIds }: SendShareArgs) => {
      const rows = receiverIds.map((receiverId) => ({
        sender_id: user!.id,
        receiver_id: receiverId,
        upload_id: uploadId,
      }));

      const { error } = await supabase.from('post_shares').insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['unreadShareCount'] });
    },
  });
}

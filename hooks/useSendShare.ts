import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { ShareableViber } from '@/hooks/useShareableVibers';

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
    onSuccess: (_, { receiverIds }) => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });

      // Optimistically bump interaction counts so ordering updates without a refetch
      queryClient.setQueryData<ShareableViber[]>(['shareableVibers', user?.id], (old) => {
        if (!old) return old;
        const receiverSet = new Set(receiverIds);
        const updated = old.map((v) =>
          receiverSet.has(v.userId) ? { ...v, interactionCount: v.interactionCount + 1 } : v
        );
        // Re-sort: interaction count DESC, vibe score DESC
        return updated.sort(
          (a, b) => b.interactionCount - a.interactionCount || b.vibeScore - a.vibeScore
        );
      });
    },
  });
}

/**
 * usePinPost — pin/unpin a post to the top of the owner's profile grid
 * (migration 330, Instagram model — see PINNED_POSTS_PLAN.md).
 *
 * Writes go through the pin_post/unpin_post RPCs so the cap
 * (engine_config.max_pinned_posts, default 3) is enforced server-side; the
 * client's only job is a friendly alert on `pin_limit_reached` and a cache
 * refresh so the grid reorders. No optimistic reorder — the grid animates a
 * refetch fast enough, and optimistic re-sorting an infinite query's pages
 * is where the bugs live.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';

export function usePinPost() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['userPosts', user?.id] });
    if (user?.id) qc.invalidateQueries({ queryKey: ['publicProfilePosts', user.id] });
  };

  const pin = useMutation({
    mutationFn: async (uploadId: string) => {
      const { error } = await supabase.rpc('pin_post', { p_upload_id: uploadId });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      Toast.show('Pinned to your profile', 'pin');
    },
    onError: (err: { message?: string }) => {
      if (err?.message?.includes('pin_limit_reached')) {
        showAlert('Pin limit reached', 'You can pin up to 3 posts. Unpin one first.', [
          { text: 'OK' },
        ]);
      } else {
        Toast.show("Couldn't pin that post", 'close-circle');
      }
    },
  });

  const unpin = useMutation({
    mutationFn: async (uploadId: string) => {
      const { error } = await supabase.rpc('unpin_post', { p_upload_id: uploadId });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      Toast.show('Unpinned', 'checkmark-circle');
    },
    onError: () => Toast.show("Couldn't unpin that post", 'close-circle'),
  });

  return { pin: pin.mutate, unpin: unpin.mutate };
}

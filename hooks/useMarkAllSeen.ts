import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { NotificationItem } from './useInbox';

export function useMarkAllSeen() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ seen_at: new Date().toISOString() })
        .eq('recipient_id', user!.id)
        .is('seen_at', null);

      if (error) throw error;
    },
    onMutate: async () => {
      // Optimistic update — mark all seen locally without refetching
      queryClient.setQueryData<InfiniteData<NotificationItem[]>>(['inbox'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((n) => ({ ...n, isSeen: true }))
          ),
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}

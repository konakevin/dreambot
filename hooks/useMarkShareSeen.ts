import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { NotificationItem } from './useInbox';

export function useMarkShareSeen() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ seen_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onMutate: async (notificationId) => {
      // Optimistic update — mark seen locally without refetching
      queryClient.setQueriesData<InfiniteData<NotificationItem[]>>(
        { queryKey: ['inbox'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((n) => (n.id === notificationId ? { ...n, isSeen: true } : n))
            ),
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount', user?.id] });
    },
  });
}

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { NotificationItem } from './useInbox';

interface InboxPage {
  rows: NotificationItem[];
  hasMore: boolean;
  nextOffset: number;
}

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
      // Optimistic update — mark all seen locally + zero the badge count.
      // Inbox page shape is { rows, hasMore, nextOffset } — must map page.rows,
      // not page itself (page.map would throw and abort the mutation).
      queryClient.setQueryData<InfiniteData<InboxPage>>(['inbox', user!.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            rows: page.rows.map((n) => ({ ...n, isSeen: true })),
          })),
        };
      });
      // Optimistically zero the tab badge so it clears immediately on screen
      // entry — server roundtrip otherwise leaves the red dot up for a beat.
      queryClient.setQueryData<number>(['unreadNotificationCount', user!.id], 0);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', user!.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount', user!.id] });
    },
  });
}

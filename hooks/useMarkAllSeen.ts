import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Marks every unseen notification on the current user as seen, then refreshes
 * the grouped inbox + distinct-group badge.
 *
 * Optimistic: zeroes the badge cache and flips `anyUnseen=false` on every
 * cached grouped page so the red dot clears the instant the inbox screen
 * mounts (the server roundtrip otherwise leaves it up for a beat).
 *
 * The legacy per-row inbox cache (`['inbox']` + `['unreadNotificationCount']`)
 * was dropped in Phase 4 along with the `useInbox` / `useUnreadCount` hooks.
 */
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
      queryClient.setQueryData<number>(['unreadGroupCount', user!.id], 0);
      queryClient.setQueryData(['inboxGrouped', user!.id], (data: unknown) => {
        if (!data || typeof data !== 'object') return data;
        const d = data as { pages?: { groups: { anyUnseen: boolean }[] }[] };
        if (!d.pages) return data;
        return {
          ...d,
          pages: d.pages.map((p) => ({
            ...p,
            groups: p.groups.map((g) => ({ ...g, anyUnseen: false })),
          })),
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['inboxGrouped', user!.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadGroupCount', user!.id] });
    },
  });
}

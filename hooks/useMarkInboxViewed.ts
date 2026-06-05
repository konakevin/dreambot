import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * "Viewed = read" — fired ONCE on inbox focus (migration 223). Sets
 * `users.last_inbox_view_at = now()` so the per-row "new since last view"
 * flag flips to false for everything currently in the inbox.
 *
 * Replaces the old per-row mark_group_seen + bulk mark-all-seen combo:
 * instead of tracking which group the user tapped, we just record the
 * moment they opened the inbox. Anything older = read. Anything newer
 * = "new" pip.
 *
 * Also fired by the push-tap path (lib/notificationRouting.ts) via the
 * `mark_inbox_viewed` RPC equivalent — any notification tap clears the
 * iOS app-icon badge, not just opening the inbox.
 *
 * Optimistic: zeroes the badge cache + flips every cached `isNewSinceView`
 * to false so the dot clears the instant the inbox mounts. The server
 * roundtrip otherwise leaves a noticeable beat where the badge stays up.
 */
export function useMarkInboxViewed() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('users')
        .update({ last_inbox_view_at: new Date().toISOString() })
        .eq('id', user!.id);
      if (error) throw error;
    },
    onMutate: () => {
      qc.setQueryData<number>(['newNotificationCount', user!.id], 0);
      qc.setQueryData(['inboxGrouped', user!.id], (data: unknown) => {
        if (!data || typeof data !== 'object') return data;
        const d = data as { pages?: { groups: { isNewSinceView: boolean }[] }[] };
        if (!d.pages) return data;
        return {
          ...d,
          pages: d.pages.map((p) => ({
            ...p,
            groups: p.groups.map((g) => ({ ...g, isNewSinceView: false })),
          })),
        };
      });
    },
    onSettled: () => {
      // Reconcile from server in case a new notification landed between
      // the mutation kicking off and the server returning.
      qc.invalidateQueries({ queryKey: ['newNotificationCount', user?.id] });
      qc.invalidateQueries({ queryKey: ['inboxGrouped', user?.id] });
    },
  });
}

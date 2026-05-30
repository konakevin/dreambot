import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Marks every notification row in a single group seen for the current user.
 *
 * Triggered when the user taps a group card in the inbox — sets seen_at on all
 * underlying rows via the `mark_group_seen` RPC (migration 202). The per-row
 * `seen_at` is still the source of truth; this is the bulk convenience over
 * one group_key.
 *
 * Optimistic update: marks the group as seen in the cached inbox immediately,
 * and bumps the unread-group count down by 1 if the group was previously unread.
 * Rolls back on error.
 */
export function useMarkGroupSeen() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  // Target the grouped-hook caches (useInboxGrouped + useUnreadGroupCount).
  // The legacy useInbox / useUnreadCount caches are unaffected — they'll get
  // their freshness from realtime invalidation in app/_layout.tsx as today.
  const inboxKey = ['inboxGrouped', user?.id];
  const unreadKey = ['unreadGroupCount', user?.id];

  return useMutation({
    mutationFn: async (groupKey: string) => {
      const { error } = await supabase.rpc('mark_group_seen', {
        p_user_id: user!.id,
        p_group_key: groupKey,
      });
      if (error) throw error;
    },
    onMutate: async (groupKey) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: inboxKey }),
        qc.cancelQueries({ queryKey: unreadKey }),
      ]);

      const prevInbox = qc.getQueryData(inboxKey);
      const prevUnread = qc.getQueryData<number>(unreadKey);

      // Flip anyUnseen=false on the matching group in every cached page.
      let wasUnseen = false;
      qc.setQueryData(inboxKey, (data: unknown) => {
        if (!data || typeof data !== 'object') return data;
        const d = data as { pages?: { groups: { groupKey: string; anyUnseen: boolean }[] }[] };
        if (!d.pages) return data;
        return {
          ...d,
          pages: d.pages.map((p) => ({
            ...p,
            groups: p.groups.map((g) => {
              if (g.groupKey !== groupKey) return g;
              if (g.anyUnseen) wasUnseen = true;
              return { ...g, anyUnseen: false };
            }),
          })),
        };
      });

      if (wasUnseen && typeof prevUnread === 'number') {
        qc.setQueryData(unreadKey, Math.max(0, prevUnread - 1));
      }

      return { prevInbox, prevUnread };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevInbox !== undefined) qc.setQueryData(inboxKey, ctx.prevInbox);
      if (ctx?.prevUnread !== undefined) qc.setQueryData(unreadKey, ctx.prevUnread);
    },
    onSettled: () => {
      // Reconcile with server in case our optimistic accounting drifted
      // (e.g., a new row landed in the group between read + tap).
      qc.invalidateQueries({ queryKey: inboxKey });
      qc.invalidateQueries({ queryKey: unreadKey });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Deletes every notification row in a single group for the current user
 * (via the `delete_group` RPC, migration 203). Used by long-press → confirm
 * + select-mode bulk delete on the grouped inbox.
 *
 * Optimistic remove: drops the group from the cached inbox immediately, and
 * decrements the unread-group count by 1 if it had been unread. Rolls back
 * on error.
 */
export function useDeleteGroup() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const inboxKey = ['inboxGrouped', user?.id];
  const unreadKey = ['unreadGroupCount', user?.id];

  return useMutation({
    mutationFn: async (groupKey: string) => {
      const { error } = await supabase.rpc('delete_group', {
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

      // Remove the matching group from every cached page.
      let wasUnseen = false;
      qc.setQueryData(inboxKey, (data: unknown) => {
        if (!data || typeof data !== 'object') return data;
        const d = data as {
          pages?: { groups: { groupKey: string; anyUnseen: boolean }[] }[];
        };
        if (!d.pages) return data;
        return {
          ...d,
          pages: d.pages.map((p) => ({
            ...p,
            groups: p.groups.filter((g) => {
              if (g.groupKey !== groupKey) return true;
              if (g.anyUnseen) wasUnseen = true;
              return false;
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
      qc.invalidateQueries({ queryKey: inboxKey });
      qc.invalidateQueries({ queryKey: unreadKey });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Deletes every notification row in a single group for the current user
 * (via the `delete_group` RPC, migration 203). Used by long-press → confirm
 * + select-mode bulk delete on the grouped inbox.
 *
 * Optimistic remove: drops the group from the cached inbox immediately, and
 * decrements the new-notification count by 1 if the group was new-since-view
 * (migration 223 model). Rolls back on error.
 */
export function useDeleteGroup() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const inboxKey = ['inboxGrouped', user?.id];
  const newCountKey = ['newNotificationCount', user?.id];

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
        qc.cancelQueries({ queryKey: newCountKey }),
      ]);

      const prevInbox = qc.getQueryData(inboxKey);
      const prevNewCount = qc.getQueryData<number>(newCountKey);

      // Remove the matching group from every cached page.
      let wasNew = false;
      qc.setQueryData(inboxKey, (data: unknown) => {
        if (!data || typeof data !== 'object') return data;
        const d = data as {
          pages?: { groups: { groupKey: string; isNewSinceView: boolean }[] }[];
        };
        if (!d.pages) return data;
        return {
          ...d,
          pages: d.pages.map((p) => ({
            ...p,
            groups: p.groups.filter((g) => {
              if (g.groupKey !== groupKey) return true;
              if (g.isNewSinceView) wasNew = true;
              return false;
            }),
          })),
        };
      });

      if (wasNew && typeof prevNewCount === 'number') {
        qc.setQueryData(newCountKey, Math.max(0, prevNewCount - 1));
      }
      return { prevInbox, prevNewCount };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevInbox !== undefined) qc.setQueryData(inboxKey, ctx.prevInbox);
      if (ctx?.prevNewCount !== undefined) qc.setQueryData(newCountKey, ctx.prevNewCount);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: inboxKey });
      qc.invalidateQueries({ queryKey: newCountKey });
    },
  });
}

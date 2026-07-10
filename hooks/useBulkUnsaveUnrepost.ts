/**
 * Bulk unsave / unrepost — the Saved + Reposts grid multi-select (2026-07-10).
 * Both are REVERSIBLE (re-save / re-repost anytime), so no confirm ceremony:
 * optimistic removal from the relevant grid cache + one summary toast, with a
 * snapshot restore on error. Mirrors useBulkMakePrivate's contract.
 *
 * Deletes go direct-to-PostgREST (RLS: favorites delete = own user_id;
 * post_reposts delete = own reposter_id) and the save_count / repost_count
 * counter triggers fire automatically.
 */
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { removeUploadFromPages } from '@/lib/feedHelpers';
import { Toast } from '@/components/Toast';
import type { DreamPostItem } from '@/components/DreamCard';

type Page = { rows: DreamPostItem[]; offset: number; hasMore: boolean };

/** Shared optimistic-removal engine over an infinite-query grid cache. */
function useBulkRemove(opts: {
  gridKey: string; // 'favoritePosts' | 'userReposts'
  idsKey: string; // 'favoriteIds' | 'repostIds' — invalidated so fill-state syncs
  run: (uploadIds: string[], uid: string) => Promise<void>;
  noun: string; // 'saved' | 'repost'
  failMsg: string;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (uploadIds: string[]) => {
      const uid = useAuthStore.getState().user?.id;
      if (!uid) throw new Error('not signed in');
      await opts.run(uploadIds, uid);
      return { count: uploadIds.length };
    },
    onMutate: async (uploadIds: string[]) => {
      const ids = new Set(uploadIds);
      const snapshots = new Map<string, unknown>();
      await qc.cancelQueries({ queryKey: [opts.gridKey] });
      for (const query of qc.getQueryCache().findAll({ queryKey: [opts.gridKey] })) {
        const prev = qc.getQueryData<InfiniteData<Page>>(query.queryKey);
        if (!prev) continue;
        snapshots.set(JSON.stringify(query.queryKey), prev);
        let pages = prev.pages;
        for (const id of ids) pages = removeUploadFromPages(pages, id) as Page[];
        qc.setQueryData<InfiniteData<Page>>(query.queryKey, { ...prev, pages });
      }
      return { snapshots };
    },
    onSuccess: ({ count }) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const label =
        opts.noun === 'saved'
          ? `Removed ${count} from saved`
          : `Removed ${count} repost${count === 1 ? '' : 's'}`;
      Toast.show(label, 'checkmark-circle');
      // Sync the per-post fill state (heart/repost icons on other surfaces).
      qc.invalidateQueries({ queryKey: [opts.idsKey] });
    },
    onError: (_err, _vars, ctx) => {
      if (__DEV__) console.error(`[${opts.gridKey}] bulk remove error:`, _err);
      Toast.show(opts.failMsg, 'close-circle');
      if (ctx?.snapshots) {
        for (const [keyStr, data] of ctx.snapshots) qc.setQueryData(JSON.parse(keyStr), data);
      }
    },
  });
}

export function useBulkUnsave() {
  return useBulkRemove({
    gridKey: 'favoritePosts',
    idsKey: 'favoriteIds',
    noun: 'saved',
    failMsg: 'Failed to remove from saved',
    run: async (uploadIds, uid) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', uid)
        .in('upload_id', uploadIds);
      if (error) throw error;
    },
  });
}

export function useBulkUnrepost() {
  return useBulkRemove({
    gridKey: 'userReposts',
    idsKey: 'repostIds',
    noun: 'repost',
    failMsg: 'Failed to remove reposts',
    run: async (uploadIds, uid) => {
      const { error } = await supabase
        .from('post_reposts')
        .delete()
        .eq('reposter_id', uid)
        .in('upload_id', uploadIds);
      if (error) throw error;
    },
  });
}

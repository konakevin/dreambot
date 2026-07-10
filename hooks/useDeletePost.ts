import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';
import type { DreamPostItem } from '@/components/DreamCard';
import { removeUploadFromPages } from '@/lib/feedHelpers';

// Page shape used by hooks that delete-post needs to mutate. Both shapes
// are still in the codebase (paginated infinite queries returning {rows,...}
// and a few legacy flat-array callers). The helper handles both.
interface RowPage {
  rows: DreamPostItem[];
  offset?: number;
  hasMore?: boolean;
  nextCursor?: unknown;
  nextOffset?: number;
}
type FlatPage = DreamPostItem[];
type AnyPage = RowPage | FlatPage;

const INFINITE_QUERY_KEYS = [
  'dreamFeed',
  'userPosts',
  'my-dreams',
  'explore',
  'publicProfilePosts',
  'favoritePosts',
];

/**
 * The actual row + storage delete for one upload — shared by the single-post
 * mutation and the bulk-delete mutation so the two can never drift (RLS
 * enforces ownership on the direct delete; admins route through the RPC).
 */
async function deleteUploadRow(uploadId: string, isAdmin: boolean): Promise<void> {
  // Grab BOTH image URLs before deleting (base + HQ Pro variant) so we
  // can clean both from storage. Previously only image_url was cleaned,
  // leaking every Pro HQ file on post deletion.
  const { data: row } = await supabase
    .from('uploads')
    .select('image_url, image_url_hq')
    .eq('id', uploadId)
    .single();

  if (isAdmin) {
    const { error } = await supabase.rpc(
      'admin_delete_upload' as never,
      { p_upload_id: uploadId } as never
    );
    if (error) throw error;
  } else {
    const { error } = await supabase.from('uploads').delete().eq('id', uploadId);
    if (error) throw error;
  }

  // Clean up storage (fire-and-forget). Both base + HQ paths.
  const paths: string[] = [];
  for (const url of [row?.image_url, row?.image_url_hq]) {
    if (!url) continue;
    const match = url.match(/\/uploads\/(.+)$/);
    if (match?.[1]) paths.push(decodeURIComponent(match[1]));
  }
  if (paths.length > 0) {
    supabase.storage.from('uploads').remove(paths);
  }
}

export function useDeletePost() {
  const qc = useQueryClient();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  return useMutation({
    mutationFn: (uploadId: string) => deleteUploadRow(uploadId, isAdmin),
    onMutate: async (uploadId: string) => {
      const snapshots = new Map<string, unknown>();

      for (const prefix of INFINITE_QUERY_KEYS) {
        const queries = qc.getQueryCache().findAll({ queryKey: [prefix] });
        for (const query of queries) {
          await qc.cancelQueries({ queryKey: query.queryKey });
          const prev = qc.getQueryData<InfiniteData<AnyPage>>(query.queryKey);
          if (prev) {
            snapshots.set(JSON.stringify(query.queryKey), prev);
            qc.setQueryData<InfiniteData<AnyPage>>(query.queryKey, {
              ...prev,
              pages: removeUploadFromPages(prev.pages, uploadId) as AnyPage[],
            });
          }
        }
      }

      // Album posts use flat arrays (useQuery, not useInfiniteQuery)
      const albumQueries = qc.getQueryCache().findAll({ queryKey: ['albumPosts'] });
      for (const query of albumQueries) {
        await qc.cancelQueries({ queryKey: query.queryKey });
        const prev = qc.getQueryData<DreamPostItem[]>(query.queryKey);
        if (prev) {
          snapshots.set(JSON.stringify(query.queryKey), prev);
          qc.setQueryData<DreamPostItem[]>(
            query.queryKey,
            prev.filter((p) => p.id !== uploadId)
          );
        }
      }

      return { snapshots };
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Dream deleted', 'checkmark-circle');
    },
    onError: (_err, _vars, ctx) => {
      if (__DEV__) console.error('[useDeletePost] Error:', _err);
      Toast.show('Failed to delete dream', 'close-circle');
      if (ctx?.snapshots) {
        for (const [keyStr, data] of ctx.snapshots) {
          qc.setQueryData(JSON.parse(keyStr), data);
        }
      }
    },
  });
}

/**
 * Bulk delete (the Dreams-grid multi-select, 2026-07-10). Reuses the exact
 * per-upload delete core (deleteUploadRow) in small batches, but with BULK
 * cache/toast semantics: all selected tiles vanish optimistically up front,
 * ONE summary toast at the end (the single-post hook toasts per item — 20
 * deletions would stack 20 toasts), and any partial failures resync from the
 * server via invalidation so failed posts reappear truthfully.
 */
export function useBulkDeletePosts() {
  const qc = useQueryClient();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  return useMutation({
    mutationFn: async (uploadIds: string[]) => {
      const failed: string[] = [];
      const BATCH = 4; // gentle on storage + PostgREST; 100 deletes ≈ 25 waves
      for (let i = 0; i < uploadIds.length; i += BATCH) {
        const batch = uploadIds.slice(i, i + BATCH);
        const results = await Promise.allSettled(batch.map((id) => deleteUploadRow(id, isAdmin)));
        results.forEach((r, j) => {
          if (r.status === 'rejected') failed.push(batch[j]);
        });
      }
      return { failed, deleted: uploadIds.length - failed.length };
    },
    onMutate: async (uploadIds: string[]) => {
      const ids = new Set(uploadIds);
      const snapshots = new Map<string, unknown>();

      for (const prefix of INFINITE_QUERY_KEYS) {
        const queries = qc.getQueryCache().findAll({ queryKey: [prefix] });
        for (const query of queries) {
          await qc.cancelQueries({ queryKey: query.queryKey });
          const prev = qc.getQueryData<InfiniteData<AnyPage>>(query.queryKey);
          if (prev) {
            snapshots.set(JSON.stringify(query.queryKey), prev);
            let pages = prev.pages;
            for (const id of ids) pages = removeUploadFromPages(pages, id) as AnyPage[];
            qc.setQueryData<InfiniteData<AnyPage>>(query.queryKey, { ...prev, pages });
          }
        }
      }

      const albumQueries = qc.getQueryCache().findAll({ queryKey: ['albumPosts'] });
      for (const query of albumQueries) {
        await qc.cancelQueries({ queryKey: query.queryKey });
        const prev = qc.getQueryData<DreamPostItem[]>(query.queryKey);
        if (prev) {
          snapshots.set(JSON.stringify(query.queryKey), prev);
          qc.setQueryData<DreamPostItem[]>(
            query.queryKey,
            prev.filter((p) => !ids.has(p.id))
          );
        }
      }

      return { snapshots };
    },
    onSuccess: ({ failed, deleted }) => {
      if (deleted > 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      if (failed.length === 0) {
        Toast.show(`Deleted ${deleted} dream${deleted === 1 ? '' : 's'}`, 'checkmark-circle');
      } else {
        Toast.show(`Deleted ${deleted}, ${failed.length} failed`, 'alert-circle');
        // Resync from the server so the optimistically-removed failures
        // reappear truthfully.
        for (const prefix of [...INFINITE_QUERY_KEYS, 'albumPosts']) {
          qc.invalidateQueries({ queryKey: [prefix] });
        }
      }
    },
    onError: (_err, _vars, ctx) => {
      if (__DEV__) console.error('[useBulkDeletePosts] Error:', _err);
      Toast.show('Failed to delete dreams', 'close-circle');
      if (ctx?.snapshots) {
        for (const [keyStr, data] of ctx.snapshots) {
          qc.setQueryData(JSON.parse(keyStr), data);
        }
      }
    },
  });
}

// Public-only caches — a post made private must LEAVE these. 'my-dreams' is
// deliberately excluded (the dream still exists there; its flag flips).
const PUBLIC_QUERY_KEYS = [
  'dreamFeed',
  'userPosts',
  'explore',
  'publicProfilePosts',
  'favoritePosts',
];

/**
 * Bulk "Make private" (the Posts-grid multi-select, 2026-07-10). One UPDATE
 * round-trip (RLS + explicit owner filter); posted_at is deliberately KEPT —
 * same contract as the single-post visibility toggle (photo/[id]) — so a
 * later re-publish returns the post to its original feed position instead of
 * re-promoting it. Reversible, so no confirm ceremony: optimistic removal
 * from the public caches + one summary toast.
 */
export function useBulkMakePrivate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (uploadIds: string[]) => {
      const uid = useAuthStore.getState().user?.id;
      if (!uid) throw new Error('not signed in');
      const { error } = await supabase
        .from('uploads')
        .update({ is_public: false })
        .in('id', uploadIds)
        .eq('user_id', uid);
      if (error) throw error;
      return { count: uploadIds.length };
    },
    onMutate: async (uploadIds: string[]) => {
      const ids = new Set(uploadIds);
      const snapshots = new Map<string, unknown>();

      for (const prefix of PUBLIC_QUERY_KEYS) {
        const queries = qc.getQueryCache().findAll({ queryKey: [prefix] });
        for (const query of queries) {
          await qc.cancelQueries({ queryKey: query.queryKey });
          const prev = qc.getQueryData<InfiniteData<AnyPage>>(query.queryKey);
          if (prev) {
            snapshots.set(JSON.stringify(query.queryKey), prev);
            let pages = prev.pages;
            for (const id of ids) pages = removeUploadFromPages(pages, id) as AnyPage[];
            qc.setQueryData<InfiniteData<AnyPage>>(query.queryKey, { ...prev, pages });
          }
        }
      }

      return { snapshots };
    },
    onSuccess: ({ count }) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show(`Moved ${count} to private`, 'eye-off');
      // The dreams album (and its Posted/Private filters) reflect the flips.
      qc.invalidateQueries({ queryKey: ['my-dreams'] });
    },
    onError: (_err, _vars, ctx) => {
      if (__DEV__) console.error('[useBulkMakePrivate] Error:', _err);
      Toast.show('Failed to update posts', 'close-circle');
      if (ctx?.snapshots) {
        for (const [keyStr, data] of ctx.snapshots) {
          qc.setQueryData(JSON.parse(keyStr), data);
        }
      }
    },
  });
}

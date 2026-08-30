import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';
import type { DreamPostItem } from '@/components/DreamCard';
import { removeUploadFromPages } from '@/lib/feedHelpers';
import { invalidateProfileGrids } from '@/lib/gridInvalidation';
import { markDreamSeen } from '@/lib/markDreamSeen';
import { useFeedStore } from '@/store/feed';
import { useAlbumStore } from '@/store/album';

/**
 * Remove deleted upload(s) from the two Zustand snapshots the query-cache
 * removal can't reach: the home feed's pinned self-post
 * (useFeedStore.pinnedPost — a just-posted dream shows pinned because get_feed
 * excludes your own posts) and the full-screen album viewer's stashed list
 * (useAlbumStore.posts/ids, which photo/[id] falls back to). Without this a
 * deleted card lingered on the feed / in the viewer even though the DB row was
 * gone (Kevin 2026-07-20). Returns a restore() so onError rolls these back with
 * the query caches.
 */
function prunePostFromSnapshots(ids: Set<string>): () => void {
  const feed = useFeedStore.getState();
  const album = useAlbumStore.getState();
  const prevPinned = feed.pinnedPost;
  const prevAlbumPosts = album.posts;
  const prevAlbumIds = album.ids;
  if (prevPinned && ids.has(prevPinned.id)) feed.setPinnedPost(null);
  if (prevAlbumPosts.some((p) => ids.has(p.id))) {
    album.setAlbumPosts(prevAlbumPosts.filter((p) => !ids.has(p.id)));
  }
  if (prevAlbumIds.some((id) => ids.has(id))) {
    album.setAlbum(prevAlbumIds.filter((id) => !ids.has(id)));
  }
  return () => {
    useFeedStore.getState().setPinnedPost(prevPinned);
    useAlbumStore.getState().setAlbumPosts(prevAlbumPosts);
    useAlbumStore.getState().setAlbum(prevAlbumIds);
  };
}

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

  // Media rows tell us what KIND of post this is (migration 367):
  //  - none            → a single dream: it OWNS its files → clean them.
  //  - source_upload_id set (any row) → a REFERENCE gallery: it owns NO files;
  //    the members (and the host cover) point at SOURCE dreams' storage, so we
  //    must NOT delete any storage here — the sources keep their files.
  //  - all source_upload_id NULL → a LEGACY copied gallery (pre-367): it owns
  //    copied files → clean the host + slide files as before.
  const { data: media } = await supabase
    .from('upload_media')
    .select('image_url, image_url_display, image_url_hq, source_upload_id')
    .eq('upload_id', uploadId);

  const sourceIds = [
    ...new Set(
      (media ?? []).map((m) => m.source_upload_id as string | null).filter((s): s is string => !!s)
    ),
  ];
  const isReferenceGallery = sourceIds.length > 0;

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

  // Reference gallery = DESTRUCTIVE album delete: "the album owns its images —
  // as the album goes, so go its children" (Kevin 2026-07-11). The host is
  // deleted above (its cover file belongs to a source, never touched); now
  // recurse to delete each CHILD source dream + its files. (Dissolve, which
  // KEEPS the children, is a separate path — dissolveAlbumRow below.)
  if (isReferenceGallery) {
    for (const sid of sourceIds) await deleteUploadRow(sid, isAdmin);
    return;
  }

  // Clean up storage (fire-and-forget). Single dream: host base + HQ. Legacy
  // copied gallery: host + every copied slide variant (deduped — the cover
  // copy is referenced by both the host and upload_media[0]).
  const paths = new Set<string>();
  const addPath = (url: string | null | undefined) => {
    if (!url) return;
    const match = url.match(/\/uploads\/(.+)$/);
    if (match?.[1]) paths.add(decodeURIComponent(match[1]));
  };
  addPath(row?.image_url);
  addPath(row?.image_url_hq);
  for (const m of media ?? []) {
    addPath(m.image_url as string | null);
    addPath(m.image_url_display as string | null);
    addPath(m.image_url_hq as string | null);
  }
  if (paths.size > 0) {
    supabase.storage.from('uploads').remove([...paths]);
  }
}

/**
 * DISSOLVE an album: delete only the host row. Its upload_media references
 * cascade away, releasing the child dreams back to Private (the DB trigger
 * bumps their created_at so they land at the top). No storage touched — the
 * children own their files. The non-destructive counterpart to deleteUploadRow
 * (which, for an album, deletes the children too).
 */
async function dissolveAlbumRow(hostId: string): Promise<void> {
  const { error } = await supabase.from('uploads').delete().eq('id', hostId);
  if (error) throw error;
}

export function useDissolveAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (hostId: string) => dissolveAlbumRow(hostId),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Album dissolved', 'checkmark-circle');
      // Host leaves every post surface; the released children return to Dreams.
      // refetchType:'all' (via the helper) so inactive grids refresh too.
      invalidateProfileGrids(qc);
      qc.invalidateQueries({ queryKey: ['albumPosts'], refetchType: 'all' });
    },
    onError: () => {
      Toast.show('Failed to dissolve album', 'close-circle');
    },
  });
}

// Shared optimistic removal — a flagged/deleted post must vanish from every feed,
// grid and album cache the same way whether it's hard-deleted or quarantined.
// Returns a ctx the mutation's onError rolls back on failure.
type RemovalCtx = { snapshots: Map<string, unknown>; restoreSnapshots: () => void };

async function applyOptimisticRemoval(qc: QueryClient, uploadId: string): Promise<RemovalCtx> {
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

  // Zustand snapshots (pinned self-post + album viewer) the caches miss.
  const restoreSnapshots = prunePostFromSnapshots(new Set([uploadId]));

  return { snapshots, restoreSnapshots };
}

function restoreOptimisticRemoval(qc: QueryClient, ctx: RemovalCtx | undefined): void {
  if (ctx?.snapshots) {
    for (const [keyStr, data] of ctx.snapshots) {
      qc.setQueryData(JSON.parse(keyStr), data);
    }
  }
  ctx?.restoreSnapshots?.();
}

export function useDeletePost() {
  const qc = useQueryClient();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  return useMutation({
    mutationFn: (uploadId: string) => deleteUploadRow(uploadId, isAdmin),
    onMutate: (uploadId: string) => applyOptimisticRemoval(qc, uploadId),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Dream deleted', 'checkmark-circle');
    },
    onError: (_err, _vars, ctx) => {
      if (__DEV__) console.error('[useDeletePost] Error:', _err);
      Toast.show('Failed to delete dream', 'close-circle');
      restoreOptimisticRemoval(qc, ctx);
    },
  });
}

/**
 * Quarantine a render as a "bad render" (the admin one-tap red X). Same
 * instant-vanish UX as delete, but the row + image + all metadata SURVIVE — the
 * admin RPC just flips is_public off + stamps quarantined_at, so it drops out of
 * every surface while pooling into the bad-render set for later pool-quality
 * analysis. No storage deletion, no counter changes. (migration 449)
 */
async function quarantineUploadRow(uploadId: string): Promise<void> {
  // admin_quarantine_upload is not in the generated RPC types yet (same pattern
  // as admin_delete_upload) — regenerate types after 449 to drop the casts.
  const { error } = await supabase.rpc(
    'admin_quarantine_upload' as never,
    { p_upload_id: uploadId } as never
  );
  if (error) throw error;
}

export function useQuarantinePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (uploadId: string) => quarantineUploadRow(uploadId),
    onMutate: (uploadId: string) => applyOptimisticRemoval(qc, uploadId),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Flagged as bad render', 'checkmark-circle');
    },
    onError: (_err, _vars, ctx) => {
      if (__DEV__) console.error('[useQuarantinePost] Error:', _err);
      Toast.show('Failed to flag render', 'close-circle');
      restoreOptimisticRemoval(qc, ctx);
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

      const restoreSnapshots = prunePostFromSnapshots(ids);

      return { snapshots, restoreSnapshots };
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
      ctx?.restoreSnapshots?.();
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
      // created_at bump: going private surfaces the dream at the TOP of the
      // Dreams album (created_at-ordered) instead of buried at its original
      // generation date — same contract as the single-post toggle
      // (photo/[id], 2026-07-11). posted_at stays untouched so a later
      // re-publish restores the original feed position.
      const { error } = await supabase
        .from('uploads')
        .update({ is_public: false, created_at: new Date().toISOString() })
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
    onSuccess: ({ count }, uploadIds) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show(`Moved ${count} to private`, 'eye-off');
      // The owner is acting on these dreams — they've seen them. Mark seen so the
      // created_at bump above doesn't re-flag them as "new" in the album. #58
      for (const id of uploadIds) markDreamSeen(id);
      // The optimistic onMutate already pulled these from the public grids; the
      // full refetch (refetchType:'all') confirms + surfaces them back in Dreams
      // even when that grid is inactive (the album live-update fix, 2026-07-11).
      invalidateProfileGrids(qc);
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

/**
 * Re-publish a previously-posted dream/album that was hidden ("Make public" on a
 * Private-tab tile, 2026-07-11). ONLY for rows that carry a posted_at — a
 * never-posted dream goes through the New Post compose flow instead (the caller
 * decides via posted_at). A raw is_public flip restores it to its ORIGINAL feed
 * position: created_at + posted_at are left untouched (the mirror of
 * useBulkMakePrivate, which preserves posted_at for exactly this round-trip). No
 * re-notify (notifications fire on the post-creation path, not this flip).
 */
export function useBulkMakePublic() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (uploadIds: string[]) => {
      const uid = useAuthStore.getState().user?.id;
      if (!uid) throw new Error('not signed in');
      const { error } = await supabase
        .from('uploads')
        .update({ is_public: true })
        .in('id', uploadIds)
        .eq('user_id', uid);
      if (error) throw error;
      return { count: uploadIds.length };
    },
    onSuccess: ({ count }, uploadIds) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show(count === 1 ? 'Shared publicly' : `Shared ${count} publicly`, 'earth');
      // Posting is a witness action — never let a just-shared dream red-dot the
      // owner's own album as "new." #58
      for (const id of uploadIds) markDreamSeen(id);
      // Leaves Private, enters the public grids + feed. refetchType:'all' (via
      // the helper) so the Posts grid refreshes even when you re-published from
      // the Dreams tab / viewer and the Posts grid is inactive (2026-07-11).
      invalidateProfileGrids(qc);
    },
    onError: (_err) => {
      if (__DEV__) console.error('[useBulkMakePublic] Error:', _err);
      Toast.show('Failed to update posts', 'close-circle');
    },
  });
}

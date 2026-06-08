import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useAlbumStore } from '@/store/album';
import { useFeedStore } from '@/store/feed';
import { trackPostReposted } from '@/lib/analytics';
import type { DreamPostItem } from '@/components/DreamCard';

interface ToggleArgs {
  uploadId: string;
  currentlyReposted: boolean;
}

type RowPage<T> = { rows: T[]; [k: string]: unknown };
type AnyPage<T> = RowPage<T> | T[];

function bumpItem(p: DreamPostItem, uploadId: string, delta: number): DreamPostItem {
  return p.id === uploadId ? { ...p, repost_count: Math.max(0, (p.repost_count ?? 0) + delta) } : p;
}

function bumpRepostCount(
  pages: AnyPage<DreamPostItem>[],
  uploadId: string,
  delta: number
): AnyPage<DreamPostItem>[] {
  return pages.map((page) => {
    if (Array.isArray(page)) return page.map((p) => bumpItem(p, uploadId, delta));
    return { ...page, rows: page.rows.map((p) => bumpItem(p, uploadId, delta)) };
  });
}

/**
 * useToggleRepost — optimistic repost toggle. Mirrors useToggleLike (membership
 * Set + repost_count bumps across every feed cache + Zustand snapshot), but goes
 * through the toggle_repost RPC rather than a direct table write, because the
 * server enforces the integrity rules (public-only, no self-repost, author
 * opt-out, bots-can't-repost) and writes the author notification. A rejected
 * repost (e.g. author disabled reposts) throws → onError restores everything.
 */
export function useToggleRepost() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const key = ['repostIds', user?.id];

  return useMutation({
    mutationFn: async ({ uploadId }: ToggleArgs) => {
      // The RPC toggles insert/delete server-side and returns the authoritative
      // (reposted, repost_count). We trust optimistic ±1 for the count (matching
      // useToggleLike) and let useRepostIds reconcile membership on next mount.
      const { error } = await supabase.rpc('toggle_repost', { p_upload_id: uploadId });
      if (error) throw error;
      trackPostReposted();
    },
    onMutate: async ({ uploadId, currentlyReposted }) => {
      const snapshots: Array<{ key: readonly unknown[]; data: unknown }> = [];

      // Toggle repostIds set
      await qc.cancelQueries({ queryKey: key });
      const previousRepostIds = qc.getQueryData<Set<string>>(key);
      snapshots.push({ key, data: previousRepostIds });
      qc.setQueryData<Set<string>>(key, (old = new Set()) => {
        const next = new Set(old);
        if (currentlyReposted) next.delete(uploadId);
        else next.add(uploadId);
        return next;
      });

      // Bump repost_count across all feed caches (same key set as useToggleLike).
      const delta = currentlyReposted ? -1 : 1;
      const infiniteKeys = [
        'dreamFeed',
        'userContextFeed',
        'searchPosts',
        'my-dreams',
        'favoritePosts',
        'userPosts',
        'publicProfilePosts',
        'explore',
      ];
      for (const root of infiniteKeys) {
        const queries = qc.getQueryCache().findAll({ queryKey: [root] });
        for (const query of queries) {
          const prev = qc.getQueryData<InfiniteData<AnyPage<DreamPostItem>>>(query.queryKey);
          if (prev) {
            snapshots.push({ key: query.queryKey, data: prev });
            qc.setQueryData<InfiniteData<AnyPage<DreamPostItem>>>(query.queryKey, {
              ...prev,
              pages: bumpRepostCount(prev.pages, uploadId, delta),
            });
          }
        }
      }
      // Album posts (flat-array shape)
      const albumKeys = qc.getQueryCache().findAll({ queryKey: ['albumPosts'] });
      for (const query of albumKeys) {
        const prev = qc.getQueryData<DreamPostItem[]>(query.queryKey);
        if (prev) {
          snapshots.push({ key: query.queryKey, data: prev });
          qc.setQueryData<DreamPostItem[]>(
            query.queryKey,
            prev.map((p) => bumpItem(p, uploadId, delta))
          );
        }
      }

      // Zustand snapshots outside TanStack (album store + pinned post).
      const rollbacks: Array<() => void> = [];

      const previousAlbumPosts = useAlbumStore.getState().posts;
      if (previousAlbumPosts.some((p) => p.id === uploadId)) {
        rollbacks.push(() => useAlbumStore.getState().setAlbumPosts(previousAlbumPosts));
        useAlbumStore
          .getState()
          .setAlbumPosts(previousAlbumPosts.map((p) => bumpItem(p, uploadId, delta)));
      }

      const previousPinnedPost = useFeedStore.getState().pinnedPost;
      if (previousPinnedPost?.id === uploadId) {
        rollbacks.push(() => useFeedStore.getState().setPinnedPost(previousPinnedPost));
        useFeedStore.getState().setPinnedPost(bumpItem(previousPinnedPost, uploadId, delta));
      }

      return { snapshots, rollbacks };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshots) {
        for (const { key: queryKey, data } of ctx.snapshots) qc.setQueryData(queryKey, data);
      }
      if (ctx?.rollbacks) {
        for (const rollback of ctx.rollbacks) rollback();
      }
    },
    // No onSettled refetch — optimistic state is trusted within a session
    // (read-after-write race, same rationale as useToggleLike); useRepostIds
    // refetches on mount for cross-session reconciliation.
  });
}

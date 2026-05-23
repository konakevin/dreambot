import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { DreamPostItem } from '@/components/DreamCard';

interface ToggleArgs {
  uploadId: string;
  currentlyLiked: boolean;
}

// Page shape is now { rows, nextCursor } per the 2026-05-02 scroll-bug fix.
// useDreamFeed pages are RowPage objects; some legacy hooks may still hand
// flat arrays. Handle both.
type RowPage<T> = { rows: T[]; [k: string]: unknown };
type AnyPage<T> = RowPage<T> | T[];

function bumpItem(p: DreamPostItem, uploadId: string, delta: number): DreamPostItem {
  return p.id === uploadId ? { ...p, like_count: Math.max(0, (p.like_count ?? 0) + delta) } : p;
}

function bumpLikeCount(
  pages: AnyPage<DreamPostItem>[],
  uploadId: string,
  delta: number
): AnyPage<DreamPostItem>[] {
  return pages.map((page) => {
    if (Array.isArray(page)) {
      return page.map((p) => bumpItem(p, uploadId, delta));
    }
    return { ...page, rows: page.rows.map((p) => bumpItem(p, uploadId, delta)) };
  });
}

export function useToggleLike() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const key = ['likeIds', user?.id];

  return useMutation({
    mutationFn: async ({ uploadId, currentlyLiked }: ToggleArgs) => {
      if (currentlyLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user!.id)
          .eq('upload_id', uploadId);
        if (error) throw error;
      } else {
        // Idempotent insert — if a like row already exists for this (user, upload),
        // upsert is a no-op instead of throwing on the UNIQUE constraint. Fixes the
        // stale-likeIds-after-app-reload bug where the client thought currentlyLiked=false
        // but the server already had the like, the insert blew up, optimistic state
        // partially rolled back, and the like_count was left drifted by +1.
        const { error } = await supabase
          .from('likes')
          .upsert(
            { user_id: user!.id, upload_id: uploadId },
            { onConflict: 'user_id,upload_id', ignoreDuplicates: true }
          );
        if (error) throw error;
      }
    },
    onMutate: async ({ uploadId, currentlyLiked }) => {
      // Snapshot every cache slice we're about to mutate so onError can restore
      // ALL of them. Previously only the likeIds set was snapshotted — the
      // like_count bumps across feed queries leaked on error and counts drifted.
      const snapshots: Array<{ key: readonly unknown[]; data: unknown }> = [];

      // Toggle likeIds set
      await qc.cancelQueries({ queryKey: key });
      const previousLikeIds = qc.getQueryData<Set<string>>(key);
      snapshots.push({ key, data: previousLikeIds });
      qc.setQueryData<Set<string>>(key, (old = new Set()) => {
        const next = new Set(old);
        if (currentlyLiked) next.delete(uploadId);
        else next.add(uploadId);
        return next;
      });

      // Bump like_count on the post across all feed caches.
      // Infinite queries with {rows, ...} page shape: dreamFeed, userContextFeed,
      // searchPosts, myDreams, favoritePosts, userPosts, publicProfilePosts, inbox.
      // Flat-array queries: albumPosts.
      const delta = currentlyLiked ? -1 : 1;
      const infiniteKeys = [
        'dreamFeed',
        'userContextFeed',
        'searchPosts',
        'my-dreams',
        'favoritePosts',
        'userPosts',
        'publicProfilePosts',
      ];
      for (const root of infiniteKeys) {
        const queries = qc.getQueryCache().findAll({ queryKey: [root] });
        for (const query of queries) {
          const prev = qc.getQueryData<InfiniteData<AnyPage<DreamPostItem>>>(query.queryKey);
          if (prev) {
            snapshots.push({ key: query.queryKey, data: prev });
            qc.setQueryData<InfiniteData<AnyPage<DreamPostItem>>>(query.queryKey, {
              ...prev,
              pages: bumpLikeCount(prev.pages, uploadId, delta),
            });
          }
        }
      }
      // Also bump in album posts (flat-array shape)
      const albumKeys = qc.getQueryCache().findAll({ queryKey: ['albumPosts'] });
      for (const query of albumKeys) {
        const prev = qc.getQueryData<DreamPostItem[]>(query.queryKey);
        if (prev) {
          snapshots.push({ key: query.queryKey, data: prev });
          qc.setQueryData<DreamPostItem[]>(
            query.queryKey,
            prev.map((p) =>
              p.id === uploadId ? { ...p, like_count: Math.max(0, (p.like_count ?? 0) + delta) } : p
            )
          );
        }
      }

      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      // Restore ALL snapshotted caches (likeIds + every feed query whose
      // like_count we bumped). Prevents count-drift on mutation failure.
      if (ctx?.snapshots) {
        for (const { key: queryKey, data } of ctx.snapshots) {
          qc.setQueryData(queryKey, data);
        }
      }
    },
    // NOTE: deliberately no onSettled invalidate of likeIds. Trying to refetch
    // immediately after mutation hit a read-after-write race (the refetch
    // returned a Set without the just-inserted upload_id and clobbered the
    // optimistic update, clearing the heart while leaving the count bumped).
    // Optimistic state is trusted; reconcile cross-session by fixing useLikeIds
    // to always refetch on mount instead.
  });
}

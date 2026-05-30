import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useAlbumStore } from '@/store/album';
import { useFeedStore } from '@/store/feed';
import { trackPostLiked } from '@/lib/analytics';
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
        trackPostLiked();
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
      // searchPosts, myDreams, favoritePosts, userPosts, publicProfilePosts.
      // Flat-array pages: explore (Top tab) and albumPosts. bumpLikeCount
      // handles both shapes.
      const delta = currentlyLiked ? -1 : 1;
      const infiniteKeys = [
        'dreamFeed',
        'userContextFeed',
        'searchPosts',
        'my-dreams',
        'favoritePosts',
        'userPosts',
        'publicProfilePosts',
        // Top tab's explore feed. Grid display is PostTile (no count shown),
        // BUT PostTile.handlePress snapshots these posts into useAlbumStore
        // for instant photo-detail mount — so leaving the cache un-bumped
        // here would carry a stale like_count into detail view via the
        // snapshot path. (Audit 2026-05-29.)
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

      // Zustand stores carrying their own snapshots of DreamPostItem —
      // NOT in TanStack so they don't get touched by the loops above. If
      // we skip them, photo detail / pinned-post UI keep rendering the
      // pre-tap like_count even though every TanStack cache has flipped:
      // heart turns red but the number freezes (the "phantom number"
      // Kevin reported, audited 2026-05-29).
      const rollbacks: Array<() => void> = [];

      // (a) Album store: PostTile.handlePress dumps the tapped grid's
      // posts here so photo detail can mount instantly without a cold-
      // cache flash. Photo detail prefers this snapshot until the
      // underlying source TanStack query grows past it (~most of a
      // session). Bump the matching post in-place.
      const previousAlbumPosts = useAlbumStore.getState().posts;
      if (previousAlbumPosts.some((p) => p.id === uploadId)) {
        rollbacks.push(() => useAlbumStore.getState().setAlbumPosts(previousAlbumPosts));
        useAlbumStore
          .getState()
          .setAlbumPosts(
            previousAlbumPosts.map((p) =>
              p.id === uploadId ? { ...p, like_count: Math.max(0, (p.like_count ?? 0) + delta) } : p
            )
          );
      }

      // (b) Feed store's pinnedPost: a single post pinned to the top of
      // the For-You feed (deep-link landing, post-create return). Carries
      // its own like_count outside any TanStack cache.
      const previousPinnedPost = useFeedStore.getState().pinnedPost;
      if (previousPinnedPost?.id === uploadId) {
        rollbacks.push(() => useFeedStore.getState().setPinnedPost(previousPinnedPost));
        useFeedStore.getState().setPinnedPost({
          ...previousPinnedPost,
          like_count: Math.max(0, (previousPinnedPost.like_count ?? 0) + delta),
        });
      }

      return { snapshots, rollbacks };
    },
    onError: (_err, _vars, ctx) => {
      // Restore ALL snapshotted caches (likeIds + every feed query whose
      // like_count we bumped) AND every Zustand store snapshot we mutated.
      // Prevents count-drift on mutation failure.
      if (ctx?.snapshots) {
        for (const { key: queryKey, data } of ctx.snapshots) {
          qc.setQueryData(queryKey, data);
        }
      }
      if (ctx?.rollbacks) {
        for (const rollback of ctx.rollbacks) rollback();
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

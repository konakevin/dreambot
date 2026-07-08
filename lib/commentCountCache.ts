/**
 * commentCountCache — the ONE place that adjusts a post's denormalized
 * `comment_count` across every client cache that holds it.
 *
 * `comment_count` is a server counter (uploads.comment_count, maintained by the
 * migration-286 trigger on comments INSERT/DELETE). The client mirrors it
 * optimistically so the card updates instantly. The bug this fixes: add and
 * delete used to touch DIFFERENT caches — add bumped +1 across all feeds, delete
 * touched none — so deleting a just-added comment left the card stuck at +1
 * (Kevin 2026-07-08). Routing BOTH through this helper (delta +1 / -1) makes them
 * symmetric by construction, so the count can't drift.
 */
import type { QueryClient, InfiniteData } from '@tanstack/react-query';
import { useAlbumStore } from '@/store/album';
import { useFeedStore } from '@/store/feed';
import type { DreamPostItem } from '@/components/DreamCard';

// Infinite queries with a { rows, ... } page shape that carry feed cards.
// Kept in lockstep with postCountSync's INFINITE_ROOTS (the canonical count-
// carrier inventory) so the optimistic +/-1 and the fetch-time heal agree.
const INFINITE_FEED_KEYS = [
  'dreamFeed',
  'userContextFeed',
  'searchPosts',
  'my-dreams',
  'favoritePosts',
  'userPosts',
  'publicProfilePosts',
  'explore',
];

type FeedRowPage = { rows: DreamPostItem[]; [k: string]: unknown };
type FeedAnyPage = FeedRowPage | DreamPostItem[];

/**
 * Apply `delta` (+1 on add, -1 on delete) to `comment_count` for `uploadId`
 * across every cached feed, the album (flat array), and the single-post view.
 * Floored at 0 to mirror the DB's GREATEST(...,0) decrement.
 */
export function adjustCommentCount(qc: QueryClient, uploadId: string, delta: number): void {
  const next = (c?: number) => Math.max(0, (c ?? 0) + delta);
  const bump = (p: DreamPostItem): DreamPostItem =>
    p.id === uploadId ? { ...p, comment_count: next(p.comment_count) } : p;

  // Infinite feeds ({ rows, ... } pages).
  for (const root of INFINITE_FEED_KEYS) {
    for (const query of qc.getQueryCache().findAll({ queryKey: [root] })) {
      qc.setQueryData<InfiniteData<FeedAnyPage>>(query.queryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page) =>
            Array.isArray(page) ? page.map(bump) : { ...page, rows: page.rows.map(bump) }
          ),
        };
      });
    }
  }

  // Album (flat array shape).
  for (const query of qc.getQueryCache().findAll({ queryKey: ['albumPosts'] })) {
    qc.setQueryData<DreamPostItem[]>(query.queryKey, (prev) => prev?.map(bump));
  }

  // Single-post view ({ id, comment_count, ... }).
  for (const query of qc.getQueryCache().findAll({ queryKey: ['post'] })) {
    qc.setQueryData<{ id: string; comment_count?: number } & Record<string, unknown>>(
      query.queryKey,
      (prev) =>
        prev && prev.id === uploadId ? { ...prev, comment_count: next(prev.comment_count) } : prev
    );
  }

  // Zustand snapshots outside TanStack (the "phantom number" carriers that
  // postCountSync also heals): the album store + the pinned feed post.
  const albumPosts = useAlbumStore.getState().posts;
  if (albumPosts.some((p) => p.id === uploadId)) {
    useAlbumStore.getState().setAlbumPosts(albumPosts.map(bump));
  }
  const pinned = useFeedStore.getState().pinnedPost;
  if (pinned && pinned.id === uploadId) {
    useFeedStore.getState().setPinnedPost(bump(pinned));
  }
}

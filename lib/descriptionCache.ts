/**
 * descriptionCache — the ONE place that writes an edited post caption
 * (uploads.description) into every client cache that holds the card, so an
 * owner's "Edit description" shows INSTANTLY on the feed, the album viewer, the
 * profile album, and the single-post view without a refetch.
 *
 * A refetch would work too, but invalidating the feed reshuffles it mid-scroll
 * (live feed_scores) — the same hazard the uploads-realtime handler avoids. An
 * in-place patch updates only the one row's caption and touches nothing else.
 *
 * Cache inventory is kept in lockstep with commentCountCache (the canonical
 * card-carrier list) so the two optimistic patchers agree on where cards live.
 */
import type { QueryClient, InfiniteData } from '@tanstack/react-query';
import { useAlbumStore } from '@/store/album';
import { useFeedStore } from '@/store/feed';
import type { DreamPostItem } from '@/components/DreamCard';

// Infinite queries with a { rows, ... } page shape (some, e.g. explore, use a
// bare array page) that carry feed cards.
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
 * Set `description` for `uploadId` across every cached feed, the album (flat
 * array), the single-post view, and the two Zustand snapshots (album store +
 * pinned feed post). Pass the new caption (or null when cleared) — also used to
 * ROLL BACK to the prior value on a failed mutation.
 */
export function setDescriptionInCaches(
  qc: QueryClient,
  uploadId: string,
  description: string | null
): void {
  const apply = (p: DreamPostItem): DreamPostItem =>
    p.id === uploadId ? { ...p, description } : p;

  // Infinite feeds ({ rows, ... } or bare-array pages).
  for (const root of INFINITE_FEED_KEYS) {
    for (const query of qc.getQueryCache().findAll({ queryKey: [root] })) {
      qc.setQueryData<InfiniteData<FeedAnyPage>>(query.queryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page) =>
            Array.isArray(page) ? page.map(apply) : { ...page, rows: page.rows.map(apply) }
          ),
        };
      });
    }
  }

  // Album (flat array shape).
  for (const query of qc.getQueryCache().findAll({ queryKey: ['albumPosts'] })) {
    qc.setQueryData<DreamPostItem[]>(query.queryKey, (prev) => prev?.map(apply));
  }

  // Single-post view ({ id, description, ... }).
  for (const query of qc.getQueryCache().findAll({ queryKey: ['post'] })) {
    qc.setQueryData<{ id: string; description?: string | null } & Record<string, unknown>>(
      query.queryKey,
      (prev) => (prev && prev.id === uploadId ? { ...prev, description } : prev)
    );
  }

  // Zustand snapshots outside TanStack: the album store + the pinned feed post.
  const albumPosts = useAlbumStore.getState().posts;
  if (albumPosts.some((p) => p.id === uploadId)) {
    useAlbumStore.getState().setAlbumPosts(albumPosts.map(apply));
  }
  const pinned = useFeedStore.getState().pinnedPost;
  if (pinned && pinned.id === uploadId) {
    useFeedStore.getState().setPinnedPost(apply(pinned));
  }
}

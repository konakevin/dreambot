/**
 * postCountSync — heal engagement counts across every post cache when FRESH
 * rows arrive from the server.
 *
 * Why: the home/explore feeds are deliberately FROZEN for the session
 * (staleTime Infinity, 2026-07-06 feed-stability work) so background refetches
 * can't reshuffle cards mid-scroll. Correct trade-off for ORDER, but it also
 * froze like/comment/repost COUNTS at fetch time — Kevin's repro (2026-07-08):
 * a like notification opens the post showing 2 likes (fresh context fetch),
 * then the same post on the home feed still shows 0 (frozen snapshot).
 *
 * This helper takes rows that just came back from ANY fresh fetch and writes
 * their counts onto matching rows in every cache that displays them. It never
 * adds/removes/reorders rows, so the frozen feeds stay visually stable — only
 * the numbers update.
 *
 * Cache inventory mirrors useToggleLike's (the canonical list of count
 * carriers, incl. the two Zustand snapshots from the 2026-05-29 "phantom
 * number" audit). Known narrow race, accepted: if the user likes a post in
 * the instant between a fetch resolving and this sync applying, the optimistic
 * +1 can be overwritten by the just-fetched (pre-like) count until the next
 * fresh fetch. Syncs only fire on fetch-arrival, so the window is tiny — and
 * strictly better than counts staying wrong all session.
 */

import type { QueryClient, InfiniteData } from '@tanstack/react-query';
import { useAlbumStore } from '@/store/album';
import { useFeedStore } from '@/store/feed';
import type { DreamPostItem } from '@/components/DreamCard';

type Counts = { like_count?: number; comment_count?: number; repost_count?: number };
type RowPage = { rows: DreamPostItem[]; [k: string]: unknown };
type AnyPage = RowPage | DreamPostItem[];

// Same roots useToggleLike bumps (see its comments for why each is included).
const INFINITE_ROOTS = [
  'dreamFeed',
  'userContextFeed',
  'searchPosts',
  'my-dreams',
  'favoritePosts',
  'userPosts',
  'publicProfilePosts',
  'explore',
];

function mergeItem(
  p: DreamPostItem,
  counts: Map<string, Counts>,
  likedIds: Set<string>
): DreamPostItem {
  const c = counts.get(p.id);
  if (!c) return p;
  const next: DreamPostItem = { ...p };
  let changed = false;
  for (const k of ['like_count', 'comment_count', 'repost_count'] as const) {
    let v = c[k];
    // Invariant guard: a post the viewer has LIKED includes their own like, so
    // like_count can never legitimately be 0. A fresh fetch that races the
    // read-after-write of an in-flight like can return the pre-like count (0);
    // writing that onto the FROZEN feed (staleTime Infinity) made a hearted
    // post render a blank count for the rest of the session (Kevin
    // 2026-07-11). Floor at 1 for liked posts instead of propagating the
    // impossible state.
    if (k === 'like_count' && typeof v === 'number' && likedIds.has(p.id)) {
      v = Math.max(v, 1);
    }
    if (typeof v === 'number' && v !== p[k]) {
      next[k] = v;
      changed = true;
    }
  }
  return changed ? next : p;
}

function mergePages(
  pages: AnyPage[],
  counts: Map<string, Counts>,
  likedIds: Set<string>
): AnyPage[] {
  return pages.map((page) =>
    Array.isArray(page)
      ? page.map((p) => mergeItem(p, counts, likedIds))
      : { ...page, rows: page.rows.map((p) => mergeItem(p, counts, likedIds)) }
  );
}

/**
 * Write the counts from `freshPosts` (rows that just arrived from the server)
 * onto matching posts in every cache that renders them.
 */
export function syncPostCounts(qc: QueryClient, freshPosts: DreamPostItem[]): void {
  if (freshPosts.length === 0) return;
  const counts = new Map<string, Counts>();
  for (const p of freshPosts) {
    counts.set(p.id, {
      like_count: p.like_count,
      comment_count: p.comment_count,
      repost_count: p.repost_count,
    });
  }

  // The viewer's liked set (useLikeIds cache) — feeds the liked-implies-≥1
  // invariant in mergeItem. Absent/unloaded → empty set (guard inert).
  const likeIdsQuery = qc.getQueryCache().findAll({ queryKey: ['likeIds'] })[0];
  const likedIds =
    (likeIdsQuery && qc.getQueryData<Set<string>>(likeIdsQuery.queryKey)) || new Set<string>();

  for (const root of INFINITE_ROOTS) {
    for (const query of qc.getQueryCache().findAll({ queryKey: [root] })) {
      const prev = qc.getQueryData<InfiniteData<AnyPage>>(query.queryKey);
      if (!prev?.pages) continue;
      const pages = mergePages(prev.pages, counts, likedIds);
      // Cheap identity check: mergeItem returns the SAME object when nothing
      // changed, so unchanged caches keep their reference (no re-renders).
      if (pages.some((pg, i) => pg !== prev.pages[i])) {
        qc.setQueryData<InfiniteData<AnyPage>>(query.queryKey, { ...prev, pages });
      }
    }
  }

  // Flat-array album caches.
  for (const query of qc.getQueryCache().findAll({ queryKey: ['albumPosts'] })) {
    const prev = qc.getQueryData<DreamPostItem[]>(query.queryKey);
    if (!prev) continue;
    const next = prev.map((p) => mergeItem(p, counts, likedIds));
    if (next.some((p, i) => p !== prev[i])) qc.setQueryData(query.queryKey, next);
  }

  // Zustand snapshots outside TanStack (the "phantom number" carriers).
  const albumPosts = useAlbumStore.getState().posts;
  if (albumPosts.some((p) => counts.has(p.id))) {
    useAlbumStore.getState().setAlbumPosts(albumPosts.map((p) => mergeItem(p, counts, likedIds)));
  }
  const pinned = useFeedStore.getState().pinnedPost;
  if (pinned && counts.has(pinned.id)) {
    useFeedStore.getState().setPinnedPost(mergeItem(pinned, counts, likedIds));
  }
}

import type { QueryClient } from '@tanstack/react-query';

/**
 * Every query key that backs a profile album grid or a feed. A mutation that
 * changes a dream's grid membership — post, make public, make private, delete,
 * compose an album (which flips album_ref_count via a DB trigger) — must refetch
 * ALL of these, because a dream can move BETWEEN grids (Dreams ⇄ Posts) and land
 * in one the user isn't currently looking at.
 *
 * `refetchType: 'all'` is load-bearing: the default 'active' only refetches a
 * grid that currently has a mounted observer, so an invalidation fired while you
 * were on a different tab left the target grid stale until a hard reload — the
 * "albums don't live-update" bug (2026-07-11). 'all' refetches inactive grids
 * too. (For this to reach a grid at all, its query must be ENABLED — see
 * useUserPosts / useFavoritePosts / useMyDreams, which stay enabled for the
 * signed-in owner regardless of the active tab, exactly so this can refetch
 * them.)
 */
const GRID_QUERY_KEYS = [
  'userPosts',
  'my-dreams',
  'publicProfilePosts',
  'favoritePosts',
  'userReposts',
  'dreamFeed',
  'explore',
] as const;

export function invalidateProfileGrids(qc: QueryClient): void {
  for (const key of GRID_QUERY_KEYS) {
    qc.invalidateQueries({ queryKey: [key], refetchType: 'all' });
  }
}

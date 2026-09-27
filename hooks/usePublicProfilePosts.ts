import { useInfiniteQuery, type QueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';
import { ALBUM_PAGE_SIZE as PAGE_SIZE, albumPaging, type AlbumQueryOpts } from '@/lib/albumPaging';
import { monthRange } from '@/lib/albumNav';
// Ceiling for the "Just viewed" deep-jump bulk load (below). Covers all but the
// deepest posts in one round-trip; past this we fall back gracefully.
const JUMP_LOAD_CAP = 300;

/**
 * One-shot load of a public profile's posts from the top down far enough to
 * include `targetId`, primed into the SAME infinite-query cache (chunked into
 * PAGE_SIZE pages so pagination stays consistent). Lets the grid scrollToIndex to
 * a post deep in the album WITHOUT ~30s of page-by-page fetching — used by the
 * "Just viewed" anchor when you land on a profile from a feed card. Returns true
 * if the target was found within the cap.
 */
export async function loadPublicProfilePostsUntil(
  qc: QueryClient,
  userId: string,
  targetId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('uploads')
    .select(POST_SELECT)
    .eq('user_id', userId)
    .eq('is_public', true)
    // MUST match the queryFn ordering so the target lands at its real index.
    .order('pinned_at', { ascending: false, nullsFirst: false })
    .order('posted_at', { ascending: false, nullsFirst: false })
    .range(0, JUMP_LOAD_CAP - 1);
  if (error || !data) return false;
  const rows = castRows(data).map(mapToDreamPost);
  if (!rows.some((r) => r.id === targetId)) return false; // deeper than the cap
  const pages: { rows: typeof rows; offset: number; hasMore: boolean }[] = [];
  const pageParams: number[] = [];
  for (let i = 0; i < rows.length; i += PAGE_SIZE) {
    pages.push({
      rows: rows.slice(i, i + PAGE_SIZE),
      offset: i,
      // Last chunk keeps hasMore only if we hit the cap (more may exist past it).
      hasMore: i + PAGE_SIZE < rows.length || rows.length === JUMP_LOAD_CAP,
    });
    pageParams.push(i);
  }
  // The newest-first, from-the-top query (the grid's default key).
  qc.setQueryData(['publicProfilePosts', userId, 'newest', null], { pages, pageParams });
  return true;
}

/** `opts.sort` / `opts.month`: see useMyDreams. */
export function usePublicProfilePosts(userId: string, enabled = true, opts: AlbumQueryOpts = {}) {
  const sort = opts.sort ?? 'newest';
  const month = opts.month ?? null;
  return useInfiniteQuery({
    queryKey: ['publicProfilePosts', userId, sort, month],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      // Order by posted_at — see useUserPosts for the why. Posts grid
      // reflects the publish timeline, not the original generation moment.
      const base = supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', userId)
        .eq('is_public', true);
      // A drilled-in month album: only that month (UTC, like get_album_months).
      const scoped = month
        ? base.gte('posted_at', monthRange(month).from).lt('posted_at', monthRange(month).to)
        : base;
      const ordered =
        sort === 'oldest' || month
          ? // Oldest first, or inside a month: plain date order, pins don't float.
            scoped.order('posted_at', { ascending: sort === 'oldest', nullsFirst: false })
          : scoped
              // Pins first (migration 330) — one ORDER BY keeps range pagination
              // correct with no prepend logic; unpinned rows have NULL pinned_at
              // and sort after every pin.
              .order('pinned_at', { ascending: false, nullsFirst: false })
              // See useUserPosts for the nullsLast rationale (mig 246 + defense
              // against stray NULL posted_at on public uploads).
              .order('posted_at', { ascending: false, nullsFirst: false });
      const { data, error } = await ordered.range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = castRows(data).map(mapToDreamPost);
      // hasMore captured at fetch time so optimistic deletes don't break
      // pagination by shrinking rows.length below PAGE_SIZE.
      return { rows, offset, hasMore: rows.length === PAGE_SIZE };
    },
    ...albumPaging(),
    enabled: !!userId && enabled,
    staleTime: 60_000,
  });
}

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';
import { ALBUM_PAGE_SIZE as PAGE_SIZE, albumPaging, type AlbumQueryOpts } from '@/lib/albumPaging';
import { monthRange } from '@/lib/albumNav';
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

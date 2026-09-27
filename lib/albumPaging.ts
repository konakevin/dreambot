/**
 * Offset paging shared by the album grids (useMyDreams, useUserPosts,
 * usePublicProfilePosts) and the bot browse queries (useAlbumDiscovery), with the options
 * they all take (ALBUM_DISCOVERY_PLAN.md): Newest / Oldest, and one month as its own album.
 */
import type { AlbumSort } from '@/lib/albumNav';

export const ALBUM_PAGE_SIZE = 18;

export interface AlbumQueryOpts {
  sort?: AlbumSort;
  /** A drilled-in month album ('YYYY-MM-01'): only that month's posts, pins not floated. */
  month?: string | null;
}

interface OffsetPage {
  offset: number;
  hasMore: boolean;
}

/** initialPageParam + next page param for an offset-paged album query. */
export function albumPaging() {
  return {
    initialPageParam: 0,
    getNextPageParam: (last: OffsetPage | undefined) =>
      last?.hasMore ? last.offset + ALBUM_PAGE_SIZE : undefined,
  };
}

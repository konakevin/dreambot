/**
 * Per-album rules (ALBUM_DISCOVERY_PLAN.md), kept pure so they're locked by
 * __tests__/lib/albumSources.test.ts:
 *
 * - albumBrowse: which albums get Newest/Oldest and the calendar (months view), and which
 *   get_album_months scope each one's month tiles read.
 * - viewerQuery: which query the photo detail screen pages when you open a post from a
 *   grid. It must be the SAME query the grid shows (same album, filter, sort and month),
 *   or swiping past the loaded posts pages a different list.
 */
import type { PostGridSource } from '@/components/PostGrid';
import type { AlbumMonthsScope } from '@/hooks/useAlbumDiscovery';

export interface AlbumBrowse {
  /** Shows the Newest / Oldest toggle. */
  sortable: boolean;
  /** Shows the calendar button; the months scope its tiles read (null = no months view). */
  monthsScope: AlbumMonthsScope | null;
}

export function albumBrowse(source: PostGridSource): AlbumBrowse {
  switch (source.type) {
    case 'own':
      return { sortable: true, monthsScope: 'posts' };
    case 'dreams': {
      const f = source.dreamsFilter ?? 'all';
      return {
        sortable: true,
        monthsScope:
          f === 'posted' ? 'dreams_posted' : f === 'private' ? 'dreams_private' : 'dreams_all',
      };
    }
    // Saved / Hearted / Reposts sort and group into months by when YOU saved, hearted or
    // reposted, not by the post's date (migration 562).
    case 'saved':
      return { sortable: true, monthsScope: 'saved' };
    case 'liked':
      return { sortable: true, monthsScope: 'hearted' };
    case 'reposts':
      return { sortable: true, monthsScope: 'reposts' };
    case 'user': {
      // Bot modes: Haven't seen sorts but has no months; 🎲 is one random draw, neither.
      const m = source.mode ?? 'all';
      return { sortable: m !== 'shuffle', monthsScope: m === 'all' ? 'posts' : null };
    }
    case 'hashtag':
      return { sortable: false, monthsScope: null };
  }
}

export type ViewerQuery =
  | 'own'
  | 'saved'
  | 'liked'
  | 'reposts'
  | 'dreams'
  | 'user'
  | 'unseen'
  | 'hashtag';

/** The query the photo detail screen pages for a grid source; null = page nothing (the
 *  stashed posts are the whole list: no source, or a 🎲 draw). */
export function viewerQuery(source: PostGridSource | null): ViewerQuery | null {
  if (!source) return null;
  if (source.type === 'user') {
    const m = source.mode ?? 'all';
    return m === 'all' ? 'user' : m === 'unseen' ? 'unseen' : null;
  }
  return source.type;
}

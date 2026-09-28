/**
 * Album navigation (ALBUM_DISCOVERY_PLAN.md): sort order, months, and the extra rows the
 * grid draws between posts (month headers).
 *
 * Pure functions, shared by PostGrid, the timeline scrubber, and the months view.
 *
 * Months come from get_album_months (migration 560), newest first, bucketed by UTC month;
 * a month album (monthRange) filters the grid to exactly that bucket.
 */

export type AlbumSort = 'newest' | 'oldest';

export interface AlbumMonth {
  /** First day of the month, 'YYYY-MM-DD' (UTC). */
  month: string;
  count: number;
  /** How many of `count` are pinned (posts grids only). */
  pinned: number;
  cover: string | null;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** '2026-07-01' → 'July 2026'. */
export function monthLabel(month: string): string {
  const [y, m] = month.split('-');
  return `${MONTH_NAMES[Number(m) - 1] ?? month} ${y}`;
}

/** The 'YYYY-MM-01' bucket an ISO timestamp falls in (UTC, like the server). */
export function monthKey(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

/**
 * The UTC range of a month bucket ('2026-03-01' → [2026-03-01T00:00Z, 2026-04-01T00:00Z)),
 * matching get_album_months' date_trunc('month', … AT TIME ZONE 'UTC'). A drilled-in
 * month album filters `date >= from AND date < to`.
 */
export function monthRange(month: string): { from: string; to: string } {
  const [y, m] = month.split('-').map(Number);
  const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
  return { from: `${month.slice(0, 7)}-01T00:00:00Z`, to: `${next}-01T00:00:00Z` };
}

/** Months in the order the grid shows them. */
export function monthsInOrder(months: AlbumMonth[], sort: AlbumSort): AlbumMonth[] {
  return sort === 'oldest' ? [...months].reverse() : months;
}

/** A full-width row the grid draws between posts. */
export type GridRow = { row: 'month'; key: string; label: string };

export interface DatedPost {
  id: string;
  created_at: string;
  posted_at?: string | null;
  pinned_at?: string | null;
}

/**
 * Weave month headers between posts: a header goes before the first post of each month.
 * Pinned posts at the top of a newest-first posts grid are not dated rows, so they get no
 * header.
 */
export function weaveGridRows<T extends DatedPost>(
  posts: T[],
  opts: {
    dateKey: 'created_at' | 'posted_at';
    sort: AlbumSort;
    pinsFloat: boolean;
    monthHeaders: boolean;
  }
): (T | GridRow)[] {
  const out: (T | GridRow)[] = [];
  let lastMonth: string | null = null;
  for (const p of posts) {
    const floating = opts.pinsFloat && opts.sort === 'newest' && !!p.pinned_at;
    const date = (opts.dateKey === 'posted_at' ? p.posted_at : p.created_at) ?? p.created_at;
    if (opts.monthHeaders && !floating) {
      const m = monthKey(date);
      if (m !== lastMonth) {
        out.push({ row: 'month', key: `month-${m}`, label: monthLabel(m) });
        lastMonth = m;
      }
    }
    out.push(p);
  }
  return out;
}

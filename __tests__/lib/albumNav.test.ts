import {
  monthRange,
  monthLabel,
  monthsInOrder,
  weaveGridRows,
  type AlbumMonth,
} from '@/lib/albumNav';

// Newest first, like get_album_months.
const MONTHS: AlbumMonth[] = [
  { month: '2026-09-01', count: 10, pinned: 2, cover: null },
  { month: '2026-08-01', count: 20, pinned: 1, cover: null },
  { month: '2026-07-01', count: 30, pinned: 0, cover: null },
];

describe('monthLabel / monthsInOrder', () => {
  it('names a month', () => {
    expect(monthLabel('2026-07-01')).toBe('July 2026');
  });
  it('lists months oldest-first when sorted that way', () => {
    expect(monthsInOrder(MONTHS, 'oldest').map((m) => m.month)).toEqual([
      '2026-07-01',
      '2026-08-01',
      '2026-09-01',
    ]);
  });
});

const post = (id: string, created: string, extra: Record<string, string | null> = {}) => ({
  id,
  created_at: created,
  posted_at: created,
  pinned_at: null,
  ...extra,
});

const keys = (rows: ({ id: string } | { row: string; key: string })[]) =>
  rows.map((r) => ('row' in r ? `[${r.key}]` : r.id));

describe('weaveGridRows', () => {
  const posts = [
    post('a', '2026-09-20T00:00:00Z'),
    post('b', '2026-09-02T00:00:00Z'),
    post('c', '2026-08-30T00:00:00Z'),
    post('d', '2026-07-01T00:00:00Z'),
  ];

  it('puts a header before the first post of each month', () => {
    const rows = weaveGridRows(posts, {
      dateKey: 'created_at',
      sort: 'newest',
      pinsFloat: false,
      monthHeaders: true,
    });
    expect(keys(rows)).toEqual([
      '[month-2026-09-01]',
      'a',
      'b',
      '[month-2026-08-01]',
      'c',
      '[month-2026-07-01]',
      'd',
    ]);
  });

  it('gives floating pins no header', () => {
    const withPin = [
      post('p', '2026-07-05T00:00:00Z', { pinned_at: '2026-09-25T00:00:00Z' }),
      ...posts,
    ];
    const rows = weaveGridRows(withPin, {
      dateKey: 'posted_at',
      sort: 'newest',
      pinsFloat: true,
      monthHeaders: true,
    });
    expect(keys(rows).slice(0, 3)).toEqual(['p', '[month-2026-09-01]', 'a']);
  });

  it('draws the caught-up line after the posts newer than the last visit', () => {
    const rows = weaveGridRows(posts, {
      dateKey: 'posted_at',
      sort: 'newest',
      pinsFloat: true,
      monthHeaders: false,
      caughtUpAfter: '2026-09-01T00:00:00Z',
    });
    expect(keys(rows)).toEqual(['a', 'b', '[caught-up]', 'c', 'd']);
  });

  it('draws no caught-up line when nothing is new, or when sorted oldest-first', () => {
    const none = weaveGridRows(posts, {
      dateKey: 'posted_at',
      sort: 'newest',
      pinsFloat: true,
      monthHeaders: false,
      caughtUpAfter: '2026-10-01T00:00:00Z',
    });
    expect(keys(none)).toEqual(['a', 'b', 'c', 'd']);
    const oldest = weaveGridRows([...posts].reverse(), {
      dateKey: 'posted_at',
      sort: 'oldest',
      pinsFloat: true,
      monthHeaders: false,
      caughtUpAfter: '2026-09-01T00:00:00Z',
    });
    expect(keys(oldest)).toEqual(['d', 'c', 'b', 'a']);
  });
});

describe('monthRange', () => {
  it('covers exactly one UTC month', () => {
    expect(monthRange('2026-03-01')).toEqual({
      from: '2026-03-01T00:00:00Z',
      to: '2026-04-01T00:00:00Z',
    });
  });
  it('rolls December into the next year', () => {
    expect(monthRange('2026-12-01')).toEqual({
      from: '2026-12-01T00:00:00Z',
      to: '2027-01-01T00:00:00Z',
    });
  });
});

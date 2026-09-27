/**
 * LIVE-DB test for get_album_months (migration 562, superseding 560): the months view
 * (calendar button) behind every album grid (ALBUM_DISCOVERY_PLAN.md).
 *
 * Locks what the app relies on:
 * - Saved / Hearted / Reposts group by when YOU saved, hearted or reposted (the same
 *   column those albums sort and month-filter by), never by the post's own date.
 * - Saved and Hearted are yours only. Likes are world-readable in production, so the
 *   function's own p_user_id = auth.uid() check is the privacy rule, not RLS.
 * - Each month tile's count equals what its month album shows: the app filters a month
 *   album with lib/albumNav monthRange (UTC), so the buckets must be UTC too.
 * - The older scopes (posts, dreams_*) keep behaving (regression).
 *
 * Vanilla Postgres has no RLS policies here, so this locks the function's own logic.
 * auth.uid() is stubbed to read a session GUC; everything runs on ONE pooled client.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';
import { monthRange } from '@/lib/albumNav';

const pool: Pool = makePool();
let db: PoolClient;

const ME = '00000000-0000-0000-0000-00000000a001';
const OTHER = '00000000-0000-0000-0000-00000000a002';
const AUTHOR = '00000000-0000-0000-0000-00000000a003';

/** Deterministic upload id #n. */
function up(n: number): string {
  return `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`;
}

interface MonthRow {
  month: string;
  post_count: number;
  pinned_count: number;
  cover_url: string | null;
}

/** get_album_months as `asUser` (null = signed out). */
async function months(asUser: string | null, userId: string, scope: string): Promise<MonthRow[]> {
  await db.query("SELECT set_config('test.uid', $1, false)", [asUser ?? '']);
  const { rows } = await db.query<MonthRow>(
    `SELECT month::text AS month, post_count, pinned_count, cover_url
       FROM public.get_album_months($1, $2)`,
    [userId, scope]
  );
  return rows;
}

interface UploadOpts {
  owner?: string;
  createdAt?: string;
  postedAt?: string | null;
  pinnedAt?: string | null;
  isPublic?: boolean;
  albumRefCount?: number;
  quarantinedAt?: string | null;
  image?: string | null;
  display?: string | null;
}

async function upload(id: string, o: UploadOpts = {}): Promise<void> {
  await db.query(
    `INSERT INTO public.uploads (id, user_id, created_at, posted_at, pinned_at, is_public,
                                 album_ref_count, quarantined_at, image_url, image_url_display)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      o.owner ?? AUTHOR,
      o.createdAt ?? '2026-01-10T12:00:00Z',
      o.postedAt === undefined ? '2026-01-10T12:00:00Z' : o.postedAt,
      o.pinnedAt ?? null,
      o.isPublic ?? true,
      o.albumRefCount ?? 0,
      o.quarantinedAt ?? null,
      o.image === undefined ? `https://img/${id}.png` : o.image,
      o.display ?? null,
    ]
  );
}

async function save(userId: string, uploadId: string, at: string): Promise<void> {
  await db.query(
    'INSERT INTO public.favorites (user_id, upload_id, created_at) VALUES ($1,$2,$3)',
    [userId, uploadId, at]
  );
}

async function heart(userId: string, uploadId: string, at: string): Promise<void> {
  await db.query('INSERT INTO public.likes (user_id, upload_id, created_at) VALUES ($1,$2,$3)', [
    userId,
    uploadId,
    at,
  ]);
}

async function repost(userId: string, uploadId: string, at: string, active = true): Promise<void> {
  await db.query(
    `INSERT INTO public.post_reposts (reposter_id, upload_id, active, last_reposted_at)
     VALUES ($1,$2,$3,$4)`,
    [userId, uploadId, active, at]
  );
}

const counts = (rows: MonthRow[]) => rows.map((r) => [r.month, r.post_count]);

async function dropFixture(): Promise<void> {
  await db.query('DROP FUNCTION IF EXISTS public.get_album_months(uuid, text)');
  for (const t of ['favorites', 'likes', 'post_reposts', 'uploads']) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
}

beforeAll(async () => {
  db = await pool.connect();
  // All dbspecs share ONE database and several create uploads / post_reposts in other
  // shapes, so always drop + recreate ours (and drop again in afterAll).
  await dropFixture();

  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY, user_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(), posted_at timestamptz, pinned_at timestamptz,
    is_public boolean NOT NULL DEFAULT false, album_ref_count integer NOT NULL DEFAULT 0,
    quarantined_at timestamptz, image_url text, image_url_display text
  )`);
  await db.query(`CREATE TABLE public.favorites (
    user_id uuid NOT NULL, upload_id uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await db.query(`CREATE TABLE public.likes (
    user_id uuid NOT NULL, upload_id uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await db.query(`CREATE TABLE public.post_reposts (
    reposter_id uuid NOT NULL,
    upload_id uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
    active boolean NOT NULL DEFAULT true, last_reposted_at timestamptz NOT NULL DEFAULT now()
  )`);

  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS 'SELECT NULLIF(current_setting(''test.uid'', true), '''')::uuid'`);

  await db.query(
    extract(
      migrationSql('562_album_months_saved_hearted_reposts.sql'),
      'CREATE OR REPLACE FUNCTION public.get_album_months',
      '$$;'
    )
  );
});

afterAll(async () => {
  await dropFixture();
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['favorites', 'likes', 'post_reposts', 'uploads']) {
    await db.query(`DELETE FROM public.${t}`);
  }
});

// ── Saved / Hearted / Reposts: dated by YOUR action ────────────────────────────────

it('Saved months follow the day you saved a post, not the day it was made', async () => {
  await upload(up(1), { createdAt: '2026-01-10T12:00:00Z', postedAt: '2026-01-10T12:00:00Z' });
  await save(ME, up(1), '2026-03-05T12:00:00Z');

  const rows = await months(ME, ME, 'saved');
  expect(counts(rows)).toEqual([['2026-03-01', 1]]);
});

it('Hearted months follow the day you hearted a post, not the day it was made', async () => {
  await upload(up(1), { createdAt: '2026-01-10T12:00:00Z', postedAt: '2026-01-10T12:00:00Z' });
  await heart(ME, up(1), '2026-03-05T12:00:00Z');

  const rows = await months(ME, ME, 'hearted');
  expect(counts(rows)).toEqual([['2026-03-01', 1]]);
});

it("Reposts months follow the latest repost, and un-reposted posts don't count", async () => {
  await upload(up(1));
  await upload(up(2));
  await upload(up(3));
  await repost(ME, up(1), '2026-05-02T12:00:00Z');
  await repost(ME, up(2), '2026-05-03T12:00:00Z', false); // un-reposted tombstone
  await repost(ME, up(3), '2026-06-01T12:00:00Z');

  const rows = await months(ME, ME, 'reposts');
  expect(counts(rows)).toEqual([
    ['2026-06-01', 1],
    ['2026-05-01', 1],
  ]);
});

// ── Who can ask ───────────────────────────────────────────────────────────────────

it("Saved and Hearted are private: asking for someone else's returns nothing", async () => {
  await upload(up(1));
  await save(OTHER, up(1), '2026-03-05T12:00:00Z');
  await heart(OTHER, up(1), '2026-03-05T12:00:00Z');

  expect(await months(ME, OTHER, 'saved')).toEqual([]);
  expect(await months(ME, OTHER, 'hearted')).toEqual([]);
  // The data is there: its owner sees it.
  expect(counts(await months(OTHER, OTHER, 'saved'))).toEqual([['2026-03-01', 1]]);
  expect(counts(await months(OTHER, OTHER, 'hearted'))).toEqual([['2026-03-01', 1]]);
});

it("Anyone signed in can see someone else's Reposts months", async () => {
  await upload(up(1));
  await repost(OTHER, up(1), '2026-05-02T12:00:00Z');

  expect(counts(await months(ME, OTHER, 'reposts'))).toEqual([['2026-05-01', 1]]);
});

it('A signed-out caller gets nothing for any album', async () => {
  await upload(up(1), { owner: ME });
  await save(ME, up(1), '2026-03-05T12:00:00Z');
  await heart(ME, up(1), '2026-03-05T12:00:00Z');
  await repost(ME, up(1), '2026-03-05T12:00:00Z');

  for (const scope of [
    'saved',
    'hearted',
    'reposts',
    'posts',
    'dreams_all',
    'dreams_private',
    'dreams_posted',
  ]) {
    expect(await months(null, ME, scope)).toEqual([]);
  }
});

it('An unknown album name returns nothing', async () => {
  await upload(up(1), { owner: ME });
  expect(await months(ME, ME, 'bogus')).toEqual([]);
});

// ── Shape: order, counts, pins, cover ───────────────────────────────────────────────

it("Months come newest first with the right counts, no pins, and the latest save's picture as the cover", async () => {
  // February: one save.
  await upload(up(1), { display: 'https://img/feb-display.png' });
  await save(ME, up(1), '2026-02-14T12:00:00Z');
  // March: three saves. The LAST one saved is the OLDEST post and has no display image,
  // so the cover must follow save time (not post time) and fall back to image_url.
  await upload(up(2), { createdAt: '2026-03-01T00:00:00Z', display: 'https://img/m2.png' });
  await upload(up(3), { createdAt: '2026-03-02T00:00:00Z', display: 'https://img/m3.png' });
  await upload(up(4), {
    createdAt: '2025-06-01T00:00:00Z',
    postedAt: '2025-06-01T00:00:00Z',
    image: 'https://img/old-post-full.png',
    display: null,
  });
  await save(ME, up(2), '2026-03-03T12:00:00Z');
  await save(ME, up(3), '2026-03-10T12:00:00Z');
  await save(ME, up(4), '2026-03-20T12:00:00Z');
  // April: two saves, one of a PINNED post (pins only count on the posts grid).
  await upload(up(5), { pinnedAt: '2026-04-01T00:00:00Z', display: 'https://img/a5.png' });
  await upload(up(6), { display: 'https://img/a6.png' });
  await save(ME, up(5), '2026-04-02T12:00:00Z');
  await save(ME, up(6), '2026-04-09T12:00:00Z');

  const rows = await months(ME, ME, 'saved');
  expect(rows).toEqual([
    { month: '2026-04-01', post_count: 2, pinned_count: 0, cover_url: 'https://img/a6.png' },
    {
      month: '2026-03-01',
      post_count: 3,
      pinned_count: 0,
      cover_url: 'https://img/old-post-full.png',
    },
    {
      month: '2026-02-01',
      post_count: 1,
      pinned_count: 0,
      cover_url: 'https://img/feb-display.png',
    },
  ]);
});

it('Hearted and Reposts also report zero pinned posts', async () => {
  await upload(up(1), { pinnedAt: '2026-04-01T00:00:00Z' });
  await heart(ME, up(1), '2026-04-02T12:00:00Z');
  await repost(ME, up(1), '2026-04-02T12:00:00Z');

  expect((await months(ME, ME, 'hearted')).map((r) => r.pinned_count)).toEqual([0]);
  expect((await months(ME, ME, 'reposts')).map((r) => r.pinned_count)).toEqual([0]);
});

// ── UTC buckets, matching the app's month album filter ──────────────────────────────

it('Months are UTC: a save late on March 31 in New York is an April save, whatever the session time zone', async () => {
  await upload(up(1));
  await upload(up(2));
  await save(ME, up(1), '2026-03-31T23:30:00-05:00'); // = 2026-04-01T04:30Z
  await save(ME, up(2), '2026-03-31T18:00:00-05:00'); // = 2026-03-31T23:00Z

  await db.query("SET TIME ZONE 'America/New_York'");
  try {
    expect(counts(await months(ME, ME, 'saved'))).toEqual([
      ['2026-04-01', 1],
      ['2026-03-01', 1],
    ]);
  } finally {
    await db.query('RESET TIME ZONE');
  }
});

it("Each month tile's count equals what its month album shows (the app's monthRange filter)", async () => {
  // Items right on the month edges, plus ordinary ones.
  const stamps = [
    '2026-03-31T23:59:59.999Z',
    '2026-04-01T00:00:00Z',
    '2026-04-15T08:00:00Z',
    '2026-04-30T23:59:59Z',
    '2026-05-01T00:00:00Z',
    '2026-12-31T23:59:59Z',
    '2027-01-01T00:00:00Z',
  ];
  for (let i = 0; i < stamps.length; i++) {
    await upload(up(i + 1));
    await save(ME, up(i + 1), stamps[i]);
    await heart(ME, up(i + 1), stamps[i]);
    await repost(ME, up(i + 1), stamps[i]);
  }
  // A tombstoned repost inside a month must not count in the tile or the album.
  await upload(up(99));
  await repost(ME, up(99), '2026-04-10T00:00:00Z', false);

  // Each album's month filter, exactly as its hook applies it (date >= from AND date < to).
  const albums: { scope: string; filter: string }[] = [
    {
      scope: 'saved',
      filter:
        'SELECT count(*)::int AS n FROM public.favorites WHERE user_id = $1 AND created_at >= $2 AND created_at < $3',
    },
    {
      scope: 'hearted',
      filter:
        'SELECT count(*)::int AS n FROM public.likes WHERE user_id = $1 AND created_at >= $2 AND created_at < $3',
    },
    {
      scope: 'reposts',
      filter:
        'SELECT count(*)::int AS n FROM public.post_reposts WHERE reposter_id = $1 AND active AND last_reposted_at >= $2 AND last_reposted_at < $3',
    },
  ];
  for (const { scope, filter } of albums) {
    const rows = await months(ME, ME, scope);
    expect(counts(rows)).toEqual([
      ['2027-01-01', 1],
      ['2026-12-01', 1],
      ['2026-05-01', 1],
      ['2026-04-01', 3],
      ['2026-03-01', 1],
    ]);
    for (const r of rows) {
      const { from, to } = monthRange(r.month);
      const { rows: inAlbum } = await db.query<{ n: number }>(filter, [ME, from, to]);
      expect([scope, r.month, inAlbum[0].n]).toEqual([scope, r.month, r.post_count]);
    }
  }
});

// ── Regression: the older scopes ─────────────────────────────────────────────────────

it('Posts months still follow the posting date and count pinned posts', async () => {
  // Made in January, posted in February → February.
  await upload(up(1), {
    owner: ME,
    createdAt: '2026-01-20T12:00:00Z',
    postedAt: '2026-02-03T12:00:00Z',
  });
  await upload(up(2), {
    owner: ME,
    createdAt: '2026-02-05T12:00:00Z',
    postedAt: '2026-02-06T12:00:00Z',
    pinnedAt: '2026-02-07T12:00:00Z',
  });
  // Private: not on the posts grid.
  await upload(up(3), { owner: ME, isPublic: false, postedAt: null });

  const expected = [{ month: '2026-02-01', post_count: 2, pinned_count: 1 }];
  const strip = (rows: MonthRow[]) =>
    rows.map(({ month, post_count, pinned_count }) => ({ month, post_count, pinned_count }));
  expect(strip(await months(ME, ME, 'posts'))).toEqual(expected);
  // A profile's posts months are open to other viewers (RLS decides in production).
  expect(strip(await months(OTHER, ME, 'posts'))).toEqual(expected);
});

it('Dreams months: Private leaves out public, album-member and quarantined dreams', async () => {
  const march = '2026-03-10T12:00:00Z';
  await upload(up(1), { owner: ME, createdAt: march, isPublic: false, postedAt: null });
  await upload(up(2), {
    owner: ME,
    createdAt: march,
    isPublic: true,
    postedAt: '2026-04-02T12:00:00Z',
  });
  await upload(up(3), {
    owner: ME,
    createdAt: march,
    isPublic: false,
    postedAt: null,
    albumRefCount: 1,
  });
  await upload(up(4), {
    owner: ME,
    createdAt: march,
    isPublic: false,
    postedAt: null,
    quarantinedAt: march,
  });

  expect(counts(await months(ME, ME, 'dreams_private'))).toEqual([['2026-03-01', 1]]);
  expect(counts(await months(ME, ME, 'dreams_all'))).toEqual([['2026-03-01', 2]]);
  // Public dreams are dated by when they were posted, like that grid.
  expect(counts(await months(ME, ME, 'dreams_posted'))).toEqual([['2026-04-01', 1]]);
});

it("Dreams months refuse anyone but the dreams' owner", async () => {
  await upload(up(1), { owner: ME, isPublic: false, postedAt: null });
  await upload(up(2), { owner: ME, isPublic: true });

  for (const scope of ['dreams_all', 'dreams_private', 'dreams_posted']) {
    expect(await months(OTHER, ME, scope)).toEqual([]);
  }
});

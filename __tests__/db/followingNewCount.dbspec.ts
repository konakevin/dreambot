/**
 * LIVE-DB test for the Following tab's new-post count (migration 629).
 *
 * get_following_new_count() counts posts from accounts the caller follows, posted since the caller last opened
 * Following (users.last_following_view_at), under the Following feed's own filters; mark_following_viewed() resets
 * it. Loads the real function bodies on stub tables and locks: bots count like people, the viewer's own posts,
 * unfollowed authors, older posts, unposted or hidden posts, blocked authors (either way) and reported posts don't
 * count; the count caps at 10; marking viewed zeroes it; and both act on auth.uid() only.
 *
 * auth.uid() is stubbed from the `test.uid` setting, like the sibling specs.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const VIEWER = '00000000-0000-0000-0000-00000000f001';
const FRIEND = '00000000-0000-0000-0000-00000000f002'; // followed person
const BOT = '00000000-0000-0000-0000-00000000f003'; // followed bot
const STRANGER = '00000000-0000-0000-0000-00000000f004'; // not followed
const OTHER = '00000000-0000-0000-0000-00000000f005'; // another viewer

async function actAs(uid: string): Promise<void> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid]);
}

let n = 0;
async function post(
  userId: string,
  opts: { ago?: string; isPublic?: boolean; posted?: boolean; moderated?: boolean } = {}
): Promise<string> {
  n++;
  const id = `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`;
  await db.query(
    `INSERT INTO public.uploads (id, user_id, is_public, posted_at, is_moderated, is_approved)
     VALUES ($1, $2, $3, CASE WHEN $4 THEN now() - $5::interval END, $6, CASE WHEN $6 THEN false END)`,
    [
      id,
      userId,
      opts.isPublic ?? true,
      opts.posted ?? true,
      opts.ago ?? '1 minute',
      opts.moderated ?? false,
    ]
  );
  return id;
}

async function count(): Promise<number> {
  const { rows } = await db.query('SELECT public.get_following_new_count() AS c');
  return rows[0].c;
}

beforeAll(async () => {
  db = await pool.connect();
  const sql = migrationSql('629_following_new_count.sql');

  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS $fn$ SELECT nullif(current_setting('test.uid', true), '')::uuid $fn$`);

  for (const t of ['uploads', 'users', 'follows', 'blocked_users', 'reports'])
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  await db.query(
    `CREATE TABLE public.users (id uuid PRIMARY KEY, is_bot boolean NOT NULL DEFAULT false)`
  );
  await db.query(`CREATE TABLE public.follows (follower_id uuid, following_id uuid)`);
  await db.query(`CREATE TABLE public.blocked_users (blocker_id uuid, blocked_id uuid)`);
  await db.query(`CREATE TABLE public.reports (reporter_id uuid, upload_id uuid)`);
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY, user_id uuid NOT NULL, posted_at timestamptz,
    is_public boolean NOT NULL DEFAULT true, is_moderated boolean NOT NULL DEFAULT false, is_approved boolean
  )`);
  // The real DDL: the column (default now()) and both function bodies.
  await db.query(extract(sql, 'ALTER TABLE public.users', ';'));
  await db.query(extract(sql, 'CREATE OR REPLACE FUNCTION public.get_following_new_count', '$$;'));
  await db.query(extract(sql, 'CREATE OR REPLACE FUNCTION public.mark_following_viewed', '$$;'));
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['uploads', 'users', 'follows', 'blocked_users', 'reports'])
    await db.query(`DELETE FROM public.${t}`);
  await db.query(
    `INSERT INTO public.users (id, is_bot, last_following_view_at) VALUES
       ($1, false, now() - interval '1 hour'), ($2, false, now()), ($3, true, now()),
       ($4, false, now()), ($5, false, now() - interval '1 hour')`,
    [VIEWER, FRIEND, BOT, STRANGER, OTHER]
  );
  await db.query(`INSERT INTO public.follows VALUES ($1, $2), ($1, $3), ($4, $2)`, [
    VIEWER,
    FRIEND,
    BOT,
    OTHER,
  ]);
  await actAs(VIEWER);
});

describe('get_following_new_count', () => {
  it('counts new posts from followed people AND bots', async () => {
    await post(FRIEND);
    await post(BOT);
    await post(BOT);
    expect(await count()).toBe(3);
  });

  it('ignores posts from before the last view, own posts and unfollowed authors', async () => {
    await post(FRIEND, { ago: '2 hours' });
    await post(VIEWER);
    await post(STRANGER);
    expect(await count()).toBe(0);
  });

  it('ignores posts the Following feed would not show', async () => {
    await post(FRIEND, { posted: false });
    await post(FRIEND, { isPublic: false });
    await post(FRIEND, { moderated: true });
    const reported = await post(BOT);
    await db.query('INSERT INTO public.reports VALUES ($1, $2)', [VIEWER, reported]);
    expect(await count()).toBe(0);
  });

  it('ignores blocked authors in either direction', async () => {
    await post(FRIEND);
    await post(BOT);
    await db.query('INSERT INTO public.blocked_users VALUES ($1, $2), ($3, $1)', [
      VIEWER,
      FRIEND,
      BOT,
    ]);
    expect(await count()).toBe(0);
  });

  it('caps at 10 (the app shows 9+)', async () => {
    for (let i = 0; i < 14; i++) await post(BOT);
    expect(await count()).toBe(10);
  });

  it('is scoped to the caller', async () => {
    await post(FRIEND);
    await post(BOT);
    await actAs(OTHER); // follows only FRIEND
    expect(await count()).toBe(1);
  });
});

describe('mark_following_viewed', () => {
  it('zeroes the caller’s count and leaves everyone else’s alone', async () => {
    await post(FRIEND);
    await post(BOT);
    await db.query('SELECT public.mark_following_viewed()');
    expect(await count()).toBe(0);
    await actAs(OTHER);
    expect(await count()).toBe(1);
  });

  it('a post after the view counts again', async () => {
    await db.query('SELECT public.mark_following_viewed()');
    // posted_at in the future relative to the stamp (same transaction clock otherwise)
    await db.query(
      `INSERT INTO public.uploads (id, user_id, posted_at) VALUES ($1, $2, now() + interval '1 second')`,
      ['00000000-0000-0000-0000-00000000ffff', BOT]
    );
    expect(await count()).toBe(1);
  });
});

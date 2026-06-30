/**
 * LIVE-DB test for per-reporter comment hiding (migration 317).
 *
 * Loads the real get_comments + get_replies bodies on stub tables and verifies:
 * a comment a viewer REPORTED is absent from get_comments/get_replies for that
 * viewer, while still present for everyone else — mirroring how get_feed hides a
 * reported post. Also a regression guard that get_replies RUNS at all (the live
 * 039 body referenced the dropped users.user_rank column and errored on every
 * call; 317 rewrites it).
 *
 * auth.uid() is stubbed to read a session GUC (test.uid); block_exists is stubbed
 * to false (blocking is covered elsewhere — here we isolate the report filter).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const REPORTER = '00000000-0000-0000-0000-00000000a001';
const OTHER = '00000000-0000-0000-0000-00000000a002';
const AUTHOR = '00000000-0000-0000-0000-00000000a003';

const UPLOAD = '00000000-0000-0000-0000-00000000b001';
const C_REPORTED = '00000000-0000-0000-0000-00000000c001'; // top-level, reporter reports this
const C_CLEAN = '00000000-0000-0000-0000-00000000c002'; // top-level, untouched
const R_REPORTED = '00000000-0000-0000-0000-00000000c003'; // reply under C_CLEAN, reported

async function commentsAs(uid: string): Promise<string[]> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid]);
  const { rows } = await db.query('SELECT id FROM public.get_comments($1, 50, 0)', [UPLOAD]);
  return rows.map((r) => r.id as string);
}

async function repliesAs(uid: string, parentId: string): Promise<string[]> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid]);
  const { rows } = await db.query('SELECT id FROM public.get_replies($1, 50)', [parentId]);
  return rows.map((r) => r.id as string);
}

beforeAll(async () => {
  db = await pool.connect();
  const sql = migrationSql('317_hide_reported_comments.sql');

  await db.query('DROP TABLE IF EXISTS public.comment_likes CASCADE');
  await db.query('DROP TABLE IF EXISTS public.reports CASCADE');
  await db.query('DROP TABLE IF EXISTS public.comments CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');

  await db.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY, username text, avatar_url text
  )`);
  await db.query(`CREATE TABLE public.comments (
    id uuid PRIMARY KEY, upload_id uuid NOT NULL, user_id uuid NOT NULL,
    parent_id uuid, body text NOT NULL, like_count integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await db.query(`CREATE TABLE public.reports (
    reporter_id uuid NOT NULL, comment_id uuid, upload_id uuid, reason text
  )`);
  await db.query(`CREATE TABLE public.comment_likes (comment_id uuid, user_id uuid)`);

  // Stubs the SECURITY DEFINER bodies depend on.
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS 'SELECT NULLIF(current_setting(''test.uid'', true), '''')::uuid'`);
  await db.query(`CREATE OR REPLACE FUNCTION public.block_exists(uuid, uuid) RETURNS boolean
    LANGUAGE sql IMMUTABLE AS 'SELECT false'`);

  await db.query(extract(sql, 'CREATE FUNCTION public.get_comments', '$$;'));
  await db.query(extract(sql, 'CREATE FUNCTION public.get_replies', '$$;'));
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['comment_likes', 'reports', 'comments', 'users']) {
    await db.query(`DELETE FROM public.${t}`);
  }
  await db.query(
    `INSERT INTO public.users (id, username) VALUES ($1,'reporter'), ($2,'other'), ($3,'author')`,
    [REPORTER, OTHER, AUTHOR]
  );
  // Two top-level comments + one reply under the clean one.
  await db.query(
    `INSERT INTO public.comments (id, upload_id, user_id, parent_id, body, created_at) VALUES
       ($1,$4,$5,NULL,'reported top',   now() - interval '2 min'),
       ($2,$4,$5,NULL,'clean top',      now() - interval '1 min'),
       ($3,$4,$5,$2,  'reply reported', now())`,
    [C_REPORTED, C_CLEAN, R_REPORTED, UPLOAD, AUTHOR]
  );
});

describe('get_comments — per-reporter hiding (migration 317)', () => {
  it('hides a reported top-level comment from the reporter only', async () => {
    await db.query('INSERT INTO public.reports (reporter_id, comment_id) VALUES ($1,$2)', [
      REPORTER,
      C_REPORTED,
    ]);
    const asReporter = await commentsAs(REPORTER);
    expect(asReporter).not.toContain(C_REPORTED);
    expect(asReporter).toContain(C_CLEAN);

    const asOther = await commentsAs(OTHER);
    expect(asOther).toContain(C_REPORTED);
    expect(asOther).toContain(C_CLEAN);
  });

  it('shows everything when nothing is reported', async () => {
    const ids = await commentsAs(REPORTER);
    expect(ids).toEqual(expect.arrayContaining([C_REPORTED, C_CLEAN]));
  });
});

describe('get_replies — runs (user_rank regression) + per-reporter hiding', () => {
  it('returns replies at all (would error on the old user_rank body)', async () => {
    const ids = await repliesAs(OTHER, C_CLEAN);
    expect(ids).toContain(R_REPORTED);
  });

  it('hides a reported reply from the reporter only', async () => {
    await db.query('INSERT INTO public.reports (reporter_id, comment_id) VALUES ($1,$2)', [
      REPORTER,
      R_REPORTED,
    ]);
    expect(await repliesAs(REPORTER, C_CLEAN)).not.toContain(R_REPORTED);
    expect(await repliesAs(OTHER, C_CLEAN)).toContain(R_REPORTED);
  });
});

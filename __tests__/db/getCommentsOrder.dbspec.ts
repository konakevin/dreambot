/**
 * LIVE-DB test for comment ORDERING (migration 379).
 *
 * Kevin 2026-07-19: top-level comments and replies must both read OLDEST -> NEWEST
 * (top to bottom). Migration 379 flipped get_comments to `ORDER BY created_at ASC`
 * (get_replies was already ASC via 317). The client's optimistic-append + scroll-
 * to-end logic depends on this order, so a silent flip back to DESC would break the
 * post-a-comment UX. This loads the real function bodies and locks the direction.
 *
 * auth.uid()/block_exists stubbed (report/block filtering is covered by
 * commentReportFilter.dbspec — here we isolate ordering).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const AUTHOR = '00000000-0000-0000-0000-00000000a003';
const UPLOAD = '00000000-0000-0000-0000-00000000b001';
const PARENT = '00000000-0000-0000-0000-00000000c010';

async function commentBodies(): Promise<string[]> {
  await db.query("SELECT set_config('test.uid', $1, false)", [AUTHOR]);
  const { rows } = await db.query('SELECT body FROM public.get_comments($1, 50, 0)', [UPLOAD]);
  return rows.map((r) => r.body as string);
}

async function replyBodies(): Promise<string[]> {
  await db.query("SELECT set_config('test.uid', $1, false)", [AUTHOR]);
  const { rows } = await db.query('SELECT body FROM public.get_replies($1, 50)', [PARENT]);
  return rows.map((r) => r.body as string);
}

beforeAll(async () => {
  db = await pool.connect();

  await db.query('DROP TABLE IF EXISTS public.comment_likes CASCADE');
  await db.query('DROP TABLE IF EXISTS public.reports CASCADE');
  await db.query('DROP TABLE IF EXISTS public.comments CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');

  await db.query(`CREATE TABLE public.users (id uuid PRIMARY KEY, username text, avatar_url text)`);
  await db.query(`CREATE TABLE public.comments (
    id uuid PRIMARY KEY, upload_id uuid NOT NULL, user_id uuid NOT NULL,
    parent_id uuid, body text NOT NULL, like_count integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await db.query(`CREATE TABLE public.reports (reporter_id uuid, comment_id uuid, upload_id uuid)`);
  await db.query(`CREATE TABLE public.comment_likes (comment_id uuid, user_id uuid)`);

  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS 'SELECT NULLIF(current_setting(''test.uid'', true), '''')::uuid'`);
  await db.query(`CREATE OR REPLACE FUNCTION public.block_exists(uuid, uuid) RETURNS boolean
    LANGUAGE sql IMMUTABLE AS 'SELECT false'`);

  // All dbspecs share ONE database (see _support/pg.ts). Migration 317's
  // get_replies is a plain non-idempotent CREATE (we extract the CREATE, not its
  // DROP), so a sibling comment spec (commentReportFilter) that already created it
  // makes our CREATE collide with "function already exists" — order-dependent.
  // Drop both first, mirroring the DROP TABLE lines above, so this spec is
  // idempotent regardless of jest file order. (2026-07-19)
  await db.query('DROP FUNCTION IF EXISTS public.get_comments(uuid, integer, integer) CASCADE');
  await db.query('DROP FUNCTION IF EXISTS public.get_replies(uuid, integer) CASCADE');

  // get_comments from 379 (ASC), get_replies from 317 (ASC).
  await db.query(
    extract(
      migrationSql('379_get_comments_oldest_first.sql'),
      'CREATE OR REPLACE FUNCTION public.get_comments',
      '$$;'
    )
  );
  await db.query(
    extract(
      migrationSql('317_hide_reported_comments.sql'),
      'CREATE FUNCTION public.get_replies',
      '$$;'
    )
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['comment_likes', 'reports', 'comments', 'users']) {
    await db.query(`DELETE FROM public.${t}`);
  }
  await db.query(`INSERT INTO public.users (id, username) VALUES ($1,'author')`, [AUTHOR]);
});

it('get_comments returns top-level comments OLDEST first', async () => {
  // Insert deliberately out of chronological order to prove the ORDER BY, not
  // insertion order, drives the result.
  await db.query(
    `INSERT INTO public.comments (id, upload_id, user_id, parent_id, body, created_at) VALUES
       (gen_random_uuid(), $1, $2, NULL, 'second', now() - interval '2 min'),
       (gen_random_uuid(), $1, $2, NULL, 'first',  now() - interval '3 min'),
       (gen_random_uuid(), $1, $2, NULL, 'third',  now() - interval '1 min')`,
    [UPLOAD, AUTHOR]
  );
  expect(await commentBodies()).toEqual(['first', 'second', 'third']);
});

it('get_replies returns replies OLDEST first (matches the parent thread order)', async () => {
  await db.query(
    `INSERT INTO public.comments (id, upload_id, user_id, parent_id, body, created_at) VALUES
       ($1, $2, $3, NULL, 'parent', now() - interval '10 min')`,
    [PARENT, UPLOAD, AUTHOR]
  );
  await db.query(
    `INSERT INTO public.comments (id, upload_id, user_id, parent_id, body, created_at) VALUES
       (gen_random_uuid(), $1, $2, $3, 'reply B', now() - interval '2 min'),
       (gen_random_uuid(), $1, $2, $3, 'reply A', now() - interval '4 min'),
       (gen_random_uuid(), $1, $2, $3, 'reply C', now() - interval '1 min')`,
    [UPLOAD, AUTHOR, PARENT]
  );
  expect(await replyBodies()).toEqual(['reply A', 'reply B', 'reply C']);
});

/**
 * LIVE-DB test for the nightly-dream inbox filter (migration 398).
 *
 * Nightly dreams are a PAID feature — their inbox row + badge must never be
 * silently dropped. Migration 396 filtered user-created dreams out of get_inbox
 * + get_new_notification_count with `subtype = 'manual'`, but nightly dreams
 * carry a NULL subtype, and `NULL = 'manual'` is NULL (not FALSE) → the whole
 * `NOT (... AND NULL)` collapsed to NULL → nightly rows were excluded too
 * (three-valued-logic trap). Migration 398 makes the comparison NULL-safe.
 *
 * These specs load the REAL get_inbox / get_new_notification_count bodies from
 * the migration file, so a future edit that reintroduces the trap (or otherwise
 * hides nightly) fails loudly here. We assert:
 *   - a NIGHTLY dream (subtype='nightly') is shown + badged,
 *   - a LEGACY nightly dream (subtype=NULL) is shown + badged  ← the exact bug,
 *   - a MANUAL dream (subtype='manual') is hidden + not badged,
 *   - a social notification is unaffected.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const ALICE = '00000000-0000-0000-0000-0000000000a1'; // recipient
const BOB = '00000000-0000-0000-0000-0000000000b2'; // a liker (social actor)

// group_keys — get_inbox groups by these, so each notification needs its own.
const GK_NIGHTLY = 'dream:nightly-explicit';
const GK_NIGHTLY_LEGACY = 'dream:nightly-legacy-null';
const GK_MANUAL = 'dream:manual-created';
const GK_LIKE = 'like:alice-post';

async function inboxGroupKeys(): Promise<string[]> {
  const { rows } = await db.query(
    `SELECT group_key FROM public.get_inbox($1, 20, 0) ORDER BY group_key`,
    [ALICE]
  );
  return rows.map((r) => r.group_key as string);
}

async function badgeCount(): Promise<number> {
  const { rows } = await db.query(`SELECT public.get_new_notification_count($1) AS n`, [ALICE]);
  return Number(rows[0].n);
}

beforeAll(async () => {
  db = await pool.connect();

  await db.query('DROP TABLE IF EXISTS public.notifications CASCADE');
  await db.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');

  await db.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    username text,
    avatar_url text,
    last_inbox_view_at timestamptz
  )`);
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY,
    image_url text,
    image_url_display text,
    thumbhash text
  )`);
  await db.query(`CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id uuid NOT NULL,
    actor_id uuid,
    type text NOT NULL,
    subtype text,
    upload_id uuid,
    comment_id uuid,
    reference_id uuid,
    body text,
    group_key text,
    seen_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp()
  )`);

  // Dependencies get_inbox references — not the object under test, so stub them.
  await db.query(
    `CREATE OR REPLACE FUNCTION public.block_exists(uuid, uuid) RETURNS boolean
     LANGUAGE sql IMMUTABLE AS $$ SELECT false $$`
  );
  await db.query(
    `CREATE OR REPLACE FUNCTION public.notification_category(text) RETURNS text
     LANGUAGE sql IMMUTABLE AS $$ SELECT 'Your dreams'::text $$`
  );

  // The REAL production functions, loaded from migration 398 (up to the body's
  // closing $$; — not the GRANT, which needs the Supabase 'authenticated' role).
  const sql = migrationSql('398_nightly_inbox_null_subtype_fix.sql');
  await db.query(extract(sql, 'CREATE OR REPLACE FUNCTION public.get_inbox(', '$$;'));
  await db.query(
    extract(sql, 'CREATE OR REPLACE FUNCTION public.get_new_notification_count(', '$$;')
  );

  await db.query(
    `INSERT INTO public.users (id, username, last_inbox_view_at)
    VALUES ($1, 'alice', NULL), ($2, 'bob', NULL)`,
    [ALICE, BOB]
  );

  // Four unseen notifications for Alice, one per group_key.
  await db.query(
    `INSERT INTO public.notifications (recipient_id, actor_id, type, subtype, group_key, body)
     VALUES
       ($1, $1, 'dream_generated', 'nightly', $3, 'A place from a dream'),
       ($1, $1, 'dream_generated', NULL,      $4, 'Legacy nightly, null subtype'),
       ($1, $1, 'dream_generated', 'manual',  $5, 'Something you made'),
       ($1, $2, 'post_like',       NULL,      $6, NULL)`,
    [ALICE, BOB, GK_NIGHTLY, GK_NIGHTLY_LEGACY, GK_MANUAL, GK_LIKE]
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('get_inbox — nightly dreams stay, manual dreams go (migration 398)', () => {
  it('shows the explicit nightly dream', async () => {
    expect(await inboxGroupKeys()).toContain(GK_NIGHTLY);
  });

  it('shows a LEGACY nightly dream with a NULL subtype (the three-valued-logic bug)', async () => {
    // This is the exact regression: a NULL subtype must be treated as "not
    // manual" and stay in the inbox, never trapped out by `NULL = 'manual'`.
    expect(await inboxGroupKeys()).toContain(GK_NIGHTLY_LEGACY);
  });

  it('HIDES the user-created (manual) dream', async () => {
    expect(await inboxGroupKeys()).not.toContain(GK_MANUAL);
  });

  it('leaves social notifications (a like) unaffected', async () => {
    expect(await inboxGroupKeys()).toContain(GK_LIKE);
  });

  it('returns exactly the three non-manual groups', async () => {
    expect((await inboxGroupKeys()).sort()).toEqual(
      [GK_NIGHTLY, GK_NIGHTLY_LEGACY, GK_LIKE].sort()
    );
  });
});

describe('get_new_notification_count — badge counts nightly, not manual (migration 398)', () => {
  it('counts the three shown unseen groups (both nightly + the like), never the manual dream', async () => {
    expect(await badgeCount()).toBe(3);
  });
});

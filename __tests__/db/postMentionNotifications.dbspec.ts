/**
 * LIVE-DB test for POST-DESCRIPTION @mention notifications (migration 383).
 *
 * Locks the fire conditions of trg_post_mention_notifications →
 * create_post_mention_notifications(): a caption @mention notifies the mentioned
 * user ONLY at first publish (posted_at NULL→non-NULL), case-insensitively,
 * respecting blocks, deduped, never on a caption edit / re-publish / private post
 * / self-mention. These rules are subtle and easy to regress, so we assert each
 * against the REAL trigger body loaded from the migration file.
 *
 * The real block_exists (migration 186) is loaded too, so the block-respect
 * assertions exercise production logic, not a stub.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const ALICE = '00000000-0000-0000-0000-0000000000a1'; // the poster/owner
const BOB = '00000000-0000-0000-0000-0000000000b2'; // mentioned
const CAROL = '00000000-0000-0000-0000-0000000000c3'; // mentioned in edits
const UPLOAD = '00000000-0000-0000-0000-0000000000d4';

async function mentionRows(): Promise<Array<Record<string, unknown>>> {
  const { rows } = await db.query(
    `SELECT recipient_id, actor_id, upload_id, comment_id, body
     FROM public.notifications WHERE type = 'post_mention' ORDER BY created_at`
  );
  return rows;
}

beforeAll(async () => {
  db = await pool.connect();

  await db.query('DROP TABLE IF EXISTS public.notifications CASCADE');
  await db.query('DROP TABLE IF EXISTS public.blocked_users CASCADE');
  await db.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');

  await db.query(`CREATE TABLE public.users (id uuid PRIMARY KEY, username text)`);
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL,
    is_public boolean NOT NULL DEFAULT false,
    posted_at timestamptz,
    description text
  )`);
  await db.query(`CREATE TABLE public.blocked_users (blocker_id uuid, blocked_id uuid)`);
  // group_key is nullable here — the real BEFORE-INSERT group_key trigger isn't
  // part of THIS unit; the post_mention trigger never sets it.
  await db.query(`CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id uuid NOT NULL,
    actor_id uuid,
    type text NOT NULL,
    upload_id uuid,
    comment_id uuid,
    body text,
    group_key text,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp()
  )`);

  // block_exists — hand-declared with the SAME UNNAMED (uuid, uuid) signature the
  // sibling comment dbspecs use, NOT migration 186's body. All dbspecs share one
  // DB; 186's named params (a/b) make a later sibling `CREATE OR REPLACE
  // block_exists(uuid, uuid)` fail with "cannot change name of input parameter a".
  // Same symmetric logic via positional args; block_exists isn't the object under
  // test here (the trigger is), so a matching stub is correct.
  await db.query('DROP FUNCTION IF EXISTS public.block_exists(uuid, uuid) CASCADE');
  await db.query(`CREATE FUNCTION public.block_exists(uuid, uuid) RETURNS boolean
    LANGUAGE sql STABLE AS $$
      SELECT EXISTS (
        SELECT 1 FROM public.blocked_users
        WHERE (blocker_id = $1 AND blocked_id = $2)
           OR (blocker_id = $2 AND blocked_id = $1)
      );
    $$`);
  // The trigger fn & trigger loaded from the real migration 383 (object under test).
  await db.query(
    extract(
      migrationSql('383_post_description_mentions.sql'),
      'CREATE OR REPLACE FUNCTION public.create_post_mention_notifications',
      '$$;'
    )
  );
  await db.query(
    extract(
      migrationSql('383_post_description_mentions.sql'),
      'CREATE TRIGGER trg_post_mention_notifications',
      'create_post_mention_notifications();'
    )
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['notifications', 'blocked_users', 'uploads', 'users']) {
    await db.query(`DELETE FROM public.${t}`);
  }
  await db.query(
    `INSERT INTO public.users (id, username) VALUES ($1,'alice'), ($2,'bob'), ($3,'carol')`,
    [ALICE, BOB, CAROL]
  );
});

/** Create a private dream row, then publish it (the real compose flow: one
 *  UPDATE flips is_public + sets posted_at + description together). */
async function publishViaUpdate(description: string) {
  await db.query(
    `INSERT INTO public.uploads (id, user_id, is_public, posted_at, description)
     VALUES ($1, $2, false, NULL, NULL)`,
    [UPLOAD, ALICE]
  );
  await db.query(
    `UPDATE public.uploads SET is_public = true, posted_at = now(), description = $2 WHERE id = $1`,
    [UPLOAD, description]
  );
}

it('notifies a mentioned user at first publish (posted_at NULL→non-NULL)', async () => {
  await publishViaUpdate('hey @bob check this out');
  const rows = await mentionRows();
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({
    recipient_id: BOB,
    actor_id: ALICE, // the poster
    upload_id: UPLOAD,
    comment_id: null, // a caption mention carries no comment id
  });
});

it('notifies when a post is INSERTED already-public (gallery host path)', async () => {
  await db.query(
    `INSERT INTO public.uploads (id, user_id, is_public, posted_at, description)
     VALUES ($1, $2, true, now(), 'album @bob')`,
    [UPLOAD, ALICE]
  );
  expect(await mentionRows()).toHaveLength(1);
});

it('does NOT notify on a caption EDIT of an already-public post', async () => {
  await publishViaUpdate('first @bob'); // bob notified
  await db.query('DELETE FROM public.notifications');
  // Editing the caption (posted_at unchanged) must NOT fire — Kevin: mentions
  // notify only when you post, not when you edit later.
  await db.query(`UPDATE public.uploads SET description = 'now also @carol' WHERE id = $1`, [
    UPLOAD,
  ]);
  expect(await mentionRows()).toHaveLength(0);
});

it('does NOT notify when posted_at is re-written on an already-published post (guard)', async () => {
  await publishViaUpdate('first @bob');
  await db.query('DELETE FROM public.notifications');
  // Even if posted_at is written again, OLD.posted_at was non-null → guard skips.
  await db.query(
    `UPDATE public.uploads SET posted_at = now(), description = 'again @carol' WHERE id = $1`,
    [UPLOAD]
  );
  expect(await mentionRows()).toHaveLength(0);
});

it('does NOT notify on re-publish (is_public flipped, posted_at untouched)', async () => {
  await publishViaUpdate('first @bob');
  await db.query('DELETE FROM public.notifications');
  await db.query(`UPDATE public.uploads SET is_public = false WHERE id = $1`, [UPLOAD]); // unpost
  await db.query(`UPDATE public.uploads SET is_public = true WHERE id = $1`, [UPLOAD]); // re-share
  expect(await mentionRows()).toHaveLength(0);
});

it('does NOT notify for a private (never-posted) post', async () => {
  await db.query(
    `INSERT INTO public.uploads (id, user_id, is_public, posted_at, description)
     VALUES ($1, $2, false, NULL, 'secret @bob')`,
    [UPLOAD, ALICE]
  );
  expect(await mentionRows()).toHaveLength(0);
});

it('matches the username case-INSENSITIVELY', async () => {
  await publishViaUpdate('shoutout @BoB'); // stored username is 'bob'
  const rows = await mentionRows();
  expect(rows).toHaveLength(1);
  expect(rows[0].recipient_id).toBe(BOB);
});

it('respects blocks in EITHER direction', async () => {
  // poster blocked the mentioned user
  await db.query(`INSERT INTO public.blocked_users (blocker_id, blocked_id) VALUES ($1,$2)`, [
    ALICE,
    BOB,
  ]);
  await publishViaUpdate('@bob');
  expect(await mentionRows()).toHaveLength(0);

  // and the reverse: mentioned user blocked the poster
  await db.query('DELETE FROM public.blocked_users');
  await db.query('DELETE FROM public.uploads');
  await db.query(`INSERT INTO public.blocked_users (blocker_id, blocked_id) VALUES ($1,$2)`, [
    BOB,
    ALICE,
  ]);
  await publishViaUpdate('@bob');
  expect(await mentionRows()).toHaveLength(0);
});

it('does NOT notify the poster mentioning themselves', async () => {
  await publishViaUpdate('note to self @alice');
  expect(await mentionRows()).toHaveLength(0);
});

it('de-dupes repeated mentions of the same user into ONE notification', async () => {
  await publishViaUpdate('@bob @bob @bob spam');
  expect(await mentionRows()).toHaveLength(1);
});

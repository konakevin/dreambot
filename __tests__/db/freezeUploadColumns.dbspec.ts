/**
 * LIVE-DB test for the freeze_upload_columns_on_update trigger (migration 108).
 *
 * Security invariant: a user can UPDATE their own upload row (RLS allows it),
 * but a BEFORE UPDATE trigger FREEZES the sensitive columns — is_approved,
 * is_moderated, user_id, image_url, ai_prompt, etc. — by reverting any change
 * back to OLD. So a client can edit a caption but cannot self-approve a post,
 * reassign ownership, or rewrite the AI provenance. (Postgres does NOT enforce
 * WITH CHECK on UPDATE automatically — this trigger is the guard.)
 *
 * Loads the real trigger fn + trigger DDL from the migration file.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const ID = '00000000-0000-0000-0000-000000000001';
const OWNER = '00000000-0000-0000-0000-0000000000a1';
const ATTACKER = '00000000-0000-0000-0000-0000000000b2';

interface UploadRow {
  is_approved: boolean;
  is_moderated: boolean;
  user_id: string;
  ai_prompt: string | null;
  caption: string | null;
}

async function row(): Promise<UploadRow> {
  const res = await pool.query<UploadRow>(
    'SELECT is_approved, is_moderated, user_id, ai_prompt, caption FROM public.uploads WHERE id=$1',
    [ID]
  );
  return res.rows[0];
}

beforeAll(async () => {
  const sql = migrationSql('108_uploads_rls_lockdown.sql');
  const fn = extract(
    sql,
    'CREATE OR REPLACE FUNCTION public.freeze_upload_columns_on_update',
    '$$;'
  );
  const trigger = extract(sql, 'CREATE TRIGGER trg_freeze_upload_columns', ';');

  await pool.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  // Stub with the columns the trigger references + a mutable control (caption).
  await pool.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY,
    user_id uuid,
    is_approved boolean,
    is_moderated boolean,
    image_url text,
    is_ai_generated boolean,
    ai_prompt text,
    dream_medium text,
    dream_vibe text,
    fuse_of uuid,
    bot_message text,
    from_wish boolean,
    caption text
  )`);
  await pool.query(fn);
  await pool.query(trigger);
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query('DELETE FROM public.uploads');
  await pool.query(
    `INSERT INTO public.uploads (id, user_id, is_approved, is_moderated, image_url, ai_prompt, caption)
     VALUES ($1, $2, false, false, 'https://img/orig.jpg', 'original prompt', 'original caption')`,
    [ID, OWNER]
  );
});

it('freezes is_approved / is_moderated (no client self-approval)', async () => {
  await pool.query('UPDATE public.uploads SET is_approved=true, is_moderated=true WHERE id=$1', [
    ID,
  ]);
  const r = await row();
  expect(r.is_approved).toBe(false);
  expect(r.is_moderated).toBe(false);
});

it('freezes user_id (no ownership reassignment)', async () => {
  await pool.query('UPDATE public.uploads SET user_id=$2 WHERE id=$1', [ID, ATTACKER]);
  expect((await row()).user_id).toBe(OWNER);
});

it('freezes ai_prompt / provenance', async () => {
  await pool.query("UPDATE public.uploads SET ai_prompt='rewritten' WHERE id=$1", [ID]);
  expect((await row()).ai_prompt).toBe('original prompt');
});

it('still allows non-frozen columns (caption) to change', async () => {
  await pool.query("UPDATE public.uploads SET caption='edited caption' WHERE id=$1", [ID]);
  expect((await row()).caption).toBe('edited caption');
});

it('a mixed update freezes the sensitive cols but lets the caption through', async () => {
  await pool.query(
    "UPDATE public.uploads SET is_approved=true, user_id=$2, caption='new' WHERE id=$1",
    [ID, ATTACKER]
  );
  const r = await row();
  expect(r.is_approved).toBe(false);
  expect(r.user_id).toBe(OWNER);
  expect(r.caption).toBe('new');
});

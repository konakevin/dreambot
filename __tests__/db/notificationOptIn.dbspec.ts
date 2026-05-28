/**
 * LIVE-DB test for the dream-notification opt-in RPC (migration 191).
 *
 * request_dream_notification lets a user opt a queued dream back INTO a
 * completion push when they leave the loading screen (default is suppressed so
 * a user who waits isn't double-pinged). It's SECURITY DEFINER + scoped to
 * auth.uid(), so the contract that matters is: a caller can only flip their OWN
 * row.
 *
 * (The sibling allow_upscale_notify RPC was dropped in migration 198 —
 * on-demand HD upscales now notify EVERY requester on completion, so the
 * suppress/re-enable dance was removed. request_dream_notification stays.)
 *
 * auth.uid() doesn't exist on a vanilla PG, so the fixture stubs it to read a
 * session GUC; everything runs on ONE pooled client so the GUC sticks.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const OTHER = '00000000-0000-0000-0000-0000000000b2';

/** Run the next statements as `uid` (sets the stubbed auth.uid() source). */
async function actAs(uid: string): Promise<void> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid]);
}

beforeAll(async () => {
  db = await pool.connect();
  const sql = migrationSql('191_notification_suppression.sql');
  const reqFn = extract(sql, 'CREATE OR REPLACE FUNCTION public.request_dream_notification', '$$;');

  // Stub auth.uid() to read a session GUC (the real Supabase auth.uid() reads
  // the JWT; here we drive it directly so we can test per-caller scoping).
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS $fn$ SELECT nullif(current_setting('test.uid', true), '')::uuid $fn$`);

  await db.query('DROP TABLE IF EXISTS public.dream_jobs CASCADE');
  await db.query(`CREATE TABLE public.dream_jobs (
    id uuid PRIMARY KEY,
    user_id uuid,
    notify_on_complete boolean NOT NULL DEFAULT false
  )`);
  await db.query(reqFn);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  await db.query('DELETE FROM public.dream_jobs');
});

describe('request_dream_notification', () => {
  const JOB = '00000000-0000-0000-0000-0000000000c1';

  it('flips notify_on_complete=true for the caller’s OWN job', async () => {
    await db.query('INSERT INTO public.dream_jobs (id, user_id) VALUES ($1, $2)', [JOB, OWNER]);
    await actAs(OWNER);
    await db.query('SELECT public.request_dream_notification($1)', [JOB]);
    const { rows } = await db.query(
      'SELECT notify_on_complete FROM public.dream_jobs WHERE id=$1',
      [JOB]
    );
    expect(rows[0].notify_on_complete).toBe(true);
  });

  it('does NOT flip another user’s job (auth.uid scoping)', async () => {
    await db.query('INSERT INTO public.dream_jobs (id, user_id) VALUES ($1, $2)', [JOB, OWNER]);
    await actAs(OTHER); // a different caller
    await db.query('SELECT public.request_dream_notification($1)', [JOB]);
    const { rows } = await db.query(
      'SELECT notify_on_complete FROM public.dream_jobs WHERE id=$1',
      [JOB]
    );
    expect(rows[0].notify_on_complete).toBe(false);
  });
});

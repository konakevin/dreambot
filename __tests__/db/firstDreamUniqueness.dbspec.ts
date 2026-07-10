/**
 * LIVE-DB test for the first-dream one-per-account guarantee (migration 281).
 *
 * Onboarding's free first dream is farming-gated by a PARTIAL UNIQUE INDEX —
 * `ux_dream_queue_active_first_dream` on dream_queue(user_id) WHERE
 * source='first_dream' AND status IN ('queued','in_progress'). The app also
 * check-then-inserts, but the INDEX is the atomic backstop: two parallel
 * enqueue requests that both pass the check must NOT both create an active
 * first-dream (the pre-281 random-dedup_key race let them). This locks the
 * index behaviourally — a future migration that drops it (or narrows the
 * predicate) fails here instead of silently re-opening the race (Architect
 * audit A6, 2026-07-10, promoting the grep-only content lock).
 *
 * Loads the real table + index DDL from the migration files (see _support/pg.ts).
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const USER_A = '00000000-0000-0000-0000-0000000000a1';
const USER_B = '00000000-0000-0000-0000-0000000000b2';

async function insertFirstDream(userId: string, status: string): Promise<void> {
  await pool.query(
    `INSERT INTO public.dream_queue (user_id, source, payload, status, weight)
     VALUES ($1, 'first_dream', '{}'::jsonb, $2, 'heavy')`,
    [userId, status]
  );
}

beforeAll(async () => {
  const dqTable = extract(
    migrationSql('156_dream_queue.sql'),
    'CREATE TABLE public.dream_queue',
    '\n);'
  );
  const weightCol = extract(
    migrationSql('265_dream_queue_weight_split.sql'),
    'ALTER TABLE public.dream_queue',
    ';'
  );
  const firstDreamIndex = extract(
    migrationSql('281_audit_hardening_economy.sql'),
    'CREATE UNIQUE INDEX IF NOT EXISTS ux_dream_queue_active_first_dream',
    ';'
  );

  await pool.query('DROP TABLE IF EXISTS public.dream_queue CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.users CASCADE');
  await pool.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await pool.query(dqTable);
  await pool.query(weightCol);
  await pool.query(firstDreamIndex);
  await pool.query('INSERT INTO public.users (id) VALUES ($1), ($2)', [USER_A, USER_B]);
});

afterEach(async () => {
  await pool.query('DELETE FROM public.dream_queue');
});

afterAll(async () => {
  await pool.end();
});

test('a second ACTIVE first-dream for the same user is rejected (23505)', async () => {
  await insertFirstDream(USER_A, 'queued');
  await expect(insertFirstDream(USER_A, 'queued')).rejects.toMatchObject({ code: '23505' });
  // in_progress is also "active" — it must collide with a queued one too.
  await expect(insertFirstDream(USER_A, 'in_progress')).rejects.toMatchObject({ code: '23505' });
});

test('a DIFFERENT user can still claim their own first dream', async () => {
  await insertFirstDream(USER_A, 'queued');
  await expect(insertFirstDream(USER_B, 'queued')).resolves.toBeUndefined();
});

test('a terminal first-dream does not block a fresh one (re-onboarding)', async () => {
  // completed/failed/dead_letter fall outside the partial predicate, so a user
  // whose first dream finished (or failed) can be given another one.
  for (const terminal of ['completed', 'failed', 'dead_letter']) {
    await insertFirstDream(USER_A, terminal);
  }
  await expect(insertFirstDream(USER_A, 'queued')).resolves.toBeUndefined();
});

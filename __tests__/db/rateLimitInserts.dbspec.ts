/**
 * LIVE-DB test for enforce_insert_rate_limit (migration 194).
 *
 * Server-side per-user insert rate limit (comments / follows / follow_requests).
 * The generic trigger function is exercised against a throwaway table so the
 * test is independent of those schemas — it proves: inserts are allowed up to
 * the limit then blocked, the limit is PER-USER, and only inserts within the
 * sliding window count (older rows age out).
 *
 * Loads the real function DDL from the migration file (see _support/pg.ts).
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const U1 = '00000000-0000-0000-0000-000000000001';
const U2 = '00000000-0000-0000-0000-000000000002';
const LIMIT = 3; // small limit for a fast test; prod uses 30–60

/** Insert a row for a user, optionally aged into the past (seconds). */
async function insertRow(uid: string, ageSec = 0): Promise<void> {
  await pool.query(
    "INSERT INTO public.rl_test (user_id, created_at) VALUES ($1, now() - ($2 || ' seconds')::interval)",
    [uid, String(ageSec)]
  );
}

beforeAll(async () => {
  const fn = extract(
    migrationSql('194_rate_limit_user_writes.sql'),
    'CREATE OR REPLACE FUNCTION public.enforce_insert_rate_limit',
    '$$;'
  );
  await pool.query('DROP TABLE IF EXISTS public.rl_test CASCADE');
  await pool.query(`CREATE TABLE public.rl_test (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await pool.query(fn);
  await pool.query(`CREATE TRIGGER trg_rl_test
    BEFORE INSERT ON public.rl_test
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_insert_rate_limit('${LIMIT}', '1 minute', 'user_id')`);
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query('DELETE FROM public.rl_test');
});

it('allows up to the limit, then blocks the next insert', async () => {
  for (let i = 0; i < LIMIT; i++) await insertRow(U1);
  await expect(insertRow(U1)).rejects.toThrow(/Slow down/);
});

it('the limit is PER USER (U2 unaffected by U1 hitting it)', async () => {
  for (let i = 0; i < LIMIT; i++) await insertRow(U1);
  await expect(insertRow(U1)).rejects.toThrow(); // U1 blocked
  await expect(insertRow(U2)).resolves.toBeUndefined(); // U2 fine
});

it('only counts inserts within the window — aged-out rows do not count', async () => {
  // LIMIT rows from 2 minutes ago (outside the 1-minute window)
  for (let i = 0; i < LIMIT; i++) await insertRow(U1, 120);
  // a fresh burst up to the limit still succeeds (old rows ignored)...
  for (let i = 0; i < LIMIT; i++) await expect(insertRow(U1)).resolves.toBeUndefined();
  // ...and only NOW does the limit bite
  await expect(insertRow(U1)).rejects.toThrow(/Slow down/);
});

it('raises the rate_limited error code (P0001)', async () => {
  for (let i = 0; i < LIMIT; i++) await insertRow(U1);
  await expect(insertRow(U1)).rejects.toMatchObject({ code: 'P0001' });
});

/**
 * LIVE-DB concurrency test for claim_upscale_job (migration 182).
 *
 * Proves the atomic single-flight in a REAL Postgres: N concurrent callers for
 * one upload → exactly ONE gets the upload_id back (kicks the Replicate run),
 * everyone else gets NULL. Plus: a fresh "processing" job is NOT re-claimable,
 * a failed one IS (retry), and a stale one IS (dead-isolate recovery).
 *
 * This is the one upscale invariant the pure jest suite can only source-assert —
 * Postgres ON CONFLICT / row-lock semantics can't be faked faithfully. It loads
 * the REAL claim_upscale_job + upscale_jobs DDL extracted from the migration
 * FILE (not a hand-copy) so the test can't drift from production SQL.
 *
 * Excluded from the default jest run (no `.test.ts` suffix). Runs in the CI
 * `db-tests` job against a Postgres service container, or locally via
 * `npm run test:dbspec` with DATABASE_URL pointing at any throwaway Postgres.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const UPLOAD_ID = '00000000-0000-0000-0000-000000000001';

async function claim(): Promise<string | null> {
  const res = await pool.query<{ r: string | null }>('SELECT public.claim_upscale_job($1) AS r', [
    UPLOAD_ID,
  ]);
  return res.rows[0].r;
}

beforeAll(async () => {
  const sql = migrationSql('182_upscale_on_demand.sql');
  const upscaleJobsTable = extract(sql, 'CREATE TABLE IF NOT EXISTS public.upscale_jobs', '\n);');
  const claimFn = extract(sql, 'CREATE OR REPLACE FUNCTION public.claim_upscale_job', '$$;');

  // Minimal fixture: the REAL DDL on top of an uploads stub (the FK target).
  await pool.query('DROP TABLE IF EXISTS public.upscale_jobs CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await pool.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
  await pool.query(upscaleJobsTable);
  await pool.query(claimFn);
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query('DELETE FROM public.upscale_jobs');
  await pool.query('DELETE FROM public.uploads');
  await pool.query('INSERT INTO public.uploads (id) VALUES ($1)', [UPLOAD_ID]);
});

it('exactly one of N concurrent claims wins (one Replicate run per upload)', async () => {
  const N = 30;
  const results = await Promise.all(Array.from({ length: N }, () => claim()));

  const winners = results.filter((r) => r === UPLOAD_ID);
  const losers = results.filter((r) => r === null);
  expect(winners).toHaveLength(1);
  expect(losers).toHaveLength(N - 1);

  // ...and the job table holds exactly one row for this upload.
  const { rows } = await pool.query<{ c: number }>(
    'SELECT count(*)::int AS c FROM public.upscale_jobs WHERE upload_id=$1',
    [UPLOAD_ID]
  );
  expect(rows[0].c).toBe(1);
});

it('a fresh "processing" job is NOT re-claimable (no second kick while in flight)', async () => {
  expect(await claim()).toBe(UPLOAD_ID); // first caller kicks
  expect(await claim()).toBeNull(); // second sees fresh processing → no kick
});

it('a failed job IS re-claimable (retry)', async () => {
  await claim();
  await pool.query("UPDATE public.upscale_jobs SET status='failed' WHERE upload_id=$1", [
    UPLOAD_ID,
  ]);
  expect(await claim()).toBe(UPLOAD_ID);
});

it('a stale "processing" job IS re-claimable (dead-isolate recovery)', async () => {
  await claim();
  await pool.query(
    "UPDATE public.upscale_jobs SET updated_at = now() - interval '10 minutes' WHERE upload_id=$1",
    [UPLOAD_ID]
  );
  expect(await claim()).toBe(UPLOAD_ID);
});

it('attempts increments on each successful re-claim', async () => {
  await claim(); // attempts = 1
  await pool.query("UPDATE public.upscale_jobs SET status='failed' WHERE upload_id=$1", [
    UPLOAD_ID,
  ]);
  await claim(); // re-claim → attempts = 2
  const { rows } = await pool.query<{ attempts: number }>(
    'SELECT attempts FROM public.upscale_jobs WHERE upload_id=$1',
    [UPLOAD_ID]
  );
  expect(rows[0].attempts).toBe(2);
});

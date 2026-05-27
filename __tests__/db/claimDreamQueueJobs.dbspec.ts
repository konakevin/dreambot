/**
 * LIVE-DB test for claim_dream_queue_jobs(worker, limit) (migrations 156 + 192).
 *
 * The nightly/queue scaling invariant: the worker batch-claims due jobs with
 * SELECT ... FOR UPDATE SKIP LOCKED so overlapping ticks (and multiple worker
 * isolates) NEVER claim the same job twice — that's what lets us scale by just
 * running more/overlapping workers. Also: respects the limit, marks claimed
 * jobs in_progress with the worker id, and honors the created_at-in-future
 * backoff gate (a retry scheduled for later isn't claimed early).
 *
 * Loads the real table + function DDL from the migration files (see _support/pg.ts).
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const USER_ID = '00000000-0000-0000-0000-0000000000aa';

interface QueueRow {
  id: string;
  status: string;
  worker_id: string | null;
  created_at: string;
}

async function claim(worker: string, limit: number): Promise<QueueRow[]> {
  const res = await pool.query<QueueRow>('SELECT * FROM public.claim_dream_queue_jobs($1, $2)', [
    worker,
    limit,
  ]);
  return res.rows;
}

/** Seed n queued jobs; createdOffsetSec shifts created_at (negative = older, positive = future backoff). */
async function seedJobs(n: number, createdOffsetSec = 0): Promise<void> {
  for (let i = 0; i < n; i++) {
    await pool.query(
      `INSERT INTO public.dream_queue (user_id, source, payload, status, created_at)
       VALUES ($1, 'nightly', '{}'::jsonb, 'queued', now() + ($2 || ' seconds')::interval)`,
      // stagger created_at slightly so ORDER BY is deterministic
      [USER_ID, String(createdOffsetSec - i)]
    );
  }
}

async function countByStatus(status: string): Promise<number> {
  const res = await pool.query<{ c: number }>(
    'SELECT count(*)::int AS c FROM public.dream_queue WHERE status=$1',
    [status]
  );
  return res.rows[0].c;
}

beforeAll(async () => {
  const dq = extract(
    migrationSql('156_dream_queue.sql'),
    'CREATE TABLE public.dream_queue',
    '\n);'
  );
  const sql192 = migrationSql('192_dream_queue_nightly_scaling.sql');
  const dedupCol = extract(sql192, 'ALTER TABLE public.dream_queue', ';');
  const claimFn = extract(
    sql192,
    'CREATE OR REPLACE FUNCTION public.claim_dream_queue_jobs',
    '$$;'
  );

  await pool.query('DROP TABLE IF EXISTS public.dream_queue CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.users CASCADE');
  // FK targets (dream_queue references both).
  await pool.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await pool.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
  await pool.query(dq);
  await pool.query(dedupCol);
  await pool.query(claimFn);
  await pool.query('INSERT INTO public.users (id) VALUES ($1)', [USER_ID]);
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query('DELETE FROM public.dream_queue');
});

it('claims up to the limit and marks them in_progress with the worker id', async () => {
  await seedJobs(5);
  const claimed = await claim('worker-A', 3);

  expect(claimed).toHaveLength(3);
  expect(claimed.every((j) => j.status === 'in_progress')).toBe(true);
  expect(claimed.every((j) => j.worker_id === 'worker-A')).toBe(true);
  expect(await countByStatus('in_progress')).toBe(3);
  expect(await countByStatus('queued')).toBe(2);
});

it('two concurrent workers never claim the same job (FOR UPDATE SKIP LOCKED)', async () => {
  await seedJobs(8);
  const [a, b] = await Promise.all([claim('worker-A', 5), claim('worker-B', 5)]);

  const idsA = a.map((j) => j.id);
  const idsB = b.map((j) => j.id);
  const overlap = idsA.filter((id) => idsB.includes(id));

  expect(overlap).toHaveLength(0); // disjoint — no double claim
  expect(a.length).toBeLessThanOrEqual(5);
  expect(b.length).toBeLessThanOrEqual(5);
  expect(idsA.length + idsB.length).toBe(8); // all 8 claimed across the two
  expect(await countByStatus('queued')).toBe(0);
});

it('does NOT claim jobs whose created_at is in the future (retry backoff gate)', async () => {
  await seedJobs(2); // due now
  await seedJobs(3, 3600); // scheduled an hour out (backoff)
  const claimed = await claim('worker-A', 10);

  expect(claimed).toHaveLength(2);
  expect(await countByStatus('queued')).toBe(3); // the backed-off ones stay queued
});

it('claims oldest-first (ORDER BY created_at)', async () => {
  await seedJobs(4); // created_at staggered: each later i is older
  const claimed = await claim('worker-A', 2);
  const times = claimed.map((j) => new Date(j.created_at).getTime());
  expect(times[0]).toBeLessThanOrEqual(times[1]);
});

it('returns nothing when the queue is empty', async () => {
  expect(await claim('worker-A', 10)).toHaveLength(0);
});

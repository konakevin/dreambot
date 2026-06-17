/**
 * LIVE-DB test for claim_dream_queue_jobs_by_weight ATOMIC per-weight cap
 * (migration 275). The scaling invariant: the per-weight concurrency cap must
 * hold even under CONCURRENT invokers (pg_cron tick + enqueue kick + the GitHub
 * Actions sync backstop can all claim at once). Before 275 the count→claim was
 * non-atomic, so two invokers could each read the same headroom and overshoot
 * the heavy cap → Fly.io dual-swap exhaustion. 275 folds the cap into the claim
 * (read cap → count in_progress → claim LEAST(limit, cap-inflight)) serialized
 * per-weight by a transaction-scoped advisory lock.
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
  weight: string;
  worker_id: string | null;
}

async function claim(worker: string, weight: string, limit: number): Promise<QueueRow[]> {
  const res = await pool.query<QueueRow>(
    'SELECT * FROM public.claim_dream_queue_jobs_by_weight($1, $2, $3)',
    [worker, weight, limit]
  );
  return res.rows;
}

async function seedQueued(n: number, weight: string): Promise<void> {
  for (let i = 0; i < n; i++) {
    await pool.query(
      `INSERT INTO public.dream_queue (user_id, source, payload, status, weight, created_at)
       VALUES ($1, 'nightly', '{}'::jsonb, 'queued', $2, now() - ($3 || ' seconds')::interval)`,
      [USER_ID, weight, String(i)]
    );
  }
}

async function seedInProgress(n: number, weight: string): Promise<void> {
  for (let i = 0; i < n; i++) {
    await pool.query(
      `INSERT INTO public.dream_queue (user_id, source, payload, status, weight, started_at)
       VALUES ($1, 'nightly', '{}'::jsonb, 'in_progress', $2, now())`,
      [USER_ID, weight]
    );
  }
}

async function inProgressCount(weight: string): Promise<number> {
  const res = await pool.query<{ c: number }>(
    "SELECT count(*)::int AS c FROM public.dream_queue WHERE status='in_progress' AND weight=$1",
    [weight]
  );
  return res.rows[0].c;
}

async function setCaps(light: number, heavy: number): Promise<void> {
  await pool.query(
    'UPDATE public.engine_config SET dream_queue_max_concurrent=$1, dream_queue_max_concurrent_heavy=$2 WHERE id=1',
    [light, heavy]
  );
}

beforeAll(async () => {
  const dqTable = extract(
    migrationSql('156_dream_queue.sql'),
    'CREATE TABLE public.dream_queue',
    '\n);'
  );
  const dedupCol = extract(
    migrationSql('192_dream_queue_nightly_scaling.sql'),
    'ALTER TABLE public.dream_queue',
    ';'
  );
  const weightCol = extract(
    migrationSql('265_dream_queue_weight_split.sql'),
    'ALTER TABLE public.dream_queue',
    ';'
  );
  const claimFn = extract(
    migrationSql('275_atomic_claim_cap.sql'),
    'CREATE OR REPLACE FUNCTION public.claim_dream_queue_jobs_by_weight',
    '$$;'
  );

  await pool.query('DROP TABLE IF EXISTS public.dream_queue CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.users CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await pool.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await pool.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
  // Minimal engine_config stub — only the cap columns the claim RPC reads.
  await pool.query(
    `CREATE TABLE public.engine_config (
       id int PRIMARY KEY,
       dream_queue_max_concurrent int NOT NULL DEFAULT 40,
       dream_queue_max_concurrent_heavy int NOT NULL DEFAULT 10
     )`
  );
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)');
  await pool.query(dqTable);
  await pool.query(dedupCol);
  await pool.query(weightCol);
  await pool.query(claimFn);
  await pool.query('INSERT INTO public.users (id) VALUES ($1)', [USER_ID]);
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query('DELETE FROM public.dream_queue');
  await setCaps(40, 10);
});

it('clamps a single claim to the remaining headroom (cap - in_progress)', async () => {
  await seedInProgress(7, 'heavy');
  await seedQueued(20, 'heavy');
  const claimed = await claim('worker-A', 'heavy', 10);
  // cap 10, 7 already in_progress → only 3 slots left
  expect(claimed.length).toBe(3);
  expect(await inProgressCount('heavy')).toBe(10);
});

it('claims nothing when already at the cap', async () => {
  await seedInProgress(10, 'heavy');
  await seedQueued(5, 'heavy');
  const claimed = await claim('worker-A', 'heavy', 10);
  expect(claimed.length).toBe(0);
  expect(await inProgressCount('heavy')).toBe(10);
});

it('CONCURRENT claims never collectively exceed the cap (the overshoot race)', async () => {
  await setCaps(40, 10);
  await seedQueued(30, 'heavy'); // plenty queued
  // Three invokers race, each asking for 10 (the per-tick limit). Without the
  // atomic cap, they'd each read inflight=0 and claim 10 → 30 in_progress.
  const [a, b, c] = await Promise.all([
    claim('worker-A', 'heavy', 10),
    claim('worker-B', 'heavy', 10),
    claim('worker-C', 'heavy', 10),
  ]);
  const total = a.length + b.length + c.length;
  expect(total).toBe(10); // exactly the cap — no overshoot
  expect(await inProgressCount('heavy')).toBe(10);
  // disjoint claims (SKIP LOCKED)
  const ids = [...a, ...b, ...c].map((j) => j.id);
  expect(new Set(ids).size).toBe(ids.length);
});

it('light and heavy caps are independent (different lock keys)', async () => {
  await setCaps(2, 10);
  await seedInProgress(2, 'light'); // light at its cap of 2
  await seedQueued(5, 'light');
  await seedQueued(5, 'heavy');
  const [light, heavy] = await Promise.all([
    claim('worker-A', 'light', 10),
    claim('worker-B', 'heavy', 10),
  ]);
  expect(light.length).toBe(0); // light capped
  expect(heavy.length).toBe(5); // heavy unaffected
});

it('falls back to safe defaults when the engine_config row is missing', async () => {
  await pool.query('DELETE FROM public.engine_config');
  await seedQueued(20, 'heavy');
  const claimed = await claim('worker-A', 'heavy', 100);
  expect(claimed.length).toBe(10); // heavy default fallback
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)'); // restore for other tests
});

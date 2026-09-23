/**
 * LIVE-DB test for the pg_cron nightly enqueue backstop with the burst spread (migration 551,
 * NIGHTLY_ROBUSTNESS_PLAN.md item 3). This backstop is the path that actually enqueues most nights (the GitHub
 * cron fires unreliably), so its stagger is what decides whether a time zone starts together or trickles.
 *
 * Real function DDL from the migration file; stub tables for the cohort. The test picks a fixed-offset zone in
 * which it is currently at or after 4am, so the cohort is always due whatever time CI runs.
 */
import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const sql = migrationSql('551_nightly_enqueue_spread.sql');

/** An Etc/GMT zone whose local hour right now is between 4 and 23. */
function dueZone(): string {
  const h = new Date().getUTCHours();
  if (h >= 4 && h <= 23) return 'Etc/UTC';
  const offset = 6 - h; // local hour 6; h in 0..3 → offset 3..6 → UTC+offset
  return `Etc/GMT-${offset}`; // POSIX sign: Etc/GMT-3 is UTC+3
}

async function seedUsers(n: number, zone: string) {
  for (let k = 0; k < n; k++) {
    const id = `00000000-0000-0000-0000-${String(k + 1).padStart(12, '0')}`;
    await pool.query('INSERT INTO public.users (id, timezone, is_bot) VALUES ($1, $2, false)', [
      id,
      zone,
    ]);
    await pool.query(
      'INSERT INTO public.user_recipes (user_id, onboarding_completed, ai_enabled) VALUES ($1, true, true)',
      [id]
    );
  }
}

async function spreadSeconds(): Promise<number[]> {
  const { rows } = await pool.query(
    `SELECT extract(epoch FROM created_at - min(created_at) OVER ())::numeric AS s
       FROM public.dream_queue ORDER BY created_at`
  );
  return rows.map((r) => Math.round(Number(r.s)));
}

beforeAll(async () => {
  for (const t of ['dream_queue', 'user_recipes', 'users', 'engine_config']) {
    await pool.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  await pool.query(
    'CREATE TABLE public.users (id uuid PRIMARY KEY, timezone text, is_bot boolean NOT NULL DEFAULT false)'
  );
  await pool.query(
    'CREATE TABLE public.user_recipes (user_id uuid PRIMARY KEY, onboarding_completed boolean, ai_enabled boolean)'
  );
  await pool.query(`CREATE TABLE public.dream_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source text, user_id uuid, status text, payload jsonb,
    dedup_key text UNIQUE, created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await pool.query('CREATE TABLE public.engine_config (id integer PRIMARY KEY)');
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)');
  await pool.query(extract(sql, 'ALTER TABLE public.engine_config', ';'));
  await pool.query(
    'CREATE OR REPLACE FUNCTION public.is_dream_eligible(p uuid) RETURNS boolean LANGUAGE sql AS $f$ SELECT true $f$'
  );
  await pool.query(extract(sql, 'CREATE OR REPLACE FUNCTION public.enqueue_nightly_dreams', '$$;'));
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['dream_queue', 'user_recipes', 'users'])
    await pool.query(`DELETE FROM public.${t}`);
  await pool.query(
    'UPDATE public.engine_config SET nightly_enqueue_spacing_s = 30, nightly_enqueue_max_spread_min = 60 WHERE id = 1'
  );
});

it('a 5-user time zone is enqueued 30 s apart instead of all at once', async () => {
  await seedUsers(5, dueZone());
  const { rows } = await pool.query('SELECT r_outcome FROM public.enqueue_nightly_dreams(false)');
  expect(rows.map((r) => r.r_outcome)).toEqual(Array(5).fill('enqueued'));
  expect(await spreadSeconds()).toEqual([0, 30, 60, 90, 120]);
});

it('a huge cohort stays inside max_spread (the step shrinks)', async () => {
  await pool.query(
    'UPDATE public.engine_config SET nightly_enqueue_max_spread_min = 1 WHERE id = 1'
  );
  await seedUsers(7, dueZone()); // 6 gaps inside 60 s → 10 s apart, not 30
  await pool.query('SELECT * FROM public.enqueue_nightly_dreams(false)');
  expect(await spreadSeconds()).toEqual([0, 10, 20, 30, 40, 50, 60]);
});

it('spacing 0 = the old behaviour: every job at the same instant', async () => {
  await pool.query('UPDATE public.engine_config SET nightly_enqueue_spacing_s = 0 WHERE id = 1');
  await seedUsers(3, dueZone());
  await pool.query('SELECT * FROM public.enqueue_nightly_dreams(false)');
  expect(await spreadSeconds()).toEqual([0, 0, 0]);
});

it('a re-run the same day is a no-op (dedup), and dry run never inserts', async () => {
  await seedUsers(3, dueZone());
  const dry = await pool.query('SELECT r_outcome FROM public.enqueue_nightly_dreams(true)');
  expect(dry.rows.map((r) => r.r_outcome)).toEqual(Array(3).fill('would_enqueue'));
  expect((await pool.query('SELECT count(*)::int AS n FROM public.dream_queue')).rows[0].n).toBe(0);
  await pool.query('SELECT * FROM public.enqueue_nightly_dreams(false)');
  const again = await pool.query('SELECT r_outcome FROM public.enqueue_nightly_dreams(false)');
  expect(again.rows.map((r) => r.r_outcome)).toEqual(Array(3).fill('skipped_dedup'));
  expect((await pool.query('SELECT count(*)::int AS n FROM public.dream_queue')).rows[0].n).toBe(3);
});

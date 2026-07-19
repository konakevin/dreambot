/**
 * LIVE-DB test for claim_first_dream_ip(ip) (migration 332).
 *
 * The anti-account-farming lever: the per-ACCOUNT guard lets N fresh accounts
 * each claim one free (expensive, dual-cast face-swap) first dream, so this
 * per-IP cap bounds a farm. It was flagged in the 2026-07-19 audit (A6) as an
 * UNLOCKED invariant — a careless edit to the migration (drop the count, widen
 * the window, or re-grant EXECUTE to clients) would silently reopen farming with
 * nothing catching it. This locks the behavior.
 *
 * Loads the real function DDL straight from migration 332 (see _support/pg.ts),
 * so a drift in the production SQL fails loudly instead of testing a stale copy.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();

async function claim(ip: string | null): Promise<boolean> {
  const res = await pool.query<{ r: boolean }>('SELECT public.claim_first_dream_ip($1) AS r', [ip]);
  return res.rows[0].r;
}

async function setCap(max: number, windowHours = 24): Promise<void> {
  await pool.query(
    'UPDATE public.engine_config SET first_dream_ip_max = $1, first_dream_ip_window_hours = $2 WHERE id = 1',
    [max, windowHours]
  );
}

async function countEvents(ip: string): Promise<number> {
  const res = await pool.query<{ c: string }>(
    'SELECT count(*)::text AS c FROM public.first_dream_ip_events WHERE ip = $1',
    [ip]
  );
  return Number(res.rows[0].c);
}

beforeAll(async () => {
  const fn = extract(
    migrationSql('332_first_dream_ip_rate_limit.sql'),
    'CREATE OR REPLACE FUNCTION public.claim_first_dream_ip',
    '$$;'
  );
  // Minimal fixtures the function reads (engine_config singleton + the event log).
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await pool.query(`CREATE TABLE public.engine_config (
    id integer PRIMARY KEY,
    first_dream_ip_max integer NOT NULL DEFAULT 8,
    first_dream_ip_window_hours integer NOT NULL DEFAULT 24
  )`);
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)');
  await pool.query('DROP TABLE IF EXISTS public.first_dream_ip_events CASCADE');
  await pool.query(`CREATE TABLE public.first_dream_ip_events (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ip         text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await pool.query(fn);
});

beforeEach(async () => {
  await pool.query('TRUNCATE public.first_dream_ip_events');
  await setCap(8, 24);
});

afterAll(async () => {
  await pool.end();
});

it('allows claims up to the cap, then blocks (records only the allowed ones)', async () => {
  await setCap(3);
  const ip = '203.0.113.10';
  expect(await claim(ip)).toBe(true);
  expect(await claim(ip)).toBe(true);
  expect(await claim(ip)).toBe(true);
  // 4th over the cap → blocked, and NOT recorded.
  expect(await claim(ip)).toBe(false);
  expect(await claim(ip)).toBe(false);
  expect(await countEvents(ip)).toBe(3);
});

it('caps are per-IP: a maxed IP does not affect a different IP', async () => {
  await setCap(2);
  const a = '203.0.113.20';
  const b = '203.0.113.21';
  expect(await claim(a)).toBe(true);
  expect(await claim(a)).toBe(true);
  expect(await claim(a)).toBe(false); // a is maxed
  expect(await claim(b)).toBe(true); // b is untouched
  expect(await claim(b)).toBe(true);
  expect(await claim(b)).toBe(false);
});

it('unknown IP (null / empty / whitespace) fails OPEN and records nothing', async () => {
  await setCap(1);
  expect(await claim(null)).toBe(true);
  expect(await claim('')).toBe(true);
  expect(await claim('   ')).toBe(true);
  // Fail-open must not consume budget or write rows.
  const res = await pool.query<{ c: string }>(
    'SELECT count(*)::text AS c FROM public.first_dream_ip_events'
  );
  expect(Number(res.rows[0].c)).toBe(0);
});

it('the window is rolling: events older than the window do not count', async () => {
  await setCap(2, 24);
  const ip = '203.0.113.30';
  // Two claims 48h ago (outside the 24h window) should not consume today's budget.
  await pool.query(
    `INSERT INTO public.first_dream_ip_events (ip, created_at)
     VALUES ($1, now() - interval '48 hours'), ($1, now() - interval '48 hours')`,
    [ip]
  );
  expect(await claim(ip)).toBe(true); // stale events ignored
  expect(await claim(ip)).toBe(true);
  expect(await claim(ip)).toBe(false); // now at the cap with two fresh claims
});

it('cap is admin-tunable via engine_config (no redeploy)', async () => {
  const ip = '203.0.113.40';
  await setCap(1);
  expect(await claim(ip)).toBe(true);
  expect(await claim(ip)).toBe(false); // capped at 1
  await setCap(3); // widen
  expect(await claim(ip)).toBe(true); // one more allowed now
  expect(await claim(ip)).toBe(true);
  expect(await claim(ip)).toBe(false); // capped at 3
});

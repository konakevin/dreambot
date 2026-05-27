/**
 * LIVE-DB test for is_pro_active(user_id) (migration 176).
 *
 * This Postgres function is one of the THREE runtimes of the Pro/trial
 * single-source-of-truth (alongside lib/proStatus.ts and
 * scripts/lib/nightlyEligibility.js, both unit-tested in jest). It's the gate
 * Pro-only Edge Functions call, so it must agree with the others: a user is Pro
 * iff they have an active PAID subscription (unexpired) OR are within the 14-day
 * trial. Re-validated on every read — a missed expiry webhook can't leave
 * permanent Pro, and trial lapse is purely time-based.
 *
 * Loads the real function DDL from the migration file (see _support/pg.ts).
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();

/** Insert a user with the given Pro/trial state, return its id. */
let seq = 0;
async function makeUser(state: {
  pro_subscription?: boolean;
  pro_subscription_expires_at?: string | null;
  pro_trial_started_at?: string | null;
}): Promise<string> {
  seq += 1;
  const id = `00000000-0000-0000-0000-${String(seq).padStart(12, '0')}`;
  await pool.query(
    `INSERT INTO public.users (id, pro_subscription, pro_subscription_expires_at, pro_trial_started_at)
     VALUES ($1, $2, $3, $4)`,
    [
      id,
      state.pro_subscription ?? false,
      state.pro_subscription_expires_at ?? null,
      state.pro_trial_started_at ?? null,
    ]
  );
  return id;
}

async function isProActive(userId: string): Promise<boolean> {
  const res = await pool.query<{ r: boolean }>('SELECT public.is_pro_active($1) AS r', [userId]);
  return res.rows[0].r;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000).toISOString();
const daysAhead = (n: number) => new Date(Date.now() + n * 86400_000).toISOString();

beforeAll(async () => {
  const fn = extract(
    migrationSql('176_pro_subscription_phase2.sql'),
    'CREATE OR REPLACE FUNCTION public.is_pro_active',
    '$$;'
  );
  await pool.query('DROP TABLE IF EXISTS public.users CASCADE');
  await pool.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    pro_subscription boolean NOT NULL DEFAULT false,
    pro_subscription_expires_at timestamptz,
    pro_trial_started_at timestamptz
  )`);
  await pool.query(fn);
});

afterAll(async () => {
  await pool.end();
});

it('paid + no expiry → Pro', async () => {
  const u = await makeUser({ pro_subscription: true, pro_subscription_expires_at: null });
  expect(await isProActive(u)).toBe(true);
});

it('paid + future expiry → Pro (e.g. cancelled-but-not-yet-expired)', async () => {
  const u = await makeUser({ pro_subscription: true, pro_subscription_expires_at: daysAhead(3) });
  expect(await isProActive(u)).toBe(true);
});

it('paid flag but EXPIRED → free (missed EXPIRATION webhook is re-validated away)', async () => {
  const u = await makeUser({ pro_subscription: true, pro_subscription_expires_at: daysAgo(1) });
  expect(await isProActive(u)).toBe(false);
});

it('within the 14-day trial → Pro', async () => {
  const u = await makeUser({ pro_trial_started_at: daysAgo(5) });
  expect(await isProActive(u)).toBe(true);
});

it('trial lapsed (>14 days), no paid sub → free', async () => {
  const u = await makeUser({ pro_trial_started_at: daysAgo(20) });
  expect(await isProActive(u)).toBe(false);
});

it('no subscription and no trial → free', async () => {
  const u = await makeUser({});
  expect(await isProActive(u)).toBe(false);
});

it('lapsed trial BUT active paid sub → Pro (paid path independent of trial)', async () => {
  const u = await makeUser({
    pro_subscription: true,
    pro_subscription_expires_at: daysAhead(30),
    pro_trial_started_at: daysAgo(40),
  });
  expect(await isProActive(u)).toBe(true);
});

it('unknown user id → false (no row)', async () => {
  expect(await isProActive('00000000-0000-0000-0000-0000000000ff')).toBe(false);
});

/**
 * LIVE-DB test for is_basic_active(user_id) + is_dream_eligible(user_id)
 * (migration 257_dreambot_basic).
 *
 * These join the DreamBot Basic tier into the nightly-dream gate:
 *   - is_basic_active  = paid + unexpired Basic (NO trial component).
 *   - is_dream_eligible = is_pro_active OR is_basic_active — the authoritative
 *     "should this user get nightly dreams" gate. It must agree with the JS
 *     mirrors (lib/proStatus.ts + scripts/lib/nightlyEligibility.js).
 *
 * Loads the real DDL: is_pro_active from migration 248 (is_dream_eligible calls
 * it), is_basic_active + is_dream_eligible from migration 257.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();

let seq = 0x100; // offset from isProActive.dbspec's id space to avoid collisions
async function makeUser(state: {
  pro_subscription?: boolean;
  pro_subscription_expires_at?: string | null;
  pro_trial_started_at?: string | null;
  basic_subscription?: boolean;
  basic_subscription_expires_at?: string | null;
}): Promise<string> {
  seq += 1;
  const id = `00000000-0000-0000-0000-${String(seq).padStart(12, '0')}`;
  await pool.query(
    `INSERT INTO public.users
       (id, pro_subscription, pro_subscription_expires_at, pro_trial_started_at,
        basic_subscription, basic_subscription_expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      id,
      state.pro_subscription ?? false,
      state.pro_subscription_expires_at ?? null,
      state.pro_trial_started_at ?? null,
      state.basic_subscription ?? false,
      state.basic_subscription_expires_at ?? null,
    ]
  );
  return id;
}

async function isBasicActive(userId: string): Promise<boolean> {
  const res = await pool.query<{ r: boolean }>('SELECT public.is_basic_active($1) AS r', [userId]);
  return res.rows[0].r;
}
async function isDreamEligible(userId: string): Promise<boolean> {
  const res = await pool.query<{ r: boolean }>('SELECT public.is_dream_eligible($1) AS r', [
    userId,
  ]);
  return res.rows[0].r;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000).toISOString();
const daysAhead = (n: number) => new Date(Date.now() + n * 86400_000).toISOString();

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS public.users CASCADE');
  await pool.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    pro_subscription boolean NOT NULL DEFAULT false,
    pro_subscription_expires_at timestamptz,
    pro_trial_started_at timestamptz,
    basic_subscription boolean NOT NULL DEFAULT false,
    basic_subscription_expires_at timestamptz
  )`);
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await pool.query(`CREATE TABLE public.engine_config (
    id integer PRIMARY KEY,
    pro_trial_days integer NOT NULL DEFAULT 14
  )`);
  await pool.query('INSERT INTO public.engine_config (id, pro_trial_days) VALUES (1, 14)');

  // is_pro_active (migration 248) — is_dream_eligible calls it.
  await pool.query(
    extract(
      migrationSql('248_is_pro_active_config_trial.sql'),
      'CREATE OR REPLACE FUNCTION public.is_pro_active',
      '$$;'
    )
  );
  // is_basic_active + is_dream_eligible (migration 257).
  const m257 = migrationSql('257_dreambot_basic.sql');
  await pool.query(extract(m257, 'CREATE OR REPLACE FUNCTION public.is_basic_active', '$$;'));
  await pool.query(extract(m257, 'CREATE OR REPLACE FUNCTION public.is_dream_eligible', '$$;'));
});

afterAll(async () => {
  await pool.end();
});

// ── is_basic_active ──────────────────────────────────────────────────────
it('Basic paid + no expiry → active', async () => {
  const u = await makeUser({ basic_subscription: true, basic_subscription_expires_at: null });
  expect(await isBasicActive(u)).toBe(true);
});

it('Basic paid + future expiry → active', async () => {
  const u = await makeUser({
    basic_subscription: true,
    basic_subscription_expires_at: daysAhead(10),
  });
  expect(await isBasicActive(u)).toBe(true);
});

it('Basic flag but EXPIRED → inactive (missed EXPIRATION re-validated away)', async () => {
  const u = await makeUser({ basic_subscription: true, basic_subscription_expires_at: daysAgo(1) });
  expect(await isBasicActive(u)).toBe(false);
});

it('Basic has NO trial — a Pro trial does not confer Basic', async () => {
  const u = await makeUser({ pro_trial_started_at: daysAgo(1) });
  expect(await isBasicActive(u)).toBe(false);
});

it('no Basic flag → inactive', async () => {
  const u = await makeUser({});
  expect(await isBasicActive(u)).toBe(false);
});

// ── is_dream_eligible (Pro OR trial OR Basic) ─────────────────────────────
it('active paid Pro → dream-eligible', async () => {
  const u = await makeUser({ pro_subscription: true, pro_subscription_expires_at: daysAhead(30) });
  expect(await isDreamEligible(u)).toBe(true);
});

it('within Pro trial → dream-eligible', async () => {
  const u = await makeUser({ pro_trial_started_at: daysAgo(5) });
  expect(await isDreamEligible(u)).toBe(true);
});

it('Basic only (no Pro, lapsed trial) → dream-eligible', async () => {
  const u = await makeUser({
    basic_subscription: true,
    basic_subscription_expires_at: daysAhead(20),
    pro_trial_started_at: daysAgo(40),
  });
  expect(await isDreamEligible(u)).toBe(true);
});

it('expired Basic + lapsed trial + no Pro → NOT eligible', async () => {
  const u = await makeUser({
    basic_subscription: true,
    basic_subscription_expires_at: daysAgo(1),
    pro_trial_started_at: daysAgo(40),
  });
  expect(await isDreamEligible(u)).toBe(false);
});

it('nothing → NOT eligible; unknown id → NOT eligible', async () => {
  const u = await makeUser({});
  expect(await isDreamEligible(u)).toBe(false);
  expect(await isDreamEligible('00000000-0000-0000-0000-0000000000fe')).toBe(false);
});

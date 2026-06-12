/**
 * LIVE-DB test for grant_sparkles idempotency + config-driven welcome bonus
 * (migration 258).
 *
 * Guards the audit fixes:
 *   H1 — a duplicate RevenueCat webhook delivery (same `reason`, e.g.
 *        'purchase:<txid>') must credit the user ONCE, not twice. The per-user
 *        FOR UPDATE + reason-dedup makes concurrent replays safe.
 *   H3 — welcome_bonus must equal engine_config.welcome_sparkle_bonus, not a
 *        hardcoded 25, so changing the admin config can't make every new user's
 *        welcome grant throw.
 *
 * Loads the real grant_sparkles DDL from migration 258 (see _support/pg.ts) on
 * top of stub tables + an auth.uid() stub + a service_role role.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();

let seq = 0;
async function makeUser(balance = 0): Promise<string> {
  seq += 1;
  const id = `00000000-0000-0000-0000-${String(seq).padStart(12, '0')}`;
  await pool.query('INSERT INTO public.users (id, sparkle_balance) VALUES ($1, $2)', [id, balance]);
  return id;
}

async function balanceOf(id: string): Promise<number> {
  const r = await pool.query<{ b: number }>(
    'SELECT sparkle_balance AS b FROM public.users WHERE id = $1',
    [id]
  );
  return r.rows[0].b;
}

async function txCount(id: string, reason: string): Promise<number> {
  const r = await pool.query<{ c: string }>(
    'SELECT count(*) AS c FROM public.sparkle_transactions WHERE user_id = $1 AND reason = $2',
    [id, reason]
  );
  return Number(r.rows[0].c);
}

/** Service-role grant (the webhook path — no welcome restriction). */
async function grantService(id: string, amount: number, reason: string): Promise<void> {
  await pool.query('SET ROLE service_role');
  try {
    await pool.query('SELECT public.grant_sparkles($1, $2, $3)', [id, amount, reason]);
  } finally {
    await pool.query('RESET ROLE');
  }
}

/** Client grant (auth.uid() === id via the test.uid GUC). */
async function grantClient(id: string, amount: number, reason: string): Promise<void> {
  await pool.query('SELECT set_config($1, $2, false)', ['test.uid', id]);
  await pool.query('SELECT public.grant_sparkles($1, $2, $3)', [id, amount, reason]);
}

beforeAll(async () => {
  const fn = extract(
    migrationSql('258_grant_sparkles_idempotent.sql'),
    'CREATE OR REPLACE FUNCTION public.grant_sparkles',
    '$$;'
  );

  await pool.query('DROP TABLE IF EXISTS public.sparkle_transactions CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.users CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');

  await pool.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    sparkle_balance integer NOT NULL DEFAULT 0
  )`);
  await pool.query(`CREATE TABLE public.sparkle_transactions (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL,
    amount integer NOT NULL,
    reason text,
    reference_id uuid,
    balance_after integer,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await pool.query(`CREATE TABLE public.engine_config (
    id integer PRIMARY KEY,
    welcome_sparkle_bonus integer NOT NULL DEFAULT 25
  )`);
  await pool.query('INSERT INTO public.engine_config (id, welcome_sparkle_bonus) VALUES (1, 25)');

  // auth.uid() stub — reads the test.uid GUC (NULL when unset).
  await pool.query('CREATE SCHEMA IF NOT EXISTS auth');
  await pool.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );

  await pool.query(
    `DO $r$ BEGIN
       IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
         CREATE ROLE service_role;
       END IF;
     END $r$`
  );

  await pool.query(fn);
  await pool.query(
    'GRANT EXECUTE ON FUNCTION public.grant_sparkles(uuid, integer, text) TO service_role'
  );

  // Backstop unique index (mirrors migration 258's guarded DO block).
  await pool.query(`CREATE UNIQUE INDEX ux_sparkle_tx_grant_reason
    ON public.sparkle_transactions (user_id, reason)
    WHERE reason LIKE 'purchase:%'
       OR reason LIKE 'pro_bundle:%'
       OR reason LIKE 'basic_bundle:%'
       OR reason = 'welcome_bonus'`);
});

afterAll(async () => {
  await pool.end();
});

it('H1: a duplicate webhook grant (same reason) credits ONCE', async () => {
  const u = await makeUser(0);
  await grantService(u, 90, 'purchase:tx-AAA');
  await grantService(u, 90, 'purchase:tx-AAA'); // replay
  expect(await balanceOf(u)).toBe(90);
  expect(await txCount(u, 'purchase:tx-AAA')).toBe(1);
});

it('distinct transaction ids both apply', async () => {
  const u = await makeUser(0);
  await grantService(u, 90, 'purchase:tx-B1');
  await grantService(u, 40, 'purchase:tx-B2');
  expect(await balanceOf(u)).toBe(130);
});

it('a pro_bundle grant is idempotent per txid', async () => {
  const u = await makeUser(0);
  await grantService(u, 75, 'pro_bundle:tx-C');
  await grantService(u, 75, 'pro_bundle:tx-C'); // replay
  expect(await balanceOf(u)).toBe(75);
});

it('H3: welcome_bonus honors engine_config.welcome_sparkle_bonus (tunable)', async () => {
  await pool.query('UPDATE public.engine_config SET welcome_sparkle_bonus = 30 WHERE id = 1');
  const u = await makeUser(0);
  await grantClient(u, 30, 'welcome_bonus'); // matches the configured value
  expect(await balanceOf(u)).toBe(30);
  await grantClient(u, 30, 'welcome_bonus'); // idempotent
  expect(await balanceOf(u)).toBe(30);
});

it('H3: a welcome_bonus with the wrong (stale-hardcoded) amount is rejected', async () => {
  await pool.query('UPDATE public.engine_config SET welcome_sparkle_bonus = 30 WHERE id = 1');
  const u = await makeUser(0);
  await expect(grantClient(u, 25, 'welcome_bonus')).rejects.toThrow(/welcome_bonus must equal/);
});

it('backstop index rejects a duplicate grant reason inserted directly', async () => {
  const u = await makeUser(0);
  await pool.query(
    `INSERT INTO public.sparkle_transactions (user_id, amount, reason) VALUES ($1, 90, 'purchase:tx-D')`,
    [u]
  );
  await expect(
    pool.query(
      `INSERT INTO public.sparkle_transactions (user_id, amount, reason) VALUES ($1, 90, 'purchase:tx-D')`,
      [u]
    )
  ).rejects.toThrow();
});

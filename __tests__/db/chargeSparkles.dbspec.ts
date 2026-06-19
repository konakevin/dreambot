/**
 * LIVE-DB test for charge_sparkles — the direct money-debit RPC (migration 185).
 *
 * The Architect audit (2026-06-18) flagged this as the one money RPC with ZERO
 * regression coverage: grant_sparkles + refund_sparkles are locked, but the
 * charge path (the actual per-dream debit) was unguarded by a test. A future
 * CREATE OR REPLACE could silently drop one of these invariants — exactly how
 * an early refund_sparkles guard once regressed unnoticed. This locks them:
 *
 *   AUTH        — a client can only charge ITSELF; charging another user (or
 *                 with no auth) raises. Service role may charge anyone.
 *   REFERENCE   — a NULL reference_id is rejected (idempotency depends on it).
 *   IDEMPOTENT  — the same reference_id debits exactly ONCE (a replayed
 *                 enqueue/retry can't double-charge).
 *   INSUFFICIENT— balance < amount returns 'insufficient' and debits nothing.
 *
 * Loads the real charge_sparkles DDL from migration 185 on top of stub tables +
 * an auth.uid() stub + a service_role role (mirrors grantSparkles.dbspec.ts).
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

async function debitCount(id: string, ref: string): Promise<number> {
  const r = await pool.query<{ c: string }>(
    'SELECT count(*) AS c FROM public.sparkle_transactions WHERE user_id = $1 AND reference_id = $2 AND amount < 0',
    [id, ref]
  );
  return Number(r.rows[0].c);
}

/** Service-role charge (the enqueue/worker path). */
async function chargeService(id: string, amount: number, ref: string): Promise<string> {
  await pool.query('SET ROLE service_role');
  try {
    const r = await pool.query<{ charge_sparkles: string }>(
      'SELECT public.charge_sparkles($1, $2, $3, $4) AS charge_sparkles',
      [id, amount, 'dream', ref]
    );
    return r.rows[0].charge_sparkles;
  } finally {
    await pool.query('RESET ROLE');
  }
}

/** Client charge (auth.uid() === actingAs via the test.uid GUC). */
async function chargeClient(
  actingAs: string | null,
  target: string,
  amount: number,
  ref: string
): Promise<string> {
  await pool.query('SELECT set_config($1, $2, false)', ['test.uid', actingAs ?? '']);
  const r = await pool.query<{ charge_sparkles: string }>(
    'SELECT public.charge_sparkles($1, $2, $3, $4) AS charge_sparkles',
    [target, amount, 'dream', ref]
  );
  return r.rows[0].charge_sparkles;
}

const REF = (n: number) => `00000000-0000-0000-0000-0000000000${String(n).padStart(2, '0')}`;

beforeAll(async () => {
  const fn = extract(
    migrationSql('185_sparkle_audit_ledger.sql'),
    'CREATE OR REPLACE FUNCTION public.charge_sparkles',
    '$$;'
  );

  await pool.query('DROP TABLE IF EXISTS public.sparkle_transactions CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.users CASCADE');

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

  // auth.uid() stub — reads the test.uid GUC (NULL when unset/empty).
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
    'GRANT EXECUTE ON FUNCTION public.charge_sparkles(uuid, integer, text, uuid) TO service_role'
  );
});

afterAll(async () => {
  await pool.end();
});

it('charges the balance and records one debit', async () => {
  const u = await makeUser(10);
  expect(await chargeService(u, 3, REF(1))).toBe('charged');
  expect(await balanceOf(u)).toBe(7);
  expect(await debitCount(u, REF(1))).toBe(1);
});

it('IDEMPOTENT: a replayed reference_id debits exactly once', async () => {
  const u = await makeUser(10);
  expect(await chargeService(u, 4, REF(2))).toBe('charged');
  expect(await chargeService(u, 4, REF(2))).toBe('already_charged'); // replay
  expect(await balanceOf(u)).toBe(6);
  expect(await debitCount(u, REF(2))).toBe(1);
});

it('INSUFFICIENT: balance < amount returns insufficient and debits nothing', async () => {
  const u = await makeUser(2);
  expect(await chargeService(u, 5, REF(3))).toBe('insufficient');
  expect(await balanceOf(u)).toBe(2);
  expect(await debitCount(u, REF(3))).toBe(0);
});

it('REFERENCE: a NULL reference_id is rejected', async () => {
  const u = await makeUser(10);
  await pool.query('SET ROLE service_role');
  try {
    await expect(
      pool.query('SELECT public.charge_sparkles($1, $2, $3, NULL)', [u, 1, 'dream'])
    ).rejects.toThrow(/requires a reference_id/);
  } finally {
    await pool.query('RESET ROLE');
  }
});

it('AUTH: a client charging itself succeeds', async () => {
  const u = await makeUser(10);
  expect(await chargeClient(u, u, 2, REF(4))).toBe('charged');
  expect(await balanceOf(u)).toBe(8);
});

it('AUTH: a client charging ANOTHER user is rejected', async () => {
  const victim = await makeUser(10);
  const attacker = await makeUser(0);
  await expect(chargeClient(attacker, victim, 5, REF(5))).rejects.toThrow(/Unauthorized/);
  expect(await balanceOf(victim)).toBe(10); // untouched
});

it('AUTH: an unauthenticated client (no auth.uid) is rejected', async () => {
  const victim = await makeUser(10);
  await expect(chargeClient(null, victim, 5, REF(6))).rejects.toThrow(/Unauthorized/);
  expect(await balanceOf(victim)).toBe(10);
});

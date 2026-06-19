/**
 * LIVE-DB test for refund_sparkles — the money-credit RPC (migration 278).
 *
 * The Architect audit (2026-06-19) flagged this as having only a CONTENT lock
 * (securityHardening278.test.ts greps the migration text) but NO BEHAVIORAL
 * test. The auth guard on this function regressed unnoticed ONCE before — and a
 * content grep can't catch a future CREATE OR REPLACE that keeps the guard
 * string but breaks the logic. This locks the actual behavior:
 *
 *   AUTH         — a client can only refund ITSELF; refunding another user (or
 *                  with no auth) raises. Service role may refund anyone.
 *   ACTUAL-SPEND — refunds ONLY what was actually debited under the reference_id,
 *                  NOT p_amount. THIS IS THE FAUCET SEAL: a reference_id with no
 *                  prior debit credits NOTHING (the old p_amount fallback let a
 *                  fresh random reference_id mint +1 sparkle via self-moderation).
 *   IDEMPOTENT   — a second refund for the same reference_id is a no-op (a
 *                  retry / double-call can't double-credit).
 *
 * Loads the real refund_sparkles DDL from migration 278 on top of stub tables +
 * an auth.uid() stub + a service_role role (mirrors chargeSparkles.dbspec.ts).
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

/** Simulate a prior charge: one negative ledger row under this reference_id. */
async function recordDebit(id: string, ref: string, amount: number): Promise<void> {
  await pool.query(
    `INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id)
     VALUES ($1, $2, 'dream', $3)`,
    [id, -amount, ref]
  );
}

async function refundCount(id: string, ref: string): Promise<number> {
  const r = await pool.query<{ c: string }>(
    `SELECT count(*) AS c FROM public.sparkle_transactions
     WHERE user_id = $1 AND reference_id = $2 AND reason LIKE 'refund:%'`,
    [id, ref]
  );
  return Number(r.rows[0].c);
}

/** Service-role refund (the dead-letter / worker path). p_amount is intentionally
 *  a LIE (1) — the function must ignore it and refund the actual recorded spend. */
async function refundService(id: string, ref: string): Promise<boolean> {
  await pool.query('SET ROLE service_role');
  try {
    const r = await pool.query<{ refund_sparkles: boolean }>(
      'SELECT public.refund_sparkles($1, $2, $3, $4) AS refund_sparkles',
      [id, 1, 'refund:test', ref]
    );
    return r.rows[0].refund_sparkles;
  } finally {
    await pool.query('RESET ROLE');
  }
}

/** Client refund (auth.uid() === actingAs via the test.uid GUC). */
async function refundClient(
  actingAs: string | null,
  target: string,
  ref: string
): Promise<boolean> {
  await pool.query('SELECT set_config($1, $2, false)', ['test.uid', actingAs ?? '']);
  const r = await pool.query<{ refund_sparkles: boolean }>(
    'SELECT public.refund_sparkles($1, $2, $3, $4) AS refund_sparkles',
    [target, 1, 'refund:test', ref]
  );
  return r.rows[0].refund_sparkles;
}

const REF = (n: number) => `00000000-0000-0000-0000-0000000000${String(n).padStart(2, '0')}`;

beforeAll(async () => {
  const fn = extract(
    migrationSql('278_security_hardening.sql'),
    'CREATE OR REPLACE FUNCTION public.refund_sparkles',
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
    'GRANT EXECUTE ON FUNCTION public.refund_sparkles(uuid, integer, text, uuid) TO service_role'
  );
});

afterAll(async () => {
  await pool.end();
});

it('refunds the ACTUAL recorded spend, ignoring p_amount', async () => {
  const u = await makeUser(0);
  await recordDebit(u, REF(1), 3); // user was charged 3 under this reference
  expect(await refundService(u, REF(1))).toBe(true); // p_amount=1 is ignored
  expect(await balanceOf(u)).toBe(3); // credited the real 3, not 1
  expect(await refundCount(u, REF(1))).toBe(1);
});

it('FAUCET SEALED: a reference_id with NO prior debit refunds nothing', async () => {
  const u = await makeUser(0);
  // No recordDebit — a fresh random reference_id (the self-moderation faucet).
  expect(await refundService(u, REF(2))).toBe(false);
  expect(await balanceOf(u)).toBe(0); // NOT minted +1
  expect(await refundCount(u, REF(2))).toBe(0);
});

it('IDEMPOTENT: a second refund for the same reference_id is a no-op', async () => {
  const u = await makeUser(0);
  await recordDebit(u, REF(3), 5);
  expect(await refundService(u, REF(3))).toBe(true);
  expect(await refundService(u, REF(3))).toBe(false); // replay
  expect(await balanceOf(u)).toBe(5); // credited once
  expect(await refundCount(u, REF(3))).toBe(1);
});

it('AUTH: a client refunding ITSELF succeeds', async () => {
  const u = await makeUser(0);
  await recordDebit(u, REF(4), 2);
  expect(await refundClient(u, u, REF(4))).toBe(true);
  expect(await balanceOf(u)).toBe(2);
});

it('AUTH: a client refunding ANOTHER user is rejected', async () => {
  const victim = await makeUser(0);
  const attacker = await makeUser(0);
  await recordDebit(victim, REF(5), 9);
  await expect(refundClient(attacker, victim, REF(5))).rejects.toThrow(/Unauthorized/);
  expect(await balanceOf(victim)).toBe(0); // untouched
});

it('AUTH: an unauthenticated client (no auth.uid) is rejected', async () => {
  const victim = await makeUser(0);
  await recordDebit(victim, REF(6), 9);
  await expect(refundClient(null, victim, REF(6))).rejects.toThrow(/Unauthorized/);
  expect(await balanceOf(victim)).toBe(0);
});

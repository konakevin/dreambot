/**
 * LIVE-DB test for revenuecat_refund_clawback (migration 571) — the store-refund sparkle
 * clawback the RevenueCat webhook runs on CANCELLATION + cancel_reason CUSTOMER_SUPPORT.
 *
 * Before 571 the webhook did lookup → grant_sparkles(-amount) with unchecked errors: a failed
 * lookup clawed back 0 and returned 200 (no retry), and two concurrent deliveries could both
 * pass the "already refunded?" check. This locks the behaviour of the replacement:
 *
 *   CLAWBACK   deducts exactly the original grant and writes refund:<reason> once
 *   IDEMPOTENT a retried delivery is 'already_refunded', never a second deduction
 *   RACE-SAFE  two concurrent calls → exactly one deduction (row lock + unique index)
 *   NO GRANT   a reason with no positive grant claws back nothing
 *   GUARDS     service-role only; only purchase:/pro_bundle:/basic_bundle: reasons
 *
 * Loads the real index + function DDL from the migration file on stub tables.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const MIGRATION = '571_revenuecat_refund_clawback_rpc.sql';

let seq = 0;
async function makeUser(balance: number): Promise<string> {
  seq += 1;
  const id = `00000000-0000-0000-0000-${String(900000 + seq).padStart(12, '0')}`;
  await pool.query('INSERT INTO public.users (id, sparkle_balance) VALUES ($1, $2)', [id, balance]);
  return id;
}

async function grant(user: string, reason: string, amount: number): Promise<void> {
  await pool.query(
    'INSERT INTO public.sparkle_transactions (user_id, amount, reason) VALUES ($1, $2, $3)',
    [user, amount, reason]
  );
}

async function balanceOf(user: string): Promise<number> {
  const r = await pool.query<{ b: number }>(
    'SELECT sparkle_balance AS b FROM public.users WHERE id = $1',
    [user]
  );
  return r.rows[0].b;
}

async function rows(user: string, reason: string): Promise<{ amount: number; after: number }[]> {
  const r = await pool.query<{ amount: number; after: number }>(
    `SELECT amount, balance_after AS after FROM public.sparkle_transactions
     WHERE user_id = $1 AND reason = $2 ORDER BY id`,
    [user, reason]
  );
  return r.rows;
}

/** Call as the server (service_role), on its own connection so calls can run in parallel. */
async function clawback(
  user: string,
  reason: string
): Promise<{ outcome: string; amount: number }> {
  const client = await pool.connect();
  try {
    await client.query('SET ROLE service_role');
    const r = await client.query<{ outcome: string; amount: number }>(
      'SELECT outcome, amount FROM public.revenuecat_refund_clawback($1, $2)',
      [user, reason]
    );
    return r.rows[0];
  } finally {
    await client.query('RESET ROLE');
    client.release();
  }
}

beforeAll(async () => {
  const sql = migrationSql(MIGRATION);
  await pool.query('DROP FUNCTION IF EXISTS public.revenuecat_refund_clawback(uuid, text)');
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
  await pool.query(
    `DO $r$ BEGIN
       IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
         CREATE ROLE service_role;
       END IF;
       IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon; END IF;
       IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
         CREATE ROLE authenticated;
       END IF;
     END $r$`
  );
  await pool.query(
    extract(sql, 'CREATE UNIQUE INDEX IF NOT EXISTS ux_sparkle_tx_refund_reason', ';')
  );
  await pool.query(
    extract(sql, 'CREATE OR REPLACE FUNCTION public.revenuecat_refund_clawback', '$$;')
  );
  await pool.query(extract(sql, 'REVOKE ALL ON FUNCTION public.revenuecat_refund_clawback', ';'));
  await pool.query(
    extract(sql, 'GRANT EXECUTE ON FUNCTION public.revenuecat_refund_clawback', ';')
  );
});

afterAll(async () => {
  await pool.end();
});

it('claws back exactly the original sparkle-pack grant, once', async () => {
  const u = await makeUser(40);
  await grant(u, 'purchase:TX1', 40);
  expect(await clawback(u, 'purchase:TX1')).toEqual({ outcome: 'clawed_back', amount: 40 });
  expect(await balanceOf(u)).toBe(0);
  expect(await rows(u, 'refund:purchase:TX1')).toEqual([{ amount: -40, after: 0 }]);
});

it('a retried delivery is already_refunded and deducts nothing more', async () => {
  const u = await makeUser(90);
  await grant(u, 'purchase:TX2', 90);
  await clawback(u, 'purchase:TX2');
  expect(await clawback(u, 'purchase:TX2')).toEqual({ outcome: 'already_refunded', amount: 0 });
  expect(await balanceOf(u)).toBe(0);
  expect(await rows(u, 'refund:purchase:TX2')).toHaveLength(1);
});

it('two concurrent deliveries deduct exactly once', async () => {
  const u = await makeUser(200);
  await grant(u, 'purchase:TX3', 200);
  const results = await Promise.all([clawback(u, 'purchase:TX3'), clawback(u, 'purchase:TX3')]);
  expect(results.map((r) => r.outcome).sort()).toEqual(['already_refunded', 'clawed_back']);
  expect(await balanceOf(u)).toBe(0);
  expect(await rows(u, 'refund:purchase:TX3')).toHaveLength(1);
});

it('subscription bundles (pro_bundle / basic_bundle) claw back the same way', async () => {
  const u = await makeUser(95);
  await grant(u, 'pro_bundle:TX4', 75);
  await grant(u, 'basic_bundle:TX5', 20);
  expect(await clawback(u, 'pro_bundle:TX4')).toEqual({ outcome: 'clawed_back', amount: 75 });
  expect(await clawback(u, 'basic_bundle:TX5')).toEqual({ outcome: 'clawed_back', amount: 20 });
  expect(await balanceOf(u)).toBe(0);
});

it('the balance may go negative when the refunded sparkles were already spent', async () => {
  const u = await makeUser(10);
  await grant(u, 'purchase:TX6', 40);
  expect(await clawback(u, 'purchase:TX6')).toEqual({ outcome: 'clawed_back', amount: 40 });
  expect(await balanceOf(u)).toBe(-30);
});

it('a refund with no matching grant claws back nothing', async () => {
  const u = await makeUser(15);
  expect(await clawback(u, 'purchase:NEVER')).toEqual({ outcome: 'no_grant', amount: 0 });
  expect(await balanceOf(u)).toBe(15);
  expect(await rows(u, 'refund:purchase:NEVER')).toHaveLength(0);
});

it('an unknown user is no_user', async () => {
  expect(await clawback('00000000-0000-0000-0000-000000000999', 'purchase:X')).toEqual({
    outcome: 'no_user',
    amount: 0,
  });
});

it('refuses any reason that is not a store grant (e.g. a dream charge)', async () => {
  const u = await makeUser(5);
  await expect(clawback(u, 'dream')).rejects.toThrow(/unsupported reason/);
  await expect(clawback(u, 'welcome_bonus')).rejects.toThrow(/unsupported reason/);
});

it('is server-only: a non-service caller is refused even with EXECUTE', async () => {
  const u = await makeUser(40);
  await grant(u, 'purchase:TX7', 40);
  // As the table owner (not service_role) the body's own guard must refuse.
  await expect(
    pool.query('SELECT * FROM public.revenuecat_refund_clawback($1, $2)', [u, 'purchase:TX7'])
  ).rejects.toThrow(/server-only/);
  // And clients have no EXECUTE at all.
  const client = await pool.connect();
  try {
    await client.query('SET ROLE authenticated');
    await expect(
      client.query('SELECT * FROM public.revenuecat_refund_clawback($1, $2)', [u, 'purchase:TX7'])
    ).rejects.toThrow(/permission denied/);
  } finally {
    await client.query('RESET ROLE');
    client.release();
  }
  expect(await balanceOf(u)).toBe(40);
});

it('the unique index blocks a second refund row even if written directly', async () => {
  const u = await makeUser(0);
  await grant(u, 'refund:purchase:TX8', -40);
  await expect(grant(u, 'refund:purchase:TX8', -40)).rejects.toThrow(/duplicate key/);
});

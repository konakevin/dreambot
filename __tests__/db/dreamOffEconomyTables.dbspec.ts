/**
 * LIVE-DB test for the Dream Off economy schema (migration 402).
 *
 * Money-integrity invariants enforced at the DB layer:
 *   - the escrow pot balance can never go negative (CHECK balance >= 0),
 *   - the pot ledger is idempotent per (game, kind, reference_id) — no double
 *     fund/spend/refund,
 *   - the seeded 'standard' tier is the 8 STANDARD models at 1 sparkle and
 *     'premium' ships inactive with an empty set (v1 = Standard only).
 *
 * Loads the REAL DDL + seed from migration 402 so it validates the SQL before
 * it's applied.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const GAME = '00000000-0000-0000-0000-0000000000f1';

beforeAll(async () => {
  db = await pool.connect();
  await db.query('DROP TABLE IF EXISTS public.dream_off_pot_ledger CASCADE');
  await db.query('DROP TABLE IF EXISTS public.dream_off_pot CASCADE');
  await db.query('DROP TABLE IF EXISTS public.dream_off_tiers CASCADE');

  const sql = migrationSql('402_dream_off_economy_tables.sql');
  await db.query(extract(sql, 'CREATE TABLE IF NOT EXISTS public.dream_off_tiers (', ');'));
  await db.query(extract(sql, 'INSERT INTO public.dream_off_tiers', 'DO NOTHING;'));
  await db.query(extract(sql, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot (', ');'));
  await db.query(extract(sql, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot_ledger (', ');'));
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_tiers seed (migration 402)', () => {
  it('seeds standard = 8 models @ 1 sparkle, active', async () => {
    const { rows } = await db.query(
      `SELECT slot_price, is_active, array_length(model_ids, 1) AS n
       FROM public.dream_off_tiers WHERE key = 'standard'`
    );
    expect(rows[0].slot_price).toBe(1);
    expect(rows[0].is_active).toBe(true);
    expect(rows[0].n).toBe(8);
  });

  it('ships premium inactive with an empty model set (v1 = Standard only)', async () => {
    const { rows } = await db.query(
      `SELECT is_active, coalesce(array_length(model_ids, 1), 0) AS n
       FROM public.dream_off_tiers WHERE key = 'premium'`
    );
    expect(rows[0].is_active).toBe(false);
    expect(rows[0].n).toBe(0);
  });
});

describe('dream_off_pot escrow floor (migration 402)', () => {
  it('rejects a negative balance (CHECK balance >= 0)', async () => {
    await expect(
      db.query(
        `INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price, balance)
         VALUES ($1, 'standard', 1, -5)`,
        [GAME]
      )
    ).rejects.toThrow();
  });

  it('accepts a valid open pot', async () => {
    await expect(
      db.query(
        `INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price, balance)
         VALUES ($1, 'standard', 1, 10)`,
        [GAME]
      )
    ).resolves.toBeDefined();
  });
});

describe('dream_off_pot_ledger idempotency (migration 402)', () => {
  it('rejects a duplicate (game, kind, reference_id) movement', async () => {
    const ref = '00000000-0000-0000-0000-0000000000aa';
    await db.query(
      `INSERT INTO public.dream_off_pot_ledger (game_id, kind, amount, balance_after, reference_id)
       VALUES ($1, 'fund', 10, 10, $2)`,
      [GAME, ref]
    );
    await expect(
      db.query(
        `INSERT INTO public.dream_off_pot_ledger (game_id, kind, amount, balance_after, reference_id)
         VALUES ($1, 'fund', 10, 20, $2)`,
        [GAME, ref]
      )
    ).rejects.toThrow();
  });
});

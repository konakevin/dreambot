/**
 * LIVE-DB test for the Dream Off funding RPCs (migration 407).
 *
 * Locks the money entry points:
 *   - dream_off_fund_pot: owner-only, server-computed amount (slots × frozen price),
 *     charges the owner + credits the pot, idempotent on reference_id, prefund cap,
 *     insufficient-balance + kill-switch guards,
 *   - dream_off_donate: gated dark (donations flag), member-only, giftable-provenance
 *     (purchased-only), daily cap.
 * Loads the REAL RPCs (407) + the real charge_sparkles (185) over the real pot/tier
 * DDL (402), so it validates the SQL AND the escrow accounting.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
let seq = 0;

const gid = () => `00000000-0000-0000-0000-0000000c${(seq++).toString().padStart(4, '0')}`;

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
async function setBalance(uid: string, n: number) {
  await db.query(`UPDATE public.users SET sparkle_balance=$2 WHERE id=$1`, [uid, n]);
}
async function mkGame(): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code)
     VALUES ($1,$2,'t','custom','submission',$3)`,
    [id, OWNER, id.slice(-10)]
  );
  await db.query(
    `INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price, balance, funded_slots)
     VALUES ($1,'standard',1,0,0)`,
    [id]
  );
  return id;
}

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'dream_off_pot_ledger',
    'dream_off_pot',
    'dream_off_tiers',
    'dream_off_players',
    'dream_offs',
    'sparkle_transactions',
    'engine_config',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }

  await db.query(
    'CREATE TABLE public.users (id uuid PRIMARY KEY, sparkle_balance int NOT NULL DEFAULT 0)'
  );
  await db.query(
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_enabled boolean,
       dream_off_max_prefund_slots int, dream_off_donations_enabled boolean, dream_off_donation_max_per_day int)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, true, 20, false, 200)`);
  await db.query(
    `CREATE TABLE public.sparkle_transactions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid, amount int, reason text, reference_id uuid, balance_after int,
       created_at timestamptz NOT NULL DEFAULT now())`
  );
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );

  const m400 = migrationSql('400_dream_off_core_schema.sql');
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_offs (', ');'));
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_players (', ');'));

  const m402 = migrationSql('402_dream_off_economy_tables.sql');
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_tiers (', ');'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot (', ');'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot_ledger (', ');'));
  await db.query(
    `INSERT INTO public.dream_off_tiers (key, label, model_ids, slot_price) VALUES ('standard','Standard','{}',1)`
  );

  await db.query(
    extract(
      migrationSql('185_sparkle_audit_ledger.sql'),
      'CREATE OR REPLACE FUNCTION public.charge_sparkles(',
      '$$;'
    )
  );

  const m407 = migrationSql('407_dream_off_funding.sql');
  await db.query(extract(m407, 'CREATE OR REPLACE FUNCTION public.dream_off_fund_pot(', '$$;'));
  await db.query(extract(m407, 'CREATE OR REPLACE FUNCTION public.dream_off_donate(', '$$;'));

  await db.query(`INSERT INTO public.users (id, sparkle_balance) VALUES ($1,100),($2,100)`, [
    OWNER,
    BOB,
  ]);
});

beforeEach(async () => {
  await db.query(
    `UPDATE public.engine_config SET dream_off_enabled=true, dream_off_max_prefund_slots=20,
       dream_off_donations_enabled=false, dream_off_donation_max_per_day=200 WHERE id=1`
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_fund_pot (migration 407)', () => {
  it('owner funds slots: charges owner, credits pot, and is idempotent on reference_id', async () => {
    const g = await mkGame();
    await setBalance(OWNER, 10);
    await actAs(OWNER);
    const ref = '00000000-0000-0000-0000-00000000aaa1';
    const r1 = await db.query(`SELECT public.dream_off_fund_pot($1,3,$2) AS r`, [g, ref]);
    expect(r1.rows[0].r).toMatchObject({ status: 'ok', balance: 3, funded_slots: 3 });
    const own1 = await db.query(`SELECT sparkle_balance FROM public.users WHERE id=$1`, [OWNER]);
    expect(own1.rows[0].sparkle_balance).toBe(7); // 10 - 3×1

    // Same reference again → no double-charge, no double-credit.
    const r2 = await db.query(`SELECT public.dream_off_fund_pot($1,3,$2) AS r`, [g, ref]);
    expect(r2.rows[0].r).toMatchObject({ status: 'ok', balance: 3 });
    const pot = await db.query(
      `SELECT balance, funded_slots FROM public.dream_off_pot WHERE game_id=$1`,
      [g]
    );
    expect(pot.rows[0]).toEqual({ balance: 3, funded_slots: 3 });
    const own2 = await db.query(`SELECT sparkle_balance FROM public.users WHERE id=$1`, [OWNER]);
    expect(own2.rows[0].sparkle_balance).toBe(7);
  });

  it('returns insufficient without touching the pot', async () => {
    const g = await mkGame();
    await setBalance(OWNER, 2);
    await actAs(OWNER);
    const r = await db.query(`SELECT public.dream_off_fund_pot($1,5,$2) AS r`, [g, null]);
    expect(r.rows[0].r.status).toBe('insufficient');
    const pot = await db.query(`SELECT balance FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot.rows[0].balance).toBe(0);
  });

  it('rejects funding past the prefund cap', async () => {
    const g = await mkGame();
    await setBalance(OWNER, 100);
    await db.query(`UPDATE public.engine_config SET dream_off_max_prefund_slots=2 WHERE id=1`);
    await actAs(OWNER);
    const r = await db.query(`SELECT public.dream_off_fund_pot($1,3,$2) AS r`, [g, null]);
    expect(r.rows[0].r.status).toBe('over_cap');
  });

  it('rejects a non-owner and the kill-switch', async () => {
    const g = await mkGame();
    await actAs(BOB);
    await expect(db.query(`SELECT public.dream_off_fund_pot($1,1,$2)`, [g, null])).rejects.toThrow(
      /not your game/
    );
    await actAs(OWNER);
    await db.query(`UPDATE public.engine_config SET dream_off_enabled=false WHERE id=1`);
    const r = await db.query(`SELECT public.dream_off_fund_pot($1,1,$2) AS r`, [g, null]);
    expect(r.rows[0].r.status).toBe('disabled');
  });
});

describe('dream_off_donate (migration 407)', () => {
  it('is disabled while the donations flag is off (v1)', async () => {
    const g = await mkGame();
    await db.query(
      `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
      [g, BOB]
    );
    await actAs(BOB);
    const r = await db.query(`SELECT public.dream_off_donate($1,5,$2) AS r`, [g, null]);
    expect(r.rows[0].r.status).toBe('disabled');
  });

  it('when enabled: only giftable (purchased) sparkles may be donated', async () => {
    const g = await mkGame();
    await db.query(
      `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
      [g, BOB]
    );
    await db.query(`UPDATE public.engine_config SET dream_off_donations_enabled=true WHERE id=1`);
    await setBalance(BOB, 10); // balance from a FREE grant → not giftable
    await actAs(BOB);
    const bad = await db.query(`SELECT public.dream_off_donate($1,5,$2) AS r`, [g, null]);
    expect(bad.rows[0].r.status).toBe('insufficient_giftable');

    // Give Bob a real purchase → now giftable.
    await db.query(
      `INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
       VALUES ($1, 20, 'purchase:pack', gen_random_uuid(), 30)`,
      [BOB]
    );
    await setBalance(BOB, 30);
    const ok = await db.query(`SELECT public.dream_off_donate($1,5,$2) AS r`, [g, null]);
    expect(ok.rows[0].r).toMatchObject({ status: 'ok', balance: 5 });
    const pot = await db.query(`SELECT balance FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot.rows[0].balance).toBe(5);
  });

  it('rejects a non-member', async () => {
    const g = await mkGame();
    await db.query(`UPDATE public.engine_config SET dream_off_donations_enabled=true WHERE id=1`);
    await actAs(BOB);
    await expect(db.query(`SELECT public.dream_off_donate($1,1,$2)`, [g, null])).rejects.toThrow(
      /not a member/
    );
  });
});

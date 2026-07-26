/**
 * LIVE-DB test for Dream Off pot settlement (migration 409).
 *
 * Locks the escrow payout:
 *   - dream_off_settle_pot: refunds the residual to the sole funder, flips
 *     open→settled, is idempotent (open→settling guard), never mints,
 *   - pro-rata split across multiple funders with the rounding dust to the largest,
 *   - settlement is wired into the phase machine (results + no_contest auto-settle).
 * Loads the REAL settle/credit/tally + the wired maybe_advance (409) so it validates
 * both the accounting and the phase-transition wiring.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
let seq = 0;
const gid = () => `00000000-0000-0000-0000-0000000d${(seq++).toString().padStart(4, '0')}`;

async function mkGame(phase = 'submission'): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, phase_expires_at)
     VALUES ($1,$2,'t','custom',$3,$4, now() + interval '1 day')`,
    [id, OWNER, phase, id.slice(-10)]
  );
  return id;
}
async function mkPot(game: string, balance: number) {
  await db.query(
    `INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price, balance, funded_slots, status)
     VALUES ($1,'standard',1,$2,$2,'open')`,
    [game, balance]
  );
}
async function ledger(game: string, kind: string, amount: number, actor: string, ref: string) {
  await db.query(
    `INSERT INTO public.dream_off_pot_ledger (game_id, kind, amount, balance_after, reference_id, actor_id)
     VALUES ($1,$2,$3,0,$4,$5)`,
    [game, kind, amount, ref, actor]
  );
}
const rref = () => `00000000-0000-0000-0000-0000000f${(seq++).toString().padStart(4, '0')}`;
async function balOf(uid: string): Promise<number> {
  const r = await db.query(`SELECT sparkle_balance FROM public.users WHERE id=$1`, [uid]);
  return r.rows[0].sparkle_balance;
}

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'notifications',
    'sparkle_transactions',
    'dream_off_pot_ledger',
    'dream_off_pot',
    'dream_off_tiers',
    'dream_off_superlatives',
    'dream_off_votes',
    'dream_off_entries',
    'dream_off_events',
    'dream_off_players',
    'dream_offs',
    'uploads',
    'engine_config',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }

  await db.query(
    'CREATE TABLE public.users (id uuid PRIMARY KEY, sparkle_balance int NOT NULL DEFAULT 0)'
  );
  await db.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
  await db.query(
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_deadline_hours int)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, 24)`);
  await db.query(
    `CREATE TABLE public.notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       recipient_id uuid, actor_id uuid, type text, reference_id uuid)`
  );
  await db.query(
    `CREATE TABLE public.sparkle_transactions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid, amount int, reason text, reference_id uuid, balance_after int,
       created_at timestamptz NOT NULL DEFAULT now())`
  );

  const m400 = migrationSql('400_dream_off_core_schema.sql');
  for (const tbl of [
    'dream_offs',
    'dream_off_players',
    'dream_off_entries',
    'dream_off_votes',
    'dream_off_events',
    'dream_off_superlatives',
  ]) {
    await db.query(extract(m400, `CREATE TABLE IF NOT EXISTS public.${tbl} (`, ');'));
  }
  const m402 = migrationSql('402_dream_off_economy_tables.sql');
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_tiers (', ');'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot (', ');'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot_ledger (', ');'));
  await db.query(
    `INSERT INTO public.dream_off_tiers (key, label, model_ids, slot_price) VALUES ('standard','Standard','{}',1)`
  );

  await db.query(
    extract(
      migrationSql('405_dream_off_phase_machine.sql'),
      'CREATE OR REPLACE FUNCTION public.tally_results(',
      '$$;'
    )
  );
  const m409 = migrationSql('409_dream_off_settle.sql');
  await db.query(extract(m409, 'CREATE OR REPLACE FUNCTION public.dream_off_credit(', '$$;'));
  await db.query(extract(m409, 'CREATE OR REPLACE FUNCTION public.dream_off_settle_pot(', '$$;'));
  await db.query(
    extract(m409, 'CREATE OR REPLACE FUNCTION public.maybe_advance_dream_off(', '$$;')
  );

  await db.query(`INSERT INTO public.users (id, sparkle_balance) VALUES ($1,0),($2,0)`, [
    OWNER,
    BOB,
  ]);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_settle_pot (migration 409)', () => {
  it('refunds the residual to the sole funder, settles, and is idempotent', async () => {
    const g = await mkGame();
    await mkPot(g, 4); // funded 5, spent 1 → residual 4
    await ledger(g, 'fund', 5, OWNER, rref());
    await ledger(g, 'spend', -1, OWNER, rref());
    await db.query(`UPDATE public.users SET sparkle_balance=0 WHERE id=$1`, [OWNER]);

    await db.query(`SELECT public.dream_off_settle_pot($1)`, [g]);
    expect(await balOf(OWNER)).toBe(4);
    const pot = await db.query(
      `SELECT balance, status FROM public.dream_off_pot WHERE game_id=$1`,
      [g]
    );
    expect(pot.rows[0]).toEqual({ balance: 0, status: 'settled' });

    await db.query(`SELECT public.dream_off_settle_pot($1)`, [g]); // idempotent
    expect(await balOf(OWNER)).toBe(4);
  });

  it('splits pro-rata across funders, rounding dust to the largest', async () => {
    const g = await mkGame();
    await mkPot(g, 8); // owner 6 + bob 4 donate, spent 2 → residual 8
    await ledger(g, 'fund', 6, OWNER, rref());
    await ledger(g, 'donate', 4, BOB, rref());
    await ledger(g, 'spend', -2, OWNER, rref());
    await db.query(`UPDATE public.users SET sparkle_balance=0 WHERE id IN ($1,$2)`, [OWNER, BOB]);

    await db.query(`SELECT public.dream_off_settle_pot($1)`, [g]);
    // floor(8·6/10)=4 +dust 1 = 5 to owner; floor(8·4/10)=3 to bob; sum = residual 8.
    expect(await balOf(OWNER)).toBe(5);
    expect(await balOf(BOB)).toBe(3);
    const pot = await db.query(`SELECT balance FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot.rows[0].balance).toBe(0);
  });
});

describe('settlement wired into the phase machine (migration 409)', () => {
  it('auto-settles when a game reaches results', async () => {
    const g = await mkGame();
    await mkPot(g, 3);
    await ledger(g, 'fund', 4, OWNER, rref());
    await ledger(g, 'spend', -1, OWNER, rref());
    await db.query(`UPDATE public.users SET sparkle_balance=0 WHERE id=$1`, [OWNER]);
    await db.query(
      `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
      [g, OWNER]
    );
    // 2 clean entries → force to voting then results.
    for (const a of [OWNER, BOB]) {
      await db.query(
        `INSERT INTO public.dream_off_entries (game_id, author_id, author_name_snapshot, render_status, moderation_status, completed_at)
         VALUES ($1,$2,'x','completed','clean', now())`,
        [g, a]
      );
    }
    await db.query(`SELECT public.maybe_advance_dream_off($1, true, 't')`, [g]); // → voting
    await db.query(`SELECT public.maybe_advance_dream_off($1, true, 't')`, [g]); // → results + settle
    const pot = await db.query(`SELECT status FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot.rows[0].status).toBe('settled');
    expect(await balOf(OWNER)).toBe(3); // residual refunded
  });

  it('auto-settles a no_contest (0 entries) — full refund', async () => {
    const g = await mkGame();
    await mkPot(g, 4);
    await ledger(g, 'fund', 4, OWNER, rref());
    await db.query(`UPDATE public.users SET sparkle_balance=0 WHERE id=$1`, [OWNER]);
    await db.query(
      `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
      [g, OWNER]
    );
    await db.query(`SELECT public.maybe_advance_dream_off($1, true, 't')`, [g]); // 0 entries → no_contest + settle
    const row = await db.query(
      `SELECT d.phase, p.status FROM public.dream_offs d JOIN public.dream_off_pot p ON p.game_id=d.id WHERE d.id=$1`,
      [g]
    );
    expect(row.rows[0]).toEqual({ phase: 'no_contest', status: 'settled' });
    expect(await balOf(OWNER)).toBe(4); // nothing spent → full refund
  });
});

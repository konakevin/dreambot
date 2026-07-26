/**
 * LIVE-DB test for the Dream Off submit RPC (migration 408).
 *
 * Locks the funding decision + gates of dream_off_submit_entry:
 *   - pot-funded: draws the escrow down (spend ledger + balance), no user charge,
 *   - self-paid: charges the entrant when the pot can't cover it,
 *   - insufficient self-pay creates NO entry (no half-charged state),
 *   - tier gate 1 (model must be in the frozen tier set),
 *   - one paid entry per player (already_submitted on a second live entry),
 *   - idempotent on the job id (a retry neither double-charges nor double-debits),
 *   - closed phase / non-member guards.
 * Loads the REAL RPCs (408 + create_entry 406) + real charge_sparkles (185).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
const CAROL = '00000000-0000-0000-0000-0000000000c3';
const MODEL = 'black-forest-labs/flux-1.1-pro';
let seq = 0;

const gid = () => `00000000-0000-0000-0000-0000000b${(seq++).toString().padStart(4, '0')}`;
const jid = () => `00000000-0000-0000-0000-0000000a${(seq++).toString().padStart(4, '0')}`;

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
async function mkGame(potBalance: number, phase = 'submission'): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, tier_key, invite_code)
     VALUES ($1,$2,'t','custom',$3,'standard',$4)`,
    [id, OWNER, phase, id.slice(-10)]
  );
  await db.query(
    `INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price, balance, funded_slots)
     VALUES ($1,'standard',1,$2,$2)`,
    [id, potBalance]
  );
  return id;
}
async function mkPlayer(game: string, uid: string) {
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
    [game, uid]
  );
}
const submit = (g: string, u: string, j: string, model = MODEL) =>
  db.query(`SELECT public.dream_off_submit_entry($1,$2,$3,$4) AS r`, [g, u, j, model]);

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'dream_off_pot_ledger',
    'dream_off_pot',
    'dream_off_tiers',
    'dream_off_entries',
    'dream_off_players',
    'dream_offs',
    'uploads',
    'sparkle_transactions',
    'engine_config',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }

  await db.query(
    'CREATE TABLE public.users (id uuid PRIMARY KEY, sparkle_balance int NOT NULL DEFAULT 0, display_name text, username text)'
  );
  await db.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
  await db.query(
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_enabled boolean)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, true)`);
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
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_entries (', ');'));

  const m402 = migrationSql('402_dream_off_economy_tables.sql');
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_tiers (', ');'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot (', ');'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot_ledger (', ');'));
  await db.query(
    `INSERT INTO public.dream_off_tiers (key, label, model_ids, slot_price)
     VALUES ('standard','Standard', ARRAY[$1,'google/gemini-2-image'], 1)`,
    [MODEL]
  );

  await db.query(
    extract(
      migrationSql('185_sparkle_audit_ledger.sql'),
      'CREATE OR REPLACE FUNCTION public.charge_sparkles(',
      '$$;'
    )
  );
  await db.query(
    extract(
      migrationSql('406_dream_off_entry_seam.sql'),
      'CREATE OR REPLACE FUNCTION public.dream_off_create_entry(',
      '$$;'
    )
  );
  await db.query(
    extract(
      migrationSql('408_dream_off_submit.sql'),
      'CREATE OR REPLACE FUNCTION public.dream_off_submit_entry(',
      '$$;'
    )
  );

  await db.query(
    `INSERT INTO public.users (id, username, sparkle_balance) VALUES ($1,'o',100),($2,'b',5),($3,'c',0)`,
    [OWNER, BOB, CAROL]
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_submit_entry funding (migration 408)', () => {
  it('pot-funded: draws the escrow down, charges the entrant nothing', async () => {
    const g = await mkGame(3);
    await mkPlayer(g, BOB);
    const j = jid();
    const r = await submit(g, BOB, j);
    expect(r.rows[0].r).toMatchObject({ status: 'ok', funding: 'pot' });
    const pot = await db.query(`SELECT balance FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot.rows[0].balance).toBe(2); // 3 - 1
    const spend = await db.query(
      `SELECT amount FROM public.dream_off_pot_ledger WHERE game_id=$1 AND kind='spend' AND reference_id=$2`,
      [g, j]
    );
    expect(spend.rows[0].amount).toBe(-1);
    const bob = await db.query(`SELECT sparkle_balance FROM public.users WHERE id=$1`, [BOB]);
    expect(bob.rows[0].sparkle_balance).toBe(5); // untouched
    const entry = await db.query(
      `SELECT render_status FROM public.dream_off_entries WHERE game_id=$1 AND author_id=$2`,
      [g, BOB]
    );
    expect(entry.rows[0].render_status).toBe('rendering');
  });

  it('self-paid: charges the entrant when the pot is empty', async () => {
    const g = await mkGame(0);
    await mkPlayer(g, BOB);
    await actAs(BOB); // charge_sparkles self-check (session role != service_role)
    const r = await submit(g, BOB, jid());
    await actAs(null);
    expect(r.rows[0].r).toMatchObject({ status: 'ok', funding: 'self' });
    const bob = await db.query(`SELECT sparkle_balance FROM public.users WHERE id=$1`, [BOB]);
    expect(bob.rows[0].sparkle_balance).toBe(4); // 5 - 1
  });

  it('insufficient self-pay creates no entry', async () => {
    const g = await mkGame(0);
    await mkPlayer(g, CAROL);
    await actAs(CAROL);
    const r = await submit(g, CAROL, jid());
    await actAs(null);
    expect(r.rows[0].r.status).toBe('insufficient');
    const n = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_entries WHERE game_id=$1 AND author_id=$2`,
      [g, CAROL]
    );
    expect(n.rows[0].n).toBe(0);
  });

  it('rejects a model outside the frozen tier set', async () => {
    const g = await mkGame(3);
    await mkPlayer(g, BOB);
    const r = await submit(g, BOB, jid(), 'stability-ai/not-allowed');
    expect(r.rows[0].r.status).toBe('model_not_allowed');
  });

  it('blocks a second live entry (one paid entry per player)', async () => {
    const g = await mkGame(5);
    await mkPlayer(g, BOB);
    await submit(g, BOB, jid()); // first (pot-funded, rendering)
    const r = await submit(g, BOB, jid()); // second, different job
    expect(r.rows[0].r.status).toBe('already_submitted');
    const spends = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_pot_ledger WHERE game_id=$1 AND kind='spend'`,
      [g]
    );
    expect(spends.rows[0].n).toBe(1); // only the first drew down
  });

  it('is idempotent on the job id (pot debited once on retry)', async () => {
    const g = await mkGame(3);
    await mkPlayer(g, BOB);
    const j = jid();
    await submit(g, BOB, j);
    await submit(g, BOB, j); // same job → idempotent retry
    const pot = await db.query(`SELECT balance FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot.rows[0].balance).toBe(2); // still one debit
  });

  it('guards closed phase + non-members', async () => {
    const closed = await mkGame(3, 'voting');
    await mkPlayer(closed, BOB);
    const r = await submit(closed, BOB, jid());
    expect(r.rows[0].r.status).toBe('closed');

    const g = await mkGame(3);
    await expect(submit(g, BOB, jid())).rejects.toThrow(/not a member/);
  });
});

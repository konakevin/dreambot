/**
 * LIVE-DB test for the Dream Off ballot RPC (migration 411).
 *
 * Locks cast_votes integrity:
 *   - ≤2 roses, distinct entries, no self-vote, clean-completed entries only,
 *   - idempotent replace (re-casting overwrites the prior ballot),
 *   - records voted_at, and funnels through maybe_advance (all voted → results),
 *   - member-only + voting-phase guards.
 * Loads the REAL cast_votes (411) + the wired maybe_advance/tally/settle (409/405).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
const CAROL = '00000000-0000-0000-0000-0000000000c3';
let seq = 0;
const gid = () => `00000000-0000-0000-0000-0000000e${(seq++).toString().padStart(4, '0')}`;

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
async function mkGame(phase = 'voting'): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, phase_expires_at)
     VALUES ($1,$2,'t','custom',$3,$4, now() + interval '1 day')`,
    [id, OWNER, phase, id.slice(-10)]
  );
  return id;
}
async function mkPlayer(g: string, uid: string) {
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
    [g, uid]
  );
}
async function mkEntry(g: string, author: string): Promise<string> {
  const r = await db.query(
    `INSERT INTO public.dream_off_entries (game_id, author_id, author_name_snapshot, render_status, moderation_status, completed_at)
     VALUES ($1,$2,'n','completed','clean', now()) RETURNING id`,
    [g, author]
  );
  return r.rows[0].id;
}
const castVotes = (g: string, ids: string[]) =>
  db.query(`SELECT public.cast_votes($1,$2::uuid[]) AS r`, [g, ids]).then((r) => r.rows[0].r);

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
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
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
  await db.query(
    extract(
      migrationSql('411_dream_off_cast_votes.sql'),
      'CREATE OR REPLACE FUNCTION public.cast_votes(',
      '$$;'
    )
  );

  await db.query(`INSERT INTO public.users (id) VALUES ($1),($2),($3)`, [OWNER, BOB, CAROL]);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('cast_votes integrity (migration 411)', () => {
  it('records up to 2 roses and replaces on re-cast', async () => {
    const g = await mkGame();
    for (const u of [OWNER, BOB, CAROL]) await mkPlayer(g, u);
    const eB = await mkEntry(g, BOB);
    const eC = await mkEntry(g, CAROL);
    await actAs(OWNER);
    const r1 = await castVotes(g, [eB, eC]);
    expect(r1).toEqual({ status: 'ok', roses: 2 });
    const n1 = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_votes WHERE game_id=$1 AND voter_id=$2`,
      [g, OWNER]
    );
    expect(n1.rows[0].n).toBe(2);
    const voted = await db.query(
      `SELECT voted_at FROM public.dream_off_players WHERE game_id=$1 AND user_id=$2`,
      [g, OWNER]
    );
    expect(voted.rows[0].voted_at).not.toBeNull();

    // Re-cast with a single rose → replaces the prior ballot.
    const r2 = await castVotes(g, [eB]);
    expect(r2).toEqual({ status: 'ok', roses: 1 });
    const n2 = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_votes WHERE game_id=$1 AND voter_id=$2`,
      [g, OWNER]
    );
    expect(n2.rows[0].n).toBe(1);
  });

  it('rejects self-vote, >2 roses, and duplicate entries', async () => {
    const g = await mkGame();
    await mkPlayer(g, OWNER);
    await mkPlayer(g, BOB);
    const eOwn = await mkEntry(g, OWNER);
    const eB = await mkEntry(g, BOB);
    const eC = await mkEntry(g, CAROL);
    await actAs(OWNER);
    expect((await castVotes(g, [eOwn])).status).toBe('invalid_ballot'); // own entry
    expect((await castVotes(g, [eB, eC, eB])).status).toBe('too_many_roses'); // 3
    expect((await castVotes(g, [eB, eB])).status).toBe('invalid_ballot'); // duplicate
  });

  it('guards non-members and non-voting phases', async () => {
    const g = await mkGame();
    const eB = await mkEntry(g, BOB);
    await actAs(CAROL); // not a member
    await expect(castVotes(g, [eB])).rejects.toThrow(/not a member/);

    const closed = await mkGame('submission');
    await mkPlayer(closed, OWNER);
    await actAs(OWNER);
    expect((await castVotes(closed, [])).status).toBe('closed');
  });

  it('advances to results once everyone has voted', async () => {
    const g = await mkGame();
    await mkPlayer(g, OWNER);
    await mkPlayer(g, BOB);
    const eOwn = await mkEntry(g, OWNER);
    const eB = await mkEntry(g, BOB);
    await actAs(OWNER);
    await castVotes(g, [eB]);
    const mid = await db.query(`SELECT phase FROM public.dream_offs WHERE id=$1`, [g]);
    expect(mid.rows[0].phase).toBe('voting'); // Bob hasn't voted
    await actAs(BOB);
    await castVotes(g, [eOwn]);
    const done = await db.query(`SELECT phase FROM public.dream_offs WHERE id=$1`, [g]);
    expect(done.rows[0].phase).toBe('results');
    const winner = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_superlatives WHERE game_id=$1 AND key='winner'`,
      [g]
    );
    expect(winner.rows[0].n).toBe(1);
  });
});

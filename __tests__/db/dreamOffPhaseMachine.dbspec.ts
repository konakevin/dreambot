/**
 * LIVE-DB test for the Dream Off phase machine (migration 405).
 *
 * Locks the "always resolves, never rots" transitions + the tally:
 *   - submission -> voting (>=2 entries), -> results (1 entry, win by default),
 *     -> no_contest (0 entries),
 *   - voting -> results with a correct tally (winner + runner_up + dark_horse at
 *     4+ players; only the winner below that; deterministic tiebreak),
 *   - tally_results is idempotent.
 * Loads the REAL RPCs + table DDL (400/405) so it validates the SQL.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const voters: string[] = [];
let seq = 0;

const gid = () => `00000000-0000-0000-0000-0000000f${(seq++).toString().padStart(4, '0')}`;

async function mkGame(phase: string): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, phase_expires_at)
     VALUES ($1,$2,'t','custom',$3,$4, now() + interval '1 day')`,
    [id, OWNER, phase, id.slice(-10)]
  );
  return id;
}
async function mkPlayer(game: string, uid: string, opts: { voted?: boolean } = {}) {
  await db.query(
    `INSERT INTO public.dream_off_players (game_id, user_id, status, submitted_at, voted_at)
     VALUES ($1,$2,'active', now(), $3)`,
    [game, uid, opts.voted ? new Date() : null]
  );
}
// Insert a completed+clean entry with `roses` votes (each from a distinct voter).
async function mkEntry(game: string, author: string, roses: number): Promise<string> {
  const { rows } = await db.query(
    `INSERT INTO public.dream_off_entries (game_id, author_id, author_name_snapshot, render_status, moderation_status, completed_at)
     VALUES ($1,$2,$3,'completed','clean', clock_timestamp()) RETURNING id`,
    [game, author, `u-${author.slice(-2)}`]
  );
  const entryId = rows[0].id as string;
  for (let i = 0; i < roses; i++) {
    await db.query(
      `INSERT INTO public.dream_off_votes (game_id, voter_id, entry_id, rose_index) VALUES ($1,$2,$3,0)`,
      [game, voters[i], entryId]
    );
  }
  return entryId;
}

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'notifications',
    'dream_off_superlatives',
    'dream_off_votes',
    'dream_off_entries',
    'dream_off_events',
    'dream_off_players',
    'dream_offs',
    'engine_config',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await db.query(
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_deadline_hours int)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, 24)`);
  await db.query(
    `CREATE TABLE public.notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       recipient_id uuid, actor_id uuid, type text, reference_id uuid)`
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

  const m405 = migrationSql('405_dream_off_phase_machine.sql');
  await db.query(extract(m405, 'CREATE OR REPLACE FUNCTION public.tally_results(', '$$;'));
  await db.query(
    extract(m405, 'CREATE OR REPLACE FUNCTION public.maybe_advance_dream_off(', '$$;')
  );

  await db.query(`INSERT INTO public.users (id) VALUES ($1)`, [OWNER]);
  for (let i = 0; i < 15; i++) {
    const u = `00000000-0000-0000-0000-0000000v${i.toString().padStart(4, '0')}`.replace('v', 'd');
    voters.push(u);
    await db.query(`INSERT INTO public.users (id) VALUES ($1)`, [u]);
  }
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('maybe_advance_dream_off transitions (migration 405)', () => {
  it('submission -> voting with >=2 entries (force), fans out voting_open', async () => {
    const g = await mkGame('submission');
    await mkPlayer(g, OWNER);
    await mkPlayer(g, voters[0]);
    await mkEntry(g, OWNER, 0);
    await mkEntry(g, voters[0], 0);
    const { rows } = await db.query(
      `SELECT public.maybe_advance_dream_off($1, true, 'test') AS p`,
      [g]
    );
    expect(rows[0].p).toBe('voting');
    const n = await db.query(
      `SELECT count(*)::int AS c FROM public.notifications WHERE reference_id=$1 AND type='dream_off_voting_open'`,
      [g]
    );
    expect(n.rows[0].c).toBe(2);
  });

  it('submission -> results (win by default) with exactly 1 entry', async () => {
    const g = await mkGame('submission');
    await mkPlayer(g, OWNER);
    const solo = await mkEntry(g, OWNER, 0);
    const { rows } = await db.query(
      `SELECT public.maybe_advance_dream_off($1, true, 'test') AS p`,
      [g]
    );
    expect(rows[0].p).toBe('results');
    const w = await db.query(
      `SELECT entry_id FROM public.dream_off_superlatives WHERE game_id=$1 AND key='winner'`,
      [g]
    );
    expect(w.rows[0].entry_id).toBe(solo);
  });

  it('submission -> no_contest with 0 entries', async () => {
    const g = await mkGame('submission');
    await mkPlayer(g, OWNER);
    const { rows } = await db.query(
      `SELECT public.maybe_advance_dream_off($1, true, 'test') AS p`,
      [g]
    );
    expect(rows[0].p).toBe('no_contest');
  });
});

describe('tally (migration 405)', () => {
  it('at 4+ players: winner + runner_up + dark_horse by roses, deterministic', async () => {
    const g = await mkGame('voting');
    for (const u of [OWNER, voters[10], voters[11], voters[12]])
      await mkPlayer(g, u, { voted: true });
    const eWin = await mkEntry(g, OWNER, 5);
    const eRun = await mkEntry(g, voters[10], 3);
    const eDark = await mkEntry(g, voters[11], 1);
    await mkEntry(g, voters[12], 0); // last place, no award
    await db.query(`SELECT public.maybe_advance_dream_off($1, true, 'test')`, [g]);

    const s = await db.query(
      `SELECT key, entry_id FROM public.dream_off_superlatives WHERE game_id=$1 ORDER BY key`,
      [g]
    );
    const byKey = Object.fromEntries(s.rows.map((r) => [r.key, r.entry_id]));
    expect(byKey.winner).toBe(eWin);
    expect(byKey.runner_up).toBe(eRun);
    expect(byKey.dark_horse).toBe(eDark);
  });

  it('below 4 players: only a winner (no runner_up / dark_horse)', async () => {
    const g = await mkGame('voting');
    for (const u of [OWNER, voters[13]]) await mkPlayer(g, u, { voted: true });
    const eWin = await mkEntry(g, OWNER, 2);
    await mkEntry(g, voters[13], 1);
    await db.query(`SELECT public.maybe_advance_dream_off($1, true, 'test')`, [g]);
    const keys = await db.query(
      `SELECT key FROM public.dream_off_superlatives WHERE game_id=$1 ORDER BY key`,
      [g]
    );
    expect(keys.rows.map((r) => r.key)).toEqual(['winner']);
    const w = await db.query(
      `SELECT entry_id FROM public.dream_off_superlatives WHERE game_id=$1 AND key='winner'`,
      [g]
    );
    expect(w.rows[0].entry_id).toBe(eWin);
  });

  it('is idempotent (a second advance does not double-tally)', async () => {
    const g = await mkGame('voting');
    for (const u of [OWNER, voters[14]]) await mkPlayer(g, u, { voted: true });
    await mkEntry(g, OWNER, 1);
    await mkEntry(g, voters[14], 0);
    await db.query(`SELECT public.maybe_advance_dream_off($1, true, 'test')`, [g]);
    await db.query(`SELECT public.tally_results($1)`, [g]); // re-tally
    const n = await db.query(
      `SELECT count(*)::int AS c FROM public.dream_off_superlatives WHERE game_id=$1 AND key='winner'`,
      [g]
    );
    expect(n.rows[0].c).toBe(1);
  });
});

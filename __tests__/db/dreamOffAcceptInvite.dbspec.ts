/**
 * LIVE-DB test for accept_invite (migration 424) — the code-less accept path for a
 * push-invited friend. Locks: invited → active during setup; a brand-new joiner is
 * seated; removed stays out; a voting-phase game is spectator-only; a full game is
 * refused; the kill-switch gates it. Mirrors join_game_by_code's status strings.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
let seq = 0;
const gid = () => `00000000-0000-0000-0000-00000000e${(seq++).toString().padStart(3, '0')}`;

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
async function mkGame(phase: string, maxPlayers = 12): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, max_players)
     VALUES ($1,$2,'t','custom',$3,$4,$5)`,
    [id, OWNER, phase, id.slice(-6), maxPlayers]
  );
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status,joined_via) VALUES ($1,$2,'active','owner')`,
    [id, OWNER]
  );
  return id;
}
async function seat(game: string, uid: string, status: string) {
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status,joined_via) VALUES ($1,$2,$3,'invite')`,
    [game, uid, status]
  );
}
const accept = async (game: string) =>
  (await db.query(`SELECT public.accept_invite($1) AS r`, [game])).rows[0].r;
const statusOf = async (game: string, uid: string) =>
  (
    await db.query(`SELECT status FROM public.dream_off_players WHERE game_id=$1 AND user_id=$2`, [
      game,
      uid,
    ])
  ).rows[0]?.status ?? null;

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
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
    'CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_enabled boolean)'
  );
  await db.query('INSERT INTO public.engine_config VALUES (1, true)');
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );
  const m400 = migrationSql('400_dream_off_core_schema.sql');
  for (const tbl of ['dream_offs', 'dream_off_players', 'dream_off_events']) {
    await db.query(extract(m400, `CREATE TABLE IF NOT EXISTS public.${tbl} (`, ');'));
  }
  const m424 = migrationSql('424_dream_off_accept_invite.sql');
  await db.query(extract(m424, 'CREATE OR REPLACE FUNCTION public.accept_invite(', '$$;'));

  await db.query(`INSERT INTO public.users (id) VALUES ($1),($2)`, [OWNER, BOB]);
});

afterEach(async () => {
  await db.query(`UPDATE public.engine_config SET dream_off_enabled = true WHERE id = 1`);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('accept_invite (migration 424)', () => {
  it('promotes an invited player to active during setup', async () => {
    await actAs(BOB);
    const g = await mkGame('setup');
    await seat(g, BOB, 'invited');
    const r = await accept(g);
    expect(r.status).toBe('already_member');
    expect(await statusOf(g, BOB)).toBe('active');
  });

  it('seats a brand-new joiner as active (joined)', async () => {
    await actAs(BOB);
    const g = await mkGame('submission');
    const r = await accept(g);
    expect(r.status).toBe('joined');
    expect(await statusOf(g, BOB)).toBe('active');
  });

  it('keeps a removed player out', async () => {
    await actAs(BOB);
    const g = await mkGame('setup');
    await seat(g, BOB, 'removed');
    expect((await accept(g)).status).toBe('removed');
    expect(await statusOf(g, BOB)).toBe('removed');
  });

  it('is spectator-only once voting has started', async () => {
    await actAs(BOB);
    const g = await mkGame('voting');
    expect((await accept(g)).status).toBe('spectator');
    expect(await statusOf(g, BOB)).toBeNull();
  });

  it('refuses when the game is full', async () => {
    await actAs(BOB);
    const g = await mkGame('setup', 1); // owner already fills the single slot
    expect((await accept(g)).status).toBe('full');
  });

  it('is gated by the kill-switch', async () => {
    await actAs(BOB);
    const g = await mkGame('setup');
    await db.query(`UPDATE public.engine_config SET dream_off_enabled = false WHERE id = 1`);
    expect((await accept(g)).status).toBe('disabled');
  });
});

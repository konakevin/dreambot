/**
 * LIVE-DB test for get_game_players including pending invites (migration 427):
 * the roster now returns 'invited' rows + each player's status, so the lobby can
 * show invited friends (dimmed) before they accept.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const CAROL = '00000000-0000-0000-0000-0000000000c3';
const GAME = '00000000-0000-0000-0000-00000000e701';

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}

beforeAll(async () => {
  db = await pool.connect();
  for (const t of ['dream_off_players', 'dream_offs', 'users']) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  await db.query(
    'CREATE TABLE public.users (id uuid PRIMARY KEY, display_name text, username text, avatar_url text)'
  );
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );
  const m400 = migrationSql('400_dream_off_core_schema.sql');
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_offs (', ');'));
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_players (', ');'));
  const m427 = migrationSql('427_dream_off_players_include_invited.sql');
  await db.query(extract(m427, 'CREATE OR REPLACE FUNCTION public.get_game_players(', '$$;'));

  await db.query(`INSERT INTO public.users (id, username) VALUES ($1,'owner'),($2,'carol')`, [
    OWNER,
    CAROL,
  ]);
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, invite_code, phase)
     VALUES ($1,$2,'t','custom','ABCDEF','setup')`,
    [GAME, OWNER]
  );
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status,joined_via) VALUES
       ($1,$2,'active','owner'),($1,$3,'invited','invite')`,
    [GAME, OWNER, CAROL]
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('get_game_players includes invites (migration 427)', () => {
  it('returns invited players with their status, accepted first', async () => {
    await actAs(OWNER);
    const players = (await db.query(`SELECT public.get_game_players($1) AS r`, [GAME])).rows[0]
      .r as Array<{ user_id: string; status: string }>;
    expect(players).toHaveLength(2);
    expect(players[0].user_id).toBe(OWNER); // accepted sorts first
    expect(players.find((p) => p.user_id === CAROL)?.status).toBe('invited');
  });
});

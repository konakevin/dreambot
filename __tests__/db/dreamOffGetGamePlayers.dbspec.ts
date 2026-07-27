/**
 * LIVE-DB test for get_game_players (migration 422).
 *
 * Members see the roster (name + avatar + submitted/voted flags + is_owner);
 * non-members get []. Loads the REAL RPC (422) over the real table DDL (400).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
const STRANGER = '00000000-0000-0000-0000-0000000000d4';
const GAME = '00000000-0000-0000-0000-00000000e001';

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
const call = async (sql: string, args: unknown[] = []) => (await db.query(sql, args)).rows[0].r;

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

  const m422 = migrationSql('422_dream_off_get_game_players.sql');
  await db.query(extract(m422, 'CREATE OR REPLACE FUNCTION public.get_game_players(', '$$;'));

  await db.query(
    `INSERT INTO public.users (id, username, avatar_url) VALUES
       ($1,'owner','http://a/o.png'),($2,'bob',NULL),($3,'stranger',NULL)`,
    [OWNER, BOB, STRANGER]
  );
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, invite_code, phase)
     VALUES ($1,$2,'t','custom','ABCDEFGHJK','submission')`,
    [GAME, OWNER]
  );
  await db.query(
    `INSERT INTO public.dream_off_players (game_id, user_id, status, joined_via, submitted_at) VALUES
       ($1,$2,'active','owner', now()),
       ($1,$3,'active','invite', NULL)`,
    [GAME, OWNER, BOB]
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('get_game_players (migration 422)', () => {
  it('returns the roster to a member, with acted flags + is_owner', async () => {
    await actAs(OWNER);
    const players = (await call(`SELECT public.get_game_players($1) AS r`, [GAME])) as Array<{
      user_id: string;
      name: string;
      avatar_url: string | null;
      submitted: boolean;
      is_owner: boolean;
    }>;
    expect(players).toHaveLength(2);
    const owner = players.find((p) => p.user_id === OWNER);
    const bob = players.find((p) => p.user_id === BOB);
    expect(owner).toMatchObject({ is_owner: true, submitted: true, avatar_url: 'http://a/o.png' });
    expect(bob).toMatchObject({ is_owner: false, submitted: false, name: 'bob' });
  });

  it('returns [] to a non-member', async () => {
    await actAs(STRANGER);
    const players = await call(`SELECT public.get_game_players($1) AS r`, [GAME]);
    expect(players).toEqual([]);
  });
});

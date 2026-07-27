/**
 * LIVE-DB test for get_my_games cover_image (migration 426): a finished game
 * returns its WINNING entry's game_image_ref; an in-progress game returns null.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const DONE = '00000000-0000-0000-0000-00000000d001';
const LIVE = '00000000-0000-0000-0000-00000000d002';

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'dream_off_superlatives',
    'dream_off_entries',
    'dream_off_players',
    'dream_offs',
    'uploads',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await db.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
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
    'dream_off_superlatives',
  ]) {
    await db.query(extract(m400, `CREATE TABLE IF NOT EXISTS public.${tbl} (`, ');'));
  }
  const m425 = migrationSql('426_dream_off_my_games_cover.sql');
  await db.query(extract(m425, 'CREATE OR REPLACE FUNCTION public.get_my_games()', '$$;'));

  await db.query(`INSERT INTO public.users (id) VALUES ($1)`, [OWNER]);

  // A FINISHED game with a winner entry + superlative.
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code)
     VALUES ($1,$2,'done topic','custom','results','DONE01')`,
    [DONE, OWNER]
  );
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
    [DONE, OWNER]
  );
  const e = await db.query(
    `INSERT INTO public.dream_off_entries
       (game_id, author_id, author_name_snapshot, render_status, moderation_status, game_image_ref)
     VALUES ($1,$2,'me','completed','clean','game/DONE/win.png') RETURNING id`,
    [DONE, OWNER]
  );
  await db.query(
    `INSERT INTO public.dream_off_superlatives (game_id, key, entry_id, rose_count) VALUES ($1,'winner',$2,3)`,
    [DONE, e.rows[0].id]
  );

  // An IN-PROGRESS game (no winner yet).
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code)
     VALUES ($1,$2,'live topic','custom','setup','LIVE01')`,
    [LIVE, OWNER]
  );
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
    [LIVE, OWNER]
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('get_my_games cover_image (migration 426)', () => {
  it('returns the winner image for a finished game, null for an in-progress one', async () => {
    await actAs(OWNER);
    const { rows } = await db.query(`SELECT public.get_my_games() AS r`);
    const games = rows[0].r as Array<{ id: string; cover_image: string | null }>;
    const done = games.find((g) => g.id === DONE);
    const live = games.find((g) => g.id === LIVE);
    expect(done?.cover_image).toBe('game/DONE/win.png');
    expect(live?.cover_image).toBeNull();
  });
});

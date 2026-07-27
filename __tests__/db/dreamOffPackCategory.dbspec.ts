/**
 * LIVE-DB test for the Dream Off pack-category / cast-mode binding (migration 420).
 *
 * A game freezes a topic CATEGORY (scene|cast) and, for cast games, a CAST MODE
 * (single|couple). This locks:
 *   - create_game stores the (category, cast_mode) pair and normalizes it: a cast
 *     game defaults to 'single' when no mode is given; a scene game carries none,
 *   - the coherence CHECK (cast⇒mode, scene⇒no-mode) holds,
 *   - deal_topic pulls ONLY from the game's category (a scene game never gets a
 *     cast scenario and vice-versa),
 *   - get_game_room surfaces pack_category + cast_mode for client topic wording.
 * Loads the REAL DDL/RPCs from migrations 400/402/403/417/420 (auth.uid stubbed).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
const call = async (sql: string, args: unknown[] = []) => (await db.query(sql, args)).rows[0].r;

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'dream_off_pot_ledger',
    'dream_off_pot',
    'dream_off_tiers',
    'dream_off_entries',
    'dream_off_events',
    'dream_off_players',
    'dream_off_topics',
    'dream_offs',
    'engine_config',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }

  await db.query(
    'CREATE TABLE public.users (id uuid PRIMARY KEY, display_name text, username text)'
  );
  await db.query(
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_enabled boolean)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, true)`);
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );

  // Real table DDL.
  const m400 = migrationSql('400_dream_off_core_schema.sql');
  for (const tbl of [
    'dream_offs',
    'dream_off_players',
    'dream_off_events',
    'dream_off_topics',
    'dream_off_entries',
  ]) {
    await db.query(extract(m400, `CREATE TABLE IF NOT EXISTS public.${tbl} (`, ');'));
  }
  const m402 = migrationSql('402_dream_off_economy_tables.sql');
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_tiers (', ');'));
  await db.query(extract(m402, 'INSERT INTO public.dream_off_tiers', 'DO NOTHING;'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot (', ');'));

  // 417 adds topics.category; 420 adds dream_offs.(pack_category, cast_mode).
  const m417 = migrationSql('417_dream_off_topic_category.sql');
  await db.query(extract(m417, 'ALTER TABLE public.dream_off_topics', ';'));

  // Deps create_game needs (invite-code gen + pot setup) from 403.
  const m403 = migrationSql('403_dream_off_create.sql');
  await db.query(
    extract(m403, 'CREATE OR REPLACE FUNCTION public.dream_off_gen_invite_code()', '$$;')
  );
  await db.query(extract(m403, 'CREATE OR REPLACE FUNCTION public.dream_off_setup_pot(', '$$;'));

  // The migration under test.
  const m420 = migrationSql('420_dream_off_pack_category.sql');
  await db.query(extract(m420, 'ALTER TABLE public.dream_offs', ';'));
  await db.query(extract(m420, 'DO $$', 'END $$;'));
  // Shared CI DB: drop 403's 6-arg create_game so it can't coexist with the
  // 8-arg version below and make a 2-arg call ambiguous ("is not unique").
  await db.query(
    'DROP FUNCTION IF EXISTS public.create_game(text,text,text,integer,boolean,jsonb) CASCADE'
  );
  await db.query(extract(m420, 'CREATE OR REPLACE FUNCTION public.create_game(', '$$;'));
  await db.query(extract(m420, 'CREATE FUNCTION public.deal_topic(', '$$;'));
  await db.query(extract(m420, 'CREATE OR REPLACE FUNCTION public.get_game_room(', '$$;'));

  await db.query(`INSERT INTO public.users (id, username) VALUES ($1, 'owner')`, [OWNER]);
  // Same pack, two categories → deal_topic must respect the game's category.
  await db.query(
    `INSERT INTO public.dream_off_topics (pack, topic_text, category) VALUES
       ('cursed', 'the most cursed sandwich', 'scene'),
       ('cursed', 'a battle-worn knight', 'cast')`
  );
});

afterEach(async () => {
  await db.query('DELETE FROM public.dream_off_pot');
  await db.query('DELETE FROM public.dream_off_events');
  await db.query('DELETE FROM public.dream_off_players');
  await db.query('DELETE FROM public.dream_offs');
  await db.query(`UPDATE public.engine_config SET dream_off_enabled = true WHERE id = 1`);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('create_game — pack_category / cast_mode (migration 420)', () => {
  it('stores a cast game with its mode', async () => {
    await actAs(OWNER);
    const r = await call(
      `SELECT public.create_game('a knight','custom','standard',12,false,'{}'::jsonb,'cast','couple') AS r`
    );
    const row = await db.query(
      `SELECT pack_category, cast_mode FROM public.dream_offs WHERE id=$1`,
      [r.game_id]
    );
    expect(row.rows[0]).toEqual({ pack_category: 'cast', cast_mode: 'couple' });
  });

  it('defaults a scene game to no cast_mode', async () => {
    await actAs(OWNER);
    const r = await call(`SELECT public.create_game('a sandwich','custom') AS r`);
    const row = await db.query(
      `SELECT pack_category, cast_mode FROM public.dream_offs WHERE id=$1`,
      [r.game_id]
    );
    expect(row.rows[0]).toEqual({ pack_category: 'scene', cast_mode: null });
  });

  it('normalizes a cast game with no mode to single', async () => {
    await actAs(OWNER);
    const r = await call(
      `SELECT public.create_game('a knight','custom','standard',12,false,'{}'::jsonb,'cast') AS r`
    );
    const row = await db.query(`SELECT cast_mode FROM public.dream_offs WHERE id=$1`, [r.game_id]);
    expect(row.rows[0].cast_mode).toBe('single');
  });

  it('rejects a bad pack_category', async () => {
    await actAs(OWNER);
    await expect(
      db.query(`SELECT public.create_game('x','custom','standard',12,false,'{}'::jsonb,'bogus')`)
    ).rejects.toThrow(/bad pack_category/);
  });
});

describe('deal_topic — category-scoped deck (migration 420)', () => {
  it('a scene game only draws scene topics', async () => {
    await actAs(OWNER);
    const g = await call(`SELECT public.create_game('placeholder','custom') AS r`);
    const dealt = await call(`SELECT public.deal_topic($1,'cursed') AS r`, [g.game_id]);
    expect(dealt.topic).toBe('the most cursed sandwich');
  });

  it('a cast game only draws cast scenarios', async () => {
    await actAs(OWNER);
    const g = await call(
      `SELECT public.create_game('placeholder','custom','standard',12,false,'{}'::jsonb,'cast','single') AS r`
    );
    const dealt = await call(`SELECT public.deal_topic($1,'cursed') AS r`, [g.game_id]);
    expect(dealt.topic).toBe('a battle-worn knight');
  });
});

describe('get_game_room — surfaces the pair (migration 420)', () => {
  it('returns pack_category + cast_mode to a member', async () => {
    await actAs(OWNER);
    const g = await call(
      `SELECT public.create_game('a knight','custom','standard',12,false,'{}'::jsonb,'cast','couple') AS r`
    );
    const room = await call(`SELECT public.get_game_room($1) AS r`, [g.game_id]);
    expect(room.pack_category).toBe('cast');
    expect(room.cast_mode).toBe('couple');
  });
});

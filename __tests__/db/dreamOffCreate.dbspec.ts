/**
 * LIVE-DB test for the Dream Off create flow (migration 403).
 *
 * Locks create_game / deal_topic: create_game requires auth + the kill-switch,
 * seats the owner as a player, mints an escrow pot, records a 'created' event,
 * and returns a game_id + a 10-char invite code; deal_topic (owner, setup only)
 * pulls a topic from the active deck. Loads the REAL RPCs + table DDL from
 * migrations 400/402/403 (auth.uid + sanitize stubbed) so it validates the SQL.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'dream_off_pot_ledger',
    'dream_off_pot',
    'dream_off_tiers',
    'dream_off_events',
    'dream_off_players',
    'dream_off_entries',
    'dream_off_topics',
    'dream_offs',
    'engine_config',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }

  // FK-target + dependency stubs.
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await db.query(
    `CREATE TABLE public.engine_config (
       id int PRIMARY KEY, dream_off_enabled boolean, dream_off_deadline_hours int, gift_max_per_day int)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, true, 24, 200)`);
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );
  // NOTE: we do NOT load the topic-sanitize trigger here — it calls the shared
  // sanitize_user_text / text_is_blocked, and redefining those as stubs would
  // clobber sibling dbspecs (textModeration) that share this one CI database.
  // The trigger reuses those proven functions + is validated by the prod apply;
  // create_game/deal_topic below insert clean topics, so it isn't needed here.

  // Real DDL.
  const m400 = migrationSql('400_dream_off_core_schema.sql');
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_offs (', ');'));
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_players (', ');'));
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_events (', ');'));
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_topics (', ');'));

  const m402 = migrationSql('402_dream_off_economy_tables.sql');
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_tiers (', ');'));
  await db.query(extract(m402, 'INSERT INTO public.dream_off_tiers', 'DO NOTHING;'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot (', ');'));

  const m403 = migrationSql('403_dream_off_create.sql');
  await db.query(
    extract(m403, 'CREATE OR REPLACE FUNCTION public.dream_off_gen_invite_code()', '$$;')
  );
  await db.query(extract(m403, 'CREATE OR REPLACE FUNCTION public.dream_off_setup_pot(', '$$;'));
  // 420 introduces an 8-arg create_game overload; in the shared CI DB it can
  // linger from that spec and make this spec's 2-arg calls ambiguous
  // ("is not unique"). Drop it so ONLY 403's 6-arg version exists here.
  await db.query(
    'DROP FUNCTION IF EXISTS public.create_game(text,text,text,integer,boolean,jsonb,text,text) CASCADE'
  );
  await db.query(extract(m403, 'CREATE OR REPLACE FUNCTION public.create_game(', '$$;'));
  await db.query(extract(m403, 'CREATE OR REPLACE FUNCTION public.deal_topic(', '$$;'));

  await db.query(`INSERT INTO public.users (id) VALUES ($1)`, [OWNER]);
  await db.query(
    `INSERT INTO public.dream_off_topics (pack, topic_text) VALUES ('cursed', 'the most cursed sandwich')`
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

describe('create_game (migration 403)', () => {
  it('seats the owner, mints a pot + event, returns game_id + 10-char code', async () => {
    await actAs(OWNER);
    const { rows } = await db.query(`SELECT public.create_game('cursed sandwich', 'custom') AS r`);
    const gameId = rows[0].r.game_id as string;
    const code = rows[0].r.invite_code as string;
    expect(gameId).toBeTruthy();
    expect(code).toMatch(/^[A-Z2-9]{10}$/);

    const owner = await db.query(
      `SELECT status, joined_via FROM public.dream_off_players WHERE game_id=$1 AND user_id=$2`,
      [gameId, OWNER]
    );
    expect(owner.rows[0]).toEqual({ status: 'active', joined_via: 'owner' });

    const pot = await db.query(
      `SELECT slot_price, status FROM public.dream_off_pot WHERE game_id=$1`,
      [gameId]
    );
    expect(pot.rows[0]).toEqual({ slot_price: 1, status: 'open' });

    const ev = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_events WHERE game_id=$1 AND kind='created'`,
      [gameId]
    );
    expect(ev.rows[0].n).toBe(1);
  });

  it('rejects when the kill-switch is off', async () => {
    await actAs(OWNER);
    await db.query(`UPDATE public.engine_config SET dream_off_enabled = false WHERE id = 1`);
    await expect(db.query(`SELECT public.create_game('t', 'custom')`)).rejects.toThrow(/disabled/);
  });

  it('rejects an unauthenticated caller', async () => {
    await actAs(null);
    await expect(db.query(`SELECT public.create_game('t', 'custom')`)).rejects.toThrow(
      /not authenticated/
    );
  });
});

describe('deal_topic (migration 403)', () => {
  it('lets the owner pull a topic from the deck during setup', async () => {
    await actAs(OWNER);
    const created = await db.query(`SELECT public.create_game('placeholder', 'custom') AS r`);
    const gameId = created.rows[0].r.game_id as string;
    const dealt = await db.query(`SELECT public.deal_topic($1) AS r`, [gameId]);
    expect(dealt.rows[0].r.topic).toBe('the most cursed sandwich');
    const row = await db.query(`SELECT topic, topic_source FROM public.dream_offs WHERE id=$1`, [
      gameId,
    ]);
    expect(row.rows[0]).toEqual({ topic: 'the most cursed sandwich', topic_source: 'surprise' });
  });
});

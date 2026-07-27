/**
 * LIVE-DB test for reroll_topic (migration 429) — the lobby "New seed" re-roll.
 *
 * Locks the guardrails that keep a re-roll from shooting the game in the foot:
 *   - re-rolls stay WITHIN the game's original pack (pack_key), not the whole category,
 *   - owner-only,
 *   - setup-phase-only (the seed is FROZEN the instant the game starts — this is the
 *     server-side lock, so a dreamer can never race a seed change),
 *   - a custom (owner-authored) seed can't be re-rolled (there's no pack).
 * Loads REAL DDL/RPCs from migrations 400/417/420/421/429 (auth.uid stubbed).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const STRANGER = '00000000-0000-0000-0000-0000000000a2';

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
const call = async (sql: string, args: unknown[] = []) => (await db.query(sql, args)).rows[0].r;

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'dream_off_packs',
    'dream_off_events',
    'dream_off_topics',
    'dream_offs',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }

  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );

  const m400 = migrationSql('400_dream_off_core_schema.sql');
  for (const tbl of ['dream_offs', 'dream_off_events', 'dream_off_topics']) {
    await db.query(extract(m400, `CREATE TABLE IF NOT EXISTS public.${tbl} (`, ');'));
  }
  const m417 = migrationSql('417_dream_off_topic_category.sql');
  await db.query(extract(m417, 'ALTER TABLE public.dream_off_topics', ';'));
  const m420 = migrationSql('420_dream_off_pack_category.sql');
  await db.query(extract(m420, 'ALTER TABLE public.dream_offs', ';'));
  await db.query(extract(m420, 'DO $$', 'END $$;'));
  const m421 = migrationSql('421_dream_off_pack_catalog.sql');
  await db.query(extract(m421, 'CREATE TABLE IF NOT EXISTS public.dream_off_packs (', ');'));

  // The migration under test: pack_key column + deal_topic v4 (stamps pack_key) +
  // reroll_topic.
  const m429 = migrationSql('429_dream_off_reroll_topic.sql');
  await db.query(extract(m429, 'ALTER TABLE public.dream_offs', ';'));
  await db.query(extract(m429, 'CREATE OR REPLACE FUNCTION public.deal_topic(', '$$;'));
  await db.query(extract(m429, 'CREATE OR REPLACE FUNCTION public.reroll_topic(', '$$;'));

  await db.query(`INSERT INTO public.users (id) VALUES ($1), ($2)`, [OWNER, STRANGER]);

  // Two evergreen scene packs, each with ONE distinct topic — so "stayed in the
  // pack" is provable (a re-roll of the 'ever' game can only return its topic).
  await db.query(
    `INSERT INTO public.dream_off_packs (key, display_name, has_scene, has_cast, sort_order)
     VALUES ('ever', 'Evergreen', true, false, 10),
            ('other', 'Other', true, false, 20)`
  );
  await db.query(
    `INSERT INTO public.dream_off_topics (pack, topic_text, category) VALUES
       ('ever',  'a cursed sandwich', 'scene'),
       ('other', 'a haunted bouncy castle', 'scene')`
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

// A setup scene game whose seed was dealt from the 'ever' pack (so pack_key='ever').
async function mkDealtGame(): Promise<string> {
  const r = await db.query(
    `INSERT INTO public.dream_offs (owner_id, topic, topic_source, invite_code, phase, pack_category)
     VALUES ($1, 'placeholder', 'custom', $2, 'setup', 'scene') RETURNING id`,
    [OWNER, Math.random().toString(36).slice(2, 12).toUpperCase()]
  );
  const g = r.rows[0].id;
  await actAs(OWNER);
  await db.query(`SELECT public.deal_topic($1, 'ever')`, [g]);
  return g;
}

describe('reroll_topic (migration 429)', () => {
  it('re-deals from the SAME pack (pack_key preserved, never drifts to another pack)', async () => {
    const g = await mkDealtGame();
    await actAs(OWNER);
    const rolled = await call(`SELECT public.reroll_topic($1) AS r`, [g]);
    expect(rolled.topic).toBe('a cursed sandwich'); // 'ever' only, never 'other'
    const row = await db.query(`SELECT pack_key, topic_source FROM public.dream_offs WHERE id=$1`, [
      g,
    ]);
    expect(row.rows[0].pack_key).toBe('ever');
    expect(row.rows[0].topic_source).toBe('pack');
  });

  it('refuses a non-owner', async () => {
    const g = await mkDealtGame();
    await actAs(STRANGER);
    await expect(db.query(`SELECT public.reroll_topic($1)`, [g])).rejects.toThrow(/not your game/);
  });

  it('refuses once the game has left setup (the seed is locked at start)', async () => {
    const g = await mkDealtGame();
    await db.query(`UPDATE public.dream_offs SET phase='submission' WHERE id=$1`, [g]);
    await actAs(OWNER);
    await expect(db.query(`SELECT public.reroll_topic($1)`, [g])).rejects.toThrow(/not in setup/);
  });

  it('refuses a custom (owner-authored) seed', async () => {
    const r = await db.query(
      `INSERT INTO public.dream_offs (owner_id, topic, topic_source, invite_code, phase, pack_category)
       VALUES ($1, 'my own idea', 'custom', $2, 'setup', 'scene') RETURNING id`,
      [OWNER, 'CUST01']
    );
    await actAs(OWNER);
    await expect(db.query(`SELECT public.reroll_topic($1)`, [r.rows[0].id])).rejects.toThrow(
      /cannot reroll a custom topic/
    );
  });
});

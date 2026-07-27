/**
 * LIVE-DB test for the Dream Off pack catalog (migration 421).
 *
 * dream_off_packs is the storefront the picker renders. This locks:
 *   - get_dream_off_packs returns only ACTIVE, IN-SEASON packs, filtered to those
 *     offering the requested category (has_scene / has_cast); rejects a bad category,
 *   - deal_topic v3 gates the deck on the CATALOG's season (the single remote source):
 *     a pack whose season has passed deals nothing even if its topics still exist,
 *     and an evergreen pack deals a topic of the game's category.
 * Loads the REAL DDL/RPCs from migrations 400/417/420/421 (auth.uid stubbed).
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
const keysOf = (arr: Array<{ key: string }>) => arr.map((p) => p.key).sort();

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
  // 417: topics.category ; 420: dream_offs.pack_category (deal_topic reads it).
  const m417 = migrationSql('417_dream_off_topic_category.sql');
  await db.query(extract(m417, 'ALTER TABLE public.dream_off_topics', ';'));
  const m420 = migrationSql('420_dream_off_pack_category.sql');
  await db.query(extract(m420, 'ALTER TABLE public.dream_offs', ';'));
  await db.query(extract(m420, 'DO $$', 'END $$;'));

  // The migration under test: catalog table + read RPC + deal_topic v3.
  const m421 = migrationSql('421_dream_off_pack_catalog.sql');
  await db.query(extract(m421, 'CREATE TABLE IF NOT EXISTS public.dream_off_packs (', ');'));
  await db.query(extract(m421, 'CREATE OR REPLACE FUNCTION public.get_dream_off_packs(', '$$;'));
  await db.query(extract(m421, 'CREATE OR REPLACE FUNCTION public.deal_topic(', '$$;'));

  await db.query(`INSERT INTO public.users (id) VALUES ($1)`, [OWNER]);

  // Catalog fixtures: an evergreen dual-category pack, a cast-only pack, and a
  // holiday pack whose season is long past.
  await db.query(
    `INSERT INTO public.dream_off_packs
       (key, display_name, has_scene, has_cast, is_holiday, season_start, season_end, sort_order)
     VALUES
       ('ever',     'Evergreen', true,  true,  false, NULL,         NULL,         10),
       ('castonly', 'Cast Only', false, true,  false, NULL,         NULL,         20),
       ('old',      'Old Party', true,  true,  true,  '2020-01-01', '2020-01-02', 30)`
  );
  await db.query(
    `INSERT INTO public.dream_off_topics (pack, topic_text, category) VALUES
       ('ever', 'a cursed sandwich', 'scene'),
       ('ever', 'a battle-worn knight', 'cast'),
       ('old',  'a passed-season scene', 'scene')`
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

async function mkSceneGame(): Promise<string> {
  const r = await db.query(
    `INSERT INTO public.dream_offs (owner_id, topic, topic_source, invite_code, phase, pack_category)
     VALUES ($1, 'placeholder', 'custom', $2, 'setup', 'scene') RETURNING id`,
    [OWNER, Math.random().toString(36).slice(2, 12).toUpperCase()]
  );
  return r.rows[0].id;
}

describe('get_dream_off_packs (migration 421)', () => {
  it('returns active, in-season packs and hides out-of-season ones', async () => {
    await actAs(OWNER);
    const packs = await call(`SELECT public.get_dream_off_packs() AS r`);
    expect(keysOf(packs)).toEqual(['castonly', 'ever']); // 'old' is out of season
  });

  it('filters by category: scene excludes a cast-only pack', async () => {
    await actAs(OWNER);
    const scene = await call(`SELECT public.get_dream_off_packs('scene') AS r`);
    expect(keysOf(scene)).toEqual(['ever']);
    const cast = await call(`SELECT public.get_dream_off_packs('cast') AS r`);
    expect(keysOf(cast)).toEqual(['castonly', 'ever']);
  });

  it('rejects a bad category', async () => {
    await actAs(OWNER);
    await expect(db.query(`SELECT public.get_dream_off_packs('bogus')`)).rejects.toThrow(
      /bad category/
    );
  });
});

describe('deal_topic v3 — catalog season gate (migration 421)', () => {
  it('deals a category-matched topic from an in-season pack', async () => {
    await actAs(OWNER);
    const g = await mkSceneGame();
    const dealt = await call(`SELECT public.deal_topic($1, 'ever') AS r`, [g]);
    expect(dealt.topic).toBe('a cursed sandwich');
  });

  it('refuses a pack whose catalog season has passed', async () => {
    await actAs(OWNER);
    const g = await mkSceneGame();
    await expect(db.query(`SELECT public.deal_topic($1, 'old')`, [g])).rejects.toThrow(
      /no topics available/
    );
  });
});

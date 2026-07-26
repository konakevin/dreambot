/**
 * LIVE-DB test for get_client_flags (migration 414) — the client's read for
 * dark-launched feature flags. Locks: reflects engine_config.dream_off_enabled,
 * and defaults to false when unset (born dark).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

beforeAll(async () => {
  db = await pool.connect();
  await db.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await db.query(
    'CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_enabled boolean)'
  );
  await db.query(
    extract(
      migrationSql('414_get_client_flags.sql'),
      'CREATE OR REPLACE FUNCTION public.get_client_flags()',
      '$$;'
    )
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

const flags = () => db.query(`SELECT public.get_client_flags() AS f`).then((r) => r.rows[0].f);

describe('get_client_flags (migration 414)', () => {
  it('reflects dream_off_enabled', async () => {
    await db.query(`DELETE FROM public.engine_config`);
    await db.query(`INSERT INTO public.engine_config VALUES (1, true)`);
    expect(await flags()).toEqual({ dream_off_enabled: true });
    await db.query(`UPDATE public.engine_config SET dream_off_enabled = false WHERE id = 1`);
    expect(await flags()).toEqual({ dream_off_enabled: false });
  });

  it('defaults to false when there is no config row (born dark)', async () => {
    await db.query(`DELETE FROM public.engine_config`);
    expect(await flags()).toEqual({ dream_off_enabled: false });
  });
});

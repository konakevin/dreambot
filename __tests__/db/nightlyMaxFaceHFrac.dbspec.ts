/**
 * LIVE-DB test for migration 525 — engine_config.nightly_max_face_hfrac (the composition gate).
 * Default 0.35 (on, Kevin's call), range 0.20-1.0 (1.0 = off), idempotent.
 */
import { Pool } from 'pg';
import { makePool, migrationSql } from './_support/pg';

const pool: Pool = makePool();

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await pool.query('CREATE TABLE public.engine_config (id int PRIMARY KEY)');
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)');
  await pool.query(migrationSql('525_nightly_max_face_hfrac.sql'));
});

afterAll(async () => {
  await pool.end();
});

it('defaults to 0.35', async () => {
  const r = await pool.query<{ v: string }>(
    'SELECT nightly_max_face_hfrac::text AS v FROM public.engine_config WHERE id = 1'
  );
  expect(Number(r.rows[0].v)).toBe(0.35);
});

it('accepts 0.20, 0.40 and 1.0 (off); rejects 0.1 and 1.5', async () => {
  for (const v of [0.2, 0.4, 1.0]) {
    await pool.query('UPDATE public.engine_config SET nightly_max_face_hfrac = $1 WHERE id = 1', [
      v,
    ]);
  }
  for (const v of [0.1, 1.5]) {
    await expect(
      pool.query('UPDATE public.engine_config SET nightly_max_face_hfrac = $1 WHERE id = 1', [v])
    ).rejects.toThrow(/engine_config_nightly_max_face_hfrac_range/);
  }
});

it('is idempotent', async () => {
  await expect(pool.query(migrationSql('525_nightly_max_face_hfrac.sql'))).resolves.toBeTruthy();
});

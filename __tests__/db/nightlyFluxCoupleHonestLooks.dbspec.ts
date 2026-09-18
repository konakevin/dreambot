/**
 * LIVE-DB test for migration 529 — engine_config.nightly_flux_couple_honest_looks (the honest-looks switch for
 * flux-1.1-pro couples). Default false (the 2026-09-18 promotion state: album fragments), idempotent.
 */
import { Pool } from 'pg';
import { makePool, migrationSql } from './_support/pg';

const pool: Pool = makePool();

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await pool.query('CREATE TABLE public.engine_config (id int PRIMARY KEY)');
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)');
  await pool.query(migrationSql('529_nightly_flux_couple_honest_looks.sql'));
});

afterAll(async () => {
  await pool.end();
});

it('defaults to false', async () => {
  const r = await pool.query<{ v: boolean }>(
    'SELECT nightly_flux_couple_honest_looks AS v FROM public.engine_config WHERE id = 1'
  );
  expect(r.rows[0].v).toBe(false);
});

it('accepts true and false and re-applies cleanly', async () => {
  for (const v of [true, false]) {
    await pool.query(
      'UPDATE public.engine_config SET nightly_flux_couple_honest_looks = $1 WHERE id = 1',
      [v]
    );
  }
  await pool.query(migrationSql('529_nightly_flux_couple_honest_looks.sql'));
});

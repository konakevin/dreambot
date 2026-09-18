/**
 * LIVE-DB test for migration 525 — engine_config.nightly_couple_eye_lock (the composition gate).
 * Default 0.35 (on, Kevin's call), range 0.20-1.0 (1.0 = off), idempotent.
 */
import { Pool } from 'pg';
import { makePool, migrationSql } from './_support/pg';

const pool: Pool = makePool();

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await pool.query('CREATE TABLE public.engine_config (id int PRIMARY KEY)');
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)');
  await pool.query(migrationSql('526_nightly_couple_eye_lock.sql'));
});

afterAll(async () => {
  await pool.end();
});

it('defaults to false', async () => {
  const r = await pool.query<{ v: boolean }>(
    'SELECT nightly_couple_eye_lock AS v FROM public.engine_config WHERE id = 1'
  );
  expect(r.rows[0].v).toBe(false);
});

it('accepts true and false', async () => {
  for (const v of [true, false]) {
    await pool.query('UPDATE public.engine_config SET nightly_couple_eye_lock = $1 WHERE id = 1', [
      v,
    ]);
  }
});

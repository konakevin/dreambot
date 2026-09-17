/**
 * LIVE-DB test for migration 524 — engine_config.dual_big_face_max_hfrac (BIG_FACE_RECLAIM_PLAN.md).
 *
 * The big-face tier ships DARK: the column must default to 0.40 (today's giant guard) so deploying the code
 * changes nothing until the dashboard raises it, and the CHECK must keep it inside the engine's 0.40-0.80 clamp
 * so a typo can never disable the guard (below 0.40 is meaningless; above 0.80 no swap model finds the face).
 */
import { Pool } from 'pg';
import { makePool, migrationSql } from './_support/pg';

const pool: Pool = makePool();

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await pool.query('CREATE TABLE public.engine_config (id int PRIMARY KEY)');
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)');
  await pool.query(migrationSql('524_dual_big_face_max_hfrac.sql'));
});

afterAll(async () => {
  await pool.end();
});

it('defaults to 0.40 — the tier is off until the dashboard raises it', async () => {
  const r = await pool.query<{ v: string }>(
    'SELECT dual_big_face_max_hfrac::text AS v FROM public.engine_config WHERE id = 1'
  );
  expect(Number(r.rows[0].v)).toBe(0.4);
});

it('accepts the measured ceiling 0.60 and the clamp edges', async () => {
  for (const v of [0.6, 0.4, 0.8]) {
    await pool.query('UPDATE public.engine_config SET dual_big_face_max_hfrac = $1 WHERE id = 1', [
      v,
    ]);
    const r = await pool.query<{ v: string }>(
      'SELECT dual_big_face_max_hfrac::text AS v FROM public.engine_config WHERE id = 1'
    );
    expect(Number(r.rows[0].v)).toBe(v);
  }
});

it('rejects a value below the giant guard or above the engine clamp', async () => {
  for (const v of [0.3, 0.81, 1.5]) {
    await expect(
      pool.query('UPDATE public.engine_config SET dual_big_face_max_hfrac = $1 WHERE id = 1', [v])
    ).rejects.toThrow(/engine_config_dual_big_face_max_hfrac_range/);
  }
});

it('is idempotent — applying the migration twice is a no-op', async () => {
  await expect(pool.query(migrationSql('524_dual_big_face_max_hfrac.sql'))).resolves.toBeTruthy();
});

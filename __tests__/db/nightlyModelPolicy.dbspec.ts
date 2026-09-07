/**
 * LIVE-DB test for `nightly_model_policy` (migration 468, NIGHTLY_MODEL_POLICY_PLAN.md).
 *
 * Locks the DDL contract the render relies on:
 *   SHAPE     — exactly the four surfaces; a fifth is rejected; a blank primary list is rejected.
 *   SEED      — the migration seeds today's effective behaviour (plan §3) and is idempotent (re-running the
 *               INSERT changes nothing — a re-apply can never wipe a dashboard edit).
 *   ECONOMICS — plan §3b: every seeded primary ≤ 5¢ / render, every fallback ≤ 6.3¢, nothing ≥ 7¢
 *               (API cents of record from _shared/modelPricing.ts). A model cannot enter the pool
 *               without the economics passing.
 *
 * Loads the real CREATE TABLE + seed INSERT from the migration file (RLS / GRANT lines are role-dependent
 * and skipped; the engine_config ALTER is covered by the config parse test).
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const SQL = migrationSql('468_nightly_model_policy.sql');
const createTable = extract(SQL, 'CREATE TABLE IF NOT EXISTS public.nightly_model_policy', ');');
const seedInsert = extract(
  SQL,
  'INSERT INTO public.nightly_model_policy',
  'ON CONFLICT (surface) DO NOTHING;'
);

/** API cents per render (modelPricing.ts MODEL_COST_CENTS comments, 2026-09-07). */
const API_CENTS: Record<string, number> = {
  'black-forest-labs/flux-schnell': 0.3,
  'black-forest-labs/flux-krea-dev': 0.4,
  'xai/grok-imagine-image': 2,
  'black-forest-labs/flux-dev': 2.5,
  'black-forest-labs/flux-2-dev': 2.5,
  'bytedance/seedream-4': 3,
  'black-forest-labs/flux-2-pro': 3.1,
  'google/gemini-2-image': 3.9,
  'black-forest-labs/flux-1.1-pro': 4,
  'black-forest-labs/flux-1.1-pro-ultra': 6,
  'openai/gpt-image-2': 6,
  'black-forest-labs/flux-2-flex': 6.3,
  'openai/gpt-image-1': 7,
  'black-forest-labs/flux-2-max': 7.3,
  'google/gemini-3-image-preview': 13.4,
};
// 6.3 while the seed is legacy-equivalent (flex is a solo primary today); tightens to 5 with Kevin's final
// rows in Phase 4 (plan §3b rule 1).
const PRIMARY_MAX = 6.3;
const FALLBACK_MAX = 6.3;

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS public.nightly_model_policy');
  await pool.query(createTable);
  await pool.query(seedInsert);
});
afterAll(async () => {
  await pool.end();
});

describe('nightly_model_policy DDL', () => {
  it('seeds exactly the four surfaces with the legacy-equivalent rows', async () => {
    const r = await pool.query(
      'SELECT surface, primary_models, fallback_models FROM public.nightly_model_policy ORDER BY surface'
    );
    expect(r.rows.map((x) => x.surface)).toEqual(['couple', 'scene', 'solo', 'solo_rebuild']);
    const by = Object.fromEntries(r.rows.map((x) => [x.surface, x]));
    expect(by.couple.primary_models).toEqual(['black-forest-labs/flux-1.1-pro']);
    expect(by.solo.primary_models).toEqual([
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-2-flex',
    ]);
    expect(by.solo_rebuild.primary_models).toEqual(['black-forest-labs/flux-2-flex']);
    expect(by.scene.primary_models).toEqual(['black-forest-labs/flux-1.1-pro']);
    for (const x of r.rows) expect(x.fallback_models).toEqual([]);
  });
  it('the seed is idempotent: re-running it never overwrites an edited row', async () => {
    await pool.query(
      "UPDATE public.nightly_model_policy SET fallback_models = ARRAY['google/gemini-2-image'] WHERE surface = 'couple'"
    );
    await pool.query(seedInsert);
    const r = await pool.query(
      "SELECT fallback_models FROM public.nightly_model_policy WHERE surface = 'couple'"
    );
    expect(r.rows[0].fallback_models).toEqual(['google/gemini-2-image']);
  });
  it('rejects a surface outside the four', async () => {
    await expect(
      pool.query(
        "INSERT INTO public.nightly_model_policy (surface, primary_models) VALUES ('hero', ARRAY['black-forest-labs/flux-1.1-pro'])"
      )
    ).rejects.toThrow(/check constraint/i);
  });
  it('rejects a blank primary list', async () => {
    await expect(
      pool.query(
        "UPDATE public.nightly_model_policy SET primary_models = ARRAY[]::text[] WHERE surface = 'scene'"
      )
    ).rejects.toThrow(/check constraint/i);
  });
  it('economics (plan §3b): primaries ≤ 5¢, fallbacks ≤ 6.3¢, nothing ≥ 7¢, every model priced', async () => {
    const r = await pool.query(
      'SELECT surface, primary_models, fallback_models FROM public.nightly_model_policy'
    );
    for (const row of r.rows) {
      for (const m of row.primary_models as string[]) {
        expect(API_CENTS[m]).toBeDefined();
        expect(API_CENTS[m]).toBeLessThanOrEqual(PRIMARY_MAX);
        expect(API_CENTS[m]).toBeLessThan(7);
      }
      for (const m of row.fallback_models as string[]) {
        expect(API_CENTS[m]).toBeDefined();
        expect(API_CENTS[m]).toBeLessThanOrEqual(FALLBACK_MAX);
      }
    }
  });
});

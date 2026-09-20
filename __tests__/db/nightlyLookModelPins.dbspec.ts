/**
 * LIVE-DB test for `nightly_look_model_pins` (migration 536).
 *
 * The pin is the ONE place that says "whenever this look rolls on this surface, render it on this model",
 * overriding the policy pool and the nightly cost cap. That makes its DDL contract load-bearing:
 *   SHAPE  — one pin per (look_key, surface); a second pin for the same pair must be impossible, or the
 *            engine's `find()` would silently pick whichever row came back first.
 *   SCOPE  — surface is constrained to the two CAST surfaces. A 'scene' pin is meaningless (no face to carry)
 *            and must be rejected by the database rather than ignored at runtime.
 *   SEED   — the two couple rows Kevin approved, both on Nano Banana Pro, both active.
 *   RE-APPLY — the seed UPSERT sets `active = true`. Since rollback is `active = false`, re-applying this
 *            migration RE-ENABLES the pins. That is asserted below so it is a decision on record rather than a
 *            surprise: to roll back permanently, flip the rows AND do not re-run 536.
 *   FK     — a pin for a look that does not exist is rejected.
 *
 * Loads the real CREATE TABLE + seed INSERT from the migration file (RLS / GRANT / COMMENT lines are
 * role-dependent or inert and are skipped).
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const SQL = migrationSql('536_nightly_look_model_pins.sql');
const createTable = extract(SQL, 'CREATE TABLE IF NOT EXISTS public.nightly_look_model_pins', ');');
const seedInsert = extract(SQL, 'INSERT INTO public.nightly_look_model_pins', 'active = true;');

const NANO_PRO = 'google/gemini-3-image-preview';

beforeAll(async () => {
  // Minimal FK stub: the pin references dream_mediums(key).
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.dream_mediums (key text PRIMARY KEY);
    INSERT INTO public.dream_mediums (key) VALUES
      ('nightly_classical_oil'), ('nightly_colored_pencil'), ('nightly_watercolor_ink')
    ON CONFLICT (key) DO NOTHING;
  `);
  await pool.query(createTable);
  await pool.query(seedInsert);
});

afterAll(async () => {
  await pool.end();
});

describe('nightly_look_model_pins (mig 536)', () => {
  it('seeds exactly the two couple looks Kevin approved, both on Nano Banana Pro and active', async () => {
    const r = await pool.query(
      'SELECT look_key, surface, model, active FROM public.nightly_look_model_pins ORDER BY look_key'
    );
    expect(r.rows).toEqual([
      {
        look_key: 'nightly_classical_oil',
        surface: 'couple',
        model: NANO_PRO,
        active: true,
      },
      {
        look_key: 'nightly_colored_pencil',
        surface: 'couple',
        model: NANO_PRO,
        active: true,
      },
    ]);
  });

  it('pins COUPLES only — the solo surface is deliberately left on its normal roll', async () => {
    const r = await pool.query(
      "SELECT count(*)::int AS n FROM public.nightly_look_model_pins WHERE surface = 'solo'"
    );
    expect(r.rows[0].n).toBe(0);
  });

  it('allows one pin per (look, surface) — a duplicate pair is rejected', async () => {
    await expect(
      pool.query(
        `INSERT INTO public.nightly_look_model_pins (look_key, surface, model)
         VALUES ('nightly_classical_oil', 'couple', 'black-forest-labs/flux-2-flex')`
      )
    ).rejects.toThrow(/duplicate key|unique/i);
  });

  it('accepts a second pin for the SAME look on the OTHER surface', async () => {
    await pool.query(
      `INSERT INTO public.nightly_look_model_pins (look_key, surface, model)
       VALUES ('nightly_classical_oil', 'solo', 'black-forest-labs/flux-1.1-pro')`
    );
    const r = await pool.query(
      "SELECT count(*)::int AS n FROM public.nightly_look_model_pins WHERE look_key = 'nightly_classical_oil'"
    );
    expect(r.rows[0].n).toBe(2);
    await pool.query(
      "DELETE FROM public.nightly_look_model_pins WHERE look_key = 'nightly_classical_oil' AND surface = 'solo'"
    );
  });

  it('rejects a scene pin — a personless scene has no face to carry', async () => {
    await expect(
      pool.query(
        `INSERT INTO public.nightly_look_model_pins (look_key, surface, model)
         VALUES ('nightly_watercolor_ink', 'scene', '${NANO_PRO}')`
      )
    ).rejects.toThrow(/check constraint/i);
  });

  it('rejects a pin for a look that does not exist', async () => {
    await expect(
      pool.query(
        `INSERT INTO public.nightly_look_model_pins (look_key, surface, model)
         VALUES ('no_such_look', 'couple', '${NANO_PRO}')`
      )
    ).rejects.toThrow(/foreign key/i);
  });

  it('re-applying the seed re-activates the pins — rollback is a deliberate re-flip, not a sticky state', async () => {
    await pool.query('UPDATE public.nightly_look_model_pins SET active = false');
    await pool.query(seedInsert);
    const r = await pool.query(
      'SELECT count(*)::int AS n FROM public.nightly_look_model_pins WHERE active'
    );
    expect(r.rows[0].n).toBe(2);
  });
});

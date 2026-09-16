/**
 * FAILSAFE for the drift found 2026-09-16: the share of nightly dreams that render a
 * COMMUNITY SCENARIO instead of the dreamer's own saved place had crept from 40% to
 * 50%, and nobody had decided it.
 *
 * How it happened: the split shipped as 20 goofy / 20 elegant / 0 active (migrations
 * 347 + 348) with `active` dark. When active was later turned on at 20%, goofy and
 * elegant only came down 20 -> 15 each. Twenty points added, ten given back. Measured
 * on a 20-dream organic batch: 44% of dreams rendered Kevin's own places, 56% a
 * community scenario.
 *
 * The lesson this file encodes: the governing number is the TOTAL of the three pools,
 * not any one of them, and a fourth pool added at 15% tomorrow would do it again
 * silently. So every copy of the split in the repo is asserted against ONE ceiling.
 *
 * It checks the DORMANT copies too, deliberately. LOOKS_SCENE_PCTS sat at 60% behind
 * the LOOKS_MINIMAL flag: flipping the looks path on would have tripled the community
 * share with no config change and no stamp. Two separate fixes have already been found
 * dead behind that same flag, so "it isn't running right now" is the reason to check
 * it, not a reason to skip it.
 *
 * Mirrors the botCadence.js pattern: derive from one source, never hardcode the
 * threshold, lock the invariant in CI.
 */
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  SCENARIO_SHARE_CEILING_PCT,
  scenarioTotalPct,
  locationSharePct,
  exceedsCeiling,
} = require('../../scripts/lib/scenarioShare');

const REPO = path.join(__dirname, '..', '..');
const read = (...p: string[]) => fs.readFileSync(path.join(REPO, ...p), 'utf8');

/** Pull `name: <number>` out of a source file. Used to read the committed copies of the
 *  split as DATA, so this test fails when someone edits the number rather than only
 *  when they edit a symbol it imports. */
function numberField(src: string, name: string): number {
  const m = src.match(new RegExp(`${name}\\s*:\\s*(\\d+(?:\\.\\d+)?)`));
  if (!m) throw new Error(`could not find "${name}" — did the field get renamed?`);
  return Number(m[1]);
}

describe('the ceiling itself', () => {
  it('is the number Kevin set, in one place', () => {
    // If this fails, someone changed the product decision. That is allowed — but it has
    // to happen HERE, deliberately, and drag every copy below along with it.
    expect(SCENARIO_SHARE_CEILING_PCT).toBe(20);
  });

  it('flags a split that breaks it, and passes one that does not', () => {
    expect(exceedsCeiling({ goofy: 15, elegant: 15, active: 20 })).toBe(true); // the drifted split
    expect(exceedsCeiling({ goofy: 6, elegant: 6, active: 8 })).toBe(false); // the fixed one
  });

  it('catches a FOURTH pool added without taking the others down — the actual drift', () => {
    // This is the exact shape of the 2026-09-16 regression, replayed: a new pool arrives
    // at a plausible-looking percentage and nothing objects, because every INDIVIDUAL
    // number still looks small. 6 + 6 + 8 each look fine; with a fourth at 15 the
    // dreamer's own places have quietly dropped from 80% to 65%.
    const withNewPool = { goofy: 6, elegant: 6, active: 8, seasonal: 15 };

    // scenarioTotalPct sums EVERY pool it is handed, not a hardcoded three — which is
    // the only way the next occurrence gets caught rather than repeating this one.
    expect(scenarioTotalPct(withNewPool)).toBe(35);
    expect(exceedsCeiling(withNewPool)).toBe(true);
    expect(locationSharePct(withNewPool)).toBe(65);
  });
});

describe('every committed copy of the split respects the ceiling', () => {
  // 1. The engine's fallback, used when the engine_config read fails. Sat at 40% long
  //    after the live row moved.
  it('DEFAULT_ENGINE_CONFIG (dual + single)', () => {
    const src = read('supabase', 'functions', '_shared', 'engineConfig.ts');
    for (const surface of ['dual', 'single'] as const) {
      const S = surface === 'dual' ? 'dualScene' : 'singleScene';
      const pcts = {
        goofy: numberField(src, `${S}GoofyPct`),
        elegant: numberField(src, `${S}ElegantPct`),
        active: numberField(src, `${S}ActivePct`),
      };
      expect({ surface, total: scenarioTotalPct(pcts) }).toEqual({
        surface,
        total: expect.any(Number),
      });
      expect(scenarioTotalPct(pcts)).toBeLessThanOrEqual(SCENARIO_SHARE_CEILING_PCT);
    }
  });

  // 2. The DORMANT looks-path mix. This is the one that was at 60%.
  it('LOOKS_SCENE_PCTS, even though LOOKS_MINIMAL keeps it dormant', () => {
    const src = read('supabase', 'functions', '_shared', 'nightlyLooksPath.ts');
    const block = src.match(/LOOKS_SCENE_PCTS\s*=\s*\{[^}]*\}/);
    expect(block).toBeTruthy();
    const pcts = {
      goofy: numberField(block![0], 'goofy'),
      elegant: numberField(block![0], 'elegant'),
      active: numberField(block![0], 'active'),
    };
    expect(scenarioTotalPct(pcts)).toBeLessThanOrEqual(SCENARIO_SHARE_CEILING_PCT);
    // Round 2 of the parity loop measured elegant > goofy > active. The rescale to the
    // ceiling had to PRESERVE that ordering, not flatten it — if a future edit levels
    // these, the tuning that round measured is gone.
    expect(pcts.elegant).toBeGreaterThan(pcts.goofy);
    expect(pcts.goofy).toBeGreaterThan(pcts.active);
  });

  // 3. The column DEFAULTS a fresh database comes up with.
  it('migration 519 sets the column defaults to the same split', () => {
    const src = read('supabase', 'migrations', '519_scenario_share_ceiling.sql');
    /** `<col>  SET DEFAULT <n>` — SQL, so no colon like the TS copies above. */
    const sqlDefault = (col: string) => {
      const m = src.match(new RegExp(`${col}\\s+SET DEFAULT\\s+(\\d+(?:\\.\\d+)?)`));
      if (!m) throw new Error(`no SET DEFAULT for ${col} in migration 519`);
      return Number(m[1]);
    };
    for (const surface of ['dual', 'single']) {
      const pcts = {
        goofy: sqlDefault(`${surface}_scene_goofy_pct`),
        elegant: sqlDefault(`${surface}_scene_elegant_pct`),
        active: sqlDefault(`${surface}_scene_active_pct`),
      };
      expect(scenarioTotalPct(pcts)).toBeLessThanOrEqual(SCENARIO_SHARE_CEILING_PCT);
    }
  });

  // 3b. The UPDATE that moves the LIVE row must match those defaults, or a fresh
  //     database and production would run different splits from the same migration.
  it('migration 519 sets the live row to the same numbers as the defaults', () => {
    const src = read('supabase', 'migrations', '519_scenario_share_ceiling.sql');
    const update = src.match(/UPDATE public\.engine_config\s+SET([\s\S]*?);/);
    expect(update).toBeTruthy();
    for (const surface of ['dual', 'single']) {
      for (const pool of ['goofy', 'elegant', 'active']) {
        const col = `${surface}_scene_${pool}_pct`;
        const set = update![1].match(new RegExp(`${col}\\s*=\\s*(\\d+(?:\\.\\d+)?)`));
        const def = src.match(new RegExp(`${col}\\s+SET DEFAULT\\s+(\\d+(?:\\.\\d+)?)`));
        expect(set).toBeTruthy();
        expect(Number(set![1])).toBe(Number(def![1]));
      }
    }
  });

  // 4. The database CHECK constraint, which refuses a bad write at the moment it is
  //    made — including a hand-edit in the dashboard SQL editor, which is how the 50%
  //    arrived and which neither CI nor a scheduled check can catch before it has run
  //    for a night. Its number cannot import the JS constant, so this keeps them equal.
  it('the migration CHECK constraint uses the same ceiling number', () => {
    const src = read('supabase', 'migrations', '519_scenario_share_ceiling.sql');
    const guard = src.match(/engine_config_scenario_share_ceiling CHECK \(([\s\S]*?)\) NOT VALID/);
    expect(guard).toBeTruthy();
    const ceilings = [...guard![1].matchAll(/<=\s*(\d+)/g)].map((m) => Number(m[1]));
    expect(ceilings.length).toBe(2); // dual and single
    for (const c of ceilings) expect(c).toBe(SCENARIO_SHARE_CEILING_PCT);
  });
});

describe('what the dreamer actually gets', () => {
  const SPLIT = { goofy: 6, elegant: 6, active: 8 };

  it('their own places on 80% of nights with no holiday armed', () => {
    expect(locationSharePct(SPLIT)).toBeCloseTo(80, 6);
  });

  it('72% while a holiday is armed at 10%, because holiday cuts FIRST', () => {
    // sceneTypeCuts renormalizes the normal distribution into (1 - holidayCut) rather
    // than prepending a fourth absolute cut, so these do NOT simply sum to 30% off.
    expect(locationSharePct(SPLIT, 10)).toBeCloseTo(72, 6);
  });

  it('the drifted split was the 50/44% the batch measured', () => {
    // Regression anchor: this is what production was doing before migration 519, and it
    // is what the numbers should NEVER read again without a deliberate ceiling change.
    expect(locationSharePct({ goofy: 15, elegant: 15, active: 20 })).toBeCloseTo(50, 6);
    expect(locationSharePct({ goofy: 15, elegant: 15, active: 20 }, 10)).toBeCloseTo(45, 6);
  });

  it('never reports a negative or >100 share, whatever it is handed', () => {
    expect(locationSharePct({ goofy: 50, elegant: 50, active: 50 })).toBeLessThanOrEqual(0);
    expect(locationSharePct({ goofy: 0, elegant: 0, active: 0 })).toBe(100);
    expect(locationSharePct({ goofy: 0, elegant: 0, active: 0 }, 100)).toBe(0);
  });
});

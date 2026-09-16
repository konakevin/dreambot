/**
 * PROOF that the nightly engine actually rolls at the percentages we configured.
 *
 * sceneTypeRoll.test.ts already locks the cut MATH, but it does so against example
 * numbers (15/30/70). Every one of those tests still passed while production was
 * quietly handing dreamers a community scenario 56% of the time — because proving the
 * arithmetic is correct says nothing about what the SHIPPED numbers add up to.
 *
 * This file closes that gap. It drives the REAL roll — adaptiveScenePcts →
 * sceneTypeCuts → rollSceneType, the exact chain nightly-dreams/index.ts calls at
 * lines ~2300 and ~2379 — over a large deterministic sample, and asserts the observed
 * distribution is the configured one.
 *
 * SCOPE, stated plainly so nobody mistakes a green run for more than it is: CI cannot
 * read the database, and the database is where the 50% drift actually happened. This
 * proves (a) the roll honours whatever split it is handed, and (b) the split COMMITTED
 * in engineConfig.ts is the one we intend. The live row is guarded separately by
 * scripts/check-scenario-share.js, and by the migration-519 CHECK constraint.
 *
 * The RNG is SEEDED. The existing empirical test uses Math.random() with a loose
 * tolerance; a distribution proof that can flake is not a proof, so this one is
 * deterministic and asserts tightly.
 */
import fs from 'fs';
import path from 'path';

import { sceneTypeCuts, rollSceneType, adaptiveScenePcts } from '@engine/sceneTypeRoll';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SCENARIO_SHARE_CEILING_PCT, RAMP_PLACES } = require('../../scripts/lib/scenarioShare');

/** mulberry32 — a small, fast, well-distributed seeded PRNG. Deterministic across
 *  machines and Node versions, which Math.random() is not. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Run the engine's real roll chain N times and return observed shares (0-1). */
function observe(
  pcts: { goofy: number; elegant: number; active: number },
  opts: {
    placeCount?: number;
    holidayPct?: number;
    activeEnabled?: boolean;
    genderedBoostPct?: number;
    n?: number;
    seed?: number;
  } = {}
) {
  const N = opts.n ?? 200_000;
  const rnd = seeded(opts.seed ?? 12345);
  const cuts = sceneTypeCuts(adaptiveScenePcts(pcts, opts.placeCount ?? RAMP_PLACES), {
    holidayPct: opts.holidayPct ?? 0,
    activeEnabled: opts.activeEnabled !== false,
    genderedBoostPct: opts.genderedBoostPct ?? 0,
  });
  const cnt: Record<string, number> = { holiday: 0, goofy: 0, elegant: 0, active: 0, plain: 0 };
  for (let i = 0; i < N; i++) cnt[rollSceneType(cuts, rnd())]++;
  const share = (k: string) => (cnt[k] / N) * 100;
  return {
    holiday: share('holiday'),
    goofy: share('goofy'),
    elegant: share('elegant'),
    active: share('active'),
    plain: share('plain'),
    community: share('goofy') + share('elegant') + share('active'),
  };
}

/** The split as COMMITTED in the engine's own fallback, read as data so an edit to
 *  those numbers lands here rather than sliding through unnoticed. */
function shippedSplit(surface: 'dual' | 'single') {
  const src = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'engineConfig.ts'),
    'utf8'
  );
  const S = surface === 'dual' ? 'dualScene' : 'singleScene';
  const grab = (field: string) => {
    const m = src.match(new RegExp(`${S}${field}Pct:\\s*(\\d+(?:\\.\\d+)?)`));
    if (!m) throw new Error(`${S}${field}Pct not found in engineConfig.ts`);
    return Number(m[1]);
  };
  return { goofy: grab('Goofy'), elegant: grab('Elegant'), active: grab('Active') };
}

const TOLERANCE = 0.4; // percentage points, at n=200k with a fixed seed

describe.each(['dual', 'single'] as const)('%s surface — the shipped split', (surface) => {
  const split = shippedSplit(surface);

  it('rolls each pool at its configured percentage', () => {
    const got = observe(split);
    expect(got.goofy).toBeCloseTo(split.goofy, -Math.log10(TOLERANCE));
    expect(Math.abs(got.goofy - split.goofy)).toBeLessThan(TOLERANCE);
    expect(Math.abs(got.elegant - split.elegant)).toBeLessThan(TOLERANCE);
    expect(Math.abs(got.active - split.active)).toBeLessThan(TOLERANCE);
  });

  it('gives the dreamer their OWN saved place on ~80% of nights', () => {
    // THE NUMBER THIS WHOLE EFFORT IS ABOUT. Measured at 44% in production on
    // 2026-09-16 before migration 519.
    const got = observe(split);
    expect(got.plain).toBeGreaterThanOrEqual(100 - SCENARIO_SHARE_CEILING_PCT - TOLERANCE);
    expect(got.community).toBeLessThanOrEqual(SCENARIO_SHARE_CEILING_PCT + TOLERANCE);
  });

  it('holiday takes its cut FIRST and renormalizes the rest, it does not simply add', () => {
    // The trap sceneTypeCuts §3.3a exists to avoid: prepending holiday as a fourth
    // absolute cut would push the windows past 1.0 and silently truncate active/plain.
    const got = observe(split, { holidayPct: 10 });
    expect(Math.abs(got.holiday - 10)).toBeLessThan(TOLERANCE);
    // every normal window scaled by 0.9, NOT reduced by 10 points
    expect(Math.abs(got.goofy - split.goofy * 0.9)).toBeLessThan(TOLERANCE);
    expect(Math.abs(got.community - SCENARIO_SHARE_CEILING_PCT * 0.9)).toBeLessThan(TOLERANCE);
    expect(Math.abs(got.plain - 72)).toBeLessThan(TOLERANCE);
  });

  it('an empty active pool folds active into the dreamer’s places, never into another pool', () => {
    const got = observe(split, { activeEnabled: false });
    expect(got.active).toBe(0);
    expect(Math.abs(got.plain - (100 - split.goofy - split.elegant))).toBeLessThan(TOLERANCE);
  });
});

describe('the adaptive ramp still behaves as designed', () => {
  const split = shippedSplit('dual');

  it('a dreamer at or above the ramp gets the full location share', () => {
    const atRamp = observe(split, { placeCount: RAMP_PLACES });
    const wayAbove = observe(split, { placeCount: 90 }); // Kevin has 90
    expect(Math.abs(atRamp.plain - wayAbove.plain)).toBeLessThan(TOLERANCE);
    expect(atRamp.plain).toBeGreaterThan(100 - SCENARIO_SHARE_CEILING_PCT - TOLERANCE);
  });

  it('a dreamer with ONE saved place deliberately gets more scenarios, not the same place nightly', () => {
    // This is intended behaviour, not a leak in the ceiling: adaptiveScenePcts scales
    // the scenario window UP below the ramp so a lone pick is not served every night.
    // Asserted so nobody "fixes" it later thinking it breaks the 20%.
    const one = observe(split, { placeCount: 1 });
    expect(one.community).toBeGreaterThan(SCENARIO_SHARE_CEILING_PCT);
    expect(one.plain).toBeGreaterThan(0);
  });

  it('a dreamer who unselected everything never gets a place-less backdrop', () => {
    const none = observe(split, { placeCount: 0 });
    expect(none.plain).toBe(0);
    expect(Math.abs(none.community - 100)).toBeLessThan(TOLERANCE);
  });
});

describe('the invariant holds for ANY split that respects the ceiling', () => {
  // Stronger than pinning today's numbers: whatever the three pools are, if they total
  // at or under the ceiling then a dreamer at the ramp must get their places at least
  // (100 - ceiling)% of the time. This keeps passing if the split is re-weighted, and
  // fails the moment the TOTAL is what moved.
  const CANDIDATES = [
    { goofy: 6, elegant: 6, active: 8 },
    { goofy: 7, elegant: 8, active: 5 }, // the looks-path mix
    { goofy: 20, elegant: 0, active: 0 },
    { goofy: 0, elegant: 0, active: 20 },
    { goofy: 5, elegant: 5, active: 5 },
    { goofy: 0, elegant: 0, active: 0 },
  ];

  it.each(CANDIDATES)('split %j keeps the dreamer’s places at or above the floor', (split) => {
    expect(split.goofy + split.elegant + split.active).toBeLessThanOrEqual(
      SCENARIO_SHARE_CEILING_PCT
    );
    const got = observe(split, { n: 100_000 });
    expect(got.plain).toBeGreaterThanOrEqual(100 - SCENARIO_SHARE_CEILING_PCT - TOLERANCE);
  });

  it('and FAILS for the split that was actually live — the regression anchor', () => {
    const drifted = { goofy: 15, elegant: 15, active: 20 };
    const got = observe(drifted);
    expect(got.community).toBeGreaterThan(SCENARIO_SHARE_CEILING_PCT);
    expect(Math.abs(got.plain - 50)).toBeLessThan(TOLERANCE);
  });
});

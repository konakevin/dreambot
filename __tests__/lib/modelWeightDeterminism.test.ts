/**
 * THE CONFIGURED NUMBER IS THE SHARE YOU GET.
 *
 * This is the guarantee the nightly model split did not have until 2026-09-17. The roll used a hardcoded
 * `PRIMARY_DIRECT_SHARE` — 50% straight to the first primary, the rest uniform — and never read
 * `nightly_model_policy.primary_weights` at all. Those weights were nonetheless SET in the dashboard,
 * deliberately, and had been for weeks:
 *
 *     couple   primary_weights [51, 49]   actually rendering 75 / 25
 *     solo     primary_weights [67, 33]   actually rendering 75 / 25
 *
 * So the control surface lied. Someone read the row, believed it, and the engine did something else. That is
 * worse than having no knob, because nothing looks broken.
 *
 * These tests drive the REAL roll (buildStyleContract, the function nightly actually calls) over a large
 * deterministic sample and assert the observed distribution matches the configured weights. If anyone
 * reintroduces a hardcoded share, or stops reading the row, the numbers move and this goes red.
 *
 * Seeded RNG, not Math.random: a distribution proof that can flake is not a proof.
 */
import { buildStyleContract } from '@engine/nightlyStyle';
import type { NightlyModelPolicy } from '@engine/nightlyModelPolicy';
import type { LookApproval, LookRow } from '@engine/nightlyLooks';

const PRO = 'black-forest-labs/flux-1.1-pro';
const GEMINI = 'google/gemini-2-image';
const SEED45 = 'bytedance/seedream-4.5';
const FLEX = 'black-forest-labs/flux-2-flex';

/** mulberry32 — deterministic across machines and Node versions. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LOOKS: LookRow[] = [
  {
    key: 'oil',
    label: 'oil',
    family: 'painted_realism',
    fragment: 'oil scene',
    swapFragment: 'oil swap',
    directive: 'oil directive',
    weight: 1,
    active: true,
    nightlyEnabled: true,
  },
];
/** Approve the one look on every surface for every model, so the look roll never narrows the pool and the
 *  only thing deciding the model is the weighting under test. */
const approvalsFor = (models: string[]): LookApproval[] =>
  models.flatMap((m) =>
    (['couple', 'solo'] as const).map((surface) => ({
      lookKey: 'oil',
      model: m,
      surface,
      approved: true,
    }))
  );

function policyFor(models: string[], weights?: number[]): NightlyModelPolicy {
  const row = { primaryModels: models, fallbackModels: [], primaryWeights: weights };
  return {
    couple: row,
    solo: row,
    solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
    scene: row,
  } as NightlyModelPolicy;
}

/** Run the real contract builder N times and return each model's observed share, as percentages. */
function observedShares(
  models: string[],
  weights: number[] | undefined,
  opts: { n?: number; seed?: number; surface?: 'couple' | 'solo' } = {}
): Record<string, number> {
  const N = opts.n ?? 60_000;
  const rng = seeded(opts.seed ?? 20260917);
  const counts: Record<string, number> = {};
  for (let i = 0; i < N; i++) {
    const c = buildStyleContract({
      surface: opts.surface ?? 'couple',
      policy: policyFor(models, weights),
      looks: LOOKS,
      approvals: approvalsFor(models),
      modelFromLook: true,
      rng,
    });
    if (c) counts[c.model] = (counts[c.model] ?? 0) + 1;
  }
  const out: Record<string, number> = {};
  for (const m of models) out[m] = ((counts[m] ?? 0) / N) * 100;
  return out;
}

const TOLERANCE = 1.0; // percentage points at n=60k

describe('the weights in the database ARE the shares that render', () => {
  it('75 / 25 renders 75 / 25', () => {
    const s = observedShares([PRO, GEMINI], [75, 25]);
    expect(Math.abs(s[PRO] - 75)).toBeLessThan(TOLERANCE);
    expect(Math.abs(s[GEMINI] - 25)).toBeLessThan(TOLERANCE);
  });

  it('the values that were ALREADY in the database now actually apply', () => {
    // couple was [51, 49] while rendering 75/25. It renders 51/49 now.
    const couple = observedShares([PRO, GEMINI], [51, 49]);
    expect(Math.abs(couple[PRO] - 51)).toBeLessThan(TOLERANCE);
    expect(Math.abs(couple[GEMINI] - 49)).toBeLessThan(TOLERANCE);
    // solo was [67, 33], also rendering 75/25.
    const solo = observedShares([PRO, GEMINI], [67, 33], { surface: 'solo' });
    expect(Math.abs(solo[PRO] - 67)).toBeLessThan(TOLERANCE);
    expect(Math.abs(solo[GEMINI] - 33)).toBeLessThan(TOLERANCE);
  });

  it('adding a THIRD model takes only from where the weights say', () => {
    // The question that prompted this: "throw seedream 4.5 in, similar proportion to gemini 2".
    const s = observedShares([PRO, GEMINI, SEED45], [70, 15, 15]);
    expect(Math.abs(s[PRO] - 70)).toBeLessThan(TOLERANCE);
    expect(Math.abs(s[GEMINI] - 15)).toBeLessThan(TOLERANCE);
    expect(Math.abs(s[SEED45] - 15)).toBeLessThan(TOLERANCE);
  });

  it('weights need not sum to 100 — they are ratios', () => {
    // 3:1 is the same split as 75:25, so nobody has to make the row add up.
    const s = observedShares([PRO, GEMINI], [3, 1]);
    expect(Math.abs(s[PRO] - 75)).toBeLessThan(TOLERANCE);
  });

  it('a ZERO weight means never — the way to bench a model without deleting the row', () => {
    const s = observedShares([PRO, GEMINI, SEED45], [50, 50, 0]);
    expect(s[SEED45]).toBe(0);
    expect(Math.abs(s[PRO] - 50)).toBeLessThan(TOLERANCE);
  });

  it('NO weights configured falls back to an even split, never to a silent skew', () => {
    const s = observedShares([PRO, GEMINI, SEED45], undefined);
    for (const m of [PRO, GEMINI, SEED45]) expect(Math.abs(s[m] - 33.3)).toBeLessThan(TOLERANCE);
  });

  it('is reproducible — the same seed gives the same distribution twice', () => {
    // "Deterministic" in the sense that matters: the split is a property of the configuration, not of when
    // you happened to look.
    const a = observedShares([PRO, GEMINI], [60, 40], { seed: 7, n: 20_000 });
    const b = observedShares([PRO, GEMINI], [60, 40], { seed: 7, n: 20_000 });
    expect(a).toEqual(b);
  });

  it('and is not an artifact of one seed', () => {
    for (const seed of [1, 99, 12345]) {
      const s = observedShares([PRO, GEMINI], [60, 40], { seed, n: 30_000 });
      expect(Math.abs(s[PRO] - 60)).toBeLessThan(1.5);
    }
  });
});

describe('the regression this file exists for', () => {
  it('the old hardcoded behaviour is NOT what happens any more', () => {
    // Under PRIMARY_DIRECT_SHARE = 0.5, a two-model pool rendered 75/25 NO MATTER what the row said.
    // If that ever comes back, these weights would produce 75/25 instead of 51/49 and this fails.
    const s = observedShares([PRO, GEMINI], [51, 49]);
    expect(Math.abs(s[PRO] - 75)).toBeGreaterThan(20);
  });
});

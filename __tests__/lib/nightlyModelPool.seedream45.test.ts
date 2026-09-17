/**
 * seedream-4.5 in the nightly cast pool (migration 521, Kevin 2026-09-17 "option B").
 *
 * This locks the two things that would silently go wrong, both of which have precedent here:
 *
 * 1. THE PRICE. `ai_generation_log.cost_cents` is how the whole unit-economics picture is built, and a
 *    model missing from MODEL_COST_CENTS falls back to DEFAULT_COST_CENTS (5) — which would quietly
 *    overstate 4.5 by 25% on every render it takes. 4.5 is NOT a cheaper 4: measured at ~$0.040, the
 *    same as flux-1.1-pro, against seedream-4's ~$0.030.
 *
 * 2. THE SPARKLE CHARGE. If a model's sparkle cost and its real cost drift apart, the pricing model
 *    breaks — that is exactly how a per-render denominator made the Whale pack look unprofitable
 *    earlier the same day. 4.5 costs what a 1-sparkle model costs, so it charges 1.
 *
 * The SPLIT itself is deliberately NOT asserted here. It is data in nightly_model_policy now, tunable
 * without a deploy, and a test that pins it would just have to be edited every time Kevin moves a slider.
 * What IS locked, in modelWeightDeterminism.test.ts, is that whatever number the row holds is the share
 * that actually renders.
 */
import { MODEL_SPARKLE_COSTS, MODEL_COST_CENTS } from '@engine/modelPricing';

const SEED45 = 'bytedance/seedream-4.5';
const SEED4 = 'bytedance/seedream-4';
const FLUX = 'black-forest-labs/flux-1.1-pro';

describe('seedream-4.5 is priced, not defaulted', () => {
  it('has an explicit sparkle cost', () => {
    expect(MODEL_SPARKLE_COSTS[SEED45]).toBe(1);
  });

  it('has an explicit API cost — 4 cents, the same as flux-1.1-pro', () => {
    // Measured from the Replicate dashboard (Kevin, 2026-09-17), NOT estimated.
    expect(MODEL_COST_CENTS[SEED45]).toBe(4);
    expect(MODEL_COST_CENTS[SEED45]).toBe(MODEL_COST_CENTS[FLUX]);
  });

  it('is NOT assumed to be as cheap as seedream-4 — that was the tempting mistake', () => {
    // The two have near-identical schemas and adjacent names; 4.5 costs a third more because it cannot
    // render below 3.69MP while 4 runs at 1K.
    expect(MODEL_COST_CENTS[SEED45]).toBeGreaterThan(MODEL_COST_CENTS[SEED4]);
  });

  it('charges 1 sparkle, consistent with every other ~4-cent model', () => {
    // The sparkle tiers are cost bands. A 4-cent model sitting in a 2-sparkle tier would overcharge;
    // a 7-cent model at 1 sparkle would lose money. This keeps 4.5 in the band its cost puts it in.
    const oneSparkle = Object.keys(MODEL_SPARKLE_COSTS).filter((m) => MODEL_SPARKLE_COSTS[m] === 1);
    for (const m of oneSparkle) {
      if (MODEL_COST_CENTS[m] === undefined) continue;
      expect(MODEL_COST_CENTS[m]).toBeLessThanOrEqual(5);
    }
    expect(oneSparkle).toContain(SEED45);
  });
});

describe('migration 521 wires it the way the engine expects', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  const SRC: string = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'migrations', '521_seedream_45_nightly_pool.sql'),
    'utf8'
  );

  it('adds it to the CAST surfaces only — scene was never evaluated on it', () => {
    expect(SRC).toContain("WHERE surface IN ('solo', 'couple')");
    expect(SRC).not.toMatch(/surface\s*=\s*'scene'/);
  });

  it('sets models and weights together, so the arrays cannot drift out of alignment', () => {
    // weightedList pairs them by INDEX. A row whose weights array is shorter than its models array
    // silently falls back to equal weights — the split would look configured and not be.
    const models = SRC.match(/primary_models = ARRAY\[([\s\S]*?)\]/);
    const weights = SRC.match(/primary_weights = ARRAY\[([\s\S]*?)\]/);
    expect(models).toBeTruthy();
    expect(weights).toBeTruthy();
    const nModels = (models![1].match(/'/g) || []).length / 2;
    const nWeights = weights![1].split(',').length;
    expect(nWeights).toBe(nModels);
  });

  it('keeps it OUT of the user-facing picker', () => {
    // is_active = false. Users would otherwise be able to spend sparkles on the slowest, least reliable
    // model in the catalogue. loadModelCosts() reads image_models without an is_active filter, so the
    // row still supplies the price.
    expect(SRC).toMatch(/false,\s*--\s*INVISIBLE to the user-facing model picker/);
  });
});

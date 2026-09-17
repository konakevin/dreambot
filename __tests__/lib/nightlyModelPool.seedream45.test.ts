/**
 * seedream-4.5 — PRICED but NOT in the nightly pool (migration 521 in, 522 back out the same hour).
 *
 * Kevin removed it on the renders: busy, incoherent scenes, and his face drifting to an older
 * grey-bearded man — the flux age-drift defect appearing on a model that was supposed not to have it.
 * The measured numbers were fine (0 of 8 couples degraded, better than flux) and were not the reason.
 *
 * The pricing assertions below still matter and are the point of keeping this file: the model stays
 * PLUMBED and PRICED so a future render logs a true cost instead of falling back to DEFAULT_COST_CENTS,
 * and so re-adding it later does not mean rediscovering its 3.69MP floor.
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

describe('migration 521 wired it the way the engine expects (kept as the record)', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  const SRC: string = fs.readFileSync(
    path.join(__dirname, '..', '..', 'supabase', 'migrations', '521_seedream_45_nightly_pool.sql'),
    'utf8'
  );

  it('touched the CAST surfaces only — scene was never evaluated on it', () => {
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

describe('migration 522 took it back out', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs2 = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path2 = require('path');
  const OUT: string = fs2.readFileSync(
    path2.join(
      __dirname,
      '..',
      '..',
      'supabase',
      'migrations',
      '522_seedream_45_out_of_nightly.sql'
    ),
    'utf8'
  );

  it('leaves only flux and gemini-2 on the cast surfaces', () => {
    const models = OUT.match(/primary_models = ARRAY\[([\s\S]*?)\]/);
    expect(models).toBeTruthy();
    expect(models![1]).not.toContain('seedream');
    expect(models![1]).toContain('flux-1.1-pro');
    expect(models![1]).toContain('gemini-2-image');
  });

  it('keeps models and weights the same length', () => {
    // weightedList pairs them by INDEX; a short weights array silently falls back to equal weights, so
    // the split would read as configured and not be. Same guard as 521.
    const models = OUT.match(/primary_models = ARRAY\[([\s\S]*?)\]/);
    const weights = OUT.match(/primary_weights = ARRAY\[([\s\S]*?)\]/);
    const nModels = (models![1].match(/'/g) || []).length / 2;
    expect(weights![1].split(',').length).toBe(nModels);
  });

  it('keeps the model PRICED even though it no longer renders', () => {
    // The image_models row and the static maps stay: an unpriced model falls back to DEFAULT_COST_CENTS
    // and would quietly overstate any future render by 25%.
    expect(MODEL_COST_CENTS[SEED45]).toBe(4);
    expect(MODEL_SPARKLE_COSTS[SEED45]).toBe(1);
  });
});

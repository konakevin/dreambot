/**
 * modelPricing — server-side sparkle/API cost lookups + tier classification.
 * Tests the static-fallback path (no DB cache loaded), which is what runs when
 * image_models is empty/unreachable. The DB overlay is an integration concern.
 */
import {
  getSparkleCost,
  getCostCents,
  getModelTier,
  MODEL_SPARKLE_COSTS,
} from '@engine/modelPricing';
import { IMAGE_MODELS, sparkleCostFrom } from '@/constants/imageModels';

describe('getSparkleCost', () => {
  it('prices the default model (Flux 1.1 Pro) at 1', () => {
    expect(getSparkleCost('black-forest-labs/flux-1.1-pro')).toBe(1);
  });

  it('prices the premium outlier (Nano Banana Pro) at 5', () => {
    expect(getSparkleCost('google/gemini-3-image-preview')).toBe(5);
  });

  it('prices the mid tiers correctly (GPT Image 1 = 3, GPT Image 2 = 2)', () => {
    expect(getSparkleCost('openai/gpt-image-1')).toBe(3);
    expect(getSparkleCost('openai/gpt-image-2')).toBe(2);
  });

  it('defaults unknown / empty model ids to 1 (DreamBot mode passes no model)', () => {
    expect(getSparkleCost('')).toBe(1);
    expect(getSparkleCost('totally-made-up/model')).toBe(1);
  });

  it('never charges more for a cheaper model — costs are cost-monotonic', () => {
    // Every cheap-cluster model is 1; nothing in the catalog is priced below
    // a strictly-cheaper one.
    expect(getSparkleCost('black-forest-labs/flux-2-pro')).toBeLessThanOrEqual(
      getSparkleCost('black-forest-labs/flux-1.1-pro-ultra')
    );
    expect(getSparkleCost('black-forest-labs/flux-1.1-pro-ultra')).toBeLessThanOrEqual(
      getSparkleCost('black-forest-labs/flux-2-max')
    );
  });

  it('only ever returns the four valid sparkle tiers', () => {
    for (const cost of Object.values(MODEL_SPARKLE_COSTS)) {
      expect([1, 2, 3, 5]).toContain(cost);
    }
  });
});

describe('getCostCents', () => {
  it('returns the logged API cost for a known model', () => {
    expect(getCostCents('black-forest-labs/flux-1.1-pro')).toBe(4);
  });
  it('falls back to the default for unknown models', () => {
    expect(getCostCents('totally-made-up/model')).toBe(5);
  });
});

// L12: the cost the create screen DISPLAYS must equal the cost the server
// CHARGES for the same model. The live path already shares image_models (the
// client's useImageModels + the server's loadModelCosts both read it), and the
// create screen always forces the selected model. This locks the OFFLINE
// FALLBACK too: the client IMAGE_MODELS catalog must price every model the same
// as the server MODEL_SPARKLE_COSTS, so a DB-unavailable render still charges
// exactly what was shown.
describe('client/server sparkle-cost parity (display == charge)', () => {
  it('every client IMAGE_MODELS cost matches the server charge for that model', () => {
    for (const m of IMAGE_MODELS) {
      // client display cost (offline fallback) === server charged cost (offline fallback)
      expect(getSparkleCost(m.id)).toBe(m.sparkleCost);
      expect(sparkleCostFrom(IMAGE_MODELS, m.id)).toBe(m.sparkleCost);
      if (m.id in MODEL_SPARKLE_COSTS) {
        expect(MODEL_SPARKLE_COSTS[m.id]).toBe(m.sparkleCost);
      }
    }
  });
});

describe('getModelTier', () => {
  it('maps sparkle cost to tier name', () => {
    expect(getModelTier('black-forest-labs/flux-1.1-pro')).toBe('basic'); // 1
    expect(getModelTier('openai/gpt-image-2')).toBe('standard'); // 2
    expect(getModelTier('openai/gpt-image-1')).toBe('pro'); // 3
    expect(getModelTier('google/gemini-3-image-preview')).toBe('max'); // 5
  });
});

/**
 * constants/imageModels — client-side catalog + cost lookups. sparkleCostFrom
 * is what the Create/DLT buttons + the balance pre-check use against the
 * (DB-driven) live catalog, so it must mirror the server: no model → 1 sparkle.
 */
import {
  IMAGE_MODELS,
  DEFAULT_MODEL_ID,
  getSparkleCost,
  sparkleCostFrom,
  lowestPricedModel,
  findModel,
} from '@/constants/imageModels';

const CAT = [
  { id: 'a', sparkleCost: 2 },
  { id: 'b', sparkleCost: 1 },
  { id: 'c', sparkleCost: 1 },
  { id: 'd', sparkleCost: 3 },
];

describe('lowestPricedModel (client — DreamSmart auto-swap target)', () => {
  it('picks the cheapest id (min cost)', () => {
    expect(lowestPricedModel(['a', 'b', 'c', 'd'], CAT)).toBe('b');
    expect(lowestPricedModel(['a', 'd'], CAT)).toBe('a');
  });
  it('tie → picks the model shown FIRST in the picker (display order), not array order', () => {
    // gemini is first in the array, but flux-2-pro appears earlier in the picker
    // (both 1✦) — the auto-select must land on what the user sees first.
    expect(
      lowestPricedModel(['google/gemini-2-image', 'black-forest-labs/flux-2-pro'], IMAGE_MODELS)
    ).toBe('black-forest-labs/flux-2-pro');
  });
  it('tie among ids outside the picker order → stable array order', () => {
    expect(lowestPricedModel(['c', 'b'], CAT)).toBe('c'); // both 1✦, neither in display order
  });
  it('returns undefined for an empty set', () => {
    expect(lowestPricedModel([], CAT)).toBeUndefined();
  });
});

describe('sparkleCostFrom', () => {
  it('returns 1 for no model id (DreamBot mode)', () => {
    expect(sparkleCostFrom(IMAGE_MODELS, null)).toBe(1);
    expect(sparkleCostFrom(IMAGE_MODELS, undefined)).toBe(1);
  });

  it('returns the catalog cost for a known model', () => {
    expect(sparkleCostFrom(IMAGE_MODELS, 'black-forest-labs/flux-1.1-pro')).toBe(1);
    expect(sparkleCostFrom(IMAGE_MODELS, 'google/gemini-3-image-preview')).toBe(5);
  });

  it('returns 1 for a model not in the catalog', () => {
    expect(sparkleCostFrom(IMAGE_MODELS, 'made-up/model')).toBe(1);
  });

  it('falls back to 1 against an empty catalog (RPC not resolved yet)', () => {
    expect(sparkleCostFrom([], 'black-forest-labs/flux-1.1-pro')).toBe(1);
  });

  it('reads cost from whatever catalog is passed (server-driven prices)', () => {
    const liveCatalog = [{ id: 'x/y', sparkleCost: 4 }];
    expect(sparkleCostFrom(liveCatalog, 'x/y')).toBe(4);
  });
});

describe('bundled catalog (offline fallback)', () => {
  it('contains the default model and it is findable', () => {
    expect(findModel(DEFAULT_MODEL_ID)).toBeDefined();
  });

  it('getSparkleCost(null) is 1', () => {
    expect(getSparkleCost(null)).toBe(1);
  });

  it('every bundled model uses a valid sparkle tier', () => {
    for (const m of IMAGE_MODELS) {
      expect([1, 2, 3, 5]).toContain(m.sparkleCost);
    }
  });
});

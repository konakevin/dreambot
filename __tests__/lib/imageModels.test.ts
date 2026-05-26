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
  findModel,
} from '@/constants/imageModels';

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

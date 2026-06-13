/**
 * Tests for chaosTier — verifies the chaos-tier helper + the dream-type
 * roller behave per Kevin's mig-239 spec:
 *
 *   - getChaosTier: <0.4 low, 0.4..<0.7 mid, ≥0.7 high
 *   - embodied subset: lego+pixels at mid, +handcrafted at high, none at low
 *   - extra models: flux-2-pro at mid, flux-2-pro/flex/max at high
 *   - face-swap: 70% share split 60/20/20 dual/self/+1 (collapses to 100%
 *     self when no +1)
 *   - scene-territory: chaos-gated embodied roll, else 50/50 pure_scene
 *     vs epic_tiny (pure_scene only when no cast)
 *   - first-dream override: deterministic dual → self → pure_scene cascade
 *     based on cast availability, NO embodied regardless of chaos
 *   - mapDreamTypeToInputs: dream type → (medium token, force cast, force composition)
 */

import {
  getChaosTier,
  embodiedRateForTier,
  embodiedMediumsForTier,
  extraModelsForTier,
  rollNightlyDreamType,
  mapDreamTypeToInputs,
  type ChaosConfig,
  type NightlyDreamType,
} from '@engine/chaosTier';

const CFG: ChaosConfig = {
  low: 0.4,
  high: 0.7,
  embodied_low: 0,
  embodied_mid: 0.333,
  embodied_high: 0.5,
  embodied_mediums_mid: ['lego', 'pixels'],
  embodied_mediums_high: ['lego', 'pixels', 'handcrafted'],
  extra_models_mid: ['black-forest-labs/flux-2-pro'],
  extra_models_high: [
    'black-forest-labs/flux-2-pro',
    'black-forest-labs/flux-2-flex',
    'black-forest-labs/flux-2-max',
  ],
  face_swap_share: 0.7,
  face_swap_share_with_plus_one: 0.9,
  face_swap_dual_rate: 0.6,
  face_swap_self_rate: 0.2,
};

describe('getChaosTier', () => {
  it('returns low for values below the low threshold', () => {
    expect(getChaosTier(0, CFG)).toBe('low');
    expect(getChaosTier(0.1, CFG)).toBe('low');
    expect(getChaosTier(0.399, CFG)).toBe('low');
  });

  it('returns mid for values between low and high thresholds', () => {
    expect(getChaosTier(0.4, CFG)).toBe('mid');
    expect(getChaosTier(0.5, CFG)).toBe('mid');
    expect(getChaosTier(0.699, CFG)).toBe('mid');
  });

  it('returns high for values at or above the high threshold', () => {
    expect(getChaosTier(0.7, CFG)).toBe('high');
    expect(getChaosTier(0.85, CFG)).toBe('high');
    expect(getChaosTier(1, CFG)).toBe('high');
  });

  it('defaults missing chaos value to mid (0.5)', () => {
    expect(getChaosTier(undefined, CFG)).toBe('mid');
    expect(getChaosTier(null, CFG)).toBe('mid');
    expect(getChaosTier(NaN, CFG)).toBe('mid');
  });
});

describe('per-tier subsets', () => {
  it('low tier: 0% embodied, no subset, no extra models', () => {
    expect(embodiedRateForTier('low', CFG)).toBe(0);
    expect(embodiedMediumsForTier('low', CFG)).toEqual([]);
    expect(extraModelsForTier('low', CFG)).toEqual([]);
  });

  it('mid tier: lego+pixels, flux-2-pro extra', () => {
    expect(embodiedRateForTier('mid', CFG)).toBe(0.333);
    expect(embodiedMediumsForTier('mid', CFG)).toEqual(['lego', 'pixels']);
    expect(extraModelsForTier('mid', CFG)).toEqual(['black-forest-labs/flux-2-pro']);
  });

  it('high tier: lego+pixels+handcrafted, flux-2 family extras', () => {
    expect(embodiedRateForTier('high', CFG)).toBe(0.5);
    expect(embodiedMediumsForTier('high', CFG)).toEqual(['lego', 'pixels', 'handcrafted']);
    expect(extraModelsForTier('high', CFG)).toEqual([
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-2-flex',
      'black-forest-labs/flux-2-max',
    ]);
  });
});

describe('rollNightlyDreamType (regular flow)', () => {
  // Stub Math.random to step through the branches deterministically.
  const seq = (...values: number[]) => {
    let i = 0;
    return jest.spyOn(Math, 'random').mockImplementation(() => values[i++ % values.length]);
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hasSelf + hasPlusOne: 60% dual share (first random=0.0 lands face-swap, second=0.0 lands dual)', () => {
    seq(0.0, 0.0); // face-swap roll (0.0 < 0.7), then dual roll (0.0 < 0.6)
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: true, tier: 'low', cfg: CFG })).toBe(
      'face_swap_dual'
    );
  });

  it('hasSelf + hasPlusOne: self share (face-swap roll lands, second=0.65 lands self)', () => {
    seq(0.0, 0.65); // 0.0 < 0.7 face-swap, 0.65 between 0.6 and 0.8 → self
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: true, tier: 'low', cfg: CFG })).toBe(
      'face_swap_self'
    );
  });

  it('hasSelf + hasPlusOne: +1 share (face-swap roll lands, second=0.9 lands +1)', () => {
    seq(0.0, 0.9); // 0.0 < 0.7 face-swap, 0.9 > 0.8 → +1
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: true, tier: 'low', cfg: CFG })).toBe(
      'face_swap_plus_one'
    );
  });

  it('hasSelf only: 100% face_swap_self in the face-swap branch', () => {
    seq(0.0); // face-swap roll lands
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: false, tier: 'mid', cfg: CFG })).toBe(
      'face_swap_self'
    );
  });

  it('conditional share boundary: a 0.85 roll lands face-swap WITH a +1 (0.85 < 0.9)', () => {
    seq(0.85, 0.0); // 0.85 < 0.9 face-swap (with +1), then 0.0 < 0.6 dual
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: true, tier: 'low', cfg: CFG })).toBe(
      'face_swap_dual'
    );
  });

  it('conditional share boundary: the same 0.85 roll lands SCENE for self-only (0.85 > 0.7)', () => {
    seq(0.85, 0.0, 0.0); // 0.85 > 0.7 → scene branch, embodied=no (low), 0.0 < 0.5 pure_scene
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: false, tier: 'low', cfg: CFG })).toBe(
      'pure_scene'
    );
  });

  it('scene-territory low: 0% embodied, 50/50 pure_scene vs epic_tiny', () => {
    seq(0.99, 0.0, 0.0); // 0.99 > 0.7 face-swap (scene branch), 0.0 embodied (low=0%, never), 0.0 < 0.5 pure_scene
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: false, tier: 'low', cfg: CFG })).toBe(
      'pure_scene'
    );
  });

  it('scene-territory low: epic_tiny when the 50/50 lands above', () => {
    seq(0.99, 0.0, 0.99); // scene branch, embodied=no, 0.99 ≥ 0.5 epic_tiny
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: false, tier: 'low', cfg: CFG })).toBe(
      'epic_tiny'
    );
  });

  it('scene-territory mid: embodied when embodied roll lands', () => {
    seq(0.99, 0.0); // scene branch, 0.0 < 0.333 embodied rate
    expect(rollNightlyDreamType({ hasSelf: true, hasPlusOne: true, tier: 'mid', cfg: CFG })).toBe(
      'embodied'
    );
  });

  it('no cast: skips face-swap entirely', () => {
    seq(0.99, 0.99); // (no cast bypasses face-swap), 0.99 > embodied rate, pure_scene fallback
    expect(rollNightlyDreamType({ hasSelf: false, hasPlusOne: false, tier: 'mid', cfg: CFG })).toBe(
      'pure_scene'
    );
  });

  it('no cast: embodied still fires at mid/high tier', () => {
    seq(0.0); // 0.0 < 0.333 embodied
    expect(
      rollNightlyDreamType({ hasSelf: false, hasPlusOne: false, tier: 'high', cfg: CFG })
    ).toBe('embodied');
  });
});

describe('rollNightlyDreamType (first-dream override)', () => {
  it('hasSelf + hasPlusOne: forces dual face swap', () => {
    expect(
      rollNightlyDreamType({
        hasSelf: true,
        hasPlusOne: true,
        tier: 'low',
        cfg: CFG,
        isFirstDream: true,
      })
    ).toBe('face_swap_dual');
  });

  it('hasSelf only: forces single self face swap', () => {
    expect(
      rollNightlyDreamType({
        hasSelf: true,
        hasPlusOne: false,
        tier: 'high',
        cfg: CFG,
        isFirstDream: true,
      })
    ).toBe('face_swap_self');
  });

  it('no cast: forces pure_scene (NO embodied regardless of chaos)', () => {
    expect(
      rollNightlyDreamType({
        hasSelf: false,
        hasPlusOne: false,
        tier: 'high',
        cfg: CFG,
        isFirstDream: true,
      })
    ).toBe('pure_scene');
  });

  it('no cast, low chaos: still pure_scene', () => {
    expect(
      rollNightlyDreamType({
        hasSelf: false,
        hasPlusOne: false,
        tier: 'low',
        cfg: CFG,
        isFirstDream: true,
      })
    ).toBe('pure_scene');
  });
});

describe('mapDreamTypeToInputs', () => {
  it('face_swap_dual → face-swap token, dual cast role, character composition', () => {
    expect(mapDreamTypeToInputs('face_swap_dual', 'low', CFG)).toEqual({
      mediumToken: 'dream_eligible_face_swap',
      forceCastRole: 'dual',
      forceComposition: 'character',
    });
  });

  it('face_swap_self → face-swap token, self cast role, character composition', () => {
    expect(mapDreamTypeToInputs('face_swap_self', 'mid', CFG)).toEqual({
      mediumToken: 'dream_eligible_face_swap',
      forceCastRole: 'self',
      forceComposition: 'character',
    });
  });

  it('face_swap_plus_one → face-swap token, plus_one cast role, character composition', () => {
    expect(mapDreamTypeToInputs('face_swap_plus_one', 'high', CFG)).toEqual({
      mediumToken: 'dream_eligible_face_swap',
      forceCastRole: 'plus_one',
      forceComposition: 'character',
    });
  });

  it('epic_tiny → scene_natural token, self cast role (needs figure to render tiny), epic_tiny composition', () => {
    expect(mapDreamTypeToInputs('epic_tiny', 'low', CFG)).toEqual({
      mediumToken: 'dream_eligible_scene_natural',
      forceCastRole: 'self',
      forceComposition: 'epic_tiny',
    });
  });

  it('pure_scene → scene_natural token, null cast, pure_scene composition', () => {
    expect(mapDreamTypeToInputs('pure_scene', 'low', CFG)).toEqual({
      mediumToken: 'dream_eligible_scene_natural',
      forceCastRole: null,
      forceComposition: 'pure_scene',
    });
  });

  it('embodied at mid: embodied token with lego+pixels subset', () => {
    expect(mapDreamTypeToInputs('embodied', 'mid', CFG)).toEqual({
      mediumToken: 'dream_eligible_embodied:lego,pixels',
      forceCastRole: null,
      forceComposition: 'pure_scene',
    });
  });

  it('embodied at high: embodied token with lego+pixels+handcrafted subset', () => {
    expect(mapDreamTypeToInputs('embodied', 'high', CFG)).toEqual({
      mediumToken: 'dream_eligible_embodied:lego,pixels,handcrafted',
      forceCastRole: null,
      forceComposition: 'pure_scene',
    });
  });
});

describe('distribution sanity (statistical, 5000 samples)', () => {
  it('hasSelf + hasPlusOne at low tier: ~90% face-swap (54/18/18 split) / 10% scene (50/50 pure/tiny)', () => {
    const counts: Record<NightlyDreamType, number> = {
      face_swap_dual: 0,
      face_swap_self: 0,
      face_swap_plus_one: 0,
      pure_scene: 0,
      epic_tiny: 0,
      embodied: 0,
    };
    for (let i = 0; i < 5000; i++) {
      const t = rollNightlyDreamType({ hasSelf: true, hasPlusOne: true, tier: 'low', cfg: CFG });
      counts[t]++;
    }
    expect(counts.embodied).toBe(0);
    // 60% of 90% = 54% dual; allow ~4pp margin
    expect(counts.face_swap_dual / 5000).toBeGreaterThan(0.5);
    expect(counts.face_swap_dual / 5000).toBeLessThan(0.58);
    // 20% of 90% = 18% each self and +1
    expect(counts.face_swap_self / 5000).toBeGreaterThan(0.14);
    expect(counts.face_swap_self / 5000).toBeLessThan(0.22);
    expect(counts.face_swap_plus_one / 5000).toBeGreaterThan(0.14);
    expect(counts.face_swap_plus_one / 5000).toBeLessThan(0.22);
    // 10% scene split 50/50 = 5% each pure_scene and epic_tiny
    expect(counts.pure_scene / 5000).toBeGreaterThan(0.02);
    expect(counts.pure_scene / 5000).toBeLessThan(0.08);
    expect(counts.epic_tiny / 5000).toBeGreaterThan(0.02);
    expect(counts.epic_tiny / 5000).toBeLessThan(0.08);
  });

  it('hasSelf + hasPlusOne at high tier: ~5% embodied (10% scene * 50% rate), ~90% face-swap', () => {
    let embodied = 0;
    let faceSwap = 0;
    for (let i = 0; i < 5000; i++) {
      const t = rollNightlyDreamType({ hasSelf: true, hasPlusOne: true, tier: 'high', cfg: CFG });
      if (t === 'embodied') embodied++;
      if (t.startsWith('face_swap')) faceSwap++;
    }
    // 10% scene * 50% embodied rate = 5%
    expect(embodied / 5000).toBeGreaterThan(0.02);
    expect(embodied / 5000).toBeLessThan(0.08);
    // 90% face-swap now (the +1 showcase bump)
    expect(faceSwap / 5000).toBeGreaterThan(0.86);
    expect(faceSwap / 5000).toBeLessThan(0.94);
  });

  it('hasSelf only (no +1) is unaffected: still ~70% face-swap (all self)', () => {
    let faceSwap = 0;
    for (let i = 0; i < 5000; i++) {
      const t = rollNightlyDreamType({ hasSelf: true, hasPlusOne: false, tier: 'low', cfg: CFG });
      if (t.startsWith('face_swap')) faceSwap++;
    }
    expect(faceSwap / 5000).toBeGreaterThan(0.65);
    expect(faceSwap / 5000).toBeLessThan(0.75);
  });
});

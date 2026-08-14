// Locks the REAL nightly cast-composition roll (rollNightlyDreamType in
// chaosTier.ts) — the lever that actually decides dual vs self vs +1 for a
// nightly dream. (rollDream's internal split is dead for nightly, which forces
// the cast role via this function.) Verifies the live 40/30/30 split + that a
// couple gets 0 pure scenes at face_swap_share_with_plus_one=1.
import { rollNightlyDreamType } from '@engine/chaosTier';

// Live engine_config values (2026-08-14): share_with_plus_one=1, dual .4, self .3.
const CFG = {
  low: 0.4,
  high: 0.7,
  embodied_low: 0,
  embodied_mid: 0.333,
  embodied_high: 0.5,
  embodied_mediums_mid: ['lego', 'pixels'],
  embodied_mediums_high: ['lego', 'pixels', 'handcrafted'],
  extra_models_mid: [],
  extra_models_high: [],
  face_swap_share: 0.7,
  face_swap_share_with_plus_one: 1.0,
  face_swap_dual_rate: 0.4,
  face_swap_self_rate: 0.3,
  dream_art_share: 0,
};

describe('rollNightlyDreamType — nightly cast composition', () => {
  it('couple (self + plus_one): ~40% dual / 30% self / 30% +1, ZERO pure scenes', () => {
    const N = 30000;
    const c: Record<string, number> = {};
    for (let i = 0; i < N; i++) {
      const t = rollNightlyDreamType({ hasSelf: true, hasPlusOne: true, tier: 'low', cfg: CFG });
      c[t] = (c[t] || 0) + 1;
    }
    // share_with_plus_one = 1.0 + dream_art = 0 → always a face swap, never a scene.
    expect(c['pure_scene'] || 0).toBe(0);
    expect(c['embodied'] || 0).toBe(0);
    expect((c['face_swap_dual'] || 0) / N).toBeCloseTo(0.4, 1); // ~40% dual
    expect((c['face_swap_self'] || 0) / N).toBeCloseTo(0.3, 1); // ~30% self
    expect((c['face_swap_plus_one'] || 0) / N).toBeCloseTo(0.3, 1); // ~30% +1
  });

  it('self-only (no +1): 70% face-swap-self / 30% scene, never dual', () => {
    const N = 30000;
    let selfSwap = 0,
      dual = 0,
      scene = 0;
    for (let i = 0; i < N; i++) {
      const t = rollNightlyDreamType({ hasSelf: true, hasPlusOne: false, tier: 'low', cfg: CFG });
      if (t === 'face_swap_self') selfSwap++;
      else if (t === 'face_swap_dual') dual++;
      else scene++;
    }
    expect(dual).toBe(0); // no +1 → never dual
    expect(selfSwap / N).toBeCloseTo(0.7, 1); // face_swap_share
    expect(scene / N).toBeCloseTo(0.3, 1);
  });
});

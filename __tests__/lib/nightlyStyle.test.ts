/** The style contract (NIGHTLY_LOOKS_REFACTOR_PLAN.md §2): model → look → fragments, retry + rebuild answers. */
import { buildStyleContract, RETRY_SAME_MODEL_FIRST } from '@engine/nightlyStyle';
import type { NightlyModelPolicy } from '@engine/nightlyModelPolicy';
import type { LookApproval, LookRow } from '@engine/nightlyLooks';
import type { VibeRow } from '@engine/nightlyVibes';
import { FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES } from '@engine/nightlyVibes';

const PRO = 'black-forest-labs/flux-1.1-pro';
const GEMINI = 'google/gemini-2-image';
const GROK = 'xai/grok-imagine-image';
const FLEX = 'black-forest-labs/flux-2-flex';

const POLICY: NightlyModelPolicy = {
  couple: { primaryModels: [PRO], fallbackModels: [GEMINI] },
  solo: { primaryModels: [GROK], fallbackModels: [] },
  solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
  scene: { primaryModels: [GEMINI], fallbackModels: [] },
};
const look = (key: string, family = 'painted_realism'): LookRow => ({
  key,
  label: key,
  family,
  fragment: `${key} scene`,
  swapFragment: `${key} swap`,
  directive: `${key} directive`,
  weight: 1,
  active: true,
  nightlyEnabled: true,
});
const LOOKS = [
  look('oil'),
  look('chromo', 'comic_print'),
  look('wc', 'watercolor'),
  look('halloween_x', 'pins'),
];
const ok = (k: string, m: string, s: 'couple' | 'solo'): LookApproval => ({
  lookKey: k,
  model: m,
  surface: s,
  approved: true,
});
const APPROVALS = [
  ok('oil', PRO, 'couple'),
  ok('oil', PRO, 'solo'),
  ok('oil', FLEX, 'solo'),
  ok('chromo', GEMINI, 'couple'),
  ok('chromo', GEMINI, 'solo'),
  ok('wc', GROK, 'solo'),
  ok('wc', GEMINI, 'solo'),
];
const vibe = (key: string, family = key.split('__')[0]): VibeRow => ({
  key,
  label: key,
  family,
  fragment: `${key} light`,
  position: 'early',
  directive: `${key} directive`,
  faceSwapDirective: null,
  active: true,
  nightlyPool: true,
});
const NIGHT_VIBES = [vibe('moonlit__bold'), vibe('starlit__bold'), vibe('nightshade__soft')];
const DAY_VIBES = [vibe('golden_hour__bold'), vibe('blue_hour__bold')];
const rng = () => 0.01; // deterministic: first candidate everywhere

describe('buildStyleContract', () => {
  it('couple: policy model, then a look approved for (model, couple); cast fragment = swap fragment', () => {
    const c = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      rng,
    })!;
    expect(c.model).toBe(PRO);
    expect(c.look.key).toBe('oil');
    expect(c.fragment).toBe('oil swap');
    expect(c.sceneFragment).toBe('oil scene');
    expect(c.source).toBe('roll');
    expect(c.stamps).toEqual(
      expect.arrayContaining([
        'policy:couple:1:flux-1.1-pro',
        'look:oil',
        'look_family:painted_realism',
      ])
    );
  });

  it('scene: rolls the scene policy row and the SOLO approvals of that model; fragment = scene fragment', () => {
    const c = buildStyleContract({
      surface: 'scene',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      rng,
    })!;
    expect(c.model).toBe(GEMINI);
    expect(['chromo', 'wc']).toContain(c.look.key);
    expect(c.fragment).toBe(`${c.look.key} scene`);
  });

  it('returns null (caller stays legacy) when the model has no approved look for the surface', () => {
    const c = buildStyleContract({
      surface: 'solo',
      policy: { ...POLICY, solo: { primaryModels: [FLEX], fallbackModels: [] } },
      looks: LOOKS,
      approvals: [ok('wc', GROK, 'solo')],
      rng,
    });
    expect(c).toBeNull();
  });

  it('a known pin wins the look regardless of approvals; an unknown pin falls to the roll with a stamp', () => {
    const pinned = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      pinnedLook: 'halloween_x',
      rng,
    })!;
    expect(pinned.look.key).toBe('halloween_x');
    expect(pinned.source).toBe('pin');
    const unknown = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      pinnedLook: 'photography',
      rng,
    })!;
    expect(unknown.look.key).toBe('oil');
    expect(unknown.stamps).toContain('look_pin_unknown:photography');
    const forced = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      pinnedLook: 'halloween_x',
      forcedLook: 'wc',
      rng,
    })!;
    expect(forced.look.key).toBe('wc'); // force_look beats the pin
    expect(forced.source).toBe('force');
  });

  it('the retry ladder follows RETRY_SAME_MODEL_FIRST: attempt 2 holds the model when on, moves when off', () => {
    const c = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      rng,
    })!;
    const retry = c.forAttempt(2);
    if (RETRY_SAME_MODEL_FIRST) {
      // 1.2.0 parity (2026-09-13): the first re-render holds the attempt-1 model and its look …
      expect(retry.model).toBe(PRO);
      expect(retry.look.key).toBe('oil');
      expect(retry.stamps[0]).toBe('policy:couple:2:flux-1.1-pro:same');
      expect(retry.stamps).toContain('look_retry:2:keep:oil');
      // … and the fallback model is the LAST re-render (attempt 3): oil is not approved on gemini couples
      const last = c.forAttempt(3);
      expect(last.model).toBe(GEMINI);
      expect(last.look.key).toBe('chromo');
      expect(last.stamps[0]).toBe('policy:couple:3:gemini-2-image');
      expect(last.stamps).toContain('look_retry:3:reroll:chromo');
    } else {
      // the round-20 ladder: every re-render moves straight to the fallback model, re-rolling the look
      expect(retry.model).toBe(GEMINI);
      expect(retry.look.key).toBe('chromo');
      expect(retry.stamps[0]).toBe('policy:couple:2:gemini-2-image');
      expect(retry.stamps).toContain('look_retry:2:reroll:chromo');
    }
  });

  it('forRebuild(): the solo_rebuild model; keeps the look when approved for (model, solo)', () => {
    const c = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      rng,
    })!;
    const rb = c.forRebuild();
    expect(rb.model).toBe(FLEX);
    expect(rb.look.key).toBe('oil'); // approved on flex solos
    expect(rb.fragment).toBe('oil swap');
    expect(rb.stamps).toContain('look_rebuild:keep:oil');
  });

  it('forRebuild(): when the solo_rebuild model approves NO solo look, it rebuilds on the COUPLE model (round 19)', () => {
    // The production shape: flux-2-flex has no looks-catalog approvals at all.
    const noFlex = APPROVALS.filter((a) => a.model !== FLEX);
    const c = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: noFlex,
      rng,
    })!;
    const rb = c.forRebuild();
    expect(rb.model).toBe(PRO); // the couple's model, where oil is approved for solos
    expect(rb.look.key).toBe('oil');
    expect(rb.fragment).toBe('oil swap');
    expect(rb.stamps[0]).toBe('policy:solo_rebuild:1:flux-2-flex');
    expect(rb.stamps).toContain('look_rebuild:model_fallback:flux-1.1-pro');
    expect(rb.stamps).toContain('look_rebuild:keep:oil');
    expect(rb.stamps.some((st) => st.startsWith('look_rebuild:no_look:'))).toBe(false);
  });

  it('a pinned look is kept across retry and rebuild even where it has no approvals', () => {
    const c = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      pinnedLook: 'halloween_x',
      rng,
    })!;
    expect(c.forAttempt(2).look.key).toBe('halloween_x');
    expect(c.forRebuild().look.key).toBe('halloween_x');
  });

  it('night vibes are excluded for flux couples exactly when FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES says so', () => {
    const guarded = FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES.length > 0;
    const pool = [...NIGHT_VIBES, ...DAY_VIBES];
    const fluxCouple = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      vibes: pool,
      rng,
    })!;
    expect(fluxCouple.model).toBe(PRO);
    if (guarded) {
      // drill F-I: night vibes pass the flux dual swap 1/10 vs 16/28 for brighter ones
      expect(['golden_hour', 'blue_hour']).toContain(fluxCouple.vibe!.vibe.family);
    } else {
      expect(fluxCouple.vibe!.vibe.family).toBe('moonlit'); // rng picks the first candidate
    }

    // never surface-wide: gemini couples and flux solos keep every night family in either state
    const geminiCouple = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      forceModel: GEMINI,
      vibes: NIGHT_VIBES,
      rng,
    })!;
    expect(geminiCouple.vibe!.vibe.family).toBe('moonlit');
    const fluxSolo = buildStyleContract({
      surface: 'solo',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      forceModel: PRO,
      vibes: NIGHT_VIBES,
      rng,
    })!;
    expect(fluxSolo.vibe!.vibe.family).toBe('moonlit');
  });
});

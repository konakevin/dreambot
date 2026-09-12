/** The style contract (NIGHTLY_LOOKS_REFACTOR_PLAN.md §2): model → look → fragments, retry + rebuild answers. */
import { buildStyleContract } from '@engine/nightlyStyle';
import type { NightlyModelPolicy } from '@engine/nightlyModelPolicy';
import type { LookApproval, LookRow } from '@engine/nightlyLooks';

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

  it('forAttempt(2): fallback model; keeps the look if approved there, else re-rolls one that is', () => {
    const c = buildStyleContract({
      surface: 'couple',
      policy: POLICY,
      looks: LOOKS,
      approvals: APPROVALS,
      rng,
    })!;
    const retry = c.forAttempt(2);
    expect(retry.model).toBe(GEMINI); // couple fallback
    expect(retry.look.key).toBe('chromo'); // oil is not approved on gemini couples → re-rolled
    expect(retry.fragment).toBe('chromo swap');
    expect(retry.stamps[0]).toBe('policy:couple:2:gemini-2-image');
    expect(retry.stamps).toContain('look_retry:2:reroll:chromo');
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
});

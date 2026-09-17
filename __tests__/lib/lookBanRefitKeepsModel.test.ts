/**
 * A LOOK BAN MUST NOT RE-ROLL THE MODEL.
 *
 * When a holiday or scenario bans the rolled look, nightly rebuilds the minimal contract to pick another
 * look. Until 2026-09-17 that rebuild also re-rolled the MODEL — a second, unstamped 85/15 roll, or a
 * one-model pool if the replacement look rejects flux. The stamps kept the FIRST roll
 * (`policy:solo:1:flux-1.1-pro`) while gemini rendered. That is a silent model swap, and it is one of the
 * "gemini replacement points" that made the delivered split disagree with the configured one.
 *
 * Measured: 19 of 430 renders in 7 days took the refit; 4 rolled flux and delivered gemini with nothing in
 * the stamps to explain it. AB-CHAIN 2 (technicolor -> painted_fantasy under the fall holiday) was one.
 */
import fs from 'fs';
import path from 'path';
import { buildStyleContract } from '@engine/nightlyStyle';

const NIGHTLY_SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);
const strip = (s: string) => s.replace(/\s+/g, ' ');

const FLUX = 'black-forest-labs/flux-1.1-pro';
const GEM = 'google/gemini-2-image';
const policy = {
  couple: { primaryModels: [FLUX, GEM], primaryWeights: [85, 15], fallbackModel: GEM },
  solo: { primaryModels: [FLUX, GEM], primaryWeights: [85, 15], fallbackModel: GEM },
  scene: { primaryModels: [FLUX, GEM], primaryWeights: [50, 50], fallbackModel: GEM },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
const look = (key: string) =>
  ({
    key,
    label: key,
    family: 'painted_realism',
    fragment: 'a painted look',
    swapFragment: 'a painted look with lifelike adult faces',
    directive: null,
    weight: 1,
    active: true,
    nightlyEnabled: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

const approve = (lookKey: string, model: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ lookKey, model, surface: 'solo', approved: true }) as any;

describe('the refit is pinned to the model already rolled', () => {
  it('nightly passes restrictModels: [minimalModel] to the look-ban refit', () => {
    const s = strip(NIGHTLY_SRC);
    expect(s).toContain(
      'excludeLookKeys: bannedLooks, withVibes: false, restrictModels: minimalModel ? [minimalModel] : null,'
    );
  });

  it('and any model change that still happens is stamped, never silent', () => {
    expect(NIGHTLY_SRC).toContain('look_medium_ban_model:');
  });

  it('restrictModels actually holds the roll to that model — gemini cannot come out', () => {
    // 200 seeded rolls with the rng pinned to the gemini end of the weight table; with the restriction the
    // pool is [flux] and the weighted roll has nothing else to land on.
    for (let i = 0; i < 200; i++) {
      const c = buildStyleContract({
        surface: 'solo',
        policy,
        modelFromLook: true,
        looks: [look('nightly_a'), look('nightly_b')],
        // Both looks graded on both models — a look with no approval row is not a candidate.
        approvals: [
          approve('nightly_a', FLUX),
          approve('nightly_a', GEM),
          approve('nightly_b', FLUX),
          approve('nightly_b', GEM),
        ],
        restrictModels: [FLUX],
        rng: () => 0.999,
      });
      expect(c).not.toBeNull();
      expect(c!.model).toBe(FLUX);
    }
  });

  it('when the restriction leaves no model, the contract is null (the nofit branch keeps the old look)', () => {
    // The replacement look rejects flux; rather than silently rendering on gemini, the refit yields null and
    // nightly stamps look_medium_ban_nofit and fails OPEN on the original look.
    const c = buildStyleContract({
      surface: 'solo',
      policy,
      modelFromLook: true,
      looks: [look('nightly_only_gem')],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      approvals: [
        { lookKey: 'nightly_only_gem', model: FLUX, surface: 'solo', approved: false } as any,
      ],
      restrictModels: [FLUX],
      rng: () => 0.5,
    });
    expect(c).toBeNull();
  });
});

/**
 * A look with NO eligible model must skip, not crash the render.
 *
 * FOUND 2026-09-17 by simulating the real roll offline. `nightly_rotoscope` / couple rejects BOTH
 * flux-1.1-pro and gemini-2-image, so `lookModels` came back empty, `modelId` came back undefined, and
 * `short(undefined)` threw "Cannot read properties of undefined (reading 'replace')" — which fails the WHOLE
 * nightly render, not just that look. One real render died this way before the guard landed.
 *
 * It was LATENT, and that is the part worth remembering: before migration 522 the cast surfaces carried THREE
 * primaries (flux, gemini, seedream-4.5), and seedream was the only model rotoscope/couple had left. Dropping
 * seedream to get an 80/20 split emptied that look's pool. Nothing about rotoscope changed; the policy row
 * narrowed underneath it.
 *
 * So this is not a data bug to fix on one row. ANY future narrowing of `primary_models` can re-arm it on a
 * different look, silently, with the damage showing up as a crashed render rather than a bad one.
 */
import { buildStyleContract } from '@engine/nightlyStyle';

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

// NOTE the camelCase `lookKey`. The first draft of this file used `look_key` (the COLUMN name), so no rejection
// ever matched, every case fell through to "no look found", and two of these tests passed for the wrong reason.
const reject = (lookKey: string, model: string, surface: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ lookKey, model, surface, approved: false }) as any;
const approve = (lookKey: string, model: string, surface: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ lookKey, model, surface, approved: true }) as any;

// THE GAP THAT MAKES THIS REACHABLE, and the reason the first draft of this file could not reproduce it:
// the LOOK roll (approvedLooks, anyModel) accepts a look approved on ANY model in the approvals table, but the
// MODEL pool is built only from the surface's `primary_models`. GROK is what keeps rotoscope/couple in the look
// roll while being ineligible to render it — so the look survives and its pool is empty.
const GROK = 'xai/grok-imagine-image';

describe('a look whose every PRIMARY is rejected but is approved on a non-primary model', () => {
  const rotoscope = {
    looks: [look('nightly_rotoscope')],
    approvals: [
      approve('nightly_rotoscope', GROK, 'couple'), // keeps it in the look roll
      reject('nightly_rotoscope', FLUX, 'couple'),
      reject('nightly_rotoscope', GEM, 'couple'),
    ],
  };

  it('does not throw', () => {
    // Before the guard this threw "Cannot read properties of undefined (reading 'replace')" and killed the render.
    expect(() =>
      buildStyleContract({
        surface: 'couple',
        policy,
        modelFromLook: true,
        ...rotoscope,
        rng: () => 0.5,
      })
    ).not.toThrow();
  });

  it('returns null, which is what drops the render to the legacy chain', () => {
    expect(
      buildStyleContract({
        surface: 'couple',
        policy,
        modelFromLook: true,
        ...rotoscope,
        rng: () => 0.5,
      })
    ).toBeNull();
  });

  it('a look with ONE surviving primary still rolls it — the guard is not over-broad', () => {
    const c = buildStyleContract({
      surface: 'couple',
      policy,
      modelFromLook: true,
      looks: [look('nightly_half')],
      approvals: [approve('nightly_half', GROK, 'couple'), reject('nightly_half', FLUX, 'couple')],
      rng: () => 0.5,
    });
    expect(c).not.toBeNull();
    expect(c!.model).toBe(GEM);
  });

  it('the rejections are per SURFACE — a couple rejection never starves the solo roll', () => {
    const c = buildStyleContract({
      surface: 'solo',
      policy,
      modelFromLook: true,
      looks: [look('nightly_rotoscope')],
      approvals: [
        approve('nightly_rotoscope', GROK, 'solo'),
        reject('nightly_rotoscope', FLUX, 'couple'),
        reject('nightly_rotoscope', GEM, 'couple'),
      ],
      rng: () => 0.5,
    });
    expect(c).not.toBeNull();
  });
});

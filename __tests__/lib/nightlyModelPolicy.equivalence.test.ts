/**
 * Equivalence: the LEGACY nightly picker (DreamSmart set → ≤2✦ cap → 6 bans → Ultra / flex clamps → scene
 * gate) replayed over a checked-in snapshot of the live medium sets must give the SAME model set per
 * medium × surface as the legacy-equivalent policy rows (NIGHTLY_MODEL_POLICY_PLAN.md §3/§5) — except the
 * two divergences Kevin accepted ("rip off the bandaid"), which are enumerated here so any OTHER divergence
 * fails CI, and a stale entry (one that no longer diverges) fails too.
 *
 * Fixture: __tests__/fixtures/nightlyMediumSets.2026-09-07.json. Regenerate on purpose with the snippet in
 * the plan (§5) when the sets change; the test is about the RULES, the fixture pins the data they ran on.
 */
import { nightlyModelPool } from '@engine/nightlyModelPool';
import { LEGACY_EQUIVALENT_POLICY, type PolicySurface } from '@engine/nightlyModelPolicy';
import fixture from '../fixtures/nightlyMediumSets.2026-09-07.json';

const PRO = 'black-forest-labs/flux-1.1-pro';
const ULTRA = 'black-forest-labs/flux-1.1-pro-ultra';
const FLEX = 'black-forest-labs/flux-2-flex';
/** NIGHTLY_BANNED_MODELS as of 2026-09-07 (nightly-dreams/index.ts:153-178) — deleted in Phase 3. */
const BANS = new Set([
  'black-forest-labs/flux-2-dev',
  'openai/gpt-image-2',
  'black-forest-labs/flux-2-pro',
  'google/gemini-2-image',
  ULTRA,
  'xai/grok-imagine-image',
]);
const costOf = (id: string) => (fixture.sparkleCost as Record<string, number>)[id] ?? 99;

type Medium = (typeof fixture.mediums)[number];

/** The legacy rules, exactly as the render applies them (plan §1). */
function legacySet(m: Medium, surface: PolicySurface): Set<string> {
  const pool = nightlyModelPool({
    smartDreamModels: m.smartDreamModels,
    allowedModels: m.allowedModels,
    costOf,
    bans: BANS,
  });
  if (surface === 'scene') {
    const sceneList =
      m.sceneEligibleModels && m.sceneEligibleModels.length > 0
        ? m.sceneEligibleModels
        : fixture.globalSceneEligible;
    return new Set(
      nightlyModelPool({
        smartDreamModels: m.smartDreamModels,
        allowedModels: m.allowedModels,
        costOf,
        bans: BANS,
        intersectWith: sceneList,
      })
    );
  }
  const clamped = pool.map((id) => (id === ULTRA ? PRO : id));
  if (surface === 'couple') return new Set(clamped.map((id) => (id === FLEX ? PRO : id))); // dual flex clamp (steer off)
  return new Set(clamped); // solo
}
const policySet = (surface: PolicySurface) =>
  new Set(LEGACY_EQUIVALENT_POLICY[surface].primaryModels);

/** The two accepted divergences (plan §3). Nothing else may differ. */
const ACCEPTED: Record<string, PolicySurface[]> = {
  photography: ['couple', 'solo'], // loses flux-dev
  film_noir: ['solo'], // gains flex (its smart set is Gemini-only → legacy falls through to 1.1-pro alone)
};

const same = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((x) => b.has(x));

describe('legacy picker ≡ legacy-equivalent policy rows (fixture 2026-09-07)', () => {
  const cast = fixture.mediums.filter((m) => m.faceSwaps);
  it('snapshot sanity: 21 dream-eligible mediums, 10 face-swap mediums', () => {
    expect(fixture.mediums).toHaveLength(21);
    expect(cast).toHaveLength(10);
  });
  for (const m of fixture.mediums) {
    for (const surface of ['couple', 'solo', 'scene'] as PolicySurface[]) {
      if (surface !== 'scene' && !m.faceSwaps) continue; // non-swap mediums never render cast
      const accepted = (ACCEPTED[m.key] ?? []).includes(surface);
      it(`${m.key} / ${surface}: ${accepted ? 'DIVERGES (accepted)' : 'identical'}`, () => {
        const legacy = legacySet(m, surface);
        const policy = policySet(surface);
        if (accepted) expect(same(legacy, policy)).toBe(false);
        else expect([...legacy].sort()).toEqual([...policy].sort());
      });
    }
  }
  it('the solo_rebuild row equals engine_config.solo_rebuild_model of record (flex)', () => {
    expect(policySet('solo_rebuild')).toEqual(new Set([FLEX]));
  });
});

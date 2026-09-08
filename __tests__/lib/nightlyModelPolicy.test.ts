// Nightly model policy resolver (NIGHTLY_MODEL_POLICY_PLAN.md §2/§5): pure, seeded, every branch.
import {
  CASCADE,
  LEGACY_EQUIVALENT_POLICY,
  POLICY_SURFACES,
  parsePolicyMode,
  parsePolicyRows,
  resolveModel,
  shadowStamp,
  shadowStampSet,
  candidateModels,
  type NightlyModelPolicy,
} from '@engine/nightlyModelPolicy';

const PRO = 'black-forest-labs/flux-1.1-pro';
const FLEX = 'black-forest-labs/flux-2-flex';
const GEMINI = 'google/gemini-2-image';
const GROK = 'xai/grok-imagine-image';
const SEEDREAM = 'bytedance/seedream-4';

/** Kevin's final rows (2026-09-07): 1.1-pro primary everywhere, random backup set on failure. */
const FINAL: NightlyModelPolicy = {
  couple: {
    primaryModels: [PRO],
    fallbackModels: [
      GEMINI,
      'black-forest-labs/flux-2-pro',
      SEEDREAM,
      GROK,
      'black-forest-labs/flux-dev',
    ],
  },
  solo: { primaryModels: [PRO], fallbackModels: [GEMINI, GROK] },
  solo_rebuild: { primaryModels: [PRO], fallbackModels: [GEMINI, GROK] },
  scene: { primaryModels: [PRO], fallbackModels: [GEMINI] },
};
const rngOf = (...vals: number[]) => {
  let i = 0;
  return () => vals[Math.min(i++, vals.length - 1)];
};

describe('resolveModel — attempt 1', () => {
  it('draws uniformly from the primaries (seeded) and stamps policy:<surface>:1:<model>', () => {
    const a = resolveModel({
      surface: 'solo',
      attempt: 1,
      policy: LEGACY_EQUIVALENT_POLICY,
      rng: rngOf(0),
    });
    const b = resolveModel({
      surface: 'solo',
      attempt: 1,
      policy: LEGACY_EQUIVALENT_POLICY,
      rng: rngOf(0.99),
    });
    expect(a).toEqual({ model: PRO, stamp: 'policy:solo:1:flux-1.1-pro' });
    expect(b).toEqual({ model: FLEX, stamp: 'policy:solo:1:flux-2-flex' });
  });
  it('a single-primary row always returns that model', () => {
    for (const r of [0, 0.5, 0.999]) {
      expect(
        resolveModel({ surface: 'couple', attempt: 1, policy: FINAL, rng: rngOf(r) }).model
      ).toBe(PRO);
    }
  });
  it('bans (mig 480): a banned primary falls to the other primaries, then the fallbacks; all banned → the row still picks', () => {
    const policy: NightlyModelPolicy = {
      ...FINAL,
      couple: { primaryModels: ['a/one', 'b/two'], fallbackModels: ['c/three'] },
    };
    const bans = new Set(['a/one']);
    for (let i = 0; i < 10; i++) {
      expect(
        resolveModel({ surface: 'couple', attempt: 1, policy, bans, rng: () => i / 10 }).model
      ).toBe('b/two');
    }
    expect(
      resolveModel({
        surface: 'couple',
        attempt: 1,
        policy,
        bans: new Set(['a/one', 'b/two']),
        rng: () => 0,
      }).model
    ).toBe('c/three');
    expect(
      resolveModel({
        surface: 'couple',
        attempt: 1,
        policy,
        bans: new Set(['a/one', 'b/two', 'c/three']),
        rng: () => 0,
      }).model
    ).toBe('a/one');
    // fallbacks all banned → the attempt-1 model renders again (it is not banned)
    expect(
      resolveModel({
        surface: 'couple',
        attempt: 2,
        policy,
        bans: new Set(['c/three']),
        previousModel: 'a/one',
        rng: () => 0.9,
      }).model
    ).toBe('a/one');
    // …unless the previous model is banned too → a non-banned primary
    expect(
      resolveModel({
        surface: 'couple',
        attempt: 2,
        policy,
        bans: new Set(['c/three', 'a/one']),
        previousModel: 'a/one',
        rng: () => 0.9,
      }).model
    ).toBe('b/two');
  });
  it('forceModel wins and is stamped as forced', () => {
    expect(
      resolveModel({ surface: 'couple', attempt: 1, policy: FINAL, forceModel: GEMINI })
    ).toEqual({
      model: GEMINI,
      stamp: 'policy:couple:1:forced',
    });
  });
  it('rng never indexes past the end', () => {
    expect(
      resolveModel({ surface: 'solo', attempt: 1, policy: LEGACY_EQUIVALENT_POLICY, rng: () => 1 })
        .model
    ).toBe(FLEX);
    expect(
      resolveModel({ surface: 'solo', attempt: 1, policy: LEGACY_EQUIVALENT_POLICY, rng: () => -1 })
        .model
    ).toBe(PRO);
  });
});

describe('resolveModel — attempt ≥ 2 (the fallback stage)', () => {
  it('legacy rows (no fallbacks): renders the attempt-1 model again', () => {
    const r = resolveModel({
      surface: 'couple',
      attempt: 2,
      policy: LEGACY_EQUIVALENT_POLICY,
      previousModel: PRO,
    });
    expect(r).toEqual({ model: PRO, stamp: 'policy:couple:2:flux-1.1-pro' });
  });
  it('legacy rows without a previous model fall back to a primary draw', () => {
    expect(
      resolveModel({
        surface: 'scene',
        attempt: 3,
        policy: LEGACY_EQUIVALENT_POLICY,
        rng: rngOf(0),
      }).model
    ).toBe(PRO);
  });
  it("Kevin's rows: attempt 2 draws uniformly from the backup set, never the primary", () => {
    const seen = new Set<string>();
    for (let k = 0; k < 5; k++) {
      const r = resolveModel({
        surface: 'couple',
        attempt: 2,
        policy: FINAL,
        previousModel: PRO,
        rng: rngOf(k / 5),
      });
      expect(FINAL.couple.fallbackModels).toContain(r.model);
      expect(r.stamp).toBe(`policy:couple:2:${r.model.replace(/^.*\//, '')}`);
      seen.add(r.model);
    }
    expect(seen.size).toBe(5);
  });
  it('attempt 3 draws from the backups again (independent draw)', () => {
    expect(FINAL.couple.fallbackModels).toContain(
      resolveModel({ surface: 'couple', attempt: 3, policy: FINAL, rng: rngOf(0.5) }).model
    );
  });
  it('attempt < 1 is treated as attempt 1', () => {
    expect(resolveModel({ surface: 'couple', attempt: 0, policy: FINAL }).stamp).toBe(
      'policy:couple:1:flux-1.1-pro'
    );
  });
});

describe('policy integrity', () => {
  it('a blank row throws (a policy can never be silent)', () => {
    const broken = { ...FINAL, scene: { primaryModels: [], fallbackModels: [] } };
    expect(() => resolveModel({ surface: 'scene', attempt: 1, policy: broken })).toThrow(
      /no primary models/
    );
  });
  it('the cascade is explicit: couple → couple retry → solo rebuild → scene; solo → solo rebuild → scene', () => {
    expect(CASCADE.couple.map((s) => `${s.surface}@${s.attempt}`)).toEqual([
      'couple@1',
      'couple@2',
      'solo_rebuild@1',
      'scene@1',
    ]);
    expect(CASCADE.solo.map((s) => `${s.surface}@${s.attempt}`)).toEqual([
      'solo@1',
      'solo_rebuild@1',
      'scene@1',
    ]);
    for (const step of [...CASCADE.couple, ...CASCADE.solo])
      expect(POLICY_SURFACES).toContain(step.surface);
  });
  it('the legacy-equivalent rows match the migration seed (plan §3)', () => {
    expect(LEGACY_EQUIVALENT_POLICY).toEqual({
      couple: { primaryModels: [PRO], fallbackModels: [] },
      solo: { primaryModels: [PRO, FLEX], fallbackModels: [] },
      solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
      scene: { primaryModels: [PRO], fallbackModels: [] },
    });
  });
});

describe('shadowStamp', () => {
  it('match and diff forms', () => {
    expect(shadowStamp('faceswap_pick', PRO, PRO)).toBe('policy_shadow:faceswap_pick:match');
    expect(shadowStamp('couple_retry', PRO, GEMINI)).toBe(
      'policy_shadow:couple_retry:diff:flux-1.1-pro->gemini-2-image'
    );
  });
});

describe('parsePolicyRows / parsePolicyMode', () => {
  it('parses DB rows, ignores unknown surfaces and non-string entries, reports missing surfaces', () => {
    const { policy, missing } = parsePolicyRows([
      { surface: 'couple', primary_models: [PRO], fallback_models: [GEMINI, 7, null] },
      { surface: 'bogus', primary_models: [GROK], fallback_models: [] },
      { surface: 'scene', primary_models: [], fallback_models: [GEMINI] }, // blank → fail-open default
    ]);
    expect(policy.couple).toEqual({ primaryModels: [PRO], fallbackModels: [GEMINI] });
    expect(policy.scene).toEqual(LEGACY_EQUIVALENT_POLICY.scene);
    expect(policy.solo).toEqual(LEGACY_EQUIVALENT_POLICY.solo);
    expect(missing).toEqual(['solo', 'solo_rebuild', 'scene']);
  });
  it('an empty table is entirely legacy-equivalent', () => {
    expect(parsePolicyRows([]).policy).toEqual(LEGACY_EQUIVALENT_POLICY);
  });
  it('mode parses off / shadow / on, anything else → off', () => {
    expect(parsePolicyMode('shadow')).toBe('shadow');
    expect(parsePolicyMode('on')).toBe('on');
    expect(parsePolicyMode('off')).toBe('off');
    expect(parsePolicyMode(undefined)).toBe('off');
    expect(parsePolicyMode('ON')).toBe('off');
  });
});

describe('candidateModels / shadowStampSet (shadow compares SETS, not two random draws)', () => {
  it('attempt 1 = the primaries; attempt ≥ 2 = the fallbacks, else the previous model, else the primaries', () => {
    expect(candidateModels(LEGACY_EQUIVALENT_POLICY, 'solo', 1)).toEqual([PRO, FLEX]);
    expect(candidateModels(FINAL, 'couple', 2)).toEqual(FINAL.couple.fallbackModels);
    expect(candidateModels(LEGACY_EQUIVALENT_POLICY, 'couple', 2, PRO)).toEqual([PRO]);
    expect(candidateModels(LEGACY_EQUIVALENT_POLICY, 'couple', 2)).toEqual([PRO]);
    expect(
      candidateModels({ ...FINAL, scene: { primaryModels: [], fallbackModels: [] } }, 'scene', 1)
    ).toEqual([]);
  });
  it('a legacy flex solo pick MATCHES the [1.1-pro, flex] row; a grok pick is a diff naming the set', () => {
    expect(shadowStampSet('faceswap_pick', FLEX, [PRO, FLEX])).toBe(
      'policy_shadow:faceswap_pick:match'
    );
    expect(shadowStampSet('faceswap_pick', GROK, [PRO, FLEX])).toBe(
      'policy_shadow:faceswap_pick:diff:grok-imagine-image->flux-1.1-pro|flux-2-flex'
    );
    expect(shadowStampSet('scene_final', PRO, [])).toBe(
      'policy_shadow:scene_final:diff:flux-1.1-pro->none'
    );
  });
});

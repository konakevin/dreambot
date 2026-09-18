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

  // ── MODEL SELECTION AND THE DUAL FAILURE LADDER ────────────────────────────────────────────────────────────
  // Kevin, 2026-09-13, in his words:
  //   "all looks enabled for all models, i think that makes 3 total?"
  //   "keep the rejections, that's right"
  //   "hardcode 50% to go direct to flux 1.1pro, and the other 50% random roll from all models in the pool. same
  //    thing with singles"
  //   "try a 2nd model if the first char render fails, and so on … if we get through all models then we resolve to
  //    a single and start over on the model chain"
  describe('model selection (look-first)', () => {
    const POLICY3: NightlyModelPolicy = {
      couple: { primaryModels: [PRO, GEMINI, GROK], fallbackModels: [GEMINI] },
      solo: { primaryModels: [PRO, GEMINI, GROK], fallbackModels: [] },
      solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
      scene: { primaryModels: [PRO], fallbackModels: [] },
    };
    const APPR = [ok('oil', PRO, 'couple'), ok('oil', PRO, 'solo')]; // graded on flux only — the pool opens anyway
    const build = (over: Record<string, unknown> = {}, rngFn = rng) =>
      buildStyleContract({
        surface: 'couple',
        policy: POLICY3,
        looks: LOOKS,
        approvals: APPR,
        modelFromLook: true,
        rng: rngFn,
        ...over,
      })!;

    it('opens the pool to every model the policy names, even when the look is graded on one', () => {
      const c = build({}, () => 0.99); // 0.99 skips the direct-to-primary branch and rolls the pool
      expect(c.stamps).toContain('model_source:look:3');
      expect([PRO, GEMINI, GROK]).toContain(c.model);
    });

    it('rolls the pool WEIGHTED by the policy row, not by a hardcoded share', () => {
      // No primaryWeights on this policy → weightedList gives every model weight 1, so the roll is
      // uniform across the 3-model pool and the draw maps by thirds.
      const first = build({}, () => 0.1);
      expect(first.model).toBe(PRO);
      expect(first.stamps).toContain('model_roll:weighted:1/1/1');

      const last = build({}, () => 0.99);
      expect(last.model).toBe(GROK);
      expect(last.stamps).toContain('model_roll:weighted:1/1/1');
    });

    it('CONFIGURED weights decide the share — the stamp records what was applied', () => {
      // THE POINT OF THE REFACTOR. primary_weights sat in the database, set deliberately, and this path
      // ignored it: couple read 51/49 in the dashboard while actually rendering 75/25.
      const weighted = (v: number) =>
        build(
          { policy: { ...POLICY3, couple: { ...POLICY3.couple, primaryWeights: [80, 10, 10] } } },
          () => v
        );
      expect(weighted(0.1).model).toBe(PRO); // 0-0.80 → flux
      expect(weighted(0.5).model).toBe(PRO);
      expect(weighted(0.85).model).toBe(GEMINI); // 0.80-0.90
      expect(weighted(0.95).model).toBe(GROK); // 0.90-1.00
      expect(weighted(0.1).stamps).toContain('model_roll:weighted:80/10/10');
    });

    it('a rejected model drops its WEIGHT with it, so survivors renormalise', () => {
      // Without this, removing the heaviest model would leave its share unclaimed and skew the rest.
      const rejectsFlux = [
        ok('oil', GEMINI, 'couple'),
        ok('oil', GROK, 'couple'),
        { lookKey: 'oil', model: PRO, surface: 'couple' as const, approved: false },
      ];
      const c = build(
        {
          approvals: rejectsFlux,
          policy: { ...POLICY3, couple: { ...POLICY3.couple, primaryWeights: [80, 10, 10] } },
        },
        () => 0.4
      );
      // flux's 80 is gone entirely; gemini and grok split 10/10 rather than inheriting a skew.
      expect(c.model).not.toBe(PRO);
      expect(c.stamps).toContain('model_roll:weighted:10/10');
    });

    it('a model Kevin graded NO for this look and surface never enters the pool', () => {
      const rejectsFlux = [
        ok('oil', GEMINI, 'couple'),
        { lookKey: 'oil', model: PRO, surface: 'couple' as const, approved: false },
      ];
      const c = build({ approvals: rejectsFlux }, () => 0.1); // would go direct to flux if allowed
      expect(c.model).not.toBe(PRO);
      expect(c.stamps).toContain('model_source:look:2');
      expect([c.model, c.forAttempt(2).model, c.forAttempt(3).model]).not.toContain(PRO);
    });

    it('a banned model never enters the pool either', () => {
      const c = build({ bans: new Set([GROK]) }, () => 0.99);
      expect([c.model, c.forAttempt(2).model]).not.toContain(GROK);
    });

    it('the same rules apply to solos', () => {
      const c = build({ surface: 'solo', approvals: [ok('oil', PRO, 'solo')] }, () => 0.1);
      expect(c.model).toBe(PRO);
      expect(c.stamps.some((s) => s.startsWith('model_roll:weighted:'))).toBe(true);
    });
  });

  describe('dual failure ladder (look-first)', () => {
    const POLICY3: NightlyModelPolicy = {
      couple: { primaryModels: [PRO, GEMINI, GROK], fallbackModels: [GEMINI] },
      solo: { primaryModels: [PRO, GEMINI, GROK], fallbackModels: [] },
      solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
      scene: { primaryModels: [PRO], fallbackModels: [] },
    };
    const build = (over: Record<string, unknown> = {}) =>
      buildStyleContract({
        surface: 'couple',
        policy: POLICY3,
        looks: LOOKS,
        approvals: [ok('oil', PRO, 'couple'), ok('oil', PRO, 'solo')],
        modelFromLook: true,
        rng: () => 0.1, // direct to the primary, so the chain starts at flux
        ...over,
      })!;

    it('round-robins every model in the pool, once each, starting from the one that failed', () => {
      const c = build();
      const seen = [c.model, c.forAttempt(2).model, c.forAttempt(3).model];
      expect(seen[0]).toBe(PRO);
      expect(new Set(seen).size).toBe(3);
      expect(seen).toEqual(expect.arrayContaining([PRO, GEMINI, GROK]));
    });

    it('keeps the look across every step of the chain', () => {
      const c = build();
      expect(c.forAttempt(2).look.key).toBe('oil');
      expect(c.forAttempt(3).look.key).toBe('oil');
    });

    it('stamps each step so a failed dream can be read back: the fallback roll, then chain N of M', () => {
      const c = build();
      // 2026-09-18: attempt 2 is the policy's fallback roll (POLICY3 couple fallback = [GEMINI]).
      expect(c.forAttempt(2).stamps[0]).toBe('policy:couple:2:gemini-2-image:fallback_roll');
      expect(c.forAttempt(3).stamps.some((st) => st.includes(':chain_3of3'))).toBe(true);
    });

    it('past the end of the chain it holds the last model rather than repeating the failed first', () => {
      const c = build();
      expect(c.forAttempt(4).model).toBe(c.forAttempt(3).model);
    });

    it('when the chain is exhausted the SINGLE starts over at the solo primary, not the rebuild model', () => {
      const rebuild = build().forRebuild();
      expect(rebuild.model).toBe(PRO);
      expect(rebuild.look.key).toBe('oil');
      expect(rebuild.stamps.some((st) => st.includes(':chain_restart'))).toBe(true);
      expect(rebuild.stamps.some((st) => st.startsWith('policy:solo_rebuild:1:flux-2-flex'))).toBe(
        false
      );
    });

    it('the single skips a model the look was graded NO on for solos', () => {
      const rebuild = build({
        approvals: [
          ok('oil', PRO, 'couple'),
          ok('oil', GEMINI, 'solo'),
          { lookKey: 'oil', model: PRO, surface: 'solo' as const, approved: false },
        ],
      }).forRebuild();
      expect(rebuild.model).not.toBe(PRO);
    });
  });
});

/**
 * DAY-OF MODEL FIT (2026-09-13). A curated holiday look is pinned over the rolled one and carries its OWN
 * `dream_mediums.allowed_models`. `halloween_digital_painting` names three models and flux-1.1-pro is not one of
 * them, while the other five halloween looks do include it — so before this fix a day-of cast render could ship a
 * look on a model that look's own row forbids, on the one night of the year that is guaranteed to be a holiday.
 */
describe('restrictModels — the pinned look clips the model pool', () => {
  const HOL_POLICY: NightlyModelPolicy = {
    couple: { primaryModels: [PRO, GEMINI, GROK], fallbackModels: [GEMINI] },
    solo: { primaryModels: [PRO, GEMINI, GROK], fallbackModels: [GEMINI] },
    solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
    scene: { primaryModels: [PRO], fallbackModels: [] },
  };
  // the live row: flux-2-flex + gemini + grok, NO flux-1.1-pro
  const DIGITAL_PAINTING_MODELS = [FLEX, GEMINI, GROK];
  const HOL_LOOKS = [...LOOKS, look('halloween_digital_painting', 'unfiled')];

  const build = (restrict: readonly string[] | null, rngFn = () => 0.01) =>
    buildStyleContract({
      surface: 'solo',
      policy: HOL_POLICY,
      modelFromLook: true,
      looks: HOL_LOOKS,
      approvals: APPROVALS,
      pinnedLook: 'halloween_digital_painting',
      restrictModels: restrict,
      rng: rngFn,
    });

  it('without the clip the pin can land on a model the look forbids (the bug)', () => {
    const c = build(null);
    expect(c).not.toBeNull();
    expect(c!.look.key).toBe('halloween_digital_painting');
    expect(c!.model).toBe(PRO); // the surface primary — exactly what the row excludes
  });

  it('with the clip the first pick is always one of the row’s own models', () => {
    for (const r of [0.01, 0.3, 0.49, 0.51, 0.7, 0.99]) {
      const c = build(DIGITAL_PAINTING_MODELS, () => r);
      expect(c).not.toBeNull();
      expect(DIGITAL_PAINTING_MODELS).toContain(c!.model);
      expect(c!.model).not.toBe(PRO);
    }
  });

  it('clips EVERY retry in the chain, not just the first pick', () => {
    const c = build(DIGITAL_PAINTING_MODELS)!;
    const seen = [c.model];
    for (let attempt = 2; attempt <= 6; attempt++) {
      const p = c.forAttempt(attempt);
      expect(DIGITAL_PAINTING_MODELS).toContain(p.model);
      expect(p.model).not.toBe(PRO);
      seen.push(p.model);
    }
    // the pin survives every attempt — a day-of render never silently loses its holiday look
    expect(c.forAttempt(3).look.key).toBe('halloween_digital_painting');
    expect(seen.length).toBe(6);
  });

  it('clips the couple→solo rebuild too', () => {
    const c = buildStyleContract({
      surface: 'couple',
      policy: HOL_POLICY,
      modelFromLook: true,
      looks: HOL_LOOKS,
      approvals: APPROVALS,
      pinnedLook: 'halloween_digital_painting',
      restrictModels: DIGITAL_PAINTING_MODELS,
      rng: () => 0.01,
    })!;
    const r = c.forRebuild();
    expect(DIGITAL_PAINTING_MODELS).toContain(r.model);
    expect(r.look.key).toBe('halloween_digital_painting');
  });

  it('stamps the clip so a render says which pool it drew from', () => {
    const c = build(DIGITAL_PAINTING_MODELS)!;
    expect(c.stamps.some((s) => s.startsWith('model_restrict:'))).toBe(true);
  });

  it('fails OPEN when the row allows nothing this surface runs — a day-of render must ship', () => {
    const c = build(['some/model-nobody-runs'])!;
    expect([PRO, GEMINI, GROK]).toContain(c.model);
    expect(c.stamps).toContain('model_restrict:empty:3');
  });

  it('no restriction = the unclipped pool (every other look is untouched)', () => {
    const c = buildStyleContract({
      surface: 'solo',
      policy: HOL_POLICY,
      modelFromLook: true,
      looks: HOL_LOOKS,
      approvals: APPROVALS,
      rng: () => 0.01,
    })!;
    expect(c.stamps.some((s) => s.startsWith('model_restrict:'))).toBe(false);
  });
});

/**
 * LOCK LOOK (2026-09-13). The minimal engine re-renders a failed couple WITHOUT re-assembling the prompt, so the
 * look cannot change between attempts — the pixels always carry the original fragment. Before this flag a retry
 * could stamp `look_retry:2:reroll:<other>` and rewrite the logged look, describing a render that never happened.
 */
describe('lockLook — minimal retries keep the look so the stamps stay honest', () => {
  const MIN_POLICY: NightlyModelPolicy = {
    couple: { primaryModels: [PRO, GEMINI, GROK], fallbackModels: [GEMINI] },
    solo: { primaryModels: [PRO, GEMINI, GROK], fallbackModels: [GEMINI] },
    solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
    scene: { primaryModels: [PRO], fallbackModels: [] },
  };
  // 'pinned_oil' is graded on PRO for couple; 'other_wc' is graded on GEMINI. The chain's second rung is GEMINI,
  // so an unlocked retry swaps the look — exactly the silent substitution being fixed.
  const MIN_LOOKS = [look('pinned_oil', 'painted_realism'), look('other_wc', 'watercolor')];
  const MIN_APPROVALS = [
    ok('pinned_oil', PRO, 'couple'),
    ok('pinned_oil', PRO, 'solo'),
    ok('other_wc', GEMINI, 'couple'),
    ok('other_wc', GEMINI, 'solo'),
  ];
  const mk = (lock: boolean) =>
    buildStyleContract({
      surface: 'couple',
      policy: MIN_POLICY,
      modelFromLook: true,
      lockLook: lock,
      looks: MIN_LOOKS,
      approvals: MIN_APPROVALS,
      rng: () => 0.01,
    })!;

  it('unlocked, a model move can re-roll the look (what made the stamps lie)', () => {
    const c = mk(false);
    const rerolled = [2, 3, 4].map((a) => c.forAttempt(a)).some((p) => p.look.key !== c.look.key);
    expect(rerolled).toBe(true);
  });

  it('locked, every attempt keeps the look that is actually in the prompt', () => {
    const c = mk(true);
    for (let a = 2; a <= 5; a++) {
      const p = c.forAttempt(a);
      expect(p.look.key).toBe(c.look.key);
      expect(p.stamps.some((s) => s.includes(':reroll:'))).toBe(false);
    }
  });

  it('locked still MOVES THE MODEL — the whole point of the retry ladder', () => {
    const c = mk(true);
    const models = new Set([c.model, c.forAttempt(3).model, c.forAttempt(4).model]);
    expect(models.size).toBeGreaterThan(1);
  });

  it('locked keeps the look through the solo rebuild as well', () => {
    const c = mk(true);
    expect(c.forRebuild().look.key).toBe(c.look.key);
  });
});

/**
 * EVEN MODEL SPLIT — scene-only renders (Kevin, 2026-09-14: "all 25% for scene only").
 *
 * This flag used to be NECESSARY: the roll sent a hardcoded 50% of renders straight to the first primary and
 * ignored `primary_weights` entirely, so a 25/25/25/25 policy row would NOT have produced an even split.
 *
 * It is now largely redundant — the roll is weighted on the DB row, and equal weights ARE an even split, tunable
 * without a deploy. The flag survives as an explicit "ignore the configured weights" override that a dashboard
 * edit cannot accidentally undo. These tests lock BOTH: the flag still forces uniform, and the default path now
 * honours whatever the row says.
 */
describe('evenModelSplit', () => {
  const ULTRA = 'black-forest-labs/flux-1.1-pro-ultra';
  const FOUR = [PRO, GEMINI, GROK, ULTRA];
  const SCENE_POLICY: NightlyModelPolicy = {
    couple: { primaryModels: [PRO], fallbackModels: [] },
    solo: { primaryModels: [PRO], fallbackModels: [] },
    solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
    scene: { primaryModels: FOUR, fallbackModels: [] },
  };
  // A CONSTANT rng makes every branch deterministic without depending on how many draws resolveLook makes:
  // the weighted pick walks the cumulative weights and the uniform draw is `floor(v * poolSize)`.
  const build = (even: boolean, v: number, surface: 'scene' | 'couple' = 'scene') =>
    buildStyleContract({
      surface,
      policy:
        surface === 'couple'
          ? { ...SCENE_POLICY, couple: { primaryModels: FOUR, fallbackModels: [] } }
          : SCENE_POLICY,
      modelFromLook: true,
      evenModelSplit: even,
      looks: LOOKS,
      approvals: APPROVALS,
      rng: () => v,
    });

  it('OFF: the roll is WEIGHTED on the policy row rather than jumping to the primary', () => {
    const c = build(false, 0.1)!;
    expect(c.model).toBe(PRO);
    expect(c.stamps.some((s) => s.startsWith('model_roll:direct:'))).toBe(false);
    expect(c.stamps).toContain('model_roll:weighted:1/1/1/1');
  });

  it('ON: the same draw no longer jumps — it comes from the pool', () => {
    const c = build(true, 0.1)!;
    expect(c.stamps.some((s) => s.startsWith('model_roll:direct:'))).toBe(false);
    expect(c.stamps).toContain(`model_roll:even:${FOUR.length}`);
  });

  it('ON: each quarter of the roll maps to a different model, ultra included', () => {
    expect(build(true, 0.1)!.model).toBe(FOUR[0]);
    expect(build(true, 0.3)!.model).toBe(FOUR[1]);
    expect(build(true, 0.6)!.model).toBe(FOUR[2]);
    expect(build(true, 0.9)!.model).toBe(FOUR[3]);
  });

  it('ON: the split is EVEN across a uniform sweep — every model lands within 20-30%', () => {
    const counts: Record<string, number> = {};
    const N = 4000;
    for (let i = 0; i < N; i++) {
      const c = build(true, (i + 0.5) / N);
      if (c) counts[c.model] = (counts[c.model] ?? 0) + 1;
    }
    for (const m of FOUR) {
      const share = (counts[m] ?? 0) / N;
      expect(share).toBeGreaterThan(0.2);
      expect(share).toBeLessThan(0.3);
    }
  });

  it('OFF with EQUAL weights is now ALSO even — the flag is no longer what makes it fair', () => {
    const counts: Record<string, number> = {};
    const N = 4000;
    for (let i = 0; i < N; i++) {
      const c = build(false, (i + 0.5) / N);
      if (c) counts[c.model] = (counts[c.model] ?? 0) + 1;
    }
    for (const m of FOUR) {
      const share = (counts[m] ?? 0) / N;
      expect(share).toBeGreaterThan(0.2);
      expect(share).toBeLessThan(0.3);
    }
  });

  it('OFF is the default — cast surfaces roll the configured weights', () => {
    const c = build(false, 0.1, 'couple')!;
    expect(c.stamps.some((s) => s.startsWith('model_roll:weighted:'))).toBe(true);
  });
});

/**
 * SCENE IGNORES PER-LOOK MODEL REJECTIONS (Kevin, 2026-09-14: "we shouldn't have any looks banned on any models
 * for scene only — it doesn't have to worry about a face swap").
 *
 * Every `approved = false` row is a FACE-SWAP judgement: whether that look carries a swapped likeness on that
 * model. A personless scene has no face to carry, so the rejection has nothing to say about it. Applying it
 * anyway also skewed the roll — the only ungraded model survived every pool and took 58% of scene renders.
 */
describe('scene surface and look-model rejections', () => {
  const ULTRA2 = 'black-forest-labs/flux-1.1-pro-ultra';
  const POOL4 = [PRO, GEMINI, GROK, ULTRA2];
  const POLICY4: NightlyModelPolicy = {
    couple: { primaryModels: POOL4, fallbackModels: [] },
    solo: { primaryModels: POOL4, fallbackModels: [] },
    solo_rebuild: { primaryModels: [FLEX], fallbackModels: [] },
    scene: { primaryModels: POOL4, fallbackModels: [] },
  };
  // 'oil' is REJECTED on flux for solo — a face-swap judgement
  const WITH_REJECT: LookApproval[] = [
    ...APPROVALS,
    { lookKey: 'oil', model: PRO, surface: 'solo', approved: false },
  ];
  const build = (surface: 'scene' | 'solo', v: number) =>
    buildStyleContract({
      surface,
      policy: POLICY4,
      modelFromLook: true,
      evenModelSplit: surface === 'scene',
      looks: [look('oil')],
      approvals: WITH_REJECT,
      rng: () => v,
    });

  it('SOLO still honours the rejection — the face-swap grade stands where a face exists', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const c = build('solo', (i + 0.5) / 200);
      if (c) seen.add(c.model);
    }
    expect(seen.has(PRO)).toBe(false);
  });

  it('SCENE ignores it — every model in the row stays available', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 400; i++) {
      const c = build('scene', (i + 0.5) / 400);
      if (c) seen.add(c.model);
    }
    expect(seen.size).toBe(POOL4.length);
    expect(seen.has(PRO)).toBe(true);
  });

  it('SCENE says so in the stamps', () => {
    expect(build('scene', 0.3)!.stamps).toContain('scene_ignores_look_model_bans');
    expect(build('solo', 0.3)!.stamps).not.toContain('scene_ignores_look_model_bans');
  });

  it('with the filter gone the scene split is genuinely even — no ungraded-model skew', () => {
    const counts: Record<string, number> = {};
    const N = 4000;
    for (let i = 0; i < N; i++) {
      const c = build('scene', (i + 0.5) / N);
      if (c) counts[c.model] = (counts[c.model] ?? 0) + 1;
    }
    for (const m of POOL4) {
      const share = (counts[m] ?? 0) / N;
      expect(share).toBeGreaterThan(0.2);
      expect(share).toBeLessThan(0.3);
    }
  });
});

describe('first re-render = the policy fallback roll (Kevin 2026-09-18)', () => {
  // "make it roll between flux 2 flex and gemini for the first-try miss fallback … same roll for singles too".
  const ROLL_POLICY: NightlyModelPolicy = {
    couple: {
      primaryModels: [PRO, GEMINI],
      primaryWeights: [100, 0],
      fallbackModels: [FLEX, GEMINI],
      fallbackWeights: [50, 50],
    },
    solo: {
      primaryModels: [PRO, GEMINI],
      primaryWeights: [100, 0],
      fallbackModels: [FLEX, GEMINI],
      fallbackWeights: [50, 50],
    },
    solo_rebuild: { primaryModels: [PRO], fallbackModels: [] },
    scene: { primaryModels: [PRO, GEMINI], fallbackModels: [] },
  };
  const build = (
    surface: 'couple' | 'solo',
    rng: () => number,
    over: Record<string, unknown> = {}
  ) =>
    buildStyleContract({
      surface,
      policy: ROLL_POLICY,
      looks: LOOKS,
      approvals: [ok('oil', PRO, surface), ok('oil', GEMINI, surface)],
      modelFromLook: true,
      rng,
      ...over,
    })!;

  it('a couple that fails on flux re-renders on the fallback roll: flex at one end of the dice, gemini at the other', () => {
    const low = build('couple', () => 0.1);
    expect(low.model).toBe(PRO);
    expect(low.forAttempt(2).model).toBe(FLEX);
    expect(low.forAttempt(2).stamps[0]).toBe('policy:couple:2:flux-2-flex:fallback_roll');
    const high = build('couple', () => 0.9);
    expect(high.forAttempt(2).model).toBe(GEMINI);
    expect(high.forAttempt(2).stamps[0]).toBe('policy:couple:2:gemini-2-image:fallback_roll');
  });

  it('the failed model never repeats and the look is kept', () => {
    for (const r of [0.1, 0.5, 0.9]) {
      const c = build('couple', () => r);
      expect(c.forAttempt(2).model).not.toBe(PRO);
      expect(c.forAttempt(2).look.key).toBe('oil');
    }
  });

  it('the same roll applies to singles', () => {
    expect(build('solo', () => 0.1).forAttempt(2).model).toBe(FLEX);
    expect(build('solo', () => 0.9).forAttempt(2).model).toBe(GEMINI);
    expect(build('solo', () => 0.1).forAttempt(2).stamps[0]).toBe(
      'policy:solo:2:flux-2-flex:fallback_roll'
    );
  });

  it('a banned fallback model drops out of the roll with its weight', () => {
    const c = build('couple', () => 0.1, { bans: new Set([FLEX]) });
    expect(c.forAttempt(2).model).toBe(GEMINI);
  });

  it('an empty fallback row keeps the graded-chain walk', () => {
    const c = build('couple', () => 0.1, {
      policy: { ...ROLL_POLICY, couple: { primaryModels: [PRO, GEMINI], fallbackModels: [] } },
    });
    expect(c.forAttempt(2).model).toBe(GEMINI);
    expect(c.forAttempt(2).stamps[0]).toContain(':chain_2of2');
  });
});

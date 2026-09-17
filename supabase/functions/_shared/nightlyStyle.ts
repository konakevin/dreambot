/**
 * nightlyStyle.ts — the STYLE CONTRACT (NIGHTLY_LOOKS_REFACTOR_PLAN.md §2): ONE decision, made once, about how a
 * nightly render looks — the model (weighted policy roll for the surface), the look (family-first roll from the
 * per-model approvals), the fragments that go into the prompt, and the answers for a couple retry and a solo
 * rebuild. Pure: no I/O, injected rng. Locked by __tests__/lib/nightlyStyle.test.ts.
 *
 *   surface (couple | solo | scene)
 *     → PAIR   = sample one valid (model, look) pair — NIGHTLY_PAIR_ROLL_PLAN.md
 *                model = weighted pick over the surface's primary_models (primary_weights, renormalised
 *                        over whatever survives the bans / restrictModels / a pin)
 *                look  = family-first roll over the looks THAT model may render (not-rejected), or the
 *                        pinned key (day-of look set › holiday-scene pin › scenario pin)
 *                A pin does not invert the order: it collapses the LOOK dimension to one value and the
 *                model is still sampled from whoever can render it. Day-of is an input, not a branch.
 *     → contract { model, look, fragment, sceneFragment, directive, forAttempt(n), forRebuild() }
 *
 * Scene-only renders (no cast) roll from the SOLO approvals of the model (a look that renders a person well on
 * that model renders a scene well). The vibe keeps its own roll in the render (the third axis); per-look vibe bans
 * can be added on the row when the vibe axis test says so.
 */
import {
  resolveModel,
  type NightlyModelPolicy,
  type PolicySurface,
  weightedList,
  pickWeighted,
} from './nightlyModelPolicy.ts';
import {
  resolveLook,
  approvedModelsFor,
  rejectedModelsFor,
  rejectedLooksForModel,
  type LookApproval,
  type LookRow,
  type LookSurface,
} from './nightlyLooks.ts';
import {
  resolveVibe,
  type ResolvedVibeChoice,
  type VibeRow,
  LOOKS_EXCLUDED_VIBE_VERSIONS,
} from './nightlyVibes.ts';
import {
  COUPLE_EXCLUDED_VIBE_FAMILIES,
  FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES,
} from './nightlyVibes.ts';

/** The first couple re-render stays on the attempt-1 model (see forAttempt). `false` = every re-render moves to the
 *  policy's fallback model (the r5-r20 behaviour). */
export const RETRY_SAME_MODEL_FIRST = true;

/** Fallback pin for a SOLO when the policy row names no primary. The live pin DERIVES from
 *  `nightly_model_policy.solo.primary_models[0]` (see soloPinFor) so "our primary model" is one row in the database,
 *  not a constant that drifts the day the primary changes — the same rule the bot-cadence monitor follows. */
export const SOLO_PINNED_MODEL_FALLBACK = 'black-forest-labs/flux-1.1-pro';

/** EVERY LOOK ON EVERY MODEL (Kevin, 2026-09-13: "all looks enabled for all models, i think that makes 3 total?").
 *  The per-(look x model) approvals stop deciding WHICH MODEL renders a look — the model pool becomes the surface's
 *  policy primaries, all three of them, so a failed couple always has two more to round-robin through. Approvals
 *  still decide which looks may roll on a SURFACE at all, so his couple/solo grading is not discarded.
 *  `false` restores the graded-model-only pool. */
export const LOOKS_ALL_MODELS = true;

/**
 * DEPRECATED, and kept only so nothing importing it breaks — the live roll no longer reads it.
 *
 * It used to decide how often a render went STRAIGHT to the surface's primary instead of rolling the pool
 * (0.5 → flux 75% on a two-model pool). Every change to a model's share therefore meant editing this line
 * and deploying, which happened three times in one evening — while `nightly_model_policy.primary_weights`
 * sat in the database, already set on purpose, and was ignored by this path. Couple read 51/49 in the
 * dashboard and rendered 75/25.
 *
 * The roll is now WEIGHTED on those DB weights (see resolveStyle). To change a share:
 *   UPDATE nightly_model_policy SET primary_weights = '{75,25}' WHERE surface = 'solo';
 * No deploy. Reproduce the old behaviour on a two-model pool with weights {75,25}.
 */
export const PRIMARY_DIRECT_SHARE = 0.5;

/** The model a surface STARTS on: that policy row's FIRST primary (Kevin 2026-09-13, "whatever our primary/1st
 *  model is" for solos; "couples always first try on flux 1.1pro" for couples). Applied only where the rolled look
 *  is GRADED on it — a look he marked no for that model never renders there, whatever the row says. */
export function primaryFor(policy: NightlyModelPolicy, surface: PolicySurface): string {
  const row = policy[surface];
  const first = row && row.primaryModels ? row.primaryModels[0] : null;
  return first || SOLO_PINNED_MODEL_FALLBACK;
}

export type StyleSurface = 'couple' | 'solo' | 'scene';

export interface StyleContractInput {
  surface: StyleSurface;
  policy: NightlyModelPolicy;
  bans?: ReadonlySet<string> | null;
  forceModel?: string | null;
  /** THE PAIR ROLL (the minimal/live state). `true` samples a valid (model, look) pair: the model from the
   *  surface's primary_weights, then a look that model may render. It replaced a look-first roll that let a
   *  model forfeit its configured weight on every look it was rejected for — measured 2026-09-17, a 70/15/15
   *  config delivered 35/35/30. A retry moves to another model the SAME look is graded on (Kevin: "allow the
   *  move"), which is what keeps a failed couple from degrading to a solo. */
  modelFromLook?: boolean;
  looks: readonly LookRow[];
  approvals: readonly LookApproval[];
  recentLookKeys?: readonly string[];
  recencyWindow?: number;
  /** Chance (0-100) of drawing the look from the legacy family first (mig 513). */
  legacyPct?: number;
  /** QA `force_look` — beats every pin. */
  forcedLook?: string | null;
  /** A pin from the scene data (day-of look set, holiday-scene medium_key, scenario medium_key); an unknown key
   *  falls through to the roll with a stamp. */
  pinnedLook?: string | null;
  /** The vibe axis (NIGHTLY_VIBES_AUDIT.md §9): the pool rows; omitted = no vibe decision (contract.vibe null). */
  vibes?: readonly VibeRow[];
  recentVibeKeys?: readonly string[];
  vibeRecency?: number;
  /** QA `force_vibe` — any active row, pool or not. */
  forcedVibe?: string | null;
  /** THE PINNED LOOK'S OWN `dream_mediums.allowed_models` (2026-09-13, day-of fix). A curated holiday look is a
   *  real medium row with its own model list — `halloween_digital_painting` names three models and flux-1.1-pro is
   *  not one of them — so when a pin overrides the rolled look, the model pool must be clipped to what that row
   *  allows, for the FIRST pick and for every retry in the chain. Empty intersection = fail open (the pool stands)
   *  with a stamp, because a day-of render must never fail to render. Omitted = no clipping (the normal roll). */
  restrictModels?: readonly string[] | null;
  /** EVEN SPLIT across the surface's model pool (Kevin, 2026-09-14: "all 25% for scene only") — an explicit
   *  "ignore the configured weights and roll evenly" escape hatch. Mostly redundant now that the roll is
   *  weighted, since equal `primary_weights` ARE an even split and are tunable without a deploy; prefer setting
   *  the weights. Kept because it is an unambiguous override that cannot be undone by a dashboard edit. */
  evenModelSplit?: boolean;
  /** MINIMAL retries re-render WITHOUT re-assembling the prompt, so the look cannot change between attempts —
   *  the prompt still carries the original look's fragment. `true` makes every retry KEEP the look, so the stamps
   *  and `ai_generation_log` describe what actually rendered instead of a re-roll that never reached the pixels. */
  lockLook?: boolean;
  rng?: () => number;
}

export interface StylePick {
  model: string;
  look: LookRow;
  /** The fragment for THIS surface (cast = swap fragment, scene = scene fragment). */
  fragment: string;
  stamps: string[];
}

export interface StyleContract extends StylePick {
  surface: StyleSurface;
  lookSurface: LookSurface;
  sceneFragment: string;
  swapFragment: string;
  directive: string | null;
  family: string;
  source: 'roll' | 'force' | 'pin';
  /** The vibe (third axis): its verbatim fragment + position for the slot input; null when no pool was given. */
  vibe: ResolvedVibeChoice | null;
  /** Couple retry n ≥ 2: the policy fallback roll for the model; the same look if approved there, else a re-roll. */
  forAttempt(attempt: number): StylePick;
  /** Couple → solo rebuild: the solo_rebuild row's model; the same look if approved for (model, solo), else one that is. */
  forRebuild(): StylePick;
}

const short = (m: string) => m.replace(/^.*\//, '');

/** Intersect a model pool with a pinned medium row's `allowed_models`. Fails OPEN (returns the pool unchanged, with
 *  a stamp) when the row names nothing this surface can run — a day-of render must ship, and a model the row did not
 *  list beats no render at all. */
export function clipToRestrict(
  pool: readonly string[],
  restrict: readonly string[] | null | undefined,
  stamps: string[],
  tag: string
): readonly string[] {
  if (!restrict || restrict.length === 0) return pool;
  const allow = new Set(restrict);
  const kept = pool.filter((m) => allow.has(m));
  if (kept.length === 0) {
    stamps.push(`${tag}:empty:${pool.length}`);
    return pool;
  }
  if (kept.length !== pool.length) stamps.push(`${tag}:${kept.length}of${pool.length}`);
  return kept;
}

function fragmentFor(look: LookRow, lookSurface: LookSurface, surface: StyleSurface): string {
  if (surface === 'scene') return look.fragment;
  return look.swapFragment && look.swapFragment.trim().length > 0
    ? look.swapFragment
    : look.fragment;
}

function isApproved(
  approvals: readonly LookApproval[],
  lookKey: string,
  model: string,
  surface: LookSurface
): boolean {
  return approvals.some(
    (a) => a.approved && a.lookKey === lookKey && a.model === model && a.surface === surface
  );
}

export function buildStyleContract(input: StyleContractInput): StyleContract | null {
  const rng = input.rng ?? Math.random;
  const stamps: string[] = [];
  const policySurface: PolicySurface = input.surface === 'scene' ? 'scene' : input.surface;
  const lookSurface: LookSurface = input.surface === 'scene' ? 'solo' : input.surface;

  const lookFirst = input.modelFromLook === true;

  // A pin is a forced look unless the key is unknown (then the roll decides and we say so).
  const pinKey = input.forcedLook ?? input.pinnedLook ?? null;
  const pinKnown = pinKey ? input.looks.some((l) => l.key === pinKey) : false;
  if (pinKey && !pinKnown) stamps.push(`look_pin_unknown:${pinKey}`);

  let resolved: ReturnType<typeof resolveLook> = null;
  let modelId = '';
  /** Every model that can render the look we end up with — the retry ladder's round-robin set (§3.4 of
   *  NIGHTLY_PAIR_ROLL_PLAN.md: a retry re-samples the MODEL dimension while holding the look). Populated
   *  once the pair is resolved, from the same policy row and the same filters the first pick used. */
  let lookModels: readonly string[] = [];

  if (lookFirst) {
    // ── THE PAIR ROLL (NIGHTLY_PAIR_ROLL_PLAN.md) ────────────────────────────────────────────────────
    // ONE mechanism: sample a valid (model, look) PAIR. Everything else is a filter on that pair space —
    // a pin, a QA force_model, the bans, the pinned medium's own allowed_models.
    //
    // WHY IT IS NOT "roll the look, then the model". That order let a model FORFEIT its configured weight
    // on every look it was rejected for, and handed the forfeit to whoever was left. Measured 2026-09-17:
    // a batch configured flux 70 / gemini 15 / seedream 15 delivered 35 / 35 / 30, because flux is
    // rejected on 37 of 57 looks and seedream — ungraded, so never rejected — sat in every pool and
    // collected the difference. The weights were applied correctly on each render; the POOL was the
    // variable. Same trap previously handed flux-1.1-pro-ultra 58% of scene renders instead of 25%.
    //
    // WHY A PIN IS NOT A SECOND PATH. A pinned look (day-of, holiday scene, scenario medium_key) does not
    // invert the roll order — it collapses the LOOK dimension to a single value, which leaves the model
    // dimension sampled exactly as always, from whichever models can render that look. Day-of is an input
    // here, not a branch beside it.
    // SCENE IGNORES THE PER-LOOK MODEL REJECTIONS (Kevin, 2026-09-14: "we shouldn't have any looks banned
    // on any models for scene only — it doesn't have to worry about a face swap"). Every `approved = false`
    // row is a FACE-SWAP judgement: whether that look carries a swapped likeness on that model. A personless
    // scene has no face to carry, so the rejection has nothing to say about it. Keeping the filter also
    // skewed the roll — the one model with NO grades survived every pool and took 58% of scene renders.
    const sceneIgnoresRejections = input.surface === 'scene';
    if (sceneIgnoresRejections) stamps.push('scene_ignores_look_model_bans');
    const row = input.policy[policySurface];
    let candidates: readonly string[] = input.forceModel
      ? [input.forceModel]
      : (row?.primaryModels ?? []);
    if (!input.forceModel) {
      candidates = candidates.filter((m) => !(input.bans && input.bans.has(m)));
      candidates = clipToRestrict(candidates, input.restrictModels, stamps, 'model_restrict');
      // The pin filters the MODEL dimension: only models that can actually render it survive. Fails open
      // with a stamp rather than starving — a day-of render must never fail to render.
      // SCENE is exempt from every look-model rejection (see sceneIgnoresRejections below), so its pin
      // never narrows the model pool either.
      if (pinKnown && pinKey && !sceneIgnoresRejections) {
        const rejected = rejectedModelsFor(input.approvals, pinKey, lookSurface);
        const able = candidates.filter((m) => !rejected.has(m));
        if (able.length > 0) candidates = able;
        else stamps.push(`pin_model_starved:${pinKey}`);
      }
    }

    // Weighted pick over the survivors, renormalised — a model filtered out here drops its weight with it
    // (weightedList pairs models and weights through the same filter), so the rest split what is left
    // rather than inheriting a skew. Then the LOOK is rolled from that model's own approved set, which is
    // what keeps a model off the looks it was graded NO on.
    //
    // A model can survive the filters and still have no eligible look (recency, family, grading). Rather
    // than fail, drop it and re-pick from the rest — the loop is the fallback ladder.
    // ELIGIBILITY IS "NOT REJECTED", NOT "EXPLICITLY APPROVED" — this is LOOKS_ALL_MODELS, and getting it
    // backwards breaks two things at once. `approvedLooks` requires an explicit approved row, so filtering
    // that way would (a) ignore a rejection whenever an approval row also exists for the same pair, since
    // the rejection is the LATER judgement that must win, and (b) give an UNGRADED model no looks at all —
    // seedream-4.5 has zero rows and would simply never render. So the look pool is every look approved on
    // any model, minus the ones THIS model was graded NO on.
    const looksFor = (m: string): readonly LookRow[] => {
      if (sceneIgnoresRejections) return input.looks;
      const rejected = rejectedLooksForModel(input.approvals, m, lookSurface);
      return input.looks.filter((l) => !rejected.has(l.key));
    };
    const remaining = [...candidates];
    while (remaining.length > 0 && !resolved) {
      const excluded = new Set((row?.primaryModels ?? []).filter((m) => !remaining.includes(m)));
      const weighted = weightedList(row?.primaryModels ?? [], row?.primaryWeights, excluded);
      const picked =
        input.evenModelSplit === true || weighted.models.length === 0
          ? remaining[Math.floor(rng() * remaining.length)]
          : pickWeighted(weighted, rng);
      const attempt = resolveLook({
        surface: lookSurface,
        model: picked,
        // anyModel over a pool ALREADY narrowed to what this model may render (see looksFor). Doing the
        // narrowing here rather than inside resolveLook is what keeps "not rejected" as the rule.
        anyModel: true,
        looks: looksFor(picked),
        approvals: input.approvals,
        recentLookKeys: input.recentLookKeys ?? [],
        recencyWindow: input.recencyWindow,
        legacyPct: input.legacyPct,
        forcedLook: pinKnown ? pinKey : null,
        rng,
      });
      if (attempt) {
        resolved = attempt;
        modelId = picked;
        stamps.push(
          `policy:${policySurface}:1:${short(modelId)}`,
          `model_source:pair:${candidates.length}`,
          input.evenModelSplit === true
            ? `model_roll:even:${remaining.length}`
            : `model_roll:weighted:${weighted.weights.join('/')}`
        );
      } else {
        // No look this model can render under the current constraints. Drop it and try the next.
        stamps.push(`pair_no_look:${short(picked)}`);
        remaining.splice(remaining.indexOf(picked), 1);
      }
    }

    // LAST RESORT: nothing in the pool could pair with a look. Take any model that can render anything,
    // ignoring the weights — a nightly render must ship.
    if (!resolved) {
      const anyLook = resolveLook({
        surface: lookSurface,
        model: '',
        anyModel: true,
        looks: input.looks,
        approvals: input.approvals,
        recentLookKeys: input.recentLookKeys ?? [],
        recencyWindow: input.recencyWindow,
        legacyPct: input.legacyPct,
        forcedLook: pinKnown ? pinKey : null,
        rng,
      });
      if (anyLook) {
        const able = (row?.primaryModels ?? []).filter(
          (m) => !rejectedModelsFor(input.approvals, anyLook.look.key, lookSurface).has(m)
        );
        modelId = input.forceModel ?? able[0] ?? (row?.primaryModels ?? [])[0] ?? '';
        resolved = anyLook;
        stamps.push(`pair_fallback_any:${short(modelId)}`);
      }
    }
  } else {
    // LEGACY / non-minimal path: the policy roll picks the model, then the look comes from its approvals.
    const pick = resolveModel({
      surface: policySurface,
      attempt: 1,
      policy: input.policy,
      bans: input.bans ?? null,
      forceModel: input.forceModel ?? null,
      rng,
    });
    stamps.push(pick.stamp);
    modelId = pick.model;
    resolved = resolveLook({
      surface: lookSurface,
      model: pick.model,
      anyModel: false,
      looks: input.looks,
      approvals: input.approvals,
      recentLookKeys: input.recentLookKeys ?? [],
      recencyWindow: input.recencyWindow,
      legacyPct: input.legacyPct,
      forcedLook: pinKnown ? pinKey : null,
      rng,
    });
  }

  if (!resolved) {
    stamps.push(`looks_path_no_look:${short(modelId)}:${lookSurface}`);
    return null;
  }
  stamps.push(...resolved.stamps.filter((s) => !s.startsWith('look_pin_unknown')));

  // The retry set: models graded OK for the look that actually rolled, minus bans. Holding the look and
  // moving the model is what stops a failed couple from degrading straight to a solo.
  {
    const rejectedForLook =
      input.surface === 'scene'
        ? new Set<string>()
        : rejectedModelsFor(input.approvals, resolved.look.key, lookSurface);
    let retrySet: readonly string[] = (input.policy[policySurface]?.primaryModels ?? []).filter(
      (m) => !rejectedForLook.has(m) && !(input.bans && input.bans.has(m))
    );
    // A pinned medium's own allowed_models clips EVERY retry in the chain, not just the first pick —
    // otherwise a day-of look's second attempt lands on a model that look forbids.
    retrySet = clipToRestrict(retrySet, input.restrictModels, stamps, 'model_restrict_retry');
    lookModels = retrySet.length > 0 ? retrySet : [modelId];
  }

  const source: StyleContract['source'] =
    input.forcedLook && pinKnown ? 'force' : input.pinnedLook && pinKnown ? 'pin' : 'roll';
  if (source === 'pin') stamps.push(`look_source:pin:${pinKey}`);

  const vibe = input.vibes
    ? resolveVibe({
        vibes: input.vibes,
        recentVibeKeys: input.recentVibeKeys,
        recencyWindow: input.vibeRecency,
        forcedVibe: input.forcedVibe,
        excludeFamilies: [
          ...(resolved.look.bannedVibes ?? []),
          ...(input.surface === 'couple' ? COUPLE_EXCLUDED_VIBE_FAMILIES : []),
          ...(input.surface === 'couple' && /flux/i.test(modelId)
            ? FLUX_COUPLE_EXCLUDED_VIBE_FAMILIES
            : []),
        ],
        excludeVersions: LOOKS_EXCLUDED_VIBE_VERSIONS,
        rng,
      })
    : null;
  if (vibe) stamps.push(...vibe.stamps);
  else if (input.vibes) stamps.push('vibe_none');

  const base = {
    surface: input.surface,
    lookSurface,
    model: modelId,
    look: resolved.look,
    fragment: fragmentFor(resolved.look, lookSurface, input.surface),
    sceneFragment: resolved.look.fragment,
    swapFragment: fragmentFor(resolved.look, lookSurface, 'solo'),
    directive: resolved.look.directive,
    family: resolved.family,
    source,
    vibe,
    stamps,
  };

  const pickFor = (
    model: string,
    surfaceForLook: LookSurface,
    surfaceForFragment: StyleSurface,
    tag: string
  ): StylePick => {
    const out: string[] = [];
    // Keep the contract's look when the new model approves it (or it was pinned / forced); else re-roll.
    // `lockLook` (minimal engine) also keeps it: that path re-renders without rebuilding the prompt, so a re-rolled
    // look would be stamped and logged but never actually rendered.
    if (
      input.lockLook === true ||
      source !== 'roll' ||
      isApproved(input.approvals, base.look.key, model, surfaceForLook)
    ) {
      out.push(`${tag}:keep:${base.look.key}`);
      return {
        model,
        look: base.look,
        fragment: fragmentFor(base.look, surfaceForLook, surfaceForFragment),
        stamps: out,
      };
    }
    const re = resolveLook({
      surface: surfaceForLook,
      model,
      looks: input.looks,
      approvals: input.approvals,
      recentLookKeys: [base.look.key, ...(input.recentLookKeys ?? [])],
      recencyWindow: input.recencyWindow,
      legacyPct: input.legacyPct,
      rng,
    });
    if (!re) {
      out.push(`${tag}:no_look:${short(model)}:keep:${base.look.key}`);
      return {
        model,
        look: base.look,
        fragment: fragmentFor(base.look, surfaceForLook, surfaceForFragment),
        stamps: out,
      };
    }
    out.push(`${tag}:reroll:${re.look.key}`);
    return {
      model,
      look: re.look,
      fragment: fragmentFor(re.look, surfaceForLook, surfaceForFragment),
      stamps: out,
    };
  };

  return {
    ...base,
    forAttempt(attempt: number): StylePick {
      // LOOK-FIRST MODEL CHAIN (Kevin, 2026-09-13): "try a 2nd model if the first char render fails, and so on …
      // if we get through all models then we resolve to a single and start over on the model chain". So the retry
      // walks a DETERMINISTIC chain of the models this look is graded on — the model that rendered first, then the
      // rest with flux ahead of the others — visiting each once, never repeating. Attempt n takes chain[n-1], so a
      // look graded on three models gets three distinct models before the pipeline gives up and degrades.
      if (lookFirst && !input.forceModel) {
        // Round robin: the model that just failed, then every OTHER model this look is graded on, each once.
        // A couple that started on flux without a flux grade simply has the whole graded pool ahead of it.
        const rest = lookModels.filter((m) => m !== base.model);
        const chain = [base.model, ...rest];
        if (chain.length > 1) {
          const next = chain[Math.min(attempt - 1, chain.length - 1)];
          const p = pickFor(next, lookSurface, input.surface, `look_retry:${attempt}`);
          p.stamps.unshift(
            `policy:${policySurface}:${attempt}:${short(next)}:chain_${Math.min(attempt - 1, chain.length - 1) + 1}of${chain.length}`
          );
          return p;
        }
        // The look is graded on ONE model only. Kevin 2026-09-13: "falls back to a new model instead of a single
        // when the first couple render fails" — so rather than re-rendering the same model until the swap gives up
        // and drops the +1, move to the policy's fallback model and let pickFor keep the look if it is approved
        // there or re-roll one that is. A model move always beats degrading to a solo.
        const next = resolveModel({
          surface: policySurface,
          attempt: Math.max(2, attempt),
          policy: input.policy,
          bans: input.bans ?? null,
          forceModel: null,
          previousModel: base.model,
          rng,
        });
        const p = pickFor(next.model, lookSurface, input.surface, `look_retry:${attempt}`);
        p.stamps.unshift(
          `policy:${policySurface}:${attempt}:${short(next.model)}:look_model_exhausted`
        );
        return p;
      }
      // 1.2.0 parity (parity loop, 2026-09-13): the FIRST re-render stays on the attempt-1 model with the same
      // look — flux-1.1-pro fails its first dual swap ~1/3 of the time in production too, and 1.2.0 (policy in
      // shadow) simply renders it again on flux, which is why its couples land on flux. Moving attempt 2 to the
      // fallback model shipped almost every flux couple on gemini / grok (r15-r20: 14 of 21). The fallback model is
      // now attempt 3 (the pipeline's last re-render) — the same ladder as 1.2.0 plus one last-resort model move.
      if (attempt === 2 && RETRY_SAME_MODEL_FIRST && !input.forceModel) {
        const p = pickFor(base.model, lookSurface, input.surface, `look_retry:${attempt}`);
        p.stamps.unshift(`policy:${policySurface}:${attempt}:${short(base.model)}:same`);
        return p;
      }
      const next = resolveModel({
        surface: policySurface,
        attempt: Math.max(2, RETRY_SAME_MODEL_FIRST ? attempt - 1 : attempt),
        policy: input.policy,
        bans: input.bans ?? null,
        forceModel: input.forceModel ?? null,
        previousModel: base.model,
        rng,
      });
      const p = pickFor(next.model, lookSurface, input.surface, `look_retry:${attempt}`);
      p.stamps.unshift(next.stamp.replace(/^(policy:[a-z_]+:)\d+:/, `$1${attempt}:`));
      return p;
    },
    forRebuild(): StylePick {
      // CHAIN RESTART (Kevin, 2026-09-13): "if we get through all models then we resolve to a single and start over
      // on the model chain". The single is a fresh start, so it takes the TOP of the chain for the solo surface —
      // the solo row's primary where this look is graded on it, otherwise the look's first graded solo
      // model. Without this the rebuild used the policy's solo_rebuild model, which approves no look at all.
      if (lookFirst) {
        // The rebuild pool obeys the same two exclusions as the first render: the models Kevin graded NO for this
        // look on SOLOS, and the bans. A single is still a render of that look and his judgment applies to it.
        const soloRejected = rejectedModelsFor(input.approvals, base.look.key, 'solo');
        const soloModels = clipToRestrict(
          (LOOKS_ALL_MODELS
            ? [...(input.policy.solo?.primaryModels ?? [])]
            : approvedModelsFor(input.approvals, base.look.key, 'solo')
          ).filter((m) => !soloRejected.has(m) && !(input.bans && input.bans.has(m))),
          input.restrictModels,
          [],
          'rebuild_restrict'
        );
        const pin = primaryFor(input.policy, 'solo');
        const restart = soloModels.includes(pin) ? pin : soloModels[0];
        if (restart) {
          const p = pickFor(restart, 'solo', 'solo', 'look_rebuild');
          p.stamps.unshift(
            `policy:solo_rebuild:1:${short(restart)}:chain_restart`,
            `look_rebuild:chain:${soloModels.length}`
          );
          return p;
        }
      }
      const next = resolveModel({
        surface: 'solo_rebuild',
        attempt: 1,
        policy: input.policy,
        bans: input.bans ?? null,
        forceModel: null,
        rng,
      });
      const p = pickFor(next.model, 'solo', 'solo', 'look_rebuild');
      p.stamps.unshift(next.stamp);
      // Round 19 (2026-09-13, parity loop r18 #10): the policy's solo_rebuild model (flux-2-flex) approves NO solo
      // look on the looks path, so the rebuild kept the couple's look on a model it was never graded on and shipped
      // identity 0.02 (r6 #1: 0.09). When the rebuild model approves nothing, rebuild on the COUPLE's model instead
      // (its solo approvals are the graded matrix); if even that approves nothing, the policy pick stands as before.
      if (
        next.model !== base.model &&
        p.stamps.some((st) => st.startsWith('look_rebuild:no_look:'))
      ) {
        const onCouple = pickFor(base.model, 'solo', 'solo', 'look_rebuild');
        if (!onCouple.stamps.some((st) => st.startsWith('look_rebuild:no_look:'))) {
          onCouple.stamps.unshift(next.stamp, `look_rebuild:model_fallback:${short(base.model)}`);
          return onCouple;
        }
      }
      return p;
    },
  };
}

/**
 * nightlyStyle.ts — the STYLE CONTRACT (NIGHTLY_LOOKS_REFACTOR_PLAN.md §2): ONE decision, made once, about how a
 * nightly render looks — the model (weighted policy roll for the surface), the look (family-first roll from the
 * per-model approvals), the fragments that go into the prompt, and the answers for a couple retry and a solo
 * rebuild. Pure: no I/O, injected rng. Locked by __tests__/lib/nightlyStyle.test.ts.
 *
 *   surface (couple | solo | scene)
 *     → model  = resolveModel(policy row for the surface, weights, bans, force_model)
 *     → look   = pinned key (day-of look set › holiday-scene pin › scenario pin) or
 *                resolveLook(approvals for model × surface, family-first, recency, force_look)
 *     → contract { model, look, fragment, sceneFragment, directive, forAttempt(n), forRebuild() }
 *
 * Scene-only renders (no cast) roll from the SOLO approvals of the model (a look that renders a person well on
 * that model renders a scene well). The vibe keeps its own roll in the render (the third axis); per-look vibe bans
 * can be added on the row when the vibe axis test says so.
 */
import { resolveModel, type NightlyModelPolicy, type PolicySurface } from './nightlyModelPolicy.ts';
import {
  resolveLook,
  approvedModelsFor,
  rejectedModelsFor,
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

/** How often a render goes STRAIGHT to the surface's primary model instead of rolling the pool (Kevin, 2026-09-13:
 *  "hardcode 50% to go direct to flux 1.1pro, and the other 50% random roll from all models in the pool. same thing
 *  with singles"). The roll includes the primary, so flux's real share is this plus its share of the remainder. */
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
  /** LOOK-FIRST (the minimal state, 2026-09-13). 1.2.0's rule is that the MEDIUM decides the model, so roll the
   *  look from everything approved for this surface on ANY model, then pick the model from that look's own approved
   *  set. The policy weights are not consulted. A retry moves to another model the SAME look is approved on (Kevin:
   *  "allow the move"), which is what keeps a failed couple from degrading to a solo. */
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
  // LOOK-FIRST: the look is rolled before any model, so the policy roll is skipped entirely and the model comes
  // from the look's own approved set below. A QA force_model still wins.
  const pick = lookFirst
    ? { model: input.forceModel ?? '', stamp: 'model_source:look' }
    : resolveModel({
        surface: policySurface,
        attempt: 1,
        policy: input.policy,
        bans: input.bans ?? null,
        forceModel: input.forceModel ?? null,
        rng,
      });
  if (!lookFirst) stamps.push(pick.stamp);

  // A pin is a forced look unless the key is unknown (then the roll decides and we say so).
  const pinKey = input.forcedLook ?? input.pinnedLook ?? null;
  const pinKnown = pinKey ? input.looks.some((l) => l.key === pinKey) : false;
  if (pinKey && !pinKnown) stamps.push(`look_pin_unknown:${pinKey}`);
  const resolved = resolveLook({
    surface: lookSurface,
    model: pick.model,
    anyModel: lookFirst,
    looks: input.looks,
    approvals: input.approvals,
    recentLookKeys: input.recentLookKeys ?? [],
    recencyWindow: input.recencyWindow,
    legacyPct: input.legacyPct,
    forcedLook: pinKnown ? pinKey : null,
    rng,
  });
  if (!resolved) {
    stamps.push(`looks_path_no_look:${short(pick.model)}:${lookSurface}`);
    return null;
  }
  stamps.push(...resolved.stamps.filter((s) => !s.startsWith('look_pin_unknown')));

  // LOOK-FIRST: the look Kevin's catalog just rolled now decides the model, uniformly among the models HE approved
  // it on for this surface. That is 1.2.0's rule (the medium picks the model) with his grades standing in for the
  // inherited Create-screen pin, which said flux for 48 of 49 looks while the grades say all three models work.
  let modelId = pick.model;
  let lookModels: readonly string[] = [];
  if (lookFirst) {
    // THE MODEL POOL. Opened to every model the surface's policy row names (Kevin: "all looks enabled for all
    // models, i think that makes 3 total?"), minus two exclusions: models he explicitly graded NO for this look and
    // surface ("keep the rejections, that's right"), and the day-of / nightly bans.
    const rejected = rejectedModelsFor(input.approvals, resolved.look.key, lookSurface);
    const approvedOn = LOOKS_ALL_MODELS
      ? [...(input.policy[policySurface]?.primaryModels ?? [])].filter((m) => !rejected.has(m))
      : approvedModelsFor(input.approvals, resolved.look.key, lookSurface);
    const allowed = approvedOn.filter((m) => !(input.bans && input.bans.has(m)));
    lookModels = allowed.length > 0 ? allowed : approvedOn;
    // SOLO PIN (Kevin, 2026-09-13): "i feel like we should be pinning flux 1.1pro for all singles renders … i think
    // it does a better job at the looks". Measured reliability is a wash (flux 97% identity over 112 solos vs 100%
    // on the other two), so this is his taste call about how the STYLES render, and it applies only where the look
    // is approved on flux — the five solo looks graded elsewhere (hand_tinted_photo, painted_comic_cover,
    // painted_animation, aquarelle_graphite, colored_pencil) keep the model that earned them. Couples are untouched:
    // that is the surface where flux actually fails, so they keep rolling across the look's approved set.
    // WHERE A RENDER STARTS (Kevin, 2026-09-13): "hardcode 50% to go direct to flux 1.1pro, and the other 50%
    // random roll from all models in the pool. same thing with singles." So half of every surface's renders go
    // straight to the policy primary and half roll the pool (the primary included), which lands flux at roughly
    // two thirds overall while every model still gets real time. A look that REJECTED the primary is not in the
    // pool, so it simply rolls.
    const pinModel = primaryFor(input.policy, policySurface);
    const directToPrimary =
      lookModels.includes(pinModel) && rng() < PRIMARY_DIRECT_SHARE ? pinModel : null;
    modelId =
      input.forceModel ?? directToPrimary ?? lookModels[Math.floor(rng() * lookModels.length)];
    stamps.push(
      `policy:${policySurface}:1:${short(modelId)}`,
      `model_source:look:${lookModels.length}`
    );
    stamps.push(directToPrimary ? `model_roll:direct:${short(pinModel)}` : 'model_roll:pool');
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
    if (source !== 'roll' || isApproved(input.approvals, base.look.key, model, surfaceForLook)) {
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
        const soloModels = (
          LOOKS_ALL_MODELS
            ? [...(input.policy.solo?.primaryModels ?? [])]
            : approvedModelsFor(input.approvals, base.look.key, 'solo')
        ).filter((m) => !soloRejected.has(m) && !(input.bans && input.bans.has(m)));
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

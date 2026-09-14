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
    const approvedOn = approvedModelsFor(input.approvals, resolved.look.key, lookSurface);
    const allowed = approvedOn.filter((m) => !(input.bans && input.bans.has(m)));
    lookModels = allowed.length > 0 ? allowed : approvedOn;
    modelId = input.forceModel ?? lookModels[Math.floor(rng() * lookModels.length)];
    stamps.push(
      `policy:${policySurface}:1:${short(modelId)}`,
      `model_source:look:${lookModels.length}`
    );
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
      // LOOK-FIRST: keep the look and move to another model IT is approved on (Kevin 2026-09-13, "allow the move").
      // 1.2.0 would re-render the same model and then drop the +1 to a generic figure; moving instead is what keeps
      // a failed couple a couple. Falls through to the policy ladder when the look has only the one model.
      if (lookFirst && !input.forceModel) {
        const others = lookModels.filter((m) => m !== base.model);
        if (others.length > 0) {
          const next = others[Math.floor(rng() * others.length)];
          const p = pickFor(next, lookSurface, input.surface, `look_retry:${attempt}`);
          p.stamps.unshift(`policy:${policySurface}:${attempt}:${short(next)}:look_model`);
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

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
import { resolveLook, type LookApproval, type LookRow, type LookSurface } from './nightlyLooks.ts';

export type StyleSurface = 'couple' | 'solo' | 'scene';

export interface StyleContractInput {
  surface: StyleSurface;
  policy: NightlyModelPolicy;
  bans?: ReadonlySet<string> | null;
  forceModel?: string | null;
  looks: readonly LookRow[];
  approvals: readonly LookApproval[];
  recentLookKeys?: readonly string[];
  recencyWindow?: number;
  /** QA `force_look` — beats every pin. */
  forcedLook?: string | null;
  /** A pin from the scene data (day-of look set, holiday-scene medium_key, scenario medium_key); an unknown key
   *  falls through to the roll with a stamp. */
  pinnedLook?: string | null;
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

  const pick = resolveModel({
    surface: policySurface,
    attempt: 1,
    policy: input.policy,
    bans: input.bans ?? null,
    forceModel: input.forceModel ?? null,
    rng,
  });
  stamps.push(pick.stamp);

  // A pin is a forced look unless the key is unknown (then the roll decides and we say so).
  const pinKey = input.forcedLook ?? input.pinnedLook ?? null;
  const pinKnown = pinKey ? input.looks.some((l) => l.key === pinKey) : false;
  if (pinKey && !pinKnown) stamps.push(`look_pin_unknown:${pinKey}`);
  const resolved = resolveLook({
    surface: lookSurface,
    model: pick.model,
    looks: input.looks,
    approvals: input.approvals,
    recentLookKeys: input.recentLookKeys ?? [],
    recencyWindow: input.recencyWindow,
    forcedLook: pinKnown ? pinKey : null,
    rng,
  });
  if (!resolved) {
    stamps.push(`looks_path_no_look:${short(pick.model)}:${lookSurface}`);
    return null;
  }
  stamps.push(...resolved.stamps.filter((s) => !s.startsWith('look_pin_unknown')));
  const source: StyleContract['source'] =
    input.forcedLook && pinKnown ? 'force' : input.pinnedLook && pinKnown ? 'pin' : 'roll';
  if (source === 'pin') stamps.push(`look_source:pin:${pinKey}`);

  const base = {
    surface: input.surface,
    lookSurface,
    model: pick.model,
    look: resolved.look,
    fragment: fragmentFor(resolved.look, lookSurface, input.surface),
    sceneFragment: resolved.look.fragment,
    swapFragment: fragmentFor(resolved.look, lookSurface, 'solo'),
    directive: resolved.look.directive,
    family: resolved.family,
    source,
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
      const next = resolveModel({
        surface: policySurface,
        attempt: Math.max(2, attempt),
        policy: input.policy,
        bans: input.bans ?? null,
        forceModel: input.forceModel ?? null,
        previousModel: base.model,
        rng,
      });
      const p = pickFor(next.model, lookSurface, input.surface, `look_retry:${attempt}`);
      p.stamps.unshift(next.stamp);
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
      return p;
    },
  };
}

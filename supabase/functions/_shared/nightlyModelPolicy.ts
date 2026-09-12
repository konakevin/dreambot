/**
 * nightlyModelPolicy — ONE table decides which image model nightly renders on, per surface, and how the
 * cascade falls back (NIGHTLY_MODEL_POLICY_PLAN.md, Kevin 2026-09-07). Replaces eight scattered layers
 * (DreamSmart sets, the ≤2✦ cap, NIGHTLY_BANNED_MODELS, two clamps, the steer knob, the scene gate, the
 * ban-gate backstop, solo_rebuild_model) once `engine_config.model_policy_mode = 'on'`.
 *
 * PURE (no Deno / DB / URL imports) so it is unit-tested via `@engine/*`. Randomness is injected.
 *
 *   surface   attempt 1                 attempt ≥ 2                          then
 *   couple    random primary            random FALLBACK (or attempt-1 model  → solo_rebuild → scene
 *                                       again when the row has none)
 *   solo      random primary            (single-swap guard re-render =       → scene
 *                                       solo_rebuild row)
 *   solo_rebuild  random primary        —
 *   scene     random primary            —
 *
 * Every pick stamps `policy:<surface>:<attempt>:<model>` into fallback_reasons; in SHADOW mode the
 * resolver runs beside the legacy picker and stamps `policy_shadow:<site>:match|diff:<legacy>-><policy>`
 * without changing the render, so one real night proves the wiring before the flip.
 */

export type PolicySurface = 'couple' | 'solo' | 'solo_rebuild' | 'scene';
export const POLICY_SURFACES: readonly PolicySurface[] = [
  'couple',
  'solo',
  'solo_rebuild',
  'scene',
];

export interface PolicyRow {
  /** Attempt 1 draws from these (weighted by primaryWeights, else uniformly). Never empty. */
  primaryModels: string[];
  /** Attempt ≥ 2 draws from these (weighted by fallbackWeights, else uniformly); empty = render the attempt-1
   *  model again (legacy). */
  fallbackModels: string[];
  /** Parallel to primaryModels (mig 501; Kevin 2026-09-12: "50 % 1.1-pro for all renders, 25/25 grok and gemini").
   *  Missing or shorter than the model list = equal weights. */
  primaryWeights?: number[];
  /** Parallel to fallbackModels; same rule. */
  fallbackWeights?: number[];
}
export type NightlyModelPolicy = Record<PolicySurface, PolicyRow>;

export type ModelPolicyMode = 'off' | 'shadow' | 'on';

const FLUX_11_PRO = 'black-forest-labs/flux-1.1-pro';
const FLUX_2_FLEX = 'black-forest-labs/flux-2-flex';

/**
 * Today's effective behaviour expressed as rows (NIGHTLY_MODEL_POLICY_PLAN.md §3) — the migration seed
 * AND the fail-open default when the table cannot be read. Kevin's final rows (1.1-pro primary
 * everywhere, random backup from gemini-2-image / flux-2-pro / seedream-4 / grok / flux-dev) are a
 * dashboard edit after the shadow night, never a code change.
 */
export const LEGACY_EQUIVALENT_POLICY: NightlyModelPolicy = {
  couple: { primaryModels: [FLUX_11_PRO], fallbackModels: [] },
  solo: { primaryModels: [FLUX_11_PRO, FLUX_2_FLEX], fallbackModels: [] },
  solo_rebuild: { primaryModels: [FLUX_2_FLEX], fallbackModels: [] },
  scene: { primaryModels: [FLUX_11_PRO], fallbackModels: [] },
};

/** The explicit cascade, readable in one place (the plan's §2). */
export const CASCADE: Record<
  'couple' | 'solo',
  readonly { surface: PolicySurface; attempt: number }[]
> = {
  couple: [
    { surface: 'couple', attempt: 1 },
    { surface: 'couple', attempt: 2 },
    { surface: 'solo_rebuild', attempt: 1 },
    { surface: 'scene', attempt: 1 },
  ],
  solo: [
    { surface: 'solo', attempt: 1 },
    { surface: 'solo_rebuild', attempt: 1 },
    { surface: 'scene', attempt: 1 },
  ],
};

export const shortModel = (id: string): string => id.replace(/^.*\//, '');

export interface ResolveInput {
  surface: PolicySurface;
  /** 1 = first render of this surface; ≥ 2 = a retry after a failed identity gate. */
  attempt: number;
  policy: NightlyModelPolicy;
  /** QA override — always wins (the existing `force_model` flag). */
  forceModel?: string | null;
  /** The model attempt 1 rendered on; returned again on attempt ≥ 2 when the row has no fallbacks. */
  previousModel?: string | null;
  /** Models this render must never pick (the nightly ban set + a day-of holiday's own, mig 480). A banned
   *  primary falls to the non-banned primaries, then the fallbacks; when everything is banned the row's
   *  own pick stands (a policy can never go blank). */
  bans?: ReadonlySet<string> | null;
  rng?: () => number;
}

export interface ResolvedModel {
  model: string;
  stamp: string;
}

function pickUniform(list: string[], rng: () => number): string {
  const i = Math.min(list.length - 1, Math.max(0, Math.floor(rng() * list.length)));
  return list[i];
}

/** A model list with its weights, kept aligned through the ban filter. */
interface Weighted {
  models: string[];
  weights: number[];
}

/** Pair each model with its weight (equal weights when the array is missing / short / non-positive), dropping
 *  banned models AND their weights together so the survivors renormalise among themselves. */
function weightedList(
  models: string[],
  weights: number[] | undefined,
  bans: ReadonlySet<string> | null
): Weighted {
  const usable =
    weights && weights.length >= models.length && weights.some((w) => Number.isFinite(w) && w > 0);
  const out: Weighted = { models: [], weights: [] };
  models.forEach((m, i) => {
    if (bans && bans.has(m)) return;
    out.models.push(m);
    out.weights.push(usable ? Math.max(0, Number(weights[i]) || 0) : 1);
  });
  return out;
}

/** Weighted random pick; falls back to uniform when every weight is zero. */
function pickWeighted(w: Weighted, rng: () => number): string {
  const total = w.weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return pickUniform(w.models, rng);
  let r = rng() * total;
  for (let i = 0; i < w.models.length; i++) {
    r -= w.weights[i];
    if (r < 0) return w.models[i];
  }
  return w.models[w.models.length - 1];
}

/** Which model renders THIS surface on THIS attempt. Throws on a blank row (a policy can never be blank). */
export function resolveModel(input: ResolveInput): ResolvedModel {
  const rng = input.rng ?? Math.random;
  const attempt = Math.max(1, Math.floor(input.attempt));
  if (input.forceModel) {
    return { model: input.forceModel, stamp: `policy:${input.surface}:${attempt}:forced` };
  }
  const row = input.policy[input.surface];
  if (!row || row.primaryModels.length === 0) {
    throw new Error(`nightly_model_policy: surface "${input.surface}" has no primary models`);
  }
  const bans = input.bans ?? null;
  const primaries = weightedList(row.primaryModels, row.primaryWeights, bans);
  const fallbacks = weightedList(row.fallbackModels, row.fallbackWeights, bans);
  const allPrimaries = weightedList(row.primaryModels, row.primaryWeights, null);
  const allFallbacks = weightedList(row.fallbackModels, row.fallbackWeights, null);
  let model: string;
  if (attempt === 1) {
    model =
      primaries.models.length > 0
        ? pickWeighted(primaries, rng)
        : fallbacks.models.length > 0
          ? pickWeighted(fallbacks, rng)
          : pickWeighted(allPrimaries, rng);
  } else if (fallbacks.models.length > 0) {
    model = pickWeighted(fallbacks, rng);
  } else if (input.previousModel && !(bans && bans.has(input.previousModel))) {
    model = input.previousModel;
  } else {
    model =
      primaries.models.length > 0
        ? pickWeighted(primaries, rng)
        : allFallbacks.models.length > 0
          ? pickWeighted(allFallbacks, rng)
          : input.previousModel || pickWeighted(allPrimaries, rng);
  }
  return { model, stamp: `policy:${input.surface}:${attempt}:${shortModel(model)}` };
}

/** Shadow-mode stamp: did the policy agree with the legacy picker at this site? */
export function shadowStamp(site: string, legacyModel: string, policyModel: string): string {
  return legacyModel === policyModel
    ? `policy_shadow:${site}:match`
    : `policy_shadow:${site}:diff:${shortModel(legacyModel)}->${shortModel(policyModel)}`;
}

/** The models the policy could draw for a surface / attempt (what a shadow comparison must accept —
 *  two independent random draws from the same set are not a disagreement). */
export function candidateModels(
  policy: NightlyModelPolicy,
  surface: PolicySurface,
  attempt: number,
  previousModel?: string | null
): string[] {
  const row = policy[surface];
  if (!row || row.primaryModels.length === 0) return [];
  if (Math.max(1, Math.floor(attempt)) === 1) return row.primaryModels;
  if (row.fallbackModels.length > 0) return row.fallbackModels;
  return previousModel ? [previousModel] : row.primaryModels;
}

/** Set-aware shadow stamp: match when the legacy pick is one the policy could have drawn. */
export function shadowStampSet(site: string, legacyModel: string, candidates: string[]): string {
  return candidates.includes(legacyModel)
    ? `policy_shadow:${site}:match`
    : `policy_shadow:${site}:diff:${shortModel(legacyModel)}->${candidates.map(shortModel).join('|') || 'none'}`;
}

/** Parse `nightly_model_policy` rows; a missing / blank surface falls open to the legacy-equivalent row. */
export function parsePolicyRows(rows: ReadonlyArray<Record<string, unknown>>): {
  policy: NightlyModelPolicy;
  missing: PolicySurface[];
} {
  const policy: NightlyModelPolicy = {
    couple: { ...LEGACY_EQUIVALENT_POLICY.couple },
    solo: { ...LEGACY_EQUIVALENT_POLICY.solo },
    solo_rebuild: { ...LEGACY_EQUIVALENT_POLICY.solo_rebuild },
    scene: { ...LEGACY_EQUIVALENT_POLICY.scene },
  };
  const seen = new Set<PolicySurface>();
  const strings = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length > 0) : [];
  for (const r of rows) {
    const surface = r.surface;
    if (typeof surface !== 'string' || !POLICY_SURFACES.includes(surface as PolicySurface))
      continue;
    const primary = strings(r.primary_models);
    if (primary.length === 0) continue; // blank row → keep the fail-open default
    const numbers = (v: unknown): number[] =>
      Array.isArray(v) ? v.map((x) => Number(x)).map((n) => (Number.isFinite(n) ? n : 0)) : [];
    const pw = numbers(r.primary_weights);
    const fw = numbers(r.fallback_weights);
    policy[surface as PolicySurface] = {
      primaryModels: primary,
      fallbackModels: strings(r.fallback_models),
      ...(pw.length > 0 ? { primaryWeights: pw } : {}),
      ...(fw.length > 0 ? { fallbackWeights: fw } : {}),
    };
    seen.add(surface as PolicySurface);
  }
  return { policy, missing: POLICY_SURFACES.filter((s) => !seen.has(s)) };
}

export function parsePolicyMode(v: unknown): ModelPolicyMode {
  return v === 'shadow' || v === 'on' ? v : 'off';
}

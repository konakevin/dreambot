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
  /** Attempt 1 draws uniformly from these. Never empty. */
  primaryModels: string[];
  /** Attempt ≥ 2 draws uniformly from these; empty = render the attempt-1 model again (legacy). */
  fallbackModels: string[];
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
  const allowed = (list: string[]) => (bans ? list.filter((m) => !bans.has(m)) : list);
  const primaries = allowed(row.primaryModels);
  const fallbacks = allowed(row.fallbackModels);
  let model: string;
  if (attempt === 1) {
    model =
      primaries.length > 0
        ? pickUniform(primaries, rng)
        : fallbacks.length > 0
          ? pickUniform(fallbacks, rng)
          : pickUniform(row.primaryModels, rng);
  } else if (fallbacks.length > 0) {
    model = pickUniform(fallbacks, rng);
  } else if (input.previousModel && !(bans && bans.has(input.previousModel))) {
    model = input.previousModel;
  } else {
    model =
      primaries.length > 0
        ? pickUniform(primaries, rng)
        : row.fallbackModels.length > 0
          ? pickUniform(row.fallbackModels, rng)
          : input.previousModel || pickUniform(row.primaryModels, rng);
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
    policy[surface as PolicySurface] = {
      primaryModels: primary,
      fallbackModels: strings(r.fallback_models),
    };
    seen.add(surface as PolicySurface);
  }
  return { policy, missing: POLICY_SURFACES.filter((s) => !seen.has(s)) };
}

export function parsePolicyMode(v: unknown): ModelPolicyMode {
  return v === 'shadow' || v === 'on' ? v : 'off';
}

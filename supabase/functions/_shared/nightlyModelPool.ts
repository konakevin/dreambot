/**
 * Nightly render-model selection via DreamSmart per-medium sets (2026-07-22).
 *
 * Nightly rolls a style, then renders it with a model PROVEN to render that
 * style well — the medium's DreamSmart set (`client_meta.smart_dream_models`,
 * parsed onto `ResolvedMedium.smartDreamModels`) — capped at ≤2 sparkles so
 * nightly stays cheap. This replaces the legacy hardcoded FACE_SWAP_MODELS
 * rotation + the `allowed_models` picker, which predated DreamSmart and didn't
 * reflect which models actually honor a style.
 *
 * PURE (no Deno / DB / URL imports) so it's unit-tested via `@engine/*`. The
 * sparkle-cost lookup + ban set are injected. Live audit (2026-07-22): all 20
 * dream-eligible mediums have a non-empty ≤2✦ smart set, so the fallbacks below
 * are defensive only.
 */

export interface NightlyPoolInput {
  /** The rolled medium's DreamSmart set (models proven to render this style). */
  smartDreamModels: string[];
  /** Legacy per-medium pool — the defensive fallback if the smart set is empty. */
  allowedModels: string[];
  /** Sparkle cost per model id (inject `getSparkleCost` from modelPricing.ts). */
  costOf: (id: string) => number;
  /** Models nightly must never render (e.g. NIGHTLY_BANNED_MODELS). */
  bans?: ReadonlySet<string>;
  /** Hard sparkle cap. Default 2. */
  cap?: number;
  /**
   * Scene-composition gate: when provided (pure_scene / epic_tiny), the pool is
   * additionally narrowed to models that are ALSO scene-eligible. If that
   * intersection is empty we fall back to the un-narrowed ≤cap smart set rather
   * than shipping a scene-inappropriate model.
   */
  intersectWith?: string[] | null;
}

/**
 * Compute the eligible nightly model pool for a medium. Never empty:
 *   smart ∩ ≤cap ∩ !bans  [∩ intersectWith when it leaves ≥1]
 *   → allowed ∩ ≤cap ∩ !bans
 *   → ['black-forest-labs/flux-1.1-pro']  (universal 1✦ safe default)
 */
export function nightlyModelPool(input: NightlyPoolInput): string[] {
  const cap = input.cap ?? 2;
  const bans = input.bans ?? new Set<string>();
  const ok = (id: string) => input.costOf(id) <= cap && !bans.has(id);

  const smart = input.smartDreamModels.filter(ok);
  if (input.intersectWith && input.intersectWith.length > 0) {
    const eligible = new Set(input.intersectWith);
    const narrowed = smart.filter((id) => eligible.has(id));
    if (narrowed.length > 0) return narrowed;
  }
  if (smart.length > 0) return smart;

  const allowed = input.allowedModels.filter(ok);
  if (allowed.length > 0) return allowed;

  return ['black-forest-labs/flux-1.1-pro'];
}

/** Random pick from a (non-empty) pool. `rng` injectable for deterministic tests. */
export function pickFromPool(pool: string[], rng: () => number = Math.random): string {
  return pool[Math.floor(rng() * pool.length)];
}

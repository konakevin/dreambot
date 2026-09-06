/**
 * dualModelSteer.ts — steer DUAL face-swap renders away from flux-1.1-pro (2026-09-05).
 *
 * Evidence (SCENE_FIRST_ACTION_PLAN.md §8 + HALLOWEEN_SIGNATURE_LOOK_PLAN.md §2): on flux-1.1-pro
 * a couple render (a) is forced through the curated override fragments, so the rolled medium is
 * cosmetic and the picture collapses into one of four looks, and (b) degrades to a solo 23-40% of
 * the time on painterly mediums. On the same seeds, same prompts, 2026-09-05: flux-2-flex 8/8,
 * gemini-2-image 4/4, gpt-image-2 4/4, flux-2-max 4/4 clean first-try swaps, full-body, medium-
 * faithful — vs 1.1-pro 3/4 with two-head close-ups. The model is the couple ceiling.
 *
 * Pure function so it is unit-testable; nightly wires it behind engine_config.dual_avoid_flux11pro
 * (default false → no behavior change). Order = proven reliability, then cost (pricing.ts):
 * flex ($0.063) → gemini ($0.039) → max ($0.073) → gpt-image-2 ($0.06, slowest).
 */

export const FLUX_11_PRO = 'black-forest-labs/flux-1.1-pro';
export const FLUX_11_PRO_ULTRA = 'black-forest-labs/flux-1.1-pro-ultra';

/** Preference order for a couple render when the pick landed on the 1.1-pro family. */
export const DUAL_STEER_ORDER: readonly string[] = [
  'black-forest-labs/flux-2-flex',
  'google/gemini-2-image',
  'black-forest-labs/flux-2-max',
  'openai/gpt-image-2',
];

/** Used when the medium allows none of DUAL_STEER_ORDER (see steerDualModel). */
export const LAST_RESORT = 'black-forest-labs/flux-2-flex';

export interface DualSteerResult {
  model: string;
  /** Stamp for ai_generation_log.fallback_reasons, null when nothing changed. */
  stamp: string | null;
}

/**
 * @param picked   the model the DreamSmart picker chose (AFTER the Ultra clamp)
 * @param allowed  the medium's allowed_models (the steer never leaves this set)
 * @param banned   NIGHTLY_BANNED_MODELS
 * @param enabled  engine_config.dual_avoid_flux11pro
 */
export function steerDualModel(
  picked: string,
  allowed: readonly string[],
  banned: ReadonlySet<string>,
  enabled: boolean
): DualSteerResult {
  if (!enabled) return { model: picked, stamp: null };
  if (picked !== FLUX_11_PRO && picked !== FLUX_11_PRO_ULTRA) return { model: picked, stamp: null };
  const allowedSet = new Set(allowed);
  for (const candidate of DUAL_STEER_ORDER) {
    if (allowedSet.has(candidate) && !banned.has(candidate)) {
      return {
        model: candidate,
        stamp: `dual_model_steer:${shortName(picked)}→${shortName(candidate)}`,
      };
    }
  }
  // Last resort (2026-09-05 verification batch): glamour + vintage_film allow no flex/max and
  // their gemini / gpt-image-2 options are nightly-banned, so the steer found nothing and both
  // couples reproduced the 1.1-pro failures (two-head close-up, degrade). flux-2-flex is a Flux
  // sibling that honors the medium's face-swap fragment, so for a COUPLE it is safer than the
  // pick even outside the medium's allowed set. Distinct stamp so the exception stays visible;
  // the fix of record is adding flex/max to those mediums' allowed_models (DreamSmart runbook).
  if (!banned.has(LAST_RESORT)) {
    return {
      model: LAST_RESORT,
      stamp: `dual_model_steer:${shortName(picked)}→${shortName(LAST_RESORT)}(last_resort)`,
    };
  }
  return { model: picked, stamp: 'dual_model_steer:none_allowed' };
}

function shortName(model: string): string {
  const i = model.indexOf('/');
  return i >= 0 ? model.slice(i + 1) : model;
}

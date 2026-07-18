/**
 * First-dream medium curation — the STARTER dream a brand-new user sees right
 * after onboarding is the main funnel into the app, so its art style is
 * restricted to a small curated, approved set (NOT the full nightly/create pool).
 *
 * Two lists, chosen by whether the user gave a usable cast photo:
 *   • CAST  (photo → face swap): the approved face-swap styles. Realistic styles
 *     (photography / hyperreal / render) are dropped — a photographic base renders
 *     a generic adult that a swapped face sits wrong on (mirrors the character
 *     realistic-ban in nightly-dreams). They live only in the scene fallback.
 *   • SCENE (no photo / swap failed → drawn scene): the same base set (INCLUDING
 *     photography) PLUS every active Dream Art (drawn-character / embodied) style.
 *
 * These are PURE helpers (no DB / URL imports) so they unit-test directly.
 * nightly-dreams computes the key list from the active mediums and passes it into
 * resolveMediumFromDb as a pool restriction. Normal nightly + create + QA
 * force_medium yield firstDreamMediumMode === null → NO restriction → unchanged.
 *
 * Set + rationale confirmed with Kevin 2026-07-18.
 */

/** The curated base styles for a first dream (the set Kevin approved). */
export const FIRST_DREAM_BASE_MEDIUMS = [
  'canvas',
  'glamour',
  'illustration',
  'pencil',
  'photography',
  'vintage_film',
  'watercolor',
] as const;

/**
 * Realistic styles banned on the FACE-SWAP (character) path: a photographic base
 * renders a generic adult, so a swapped face sits wrong on it. Kept for scenes
 * (no face to swap). Mirrors REALISTIC_BANNED_FOR_CHARACTER in nightly-dreams.
 */
export const FACE_SWAP_BANNED_MEDIUMS: ReadonlySet<string> = new Set([
  'photography',
  'hyperreal',
  'render',
]);

/** Minimal medium shape the allow-list needs (a subset of ResolvedMedium). */
export interface FirstDreamMediumFlags {
  key: string;
  characterRenderMode: string; // 'natural' | 'embodied'
  isDreamEligible: boolean;
}

export type FirstDreamMode = 'cast' | 'scene';

/**
 * Which first-dream curation applies, or null when this render is NOT a first
 * dream (normal nightly / create / QA force_medium) — in which case NO restriction
 * is applied downstream and behavior is unchanged.
 *
 * Signals come straight from the first-dream cascade tiers (firstDreamTiers.ts):
 *   • cast tiers pass force_face_swap_eligible: true (+ force_cast_role self/dual/…)
 *   • the scene fallback tier passes force_cast_role: null (explicitly)
 * A normal nightly passes NEITHER. force_medium (QA) wins and skips curation.
 */
export function firstDreamMediumMode(opts: {
  forceFaceSwapEligible?: boolean;
  forceCastRole?: string | null;
  forceMedium?: string | null;
}): FirstDreamMode | null {
  if (opts.forceMedium) return null; // explicit QA override wins — no curation
  if (opts.forceFaceSwapEligible) return 'cast';
  if (opts.forceCastRole === null) return 'scene'; // explicit null = scene fallback tier
  return null; // normal nightly / create — no curation
}

/**
 * The approved medium KEYS for a first dream, intersected with the mediums that
 * are actually active (so a de-activated style silently drops out).
 *
 * @param mediums the active mediums (e.g. the fetchMediums() result).
 */
export function firstDreamAllowedMediums(
  mode: FirstDreamMode,
  mediums: FirstDreamMediumFlags[]
): string[] {
  const activeKeys = new Set(mediums.map((m) => m.key));
  const base = FIRST_DREAM_BASE_MEDIUMS.filter((k) => activeKeys.has(k));
  if (mode === 'cast') {
    // Face-swap path: drop realistic styles (they'd be re-rolled away anyway).
    return base.filter((k) => !FACE_SWAP_BANNED_MEDIUMS.has(k));
  }
  // Scene fallback: base (incl. photography) + every ACTIVE Dream Art style.
  const dreamArt = mediums
    .filter((m) => m.characterRenderMode === 'embodied' && m.isDreamEligible)
    .map((m) => m.key);
  return Array.from(new Set([...base, ...dreamArt]));
}

/**
 * First-Dream Banger Engine — pure pick logic.
 *
 * Three pure functions, all easy to unit-test:
 *   - derivePersona(cast)       → which template to use
 *   - pickFirstDreamMedium(...) → which medium to render in
 *   - pickFirstDreamVibe(...)   → which vibe to use
 *
 * The Edge Function imports a Deno mirror at
 * `supabase/functions/_shared/firstDreamPicker.ts`.
 *
 * See FIRST_DREAM_BANGER_SPEC.md for design rationale.
 */

import {
  FirstDreamPersona,
  GLOBAL_MEDIUM_RANKING,
  GLOBAL_VIBE_RANKING,
  PERSONA_OVERRIDES,
  FACE_SWAP_MEDIUM_COUNT,
  PersonaOverride,
} from '../types/firstDream';

// ─── Cast input shape (subset of DreamCastMember to keep this pure) ─────

export interface FirstDreamCastInput {
  role: 'self' | 'plus_one' | 'pet';
  hasPhoto: boolean;
  gender?: 'male' | 'female' | string;
}

// ─── Persona Derivation ─────────────────────────────────────────────────

/**
 * Decide which of the 3 templates to render based on cast composition.
 *
 * Rules (in order):
 *   1. Both self+plus_one with photos → `duo`
 *   2. Self with photo → `solo_male` or `solo_female` (from gender)
 *   3. Plus_one with photo (no self) → use plus_one's gender as the solo
 *   4. Pet only or empty → `no_cast`
 *
 * @returns the persona key — never throws, never returns undefined
 */
export function derivePersona(cast: readonly FirstDreamCastInput[]): FirstDreamPersona {
  const self = cast.find((c) => c.role === 'self' && c.hasPhoto);
  const plusOne = cast.find((c) => c.role === 'plus_one' && c.hasPhoto);

  if (self && plusOne) return 'duo';

  // Solo path — prefer self's photo, fall back to plus_one's
  const soloMember = self ?? plusOne;
  if (soloMember) {
    return soloMember.gender === 'female' ? 'solo_female' : 'solo_male';
  }

  return 'no_cast';
}

// ─── Internal: rank-aware sort + pick helpers ───────────────────────────

/**
 * Sort `picks` by their position in `ranking`. Picks not in the ranking
 * sink to the end (preserved but lowest priority).
 */
function sortByRanking(picks: readonly string[], ranking: readonly string[]): string[] {
  const positionOf = (key: string): number => {
    const idx = ranking.indexOf(key);
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
  };
  return [...picks].sort((a, b) => positionOf(a) - positionOf(b));
}

/** Subset of the global ranking that face-swaps. */
const FACE_SWAP_GLOBAL_RANKING: readonly string[] = GLOBAL_MEDIUM_RANKING.slice(
  0,
  FACE_SWAP_MEDIUM_COUNT
);

/** Whether the persona requires a face-swap-eligible medium. */
function requiresFaceSwap(persona: FirstDreamPersona): boolean {
  return persona === 'solo_male' || persona === 'solo_female' || persona === 'duo';
}

// ─── Public: pickFirstDreamMedium ───────────────────────────────────────

export interface PickResult<T> {
  /** The chosen value. */
  value: T;
  /** Why this was picked — for telemetry + debugging. */
  reason:
    | 'force'
    | 'persona_override_match'
    | 'global_match'
    | 'persona_override_fallback'
    | 'global_fallback';
}

/**
 * Pick the medium for a first dream.
 *
 * Logic (in order):
 *   1. If override.forceMedium → use it (record reason='force')
 *   2. Filter user picks: drop banned + (if persona requires face-swap) keep face-swap eligible
 *   3. If override.mediumRanking exists, intersect with filtered picks; if non-empty,
 *      sort by override ranking and return top (record reason='persona_override_match')
 *   4. Sort filtered picks by global ranking; if non-empty return top
 *      (record reason='global_match')
 *   5. (No user picks left after filtering) → fall back to override.mediumRanking[0]
 *      if set (reason='persona_override_fallback'), else GLOBAL_MEDIUM_RANKING[0]
 *      (reason='global_fallback')
 *
 * Output is always a valid medium key.
 */
export function pickFirstDreamMedium(
  userPicks: readonly string[],
  persona: FirstDreamPersona
): PickResult<string> {
  const override: PersonaOverride = PERSONA_OVERRIDES[persona];

  // Step 1: hard force
  if (override.forceMedium) {
    return { value: override.forceMedium, reason: 'force' };
  }

  // Step 2: filter
  const banned = new Set(override.bannedMediums ?? []);
  let filtered = userPicks.filter((p) => !banned.has(p));

  // Face-swap personas: keep only face-swap-eligible mediums
  if (requiresFaceSwap(persona)) {
    filtered = filtered.filter((p) => FACE_SWAP_GLOBAL_RANKING.includes(p));
  }

  // Step 3: persona-override ranking match
  if (override.mediumRanking) {
    const overlap = filtered.filter((p) => override.mediumRanking!.includes(p));
    if (overlap.length > 0) {
      return {
        value: sortByRanking(overlap, override.mediumRanking)[0],
        reason: 'persona_override_match',
      };
    }
  }

  // Step 4: global ranking match
  if (filtered.length > 0) {
    const globalRanking = requiresFaceSwap(persona)
      ? FACE_SWAP_GLOBAL_RANKING
      : GLOBAL_MEDIUM_RANKING;
    const sorted = sortByRanking(filtered, globalRanking);
    return { value: sorted[0], reason: 'global_match' };
  }

  // Step 5: empty after filtering — fall back to highest-priority default
  if (override.mediumRanking && override.mediumRanking.length > 0) {
    return { value: override.mediumRanking[0], reason: 'persona_override_fallback' };
  }
  const defaultRanking = requiresFaceSwap(persona)
    ? FACE_SWAP_GLOBAL_RANKING
    : GLOBAL_MEDIUM_RANKING;
  return { value: defaultRanking[0], reason: 'global_fallback' };
}

// ─── Public: pickFirstDreamVibe ─────────────────────────────────────────

/**
 * Pick the vibe for a first dream.
 *
 * Logic (in order):
 *   1. If override.forceVibe → use it (record reason='force')
 *   2. Filter user picks: drop banned vibes
 *   3. If override.vibeRanking exists, intersect with filtered picks; if non-empty,
 *      sort by override ranking and return top (record reason='persona_override_match')
 *   4. Sort filtered picks by global ranking; if non-empty return top
 *      (record reason='global_match')
 *   5. (No user picks left after filtering) → fall back to override.vibeRanking[0]
 *      if set (reason='persona_override_fallback'), else GLOBAL_VIBE_RANKING[0]
 *      (reason='global_fallback')
 *
 * Output is always a valid vibe key.
 */
export function pickFirstDreamVibe(
  userPicks: readonly string[],
  persona: FirstDreamPersona
): PickResult<string> {
  const override: PersonaOverride = PERSONA_OVERRIDES[persona];

  // Step 1: hard force
  if (override.forceVibe) {
    return { value: override.forceVibe, reason: 'force' };
  }

  // Step 2: filter
  const banned = new Set(override.bannedVibes ?? []);
  const filtered = userPicks.filter((p) => !banned.has(p));

  // Step 3: persona-override ranking match
  if (override.vibeRanking) {
    const overlap = filtered.filter((p) => override.vibeRanking!.includes(p));
    if (overlap.length > 0) {
      return {
        value: sortByRanking(overlap, override.vibeRanking)[0],
        reason: 'persona_override_match',
      };
    }
  }

  // Step 4: global ranking match
  if (filtered.length > 0) {
    const sorted = sortByRanking(filtered, GLOBAL_VIBE_RANKING);
    return { value: sorted[0], reason: 'global_match' };
  }

  // Step 5: empty after filtering — fall back
  if (override.vibeRanking && override.vibeRanking.length > 0) {
    return { value: override.vibeRanking[0], reason: 'persona_override_fallback' };
  }
  return { value: GLOBAL_VIBE_RANKING[0], reason: 'global_fallback' };
}

/**
 * First-Dream Banger Engine — Edge Function mirror of `lib/firstDreamPicker.ts`.
 * Keep these in sync. See FIRST_DREAM_BANGER_SPEC.md for design rationale.
 */

import {
  FirstDreamPersona,
  GLOBAL_MEDIUM_RANKING,
  GLOBAL_VIBE_RANKING,
  PERSONA_OVERRIDES,
  FACE_SWAP_MEDIUM_COUNT,
  PersonaOverride,
} from './firstDream.ts';

export interface FirstDreamCastInput {
  role: 'self' | 'plus_one' | 'pet';
  hasPhoto: boolean;
  gender?: 'male' | 'female' | string;
}

export interface PickResult<T> {
  value: T;
  reason:
    | 'force'
    | 'persona_override_match'
    | 'global_match'
    | 'persona_override_fallback'
    | 'global_fallback';
}

// ─── Persona Derivation ─────────────────────────────────────────────────

export function derivePersona(cast: readonly FirstDreamCastInput[]): FirstDreamPersona {
  const self = cast.find((c) => c.role === 'self' && c.hasPhoto);
  const plusOne = cast.find((c) => c.role === 'plus_one' && c.hasPhoto);

  if (self && plusOne) return 'duo';

  const soloMember = self ?? plusOne;
  if (soloMember) {
    return soloMember.gender === 'female' ? 'solo_female' : 'solo_male';
  }

  return 'no_cast';
}

// ─── Internal helpers ────────────────────────────────────────────────────

function sortByRanking(picks: readonly string[], ranking: readonly string[]): string[] {
  const positionOf = (key: string): number => {
    const idx = ranking.indexOf(key);
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
  };
  return [...picks].sort((a, b) => positionOf(a) - positionOf(b));
}

const FACE_SWAP_GLOBAL_RANKING: readonly string[] = GLOBAL_MEDIUM_RANKING.slice(
  0,
  FACE_SWAP_MEDIUM_COUNT
);

function requiresFaceSwap(persona: FirstDreamPersona): boolean {
  return persona === 'solo_male' || persona === 'solo_female' || persona === 'duo';
}

// ─── Public: pickFirstDreamMedium ───────────────────────────────────────

export function pickFirstDreamMedium(
  userPicks: readonly string[],
  persona: FirstDreamPersona
): PickResult<string> {
  const override: PersonaOverride = PERSONA_OVERRIDES[persona];

  if (override.forceMedium) {
    return { value: override.forceMedium, reason: 'force' };
  }

  const banned = new Set(override.bannedMediums ?? []);
  let filtered = userPicks.filter((p) => !banned.has(p));

  if (requiresFaceSwap(persona)) {
    filtered = filtered.filter((p) => FACE_SWAP_GLOBAL_RANKING.includes(p));
  }

  if (override.mediumRanking) {
    const overlap = filtered.filter((p) => override.mediumRanking!.includes(p));
    if (overlap.length > 0) {
      return {
        value: sortByRanking(overlap, override.mediumRanking)[0],
        reason: 'persona_override_match',
      };
    }
  }

  if (filtered.length > 0) {
    const globalRanking = requiresFaceSwap(persona)
      ? FACE_SWAP_GLOBAL_RANKING
      : GLOBAL_MEDIUM_RANKING;
    return { value: sortByRanking(filtered, globalRanking)[0], reason: 'global_match' };
  }

  if (override.mediumRanking && override.mediumRanking.length > 0) {
    return { value: override.mediumRanking[0], reason: 'persona_override_fallback' };
  }
  const defaultRanking = requiresFaceSwap(persona)
    ? FACE_SWAP_GLOBAL_RANKING
    : GLOBAL_MEDIUM_RANKING;
  return { value: defaultRanking[0], reason: 'global_fallback' };
}

// ─── Public: pickFirstDreamVibe ─────────────────────────────────────────

export function pickFirstDreamVibe(
  userPicks: readonly string[],
  persona: FirstDreamPersona
): PickResult<string> {
  const override: PersonaOverride = PERSONA_OVERRIDES[persona];

  if (override.forceVibe) {
    return { value: override.forceVibe, reason: 'force' };
  }

  const banned = new Set(override.bannedVibes ?? []);
  const filtered = userPicks.filter((p) => !banned.has(p));

  if (override.vibeRanking) {
    const overlap = filtered.filter((p) => override.vibeRanking!.includes(p));
    if (overlap.length > 0) {
      return {
        value: sortByRanking(overlap, override.vibeRanking)[0],
        reason: 'persona_override_match',
      };
    }
  }

  if (filtered.length > 0) {
    return { value: sortByRanking(filtered, GLOBAL_VIBE_RANKING)[0], reason: 'global_match' };
  }

  if (override.vibeRanking && override.vibeRanking.length > 0) {
    return { value: override.vibeRanking[0], reason: 'persona_override_fallback' };
  }
  return { value: GLOBAL_VIBE_RANKING[0], reason: 'global_fallback' };
}

// ─── Composition mode weighted pick ─────────────────────────────────────

import { PERSONA_COMPOSITION, FirstDreamCompositionMode } from './firstDream.ts';

/**
 * Roll a composition mode using the persona's weighted distribution.
 * Pure function — call with Math.random() for production, fixed seed for tests.
 */
export function pickCompositionMode(
  persona: FirstDreamPersona,
  rand: () => number = Math.random
): FirstDreamCompositionMode {
  const config = PERSONA_COMPOSITION[persona];
  const weights = config.compositionModeWeights;
  const total = weights.reduce((sum, [, w]) => sum + w, 0);
  let roll = rand() * total;
  for (const [mode, weight] of weights) {
    roll -= weight;
    if (roll <= 0) return mode;
  }
  return weights[0][0];
}

// rollIncludeObject() removed 2026-06-02 with the objects feature.
// objectIncludePct on the persona config remains as a vestigial field
// for forward-compat with frozen recipes; nothing reads it.

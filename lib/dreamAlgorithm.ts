/**
 * Dream Algorithm — the rolling logic for nightly dreams.
 *
 * Three nightly paths:
 *   Path 1 (40%) — Personal Cast + Personal Elements
 *   Path 2 (30%) — Personal Elements Only (no cast)
 *   Path 3 (30%) — Cast + Pure Random Scene
 *
 * Face-swap mediums: single cast member per dream (50% self, 25% +1, 25% pet).
 *   Face swap applied for self/+1 (human). Pet uses description only.
 *
 * Non-face-swap mediums: can include 1, 2, or all 3 cast members per dream.
 *   All cast rendered from text descriptions (fully stylized — LEGO, claymation, etc.).
 */

// ── Configuration ──────────────────────────────────────────────────────

/** Mediums that ALWAYS render as pure scene (no cast). Mirrors dream_mediums.is_scene_only. */
export const SCENE_ONLY_MEDIUMS = new Set(['canvas', 'watercolor', 'vaporwave', 'pixels']);

/** Mediums that ALWAYS use the character composition path. Mirrors dream_mediums.is_character_only. */
export const CHARACTER_MEDIUMS = new Set(['claymation', 'lego', 'vinyl']);

/** Mediums that should be skipped (re-rolled) in nightly dreams. Mirrors dream_mediums.nightly_skip. */
export const NIGHTLY_SKIP_MEDIUMS = new Set(['watercolor']);

// ── Types ──────────────────────────────────────────────────────────────

export interface CastMember {
  role: string;
  description?: string;
  thumb_url?: string;
  relationship?: string;
}

export interface DreamRoll {
  /** Which nightly path was selected */
  nightlyPath: 'personal_cast' | 'personal_scene' | 'cast_random';
  /** Visual composition: character focus, tiny figure in vast scene, or pure environment */
  composition: 'character' | 'epic_tiny' | 'pure_scene';
  /** Selected cast members (empty for personal_scene path) */
  castMembers: CastMember[];
  /** Whether to include a personal location in the scene */
  includeLocation: boolean;
  /** Whether to include a personal object in the scene */
  includeObject: boolean;
}

// ── Algorithm ──────────────────────────────────────────────────────────

/**
 * Roll the nightly dream algorithm.
 *
 * @param describedCast - Cast members with descriptions (filtered for non-empty)
 * @param mediumKey - The selected medium key
 * @param isFaceSwapMedium - Whether the medium supports face swap
 * @param forceCastRole - Test mode override (e.g. 'self')
 * @param forceNightlyPath - Test mode override (e.g. 'personal_cast')
 */
export function rollDream(
  describedCast: CastMember[],
  mediumKey: string,
  isFaceSwapMedium: boolean,
  forceCastRole?: string | null,
  forceNightlyPath?: string | null
): DreamRoll {
  const findRole = (r: string) => describedCast.find((m) => m.role === r);

  // ── Pick nightly path (40/30/30) ──
  let nightlyPath: 'personal_cast' | 'personal_scene' | 'cast_random';

  if (
    forceNightlyPath === 'personal_cast' ||
    forceNightlyPath === 'personal_scene' ||
    forceNightlyPath === 'cast_random'
  ) {
    nightlyPath = forceNightlyPath;
  } else if (forceCastRole === null) {
    // Explicitly no cast (test tool "None" button)
    nightlyPath = 'personal_scene';
  } else if (SCENE_ONLY_MEDIUMS.has(mediumKey)) {
    nightlyPath = 'personal_scene';
  } else if (describedCast.length === 0) {
    nightlyPath = 'personal_scene';
  } else if (forceCastRole) {
    // Forced cast — only cast paths make sense
    nightlyPath = Math.random() < 0.57 ? 'personal_cast' : 'cast_random';
  } else {
    const pathRoll = Math.random();
    if (pathRoll < 0.4) nightlyPath = 'personal_cast';
    else if (pathRoll < 0.7) nightlyPath = 'personal_scene';
    else nightlyPath = 'cast_random';
  }

  // ── Pick cast members ──
  let castMembers: CastMember[] = [];

  if (nightlyPath === 'personal_scene') {
    // No cast
  } else if (forceCastRole) {
    const forced = findRole(forceCastRole);
    if (forced) castMembers = [forced];
  } else if (isFaceSwapMedium) {
    // Face-swap: single cast only (50% self, 25% +1, 25% pet)
    const whoRoll = Math.random() * 100;
    let pick: CastMember | undefined;
    if (whoRoll < 50) pick = findRole('self');
    else if (whoRoll < 75) pick = findRole('plus_one');
    else pick = findRole('pet');
    // Fallback: if the rolled role doesn't exist, pick whoever is available
    if (!pick) pick = describedCast[0];
    if (pick) castMembers = [pick];
  } else {
    // Non-face-swap: can include 1, 2, or all 3
    const available = [...describedCast];
    if (available.length <= 1) {
      castMembers = available;
    } else {
      const countRoll = Math.random();
      if (countRoll < 0.4 || available.length === 1) {
        // 40%: pick one (50% self, 25% +1, 25% pet)
        const whoRoll = Math.random() * 100;
        let pick: CastMember | undefined;
        if (whoRoll < 50) pick = findRole('self');
        else if (whoRoll < 75) pick = findRole('plus_one');
        else pick = findRole('pet');
        if (!pick) pick = available[0];
        castMembers = pick ? [pick] : [];
      } else if (countRoll < 0.75 || available.length === 2) {
        // 35%: pick two
        const shuffled = available.sort(() => Math.random() - 0.5);
        castMembers = shuffled.slice(0, 2);
      } else {
        // 25%: all three
        castMembers = available;
      }
    }
  }

  // ── Personal elements (location/object) ──
  let includeLocation = false;
  let includeObject = false;

  if (nightlyPath === 'personal_cast') {
    // Path 1: at least one required, coin flip for each
    includeLocation = Math.random() < 0.5;
    includeObject = Math.random() < 0.5;
    // Guarantee at least one
    if (!includeLocation && !includeObject) {
      if (Math.random() < 0.5) includeLocation = true;
      else includeObject = true;
    }
  } else if (nightlyPath === 'personal_scene') {
    // Path 2: at least one required
    includeLocation = Math.random() < 0.5;
    includeObject = Math.random() < 0.5;
    if (!includeLocation && !includeObject) {
      if (Math.random() < 0.5) includeLocation = true;
      else includeObject = true;
    }
  }
  // Path 3 (cast_random): no personal elements — includeLocation and includeObject stay false

  // ── Composition ──
  let composition: 'character' | 'epic_tiny' | 'pure_scene';

  if (nightlyPath === 'personal_scene') {
    composition = 'pure_scene';
  } else if (SCENE_ONLY_MEDIUMS.has(mediumKey)) {
    composition = 'pure_scene';
  } else if (CHARACTER_MEDIUMS.has(mediumKey)) {
    composition = 'character';
  } else {
    composition = Math.random() < 0.6 ? 'character' : 'epic_tiny';
  }

  return { nightlyPath, composition, castMembers, includeLocation, includeObject };
}

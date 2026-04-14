/**
 * Dream Algorithm — independent rolling logic for nightly dreams.
 *
 * Independent rolls (not path-based):
 *   Character: 50% (face swap when medium supports it)
 *   Location:  60% (from user's dream_seeds.places)
 *   Object:    50% (from user's dream_seeds.things + characters)
 *
 * Non-character dreams: 15% pure scene, 85% roll loc/obj with guard.
 * Non-character composition: 70% pure_scene, 30% epic_tiny (anonymous silhouette).
 *
 * Face-swap mediums: single cast member per dream (50% self, 25% +1, 25% pet).
 * Non-face-swap mediums: 1-3 cast members rendered stylized.
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
  /** Descriptive path for logging/analytics */
  nightlyPath: string;
  /** Visual composition: character focus, tiny figure in vast scene, or pure environment */
  composition: 'character' | 'epic_tiny' | 'pure_scene';
  /** Selected cast members (empty for non-character dreams) */
  castMembers: CastMember[];
  /** Whether to include a personal location in the scene */
  includeLocation: boolean;
  /** Whether to include a personal object in the scene */
  includeObject: boolean;
}

// ── Algorithm ──────────────────────────────────────────────────────────

/**
 * Roll the nightly dream algorithm with independent character/location/object decisions.
 *
 * @param describedCast - Cast members with descriptions (filtered for non-empty)
 * @param mediumKey - The selected medium key
 * @param isFaceSwapMedium - Whether the medium supports face swap
 * @param forceCastRole - Test mode override (e.g. 'self')
 * @param forceNightlyPath - Test mode override for backwards compat
 */
export function rollDream(
  describedCast: CastMember[],
  mediumKey: string,
  isFaceSwapMedium: boolean,
  forceCastRole?: string | null,
  forceNightlyPath?: string | null
): DreamRoll {
  const findRole = (r: string) => describedCast.find((m) => m.role === r);
  const isSceneOnly = SCENE_ONLY_MEDIUMS.has(mediumKey);

  // ── Backwards compat for force_nightly_path ──
  if (
    forceNightlyPath === 'personal_cast' ||
    forceNightlyPath === 'personal_scene' ||
    forceNightlyPath === 'cast_random'
  ) {
    return rollLegacyPath(
      forceNightlyPath,
      describedCast,
      mediumKey,
      isFaceSwapMedium,
      isSceneOnly,
      forceCastRole,
      findRole
    );
  }

  // ── Step 1: Character roll (50%) ──
  let includeCharacter: boolean;

  if (forceCastRole === null) {
    includeCharacter = false;
  } else if (isSceneOnly) {
    includeCharacter = false;
  } else if (describedCast.length === 0) {
    includeCharacter = false;
  } else if (forceCastRole) {
    includeCharacter = true;
  } else {
    includeCharacter = Math.random() < 0.5;
  }

  // ── Step 2: Location roll (60%) ──
  let includeLocation = Math.random() < 0.6;

  // ── Step 3: Object roll (50%) ──
  let includeObject = Math.random() < 0.5;

  // ── Step 4: Non-character path logic ──
  if (!includeCharacter) {
    const pureSceneRoll = Math.random();
    if (pureSceneRoll < 0.15) {
      // 15% deliberate pure scene — no location, no object
      includeLocation = false;
      includeObject = false;
    } else {
      // 85% roll loc/obj normally, guarantee at least one
      if (!includeLocation && !includeObject) {
        if (Math.random() < 0.5) includeLocation = true;
        else includeObject = true;
      }
    }
  }

  // ── Step 5: Cast selection ──
  let castMembers: CastMember[] = [];

  if (includeCharacter) {
    if (forceCastRole) {
      const forced = findRole(forceCastRole);
      if (forced) castMembers = [forced];
    } else if (isFaceSwapMedium) {
      // Face-swap: single cast only (50% self, 25% +1, 25% pet)
      const whoRoll = Math.random() * 100;
      let pick: CastMember | undefined;
      if (whoRoll < 50) pick = findRole('self');
      else if (whoRoll < 75) pick = findRole('plus_one');
      else pick = findRole('pet');
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
          const whoRoll = Math.random() * 100;
          let pick: CastMember | undefined;
          if (whoRoll < 50) pick = findRole('self');
          else if (whoRoll < 75) pick = findRole('plus_one');
          else pick = findRole('pet');
          if (!pick) pick = available[0];
          castMembers = pick ? [pick] : [];
        } else if (countRoll < 0.75 || available.length === 2) {
          const shuffled = available.sort(() => Math.random() - 0.5);
          castMembers = shuffled.slice(0, 2);
        } else {
          castMembers = available;
        }
      }
    }
  }

  // ── Step 6: Composition ──
  let composition: 'character' | 'epic_tiny' | 'pure_scene';

  if (!includeCharacter) {
    if (!includeLocation && !includeObject) {
      // Pure scene (deliberate or fallback)
      composition = 'pure_scene';
    } else if (isSceneOnly) {
      // Scene-only mediums never get epic_tiny
      composition = 'pure_scene';
    } else {
      // Non-character with personal elements: 70% pure_scene, 30% epic_tiny (anonymous figure)
      composition = Math.random() < 0.7 ? 'pure_scene' : 'epic_tiny';
    }
  } else if (isSceneOnly) {
    composition = 'pure_scene';
  } else if (CHARACTER_MEDIUMS.has(mediumKey) || isFaceSwapMedium) {
    composition = 'character';
  } else {
    composition = Math.random() < 0.6 ? 'character' : 'epic_tiny';
  }

  // ── Build nightlyPath label for logging ──
  let nightlyPath: string;
  if (includeCharacter) {
    const parts = ['char'];
    if (includeLocation) parts.push('loc');
    if (includeObject) parts.push('obj');
    nightlyPath = parts.join('_');
  } else if (!includeLocation && !includeObject) {
    nightlyPath = 'pure';
  } else {
    const parts: string[] = [];
    if (includeLocation) parts.push('loc');
    if (includeObject) parts.push('obj');
    parts.push(composition === 'epic_tiny' ? 'epic_tiny' : 'pure');
    nightlyPath = parts.join('_');
  }

  return { nightlyPath, composition, castMembers, includeLocation, includeObject };
}

// ── Legacy path handler for backwards compat ──────────────────────────

function rollLegacyPath(
  path: 'personal_cast' | 'personal_scene' | 'cast_random',
  describedCast: CastMember[],
  mediumKey: string,
  isFaceSwapMedium: boolean,
  isSceneOnly: boolean,
  forceCastRole: string | null | undefined,
  findRole: (r: string) => CastMember | undefined
): DreamRoll {
  let includeCharacter = false;
  let includeLocation = false;
  let includeObject = false;

  if (path === 'personal_cast') {
    includeCharacter = true;
    includeLocation = Math.random() < 0.6;
    includeObject = Math.random() < 0.5;
    if (!includeLocation && !includeObject) {
      if (Math.random() < 0.5) includeLocation = true;
      else includeObject = true;
    }
  } else if (path === 'personal_scene') {
    includeCharacter = false;
    includeLocation = Math.random() < 0.6;
    includeObject = Math.random() < 0.5;
    if (!includeLocation && !includeObject) {
      if (Math.random() < 0.5) includeLocation = true;
      else includeObject = true;
    }
  } else {
    // cast_random — loosened: char=yes, loc 30%, obj 30%
    includeCharacter = true;
    includeLocation = Math.random() < 0.3;
    includeObject = Math.random() < 0.3;
  }

  // Override for scene-only / no cast
  if (isSceneOnly || describedCast.length === 0) includeCharacter = false;

  // Cast selection (same as main algorithm)
  let castMembers: CastMember[] = [];
  if (includeCharacter) {
    if (forceCastRole) {
      const forced = findRole(forceCastRole);
      if (forced) castMembers = [forced];
    } else if (isFaceSwapMedium) {
      const whoRoll = Math.random() * 100;
      let pick: CastMember | undefined;
      if (whoRoll < 50) pick = findRole('self');
      else if (whoRoll < 75) pick = findRole('plus_one');
      else pick = findRole('pet');
      if (!pick) pick = describedCast[0];
      if (pick) castMembers = [pick];
    } else {
      castMembers = [...describedCast].sort(() => Math.random() - 0.5).slice(0, 1);
    }
  }

  // Composition
  let composition: 'character' | 'epic_tiny' | 'pure_scene';
  if (!includeCharacter) {
    composition = 'pure_scene';
  } else if (CHARACTER_MEDIUMS.has(mediumKey) || isFaceSwapMedium) {
    composition = 'character';
  } else {
    composition = Math.random() < 0.6 ? 'character' : 'epic_tiny';
  }

  return {
    nightlyPath: path,
    composition,
    castMembers,
    includeLocation,
    includeObject,
  };
}

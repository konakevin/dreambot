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

// ── Types ──────────────────────────────────────────────────────────────

export interface MediumProps {
  isCharacterOnly: boolean;
  faceSwaps: boolean;
}

export interface CastMember {
  role: string;
  description?: string;
  thumb_url?: string;
  relationship?: string;
}

export type CompositionMode =
  | 'balanced'
  | 'open_vista'
  | 'layered_depth'
  | 'negative_space'
  | 'low_angle_hero'
  | 'overhead'
  | 'intimate_close';

export interface DreamRoll {
  /** Descriptive path for logging/analytics */
  nightlyPath: string;
  /** Visual composition: character focus, tiny figure in vast scene, or pure environment */
  composition: 'character' | 'epic_tiny' | 'pure_scene';
  /** Camera/framing composition style */
  compositionMode: CompositionMode;
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
 * All medium behavior is driven by DB properties passed via `medium` — no hardcoded sets.
 */
export function rollDream(
  describedCast: CastMember[],
  medium: MediumProps,
  forceCastRole?: string | null,
  forceNightlyPath?: string | null
): DreamRoll {
  const findRole = (r: string) => describedCast.find((m) => m.role === r);

  // ── Backwards compat for force_nightly_path ──
  if (
    forceNightlyPath === 'personal_cast' ||
    forceNightlyPath === 'personal_scene' ||
    forceNightlyPath === 'cast_random'
  ) {
    return rollLegacyPath(forceNightlyPath, describedCast, medium, forceCastRole, findRole);
  }

  // ── Step 1: Character roll (50%) ──
  let includeCharacter: boolean;

  if (forceCastRole === null) {
    includeCharacter = false;
  } else if (forceCastRole) {
    includeCharacter = true;
  } else if (describedCast.length === 0) {
    includeCharacter = false;
  } else {
    includeCharacter = Math.random() < 0.5;
  }

  // ── Step 2: Location — ALWAYS included for personalization ──
  const includeLocation = true;

  // ── Step 3: Object roll (50%) ──
  let includeObject = Math.random() < 0.5;

  // ── Step 4: Non-character path logic ──
  // Location is always true (Step 2), so the non-character path always includes
  // location. The only remaining choice is whether to also include an object.
  if (!includeCharacter) {
    const pureSceneRoll = Math.random();
    if (pureSceneRoll < 0.15) {
      includeObject = false;
    }
  }

  // ── Step 5: Cast selection ──
  let castMembers: CastMember[] = [];

  if (includeCharacter) {
    if (forceCastRole === 'dual') {
      const s = findRole('self');
      const p = findRole('plus_one');
      if (s && p) castMembers = [s, p];
      else if (s) castMembers = [s];
    } else if (forceCastRole) {
      const forced = findRole(forceCastRole);
      if (forced) castMembers = [forced];
    } else if (medium.faceSwaps) {
      const selfMember = findRole('self');
      const plusOne = findRole('plus_one');
      if (selfMember && plusOne && Math.random() < 0.25) {
        // 25% dual face swap when both self + plus_one exist
        castMembers = [selfMember, plusOne];
      } else {
        // Single face swap (50% self, 25% +1, 25% pet)
        const whoRoll = Math.random() * 100;
        let pick: CastMember | undefined;
        if (whoRoll < 50) pick = findRole('self');
        else if (whoRoll < 75) pick = findRole('plus_one');
        else pick = findRole('pet');
        if (!pick) pick = describedCast[0];
        if (pick) castMembers = [pick];
      }
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
      composition = 'pure_scene';
    } else {
      composition = Math.random() < 0.7 ? 'pure_scene' : 'epic_tiny';
    }
  } else if (medium.isCharacterOnly || medium.faceSwaps) {
    composition = 'character';
  } else if (castMembers.length >= 2) {
    composition = 'character';
  } else {
    composition = Math.random() < 0.6 ? 'character' : 'epic_tiny';
  }

  // ── Step 7: Composition mode roll ──
  const COMPOSITION_WEIGHTS: [CompositionMode, number][] = [
    ['balanced', 25],
    ['open_vista', 20],
    ['layered_depth', 15],
    ['negative_space', 15],
    ['low_angle_hero', 10],
    ['overhead', 7.5],
    ['intimate_close', 7.5],
  ];
  // Clamp for face-swap: ban modes that shrink or obscure the face
  const FACESWAP_ALLOWED: Set<CompositionMode> = new Set([
    'balanced',
    'open_vista',
    'layered_depth',
    'intimate_close',
    'low_angle_hero',
  ]);
  const DUAL_FACESWAP_ALLOWED: Set<CompositionMode> = new Set([
    'balanced',
    'intimate_close',
    'layered_depth',
  ]);
  const isDual = medium.faceSwaps && includeCharacter && castMembers.length === 2;
  const allowedSet = isDual
    ? DUAL_FACESWAP_ALLOWED
    : medium.faceSwaps && includeCharacter
      ? FACESWAP_ALLOWED
      : null;
  const eligibleWeights = allowedSet
    ? COMPOSITION_WEIGHTS.filter(([mode]) => allowedSet.has(mode))
    : COMPOSITION_WEIGHTS;
  const totalCompWeight = eligibleWeights.reduce((s, [, w]) => s + w, 0);
  let compRoll = Math.random() * totalCompWeight;
  let compositionMode: CompositionMode = 'balanced';
  for (const [mode, weight] of eligibleWeights) {
    compRoll -= weight;
    if (compRoll <= 0) {
      compositionMode = mode;
      break;
    }
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

  return { nightlyPath, composition, compositionMode, castMembers, includeLocation, includeObject };
}

// ── Legacy path handler for backwards compat ──────────────────────────

function rollLegacyPath(
  path: 'personal_cast' | 'personal_scene' | 'cast_random',
  describedCast: CastMember[],
  medium: MediumProps,
  forceCastRole: string | null | undefined,
  findRole: (r: string) => CastMember | undefined
): DreamRoll {
  let includeCharacter = false;
  let includeLocation = false;
  let includeObject = false;

  if (path === 'personal_cast') {
    includeCharacter = true;
    includeLocation = true;
    includeObject = Math.random() < 0.5;
    if (!includeLocation && !includeObject) {
      if (Math.random() < 0.5) includeLocation = true;
      else includeObject = true;
    }
  } else if (path === 'personal_scene') {
    includeCharacter = false;
    includeLocation = true;
    includeObject = Math.random() < 0.5;
    if (!includeLocation && !includeObject) {
      if (Math.random() < 0.5) includeLocation = true;
      else includeObject = true;
    }
  } else {
    includeCharacter = true;
    includeLocation = true;
    includeObject = Math.random() < 0.3;
  }

  if (describedCast.length === 0) includeCharacter = false;

  let castMembers: CastMember[] = [];
  if (includeCharacter) {
    if (forceCastRole) {
      const forced = findRole(forceCastRole);
      if (forced) castMembers = [forced];
    } else if (medium.faceSwaps) {
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

  let composition: 'character' | 'epic_tiny' | 'pure_scene';
  if (!includeCharacter) {
    composition = 'pure_scene';
  } else if (medium.isCharacterOnly || medium.faceSwaps) {
    composition = 'character';
  } else if (castMembers.length >= 2) {
    composition = 'character';
  } else {
    composition = Math.random() < 0.6 ? 'character' : 'epic_tiny';
  }

  return {
    nightlyPath: path,
    composition,
    compositionMode: 'balanced' as CompositionMode,
    castMembers,
    includeLocation,
    includeObject,
  };
}

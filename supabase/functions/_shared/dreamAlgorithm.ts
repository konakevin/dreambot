/**
 * Dream Algorithm — independent rolling logic for nightly dreams.
 *
 * Independent rolls (not path-based):
 *   Character: 50% (face swap when medium supports it)
 *   Location:  always included (from user's dream_seeds.places)
 *
 * (Object roll was removed 2026-06-02 with the whole objects feature —
 * see project_objects_removed_2026-06-02 memory.)
 *
 * Non-character composition: pure_scene with the user's location.
 * Face-swap mediums: single cast member per dream (67% self, 33% +1). Pets
 * are not supported in nightly dreams (Kevin 2026-06-07).
 * Non-face-swap mediums: 1-3 cast members rendered stylized.
 */

// ── Types ──────────────────────────────────────────────────────────────

export interface MediumProps {
  isCharacterOnly: boolean;
  isSceneOnly: boolean;
  faceSwaps: boolean;
}

export interface CastMember {
  role: string;
  description?: string;
  thumb_url?: string;
  /** Object path in the PRIVATE `cast-photos` bucket (migration 292). */
  storage_path?: string;
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
  forceNightlyPath?: string | null,
  forceComposition?: 'character' | 'epic_tiny' | 'pure_scene' | null
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
  // Scene-only mediums (e.g., real_astro NASA astrophotography) NEVER render
  // a character — even if forceCastRole is set or the user has cast members.
  // The medium's intent is environment-only; injecting a character breaks
  // the visual contract. Resolves at the very top so every downstream step
  // (cast selection, composition) sees includeCharacter=false consistently.
  let includeCharacter: boolean;

  if (medium.isSceneOnly) {
    includeCharacter = false;
  } else if (forceCastRole === null) {
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

  // (Step 3 — object roll — removed 2026-06-02 with the whole objects
  // feature. The location-only personalization remains.)

  // ── Step 4: Cast selection ──
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
        // Internal fallback split — DEAD for nightly (which forces the cast role
        // via chaosTier's rollNightlyDreamType: the live 40/30/30 dual/self/+1
        // lever). This only fires if rollDream is ever called with no forced
        // cast role, which no production caller does (create/first-dream/nightly
        // all force it). Left at the historical 25/67 to avoid implying it's live.
        castMembers = [selfMember, plusOne];
      } else {
        // Single face swap (67% self, 33% +1). Pets not supported (2026-06-07).
        const selfM = findRole('self');
        const plus1 = findRole('plus_one');
        let pick: CastMember | undefined;
        if (selfM && plus1) {
          pick = Math.random() < 0.67 ? selfM : plus1;
        } else {
          pick = selfM || plus1;
        }
        if (!pick) pick = describedCast.find((m) => m.role !== 'pet');
        if (pick) castMembers = [pick];
      }
    } else {
      // Non-face-swap. Cast is at most 2 (self + plus_one) since pets are
      // not supported. 40% single, 60% both.
      const selfM = findRole('self');
      const plus1 = findRole('plus_one');
      const available = [selfM, plus1].filter((m): m is CastMember => Boolean(m));
      if (available.length <= 1) {
        castMembers = available;
      } else if (Math.random() < 0.4) {
        // Single — 67% self, 33% +1
        castMembers = [Math.random() < 0.67 ? selfM! : plus1!];
      } else {
        castMembers = [selfM!, plus1!];
      }
    }
  }

  // ── Step 5: Composition ──
  // Scene-only mediums are pinned to pure_scene — even epic_tiny would put
  // a silhouette in the frame, which breaks the medium's contract (e.g.,
  // NASA astrophotography has no human silhouettes anywhere).
  //
  // forceComposition (mig 239 chaos-tier flow): nightly-dreams pre-rolls the
  // dream type and forces composition explicitly. Honored unless it would
  // contradict a medium contract (scene-only → still pure_scene).
  let composition: 'character' | 'epic_tiny' | 'pure_scene';

  if (medium.isSceneOnly) {
    composition = 'pure_scene';
  } else if (forceComposition) {
    composition = forceComposition;
  } else if (!includeCharacter) {
    // No cast → pure_scene only. epic_tiny references shortCastDesc / tinyDesc
    // in the brief which resolves to "undefined" without a cast, polluting
    // the Sonnet input. Mirrors the second composition block below which
    // already pinned pure_scene for cast-less users.
    composition = 'pure_scene';
  } else if (medium.isCharacterOnly || medium.faceSwaps) {
    composition = 'character';
  } else if (castMembers.length >= 2) {
    composition = 'character';
  } else {
    composition = Math.random() < 0.6 ? 'character' : 'epic_tiny';
  }

  // ── Step 6: Composition mode roll ──
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
    nightlyPath = parts.join('_');
  } else if (!includeLocation) {
    nightlyPath = 'pure';
  } else {
    nightlyPath = composition === 'epic_tiny' ? 'loc_epic_tiny' : 'loc_pure';
  }

  return { nightlyPath, composition, compositionMode, castMembers, includeLocation };
}

// ── Legacy path handler for backwards compat ──────────────────────────

function rollLegacyPath(
  path: 'personal_cast' | 'personal_scene' | 'cast_random',
  describedCast: CastMember[],
  medium: MediumProps,
  forceCastRole: string | null | undefined,
  findRole: (r: string) => CastMember | undefined
): DreamRoll {
  // Object roll removed 2026-06-02 — legacy paths now collapse to
  // location-on/character-on/off booleans only.
  let includeCharacter = false;
  let includeLocation = false;

  if (path === 'personal_cast') {
    includeCharacter = true;
    includeLocation = true;
  } else if (path === 'personal_scene') {
    includeCharacter = false;
    includeLocation = true;
  } else {
    includeCharacter = true;
    includeLocation = true;
  }

  if (describedCast.length === 0) includeCharacter = false;

  let castMembers: CastMember[] = [];
  if (includeCharacter) {
    if (forceCastRole) {
      const forced = findRole(forceCastRole);
      if (forced) castMembers = [forced];
    } else if (medium.faceSwaps) {
      // Single face swap (67% self, 33% +1). Pets not supported (2026-06-07).
      const selfM = findRole('self');
      const plus1 = findRole('plus_one');
      let pick: CastMember | undefined;
      if (selfM && plus1) {
        pick = Math.random() < 0.67 ? selfM : plus1;
      } else {
        pick = selfM || plus1;
      }
      if (!pick) pick = describedCast.find((m) => m.role !== 'pet');
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
  };
}

/**
 * Dream Algorithm — the rolling logic for nightly dreams.
 *
 * Single source of truth for:
 * - Cast vs scene probability
 * - WHO appears in cast dreams
 * - HOW the composition is rendered (character vs epic_tiny)
 * - Which mediums are scene-only vs character-only
 *
 * Used by: Edge Function (generate-dream), nightly-dreams.js (GitHub Actions)
 */

// ── Configuration ──────────────────────────────────────────────────────

/** Probability of a cast dream (vs pure scene) */
export const CAST_PROBABILITY = 0.75;

/** Mediums that ALWAYS render as pure scene (no cast) */
export const SCENE_ONLY_MEDIUMS = new Set([
  'oil_painting',
  'embroidery',
  'watercolor',
  'vaporwave',
  'retro_poster',
  'pop_art',
  '8bit',
  'pixel_art',
  'fantasy',
]);

/** Mediums that ALWAYS use the character composition path */
export const CHARACTER_MEDIUMS = new Set(['claymation', 'lego', 'funko_pop', 'disney', 'sack_boy']);

/** Mediums that should be skipped (re-rolled) in nightly dreams */
export const NIGHTLY_SKIP_MEDIUMS = new Set(['watercolor', 'neon', 'pencil_sketch']);

/**
 * WHO weights within cast dreams (must sum to 100)
 *   Just me:       15%
 *   Just +1:       10%
 *   Just pet:      10%
 *   Me + partner:  40%
 *   Me + pet:      15%
 *   All three:     10%
 */
const WHO_THRESHOLDS = [
  { max: 15, roles: ['self'] },
  { max: 25, roles: ['plus_one'] },
  { max: 35, roles: ['pet'] },
  { max: 75, roles: ['self', 'plus_one'] },
  { max: 90, roles: ['self', 'pet'] },
  { max: 100, roles: ['self', 'plus_one', 'pet'] },
] as const;

/**
 * HOW split for singles: 60% character, 40% epic_tiny
 * Duos/groups: always character
 */
const SINGLE_CHARACTER_PROBABILITY = 0.6;

// ── Types ──────────────────────────────────────────────────────────────

export interface CastMember {
  role: string;
  description?: string;
  thumb_url?: string;
  relationship?: string;
}

export interface DreamRoll {
  /** The composition path */
  dreamPath: 'character' | 'epic_tiny' | 'pure_scene';
  /** Primary cast member (null for pure scene) */
  castPick: CastMember | null;
  /** All cast members in this dream (empty for singles, 2+ for duos/groups) */
  multiCast: CastMember[];
}

// ── Algorithm ──────────────────────────────────────────────────────────

/**
 * Roll the dream algorithm.
 *
 * @param describedCast - Cast members with descriptions (filtered for non-empty)
 * @param mediumKey - The selected medium key
 * @param forceCastRole - Test mode override (e.g. 'self+plus_one')
 */
export function rollDream(
  describedCast: CastMember[],
  mediumKey: string,
  forceCastRole?: string | null
): DreamRoll {
  const findRole = (r: string) => describedCast.find((m) => m.role === r);

  // ── Determine cast ──
  let castPick: CastMember | null = null;
  let multiCast: CastMember[] = [];

  if (forceCastRole && typeof forceCastRole === 'string' && forceCastRole.includes('+')) {
    // Test mode: duo/group
    const roles = forceCastRole.split('+');
    multiCast = roles.map((r) => findRole(r)).filter(Boolean) as CastMember[];
    if (multiCast.length > 0) castPick = multiCast[0];
  } else if (forceCastRole) {
    // Test mode: single
    castPick = findRole(forceCastRole) ?? null;
  } else if (forceCastRole === null) {
    // Explicitly no cast (test tool "None" button)
    castPick = null;
  } else if (
    describedCast.length > 0 &&
    !SCENE_ONLY_MEDIUMS.has(mediumKey) &&
    Math.random() < CAST_PROBABILITY
  ) {
    // Normal nightly roll
    const whoRoll = Math.random() * 100;
    const match = WHO_THRESHOLDS.find((t) => whoRoll < t.max);
    if (match) {
      const members = match.roles.map((r) => findRole(r)).filter(Boolean) as CastMember[];
      if (members.length > 1) {
        multiCast = members;
        castPick = members[0];
      } else if (members.length === 1) {
        castPick = members[0];
      } else {
        castPick = describedCast[0];
      }
    }
  }

  // ── Determine composition path ──
  let dreamPath: 'character' | 'epic_tiny' | 'pure_scene';

  if (!castPick || SCENE_ONLY_MEDIUMS.has(mediumKey)) {
    dreamPath = 'pure_scene';
  } else if (CHARACTER_MEDIUMS.has(mediumKey)) {
    dreamPath = 'character';
  } else if (multiCast.length > 1) {
    // Duos/groups always character
    dreamPath = 'character';
  } else {
    // Singles: 60% character, 40% epic_tiny
    dreamPath = Math.random() < SINGLE_CHARACTER_PROBABILITY ? 'character' : 'epic_tiny';
  }

  return { dreamPath, castPick, multiCast };
}

/**
 * Dual face swap composition modes — flat (default) vs staggered (depth).
 *
 * "flat" — both characters at similar depth, side-by-side. Today's behavior.
 *          Returns null overrides; brief assembly uses existing inline text.
 *
 * "staggered" — one character closer to camera (foreground), the other set
 *               back 6-10 feet (mid-distance). HARD constraints preserve the
 *               v1 face swap pipeline's invariants:
 *                 - Each face stays in its own half of the frame
 *                 - Back face still ≥ 25% of frame height (cdingram detection)
 *                 - Both faces three-quarter toward camera (no profile drift)
 *
 * Default rollout: 0% staggered (force-only) while iterating on brief quality.
 * Once staggered renders consistently land swaps cleanly, flip the default
 * roll rate to 30% in pickDualDepthMode().
 */

export type DualDepthMode = 'flat' | 'staggered';

/**
 * Brief fragments that override the equivalent flat-mode strings in
 * nightly-dreams' dual face swap brief. When `null` (flat mode) is returned,
 * the existing inline brief text is used unchanged — flat path stays
 * byte-identical to today's behavior.
 */
export interface DualDepthOverrides {
  /** Replaces the inline `faceLockPhrase` for dual face swap. */
  faceLockPhrase: string;
  /** Replaces the inline `dualSepRule`. Strict left/right separation kept. */
  separationRule: string;
  /** Replaces the "Medium shot — both characters waist-up..." line. */
  framingRule: string;
  /** Replaces the "Three-quarter view on both faces..." line. */
  faceAngleRule: string;
  /** Replaces the "Characters are STATIONARY..." line. */
  staticRule: string;
  /** Replaces the "Eye-level camera angle..." line. */
  cameraRule: string;
  /** Replaces the "Both characters should feel CONNECTED..." line. */
  connectionRule: string;
  /** Appended after the COMPOSITION RULES block — depth-specific hard rules. */
  extraConstraints: string;
}

export const STAGGERED_OVERRIDES: DualDepthOverrides = {
  faceLockPhrase:
    'two people at different depths, one closer to camera and one set back, person on left side, person on right side, both faces clearly visible, three-quarter view, eyes and nose visible',
  separationRule:
    '\n- Character 1 in LEFT half, Character 2 in RIGHT half. Clear horizontal separation. Heads MUST NOT overlap horizontally. Neither character crosses the vertical midline. No back-of-head views, no full profiles.',
  framingRule:
    'DEPTH-STAGGERED FRAMING — one character is closer to camera (foreground, larger in frame), the other is set back 6-10 feet behind in mid-distance (smaller but face still clearly visible and recognizable). NOT a wide establishing shot. NOT a flat side-by-side composition.',
  faceAngleRule:
    'Both faces three-quarter view toward the VIEWER — even the further character has their face angled toward the camera with eyes and nose clearly visible. NOT facing each other. NOT looking away from camera. NOT in profile.',
  staticRule:
    'Characters are STATIONARY — standing, sitting, leaning. No walking through scene, no motion blur.',
  cameraRule:
    'Eye-level camera angle on the closer character. Warm atmospheric lighting — never harsh overhead or flat institutional light.',
  connectionRule:
    "Both characters share the same moment — the further character watches, listens, walks alongside, or reacts to the closer character's action. Connected, not isolated.",
  extraConstraints:
    "\n\nDEPTH HARD CONSTRAINTS — NON-NEGOTIABLE:\n- The further character's face MUST occupy AT LEAST 25% of frame height (recognizable, not tiny background figure)\n- Neither character crosses the vertical midline of the frame\n- The two characters' heads must be horizontally separated — no overlap\n- Both characters' eyes and noses clearly visible toward camera\n- Foreground/background assignment is your choice — pick whichever feels natural for the moment",
};

/**
 * Pick a depth mode for a dual face swap render.
 *
 * `forceMode` (from body param `force_dual_depth_mode`) overrides the random
 * roll for QA. Default behavior: always flat (0% staggered) until staggered
 * brief is dialed in.
 */
export function pickDualDepthMode(forceMode?: string | null): {
  mode: DualDepthMode;
  overrides: DualDepthOverrides | null;
} {
  if (forceMode === 'staggered') {
    return { mode: 'staggered', overrides: STAGGERED_OVERRIDES };
  }
  if (forceMode === 'flat') {
    return { mode: 'flat', overrides: null };
  }
  // Default: flat (0% staggered rollout while iterating). Flip to e.g.
  // `Math.random() < 0.3 ? staggered : flat` once quality validated.
  return { mode: 'flat', overrides: null };
}

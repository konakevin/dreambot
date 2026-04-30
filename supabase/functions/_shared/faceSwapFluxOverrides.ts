/**
 * Face-swap flux fragment overrides for stylized mediums.
 *
 * The DB `dream_mediums` directives + flux_fragments are tuned for the
 * GENERIC (non-face-swap) render — they emphasize the medium's visual
 * language (fairy tale eyes, anime eye proportions, etc.). When a
 * face-swap fires on these mediums, those same emphases fight the swap
 * (cdingram pastes a real human face onto an "anime eyes" character —
 * uncanny bubble-eye relics).
 *
 * This module returns swap-friendly versions of the flux_fragment + directive
 * that front-load "realistic human face" language so Flux renders a swap-
 * compatible face from the start.
 *
 * The DB row stays UNCHANGED — this is a runtime override applied only when
 * face_swap is active. Generic (non-face-swap) renders still use the DB version.
 *
 * Used by:
 *   - nightly-dreams (in face-swap brief assembly)
 *   - dualBriefBuilder (V4 dual face-swap path)
 */

interface FaceSwapOverride {
  fluxFragment: string;
  /** Optional directive replacement; falls back to DB directive if undefined */
  directive?: string;
  /**
   * For directives that should be derived from the existing DB directive
   * via string replacement, returns the modified directive given the original.
   */
  directiveTransform?: (original: string) => string;
}

export const FACE_SWAP_FLUX_OVERRIDES: Record<string, FaceSwapOverride> = {
  fairytale: {
    fluxFragment:
      'realistic human face with normal sized eyes and natural proportions, thin subtle eyebrows, NOT cartoon eyes, NOT anime eyes, NOT Disney princess eyes, hand-drawn 2D illustration set in a fairy tale world, painted watercolor backgrounds, flowing organic linework, golden hour lighting, painterly environments, rich warm color palette, strictly 2D not 3D CGI',
    directive:
      'Create images set in a hand-drawn 2D fairy tale world. Strictly 2D, never 3D CGI. Visual qualities: lush painted watercolor backgrounds, flowing organic linework, romantic golden hour lighting, painterly atmospheric environments, rich warm color palettes. Fairy tale imagery: castles, enchanted forests, magical transformations. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size — the same size you would see in a photograph. Do NOT enlarge eyes even slightly. Do NOT use cartoon, anime, or Disney character design for faces. Thin natural eyebrows only. The WORLD is fairy tale but the FACES are realistic. Apply this style to whatever subject and framing is provided.',
  },
  storybook: {
    fluxFragment:
      'picture book illustration, hand-painted with visible brush or pencil texture, warm golden color palette, cozy intimate feeling, watercolor gouache techniques, printed page quality, soft hand-drawn look, realistic human face with normal sized eyes and natural proportions, NOT cartoon eyes',
    directiveTransform: (orig) =>
      orig.replace(
        'friendly simplified character design with expressive faces',
        'detailed character rendering with photorealistic human faces and natural proportions'
      ),
  },
  pencil: {
    fluxFragment:
      'colored pencil drawing, prismacolor art, visible pencil strokes, directional hatching, paper texture showing through, layered transparent color, hand-drawn quality, grainy tooth texture, confident linework, realistic human face with natural proportions',
  },
  anime: {
    fluxFragment:
      'realistic human face with normal sized eyes and natural proportions, eyes open and visible, thin subtle eyebrows, NOT anime eyes, NOT manga eyes, NOT chibi, NOT exaggerated facial expressions, cel-shaded illustrated scene, Japanese illustrated environments, vibrant color palette, clean linework, painted backgrounds, atmospheric lighting, strictly 2D not 3D CGI',
    directive:
      'Create images with cel-shaded illustrated environments inspired by Japanese illustration. Strictly 2D, never 3D CGI. Visual qualities: painted environments, vibrant color palettes, clean confident linework, atmospheric lighting, cel-shaded scenery. Imagery: cherry blossoms, neon-lit streets, traditional architecture, modern cityscapes, fantasy elements. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size and OPEN, never closed, never squinting in laughter, never exaggerated. Do NOT use anime, manga, or chibi character design for faces. Thin natural eyebrows only. Faces stay realistic regardless of emotion or scene. The ENVIRONMENT is illustrated but the FACES are realistic. Apply this aesthetic to whatever subject and framing is provided.',
  },
};

/**
 * Apply the face-swap override to a medium if one exists for its key.
 * Returns a NEW object — does not mutate the input. If no override exists,
 * returns the input unchanged (same reference).
 */
export function applyFaceSwapOverride<
  T extends { key: string; fluxFragment: string; directive: string },
>(medium: T): T {
  const override = FACE_SWAP_FLUX_OVERRIDES[medium.key];
  if (!override) return medium;
  let directive = medium.directive;
  if (override.directive) directive = override.directive;
  else if (override.directiveTransform) directive = override.directiveTransform(medium.directive);
  return {
    ...medium,
    fluxFragment: override.fluxFragment,
    directive,
  };
}

/**
 * Face-swap directive + flux_fragment override resolver.
 *
 * Why face-swap overrides exist:
 *   The DB-stored `directive` + `flux_fragment` for stylized mediums
 *   (anime, fairytale, storybook, pencil) emphasize the medium's
 *   signature look — anime eye proportions, fairy-tale princess eyes,
 *   etc. When a face-swap fires, those emphases fight the swap
 *   (cdingram pastes a real human face onto an "anime eyes" character —
 *   bubble-eye uncanny). The override front-loads "realistic human face
 *   with normal sized eyes" so Flux renders a swap-compatible face from
 *   the start.
 *
 * Storage:
 *   The override values live in the DB on `dream_mediums` —
 *     - `face_swap_directive TEXT NULL`
 *     - `face_swap_flux_fragment TEXT NULL`
 *   Either column can be NULL independently. NULL → fall back to the
 *   regular column. See migration 154.
 *
 * Used by:
 *   - nightly-dreams (face-swap brief assembly)
 *   - dualBriefBuilder (V4 dual face-swap path)
 *   Both call `applyFaceSwapOverride(medium)` only when face-swap is
 *   active for the render. Generic (non-face-swap) renders keep the
 *   regular DB values untouched.
 */

interface OverrideableMedium {
  key: string;
  directive: string;
  fluxFragment: string;
  faceSwapDirective?: string | null;
  faceSwapFluxFragment?: string | null;
}

/**
 * Apply the face-swap override to a medium if either override field is
 * set in the DB. Returns a new object — does not mutate the input. If
 * neither override is set, returns the input reference unchanged so
 * callers can cheap-compare via identity.
 */
export function applyFaceSwapOverride<T extends OverrideableMedium>(medium: T): T {
  const hasDirective = !!medium.faceSwapDirective;
  const hasFragment = !!medium.faceSwapFluxFragment;
  if (!hasDirective && !hasFragment) return medium;
  return {
    ...medium,
    directive: hasDirective ? (medium.faceSwapDirective as string) : medium.directive,
    fluxFragment: hasFragment ? (medium.faceSwapFluxFragment as string) : medium.fluxFragment,
  };
}

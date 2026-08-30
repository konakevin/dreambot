/**
 * Per-Flux-model medium-fragment overrides for face-swap character renders.
 * Applies to BOTH single-character and dual-character face-swap paths.
 *
 * Why this exists:
 *   Different Flux models respond very differently to medium signals.
 *   flux-1.1-pro ignores stylized fragments and defaults to photoreal —
 *   so we lock it to a curated "art" style that it actually renders well.
 *   flux-dev / flux-2-dev follow stylized mediums faithfully and don't
 *   need an override.
 *
 * How it works:
 *   When the face-swap path rolls a model that has overrides registered
 *   here, the dispatcher randomly picks one of the model's entries and
 *   uses it as the medium fragment regardless of which medium was
 *   originally rolled (fairytale/storybook/etc.). The user-visible
 *   dream_medium label stays — only the actual Flux rendering style
 *   swaps to the curated override.
 *
 * Subject-agnostic by design:
 *   Fragments below describe ONLY the style ("watercolor and ink",
 *   "polished digital painting", "comic strip illustration"). The
 *   subject ("one adult standing" vs "two adults standing together")
 *   is added by the character slot pipeline's identity blocks — so the
 *   same fragment works for single AND dual face-swap renders without
 *   modification.
 *
 * Adding a new override (curation workflow):
 *   1. Render with the model + a candidate medium fragment
 *   2. Kevin hearts a render that hits the visual bar
 *   3. Pull the exact medium fragment used and add it to that model's
 *      array below, with a comment dating the heart and the look.
 *
 * Empty / missing model entry → no override; the rolled medium's normal
 * face-swap fragment is used as-is.
 */

// Shared style anchors — subject-agnostic so the same string works for
// single-character and dual-character face-swap renders.
//
// 2026-08-30 — rewritten FACE-SWAP-FRIENDLY (Kevin). The old fragment ("fairy tale
// book illustration / hand-painted CHARACTER ART / classic illustrated STORYBOOK
// page / 2D illustration artwork / painted fairy tale scene") made flux-1.1-pro
// render big cartoon storybook eyes; the dual swap then pasted real faces onto those
// stylized eye sockets and mangled the eye region (the broken-eyes first-dream couple
// render). This slipped through the SAME cartoon-eye fix already applied to
// FRAG_ADULT_CARTOON below (2026-06-22). Now keeps the watercolor + ink LOOK but
// drops all storybook/2D/character-art language and POSITIVELY reinforces realistic
// human eye size + proportions so the swap lands cleanly.
const FRAG_WATERCOLOR_INK =
  'loose watercolor and ink painting with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, transparent pigment washes on textured watercolor paper, soft feathered bleeding edges, visible brushstrokes and fine ink linework, golden warm watercolor palette, naturalistic mature features, painterly portrait realism';

const FRAG_CRISP_ORNATE_ILLUSTRATION =
  'crisp ink illustration with bold confident linework, richly saturated jewel-tone colors, ornate decorative details, intricate line art, masterwork hand-drawn artwork, gallery-quality illustration print, polished editorial illustration style, vibrant fine art drawing, sharply rendered detailed illustration';

const FRAG_POLISHED_DIGITAL_RENDER =
  'polished digital painting, professional concept art, high-quality digital artwork, smooth painterly surfaces with crisp detail, vibrant saturated colors, masterful digital art, fine art digital painting, polished digital rendering';

// 2026-06-22 — rewritten to be FACE-SWAP-FRIENDLY. The old version leaned on
// "cartoon-style 2D drawing / Sunday newspaper comics / editorial cartoon",
// which rendered big stylized eyes regardless of vibe — the swap couldn't map a
// real face onto cartoon eyes and left broken artifacts (Kevin case #2). The
// "naturally-sized features" guards were negations Flux ignored. This version
// POSITIVELY reinforces realistic facial proportions + true-to-life eye size so
// the swap lands cleanly, while keeping the bold inked-comic look.
const FRAG_ADULT_CARTOON =
  'grounded semi-realistic comic-book illustration, painted graphic-novel art with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size and spacing, bold confident ink linework and rich saturated flat color, detailed hand-painted character art, naturalistic mature features, illustrated portrait realism';

// Override entry — each curated fragment can opt-out specific vibes that
// empirically push it into a bad failure mode (e.g. "epic" vibe + cartoon
// style triggered big-eye Disney-princess renders).
export type FaceSwapModelOverrideEntry = {
  fragment: string;
  bannedVibes?: string[];
};

export const FACE_SWAP_MODEL_OVERRIDES: Record<string, FaceSwapModelOverrideEntry[]> = {
  'black-forest-labs/flux-1.1-pro': [
    // 4-way rotation. flux-1.1-pro renders all 4 well; users get variety.
    { fragment: FRAG_WATERCOLOR_INK },
    { fragment: FRAG_CRISP_ORNATE_ILLUSTRATION },
    { fragment: FRAG_POLISHED_DIGITAL_RENDER },
    // 'epic' vibe is banned — empirically triggers chibi/big-eye renders
    // when combined with cartoon-style language (2026-05-11 R49 grading).
    { fragment: FRAG_ADULT_CARTOON, bannedVibes: ['epic'] },
  ],
  // flux-1.1-pro-ultra: INTENTIONALLY EXCLUDED 2026-05-11. The face-swap-dual
  // Edge Function hits Supabase's per-isolate compute cap (HTTP 546
  // WORKER_RESOURCE_LIMIT) because -ultra renders at higher resolution than
  // the other Flux models — the crop/swap/stitch pixel work overflows
  // the 150 MB memory ceiling. Empirically: 7/7 -ultra dual face swaps in
  // a recent window failed; 82/82 on flux-dev/2-dev/1.1-pro succeeded.
  // Re-enable only when face-swap-dual is upgraded to handle higher-res
  // sources (Phase 3 of the scaling work).
  //
  // flux-dev / flux-2-dev: no overrides — they honor the rolled medium's
  // face_swap_flux_fragment directly. Add entries here if specific looks
  // emerge that we want to lock in.
};

/**
 * Pick a curated medium-fragment override for the given Flux model.
 * Filters out entries whose `bannedVibes` includes the rolled vibe so
 * we don't fire a known-bad medium+vibe combo (e.g. cartoon + epic).
 * Returns null when no eligible override exists — caller falls back
 * to the rolled medium's normal face-swap fragment.
 */
export function pickFaceSwapModelOverride(model: string, vibe: string | null): string | null {
  const overrides = FACE_SWAP_MODEL_OVERRIDES[model];
  if (!overrides || overrides.length === 0) return null;
  const eligible = overrides.filter(
    (o) => !vibe || !o.bannedVibes || !o.bannedVibes.includes(vibe)
  );
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)].fragment;
}

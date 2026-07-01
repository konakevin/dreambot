/**
 * Photo restyle prompt resolver — fully DB-driven.
 *
 * Two paths, decided per-medium by the DB:
 *
 *   1. flux-dev rebuild — `dream_mediums.flux_dev_prompt_template` is set.
 *      For mediums whose subjects need non-human proportions (lego
 *      minifigures, Funko Pop vinyl) — Kontext can't reshape a head 3x
 *      body, it has to be invented from a vision description. Template
 *      uses {{photo}} / {{vibe}} / {{hint}} placeholders, substituted
 *      server-side.
 *
 *   2. kontext-pro transform — `dream_mediums.kontext_directive` is set.
 *      Default for every other medium. Preserves face/likeness; the
 *      directive is the literal first paragraph Kontext sees.
 *
 *   3. fallback — no kontext_directive AND no flux_dev_prompt_template:
 *      auto-generate a generic Kontext prompt from the regular directive.
 *      Last resort, intentionally bland.
 *
 * Editing any directive in the DB takes effect on the next request — no
 * Edge Function redeploy required.
 */

export type PhotoModel = 'kontext-pro' | 'flux-dev';

interface PhotoRestyleConfig {
  model: PhotoModel;
  buildPrompt: (photo: string, vibe: string, hint: string) => string;
}

interface MediumLike {
  directive?: string;
  label?: string;
  characterRenderMode?: string;
  kontextDirective?: string | null;
  fluxDevPromptTemplate?: string | null;
}

/**
 * Substitute {{photo}}, {{vibe}}, {{hint}} placeholders in a flux-dev
 * template stored in the DB. Anything wrapped in {{ }} that isn't one of
 * the known placeholders is left as-is so a typo doesn't silently swallow
 * legitimate brace-text in a directive.
 */
function applyTemplate(template: string, photo: string, vibe: string, hint: string): string {
  // {{hint}} expands with the framing line OR collapses to empty so the
  // template can place it on its own line without leaving a blank.
  const hintLine = hint ? `USER REQUEST: "${hint}"` : '';
  return template
    .replace(/\{\{photo\}\}/g, photo)
    .replace(/\{\{vibe\}\}/g, vibe)
    .replace(/\{\{hint\}\}/g, hintLine);
}

/**
 * Resolve the restyle config for a medium. All three paths are DB-driven —
 * see file header. Returns null only when no medium info is available
 * AND no fallback is possible.
 */
export function getPhotoRestyleConfig(
  _mediumKey: string,
  medium?: MediumLike
): PhotoRestyleConfig | null {
  if (!medium) return null;

  // 1. flux-dev rebuild path (lego, vinyl, future non-human mediums)
  const fluxTemplate = medium.fluxDevPromptTemplate;
  if (fluxTemplate && fluxTemplate.trim().length > 0) {
    return {
      model: 'flux-dev',
      buildPrompt: (photo, vibe, hint) => applyTemplate(fluxTemplate, photo, vibe, hint),
    };
  }

  // 2. kontext-pro transform path (default for every standard medium)
  if (!medium.directive) return null;
  const kontextPrompt = medium.kontextDirective || medium.directive;
  return {
    model: 'kontext-pro',
    // Imperative framing ("Also shift…"), not a descriptive trailing "Mood:"
    // paragraph — Kontext is an edit model and follows commands; the old
    // "Mood: Everything is warm…" flavor text was a visible no-op (2026-07-01
    // A/B: cozy vs macabre restyles were indistinguishable). The vibe string
    // itself should be a restyle_fragment (color/light/atmosphere only) when
    // the vibe has one — see restyle-photo.
    buildPrompt: (_photo, vibe, hint) =>
      `${kontextPrompt}\n\nAlso shift the overall mood and color grade of the image: ${vibe}${hint ? '\n' + hint : ''}`,
  };
}

// ── Reimagine prompt builders ──────────────────────────────────────────────
// Reimagine always uses flux-dev (new scene from scratch).
// Medium-specific templates for mediums that need special handling.

const REIMAGINE_TEMPLATES: Record<
  string,
  (photo: string, scenario: string, vibe: string) => string
> = {
  lego: (
    photo,
    scenario,
    vibe
  ) => `Write a Flux AI prompt (50-70 words) for a PHOTOGRAPH of a LEGO diorama:
- Start with: "Photograph of a real LEGO brick diorama"
- Subject from photo: ${photo} — becomes a LEGO MINIFIGURE (painted eyes, C-shaped hands, snap-on hair, matching clothing colors)
- NEW SCENARIO: ${scenario} — build this entire scene from LEGO bricks, studs visible everywhere
- Express mood through brick colors and lighting: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  pixels: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a pixel art scene:
- Start with: "16-bit pixel art, SNES era, visible pixel grid, limited 24-color palette"
- Subject from photo: ${photo} — becomes a pixel art sprite (blocky features, dot eyes, matching clothing colors)
- NEW SCENARIO: ${scenario} — render entirely in pixel art
- Express mood through palette warmth/coolness: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,

  vinyl: (photo, scenario, vibe) => `Write a Flux AI prompt (50-70 words) for a Funko Pop figure:
- Start with: "Product photograph of a Funko Pop vinyl collectible figure"
- Subject from photo: ${photo} — becomes a FUNKO POP (oversized head, tiny body, dot eyes, glossy vinyl, matching clothing colors)
- NEW SCENARIO: ${scenario} — setting built as a Funko Pop display diorama
- Express mood through lighting: ${vibe}
- Portrait 9:16
Output ONLY the prompt.`,
};

export function buildReimaginePrompt(
  mediumKey: string,
  photoDescription: string,
  scenario: string,
  vibeDirective: string
): string | null {
  const template = REIMAGINE_TEMPLATES[mediumKey];
  if (!template) return null;
  // Pass the FULL vibe directive — previous 200-char slice was cutting off the
  // concrete visual vocabulary (palette, flora/props, lighting rules) that
  // makes a vibe actually manifest in the render. Haiku downstream handles
  // length budgeting; we don't need to pre-truncate here.
  return template(photoDescription, scenario, vibeDirective);
}

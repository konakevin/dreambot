/**
 * Medium-specific photo restyle prompt templates.
 *
 * Each medium defines:
 *   - model: which AI model produces the best results
 *   - buildPrompt: custom prompt template with vibe woven into the medium's language
 *
 * The vibe is NOT appended at the end — it's integrated into each medium's
 * visual language so the mood manifests through the medium's own tools
 * (brush intensity, brick colors, palette warmth, etc.)
 *
 * Models:
 *   'kontext-pro' — Preserves face/likeness. Used for most mediums.
 *   'flux-dev'    — Full artistic rebuild. Only for LEGO (minifigures are non-human).
 */

export type PhotoModel = 'kontext-pro' | 'flux-dev';

interface PhotoRestyleConfig {
  model: PhotoModel;
  buildPrompt: (photo: string, vibe: string, hint: string) => string;
}

/**
 * Get restyle config for a medium. Custom configs override, otherwise
 * auto-generates based on render mode:
 *   - Embodied (gothic, claymation, etc.) → flux-dev full rebuild from vision description
 *   - Natural (watercolor, pencil, etc.) → kontext-pro transform from DB directive
 *
 * Both paths derive from the DB directive — single source of truth.
 */
export function getPhotoRestyleConfig(
  mediumKey: string,
  medium?: {
    directive?: string;
    label?: string;
    characterRenderMode?: string;
    kontextDirective?: string | null;
  }
): PhotoRestyleConfig | null {
  // Custom config takes priority (LEGO/vinyl need flux-dev full rebuild — non-human proportions)
  if (MEDIUM_CONFIGS[mediumKey]) return MEDIUM_CONFIGS[mediumKey];

  if (!medium || !medium.directive) return null;

  // All other mediums: Kontext transform from photo directly
  // Uses kontext_directive (tuned for Kontext's instruction format) if available,
  // falls back to regular directive
  const kontextPrompt = medium.kontextDirective || medium.directive;
  return {
    model: 'kontext-pro',
    buildPrompt: (_photo, vibe, hint) =>
      `${kontextPrompt}\n\nMood: ${vibe}${hint ? '\n' + hint : ''}`,
  };
}

const MEDIUM_CONFIGS: Record<string, PhotoRestyleConfig> = {
  // ═══════════════════════════════════════════════════════════════════════
  // FLUX-DEV — full artistic rebuild (non-human output, needs vision → Sonnet → Flux)
  // All other mediums auto-generate Kontext instructions from DB directive.
  // ═══════════════════════════════════════════════════════════════════════

  lego: {
    model: 'flux-dev',
    buildPrompt: (
      photo,
      vibe,
      hint
    ) => `You are writing a prompt for Flux AI to generate a photograph of a real LEGO diorama.

PHOTO TO RECREATE AS LEGO:
${photo}

Write a prompt (50-70 words, comma-separated) for a PHOTOGRAPH of a REAL LEGO SET:
- Start with: "Photograph of a real LEGO brick diorama"
- The person is a LEGO MINIFIGURE: painted dot eyes, printed smile, C-shaped hands, snap-on hair piece, skin tone matching the person. Match their clothing colors.
- EVERY object is built from LEGO bricks — visible studs, snap-together construction
- Floor is a LEGO baseplate. Walls are stacked bricks. Furniture is brick-built.
- If the person is very young/small, use a short-legs minifigure. Match gender with hair piece.
- Portrait 9:16

MOOD — express this through brick color choices, lighting angle, and atmosphere of the diorama:
${vibe}
${hint ? `\nUSER REQUEST: "${hint}"` : ''}
Output ONLY the prompt.`,
  },

  vinyl: {
    model: 'flux-dev',
    buildPrompt: (
      photo,
      vibe,
      hint
    ) => `You are writing a prompt for Flux AI to generate a photograph of a Funko Pop vinyl figure.

PERSON TO RECREATE AS FUNKO POP:
${photo}

Write a prompt (50-70 words, comma-separated) for a PRODUCT PHOTOGRAPH of a FUNKO POP FIGURE:
- Start with: "Product photograph of a Funko Pop vinyl collectible figure on a display shelf, soft studio lighting"
- The person becomes a FUNKO POP: massively oversized head (3x body), tiny body, dot eyes, no mouth, glossy vinyl plastic surface, painted-on clothing details matching their real colors
- Hair is a solid sculpted plastic piece matching their hair color
- Standing on a small circular black base
- Apply the vibe through background color and lighting mood: ${vibe}
- Portrait 9:16
${hint ? `USER REQUEST: "${hint}"` : ''}
Output ONLY the prompt.`,
  },
};

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
  return template(photoDescription, scenario, vibeDirective.slice(0, 200));
}

-- Migration 153: Move lego + vinyl flux-dev restyle templates from
-- hardcoded `MEDIUM_CONFIGS` (in supabase/functions/_shared/photoPrompts.ts)
-- into a new DB column so they're editable server-side without requiring
-- an Edge Function redeploy. Mirrors the kontext_directive pattern used
-- by every other medium (migration 152 set those directives on every row).
--
-- Schema:
--   - flux_dev_prompt_template TEXT NULL — full prompt template with
--     placeholders {{photo}}, {{vibe}}, {{hint}}. Substituted server-side
--     in restyle-photo at request time.
--   - When set, restyle-photo uses model='flux-dev' (full Sonnet+Flux
--     rebuild) instead of model='kontext-pro' (Kontext transform).
--   - When NULL (the default for every medium except lego + vinyl), the
--     existing kontext_directive path is used.
--
-- Why a separate column rather than reusing kontext_directive: the
-- flux-dev path is not a Kontext-style "transform this image" — it's a
-- full rebuild from a vision description. Different model, different
-- prompt structure, different placeholder semantics.

BEGIN;

ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS flux_dev_prompt_template TEXT;

COMMENT ON COLUMN public.dream_mediums.flux_dev_prompt_template IS
  'Optional flux-dev prompt template for mediums that need a full Sonnet+Flux rebuild rather than a Kontext transform (e.g., lego, vinyl — non-human proportions). Placeholders: {{photo}}, {{vibe}}, {{hint}}. When set, restyle-photo routes through flux-dev with this template; when NULL, falls back to kontext_directive + Kontext.';

-- ───────────────────────────────────────────────────────────────────────
-- LEGO — museum-quality LEGO marketing photography
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET flux_dev_prompt_template =
$tpl$You are writing a Flux AI prompt for a museum-quality professional product photograph of a real LEGO brick diorama, in the style of high-end LEGO marketing photography.

PHOTO TO RECREATE AS LEGO:
{{photo}}

Write a flattering prompt (50-70 words, comma-separated) for a PHOTOGRAPH of a REAL LEGO SET:
- Start with: "Professional product photograph of a real LEGO brick diorama"
- The person is a charming LEGO MINIFIGURE: classic painted dot eyes, friendly printed smile, C-shaped hands, snap-on hair piece in a flattering matching color, skin tone matching the person, clothing colors faithful to the photo
- EVERY object built from LEGO bricks — visible studs, snap-together construction, no non-brick elements
- Floor is a LEGO baseplate. Walls are stacked bricks. Furniture is brick-built.
- If the person is very young/small, use a short-legs minifigure. Match gender with hair piece.
- Soft warm studio lighting, shallow depth of field
- Portrait 9:16

MOOD — express through brick color choices, lighting angle, and atmosphere of the diorama:
{{vibe}}
{{hint}}
NOT amateurish, NOT distorted, NOT messy.
Output ONLY the prompt.$tpl$
WHERE key = 'lego';

-- ───────────────────────────────────────────────────────────────────────
-- VINYL — museum-quality Funko Pop product photography
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET flux_dev_prompt_template =
$tpl$You are writing a Flux AI prompt for a museum-quality professional product photograph of a Funko Pop vinyl figure, in the style of high-end collectible marketing photography.

PERSON TO RECREATE AS FUNKO POP:
{{photo}}

Write a flattering prompt (50-70 words, comma-separated) for a PRODUCT PHOTOGRAPH of a FUNKO POP FIGURE:
- Start with: "Professional product photograph of a Funko Pop vinyl collectible figure on a display shelf, soft studio lighting"
- The person becomes a charming FUNKO POP: oversized head (3x body), tiny body, friendly dot eyes, no mouth, glossy vinyl plastic surface with subtle highlights, painted-on clothing details faithful to their real colors
- Hair is a sculpted plastic piece in a flattering matching color
- Standing on a small circular black base
- Apply the vibe through background color and lighting mood: {{vibe}}
- Portrait 9:16
{{hint}}
NOT amateurish, NOT distorted, NOT messy.
Output ONLY the prompt.$tpl$
WHERE key = 'vinyl';

COMMIT;

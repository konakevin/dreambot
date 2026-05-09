-- Migration 154: Move FACE_SWAP_FLUX_OVERRIDES from hardcoded
-- supabase/functions/_shared/faceSwapFluxOverrides.ts into the DB so all
-- per-medium prompt content is editable server-side without an Edge
-- Function redeploy. Same rationale as migrations 152 + 153: zero
-- hardcoded medium content in code.
--
-- Why face-swap overrides exist at all:
--   The DB-stored `directive` + `flux_fragment` for stylized mediums
--   (anime, fairytale, storybook, pencil) emphasize the medium's signature
--   look — anime eye proportions, fairy-tale princess eyes, etc. When a
--   face-swap fires, those emphases fight the swap (cdingram pastes a
--   real human face onto an "anime eyes" character → bubble-eye uncanny).
--   The overrides front-load "realistic human face with normal sized
--   eyes" so Flux renders a swap-compatible face from the start.
--
-- Schema:
--   - face_swap_directive TEXT NULL — full directive replacement when
--     face-swap is active. NULL → fall back to the regular `directive`.
--   - face_swap_flux_fragment TEXT NULL — flux_fragment replacement when
--     face-swap is active. NULL → fall back to the regular `flux_fragment`.
--   Both columns are independent; either can be NULL while the other is
--   set (pencil only overrides the fragment, not the directive).
--
-- Caller change: `applyFaceSwapOverride(medium)` reads these columns and
-- substitutes them when set. The hardcoded record + transform-function
-- pattern is removed from the Edge Function code.
--
-- For storybook the previous override used a single string-replacement
-- transform on the regular directive. We've applied that transform once
-- here and stored the resolved text directly — eliminating the runtime
-- transform without changing rendered output.

BEGIN;

ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS face_swap_directive TEXT,
  ADD COLUMN IF NOT EXISTS face_swap_flux_fragment TEXT;

COMMENT ON COLUMN public.dream_mediums.face_swap_directive IS
  'Optional directive override applied only when face_swap is active. Front-loads "realistic human face" so cdingram swap doesn''t fight cartoon-eye proportions. NULL → use regular directive. See migration 154.';
COMMENT ON COLUMN public.dream_mediums.face_swap_flux_fragment IS
  'Optional flux_fragment override applied only when face_swap is active. Front-loads "realistic human face" so cdingram swap doesn''t fight cartoon-eye proportions. NULL → use regular flux_fragment. See migration 154.';

-- ───────────────────────────────────────────────────────────────────────
-- fairytale — directive + fragment override
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET
  face_swap_flux_fragment = 'realistic human face with normal sized eyes and natural proportions, thin subtle eyebrows, NOT cartoon eyes, NOT anime eyes, NOT Disney princess eyes, hand-drawn 2D illustration set in a fairy tale world, painted watercolor backgrounds, flowing organic linework, golden hour lighting, painterly environments, rich warm color palette, strictly 2D not 3D CGI',
  face_swap_directive = 'Create images set in a hand-drawn 2D fairy tale world. Strictly 2D, never 3D CGI. Visual qualities: lush painted watercolor backgrounds, flowing organic linework, romantic golden hour lighting, painterly atmospheric environments, rich warm color palettes. Fairy tale imagery: castles, enchanted forests, magical transformations. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size — the same size you would see in a photograph. Do NOT enlarge eyes even slightly. Do NOT use cartoon, anime, or Disney character design for faces. Thin natural eyebrows only. The WORLD is fairy tale but the FACES are realistic. Apply this style to whatever subject and framing is provided.'
WHERE key = 'fairytale';

-- ───────────────────────────────────────────────────────────────────────
-- storybook — directive transform applied once + fragment override
-- (transform = replace 'friendly simplified character design with
--  expressive faces' with 'detailed character rendering with photorealistic
--  human faces and natural proportions')
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET
  face_swap_flux_fragment = 'picture book illustration, hand-painted with visible brush or pencil texture, warm golden color palette, cozy intimate feeling, watercolor gouache techniques, printed page quality, soft hand-drawn look, realistic human face with normal sized eyes and natural proportions, NOT cartoon eyes',
  face_swap_directive = REPLACE(
    directive,
    'friendly simplified character design with expressive faces',
    'detailed character rendering with photorealistic human faces and natural proportions'
  )
WHERE key = 'storybook';

-- ───────────────────────────────────────────────────────────────────────
-- pencil — fragment-only override (directive stayed default in old code)
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET
  face_swap_flux_fragment = 'colored pencil drawing, prismacolor art, visible pencil strokes, directional hatching, paper texture showing through, layered transparent color, hand-drawn quality, grainy tooth texture, confident linework, realistic human face with natural proportions'
WHERE key = 'pencil';

-- ───────────────────────────────────────────────────────────────────────
-- anime — directive + fragment override
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.dream_mediums SET
  face_swap_flux_fragment = 'realistic human face with normal sized eyes and natural proportions, eyes open and visible, thin subtle eyebrows, NOT anime eyes, NOT manga eyes, NOT chibi, NOT exaggerated facial expressions, cel-shaded illustrated scene, Japanese illustrated environments, vibrant color palette, clean linework, painted backgrounds, atmospheric lighting, strictly 2D not 3D CGI',
  face_swap_directive = 'Create images with cel-shaded illustrated environments inspired by Japanese illustration. Strictly 2D, never 3D CGI. Visual qualities: painted environments, vibrant color palettes, clean confident linework, atmospheric lighting, cel-shaded scenery. Imagery: cherry blossoms, neon-lit streets, traditional architecture, modern cityscapes, fantasy elements. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size and OPEN, never closed, never squinting in laughter, never exaggerated. Do NOT use anime, manga, or chibi character design for faces. Thin natural eyebrows only. Faces stay realistic regardless of emotion or scene. The ENVIRONMENT is illustrated but the FACES are realistic. Apply this aesthetic to whatever subject and framing is provided.'
WHERE key = 'anime';

COMMIT;

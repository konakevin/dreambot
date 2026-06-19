-- Migration 294: curate the medium set for photo RESTYLE + route per-medium model.
--
-- Restyle (photo + medium transform) used to offer the FULL medium catalog, but
-- many mediums restyle badly: near-photoreal ones (Photography, Magazine, Octane)
-- barely transform a real photo → uncanny, and some stylized ones look better on
-- a different model. After a model bake-off (Kontext vs Nano Banana vs Flux-Dev,
-- judged from real restyles), we finalize a 13-medium restyle set with a
-- per-medium engine:
--
--   Real Face → Nano Banana (google/gemini-2-image):
--     canvas, comics, illustration, pencil, storybook, watercolor
--   Dream Art → Kontext (existing kontext_directive path):
--     animation, anime, claymation, handcrafted, pixels
--   Dream Art → Flux-Dev rebuild (existing flux_dev_prompt_template path):
--     lego, vinyl
--
-- Hidden from the restyle picker (still available for New Scene): fairytale,
-- hyperreal (Magazine), photography, pop_art, render (Octane), vaporwave.
--
-- Both flags live in the existing `client_meta` JSONB (migration 251) — NO new
-- column, so this is a pure DATA migration with no schema change and no
-- deploy-ordering hazard:
--   • client_meta.restyle_enabled (bool) → the client shows ONLY these in the
--     restyle picker (surfaced via the get_dream_mediums RPC's client_meta).
--   • client_meta.restyle_model (text)   → restyle-photo forces this model for
--     the medium (read edge-side from client_meta). Absent → existing routing
--     (Flux-Dev if a template exists, else Kontext). Only the 6 Real Face set it.

-- ── 1. Mark the 13 restyle-eligible mediums (client picker filter) ───────────
UPDATE public.dream_mediums
SET client_meta = coalesce(client_meta, '{}'::jsonb) || '{"restyle_enabled": true}'::jsonb
WHERE key IN (
  'canvas', 'comics', 'illustration', 'pencil', 'storybook', 'watercolor',
  'animation', 'anime', 'claymation', 'handcrafted', 'pixels', 'lego', 'vinyl'
);

-- Defensively clear the flag on everything else (so a previously-set value can't
-- leak a medium into the restyle picker).
UPDATE public.dream_mediums
SET client_meta = coalesce(client_meta, '{}'::jsonb) || '{"restyle_enabled": false}'::jsonb
WHERE key NOT IN (
  'canvas', 'comics', 'illustration', 'pencil', 'storybook', 'watercolor',
  'animation', 'anime', 'claymation', 'handcrafted', 'pixels', 'lego', 'vinyl'
);

-- ── 2. The 6 Real Face mediums restyle via Nano Banana ──────────────────────
UPDATE public.dream_mediums
SET client_meta = coalesce(client_meta, '{}'::jsonb) || '{"restyle_model": "google/gemini-2-image"}'::jsonb
WHERE key IN ('canvas', 'comics', 'illustration', 'pencil', 'storybook', 'watercolor');

-- Dream-art mediums keep their existing routing → no restyle_model in client_meta
-- (lego/vinyl already have flux_dev_prompt_template; the rest use kontext_directive).

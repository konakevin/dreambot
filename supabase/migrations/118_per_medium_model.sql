-- Migration 118: Per-medium preferred model
--
-- Phase 4.2 of the V4 hardening plan.
-- Adds a preferred_model column to dream_mediums so each medium can specify
-- which Replicate model to use. modelPicker.ts reads this at runtime with
-- a 1-minute in-memory cache.
--
-- Seeded with current production defaults:
--   photography → flux-dev (original Flux, best for photorealism)
--   everything else → flux-2-dev (T5 encoder, handles full-length prompts)
--   anime, pixels → NULL (SDXL routing stays in code, not DB)

ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS preferred_model text;

-- Seed: photography gets flux-dev (original), rest get flux-2-dev
UPDATE public.dream_mediums SET preferred_model = 'black-forest-labs/flux-dev'
  WHERE key = 'photography';
UPDATE public.dream_mediums SET preferred_model = 'black-forest-labs/flux-2-dev'
  WHERE preferred_model IS NULL AND key NOT IN ('anime', 'pixels');
-- anime + pixels stay NULL — SDXL routing handled in modelPicker.ts code

-- Migration 119: Per medium+vibe model routing
--
-- Upgrades model routing from single preferred_model to allowed_models pool
-- with medium+vibe override support. modelPicker.ts picks randomly from the
-- pool with equal distribution.

-- 1. Add allowed_models array to dream_mediums
ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS allowed_models text[];

-- Migrate existing preferred_model into the array
UPDATE public.dream_mediums SET allowed_models = ARRAY[preferred_model]
  WHERE preferred_model IS NOT NULL AND allowed_models IS NULL;

-- Default for anything still null (except SDXL-routed anime/pixels)
UPDATE public.dream_mediums SET allowed_models = ARRAY['black-forest-labs/flux-2-dev']
  WHERE allowed_models IS NULL AND key NOT IN ('anime', 'pixels');

-- 2. Model overrides for specific medium+vibe combos
CREATE TABLE IF NOT EXISTS public.model_overrides (
  medium_key text NOT NULL,
  vibe_key text NOT NULL,
  allowed_models text[] NOT NULL,
  PRIMARY KEY (medium_key, vibe_key)
);

-- First override: photography + coquette → flux-1 only (flux-2 bad at photorealism + coquette)
INSERT INTO public.model_overrides (medium_key, vibe_key, allowed_models)
VALUES ('photography', 'coquette', ARRAY['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'])
ON CONFLICT DO NOTHING;

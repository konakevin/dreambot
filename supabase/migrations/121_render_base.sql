-- Migration 121: Two-pass render base for mediums that need Kontext post-processing
--
-- When render_base is set (e.g., 'photography'), the pipeline:
--   1. Renders using the render_base medium's directive (photorealistic)
--   2. Face swaps onto the photorealistic result
--   3. Runs Kontext with the target medium's kontext_directive
--   4. Persists only the final Kontext output
--
-- Only fires when face swap succeeds. Pure scenes skip the Kontext pass.

ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS render_base text;

-- Watercolor: render as photography first, then Kontext watercolor pass
UPDATE public.dream_mediums SET render_base = 'photography' WHERE key = 'watercolor';

-- Update RPC
DROP FUNCTION IF EXISTS public.get_dream_mediums();
CREATE FUNCTION public.get_dream_mediums()
RETURNS TABLE (
  key text,
  label text,
  directive text,
  flux_fragment text,
  sort_order integer,
  is_scene_only boolean,
  is_character_only boolean,
  nightly_skip boolean,
  face_swaps boolean,
  character_render_mode text,
  kontext_directive text,
  render_base text
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    key, label, directive, flux_fragment, sort_order,
    is_scene_only, is_character_only, nightly_skip, face_swaps,
    character_render_mode, kontext_directive, render_base
  FROM public.dream_mediums
  WHERE is_active = true
  ORDER BY sort_order;
$$;

GRANT EXECUTE ON FUNCTION public.get_dream_mediums() TO anon, authenticated, service_role;

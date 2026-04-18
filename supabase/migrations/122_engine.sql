-- Migration 122: Per-medium engine override
--
-- Allows specific mediums to use a different image generation engine.
-- null = Flux (default behavior). 'animagine' = Animagine XL (anime-tuned SDXL).
--
-- Affects: promptCompiler (output format), modelPicker (model selection),
-- generateImage (API format). Everything else is engine-agnostic.

ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS engine text;

-- Anime uses Animagine XL
UPDATE public.dream_mediums SET engine = 'animagine' WHERE key = 'anime';

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
  render_base text,
  engine text
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    key, label, directive, flux_fragment, sort_order,
    is_scene_only, is_character_only, nightly_skip, face_swaps,
    character_render_mode, kontext_directive, render_base, engine
  FROM public.dream_mediums
  WHERE is_active = true
  ORDER BY sort_order;
$$;

GRANT EXECUTE ON FUNCTION public.get_dream_mediums() TO anon, authenticated, service_role;

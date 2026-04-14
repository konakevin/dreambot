-- Add character_render_mode to dream_mediums.
-- 'natural' = real human rendering, face swap eligible
-- 'embodied' = medium-native avatar (LEGO minifig, clay figure, pixel sprite)
ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS character_render_mode text NOT NULL DEFAULT 'natural';

-- Set embodied for all non-face-swap character mediums
UPDATE public.dream_mediums SET character_render_mode = 'embodied'
WHERE key IN (
  'lego', 'claymation', 'vinyl', 'animation', 'storybook',
  'pixels', 'vaporwave', 'handcrafted'
);

-- Scene-only mediums stay 'natural' (they never render characters anyway,
-- the scene-only flag handles that separately)

-- Update RPC to include the new column
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
  character_render_mode text
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    key, label, directive, flux_fragment, sort_order,
    is_scene_only, is_character_only, nightly_skip, face_swaps,
    character_render_mode
  FROM public.dream_mediums
  WHERE is_active = true AND is_public = true
  ORDER BY sort_order, label;
$$;

GRANT EXECUTE ON FUNCTION public.get_dream_mediums() TO anon, authenticated, service_role;

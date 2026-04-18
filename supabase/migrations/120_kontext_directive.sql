-- Migration 120: Kontext-specific directive for restyle path
--
-- Two directive columns, independently tunable:
--   directive → drives V4 compiler (Sonnet → Flux text-to-image)
--   kontext_directive → drives restyle (Kontext image-to-image)
--
-- Kontext needs transformation instructions ("do THIS to the image")
-- not abstract style descriptions. Subject-agnostic (person, landscape, pet, anything).

ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS kontext_directive text;

-- Update RPC to include kontext_directive
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
  kontext_directive text
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    key, label, directive, flux_fragment, sort_order,
    is_scene_only, is_character_only, nightly_skip, face_swaps,
    character_render_mode, kontext_directive
  FROM public.dream_mediums
  WHERE is_active = true
  ORDER BY sort_order;
$$;

GRANT EXECUTE ON FUNCTION public.get_dream_mediums() TO anon, authenticated, service_role;

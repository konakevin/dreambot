-- Medium system cleanup: single source of truth in DB, kill transform_quality.
-- Adds classification columns + face_swaps boolean, drops transform_quality.

ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS is_scene_only boolean NOT NULL DEFAULT false;
ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS is_character_only boolean NOT NULL DEFAULT false;
ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS nightly_skip boolean NOT NULL DEFAULT false;
ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS face_swaps boolean NOT NULL DEFAULT true;

-- Populate face_swaps: false for all stylized mediums that can't composite a real face
UPDATE public.dream_mediums SET face_swaps = false WHERE key IN (
  'lego', 'pixel_art', 'stained_glass', 'embroidery', 'funko_pop',
  'minecraft', 'sack_boy', 'ghibli', 'tim_burton', 'plushie',
  'disney', '3d_cartoon', '3d_render', 'claymation', 'felt',
  'childrens_book', 'paper_cutout'
);

-- Populate scene-only flag (mediums that never render with cast)
UPDATE public.dream_mediums SET is_scene_only = true WHERE key IN (
  'oil_painting', 'embroidery', 'watercolor', 'vaporwave',
  'retro_poster', 'pop_art', '8bit', 'pixel_art', 'fantasy'
);

-- Populate character-only flag (always use character path)
UPDATE public.dream_mediums SET is_character_only = true WHERE key IN (
  'claymation', 'lego', 'funko_pop', 'disney', 'sack_boy'
);

-- Populate nightly skip flag (re-rolled if selected for nightly dreams)
UPDATE public.dream_mediums SET nightly_skip = true WHERE key IN (
  'watercolor', 'neon', 'pencil_sketch'
);

-- Drop transform_quality entirely
ALTER TABLE public.dream_mediums DROP COLUMN IF EXISTS transform_quality;

-- Update get_dream_mediums RPC to return new columns
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
  face_swaps boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    key, label, directive, flux_fragment, sort_order,
    is_scene_only, is_character_only, nightly_skip, face_swaps
  FROM public.dream_mediums
  WHERE is_active = true
  ORDER BY sort_order, label;
$$;

GRANT EXECUTE ON FUNCTION public.get_dream_mediums() TO anon, authenticated, service_role;

-- Drop legacy medium flags: is_scene_only and nightly_skip.
--
-- Both date back to when certain mediums (watercolor nightly_skip, scene-only
-- mediums) couldn't be tuned to render people well. With the FACE_SWAP_FLUX_OVERRIDES
-- pattern + 7-layer dual character system, every medium now renders cleanly with or
-- without cast — these flags are dead weight and produced confusing flag combinations
-- (face_swaps + is_scene_only on the same row).

DROP FUNCTION IF EXISTS get_dream_mediums();

ALTER TABLE public.dream_mediums
  DROP COLUMN IF EXISTS is_scene_only,
  DROP COLUMN IF EXISTS nightly_skip;

CREATE OR REPLACE FUNCTION get_dream_mediums()
RETURNS TABLE(
  key text,
  label text,
  description text,
  directive text,
  flux_fragment text,
  is_character_only boolean,
  face_swaps boolean,
  character_render_mode text,
  sort_order integer
) LANGUAGE sql STABLE AS $$
  SELECT key, label, description, directive, flux_fragment,
         is_character_only, face_swaps,
         character_render_mode, sort_order
  FROM public.dream_mediums
  WHERE is_active = true
  ORDER BY sort_order;
$$;

GRANT EXECUTE ON FUNCTION get_dream_mediums() TO anon, authenticated;

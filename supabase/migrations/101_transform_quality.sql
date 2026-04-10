-- Add transform_quality to dream_mediums
-- 'good' = stylized mediums where face transforms look great (anime, lego, disney, etc.)
-- 'poor' = realistic mediums where transforms produce uncanny/wrong results
ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS transform_quality text NOT NULL DEFAULT 'good';

-- Set poor-quality mediums (too realistic for face transforms)
UPDATE public.dream_mediums SET transform_quality = 'poor' WHERE key IN (
  'photorealistic', 'fantasy', 'oil_painting', 'watercolor',
  'pencil_sketch', 'surreal', 'neon', '3d_render', 'cyberpunk', 'steampunk'
);

-- Uncertain mediums — default to 'poor' to be safe, promote after testing
UPDATE public.dream_mediums SET transform_quality = 'poor' WHERE key IN (
  'retro_poster', 'art_deco', 'vaporwave', 'ukiyo_e'
);

-- Update the RPC to include transform_quality (must DROP first — return type changed)
DROP FUNCTION IF EXISTS get_dream_mediums();
CREATE OR REPLACE FUNCTION get_dream_mediums()
RETURNS TABLE (
  key text,
  label text,
  directive text,
  flux_fragment text,
  transform_quality text
) AS $$
  SELECT key, label, directive, flux_fragment, transform_quality
  FROM public.dream_mediums
  WHERE is_active = true
  ORDER BY sort_order;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

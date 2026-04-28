-- Add short user-facing descriptions to mediums and vibes for onboarding picker

ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.dream_vibes ADD COLUMN IF NOT EXISTS description text;

-- Medium descriptions
UPDATE public.dream_mediums SET description = 'Pro photo quality' WHERE key = 'photography';
UPDATE public.dream_mediums SET description = 'Retro pixel art' WHERE key = 'pixels';
UPDATE public.dream_mediums SET description = 'Painted watercolor washes' WHERE key = 'watercolor';
UPDATE public.dream_mediums SET description = 'Polished CGI render' WHERE key = 'render';
UPDATE public.dream_mediums SET description = 'Classic oil painting' WHERE key = 'canvas';
UPDATE public.dream_mediums SET description = 'Anime & manga style' WHERE key = 'anime';
UPDATE public.dream_mediums SET description = 'Built from LEGO bricks' WHERE key = 'lego';
UPDATE public.dream_mediums SET description = '3D animated movie' WHERE key = 'animation';
UPDATE public.dream_mediums SET description = 'Comic book panels' WHERE key = 'comics';
UPDATE public.dream_mediums SET description = 'Clay & stop-motion' WHERE key = 'claymation';
UPDATE public.dream_mediums SET description = 'Vinyl toy collectible' WHERE key = 'vinyl';
UPDATE public.dream_mediums SET description = 'Children''s book art' WHERE key = 'storybook';
UPDATE public.dream_mediums SET description = 'Retro digital nostalgia' WHERE key = 'vaporwave';
UPDATE public.dream_mediums SET description = 'Classic 2D animation' WHERE key = 'fairytale';
UPDATE public.dream_mediums SET description = 'Stitched & sewn crafts' WHERE key = 'handcrafted';
UPDATE public.dream_mediums SET description = 'Colored pencil drawing' WHERE key = 'pencil';
UPDATE public.dream_mediums SET description = 'Bold hand-drawn art' WHERE key = 'illustration';

-- Vibe descriptions
UPDATE public.dream_vibes SET description = 'Blockbuster movie feel' WHERE key = 'cinematic';
UPDATE public.dream_vibes SET description = 'Shadow-drenched mood' WHERE key = 'dark';
UPDATE public.dream_vibes SET description = 'Warm & intimate' WHERE key = 'cozy';
UPDATE public.dream_vibes SET description = 'Clean & spacious' WHERE key = 'minimal';
UPDATE public.dream_vibes SET description = 'Grand & monumental' WHERE key = 'epic';
UPDATE public.dream_vibes SET description = 'Golden-hour memories' WHERE key = 'nostalgic';
UPDATE public.dream_vibes SET description = 'Melting color fractals' WHERE key = 'psychedelic';
UPDATE public.dream_vibes SET description = 'Still & serene' WHERE key = 'peaceful';
UPDATE public.dream_vibes SET description = 'Playful & charming' WHERE key = 'whimsical';
UPDATE public.dream_vibes SET description = 'Soft glowing light' WHERE key = 'ethereal';
UPDATE public.dream_vibes SET description = 'Ancient magical power' WHERE key = 'arcane';
UPDATE public.dream_vibes SET description = 'Weathered ruins & relics' WHERE key = 'ancient';
UPDATE public.dream_vibes SET description = 'Fairy-tale wonder' WHERE key = 'enchanted';
UPDATE public.dream_vibes SET description = 'Bold & powerful' WHERE key = 'fierce';
UPDATE public.dream_vibes SET description = 'Soft feminine glamour' WHERE key = 'coquette';
UPDATE public.dream_vibes SET description = 'Neon-lit night energy' WHERE key = 'voltage';
UPDATE public.dream_vibes SET description = 'Gothic dark fantasy' WHERE key = 'nightshade';
UPDATE public.dream_vibes SET description = 'Tim Burton whimsy' WHERE key = 'macabre';
UPDATE public.dream_vibes SET description = 'Sparkling beauty filter' WHERE key = 'shimmer';
UPDATE public.dream_vibes SET description = 'Dreamlike & impossible' WHERE key = 'surreal';

-- Update RPCs to include description
DROP FUNCTION IF EXISTS get_dream_mediums();
CREATE OR REPLACE FUNCTION get_dream_mediums()
RETURNS TABLE(
  key text,
  label text,
  description text,
  directive text,
  flux_fragment text,
  is_scene_only boolean,
  is_character_only boolean,
  nightly_skip boolean,
  face_swaps boolean,
  character_render_mode text,
  sort_order integer
) LANGUAGE sql STABLE AS $$
  SELECT key, label, description, directive, flux_fragment,
         is_scene_only, is_character_only, nightly_skip, face_swaps,
         character_render_mode, sort_order
  FROM public.dream_mediums
  WHERE is_active = true
  ORDER BY sort_order;
$$;

DROP FUNCTION IF EXISTS get_dream_vibes();
CREATE OR REPLACE FUNCTION get_dream_vibes()
RETURNS TABLE(
  key text,
  label text,
  description text,
  directive text,
  sort_order integer
) LANGUAGE sql STABLE AS $$
  SELECT key, label, description, directive, sort_order
  FROM public.dream_vibes
  WHERE is_active = true
  ORDER BY sort_order;
$$;

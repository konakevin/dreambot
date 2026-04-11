-- Migration 106: Rename medium keys to match display labels
-- 12 active mediums currently have DB keys that don't match their labels.
-- This migration renames them in-place and rewrites all referencing data.

BEGIN;

-- Phase 1: Delete the legacy inactive `claymation` row to free the key for the rename.
-- Historical uploads with dream_medium='claymation' will be merged into the new Claymation
-- (formerly sack_boy) since both are clay aesthetics.
DELETE FROM public.dream_mediums WHERE key = 'claymation' AND is_active = false;

-- Phase 2: Rename the 12 active medium keys.
UPDATE public.dream_mediums SET key = 'neon'        WHERE key = 'cyberpunk';
UPDATE public.dream_mediums SET key = 'gothic'      WHERE key = 'tim_burton';
UPDATE public.dream_mediums SET key = 'coquette'    WHERE key = 'surreal';
UPDATE public.dream_mediums SET key = 'animation'   WHERE key = '3d_cartoon';
UPDATE public.dream_mediums SET key = 'photography' WHERE key = 'photorealistic';
UPDATE public.dream_mediums SET key = 'vinyl'       WHERE key = 'funko_pop';
UPDATE public.dream_mediums SET key = 'storybook'   WHERE key = 'childrens_book';
UPDATE public.dream_mediums SET key = 'claymation'  WHERE key = 'sack_boy';
UPDATE public.dream_mediums SET key = 'handcrafted' WHERE key = 'sackboy';
UPDATE public.dream_mediums SET key = 'canvas'      WHERE key = 'oil_painting';
UPDATE public.dream_mediums SET key = 'pixels'      WHERE key = 'pixel_art';
UPDATE public.dream_mediums SET key = 'comics'      WHERE key = 'comic_book';

-- Phase 3: Rewrite uploads.dream_medium for every rename.
-- Any inactive/legacy mediums (fantasy, ghibli, steampunk, etc.) are left untouched
-- so their historical posts still resolve to their legacy rows.
UPDATE public.uploads SET dream_medium = 'neon'        WHERE dream_medium = 'cyberpunk';
UPDATE public.uploads SET dream_medium = 'gothic'      WHERE dream_medium = 'tim_burton';
UPDATE public.uploads SET dream_medium = 'coquette'    WHERE dream_medium = 'surreal';
UPDATE public.uploads SET dream_medium = 'animation'   WHERE dream_medium = '3d_cartoon';
UPDATE public.uploads SET dream_medium = 'photography' WHERE dream_medium = 'photorealistic';
UPDATE public.uploads SET dream_medium = 'vinyl'       WHERE dream_medium = 'funko_pop';
UPDATE public.uploads SET dream_medium = 'storybook'   WHERE dream_medium = 'childrens_book';
UPDATE public.uploads SET dream_medium = 'claymation'  WHERE dream_medium = 'sack_boy';
UPDATE public.uploads SET dream_medium = 'handcrafted' WHERE dream_medium = 'sackboy';
UPDATE public.uploads SET dream_medium = 'canvas'      WHERE dream_medium = 'oil_painting';
UPDATE public.uploads SET dream_medium = 'pixels'      WHERE dream_medium = 'pixel_art';
UPDATE public.uploads SET dream_medium = 'comics'      WHERE dream_medium = 'comic_book';

-- Phase 4: Rewrite user_recipes.recipe.art_styles JSONB arrays.
-- Each user's saved profile may contain old keys; we rebuild the array with new keys.
UPDATE public.user_recipes ur
SET recipe = jsonb_set(
  ur.recipe,
  '{art_styles}',
  (
    SELECT jsonb_agg(
      CASE style::text
        WHEN '"cyberpunk"'      THEN '"neon"'::jsonb
        WHEN '"tim_burton"'     THEN '"gothic"'::jsonb
        WHEN '"surreal"'        THEN '"coquette"'::jsonb
        WHEN '"3d_cartoon"'     THEN '"animation"'::jsonb
        WHEN '"photorealistic"' THEN '"photography"'::jsonb
        WHEN '"funko_pop"'      THEN '"vinyl"'::jsonb
        WHEN '"childrens_book"' THEN '"storybook"'::jsonb
        WHEN '"sack_boy"'       THEN '"claymation"'::jsonb
        WHEN '"sackboy"'        THEN '"handcrafted"'::jsonb
        WHEN '"oil_painting"'   THEN '"canvas"'::jsonb
        WHEN '"pixel_art"'      THEN '"pixels"'::jsonb
        WHEN '"comic_book"'     THEN '"comics"'::jsonb
        ELSE style
      END
    )
    FROM jsonb_array_elements(ur.recipe->'art_styles') style
  )
)
WHERE ur.recipe ? 'art_styles'
  AND ur.recipe->'art_styles' ?| ARRAY[
    'cyberpunk','tim_burton','surreal','3d_cartoon','photorealistic',
    'funko_pop','childrens_book','sack_boy','sackboy','oil_painting',
    'pixel_art','comic_book'
  ];

COMMIT;

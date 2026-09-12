-- 499_nightly_look_family.sql — the FAMILY axis for the two-stage nightly look roll (Kevin 2026-09-12: "let the
-- families roll and then a 2nd roll for the entry within the family"). Every approved look stays in the pool
-- (no compaction for nightly); the resolver (_shared/nightlyLooks.ts) picks a family with equal shares among the
-- families that have >= 1 approved look for the render's (model, surface), then a look inside it by weight, then
-- applies per-user recency over look keys — so the biggest cluster (16 painted-realism rows) cannot skew a week.
ALTER TABLE public.dream_mediums ADD COLUMN IF NOT EXISTS nightly_family text;
ALTER TABLE public.dream_mediums DROP CONSTRAINT IF EXISTS dream_mediums_nightly_family_valid;
ALTER TABLE public.dream_mediums ADD CONSTRAINT dream_mediums_nightly_family_valid
  CHECK (nightly_family IS NULL OR nightly_family IN ('photographic','painted_realism','covers_posters','comic_print','watercolor'));
UPDATE public.dream_mediums SET nightly_family = 'photographic' WHERE key IN ('nightly_vintage_film', 'nightly_film_noir', 'nightly_cinematic_still', 'nightly_kodachrome', 'nightly_technicolor', 'nightly_hand_tinted_photo');
UPDATE public.dream_mediums SET nightly_family = 'painted_realism' WHERE key IN ('nightly_classical_oil', 'nightly_baroque_oil', 'nightly_salon_realism', 'nightly_jewel_realism', 'nightly_alla_prima', 'nightly_painted_fantasy', 'nightly_digital_painting', 'nightly_matte_painting', 'nightly_fresco', 'nightly_encaustic', 'nightly_painted_animation', 'nightly_soft_brush_illustration', 'nightly_gouache_portrait', 'nightly_pastel_chalk', 'nightly_pastel_portrait', 'nightly_oil_pastel');
UPDATE public.dream_mediums SET nightly_family = 'covers_posters' WHERE key IN ('nightly_magazine_cover', 'nightly_movie_poster', 'nightly_scifi_paperback', 'nightly_pulp_cover', 'nightly_airbrush_poster', 'nightly_painted_comic_cover');
UPDATE public.dream_mediums SET nightly_family = 'comic_print' WHERE key IN ('nightly_ink_illustration', 'nightly_storybook_gouache', 'nightly_soft_comic', 'nightly_rotoscope', 'nightly_marker', 'nightly_ink_wash_comic', 'nightly_soft_pop_art', 'nightly_painted_graphic_novel', 'nightly_chromolithograph', 'nightly_big_head');
UPDATE public.dream_mediums SET nightly_family = 'watercolor' WHERE key IN ('nightly_watercolor_ink', 'nightly_lineless_watercolor', 'nightly_watercolor_portrait', 'nightly_digital_watercolor', 'nightly_aquarelle_graphite');
-- The halloween_* day-of looks keep their own pin route (holidays.day_of_look_keys); no family needed.
DO $$
DECLARE missing int;
BEGIN
  SELECT count(*) INTO missing FROM public.dream_mediums WHERE nightly_look AND key LIKE 'nightly\_%' AND nightly_family IS NULL;
  IF missing > 0 THEN RAISE EXCEPTION 'nightly_* looks without a family: %', missing; END IF;
END $$;

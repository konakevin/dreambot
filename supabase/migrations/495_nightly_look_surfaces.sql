-- 495_nightly_look_surfaces.sql — the per-surface LOOK architecture (NIGHTLY_LOOKS_REFACTOR_PLAN.md §2b/§3), applied
-- to the round-1 verdicts (NIGHTLY_LOOK_TALLY.md, Kevin 2026-09-11: "make an architecture that will support a look
-- for either a couple or a single, or both").
--
--   nightly_look      boolean  — this row is a nightly catalog look (never an app medium). CHECK: a look can never be
--                                public / dream-eligible / scene-eligible, so a dashboard edit cannot leak it into
--                                Create, and an app medium cannot become a look by accident.
--   nightly_surfaces  text[]   — which cast surfaces the look is APPROVED for: any of {couple, solo}. Scene-only
--                                renders (no cast) may use ANY active look (no swap constraint). A look with an
--                                empty set is parked: it stays a row for re-testing but nothing rolls it.
--   weight            numeric  — roll weight (1 = equal); Kevin's hearts tune it later.
--
-- Round-1 verdicts → surfaces:
--   both (8):   classical_oil, baroque_oil, salon_realism, digital_painting, painted_fantasy, hand_tinted_photo,
--               chromolithograph, technicolor
--   solo only (12): ink_illustration, storybook_gouache, vintage_film, jewel_realism, magazine_cover, movie_poster,
--               scifi_paperback, matte_painting, pulp_cover, fresco, oil_pastel, encaustic
--   couple only (1): kodachrome (solo tripped the older-stranger defect once)
--   parked (5): watercolor_ink, film_noir, pastel_chalk, alla_prima, cinematic_still (failed both; is_active=false)
--   halloween_* pilot rows: nightly_look=true, surfaces {couple, solo} (they render both on the day-of path).
ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS nightly_look boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nightly_surfaces text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS weight numeric NOT NULL DEFAULT 1;

ALTER TABLE public.dream_mediums DROP CONSTRAINT IF EXISTS dream_mediums_nightly_look_isolated;
ALTER TABLE public.dream_mediums ADD CONSTRAINT dream_mediums_nightly_look_isolated
  CHECK (NOT nightly_look OR (is_public = false AND is_dream_eligible = false AND is_scene_eligible = false));

ALTER TABLE public.dream_mediums DROP CONSTRAINT IF EXISTS dream_mediums_nightly_surfaces_valid;
ALTER TABLE public.dream_mediums ADD CONSTRAINT dream_mediums_nightly_surfaces_valid
  CHECK (nightly_surfaces <@ ARRAY['couple','solo']::text[]);

UPDATE public.dream_mediums SET nightly_look = true, is_active = true, nightly_surfaces = ARRAY['couple','solo']::text[]
 WHERE key IN ('nightly_classical_oil','nightly_baroque_oil','nightly_salon_realism','nightly_digital_painting',
               'nightly_painted_fantasy','nightly_hand_tinted_photo','nightly_chromolithograph','nightly_technicolor');
UPDATE public.dream_mediums SET nightly_look = true, is_active = true, nightly_surfaces = ARRAY['solo']::text[]
 WHERE key IN ('nightly_ink_illustration','nightly_storybook_gouache','nightly_vintage_film','nightly_jewel_realism',
               'nightly_magazine_cover','nightly_movie_poster','nightly_scifi_paperback','nightly_matte_painting',
               'nightly_pulp_cover','nightly_fresco','nightly_oil_pastel','nightly_encaustic');
UPDATE public.dream_mediums SET nightly_look = true, is_active = true, nightly_surfaces = ARRAY['couple']::text[]
 WHERE key = 'nightly_kodachrome';
UPDATE public.dream_mediums SET nightly_look = true, is_active = false, nightly_surfaces = '{}'::text[]
 WHERE key IN ('nightly_watercolor_ink','nightly_film_noir','nightly_pastel_chalk','nightly_alla_prima','nightly_cinematic_still');
UPDATE public.dream_mediums SET nightly_look = true, nightly_surfaces = ARRAY['couple','solo']::text[]
 WHERE key LIKE 'halloween\_%' AND client_meta ? 'day_of_look';

-- The client reads dream_mediums through column grants? No — dream_mediums is read via get_dream_mediums (public-only
-- filter), so the new columns need no grant. Sanity: the constraint must hold for every existing row.
DO $$
DECLARE bad int;
BEGIN
  SELECT count(*) INTO bad FROM public.dream_mediums WHERE nightly_look AND (is_public OR is_dream_eligible OR is_scene_eligible);
  IF bad > 0 THEN RAISE EXCEPTION 'nightly_look rows leak into the app pool: %', bad; END IF;
END $$;

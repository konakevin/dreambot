-- 565_nightly_solo_outfit_early.sql — nightly SOLO prompts name the outfit right after the medium, 2026-09-27.
-- CREATE_OUTFIT_PLAN.md phase 8.
--
-- Kevin graded 22 real renders: nightly couples wore their rolled look 4/4, nightly solos only about half.
-- The solo assembly names the wardrobe at the END of the CHARACTER block (~char 1,100-1,400 of ~2,500), after
-- the medium, the "set at" scene, the framing and the pose, where flux-1.1-pro no longer reads it. Same-seed
-- probe on the 4 solos that missed (3 seeds each): shipped order 0/12 outfits rendered; the same words with the
-- wardrobe right after the medium 12/12. Couples already name each wardrobe right after the person.
--
--   nightly_solo_outfit_early  single-cast slot prompts put "wearing <wardrobe>" right after the medium
--                              fragment (QA: force_solo_outfit_early). false = the old order, byte-identical.
--
-- ROLLBACK (instant, no deploy): UPDATE public.engine_config SET nightly_solo_outfit_early = false WHERE id = 1;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_solo_outfit_early boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.engine_config.nightly_solo_outfit_early IS
  'Nightly: single-cast prompts name the wardrobe right after the medium fragment (0/12 → 12/12 outfits in the same-seed probe). false = old order.';

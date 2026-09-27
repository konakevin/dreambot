-- 564_outfit_phase8_live.sql — outfits phase 8 LIVE for everyone, 2026-09-27. CREATE_OUTFIT_PLAN.md phase 8.
--
-- Kevin, after grading 22 real renders on his account: "commit and push i guess, turn it all live".
--   create_outfit_costume_read  costumes / style / armor read from the prompt (Create).
--   create_outfit_garment_roll  garment family + fashion look for anyone nobody dressed, V2 cuts, outfit
--                               before the scene on solo, rolled wide-legs slimmed (Create).
--   nightly_garment_roll        the same families + looks on nightly's wardrobe slot. Kevin's word on the
--                               restore-point engine. Known limit: nightly SOLO prompts place the wardrobe
--                               mid-prompt and land the look about half the time; couples land it 4/4.
--
-- Measured before the flip (preview on Kevin's account): women's wide-leg 25% → 4% (Create text) and 0/11
-- rolled (nightly text); outfit reader 100% on every check; 22/22 renders graded with no wide-leg, Create
-- 10/10 outfits shown, couples 8/8 dual swap first try.
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET create_outfit_costume_read = false, create_outfit_garment_roll = false,
--          nightly_garment_roll = false WHERE id = 1;

UPDATE public.engine_config
   SET create_outfit_costume_read = true,
       create_outfit_garment_roll = true,
       nightly_garment_roll = true
 WHERE id = 1;

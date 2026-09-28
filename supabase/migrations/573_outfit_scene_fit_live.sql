-- 573_outfit_scene_fit_live.sql — outfits that fit the place, LIVE on Create and nightly, 2026-09-28.
-- CREATE_OUTFIT_PLAN.md phase 9 (mig 572 added both switches, off).
--
-- Kevin, after grading the render sheets: "it all looks good, commit and push", then "yes, turn both on". Nightly
-- is the restore-point engine; this is his word for it.
--
-- Measured before the flip:
--   Create text harness: out-of-place outfits 15/51 -> 1/51, trims/cuffs 43% -> 18%, plain-clothes retries 2 -> 0.
--   Nightly dry runs: out-of-place 7/51 -> 0/51; leather jackets 8% -> 3.5% (city only).
--   Renders on Kevin's account: couple swap first-try hold equal on the beach round (8/11 both, 0 vs 2 solo
--   fallbacks); themed places dress on theme (western at a saloon, deco at a speakeasy, 1950s pin-up / greaser).
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET create_outfit_scene_fit = false, nightly_outfit_scene_fit = false WHERE id = 1;

UPDATE public.engine_config
   SET create_outfit_scene_fit = true,
       nightly_outfit_scene_fit = true
 WHERE id = 1;

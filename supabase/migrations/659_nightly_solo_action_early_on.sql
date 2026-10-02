-- 659_nightly_solo_action_early_on.sql — the solo action-early switch (mig 656) goes LIVE, 2026-10-02 (Kevin: "yes").
--
-- Every nightly solo now names its action right after the "set at" place line. Proof, same-seed flux-1.1-pro probe on
-- the fall / Halloween nightlies Kevin flagged (two rounds): scene-object actions 0/12 -> 12/12; on 8 other production
-- solos the actions landed more often with faces and outfits unchanged. Render test on Kevin's account through the
-- real nightly-dreams (12 corridor-prone sub-themes x 2, his +1 as the solo): 24/24 rendered and swapped, the
-- "person centred on a receding route" shot 16/24 -> 5/24 with the seed repair (657), poses varied (leaning on a
-- boulder, scooping leaves, seated on a porch swing).
--
-- ROLLBACK (instant, no deploy): UPDATE public.engine_config SET nightly_solo_action_early = false WHERE id = 1;

UPDATE public.engine_config SET nightly_solo_action_early = true WHERE id = 1;

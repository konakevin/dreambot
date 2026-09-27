-- 566_nightly_solo_outfit_early_live.sql — nightly solo outfit-early LIVE, 2026-09-27 (Kevin: "if you get it
-- working, please flip the switch live on your fix so that tonight's nightly's pick it up").
--
-- Verified before the flip: 8 real nightly solos on Kevin's account with force_solo_outfit_early = 8/8 rendered
-- exactly the wardrobe in the prompt (the earlier batch without it: about 2 of 6), the wardrobe now at char
-- ~390-470 instead of ~1,100-1,400; every solo swap passed (identity 0.51-0.74, mean 0.64 vs 0.67 before).
-- Trade-off: framing now honours the knees-up line more often, so some shots are wider.
--
-- ROLLBACK (instant, no deploy): UPDATE public.engine_config SET nightly_solo_outfit_early = false WHERE id = 1;

UPDATE public.engine_config SET nightly_solo_outfit_early = true WHERE id = 1;

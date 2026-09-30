-- 586_nightly_outfit_plan_on.sql — NIGHTLY_OUTFIT_VARIETY_PLAN.md step 4: the outfit plan ON for nightly (Kevin's go,
-- 2026-09-30: "yes go ahead with that plan").
--
-- Evidence: dry-run probe 16/16 different outfits, rolled colour named 16/16, nautical 0/16, misfits 0/16 (was ~3
-- outfits per place); renders with the plan forced on: 7/7 couples first-try clean (plain places 8/8 overall).
-- Holiday rows and authored-attire scenes keep their own outfits by design.
--
-- ROLLBACK (instant, no deploy): UPDATE public.engine_config SET nightly_outfit_plan = false WHERE id = 1;

UPDATE public.engine_config SET nightly_outfit_plan = true WHERE id = 1;

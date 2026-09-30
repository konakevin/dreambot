-- 596_nightly_couple_hair_anchor_on.sql — AGE_FIDELITY_PLAN.md: switch the couple hair anchor on for every nightly.
--
-- Real renders (Kevin's account, private album): 20 couples with the anchor vs 10 without, same engine and hour.
-- Face swap first try 17/19 vs 10/10 (normal range; one more miss was Fly capacity). Kevin (43): hair half-grey or more
-- 70% → 55%, none or a little grey 30% → 45%, median age 45 → 42.
--
-- Rollback: UPDATE public.engine_config SET nightly_couple_hair_anchor = false WHERE id = 1; (no deploy)

UPDATE public.engine_config SET nightly_couple_hair_anchor = true WHERE id = 1;

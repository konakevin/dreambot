-- 590_nightly_age_fidelity_on.sql — AGE_FIDELITY_PLAN.md: switch the senior age wording on for every nightly.
--
-- Real pipeline (michele's cast, persist:false, nothing posted, test traces removed): her 78-year-old +1's solos went
-- from 28-33 years too young to 8 (Kevin's tolerance: ~10 either way); face-swap identity unchanged. Same-seed screen:
-- solo 55+ −43 → −10, couple 55+ −18 → −9. Only cast 55+ are touched.
--
-- Rollback: UPDATE public.engine_config SET nightly_age_fidelity = false WHERE id = 1; (no deploy)

UPDATE public.engine_config SET nightly_age_fidelity = true WHERE id = 1;

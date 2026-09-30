-- 589_nightly_age_fidelity.sql — AGE_FIDELITY_PLAN.md (Kevin 2026-09-30): michele's 78-year-old +1 rendered ~33 in a
-- nightly solo. The solo opener never stated age (it sat at word ~210 of ~400) and the 2026-09-02 senior echo lived
-- only in the old dual gender lock; the live couple composer (coupleComposerX) never had it either. Production audit:
-- every cast member 55+ rendered 10+ years too young 90% of the time.
--
--   nightly_age_fidelity   a 55+ cast member's real age, hair and clean-shaven lead the solo opener and the couple
--                          description ("an older white-haired White man in his late seventies"). Under 55: unchanged.
--
-- Rollback: UPDATE public.engine_config SET nightly_age_fidelity = false WHERE id = 1; (no deploy)

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_age_fidelity boolean NOT NULL DEFAULT false;

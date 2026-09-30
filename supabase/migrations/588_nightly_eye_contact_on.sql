-- 588_nightly_eye_contact_on.sql — NIGHTLY_EYE_CONTACT_PLAN.md: switch the eye-contact wording on for every nightly.
--
-- Kevin 2026-09-30: fix the "weird gaze" and the side turning, keep poses natural ("no frozen in place looks").
-- Same-seed screen (23 real 5.5 couples): eyes on camera 72% → 91%, heads turned 19% → 2%, no scenery cost against a
-- same-length control. Full renders with the switch forced: face swap clean first try on every couple and solo.
--
-- Rollback: UPDATE public.engine_config SET nightly_eye_contact = false WHERE id = 1; (no deploy)

UPDATE public.engine_config SET nightly_eye_contact = true WHERE id = 1;

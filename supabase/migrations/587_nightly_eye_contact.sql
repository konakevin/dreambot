-- 587_nightly_eye_contact.sql — NIGHTLY_EYE_CONTACT_PLAN.md (Kevin 2026-09-30): "our faces and eyes are looking randomly
-- off camera" and "weird side angle renders". Same-seed flux-1.1-pro screen on 23 real 5.5 couples: "looking into the
-- camera" on each person's own description took eyes on camera 72% → 85% and turned heads 19% → 2%; the same words in
-- the closing faces line did nothing.
--
--   nightly_eye_contact   the gaze rides each person's description (couples + solos). false = today's prompts exactly.
--                         Switched on only after the face-swap render check.
--
-- Rollback: UPDATE public.engine_config SET nightly_eye_contact = false WHERE id = 1; (no deploy)

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_eye_contact boolean NOT NULL DEFAULT false;

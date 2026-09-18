-- 525_nightly_max_face_hfrac.sql — 2026-09-17 (late). Kevin: "i am so beyond sick of these closeup framings".
-- COMPOSITION GATE for nightly cast dreams: the tallest detected face may be at most this fraction of frame height,
-- for solos and couples alike (one ruler: the Fly detector). A bigger face re-renders down the fallback chain; if
-- every attempt is too big the smallest one ships, stamped (face_gate:* / solo_face_gate:*), never a faceless scene.
-- 0.35 catches the detached-heads couples (43-67%) and the close-up couples (37%) of 2026-09-17; 1.0 = off.
-- Live-tunable, no deploy. Nightly only — Create and onboarding never pass it.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_max_face_hfrac numeric NOT NULL DEFAULT 0.35;
ALTER TABLE public.engine_config DROP CONSTRAINT IF EXISTS engine_config_nightly_max_face_hfrac_range;
ALTER TABLE public.engine_config
  ADD CONSTRAINT engine_config_nightly_max_face_hfrac_range
  CHECK (nightly_max_face_hfrac >= 0.20 AND nightly_max_face_hfrac <= 1.0);
COMMENT ON COLUMN public.engine_config.nightly_max_face_hfrac IS
  'Nightly composition gate: max tallest-face fraction of frame height for solos and couples; bigger re-renders down the chain, smallest ships at exhaustion. 1.0 = off. 2026-09-17.';

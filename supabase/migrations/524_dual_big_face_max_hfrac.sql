-- 524_dual_big_face_max_hfrac.sql — 2026-09-17. BIG_FACE_RECLAIM_PLAN.md. The dual swap re-rendered every couple
-- whose taller face exceeded 0.40 of frame height (the 2026-09-02 "pixelated smear" guard). Phase 0 showed the smear
-- was the per-face path's crop/paste crossing into the neighbouring face, not resolution: with a full-frame swap,
-- the neighbour painted out and neighbour-bounded pastes, 9 of 11 such couples swapped at normal identity, and faces
-- above ~0.60 get "no face found" from every swap model. This ceiling is passed to the Fly engine per request:
-- faces in (0.40, ceiling] swap on the full-frame per-face path; above it stays giant_face (re-render).
-- 0.40 = today's behaviour (ships dark); 0.60 = the measured ceiling. Live-tunable, no deploy; the engine clamps 0.40-0.80.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dual_big_face_max_hfrac numeric NOT NULL DEFAULT 0.40;
ALTER TABLE public.engine_config DROP CONSTRAINT IF EXISTS engine_config_dual_big_face_max_hfrac_range;
ALTER TABLE public.engine_config
  ADD CONSTRAINT engine_config_dual_big_face_max_hfrac_range
  CHECK (dual_big_face_max_hfrac >= 0.40 AND dual_big_face_max_hfrac <= 0.80);
COMMENT ON COLUMN public.engine_config.dual_big_face_max_hfrac IS
  'Dual swap big-face tier ceiling (fraction of frame height): faces in (0.40, ceiling] swap on the Fly engine''s full-frame per-face path instead of re-rendering; 0.40 = off. BIG_FACE_RECLAIM_PLAN.md, 2026-09-17.';

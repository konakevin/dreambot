-- Couple framing variance (Kevin 2026-09-06: "every couples render now looks very homogeneous … before some were
-- randomly a bit closer"). % of couple renders framed as the closer waist-up two-shot (faces larger, swap-friendly)
-- instead of the knees-up three-quarter default. Body-language variety itself comes from _shared/dualStances.ts
-- (rolled per render, no knob). 0 = off (default).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dual_closer_pct integer NOT NULL DEFAULT 0;

-- 535_holiday_stack_cap.sql — 2026-09-19. Kevin: "bump it to 30% and then 25/25 for 50 when stacked" (Fall alone =
-- 30% of cast nightlies in Sept and Nov 1-26; October, with Halloween also active, = 50% total split evenly).
-- The season roll SUMS the active rows' pcts (combineHolidayPct) and picks one weighted by pct, so a single flat
-- value per row cannot be 30 alone and 25 stacked. This adds a stack CAP: the summed pct is clamped to
-- engine_config.holiday_stack_cap_pct (default 100 = today's behaviour); the weighted pick inside the cut keeps the
-- rows' ratio. Fall 30 + Halloween 30 = 60 → capped 50 → 25 / 25. Live-tunable, no deploy.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS holiday_stack_cap_pct integer NOT NULL DEFAULT 100;
ALTER TABLE public.engine_config DROP CONSTRAINT IF EXISTS engine_config_holiday_stack_cap_pct_chk;
ALTER TABLE public.engine_config
  ADD CONSTRAINT engine_config_holiday_stack_cap_pct_chk
  CHECK (holiday_stack_cap_pct BETWEEN 0 AND 100);
COMMENT ON COLUMN public.engine_config.holiday_stack_cap_pct IS
  'Cap on the SUMMED holiday roll pct when several seasons are active (combineHolidayPct). 100 = no cap. Kevin 2026-09-19: 50 (Fall 30 + Halloween 30 → 25/25).';
UPDATE public.engine_config SET holiday_stack_cap_pct = 50 WHERE id = 1;

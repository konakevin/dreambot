-- 569_holiday_fall_50_october_30_30.sql — 2026-09-27. Kevin: "make it 50% fall, and then 30/30 during october".
--
-- The season roll sums the active seasons' pcts (combineHolidayPct), clamps the sum to
-- engine_config.holiday_stack_cap_pct, and picks one season weighted by pct (_shared/holidayWindow.ts). So:
--   Fall alone (Sept 15-30, Nov 1-26 Thanksgiving): 50 (under the cap)            → 50% Fall
--   October 1-30 (Fall + Halloween):                  50 + 50 = 100 → capped 60, split 50:50 → 30% Fall + 30% Halloween
--   October 31: unchanged, Halloween's day-of takeover (100%, six curated looks).
-- Both rows are ramp_style = 'flat', so peak_pct IS the level (the ramp / final knobs are ignored).
-- Halloween never runs alone (its Oct 1-31 window sits inside Fall's), so its pct only sets the October weight;
-- equal to Fall's → an even split. Replaces 30 / 30 with cap 50 (Fall 30% alone, 25/25 in October).
-- Locked by __tests__/lib/holidaySeason2026.test.ts.

UPDATE public.holidays SET peak_pct = 50 WHERE key IN ('fall', 'halloween');

UPDATE public.engine_config SET holiday_stack_cap_pct = 60 WHERE id = 1;

COMMENT ON COLUMN public.engine_config.holiday_stack_cap_pct IS
  'Cap on the SUMMED holiday roll pct when several seasons are active (combineHolidayPct). 100 = no cap. Kevin 2026-09-27: 60 (Fall 50 + Halloween 50 → 30/30 in October; Fall alone 50).';

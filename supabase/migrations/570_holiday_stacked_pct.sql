-- 570_holiday_stacked_pct.sql — 2026-09-27. Kevin: Fall 50% on its own; in October 50% Halloween + 20% Fall.
--
-- One flat level per season can't express that: Fall must be 50 alone (Sept 15-30, Nov 1-26) but 20 beside
-- Halloween. New optional column holidays.stacked_pct = the level a season uses INSTEAD of its own while another
-- season is active the same day (_shared/holidayWindow.ts resolveActiveHolidays + its scripts/lib mirror).
-- The stack cap goes to 100 (no cap): the stacked pcts now set October directly.
--
--   Sept 15-30   Fall 50                          → 50% of nightly dreams are Fall
--   Oct 1-30     Halloween 50 + Fall 20 = 70       → 50% Halloween, 20% Fall
--   Oct 31       Halloween day-of takeover         → 100% Halloween (unchanged)
--   Nov 1-26     Fall 50                          → 50% Fall
--
-- Deploy order: nightly-dreams with stacked_pct support went out first (an older engine would ignore the column
-- and, with the cap at 100, run October at 100%). Locked by __tests__/lib/holidaySeason2026.test.ts.

ALTER TABLE public.holidays ADD COLUMN IF NOT EXISTS stacked_pct integer;
ALTER TABLE public.holidays DROP CONSTRAINT IF EXISTS holidays_stacked_pct_chk;
ALTER TABLE public.holidays
  ADD CONSTRAINT holidays_stacked_pct_chk CHECK (stacked_pct IS NULL OR stacked_pct BETWEEN 0 AND 100);
COMMENT ON COLUMN public.holidays.stacked_pct IS
  'Level this season uses instead of its own while another season is active the same day. NULL = keep its own. Kevin 2026-09-27: Fall 20, Halloween 50.';

UPDATE public.holidays SET peak_pct = 50, stacked_pct = 20 WHERE key = 'fall';
UPDATE public.holidays SET peak_pct = 50, stacked_pct = 50 WHERE key = 'halloween';

UPDATE public.engine_config SET holiday_stack_cap_pct = 100 WHERE id = 1;
COMMENT ON COLUMN public.engine_config.holiday_stack_cap_pct IS
  'Cap on the SUMMED holiday roll pct when several seasons are active (combineHolidayPct). 100 = no cap. Kevin 2026-09-27: 100 (holidays.stacked_pct sets the October split directly: 50 Halloween + 20 Fall).';

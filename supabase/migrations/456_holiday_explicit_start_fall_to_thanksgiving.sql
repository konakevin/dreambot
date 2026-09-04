-- 456: Holiday seasons get an OPTIONAL explicit start date; Fall becomes Sept 15 → Thanksgiving Day.
--
-- Kevin (2026-09-04): holidays are OVERLAPPING eligible seed pools — Fall runs Sept 15 through
-- Thanksgiving DAY, Halloween Oct 1-31, and later Christmas + New Year's week overlap the same way.
-- A user inside an overlap can get either season's dream (the render already sums + mixes every
-- active season — resolveActiveHolidays / combineHolidayPct / pickWeightedHoliday).
--
-- The catalog's window model was "opens `window_days` before the peak". Pinning Fall's START to
-- Sept 15 while its END (Thanksgiving) floats Nov 22-28 would drift the start by up to a week each
-- year, so seasons may now carry an explicit `start_month`/`start_day`. When set, the window is
-- [start, peak] and `window_days` is informational. Ramped holidays keep the relative model.
-- Year-wrap is handled in `_shared/holidayWindow.ts` (a start later in the year than the peak,
-- e.g. Dec 26 → Jan 1, resolves to the previous calendar year).

ALTER TABLE public.holidays
  ADD COLUMN IF NOT EXISTS start_month int,
  ADD COLUMN IF NOT EXISTS start_day   int;

ALTER TABLE public.holidays DROP CONSTRAINT IF EXISTS holidays_explicit_start_chk;
ALTER TABLE public.holidays ADD CONSTRAINT holidays_explicit_start_chk CHECK (
  (start_month IS NULL AND start_day IS NULL)
  OR (start_month BETWEEN 1 AND 12 AND start_day BETWEEN 1 AND 31)
);

COMMENT ON COLUMN public.holidays.start_month IS
  'Optional explicit window START (with start_day). When set the window is [start, peak] and window_days is informational. NULL = opens window_days before the peak.';
COMMENT ON COLUMN public.holidays.start_day IS
  'See start_month.';

-- Fall: flat ~10% ambient season, Sept 15 → Thanksgiving Day (4th Thursday of November).
-- window_days=72 is the 2026 span (Sept 15 → Nov 26) kept for readability only.
UPDATE public.holidays SET
  ramp_style   = 'flat',
  peak_rule    = 'nth_weekday',
  peak_month   = 11,
  peak_day     = NULL,
  peak_nth     = 4,
  peak_weekday = 4,
  start_month  = 9,
  start_day    = 15,
  window_days  = 72,
  peak_pct     = 10,
  ramp_start_pct = 10,
  final_pct    = 10,
  final_days   = 0,
  peak_lead_days = 0
WHERE key = 'fall';

-- Sanity: the row now describes Sept 15 → Thanksgiving.
SELECT key, ramp_style, peak_rule, peak_month, peak_nth, peak_weekday, start_month, start_day, peak_pct, is_active
FROM public.holidays WHERE key = 'fall';

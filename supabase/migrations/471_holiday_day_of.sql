-- 471 — Holiday DAY-OF overhaul, step 1 (HOLIDAY_DAY_OF_PLAN.md §3.1 / §4).
-- (a) holidays.day_of_enabled: a holiday can have a window without a day-of takeover
--     (the Fall season's peak is Thanksgiving, which gets its own row + day_of pool).
-- (b) engine_config.day_of_evening_cutoff_hour: the nightly runs at 08:00 UTC; a user whose
--     LOCAL hour at that instant is >= this cutoff is evaluated against the NEXT local date
--     (the render is consumed the next morning — Hawaii is 22:00 the evening before).
ALTER TABLE public.holidays
  ADD COLUMN IF NOT EXISTS day_of_enabled boolean NOT NULL DEFAULT true;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS day_of_evening_cutoff_hour smallint NOT NULL DEFAULT 20
  CHECK (day_of_evening_cutoff_hour BETWEEN 0 AND 24);

COMMENT ON COLUMN public.holidays.day_of_enabled IS
  'Holiday DAY-OF takeover: on the user''s peak date every eligible nightly draws 100% from the holiday''s <key>_day_of pool (HOLIDAY_DAY_OF_PLAN.md). false = window only.';
COMMENT ON COLUMN public.engine_config.day_of_evening_cutoff_hour IS
  'Local hour (0-24) at the 08:00 UTC nightly run from which the day-of date is the NEXT local date (24 = never shift). Default 20.';

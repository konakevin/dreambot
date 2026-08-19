-- 439_holiday_day_of.sql — Holiday Dreams "day-of hero" (HOLIDAY_DREAMS_PLAN.md §13).
-- On the holiday ITSELF (daysUntilPeak === 0), every non-opted-out user is
-- GUARANTEED a grand "hero" dream — the crescendo the gentle echo builds toward.
-- Hero rows live in the SAME pools/categories, flagged day_of=true, so the render
-- can draw exclusively from them on the day (and never on the ordinary in-season
-- nights). A `day_of` row is a bigger, more cinematic concept than the everyday ones.
-- Still dark until launch.

ALTER TABLE public.dual_scenarios   ADD COLUMN IF NOT EXISTS day_of boolean NOT NULL DEFAULT false;
ALTER TABLE public.single_scenarios ADD COLUMN IF NOT EXISTS day_of boolean NOT NULL DEFAULT false;
ALTER TABLE public.holiday_scenes   ADD COLUMN IF NOT EXISTS day_of boolean NOT NULL DEFAULT false;

-- Partial indexes so the day-of draw (pool='holiday' + category + day_of) is cheap.
CREATE INDEX IF NOT EXISTS idx_dual_scenarios_holiday_dayof
  ON public.dual_scenarios (category) WHERE pool = 'holiday' AND day_of = true AND disabled = false;
CREATE INDEX IF NOT EXISTS idx_single_scenarios_holiday_dayof
  ON public.single_scenarios (category) WHERE pool = 'holiday' AND day_of = true AND disabled = false;
CREATE INDEX IF NOT EXISTS idx_holiday_scenes_dayof
  ON public.holiday_scenes (holiday) WHERE day_of = true AND disabled = false;

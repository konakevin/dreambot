-- 440_holiday_sub_theme.sql — per-archetype quality control (HOLIDAY_DREAMS_PLAN.md §8).
-- Tags every holiday row with its archetype (vampire / witch / monster_hunter /
-- corn_maze / …) so each is a TRACKED sub-pool we can QA, cull, and scale
-- independently — the same MVP-25 → QA → scale discipline as the bots. The render
-- still draws across the whole holiday (category); sub_theme is for control, not
-- the draw. Still dark.

ALTER TABLE public.dual_scenarios   ADD COLUMN IF NOT EXISTS sub_theme text;
ALTER TABLE public.single_scenarios ADD COLUMN IF NOT EXISTS sub_theme text;
ALTER TABLE public.holiday_scenes   ADD COLUMN IF NOT EXISTS sub_theme text;

-- Cheap per-archetype QA/count lookups within a holiday.
CREATE INDEX IF NOT EXISTS idx_dual_scenarios_holiday_subtheme
  ON public.dual_scenarios (category, sub_theme) WHERE pool = 'holiday' AND disabled = false;
CREATE INDEX IF NOT EXISTS idx_single_scenarios_holiday_subtheme
  ON public.single_scenarios (category, sub_theme) WHERE pool = 'holiday' AND disabled = false;
CREATE INDEX IF NOT EXISTS idx_holiday_scenes_subtheme
  ON public.holiday_scenes (holiday, sub_theme) WHERE disabled = false;

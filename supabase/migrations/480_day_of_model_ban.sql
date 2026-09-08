-- 480 — Holiday DAY-OF model ban (HOLIDAY_DAY_OF_PLAN.md §5d/§7b; Kevin 2026-09-08: "disable seedream-4
-- from the day-of models, we don't want to risk it"). seedream-4 returns 1440×2560 PNGs that defer the
-- postcard overlay to the GitHub-throttled cron. Every model pick a day-of render makes (face-swap, scene,
-- retry, policy) excludes these models; the default applies to every future holiday.
ALTER TABLE public.holidays
  ADD COLUMN IF NOT EXISTS day_of_model_ban text[] NOT NULL DEFAULT ARRAY['bytedance/seedream-4']::text[];
COMMENT ON COLUMN public.holidays.day_of_model_ban IS
  'Models a DAY-OF render never picks (merged into the nightly ban set for that render). Default seedream-4 (2K PNG output defers the postcard).';
UPDATE public.holidays SET day_of_model_ban = ARRAY['bytedance/seedream-4']::text[];

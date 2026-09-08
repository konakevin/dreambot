-- 476 — Holiday DAY-OF costume lock (HOLIDAY_DAY_OF_PLAN.md §5b, _shared/holidayCostumes.ts).
-- On a holiday's day-of cast render each cast member is dressed in a rolled character costume from the
-- holiday's costume pool, locked into the prompt verbatim (Kevin 2026-09-08: "people need to look more
-- dressed up in costumes … they have to find out what they dressed up as"). 0 = off (the row's own
-- attire hint applies again). Live-tunable, no build.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS day_of_costume_pct smallint NOT NULL DEFAULT 100
  CHECK (day_of_costume_pct BETWEEN 0 AND 100);

COMMENT ON COLUMN public.engine_config.day_of_costume_pct IS
  'Holiday DAY-OF costume lock: % of day-of cast renders whose cast are dressed from the holiday costume pool (holidayCostumes.ts). Default 100; 0 = off.';

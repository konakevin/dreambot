-- 585_nightly_outfit_plan.sql — NIGHTLY_OUTFIT_VARIETY_PLAN.md: no more outfit lock (Kevin 2026-09-30).
--
-- Two of five test nightlies put Kevin in the same navy brass-button jacket. Measured: a beach has 3-4 men's looks,
-- a spot naming a pier / harbour / lighthouse took "nautical" 89% of the time (the favoured-look rule at 85%), and
-- nightly had no colour or cut roll, so a look was always the same outfit in the place's default palette.
--
--   nightly_outfit_plan          nightly rolls Create's full outfit plan (a colour pair, a cut, a pattern + the look).
--                                false = the looks-only path exactly. Switched on only after the probe + render check.
--   outfit_favoured_look_pct     % a look the scene names wins over the place's other looks (both surfaces). 85 was the
--                                old constant; 30 keeps the theme sometimes and the place's variety the rest.
--   nightly_outfit_recent_looks  skip the looks of this many recent nightlies per role (0 = off, max 7).
--
-- Rollback: nightly_outfit_plan = false; outfit_favoured_look_pct = 85. No deploy.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_outfit_plan boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS outfit_favoured_look_pct integer NOT NULL DEFAULT 30
    CHECK (outfit_favoured_look_pct BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS nightly_outfit_recent_looks integer NOT NULL DEFAULT 5
    CHECK (nightly_outfit_recent_looks BETWEEN 0 AND 7);

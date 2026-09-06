-- SCENE_FIRST_ACTION_PLAN.md §10: location COUPLES stay on the existing pose path until this is true.
-- 2026-09-06 controlled comparison on the same 7 places (flux-1.1-pro): 4/7 couples degraded with scene-first
-- beats + stances vs 2/6 without. Solos on location are unaffected (they ramp via scene_action_location_pct).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS scene_action_location_couples boolean NOT NULL DEFAULT false;

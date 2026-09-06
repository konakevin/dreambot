-- SCENE_FIRST_ACTION_PLAN.md §10 (Kevin 2026-09-06: "apply this fix globally to nightly", "bespoke actions for
-- certain genres of pools"). Two independent ramps, both dark by default:
--   scene_action_location_pct — % of PLAIN-LOCATION cast renders (≈60% of nightlies) whose action beat Sonnet
--     authors from the place inside the slot call (Option B's separate call is skipped when it fires). Ramps
--     0 → 25 → 100 on Kevin's approval, independent of scene_action_pct (seeded rows).
--   action_registers_pct — % of scene-first renders that also receive the GENRE action register
--     (_shared/actionRegisters.ts: coherent things people do in that world + composed-still options).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS scene_action_location_pct integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS action_registers_pct integer NOT NULL DEFAULT 0;

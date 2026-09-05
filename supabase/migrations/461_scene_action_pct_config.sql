-- Scene-first actions (Kevin, 2026-09-05 — SCENE_FIRST_ACTION_PLAN.md): for nightly SCENARIO-row
-- cast renders (goofy / elegant / holiday / hero), Sonnet authors the action beat FROM the scene
-- inside the existing slot call instead of the engine pasting a blind register-pool pose onto the
-- seed. This % controls how often that fires (active rows and rows naming a pose_pool are exempt).
-- 0 = off (default, no behavior change until QA sign-off).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS scene_action_pct integer NOT NULL DEFAULT 0;

-- engine_config is the singleton read by the service role in edge functions;
-- no client GRANT needed (not exposed to anon/authenticated).

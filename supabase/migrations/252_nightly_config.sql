-- 252_nightly_config.sql — admin-tunable nightly-enqueue knobs (ADMIN_CONFIG_PLAN.md Phase 6).
--
-- The nightly cron's eligibility predicates were hardcoded in scripts/nightly-dreams.js.
-- These engine_config flags make them tunable from the dashboard, and add a master
-- kill-switch to pause nightly enqueues without touching the GitHub Actions cron:
--   nightly_enabled            — FALSE pauses all nightly enqueues (incident/cost switch)
--   nightly_require_onboarding — gate on user_recipes.onboarding_completed (default on)
--   nightly_require_ai_enabled — gate on user_recipes.ai_enabled (default on)
--
-- (nightly_max_jobs already lives on engine_config from migration 247. The is_bot=false
-- guard stays hardcoded — bots must never be enqueued, that's not a tunable.)
--
-- Read by the nightly cron via the service role (engine_config already has RLS). Run
-- in the dashboard SQL editor. Idempotent. Defaults preserve today's behavior.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_enabled            boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS nightly_require_onboarding boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS nightly_require_ai_enabled boolean NOT NULL DEFAULT true;

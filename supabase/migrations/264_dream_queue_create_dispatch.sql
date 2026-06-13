-- Migration 264: queue-worker concurrency config for routing user "Create"
-- dreams through dream_queue (escape Supabase Edge 546 WORKER_RESOURCE_LIMIT).
--
-- The GLOBAL concurrency cap is the real anti-546 lever: the worker claims only
-- up to (dream_queue_max_concurrent - count(in_progress)) jobs per tick, so a
-- 500-user burst drains at a bounded number of simultaneously-rendering
-- isolates instead of all at once. Tunable live from the dashboard (no deploy)
-- so we can dial it against the load test. Both values have code fallbacks in
-- _shared/engineConfig.ts (40 / 10), so a missing row never breaks the worker.
--
-- No new dream_queue columns are needed: `source` already allows 'create'/'dlt'
-- (migration 156), the result is read via the existing `upload_id`, and
-- `dedup_key` (UNIQUE, migration 259) gives insert-time double-tap idempotency.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dream_queue_max_concurrent integer NOT NULL DEFAULT 40,
  ADD COLUMN IF NOT EXISTS dream_queue_max_jobs_per_tick integer NOT NULL DEFAULT 10;

COMMENT ON COLUMN public.engine_config.dream_queue_max_concurrent IS
  'Global cap on simultaneously-rendering dream_queue jobs (anti-546 lever). Worker claims only up to (this - in_progress) per tick.';
COMMENT ON COLUMN public.engine_config.dream_queue_max_jobs_per_tick IS
  'Max jobs a single worker tick will claim (upper bound regardless of the global cap headroom).';

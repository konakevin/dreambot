-- 123_bot_dedup_and_runlog.sql
--
-- Phase 1 of the bot-engine migration. Adds two tables used exclusively
-- by the new bot engine (scripts/lib/botEngine.js):
--
--   bot_dedup    — per-axis recency log. Engine queries last 5 days of
--                  picks per bot, excludes them from pool selection so
--                  the same bot doesn't repeat skin/body/glow/etc.
--                  within the window. Committed ONLY on successful post.
--
--   bot_run_log  — one row per bot cron invocation. Success OR failure.
--                  Observability + cost tracking. Engine fails loud
--                  (throws + GitHub Actions error) when fallbacks
--                  exhaust, and this table captures the stage it died at.
--
-- Neither table is touched by user-dream paths (generate-dream Edge Function,
-- nightly-dreams, DLT). Bot engine is fully standalone.
--
-- See docs/MIGRATE-BOT.md for the per-bot migration process.

CREATE TABLE IF NOT EXISTS public.bot_dedup (
  id BIGSERIAL PRIMARY KEY,
  bot_name TEXT NOT NULL,
  axis TEXT NOT NULL,
  value TEXT NOT NULL,
  picked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bot_dedup_lookup_idx
  ON public.bot_dedup (bot_name, axis, picked_at DESC);

CREATE INDEX IF NOT EXISTS bot_dedup_cleanup_idx
  ON public.bot_dedup (picked_at);

-- Service-role writes only — no app access needed.
ALTER TABLE public.bot_dedup ENABLE ROW LEVEL SECURITY;


CREATE TABLE IF NOT EXISTS public.bot_run_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_name TEXT NOT NULL,
  path TEXT,
  vibe TEXT,
  medium TEXT,
  status TEXT NOT NULL CHECK (status IN ('ok', 'failed', 'skipped')),
  error TEXT,
  error_stage TEXT,
  image_url TEXT,
  duration_ms INT,
  cost_cents INT,
  prompt_preview TEXT,
  sonnet_retries INT,
  sonnet_fell_back_to_secondary BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bot_run_log_by_bot_idx
  ON public.bot_run_log (bot_name, created_at DESC);

CREATE INDEX IF NOT EXISTS bot_run_log_failed_idx
  ON public.bot_run_log (status, created_at DESC)
  WHERE status = 'failed';

-- Service-role writes only — admin / ops query access comes via the
-- dashboard with service-role key.
ALTER TABLE public.bot_run_log ENABLE ROW LEVEL SECURITY;


-- Example operational queries (commented — for reference):
--
-- Last 24h failures:
-- SELECT bot_name, error_stage, error, created_at
-- FROM bot_run_log
-- WHERE status = 'failed' AND created_at > now() - INTERVAL '24 hours'
-- ORDER BY created_at DESC;
--
-- Per-bot uptime last 7 days:
-- SELECT bot_name,
--   count(*) FILTER (WHERE status = 'ok') AS ok,
--   count(*) FILTER (WHERE status = 'failed') AS fail,
--   round(100.0 * count(*) FILTER (WHERE status = 'ok') / nullif(count(*), 0), 1) AS ok_pct
-- FROM bot_run_log
-- WHERE created_at > now() - INTERVAL '7 days'
-- GROUP BY bot_name
-- ORDER BY ok_pct ASC;
--
-- Cost per bot last 30 days:
-- SELECT bot_name, sum(cost_cents) AS total_cents, count(*) AS renders
-- FROM bot_run_log
-- WHERE status = 'ok' AND created_at > now() - INTERVAL '30 days'
-- GROUP BY bot_name
-- ORDER BY total_cents DESC;
--
-- Monthly cleanup of bot_dedup (run as cron or manual):
-- DELETE FROM bot_dedup WHERE picked_at < now() - INTERVAL '30 days';

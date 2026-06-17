-- Migration 274: 30-day retention for the observability logs.
--
-- ai_generation_log writes one row per generation (success + failure) and never
-- pruned — it was at ~9.7k rows (~7.2k older than 30 days) and growing forever.
-- dream_queue / dream_jobs accumulate terminal rows the same way. 30 days is far
-- more than enough to diagnose a recent "random failure" (dream_forensics /
-- check-forensics default to a 24h–7d lookback), so prune older rows daily.
--
-- SAFETY: only TERMINAL rows are deleted. In-flight rows (dream_queue
-- queued/in_progress, dream_jobs processing) are kept regardless of age, so a
-- genuinely stuck job is never silently swept. sparkle_transactions (financial
-- ledger) and notifications (user inbox) are intentionally NOT pruned here.

-- ── Retention function ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.prune_observability_logs(p_days integer DEFAULT 30)
RETURNS TABLE (table_name text, deleted bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cutoff timestamptz := now() - make_interval(days => greatest(p_days, 1));
  v_n bigint;
BEGIN
  DELETE FROM public.ai_generation_log WHERE created_at < v_cutoff;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'ai_generation_log'; deleted := v_n; RETURN NEXT;

  -- Terminal queue rows only — never delete queued/in_progress (an in-flight or
  -- genuinely stuck job must stay visible).
  DELETE FROM public.dream_queue
   WHERE status IN ('completed', 'dead_letter', 'failed') AND created_at < v_cutoff;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'dream_queue'; deleted := v_n; RETURN NEXT;

  -- Terminal job rows only — never delete 'processing'.
  DELETE FROM public.dream_jobs
   WHERE status IN ('done', 'failed', 'nsfw', 'timeout') AND created_at < v_cutoff;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'dream_jobs'; deleted := v_n; RETURN NEXT;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prune_observability_logs(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_observability_logs(integer) TO service_role;

-- ── Daily schedule (pg_cron) ────────────────────────────────────────────────
-- 04:17 UTC, off-peak. Unschedule first so re-running this migration is safe.
-- To change the window: re-run with prune_observability_logs(N).
SELECT cron.unschedule('prune-observability-logs')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'prune-observability-logs');

SELECT cron.schedule(
  'prune-observability-logs',
  '17 4 * * *',
  $$ SELECT public.prune_observability_logs(30) $$
);

-- One-time immediate run to clear the existing backlog.
SELECT * FROM public.prune_observability_logs(30);

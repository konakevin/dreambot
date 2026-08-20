-- Migration 442: retention sweep for the append-only logs the 2026-08-20 audit
-- found growing unbounded. Case-by-case windows (some logs need longer than others).
--
-- FULL RETENTION MAP after this migration (every append/log table in the DB):
--   ai_generation_log ......... 30d  (mig 274 → batched in 441)
--   dream_queue / dream_jobs ... 30d terminal-only (mig 274/441)
--   db_health_log .............. 7d   (mig 372)
--   first_dream_ip_events ...... 2d   (mig 332)
--   pool_pick_history .......... 180d (mig 349 — deliberately long for analytics)
--   bot_run_log ................ 30d  ← NEW (this migration)
--   edge_function_invocations .. 2d   ← NEW (rate-limiter only reads the last hour)
--   bot_dedup .................. stale-BAG cleanup ← NEW (see below)
-- Durable/product data NEVER pruned: uploads, likes, sparkle_transactions (ledger),
--   notifications (inbox), follows, comments, users, seed/scenario pools.
-- post_impressions (43k) is a per-(user,upload) ROLLUP the feed reads — not a log;
--   left to the feed owner.
--
-- ── bot_dedup: the real find (222k rows, 92% older than 30 days) ────────────
-- bot_dedup is the bot picker's shuffle-bag (scripts/lib/botEngine.js). The picker
-- deletes an axis's rows ONLY when that axis's pool cycles to exhaustion in a live
-- render. So bags for RETIRED bots (renamed → 26k orphan rows) and ROTATED-OUT paths
-- (their path-specific axes are never picked again → never exhaust) live forever.
-- Migration 123 correctly forbids a blind `picked_at < 30d` DELETE — that would reset
-- an ACTIVE cycle whose bag legitimately spans >30d of slow picking. The SAFE fix is
-- different: delete whole (bot_name, axis) bags whose NEWEST pick is >30d old. An
-- actively-cycled axis is picked constantly, so its max(picked_at) is always recent
-- and it is never touched; only genuinely-inactive/retired bags (incl. all orphan
-- bots) are cleared. Worst case on a bag that reactivates after 30d dormancy: one
-- value might repeat that hasn't appeared in a month — imperceptible.
--
-- Apply in the Supabase dashboard SQL editor. Re-runnable.

CREATE OR REPLACE FUNCTION public.prune_activity_logs()
RETURNS TABLE (table_name text, deleted bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_n bigint;
BEGIN
  -- Cap any single delete so a lapsed cron can't hold locks for minutes.
  SET LOCAL statement_timeout = '4min';

  -- bot_run_log — one row per bot cron invocation (observability/cost). ~50/day.
  DELETE FROM public.bot_run_log WHERE created_at < now() - INTERVAL '30 days';
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'bot_run_log'; deleted := v_n; RETURN NEXT;

  -- edge_function_invocations — rate-limiter sliding window; only the last HOUR is
  -- ever read. Keep 2 days for a debugging margin.
  DELETE FROM public.edge_function_invocations WHERE created_at < now() - INTERVAL '2 days';
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'edge_function_invocations'; deleted := v_n; RETURN NEXT;

  -- bot_dedup — STALE-BAG cleanup (group-recency, NOT row-age; see header). Deletes
  -- every row of any (bot_name, axis) whose most-recent pick is older than 30 days.
  -- Active shuffle-bags (picked within 30d) are fully preserved → cycles never reset.
  DELETE FROM public.bot_dedup
   WHERE (bot_name, axis) IN (
     SELECT bot_name, axis
       FROM public.bot_dedup
      GROUP BY bot_name, axis
     HAVING max(picked_at) < now() - INTERVAL '30 days'
   );
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'bot_dedup'; deleted := v_n; RETURN NEXT;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prune_activity_logs() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_activity_logs() TO service_role;

-- Daily at 04:23 UTC, off-peak (staggered off the other prunes at :13/:17/:20).
SELECT cron.unschedule('prune-activity-logs')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'prune-activity-logs');

SELECT cron.schedule(
  'prune-activity-logs',
  '23 4 * * *',
  $$ SELECT public.prune_activity_logs() $$
);

-- One-time immediate run clears the existing backlog now (bot_dedup ~222k → the
-- handful of active bags; bot_run_log ~27k → ~1.5k; edge_function_invocations → ~0).
SELECT * FROM public.prune_activity_logs();

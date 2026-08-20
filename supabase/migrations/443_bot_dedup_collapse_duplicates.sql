-- Migration 443: collapse duplicate bot_dedup rows (legacy pre-shuffle-bag cruft).
--
-- After 442's stale-bag sweep, bot_dedup was still 162k rows. Investigation: nearly
-- every ACTIVE (bot_name, axis) bag has a 2-3x DUPLICATE ratio — the same value
-- stored 2-3 times — with rows spanning up to ~118 days. Root cause: before the
-- shuffle-bag model (2026-06-05, ~76d before this migration) the picker used a
-- 5-day rolling window and RE-INSERTED a recency row on every pick, so a value hit
-- repeatedly piled up copies. The shuffle-bag model picks each value once per cycle
-- (filtered thereafter) and deletes the axis on exhaustion — but it never cleaned
-- the legacy duplicates, and the time-prune that would have was disabled (mig 123).
--
-- The picker (scripts/lib/botEngine.js createPicker) loads bot_dedup into a per-axis
-- Set of values — so N copies of a value are functionally identical to 1. Collapsing
-- duplicates to the single newest row per (bot_name, axis, value) is a ZERO-BEHAVIOR
-- change that removes the bloat. Folded into prune_activity_logs so it self-maintains.
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
  SET LOCAL statement_timeout = '5min';

  -- bot_run_log — one row per bot cron invocation. 30-day retention.
  DELETE FROM public.bot_run_log WHERE created_at < now() - INTERVAL '30 days';
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'bot_run_log'; deleted := v_n; RETURN NEXT;

  -- edge_function_invocations — rate-limiter window; only the last hour is read.
  DELETE FROM public.edge_function_invocations WHERE created_at < now() - INTERVAL '2 days';
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'edge_function_invocations'; deleted := v_n; RETURN NEXT;

  -- bot_dedup step 1 — COLLAPSE DUPLICATES: keep only the newest row per
  -- (bot_name, axis, value). The picker only cares whether a value is present, so
  -- this changes nothing about dedup behavior; it just drops redundant copies.
  DELETE FROM public.bot_dedup a
   USING public.bot_dedup b
   WHERE a.bot_name = b.bot_name
     AND a.axis     = b.axis
     AND a.value    = b.value
     AND (a.picked_at < b.picked_at OR (a.picked_at = b.picked_at AND a.id < b.id));
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'bot_dedup:duplicates'; deleted := v_n; RETURN NEXT;

  -- bot_dedup step 2 — STALE-BAG cleanup: drop whole (bot_name, axis) bags whose
  -- newest pick is >30d old (retired bots/paths). Active bags are never touched.
  DELETE FROM public.bot_dedup
   WHERE (bot_name, axis) IN (
     SELECT bot_name, axis
       FROM public.bot_dedup
      GROUP BY bot_name, axis
     HAVING max(picked_at) < now() - INTERVAL '30 days'
   );
  GET DIAGNOSTICS v_n = ROW_COUNT;
  table_name := 'bot_dedup:stale_bags'; deleted := v_n; RETURN NEXT;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prune_activity_logs() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_activity_logs() TO service_role;

-- One-time run: collapses the legacy duplicates now (162k → ~distinct-value count).
SELECT * FROM public.prune_activity_logs();

-- 372_db_health_forensics.sql
--
-- Forensics for the recurring Supabase "unhealthy" incidents. We've only ever
-- reacted (restart → back to normal), so we never captured WHAT was wrong. This
-- snapshots pg_stat_activity to a log table every minute via pg_cron, so the NEXT
-- time the instance degrades we can read the exact state (connections by state,
-- longest-running query, idle-in-transaction sessions, lock waits, which service
-- holds the connections) instead of guessing.
--
-- Review with:  SELECT * FROM public.db_health_log ORDER BY captured_at DESC;
-- (service_role only — not client-facing.)
--
-- Apply in the Supabase dashboard SQL editor (DDL can't go through the JS client).
-- Re-runnable.

-- ── Log table ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.db_health_log (
  id                     bigserial PRIMARY KEY,
  captured_at            timestamptz NOT NULL DEFAULT now(),
  total_conn             int,      -- total backends (excl. this snapshot)
  active_conn            int,      -- state = 'active'
  idle_conn              int,      -- state = 'idle'
  idle_in_txn_conn       int,      -- state = 'idle in transaction' (lock/bloat risk)
  max_connections        int,      -- the instance ceiling (total_conn/this = headroom)
  lock_waiters           int,      -- backends blocked on a lock (contention signal)
  longest_active_secs    numeric,  -- age of the oldest running query
  longest_active_query   text,     -- ...and its text (truncated)
  longest_idle_txn_secs  numeric,  -- age of the oldest idle-in-transaction
  longest_idle_txn_query text,     -- ...and its last query (truncated)
  by_application         jsonb,    -- connection count per application_name
  by_wait_event          jsonb     -- connection count per wait_event_type
);
CREATE INDEX IF NOT EXISTS db_health_log_captured_idx ON public.db_health_log (captured_at DESC);

-- No client access — only service_role (bypasses RLS) reads it.
ALTER TABLE public.db_health_log ENABLE ROW LEVEL SECURITY;

-- ── Snapshot function ───────────────────────────────────────────────────────
-- SECURITY DEFINER so it can read every row of pg_stat_activity (a normal role
-- only sees its own). Wrapped so a snapshot error can never break the cron job.
CREATE OR REPLACE FUNCTION public.capture_db_health()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_max int;
BEGIN
  SELECT setting::int INTO v_max FROM pg_settings WHERE name = 'max_connections';

  INSERT INTO public.db_health_log (
    total_conn, active_conn, idle_conn, idle_in_txn_conn, max_connections, lock_waiters,
    longest_active_secs, longest_active_query, longest_idle_txn_secs, longest_idle_txn_query,
    by_application, by_wait_event
  )
  SELECT
    count(*),
    count(*) FILTER (WHERE state = 'active'),
    count(*) FILTER (WHERE state = 'idle'),
    count(*) FILTER (WHERE state = 'idle in transaction'),
    v_max,
    count(*) FILTER (WHERE wait_event_type = 'Lock'),
    COALESCE(max(EXTRACT(EPOCH FROM (now() - query_start))) FILTER (WHERE state = 'active'), 0),
    (SELECT left(query, 300) FROM pg_stat_activity
       WHERE state = 'active' AND pid <> pg_backend_pid()
       ORDER BY query_start ASC NULLS LAST LIMIT 1),
    COALESCE(max(EXTRACT(EPOCH FROM (now() - state_change))) FILTER (WHERE state = 'idle in transaction'), 0),
    (SELECT left(query, 300) FROM pg_stat_activity
       WHERE state = 'idle in transaction'
       ORDER BY state_change ASC NULLS LAST LIMIT 1),
    (SELECT jsonb_object_agg(app, c) FROM (
       SELECT coalesce(nullif(application_name, ''), '(unknown)') app, count(*) c
       FROM pg_stat_activity WHERE pid <> pg_backend_pid()
       GROUP BY 1 ORDER BY 2 DESC LIMIT 15) t),
    (SELECT jsonb_object_agg(we, c) FROM (
       SELECT coalesce(wait_event_type, '(none)') we, count(*) c
       FROM pg_stat_activity WHERE pid <> pg_backend_pid()
       GROUP BY 1 ORDER BY 2 DESC LIMIT 10) t)
  FROM pg_stat_activity
  WHERE pid <> pg_backend_pid();
EXCEPTION WHEN OTHERS THEN
  -- Never let a monitoring hiccup break the cron.
  NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.capture_db_health() TO service_role;

-- ── Schedules (pg_cron) ─────────────────────────────────────────────────────
-- Every minute: fine enough to catch the onset of a degradation.
SELECT cron.schedule('db-health-snapshot', '* * * * *', $$SELECT public.capture_db_health()$$);
-- Keep 7 days of history; prune nightly.
SELECT cron.schedule('db-health-prune', '13 4 * * *',
  $$DELETE FROM public.db_health_log WHERE captured_at < now() - interval '7 days'$$);

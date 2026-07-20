-- 381: connection-leak forensics + idle-session reaper.
--
-- The 372 snapshot proved the recurring "unhealthy" is NOT a transaction leak
-- (idle-in-txn stays ~0) but the plain-IDLE connection count creeps up over hours
-- (~9 fresh → ~30 before the 2026-07-20 06:00 UTC wedge), eating the 60-conn
-- Micro headroom until a PostgREST burst tips it over. Aggregate counts can't tell
-- us WHICH connections are stale / where they come from. This adds:
--
--   1. admin_db_connections()  — on-demand per-connection detail (age, idle
--      duration, application, client_addr, last query) so we can NAME the leaking
--      connections. service_role + supreme-admin only.
--   2. idle-age tracking in the minute snapshot (oldest_idle_secs +
--      idle_age_by_application) so a creep is visible in db_health_log over time
--      and the monitor can page on the LEAK ONSET, not just saturation.
--   3. idle_session_timeout = 10min — reaps FORGOTTEN idle connections (the idle
--      TTL). Active pooling (PostgREST reuses within the window) and realtime
--      streaming (state='active', not idle) are unaffected; only genuinely-idle
--      sessions past 10min are closed, and their client reconnects on next use.
--
-- Apply in the Supabase dashboard SQL editor. Re-runnable.

-- ── 1. Per-connection forensic RPC ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_db_connections()
RETURNS TABLE (
  pid              int,
  application_name text,
  usename          text,
  client_addr      text,
  backend_type     text,
  state            text,
  secs_connected   numeric,   -- now - backend_start (how long the conn has existed)
  secs_idle        numeric,   -- now - state_change  (how long it's sat in this state)
  wait_event_type  text,
  wait_event       text,
  query            text       -- last/current query, truncated
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  -- service_role (the monitor/scripts) or the supreme admin (Kevin) only.
  IF NOT (
    current_setting('role', true) = 'service_role'
    OR auth.uid() = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'::uuid
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    a.pid,
    coalesce(nullif(a.application_name, ''), '(unknown)'),
    a.usename::text,
    coalesce(host(a.client_addr), '(local)'),
    a.backend_type::text,
    a.state::text,
    round(EXTRACT(EPOCH FROM (now() - a.backend_start))::numeric, 0),
    round(EXTRACT(EPOCH FROM (now() - a.state_change))::numeric, 0),
    a.wait_event_type::text,
    a.wait_event::text,
    left(a.query, 150)
  FROM pg_stat_activity a
  WHERE a.pid <> pg_backend_pid()
  ORDER BY
    -- Surface the oldest IDLE connections first — that's where a leak shows.
    (a.state = 'idle') DESC,
    (now() - a.state_change) DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_db_connections() TO service_role, authenticated;

-- ── 2. Idle-age tracking in the minute snapshot ────────────────────────────
ALTER TABLE public.db_health_log
  ADD COLUMN IF NOT EXISTS oldest_idle_secs        numeric,
  ADD COLUMN IF NOT EXISTS idle_age_by_application jsonb,
  -- FLIGHT RECORDER: full detail of the top ~25 connections every minute, so an
  -- incident can be reconstructed from the rows LEADING UP TO the wedge without
  -- any live access (which is impossible mid-wedge anyway).
  ADD COLUMN IF NOT EXISTS connections            jsonb,
  ADD COLUMN IF NOT EXISTS by_client_addr         jsonb;

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
    by_application, by_wait_event, oldest_idle_secs, idle_age_by_application,
    connections, by_client_addr
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
       GROUP BY 1 ORDER BY 2 DESC LIMIT 10) t),
    -- NEW: oldest plain-idle connection age (the creep/leak signal).
    COALESCE(max(EXTRACT(EPOCH FROM (now() - state_change))) FILTER (WHERE state = 'idle'), 0),
    -- NEW: per-application OLDEST idle age — names which service holds stale idles.
    (SELECT jsonb_object_agg(app, secs) FROM (
       SELECT coalesce(nullif(application_name, ''), '(unknown)') app,
              round(max(EXTRACT(EPOCH FROM (now() - state_change)))::numeric, 0) secs
       FROM pg_stat_activity
       WHERE state = 'idle' AND pid <> pg_backend_pid()
       GROUP BY 1 ORDER BY 2 DESC LIMIT 15) t),
    -- NEW (flight recorder): top ~25 connections in FULL detail, oldest-idle first
    -- (where a leak shows), then active. Post-incident, read these off the rows
    -- leading up to the wedge to see EXACTLY which connections piled up.
    (SELECT jsonb_agg(c) FROM (
       SELECT a.pid,
              coalesce(nullif(a.application_name, ''), '(unknown)') AS app,
              a.usename::text                                       AS usr,
              coalesce(host(a.client_addr), '(local)')              AS client,
              a.state,
              round(EXTRACT(EPOCH FROM (now() - a.backend_start))::numeric, 0) AS open_s,
              round(EXTRACT(EPOCH FROM (now() - a.state_change))::numeric, 0)  AS idle_s,
              a.wait_event_type AS wait,
              left(a.query, 80) AS q
       FROM pg_stat_activity a
       WHERE a.pid <> pg_backend_pid()
       ORDER BY (a.state = 'idle') DESC, (now() - a.state_change) DESC
       LIMIT 25) c),
    -- NEW: connections per client IP — a single leaking client shows as one IP
    -- holding many connections.
    (SELECT jsonb_object_agg(ca, c) FROM (
       SELECT coalesce(host(client_addr), '(local)') ca, count(*) c
       FROM pg_stat_activity WHERE pid <> pg_backend_pid()
       GROUP BY 1 ORDER BY 2 DESC LIMIT 15) t)
  FROM pg_stat_activity
  WHERE pid <> pg_backend_pid();
EXCEPTION WHEN OTHERS THEN
  NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.capture_db_health() TO service_role;

-- ── 3. Idle-session reaper (the idle TTL) ──────────────────────────────────
-- Close any session that sits IDLE (not in a transaction, not active) longer than
-- 10 minutes. Forgotten/leaked connections die and free their slot; healthy pools
-- (reused within 10min) and realtime streaming (never 'idle') are untouched.
-- Takes effect on connections opened after this runs.
ALTER DATABASE postgres SET idle_session_timeout = '10min';

-- Migration 441: connection-safety hardening (follow-up to the 2026-08-20 DB audit).
--
-- The audit RE-CONFIRMED there is no code-level connection leak (idle_in_transaction
-- stays 0; the backend is 100% PostgREST; only txn-scoped advisory locks; every
-- 1-min cron dispatches via async pg_net). These three fixes are cheap latent
-- hardening the audit surfaced — none was the cause of any incident.
--
-- Apply in the Supabase dashboard SQL editor. Re-runnable.
-- NOTE: statements 1-2 are fine inside the editor's implicit transaction. The new
-- prune PROCEDURE uses COMMIT internally, so do NOT wrap a manual `CALL` of it in a
-- transaction (the daily cron calls it top-level, which is correct).

-- ── 1. Remove a dead cron job ──────────────────────────────────────────────
-- `refresh_rank_thresholds()` was dropped via CASCADE in migration 076, but
-- CASCADE does NOT remove a pg_cron schedule — the job string still fires hourly
-- and errors ("function does not exist"), polluting cron.job_run_details. Harmless
-- but pointless; unschedule it explicitly. (Idempotent.)
SELECT cron.unschedule('refresh-rank-thresholds')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'refresh-rank-thresholds');

-- ── 2. Idle-in-transaction backstop on the APP roles ───────────────────────
-- Migration 381 set idle_session_timeout=10min (reaps forgotten plain-idle
-- sessions). There is no idle_in_transaction guard. Nothing legitimate holds a
-- transaction open+idle (forensics show idle_in_transaction≈0), so this is pure
-- insurance against a FUTURE app-side hung-transaction amplifier: an app session
-- that sits idle MID-TRANSACTION longer than 5min is terminated, freeing its slot
-- + any locks it holds. Takes effect on sessions opened after this runs.
--
-- Scoped to the three APP roles (not ALTER DATABASE) on purpose: it targets exactly
-- the edge-function / PostgREST connections where a hung transaction could originate,
-- and never touches postgres/supabase_admin dashboard+migration sessions or the
-- realtime replication stream. Per-STATEMENT timeouts are left to PostgREST's own
-- db-statement-timeout (dashboard → Settings → API) so we don't loosen a role default.
ALTER ROLE authenticated SET idle_in_transaction_session_timeout = '5min';
ALTER ROLE anon          SET idle_in_transaction_session_timeout = '5min';
ALTER ROLE service_role  SET idle_in_transaction_session_timeout = '5min';

-- ── 3. Batched, lock-friendly observability prune ──────────────────────────
-- The old prune_observability_logs() (migration 274) did unbounded single
-- DELETEs on the HOT ai_generation_log (one row per generation). Normally fine
-- (the daily run keeps it small), but if the cron ever lapsed, the next DELETE
-- would do a long scan holding row/page locks on a high-write table and stall
-- renders. Rewrite as a PROCEDURE that deletes in 5k-row batches with a COMMIT
-- between each: locks are never held longer than one batch, and it always makes
-- forward progress even against a large backlog.
--
-- SECURITY INVOKER (no SET clause) is required — a procedure with a SET clause
-- cannot run COMMIT. All objects are fully-qualified, and there's no privilege
-- escalation (runs as the caller: the cron job owner, or service_role manually).
DROP FUNCTION IF EXISTS public.prune_observability_logs(integer);

CREATE OR REPLACE PROCEDURE public.prune_observability_logs(p_days integer DEFAULT 30)
LANGUAGE plpgsql
AS $$
DECLARE
  v_cutoff timestamptz := now() - make_interval(days => greatest(p_days, 1));
  v_batch  bigint;
  v_ai     bigint := 0;
  v_queue  bigint := 0;
  v_jobs   bigint := 0;
BEGIN
  -- ai_generation_log — the hot table. Batch + COMMIT per 5k rows.
  LOOP
    DELETE FROM public.ai_generation_log
     WHERE ctid IN (
       SELECT ctid FROM public.ai_generation_log
        WHERE created_at < v_cutoff
        LIMIT 5000
     );
    GET DIAGNOSTICS v_batch = ROW_COUNT;
    v_ai := v_ai + v_batch;
    COMMIT;
    EXIT WHEN v_batch = 0;
  END LOOP;

  -- dream_queue — TERMINAL rows only (never queued/in_progress: an in-flight or
  -- genuinely stuck job must stay visible).
  LOOP
    DELETE FROM public.dream_queue
     WHERE ctid IN (
       SELECT ctid FROM public.dream_queue
        WHERE status IN ('completed', 'dead_letter', 'failed') AND created_at < v_cutoff
        LIMIT 5000
     );
    GET DIAGNOSTICS v_batch = ROW_COUNT;
    v_queue := v_queue + v_batch;
    COMMIT;
    EXIT WHEN v_batch = 0;
  END LOOP;

  -- dream_jobs — TERMINAL rows only (never 'processing').
  LOOP
    DELETE FROM public.dream_jobs
     WHERE ctid IN (
       SELECT ctid FROM public.dream_jobs
        WHERE status IN ('done', 'failed', 'nsfw', 'timeout') AND created_at < v_cutoff
        LIMIT 5000
     );
    GET DIAGNOSTICS v_batch = ROW_COUNT;
    v_jobs := v_jobs + v_batch;
    COMMIT;
    EXIT WHEN v_batch = 0;
  END LOOP;

  RAISE NOTICE 'prune_observability_logs: ai_generation_log=% dream_queue=% dream_jobs=%',
    v_ai, v_queue, v_jobs;
END;
$$;

REVOKE EXECUTE ON PROCEDURE public.prune_observability_logs(integer) FROM PUBLIC;
GRANT EXECUTE ON PROCEDURE public.prune_observability_logs(integer) TO service_role;

-- Reschedule the daily prune to CALL the procedure (procedures need CALL, not
-- SELECT). 04:17 UTC, off-peak. Idempotent.
SELECT cron.unschedule('prune-observability-logs')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'prune-observability-logs');

SELECT cron.schedule(
  'prune-observability-logs',
  '17 4 * * *',
  $$ CALL public.prune_observability_logs(30) $$
);

-- No immediate run here: the existing daily cron has kept these tables pruned, so
-- there is no backlog to clear. To run one manually (OUTSIDE a transaction):
--   CALL public.prune_observability_logs(30);

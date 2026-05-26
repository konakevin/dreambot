-- 192_dream_queue_nightly_scaling.sql
--
-- Scale nightly dreams onto the async queue with fan-out workers.
--
--   1. dedup_key — a deterministic per-source-per-day idempotency key so a
--      duplicate enqueue (a re-run, an overlapping cron tick, a workflow_dispatch)
--      hard-fails at the DB instead of producing a second nightly dream. The
--      enqueuer sets it, e.g. 'nightly:<user_id>:<YYYY-MM-DD-UTC>'. NULL for
--      sources that don't want daily dedup (first_dream / create / dlt), so the
--      partial unique index ignores them.
--
--   2. claim_dream_queue_jobs(p_worker_id, p_limit) — batch sibling of the
--      single-row claim_dream_queue_job (migration 158). Atomically claims up to
--      p_limit queued+due jobs via SELECT FOR UPDATE SKIP LOCKED so the fan-out
--      dispatcher can kick off many parallel renders per tick. Concurrency-safe:
--      overlapping dispatcher ticks never claim the same row.

-- ── 1. Per-day nightly idempotency ─────────────────────────────────────────
ALTER TABLE public.dream_queue
  ADD COLUMN IF NOT EXISTS dedup_key text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dream_queue_dedup
  ON public.dream_queue (dedup_key)
  WHERE dedup_key IS NOT NULL;

COMMENT ON COLUMN public.dream_queue.dedup_key IS
  'Optional idempotency key, unique when set. Enqueuer format e.g. nightly:<user_id>:<UTC-date>. Prevents duplicate nightly jobs per user per day; NULL skips dedup.';

-- ── 2. Batch claim for fan-out dispatch ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.claim_dream_queue_jobs(
  p_worker_id text,
  p_limit integer DEFAULT 10
)
RETURNS SETOF public.dream_queue
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH claimed AS (
    SELECT dq.id
    FROM public.dream_queue dq
    WHERE dq.status = 'queued'
      AND dq.created_at <= now()          -- created_at carries backoff delay on retry
    ORDER BY dq.created_at
    LIMIT GREATEST(p_limit, 0)
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.dream_queue dq
  SET status = 'in_progress',
      started_at = now(),
      worker_id = p_worker_id
  FROM claimed
  WHERE dq.id = claimed.id
  RETURNING dq.*;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_dream_queue_jobs(text, integer) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_dream_queue_jobs(text, integer) TO service_role;

COMMENT ON FUNCTION public.claim_dream_queue_jobs(text, integer) IS
  'Batch-claims up to p_limit queued+due jobs (SELECT FOR UPDATE SKIP LOCKED), marking them in_progress. Used by the fan-out dream-queue-worker dispatcher. Service-role only.';

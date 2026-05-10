-- 158 — claim_dream_queue_job stored procedure
--
-- Atomic single-job claim for the dream-queue-worker. Uses
-- SELECT ... FOR UPDATE SKIP LOCKED so multiple worker isolates can run
-- concurrently without claim conflicts.
--
-- Returns the claimed row (or NULL if no queued jobs available). The row's
-- status is set to 'in_progress', started_at to now(), worker_id to the
-- caller's identifier — all in one transaction.
--
-- Service-role-only: function uses SECURITY DEFINER on the table owner.

CREATE OR REPLACE FUNCTION public.claim_dream_queue_job(p_worker_id text)
RETURNS public.dream_queue
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claimed public.dream_queue;
BEGIN
  -- The CTE picks one queued row with the oldest created_at and locks it.
  -- SKIP LOCKED means concurrent workers see the next available row, not
  -- a contention error. Only consider rows whose created_at <= now() so
  -- backoff-delayed retries are gated naturally.
  WITH next_job AS (
    SELECT id
    FROM public.dream_queue
    WHERE status = 'queued'
      AND created_at <= now()
    ORDER BY created_at
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.dream_queue dq
  SET status = 'in_progress',
      started_at = now(),
      worker_id = p_worker_id
  FROM next_job
  WHERE dq.id = next_job.id
  RETURNING dq.* INTO claimed;

  RETURN claimed;
END;
$$;

-- Service role can execute. Other roles cannot.
REVOKE ALL ON FUNCTION public.claim_dream_queue_job(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_dream_queue_job(text) TO service_role;

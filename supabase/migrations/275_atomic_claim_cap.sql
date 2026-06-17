-- Migration 275: make the per-weight concurrency cap ATOMIC inside the claim RPC.
--
-- Before: the worker did `count in_progress` → compute headroom → `claim` as
-- THREE separate steps. Two concurrent invokers (pg_cron tick + enqueue kick +
-- the new GitHub-Actions sync backstop) could each read the same headroom before
-- either flipped rows to in_progress, then each claim up to it → OVERSHOOT the
-- heavy cap → Fly.io dual-swap exhaustion (the exact thing the cap prevents).
--
-- After: claim_dream_queue_jobs_by_weight reads the cap from engine_config,
-- counts in_progress, and claims LEAST(p_limit, cap - in_progress) — all in one
-- transaction, serialized per-weight by a transaction-scoped advisory lock so
-- concurrent invokers can never collectively exceed the cap. The lock is held
-- only for the (millisecond) claim, not the render, so throughput is unaffected;
-- light and heavy use different lock keys so they never block each other.
--
-- Signature unchanged → CREATE OR REPLACE is safe. The worker can now pass its
-- per-tick limit (MAX_JOBS_PER_TICK) and trust the RPC to enforce the real cap.

CREATE OR REPLACE FUNCTION public.claim_dream_queue_jobs_by_weight(
  p_worker_id text,
  p_weight text,
  p_limit integer DEFAULT 10
)
RETURNS SETOF public.dream_queue
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cap integer;
  v_inflight integer;
  v_limit integer;
BEGIN
  -- Serialize claims for THIS weight so concurrent invokers can't both read the
  -- same headroom and overshoot. Transaction-scoped (auto-released at function
  -- end); the claim is milliseconds, so this barely serializes and never blocks
  -- the long renders (which run AFTER this returns). Distinct key per weight →
  -- light + heavy claims proceed independently.
  PERFORM pg_advisory_xact_lock(hashtext('dream_queue_claim_' || p_weight));

  -- Per-weight cap from engine_config, with the same code fallbacks the worker
  -- uses (light 40 / heavy 10) so a missing row never unbounds the claim.
  SELECT CASE
           WHEN p_weight = 'heavy' THEN COALESCE(dream_queue_max_concurrent_heavy, 10)
           ELSE COALESCE(dream_queue_max_concurrent, 40)
         END
    INTO v_cap
  FROM public.engine_config
  WHERE id = 1;
  IF v_cap IS NULL THEN
    v_cap := CASE WHEN p_weight = 'heavy' THEN 10 ELSE 40 END;
  END IF;

  SELECT count(*)
    INTO v_inflight
  FROM public.dream_queue
  WHERE status = 'in_progress' AND weight = p_weight;

  v_limit := LEAST(GREATEST(p_limit, 0), GREATEST(v_cap - v_inflight, 0));
  IF v_limit = 0 THEN
    RETURN; -- at/over cap → claim nothing (jobs wait; never fail)
  END IF;

  RETURN QUERY
  WITH claimed AS (
    SELECT dq.id
    FROM public.dream_queue dq
    WHERE dq.status = 'queued'
      AND dq.weight = p_weight
      AND dq.created_at <= now()
    ORDER BY dq.created_at
    LIMIT v_limit
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

REVOKE ALL ON FUNCTION public.claim_dream_queue_jobs_by_weight(text, text, integer)
  FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_dream_queue_jobs_by_weight(text, text, integer)
  TO service_role;

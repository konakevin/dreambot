-- Migration 265: per-WEIGHT concurrency caps for the dream_queue worker.
--
-- A single global cap throttles everything to the slowest path's safe limit:
-- dual face-swaps overwhelm the Fly.io swap service past ~15 concurrent, but
-- text dreams (no swap, ~3× faster, no Fly.io dependency) can safely run much
-- wider. Splitting the cap by weight lets LIGHT (text) dreams fly at a high cap
-- while HEAVY (face-swap / dual) dreams stay bounded.
--
--   weight column on dream_queue  — 'light' | 'heavy', set at enqueue.
--   dream_queue_max_concurrent        — the LIGHT cap (text). Default 40.
--   dream_queue_max_concurrent_heavy  — the HEAVY cap (face-swap). Default 15.
--   claim_dream_queue_jobs_by_weight  — weight-filtered SKIP-LOCKED claim.
--
-- Default weight is 'heavy' (conservative — an unclassified job is treated as
-- swap-heavy so it can never flood the Fly.io service). Nightly inserts no
-- weight, so its rows default to 'heavy' (correct — nightly does face swaps).

-- ── 1. weight column ──────────────────────────────────────────────────────
ALTER TABLE public.dream_queue
  ADD COLUMN IF NOT EXISTS weight text NOT NULL DEFAULT 'heavy'
    CHECK (weight IN ('light', 'heavy'));

-- Claim index already covers (created_at) WHERE status in queued/in_progress;
-- add weight so the by-weight claim stays index-only.
CREATE INDEX IF NOT EXISTS idx_dream_queue_pending_weight
  ON public.dream_queue (weight, created_at)
  WHERE status IN ('queued', 'in_progress');

-- ── 2. per-weight caps on engine_config ───────────────────────────────────
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dream_queue_max_concurrent_heavy integer NOT NULL DEFAULT 15;

-- Repurpose dream_queue_max_concurrent as the LIGHT cap; restore it to 40
-- (it was temporarily lowered to 15 as the global cap during load testing).
UPDATE public.engine_config SET dream_queue_max_concurrent = 40 WHERE id = 1;

COMMENT ON COLUMN public.engine_config.dream_queue_max_concurrent IS
  'LIGHT (text, no-swap) render concurrency cap. Light dreams are fast + have no Fly.io dependency, so this can run wide.';
COMMENT ON COLUMN public.engine_config.dream_queue_max_concurrent_heavy IS
  'HEAVY (face-swap / dual) render concurrency cap. Bounded by the Fly.io dual-swap service capacity.';

-- ── 3. weight-filtered claim RPC ──────────────────────────────────────────
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
BEGIN
  RETURN QUERY
  WITH claimed AS (
    SELECT dq.id
    FROM public.dream_queue dq
    WHERE dq.status = 'queued'
      AND dq.weight = p_weight
      AND dq.created_at <= now()
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

REVOKE ALL ON FUNCTION public.claim_dream_queue_jobs_by_weight(text, text, integer)
  FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_dream_queue_jobs_by_weight(text, text, integer)
  TO service_role;

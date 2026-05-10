-- Paste this entire block into the Supabase SQL Editor
-- Dashboard → SQL → New Query → paste → Run
-- Combines migrations 141 (missed earlier), 156, 157 (in 156), and 158.

-- ===================== 141: uploads.first_dream flag (was missed) =====================
-- Adds the per-render "first_dream" flag so the engine can mark and query
-- first-dream renders. Was supposed to ship with the abandoned 33-cell
-- engine but was never actually applied to prod. The Edge Functions try
-- to insert with first_dream:true and fail silently (in old sync path)
-- or loudly (in new queue path).

ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS first_dream boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_uploads_first_dream
  ON public.uploads (first_dream)
  WHERE first_dream = true;

-- Force PostgREST to reload its schema cache so the column shows up
-- immediately in API queries.
NOTIFY pgrst, 'reload schema';

-- ===================== 156: dream_queue table =====================

CREATE TABLE public.dream_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('first_dream', 'nightly', 'create', 'dlt')),
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'in_progress', 'completed', 'failed', 'dead_letter')),
  attempt_count integer NOT NULL DEFAULT 0,
  upload_id uuid REFERENCES public.uploads (id) ON DELETE SET NULL,
  worker_id text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

CREATE INDEX idx_dream_queue_pending
  ON public.dream_queue (created_at)
  WHERE status IN ('queued', 'in_progress');

CREATE INDEX idx_dream_queue_user_status
  ON public.dream_queue (user_id, status, created_at DESC);

CREATE INDEX idx_dream_queue_stale
  ON public.dream_queue (started_at)
  WHERE status = 'in_progress';

CREATE INDEX idx_dream_queue_dead_letter
  ON public.dream_queue (created_at DESC)
  WHERE status = 'dead_letter';

ALTER TABLE public.dream_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read their own dream_queue rows"
  ON public.dream_queue
  FOR SELECT
  USING (user_id = auth.uid());

ALTER PUBLICATION supabase_realtime ADD TABLE public.dream_queue;

-- ===================== 158: claim_dream_queue_job RPC =====================

CREATE OR REPLACE FUNCTION public.claim_dream_queue_job(p_worker_id text)
RETURNS public.dream_queue
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claimed public.dream_queue;
BEGIN
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

REVOKE ALL ON FUNCTION public.claim_dream_queue_job(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_dream_queue_job(text) TO service_role;

-- Migration 134: refund_sparkles RPC + dream_jobs.timeout status + dream_failed notification type
--
-- Introduces an idempotent refund path tied to a job/upload reference. Today
-- refunds reuse `grant_sparkles` with reason='nsfw_refund' but that RPC has
-- no reference_id parameter, so refunds can't be matched back to the failed
-- job. This migration:
--   1. Adds `refund_sparkles(uuid, int, text, uuid) → boolean` with
--      idempotency on (user_id, reason LIKE 'refund:%', reference_id).
--   2. Adds an index on sparkle_transactions(reference_id) for the lookup.
--   3. Extends dream_jobs.status to include 'timeout' (sweeper marker) and
--      'queued' (legacy state name).
--   4. Adds 'dream_failed' to the notifications type CHECK constraint.

-- 1. Index for fast idempotency check
CREATE INDEX IF NOT EXISTS idx_sparkle_tx_reference
  ON public.sparkle_transactions(user_id, reference_id)
  WHERE reference_id IS NOT NULL;

-- 2. Idempotent refund RPC
-- Returns true if a refund was issued, false if a prior refund for the same
-- reference_id already exists. Caller can ignore the boolean — both outcomes
-- are "refund applied" from the user's perspective.
CREATE OR REPLACE FUNCTION public.refund_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing integer;
BEGIN
  -- Idempotency: skip if we already refunded this job
  SELECT count(*) INTO v_existing
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id
    AND reference_id = p_reference_id
    AND reason LIKE 'refund:%';

  IF v_existing > 0 THEN
    RETURN false;
  END IF;

  -- Lock the user row so balance update + transaction insert are atomic
  PERFORM 1 FROM public.users WHERE id = p_user_id FOR UPDATE;

  UPDATE public.users
    SET sparkle_balance = sparkle_balance + p_amount
    WHERE id = p_user_id;

  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id)
    VALUES (p_user_id, p_amount, p_reason, p_reference_id);

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refund_sparkles(uuid, integer, text, uuid) TO authenticated, service_role;

-- 3. dream_jobs.status — add 'timeout' (used by refund-stuck-jobs sweeper)
-- Existing constraint (migration 095): CHECK (status IN ('processing','done','failed','nsfw')).
ALTER TABLE public.dream_jobs DROP CONSTRAINT IF EXISTS dream_jobs_status_check;
ALTER TABLE public.dream_jobs ADD CONSTRAINT dream_jobs_status_check
  CHECK (status IN ('queued', 'processing', 'done', 'failed', 'nsfw', 'timeout'));

-- 4. notifications.type — add 'dream_failed'
-- Existing constraint (migration 076) enumerates allowed types. Replace.
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'dream_failed',
    'post_like', 'post_fuse', 'post_twin',
    'post_milestone', 'comment'  -- legacy types kept for old rows
  ));

COMMENT ON FUNCTION public.refund_sparkles IS
  'Idempotent refund. Returns true if refund issued, false if a refund already exists for this reference_id. Used by generate-dream and restyle-photo on hard failures, and by refund-stuck-jobs sweeper for HTTP 546 / timeout cases.';

-- Migration 183: refund_sparkles refunds the ACTUAL recorded spend
--
-- Previously refund_sparkles refunded a caller-supplied p_amount (hardcoded to
-- 1 in generate-dream / restyle-photo / refund-stuck-jobs). So a dream charged
-- 2/3/5 sparkles with an advanced model only ever got 1 sparkle back on
-- failure — the user was silently short-changed.
--
-- Foolproof fix: derive the refund from the original debit(s) recorded under
-- the same reference_id (the jobId). The debit is the single source of truth
-- for what the user actually paid, so the refund always matches the charge —
-- regardless of which model was used, future sparkle-cost changes, or a stale
-- client bundle pricing a model differently than the server. p_amount becomes
-- a fallback, used only when no debit is recorded for the reference_id.
--
-- Signature is unchanged (uuid, integer, text, uuid) so every existing caller
-- becomes correct with no code change and no type regen.

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
  v_spent integer;
  v_refund integer;
BEGIN
  -- Idempotency: skip if we already refunded this reference_id.
  SELECT count(*) INTO v_existing
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id
    AND reference_id = p_reference_id
    AND reason LIKE 'refund:%';

  IF v_existing > 0 THEN
    RETURN false;
  END IF;

  -- Authoritative amount = total actually debited under this reference_id.
  -- Spends are stored as negative rows; refunds/grants are positive and thus
  -- excluded by amount < 0. SUM over zero rows is NULL → treated as "no debit".
  SELECT -COALESCE(SUM(amount), 0) INTO v_spent
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id
    AND reference_id = p_reference_id
    AND amount < 0;

  -- Use the recorded spend when present; otherwise fall back to p_amount.
  v_refund := GREATEST(COALESCE(NULLIF(v_spent, 0), p_amount), 0);

  IF v_refund <= 0 THEN
    RETURN false;
  END IF;

  -- Lock the user row so balance update + transaction insert are atomic.
  PERFORM 1 FROM public.users WHERE id = p_user_id FOR UPDATE;

  UPDATE public.users
    SET sparkle_balance = sparkle_balance + v_refund
    WHERE id = p_user_id;

  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id)
    VALUES (p_user_id, v_refund, p_reason, p_reference_id);

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refund_sparkles(uuid, integer, text, uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.refund_sparkles IS
  'Idempotent refund. Refunds the actual amount debited under p_reference_id (the original dream spend), so refunds always match the charge regardless of model or pricing changes. p_amount is a fallback used only when no debit is recorded for the reference_id. Returns true if a refund was issued, false if one already exists or there is nothing to refund.';

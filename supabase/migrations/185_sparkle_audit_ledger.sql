-- Migration 185: make sparkle_transactions a fully auditable ledger
--
-- For auditing a user's sparkle history we need, per row, the resulting balance
-- (not just the delta) so the ledger is self-verifying and out-of-band changes
-- are detectable. Today sparkle_transactions records (amount, reason,
-- reference_id) but NOT the balance after the change.
--
-- This migration:
--   1. Adds sparkle_transactions.balance_after (nullable; old rows stay NULL).
--   2. Updates EVERY economy RPC (charge / refund / spend / grant) to record
--      balance_after, so every future balance change is snapshotted in the
--      ledger.
--   3. Adds reconcile_sparkles(user) — an audit/drift check comparing the
--      current users.sparkle_balance against the most recent recorded
--      balance_after. A non-zero drift means a balance change bypassed the
--      ledger (a bug or manual edit) — exactly what an audit needs to surface.

ALTER TABLE public.sparkle_transactions
  ADD COLUMN IF NOT EXISTS balance_after integer;

COMMENT ON COLUMN public.sparkle_transactions.balance_after IS
  'User sparkle_balance immediately after this transaction. NULL for rows written before migration 185. Lets the ledger be audited/reconciled without re-summing.';

-- ── charge_sparkles (idempotent dream charge) — now records balance_after ──
CREATE OR REPLACE FUNCTION public.charge_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid
)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_existing integer;
  v_balance integer;
  v_after integer;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot charge sparkles for a different user';
  END IF;
  IF p_reference_id IS NULL THEN
    RAISE EXCEPTION 'charge_sparkles requires a reference_id for idempotency';
  END IF;
  IF p_amount <= 0 THEN
    RETURN 'charged';
  END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  SELECT sparkle_balance INTO v_balance FROM public.users WHERE id = p_user_id FOR UPDATE;

  SELECT count(*) INTO v_existing
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id AND reference_id = p_reference_id AND amount < 0;
  IF v_existing > 0 THEN
    RETURN 'already_charged';
  END IF;

  IF v_balance < p_amount THEN
    RETURN 'insufficient';
  END IF;

  UPDATE public.users SET sparkle_balance = sparkle_balance - p_amount
    WHERE id = p_user_id RETURNING sparkle_balance INTO v_after;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
    VALUES (p_user_id, -p_amount, p_reason, p_reference_id, v_after);

  RETURN 'charged';
END;
$$;

-- ── refund_sparkles (refund the actual debit) — now records balance_after ──
CREATE OR REPLACE FUNCTION public.refund_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_existing integer;
  v_spent integer;
  v_refund integer;
  v_after integer;
BEGIN
  SELECT count(*) INTO v_existing
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id AND reference_id = p_reference_id AND reason LIKE 'refund:%';
  IF v_existing > 0 THEN
    RETURN false;
  END IF;

  SELECT -COALESCE(SUM(amount), 0) INTO v_spent
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id AND reference_id = p_reference_id AND amount < 0;

  v_refund := GREATEST(COALESCE(NULLIF(v_spent, 0), p_amount), 0);
  IF v_refund <= 0 THEN
    RETURN false;
  END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  PERFORM 1 FROM public.users WHERE id = p_user_id FOR UPDATE;
  UPDATE public.users SET sparkle_balance = sparkle_balance + v_refund
    WHERE id = p_user_id RETURNING sparkle_balance INTO v_after;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
    VALUES (p_user_id, v_refund, p_reason, p_reference_id, v_after);

  RETURN true;
END;
$$;

-- ── spend_sparkles — now records balance_after ────────────────────────────
CREATE OR REPLACE FUNCTION public.spend_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_balance integer;
  v_after integer;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot spend sparkles for a different user';
  END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  SELECT sparkle_balance INTO v_balance FROM public.users WHERE id = p_user_id FOR UPDATE;
  IF v_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE public.users SET sparkle_balance = sparkle_balance - p_amount
    WHERE id = p_user_id RETURNING sparkle_balance INTO v_after;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
    VALUES (p_user_id, -p_amount, p_reason, p_reference_id, v_after);

  RETURN true;
END;
$$;

-- ── grant_sparkles — now records balance_after ────────────────────────────
CREATE OR REPLACE FUNCTION public.grant_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_is_service_role boolean := current_setting('role', true) = 'service_role';
  v_existing integer;
  v_after integer;
BEGIN
  IF NOT v_is_service_role THEN
    IF p_user_id IS DISTINCT FROM auth.uid() THEN
      RAISE EXCEPTION 'Unauthorized: cannot grant sparkles to a different user';
    END IF;
    IF p_reason <> 'welcome_bonus' THEN
      RAISE EXCEPTION 'Unauthorized: only welcome_bonus may be granted by clients';
    END IF;
    IF p_amount <> 25 THEN
      RAISE EXCEPTION 'Unauthorized: welcome_bonus is fixed at 25 sparkles';
    END IF;
    SELECT count(*) INTO v_existing
    FROM public.sparkle_transactions
    WHERE user_id = p_user_id AND reason = 'welcome_bonus';
    IF v_existing > 0 THEN
      RETURN;
    END IF;
  END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  UPDATE public.users SET sparkle_balance = sparkle_balance + p_amount
    WHERE id = p_user_id RETURNING sparkle_balance INTO v_after;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, balance_after)
    VALUES (p_user_id, p_amount, p_reason, v_after);
END;
$$;

GRANT EXECUTE ON FUNCTION public.charge_sparkles(uuid, integer, text, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.refund_sparkles(uuid, integer, text, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.spend_sparkles(uuid, integer, text, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.grant_sparkles(uuid, integer, text) TO authenticated, service_role;

-- ── reconcile_sparkles — audit / drift detection ──────────────────────────
-- Compares the current balance against the most recent recorded balance_after.
-- drift = 0 → every balance change went through the ledger (healthy).
-- drift <> 0 → a change bypassed the ledger (manual edit / bug) — investigate.
-- Service-role / admin only (it reads another user's economic state).
CREATE OR REPLACE FUNCTION public.reconcile_sparkles(p_user_id uuid)
RETURNS TABLE (
  current_balance integer,
  last_recorded_balance integer,
  drift integer,
  ledger_sum bigint,
  tx_count bigint,
  last_tx_at timestamptz
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  IF current_setting('role', true) <> 'service_role' THEN
    SELECT COALESCE(is_admin, false) INTO v_is_admin FROM public.users WHERE id = auth.uid();
    IF NOT COALESCE(v_is_admin, false) THEN
      RAISE EXCEPTION 'Unauthorized: reconcile_sparkles is admin/service only';
    END IF;
  END IF;

  RETURN QUERY
  WITH last_tx AS (
    SELECT balance_after, created_at
    FROM public.sparkle_transactions
    WHERE user_id = p_user_id AND balance_after IS NOT NULL
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  )
  SELECT
    u.sparkle_balance AS current_balance,
    lt.balance_after AS last_recorded_balance,
    u.sparkle_balance - lt.balance_after AS drift,
    (SELECT COALESCE(SUM(amount), 0) FROM public.sparkle_transactions WHERE user_id = p_user_id) AS ledger_sum,
    (SELECT count(*) FROM public.sparkle_transactions WHERE user_id = p_user_id) AS tx_count,
    lt.created_at AS last_tx_at
  FROM public.users u
  LEFT JOIN last_tx lt ON true
  WHERE u.id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reconcile_sparkles(uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.reconcile_sparkles IS
  'Audit helper. Returns current balance vs the last recorded balance_after; drift <> 0 means a balance change bypassed the economy RPCs. Admin/service only.';

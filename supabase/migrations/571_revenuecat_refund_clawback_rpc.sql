-- 571_revenuecat_refund_clawback_rpc.sql — make the store-refund sparkle clawback atomic and
-- idempotent (2026-09-27, iOS-benefits list from the Android audit; PORT_TO_ANDROID.md C-5).
--
-- Before: revenuecat-webhook looked for a prior clawback and for the original grant WITHOUT
-- checking errors, then called grant_sparkles(-amount). A failed lookup read as "no grant" →
-- 0 sparkles clawed back and a 200 (RevenueCat never retries); two concurrent deliveries of the
-- same refund could both pass the "already refunded?" check; no unique index covered
-- 'refund:*' reasons (ux_sparkle_tx_grant_reason covers purchase:/pro_bundle:/basic_bundle:
-- only, and the reference_id indexes don't apply — these rows carry no reference_id).
--
-- After: ONE service-role function does the whole clawback under the user's row lock:
--   already_refunded → no-op; no positive original grant → no_grant; else deduct exactly the
--   granted amount and write the 'refund:<original reason>' ledger row. A partial UNIQUE index
--   on (user_id, reason) for those refund reasons makes a double clawback impossible even if
--   two calls race past the lock. The webhook returns 500 on any error so RevenueCat retries.
-- Live check before this migration: 0 existing 'refund:purchase|pro_bundle|basic_bundle' rows.

CREATE UNIQUE INDEX IF NOT EXISTS ux_sparkle_tx_refund_reason
  ON public.sparkle_transactions (user_id, reason)
  WHERE reason LIKE 'refund:purchase:%'
     OR reason LIKE 'refund:pro_bundle:%'
     OR reason LIKE 'refund:basic_bundle:%';

CREATE OR REPLACE FUNCTION public.revenuecat_refund_clawback(
  p_user_id uuid,
  p_original_reason text
)
RETURNS TABLE (outcome text, amount integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
#variable_conflict use_column
DECLARE
  v_refund_reason text;
  v_grant integer;
  v_after integer;
BEGIN
  IF current_setting('role', true) IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'revenuecat_refund_clawback is server-only';
  END IF;
  IF p_user_id IS NULL
     OR p_original_reason IS NULL
     OR NOT (
       p_original_reason LIKE 'purchase:%'
       OR p_original_reason LIKE 'pro_bundle:%'
       OR p_original_reason LIKE 'basic_bundle:%'
     ) THEN
    RAISE EXCEPTION 'revenuecat_refund_clawback: unsupported reason %', p_original_reason;
  END IF;
  v_refund_reason := 'refund:' || p_original_reason;

  -- Serialize with every other balance write for this user (grants and charges lock the same
  -- row), and let this function write sparkle_balance past the users freeze trigger.
  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  PERFORM 1 FROM public.users u WHERE u.id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN QUERY SELECT 'no_user'::text, 0;
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.sparkle_transactions t
    WHERE t.user_id = p_user_id AND t.reason = v_refund_reason
  ) THEN
    RETURN QUERY SELECT 'already_refunded'::text, 0;
    RETURN;
  END IF;

  SELECT t.amount INTO v_grant
  FROM public.sparkle_transactions t
  WHERE t.user_id = p_user_id AND t.reason = p_original_reason AND t.amount > 0
  ORDER BY t.created_at
  LIMIT 1;
  IF v_grant IS NULL THEN
    RETURN QUERY SELECT 'no_grant'::text, 0;
    RETURN;
  END IF;

  -- The balance may go negative (the refunded sparkles may already be spent); spends are
  -- refused while balance < cost, so the hole can't deepen. Same behaviour as before.
  UPDATE public.users u SET sparkle_balance = u.sparkle_balance - v_grant
  WHERE u.id = p_user_id
  RETURNING u.sparkle_balance INTO v_after;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
  VALUES (p_user_id, -v_grant, v_refund_reason, NULL, v_after);

  RETURN QUERY SELECT 'clawed_back'::text, v_grant;
END;
$$;

-- Server-only (the default since migration 567; stated so this file is the record).
REVOKE ALL ON FUNCTION public.revenuecat_refund_clawback(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.revenuecat_refund_clawback(uuid, text) TO service_role;

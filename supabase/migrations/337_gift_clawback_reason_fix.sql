-- 337: Gift Sparkles clawback-reason fix (follow-up to 334)
--
-- revenuecat-webhook ALREADY claws back Apple refunds (CANCELLATION +
-- CUSTOMER_SUPPORT) via grant_sparkles with reason 'refund:purchase:<txid>'.
-- Migration 334's giftable formula subtracted a reason that never existed
-- ('purchase_refund:%'), so refunded purchases would have stayed giftable.
-- Fix both functions to subtract the REAL clawback rows, and drop 334's
-- redundant claw_back_purchase (the webhook path is the single owner).

DROP FUNCTION IF EXISTS public.claw_back_purchase(uuid, text);

CREATE OR REPLACE FUNCTION public.get_giftable_balance()
RETURNS TABLE (balance int, giftable int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.sparkle_balance AS balance,
    GREATEST(0, LEAST(
      u.sparkle_balance,
      COALESCE((SELECT SUM(st.amount)::int FROM sparkle_transactions st
                WHERE st.user_id = u.id AND st.amount > 0
                  AND st.reason LIKE 'purchase:%'), 0)
      - COALESCE((SELECT SUM(-st.amount)::int FROM sparkle_transactions st
                  WHERE st.user_id = u.id AND st.reason = 'gift_sent'), 0)
      - COALESCE((SELECT SUM(-st.amount)::int FROM sparkle_transactions st
                  WHERE st.user_id = u.id AND st.reason LIKE 'refund:purchase:%'), 0)
    )) AS giftable
  FROM public.users u
  WHERE u.id = auth.uid()
$$;

GRANT EXECUTE ON FUNCTION public.get_giftable_balance() TO authenticated;

CREATE OR REPLACE FUNCTION public.gift_sparkles(
  p_recipient    uuid,
  p_amount       int,
  p_message      text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender        uuid := auth.uid();
  v_ref           uuid := COALESCE(p_reference_id, gen_random_uuid());
  v_cfg           record;
  v_recipient_row record;
  v_balance       int;
  v_giftable      int;
  v_sent_today    int;
  v_message       text;
BEGIN
  IF v_sender IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT gifting_enabled, gift_max_per_send, gift_max_per_day, gift_message_max_len
    INTO v_cfg FROM engine_config LIMIT 1;
  IF NOT v_cfg.gifting_enabled THEN
    RETURN 'disabled';
  END IF;

  IF p_amount IS NULL OR p_amount < 1 OR p_amount > v_cfg.gift_max_per_send THEN
    RETURN 'invalid_amount';
  END IF;

  SELECT id, is_bot INTO v_recipient_row FROM users WHERE id = p_recipient;
  IF v_recipient_row.id IS NULL OR v_recipient_row.is_bot OR p_recipient = v_sender THEN
    RETURN 'invalid_recipient';
  END IF;
  IF public.block_exists(v_sender, p_recipient) THEN
    RETURN 'blocked';
  END IF;

  IF EXISTS (SELECT 1 FROM sparkle_transactions
             WHERE user_id = v_sender AND reason = 'gift_sent' AND reference_id = v_ref) THEN
    RETURN 'ok';
  END IF;

  PERFORM 1 FROM users WHERE id IN (v_sender, p_recipient) ORDER BY id FOR UPDATE;

  SELECT sparkle_balance INTO v_balance FROM users WHERE id = v_sender;

  SELECT COALESCE(SUM(-amount), 0)::int INTO v_sent_today
  FROM sparkle_transactions
  WHERE user_id = v_sender AND reason = 'gift_sent'
    AND created_at >= date_trunc('day', now());
  IF v_sent_today + p_amount > v_cfg.gift_max_per_day THEN
    RETURN 'daily_cap';
  END IF;

  SELECT GREATEST(0, LEAST(
    v_balance,
    COALESCE((SELECT SUM(amount)::int FROM sparkle_transactions
              WHERE user_id = v_sender AND amount > 0 AND reason LIKE 'purchase:%'), 0)
    - COALESCE((SELECT SUM(-amount)::int FROM sparkle_transactions
                WHERE user_id = v_sender AND reason = 'gift_sent'), 0)
    - COALESCE((SELECT SUM(-amount)::int FROM sparkle_transactions
                WHERE user_id = v_sender AND reason LIKE 'refund:purchase:%'), 0)
  )) INTO v_giftable;
  IF p_amount > v_giftable THEN
    RETURN 'insufficient_giftable';
  END IF;

  v_message := NULLIF(btrim(left(
    regexp_replace(COALESCE(p_message, ''), '[[:cntrl:]]', ' ', 'g'),
    v_cfg.gift_message_max_len)), '');

  UPDATE users SET sparkle_balance = sparkle_balance - p_amount WHERE id = v_sender
    RETURNING sparkle_balance INTO v_balance;
  INSERT INTO sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
  VALUES (v_sender, -p_amount, 'gift_sent', v_ref, v_balance);

  UPDATE users SET sparkle_balance = sparkle_balance + p_amount WHERE id = p_recipient
    RETURNING sparkle_balance INTO v_balance;
  INSERT INTO sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
  VALUES (p_recipient, p_amount, 'gift_received', v_ref, v_balance);

  INSERT INTO notifications (recipient_id, actor_id, type, subtype, body, reference_id)
  VALUES (p_recipient, v_sender, 'sparkle_gift', 'received', v_message, v_ref);

  RETURN 'ok';
END;
$$;

GRANT EXECUTE ON FUNCTION public.gift_sparkles(uuid, int, text, uuid) TO authenticated;

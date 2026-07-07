-- 334: Gift Sparkles — Phase 1 balance transfer (GIFT_SPARKLES_PLAN.md)
--
-- Provenance rule: only PURCHASED sparkles are giftable (ledger reasons
-- 'purchase:%'), minus gifts already sent and refund clawbacks. Free grants
-- and received gifts are spendable but non-transferable — this kills
-- free-account farming and mule chains by construction.
--
-- Ships with gifting_enabled = false (kill switch): safe to apply any time;
-- the client hides every entry point and the RPC hard-blocks until flipped.

-- ── 1. Config knobs ──────────────────────────────────────────────────────────

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS gifting_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gift_max_per_send int NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS gift_max_per_day int NOT NULL DEFAULT 200,
  ADD COLUMN IF NOT EXISTS gift_message_max_len int NOT NULL DEFAULT 100;

-- ── 2. Notifications: new type + a generic reference column ────────────────

-- reference_id links a notification to a non-upload object (here: the gift's
-- ledger reference), so the unwrap screen can fetch gift details.
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS reference_id uuid;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'follow_request', 'follow_accepted',
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'dream_failed',
    'post_like', 'post_repost',
    'post_milestone', 'comment_like',
    'comment',
    'download_ready',
    'report',
    'sparkle_gift',
    'announcement'
  ));

-- ── 3. Giftable balance ─────────────────────────────────────────────────────

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
                  WHERE st.user_id = u.id AND st.reason LIKE 'purchase_refund:%'), 0)
    )) AS giftable
  FROM public.users u
  WHERE u.id = auth.uid()
$$;

GRANT EXECUTE ON FUNCTION public.get_giftable_balance() TO authenticated;

-- ── 4. gift_sparkles — the atomic transfer ──────────────────────────────────

-- Returns a status string the client maps to friendly copy:
--   'ok' | 'disabled' | 'invalid_amount' | 'invalid_recipient' | 'blocked'
--   | 'daily_cap' | 'insufficient_giftable'
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

  -- Idempotency: a re-send with the same reference is a no-op success
  -- (same discipline as charge_sparkles — double-tap can't double-charge).
  IF EXISTS (SELECT 1 FROM sparkle_transactions
             WHERE user_id = v_sender AND reason = 'gift_sent' AND reference_id = v_ref) THEN
    RETURN 'ok';
  END IF;

  -- Lock BOTH balance rows in deterministic id order (deadlock-safe when two
  -- users gift each other simultaneously).
  PERFORM 1 FROM users WHERE id IN (v_sender, p_recipient) ORDER BY id FOR UPDATE;

  SELECT sparkle_balance INTO v_balance FROM users WHERE id = v_sender;

  -- Daily cap (UTC day, matches ledger timestamps).
  SELECT COALESCE(SUM(-amount), 0)::int INTO v_sent_today
  FROM sparkle_transactions
  WHERE user_id = v_sender AND reason = 'gift_sent'
    AND created_at >= date_trunc('day', now());
  IF v_sent_today + p_amount > v_cfg.gift_max_per_day THEN
    RETURN 'daily_cap';
  END IF;

  -- Provenance: giftable = purchased − gifted-out − clawed-back, capped at
  -- the live balance (negative balances from refund clawback block gifting).
  SELECT GREATEST(0, LEAST(
    v_balance,
    COALESCE((SELECT SUM(amount)::int FROM sparkle_transactions
              WHERE user_id = v_sender AND amount > 0 AND reason LIKE 'purchase:%'), 0)
    - COALESCE((SELECT SUM(-amount)::int FROM sparkle_transactions
                WHERE user_id = v_sender AND reason = 'gift_sent'), 0)
    - COALESCE((SELECT SUM(-amount)::int FROM sparkle_transactions
                WHERE user_id = v_sender AND reason LIKE 'purchase_refund:%'), 0)
  )) INTO v_giftable;
  IF p_amount > v_giftable THEN
    RETURN 'insufficient_giftable';
  END IF;

  -- Sanitize the message: strip control characters (POSIX class — keeps this
  -- file pure ASCII), collapse to plain text, cap length. Displayed as plain
  -- text in the inbox/unwrap; belt-and-suspenders.
  v_message := NULLIF(btrim(left(
    regexp_replace(COALESCE(p_message, ''), '[[:cntrl:]]', ' ', 'g'),
    v_cfg.gift_message_max_len)), '');

  -- Debit sender / credit recipient — one transaction, shared reference.
  UPDATE users SET sparkle_balance = sparkle_balance - p_amount WHERE id = v_sender
    RETURNING sparkle_balance INTO v_balance;
  INSERT INTO sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
  VALUES (v_sender, -p_amount, 'gift_sent', v_ref, v_balance);

  UPDATE users SET sparkle_balance = sparkle_balance + p_amount WHERE id = p_recipient
    RETURNING sparkle_balance INTO v_balance;
  INSERT INTO sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
  VALUES (p_recipient, p_amount, 'gift_received', v_ref, v_balance);

  -- Recipient notification (push rides the notifications INSERT trigger).
  INSERT INTO notifications (recipient_id, actor_id, type, subtype, body, reference_id)
  VALUES (p_recipient, v_sender, 'sparkle_gift', 'received', v_message, v_ref);

  RETURN 'ok';
END;
$$;

GRANT EXECUTE ON FUNCTION public.gift_sparkles(uuid, int, text, uuid) TO authenticated;

-- ── 5. get_gift — unwrap-screen payload ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_gift(p_reference_id uuid)
RETURNS TABLE (
  amount          int,
  sender_id       uuid,
  sender_username text,
  sender_avatar   text,
  message         text,
  created_at      timestamptz,
  thanked         boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    st.amount::int,
    n.actor_id,
    u.username,
    u.avatar_url,
    n.body,
    st.created_at,
    EXISTS (SELECT 1 FROM notifications t
            WHERE t.type = 'sparkle_gift' AND t.subtype = 'thanks'
              AND t.reference_id = p_reference_id) AS thanked
  FROM sparkle_transactions st
  JOIN notifications n
    ON n.reference_id = p_reference_id AND n.type = 'sparkle_gift' AND n.subtype = 'received'
  JOIN users u ON u.id = n.actor_id
  WHERE st.user_id = auth.uid()
    AND st.reason = 'gift_received'
    AND st.reference_id = p_reference_id
$$;

GRANT EXECUTE ON FUNCTION public.get_gift(uuid) TO authenticated;

-- ── 6. thank_gift — one thanks per gift, recipient → sender ─────────────────

CREATE OR REPLACE FUNCTION public.thank_gift(p_reference_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   uuid := auth.uid();
  v_sender uuid;
BEGIN
  -- Caller must be the gift's recipient.
  SELECT n.actor_id INTO v_sender
  FROM notifications n
  WHERE n.reference_id = p_reference_id
    AND n.type = 'sparkle_gift' AND n.subtype = 'received'
    AND n.recipient_id = v_user;
  IF v_sender IS NULL THEN
    RETURN 'not_found';
  END IF;
  IF EXISTS (SELECT 1 FROM notifications
             WHERE type = 'sparkle_gift' AND subtype = 'thanks'
               AND reference_id = p_reference_id) THEN
    RETURN 'ok';
  END IF;
  INSERT INTO notifications (recipient_id, actor_id, type, subtype, reference_id)
  VALUES (v_sender, v_user, 'sparkle_gift', 'thanks', p_reference_id);
  RETURN 'ok';
END;
$$;

GRANT EXECUTE ON FUNCTION public.thank_gift(uuid) TO authenticated;

-- ── 7. Refund clawback (called by revenuecat-webhook on REFUND events) ──────

-- Negates the original 'purchase:<txn>' grant. Idempotent per transaction id.
-- Deliberately allows the balance to go NEGATIVE — that's the abuse deterrent
-- (buy → gift → refund leaves the refunder owing, and a negative balance
-- blocks both gifting and rendering).
CREATE OR REPLACE FUNCTION public.claw_back_purchase(p_user uuid, p_store_txn text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_amount  int;
  v_balance int;
BEGIN
  IF EXISTS (SELECT 1 FROM sparkle_transactions
             WHERE user_id = p_user AND reason = 'purchase_refund:' || p_store_txn) THEN
    RETURN 'ok';
  END IF;
  SELECT COALESCE(SUM(amount), 0)::int INTO v_amount
  FROM sparkle_transactions
  WHERE user_id = p_user AND reason = 'purchase:' || p_store_txn AND amount > 0;
  IF v_amount <= 0 THEN
    RETURN 'not_found';
  END IF;
  PERFORM 1 FROM users WHERE id = p_user FOR UPDATE;
  UPDATE users SET sparkle_balance = sparkle_balance - v_amount WHERE id = p_user
    RETURNING sparkle_balance INTO v_balance;
  INSERT INTO sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
  VALUES (p_user, -v_amount, 'purchase_refund:' || p_store_txn, NULL, v_balance);
  RETURN 'ok';
END;
$$;

-- Service-role only (the webhook) — no client grant.
REVOKE EXECUTE ON FUNCTION public.claw_back_purchase(uuid, text) FROM authenticated, anon;

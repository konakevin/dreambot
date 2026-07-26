-- 407_dream_off_funding.sql (2026-07-26)
--
-- Dream Off — Step 2 (DREAM_OFF_BUILD_PLAN.md §1 A9, economy). Pot FUNDING:
--   • dream_off_fund_pot  — the owner pre-buys N entry slots into the escrow pot
--     (Kevin's core ask: "let the owner fund all game slots" so players don't foot
--     the bill). This is the primary v1 funding path.
--   • dream_off_donate    — a member tops up the pot from their GIFTABLE (purchased-
--     only) balance, capped per day. Ships DARK (dream_off_donations_enabled=false).
--
-- Both charge through the UNMODIFIED charge_sparkles (idempotent on reference_id)
-- and credit the pot via its own append-only ledger under a per-pot row lock, so a
-- retry/double-tap can neither double-charge the user nor double-credit the pot
-- (the ledger UNIQUE(game_id,kind,reference_id) is the idempotency key). The render
-- draw-down ('spend') + settlement land in A10/A11.
--
-- Money-safety invariants: server-computed amount (slots × frozen slot_price),
-- owner-only fund, member-only donate, prefund bounded by dream_off_max_prefund_slots,
-- donations bounded by the daily cap + giftable provenance (kills free-account
-- farming, mirrors gift_sparkles). Both gate on dream_off_enabled (born dark).
--
-- Re-runnable.

BEGIN;

-- ── dream_off_fund_pot: owner pre-funds entry slots into the escrow ────────────
CREATE OR REPLACE FUNCTION public.dream_off_fund_pot(
  p_game_id uuid, p_slots integer, p_reference_id uuid DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid     uuid := auth.uid();
  v_ref     uuid := COALESCE(p_reference_id, gen_random_uuid());
  v_enabled boolean;
  v_phase   text;
  v_max     integer;
  v_pot     record;
  v_amount  integer;
  v_charge  text;
  v_bal     integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT dream_off_enabled, dream_off_max_prefund_slots INTO v_enabled, v_max
    FROM public.engine_config WHERE id = 1;
  IF NOT COALESCE(v_enabled, false) THEN RETURN jsonb_build_object('status', 'disabled'); END IF;
  IF p_slots IS NULL OR p_slots < 1 THEN RETURN jsonb_build_object('status', 'invalid_amount'); END IF;

  SELECT phase INTO v_phase FROM public.dream_offs WHERE id = p_game_id AND owner_id = v_uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: not your game'; END IF;
  IF v_phase NOT IN ('setup', 'submission') THEN RETURN jsonb_build_object('status', 'closed'); END IF;

  -- Lock the pot; enforce the prefund ceiling against slots already funded.
  SELECT * INTO v_pot FROM public.dream_off_pot WHERE game_id = p_game_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: pot not found'; END IF;
  IF v_pot.funded_slots + p_slots > COALESCE(v_max, 20) THEN
    RETURN jsonb_build_object('status', 'over_cap', 'max', COALESCE(v_max, 20));
  END IF;

  v_amount := p_slots * v_pot.slot_price;                       -- server-computed, frozen price
  v_charge := public.charge_sparkles(v_uid, v_amount, 'dream_off_fund', v_ref);
  IF v_charge = 'insufficient' THEN RETURN jsonb_build_object('status', 'insufficient'); END IF;

  -- Credit the pot exactly once (idempotent on the ledger unique key). On a retry
  -- (charge='already_charged'), the conflict skips and the pot is NOT re-credited.
  INSERT INTO public.dream_off_pot_ledger
    (game_id, kind, amount, balance_after, reference_id, actor_id)
  VALUES
    (p_game_id, 'fund', v_amount, v_pot.balance + v_amount, v_ref, v_uid)
  ON CONFLICT (game_id, kind, reference_id) DO NOTHING;
  IF FOUND THEN
    UPDATE public.dream_off_pot
      SET balance = balance + v_amount, funded_slots = funded_slots + p_slots, updated_at = now()
      WHERE game_id = p_game_id
      RETURNING balance INTO v_bal;
  ELSE
    v_bal := v_pot.balance;                                     -- retry: already credited
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'balance', v_bal, 'funded_slots', v_pot.funded_slots + p_slots);
END;
$$;
GRANT EXECUTE ON FUNCTION public.dream_off_fund_pot(uuid, integer, uuid) TO authenticated;

-- ── dream_off_donate: a member tops up the pot from GIFTABLE balance ───────────
CREATE OR REPLACE FUNCTION public.dream_off_donate(
  p_game_id uuid, p_amount integer, p_reference_id uuid DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid       uuid := auth.uid();
  v_ref       uuid := COALESCE(p_reference_id, gen_random_uuid());
  v_enabled   boolean;
  v_don_on    boolean;
  v_cap       integer;
  v_phase     text;
  v_pot       record;
  v_giftable  integer;
  v_sent_today integer;
  v_charge    text;
  v_bal       integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT dream_off_enabled, dream_off_donations_enabled, dream_off_donation_max_per_day
    INTO v_enabled, v_don_on, v_cap FROM public.engine_config WHERE id = 1;
  IF NOT COALESCE(v_enabled, false) OR NOT COALESCE(v_don_on, false) THEN
    RETURN jsonb_build_object('status', 'disabled');
  END IF;
  IF p_amount IS NULL OR p_amount < 1 THEN RETURN jsonb_build_object('status', 'invalid_amount'); END IF;

  SELECT phase INTO v_phase FROM public.dream_offs WHERE id = p_game_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: game not found'; END IF;
  IF v_phase NOT IN ('setup', 'submission') THEN RETURN jsonb_build_object('status', 'closed'); END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.dream_off_players
    WHERE game_id = p_game_id AND user_id = v_uid AND status IN ('active', 'pending')
  ) THEN RAISE EXCEPTION 'dream_off: not a member of this game'; END IF;

  -- Giftable provenance (purchased − gifts sent − purchase refunds), clamped to
  -- balance — free/received sparkles are non-donatable (anti-farming, mirrors gifting).
  SELECT GREATEST(0, LEAST(
      u.sparkle_balance,
      COALESCE((SELECT SUM(st.amount)::int FROM public.sparkle_transactions st
                WHERE st.user_id = u.id AND st.amount > 0 AND st.reason LIKE 'purchase:%'), 0)
      - COALESCE((SELECT SUM(-st.amount)::int FROM public.sparkle_transactions st
                  WHERE st.user_id = u.id AND st.reason = 'gift_sent'), 0)
      - COALESCE((SELECT SUM(-st.amount)::int FROM public.sparkle_transactions st
                  WHERE st.user_id = u.id AND st.reason LIKE 'purchase_refund:%'), 0)
    )) INTO v_giftable
  FROM public.users u WHERE u.id = v_uid;
  IF p_amount > COALESCE(v_giftable, 0) THEN
    RETURN jsonb_build_object('status', 'insufficient_giftable', 'giftable', COALESCE(v_giftable, 0));
  END IF;

  -- Daily donation cap across all of this donor's games today.
  SELECT COALESCE(SUM(-amount), 0) INTO v_sent_today
    FROM public.sparkle_transactions
    WHERE user_id = v_uid AND reason = 'dream_off_donate'
      AND created_at >= date_trunc('day', now());
  IF v_sent_today + p_amount > COALESCE(v_cap, 200) THEN
    RETURN jsonb_build_object('status', 'daily_cap', 'cap', COALESCE(v_cap, 200));
  END IF;

  SELECT * INTO v_pot FROM public.dream_off_pot WHERE game_id = p_game_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: pot not found'; END IF;

  v_charge := public.charge_sparkles(v_uid, p_amount, 'dream_off_donate', v_ref);
  IF v_charge = 'insufficient' THEN RETURN jsonb_build_object('status', 'insufficient'); END IF;

  INSERT INTO public.dream_off_pot_ledger
    (game_id, kind, amount, balance_after, reference_id, actor_id)
  VALUES
    (p_game_id, 'donate', p_amount, v_pot.balance + p_amount, v_ref, v_uid)
  ON CONFLICT (game_id, kind, reference_id) DO NOTHING;
  IF FOUND THEN
    UPDATE public.dream_off_pot
      SET balance = balance + p_amount, updated_at = now()
      WHERE game_id = p_game_id RETURNING balance INTO v_bal;
  ELSE
    v_bal := v_pot.balance;
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'balance', v_bal);
END;
$$;
GRANT EXECUTE ON FUNCTION public.dream_off_donate(uuid, integer, uuid) TO authenticated;

COMMIT;

-- 409_dream_off_settle.sql (2026-07-26)
--
-- Dream Off — Step 2 cont. (DREAM_OFF_BUILD_PLAN.md §1 A11, economy). Pot
-- SETTLEMENT: return the unspent escrow to whoever funded it when a game ends.
--   • dream_off_credit    — a bounded, idempotent, service-role DIRECT sparkle
--     credit (the payout primitive; refund_sparkles can only reverse a whole
--     recorded charge, so a PARTIAL pro-rata pot refund needs this).
--   • dream_off_settle_pot — flips the pot open→settling→settled EXACTLY ONCE
--     (the status guard under the row lock is the idempotency key), then refunds
--     the residual balance PRO-RATA by contribution, bounded by the residual so it
--     can never mint sparkles. v1: donations off → the owner is the only funder →
--     the whole residual returns to the owner.
--
-- Wiring: dream_off_settle_pot is PERFORMed at every terminal transition — results
-- + no_contest inside maybe_advance_dream_off, and cancel inside cancel_game — via
-- CREATE OR REPLACE (the bodies below are 405/404 verbatim + the one settle call).
-- Because it's the same transaction as the phase flip, settlement is atomic with it.
--
-- Re-runnable.

BEGIN;

-- ── dream_off_credit: bounded idempotent direct credit (the payout primitive) ──
CREATE OR REPLACE FUNCTION public.dream_off_credit(
  p_user_id uuid, p_amount integer, p_reason text, p_reference_id uuid
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_after integer;
BEGIN
  IF p_user_id IS NULL OR p_amount IS NULL OR p_amount <= 0 OR p_reference_id IS NULL THEN
    RETURN false;
  END IF;
  -- Idempotent: a prior credit under this (reason, reference_id) wins.
  IF EXISTS (
    SELECT 1 FROM public.sparkle_transactions
    WHERE user_id = p_user_id AND reference_id = p_reference_id AND reason = p_reason
  ) THEN RETURN false; END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  PERFORM 1 FROM public.users WHERE id = p_user_id FOR UPDATE;
  UPDATE public.users SET sparkle_balance = sparkle_balance + p_amount
    WHERE id = p_user_id RETURNING sparkle_balance INTO v_after;
  IF NOT FOUND THEN RETURN false; END IF;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
    VALUES (p_user_id, p_amount, p_reason, p_reference_id, v_after);
  RETURN true;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.dream_off_credit(uuid, integer, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dream_off_credit(uuid, integer, text, uuid) TO service_role;

-- ── dream_off_settle_pot: refund the residual escrow pro-rata, exactly once ────
CREATE OR REPLACE FUNCTION public.dream_off_settle_pot(p_game_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_pot     record;
  v_residual integer;
  v_total   integer;
  v_dust    integer := 0;
  v_paid    integer := 0;
  v_first   boolean := true;
  v_amt     integer;
  v_bal     integer;
  r         record;
BEGIN
  SELECT * INTO v_pot FROM public.dream_off_pot WHERE game_id = p_game_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  IF v_pot.status <> 'open' THEN RETURN; END IF;          -- idempotency guard
  UPDATE public.dream_off_pot SET status = 'settling', updated_at = now() WHERE game_id = p_game_id;

  v_residual := v_pot.balance;
  v_bal := v_pot.balance;
  IF v_residual > 0 THEN
    SELECT COALESCE(SUM(amount), 0) INTO v_total
      FROM public.dream_off_pot_ledger
      WHERE game_id = p_game_id AND kind IN ('fund', 'donate') AND actor_id IS NOT NULL;

    IF v_total > 0 THEN
      -- Rounding dust = residual minus the sum of per-funder floors; the largest
      -- funder absorbs it so the refunds sum to EXACTLY the residual (never more).
      SELECT v_residual - COALESCE(SUM((v_residual * contrib) / v_total), 0) INTO v_dust
        FROM (
          SELECT SUM(amount) AS contrib FROM public.dream_off_pot_ledger
            WHERE game_id = p_game_id AND kind IN ('fund', 'donate') AND actor_id IS NOT NULL
            GROUP BY actor_id
        ) f;

      FOR r IN
        SELECT actor_id, SUM(amount) AS contrib
          FROM public.dream_off_pot_ledger
          WHERE game_id = p_game_id AND kind IN ('fund', 'donate') AND actor_id IS NOT NULL
          GROUP BY actor_id
          ORDER BY SUM(amount) DESC, actor_id
      LOOP
        v_amt := (v_residual * r.contrib) / v_total;       -- integer floor
        IF v_first THEN
          v_amt := v_amt + v_dust;                         -- largest funder takes the dust
          v_first := false;
        END IF;
        v_amt := LEAST(v_amt, v_residual - v_paid);        -- never exceed the residual
        IF v_amt > 0 THEN
          PERFORM public.dream_off_credit(
            r.actor_id, v_amt, 'dream_off_settle_refund',
            md5(p_game_id::text || ':' || r.actor_id::text)::uuid);
          v_bal := v_bal - v_amt;
          INSERT INTO public.dream_off_pot_ledger
            (game_id, kind, amount, balance_after, reference_id, actor_id)
          VALUES
            (p_game_id, 'refund', -v_amt, v_bal,
             md5(p_game_id::text || ':' || r.actor_id::text)::uuid, r.actor_id)
          ON CONFLICT (game_id, kind, reference_id) DO NOTHING;
          v_paid := v_paid + v_amt;
        END IF;
      END LOOP;
    END IF;
  END IF;

  UPDATE public.dream_off_pot SET balance = v_bal, status = 'settled', updated_at = now()
    WHERE game_id = p_game_id;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.dream_off_settle_pot(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dream_off_settle_pot(uuid) TO service_role;

-- ── Wire settlement into the phase machine (405 body + the settle PERFORMs) ────
CREATE OR REPLACE FUNCTION public.maybe_advance_dream_off(
  p_game_id uuid, p_force boolean, p_reason text
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_phase text;
  v_exp timestamptz;
  v_hours int;
  v_active int;
  v_submitted int;
  v_voted int;
  v_entries int;
  v_new text := NULL;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('dream_off_advance:' || p_game_id::text));
  SELECT phase, phase_expires_at INTO v_phase, v_exp
    FROM public.dream_offs WHERE id = p_game_id FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT COALESCE(dream_off_deadline_hours, 24) INTO v_hours FROM public.engine_config WHERE id = 1;

  IF v_phase = 'setup' THEN
    IF p_force THEN
      UPDATE public.dream_offs
        SET phase = 'submission', phase_expires_at = now() + make_interval(hours => v_hours), updated_at = now()
        WHERE id = p_game_id AND phase = 'setup';
      v_new := 'submission';
    END IF;

  ELSIF v_phase = 'submission' THEN
    SELECT count(*) FILTER (WHERE status IN ('active', 'pending')),
           count(*) FILTER (WHERE status IN ('active', 'pending') AND submitted_at IS NOT NULL)
      INTO v_active, v_submitted
      FROM public.dream_off_players WHERE game_id = p_game_id;
    SELECT count(*) INTO v_entries FROM public.dream_off_entries
      WHERE game_id = p_game_id AND render_status = 'completed' AND moderation_status = 'clean';

    IF p_force OR (v_active > 0 AND v_submitted >= v_active) OR (v_exp IS NOT NULL AND now() >= v_exp) THEN
      IF v_entries >= 2 THEN
        UPDATE public.dream_offs
          SET phase = 'voting', phase_expires_at = now() + make_interval(hours => v_hours), updated_at = now()
          WHERE id = p_game_id AND phase = 'submission';
        v_new := 'voting';
        INSERT INTO public.dream_off_events (game_id, kind) VALUES (p_game_id, 'advanced');
        INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
          SELECT user_id, NULL, 'dream_off_voting_open', p_game_id
          FROM public.dream_off_players WHERE game_id = p_game_id AND status IN ('active', 'pending');
      ELSIF v_entries = 1 THEN
        UPDATE public.dream_offs SET phase = 'results', phase_expires_at = NULL, updated_at = now()
          WHERE id = p_game_id AND phase = 'submission';
        v_new := 'results';
        PERFORM public.tally_results(p_game_id);
        PERFORM public.dream_off_settle_pot(p_game_id);
        INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
          SELECT user_id, NULL, 'dream_off_results', p_game_id
          FROM public.dream_off_players WHERE game_id = p_game_id AND status IN ('active', 'pending');
      ELSE
        UPDATE public.dream_offs SET phase = 'no_contest', phase_expires_at = NULL, updated_at = now()
          WHERE id = p_game_id AND phase = 'submission';
        v_new := 'no_contest';
        PERFORM public.dream_off_settle_pot(p_game_id);
      END IF;
    END IF;

  ELSIF v_phase = 'voting' THEN
    SELECT count(*) FILTER (WHERE status IN ('active', 'pending')),
           count(*) FILTER (WHERE status IN ('active', 'pending') AND voted_at IS NOT NULL)
      INTO v_active, v_voted
      FROM public.dream_off_players WHERE game_id = p_game_id;
    IF p_force OR (v_active > 0 AND v_voted >= v_active) OR (v_exp IS NOT NULL AND now() >= v_exp) THEN
      UPDATE public.dream_offs SET phase = 'results', phase_expires_at = NULL, updated_at = now()
        WHERE id = p_game_id AND phase = 'voting';
      v_new := 'results';
      PERFORM public.tally_results(p_game_id);
      PERFORM public.dream_off_settle_pot(p_game_id);
      INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
        SELECT user_id, NULL, 'dream_off_results', p_game_id
        FROM public.dream_off_players WHERE game_id = p_game_id AND status IN ('active', 'pending');
    END IF;
  END IF;

  RETURN COALESCE(v_new, v_phase);
END;
$$;

-- ── Wire settlement into cancel (404 body + the settle PERFORM) ────────────────
CREATE OR REPLACE FUNCTION public.cancel_game(p_game_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  UPDATE public.dream_offs
    SET phase = 'cancelled', phase_expires_at = NULL, updated_at = now()
    WHERE id = p_game_id AND owner_id = v_uid AND phase NOT IN ('results', 'cancelled', 'no_contest');
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: not your game, or already finished'; END IF;
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (p_game_id, v_uid, 'cancelled');
  PERFORM public.dream_off_settle_pot(p_game_id);   -- refund the unspent escrow
END;
$$;

COMMIT;

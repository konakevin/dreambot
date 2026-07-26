-- 415_dream_off_settle_notify.sql (2026-07-26)
--
-- Dream Off — backend polish (DREAM_OFF_REMAINING_WORK.md §3.2). Settlement used
-- to return each funder's leftover pot sparkles SILENTLY. Notify them: a
-- 'dream_off_pot_refund' notification per credited funder (reference_id = game_id)
-- so the owner learns their unspent prefund came back. The send-push copy already
-- exists; the type is already in the notifications CHECK (401); it RESPECTS the
-- noise gates (not in isAlwaysPushType).
--
-- This is 409's dream_off_settle_pot VERBATIM + the one notification INSERT after
-- each credit. Re-runnable (CREATE OR REPLACE); maybe_advance/cancel_game already
-- PERFORM settle, so no re-wiring.

BEGIN;

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
          -- NEW: tell the funder their leftover pot sparkles came back.
          INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
            VALUES (r.actor_id, NULL, 'dream_off_pot_refund', p_game_id);
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

COMMIT;

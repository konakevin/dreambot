-- 404_dream_off_roster.sql (2026-07-26)
--
-- Dream Off — Step 1 cont. (DREAM_OFF_BUILD_PLAN.md §1 A6). The roster RPCs:
-- invite_players, the join_game_by_code CHOKE POINT, leave_game, cancel_game.
-- All SECURITY DEFINER + auth-gated; join/invite respect the max_players cap
-- under a per-game row lock (no overshoot) and the roster locks at VOTING.
--
-- Join model (DREAM_OFF_PLAN §10 decision 20): pre-invited friends are seated by
-- the owner; anyone with the link may join during SETUP/SUBMISSION (default open),
-- or lands 'pending' when the owner set join_approval. A link tapped after the
-- roster locks (voting+) returns spectator (no row). Backstops: the cap + the
-- owner kick (later) + blind voting; the ~5.9e14 code space makes enumeration
-- infeasible (an explicit per-user join rate-limit is a fast-follow).
--
-- Re-runnable.

BEGIN;

-- ── invite_players: owner seats existing users as 'invited' (+ push) ──────────
CREATE OR REPLACE FUNCTION public.invite_players(p_game_id uuid, p_user_ids uuid[])
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_game record;
  v_count int;
  v_invited int := 0;
  v_target uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT id, phase, max_players INTO v_game
    FROM public.dream_offs WHERE id = p_game_id AND owner_id = v_uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: not your game'; END IF;
  IF v_game.phase NOT IN ('setup', 'submission') THEN RAISE EXCEPTION 'dream_off: roster locked'; END IF;

  SELECT count(*) INTO v_count FROM public.dream_off_players
    WHERE game_id = p_game_id AND status IN ('active', 'pending', 'invited');

  FOREACH v_target IN ARRAY p_user_ids LOOP
    CONTINUE WHEN v_target = v_uid;                 -- owner is already seated
    EXIT WHEN v_count >= v_game.max_players;        -- respect the cap
    INSERT INTO public.dream_off_players (game_id, user_id, status, joined_via)
      VALUES (p_game_id, v_target, 'invited', 'invite')
      ON CONFLICT (game_id, user_id) DO NOTHING;
    IF FOUND THEN                                   -- newly invited only
      v_count := v_count + 1;
      v_invited := v_invited + 1;
      INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
        VALUES (v_target, v_uid, 'dream_off_invite', p_game_id);
    END IF;
  END LOOP;
  RETURN jsonb_build_object('invited', v_invited);
END;
$$;
GRANT EXECUTE ON FUNCTION public.invite_players(uuid, uuid[]) TO authenticated;

-- ── join_game_by_code: the single join choke point ────────────────────────────
CREATE OR REPLACE FUNCTION public.join_game_by_code(p_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_enabled boolean;
  v_game record;
  v_existing text;
  v_count int;
  v_new_status text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT dream_off_enabled INTO v_enabled FROM public.engine_config WHERE id = 1;
  IF NOT COALESCE(v_enabled, false) THEN RETURN jsonb_build_object('status', 'disabled'); END IF;

  SELECT id, phase, max_players, join_approval, invite_revoked_at INTO v_game
    FROM public.dream_offs WHERE invite_code = p_code FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('status', 'not_found'); END IF;
  IF v_game.invite_revoked_at IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'revoked');
  END IF;

  SELECT status INTO v_existing FROM public.dream_off_players
    WHERE game_id = v_game.id AND user_id = v_uid;
  IF v_existing = 'removed' THEN
    RETURN jsonb_build_object('status', 'removed', 'game_id', v_game.id);
  END IF;
  IF v_existing IN ('active', 'pending', 'invited') THEN
    -- Tapping the link with a pending invite accepts it (during setup/submission).
    IF v_existing = 'invited' AND v_game.phase IN ('setup', 'submission') THEN
      UPDATE public.dream_off_players
        SET status = CASE WHEN v_game.join_approval THEN 'pending' ELSE 'active' END
        WHERE game_id = v_game.id AND user_id = v_uid;
      INSERT INTO public.dream_off_events (game_id, actor_id, kind)
        VALUES (v_game.id, v_uid, 'joined');
    END IF;
    RETURN jsonb_build_object('status', 'already_member', 'game_id', v_game.id);
  END IF;

  -- Roster locks at voting: a non-member arriving late is results-only spectator.
  IF v_game.phase NOT IN ('setup', 'submission') THEN
    RETURN jsonb_build_object('status', 'spectator', 'game_id', v_game.id);
  END IF;

  SELECT count(*) INTO v_count FROM public.dream_off_players
    WHERE game_id = v_game.id AND status IN ('active', 'pending', 'invited');
  IF v_count >= v_game.max_players THEN
    RETURN jsonb_build_object('status', 'full', 'game_id', v_game.id);
  END IF;

  v_new_status := CASE WHEN v_game.join_approval THEN 'pending' ELSE 'active' END;
  INSERT INTO public.dream_off_players (game_id, user_id, status, joined_via)
    VALUES (v_game.id, v_uid, v_new_status, 'link')
    ON CONFLICT (game_id, user_id) DO UPDATE SET status = v_new_status, joined_via = 'link';
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (v_game.id, v_uid, 'joined');
  RETURN jsonb_build_object(
    'status', CASE WHEN v_game.join_approval THEN 'pending_approval' ELSE 'joined' END,
    'game_id', v_game.id
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.join_game_by_code(text) TO authenticated;

-- ── leave_game: a non-owner leaves before voting ──────────────────────────────
CREATE OR REPLACE FUNCTION public.leave_game(p_game_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_phase text; v_owner uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT phase, owner_id INTO v_phase, v_owner FROM public.dream_offs WHERE id = p_game_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: game not found'; END IF;
  IF v_owner = v_uid THEN RAISE EXCEPTION 'dream_off: owner cannot leave (cancel instead)'; END IF;
  IF v_phase NOT IN ('setup', 'submission') THEN RAISE EXCEPTION 'dream_off: cannot leave now'; END IF;
  UPDATE public.dream_off_players SET status = 'left' WHERE game_id = p_game_id AND user_id = v_uid;
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (p_game_id, v_uid, 'left');
END;
$$;
GRANT EXECUTE ON FUNCTION public.leave_game(uuid) TO authenticated;

-- ── cancel_game: owner ends a game (pot settlement wires in with the economy) ──
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
  -- The pot refund on cancel fires from dream_off_settle_pot once the economy
  -- settle RPC lands (a later migration wires it into the phase transition).
END;
$$;
GRANT EXECUTE ON FUNCTION public.cancel_game(uuid) TO authenticated;

COMMIT;

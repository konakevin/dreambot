-- 424_dream_off_accept_invite.sql (2026-07-27)
--
-- Dream Off — accept_invite(game_id): the CODE-LESS accept path for a friend who
-- tapped an in-app invite PUSH. The push routes to /game/{id} (reference_id =
-- game_id) and get_game_room hides the invite code from non-owners, so such a
-- friend has no code to call join_game_by_code with. accept_invite resolves the
-- game by id and otherwise mirrors join_game_by_code's semantics EXACTLY (same
-- status strings, same cap / phase / removed / approval handling) so the client's
-- status→copy mapping serves both. Owner-vouched (they were already 'invited'),
-- but also seats a brand-new joiner (idempotent) for robustness.
--
-- Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.accept_invite(p_game_id uuid)
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
    FROM public.dream_offs WHERE id = p_game_id FOR UPDATE;
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
    -- Accepting an invite during setup/submission promotes invited → active
    -- (or pending under approval); an already-active member is a no-op.
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
    VALUES (v_game.id, v_uid, v_new_status, 'invite')
    ON CONFLICT (game_id, user_id) DO UPDATE SET status = v_new_status;
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (v_game.id, v_uid, 'joined');
  RETURN jsonb_build_object(
    'status', CASE WHEN v_game.join_approval THEN 'pending_approval' ELSE 'joined' END,
    'game_id', v_game.id
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.accept_invite(uuid) TO authenticated;

COMMIT;

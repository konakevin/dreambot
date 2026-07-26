-- 411_dream_off_cast_votes.sql (2026-07-26)
--
-- Dream Off — Step 2 cont. (DREAM_OFF_BUILD_PLAN.md §1 A13). The ballot:
-- cast_votes — the client-facing voting RPC. Structural integrity:
--   • member-only (active/pending), during the 'voting' phase only,
--   • ≤ 2 roses, entries must be DISTINCT + clean/completed + in THIS game + NOT
--     the voter's own (the 400 no-self-vote trigger is the second line of defense),
--   • idempotent REPLACE (re-casting overwrites the prior ballot cleanly),
--   • records voted_at + a 'voted' event, then funnels through maybe_advance
--     (voting → results once everyone has voted).
--
-- SECURITY DEFINER (the votes table is deny-all RLS) + auth-gated. Granted to
-- authenticated. (users.last_room_view_at + its grant is deferred to the client
-- build, where the setter's freeze-trigger interaction is resolved in context.)
--
-- Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.cast_votes(p_game_id uuid, p_entry_ids uuid[])
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid   uuid := auth.uid();
  v_phase text;
  v_n     int;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.dream_off_players
    WHERE game_id = p_game_id AND user_id = v_uid AND status IN ('active', 'pending')
  ) THEN RAISE EXCEPTION 'dream_off: not a member of this game'; END IF;

  SELECT phase INTO v_phase FROM public.dream_offs WHERE id = p_game_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: game not found'; END IF;
  IF v_phase <> 'voting' THEN RETURN jsonb_build_object('status', 'closed'); END IF;

  v_n := COALESCE(array_length(p_entry_ids, 1), 0);
  IF v_n > 2 THEN RETURN jsonb_build_object('status', 'too_many_roses'); END IF;

  -- Distinct entries only.
  IF v_n <> (SELECT count(DISTINCT x) FROM unnest(p_entry_ids) AS x) THEN
    RETURN jsonb_build_object('status', 'invalid_ballot');
  END IF;

  -- Every rose must land on a clean, completed entry in THIS game that is NOT the
  -- voter's own.
  IF EXISTS (
    SELECT 1 FROM unnest(p_entry_ids) AS x
    WHERE NOT EXISTS (
      SELECT 1 FROM public.dream_off_entries e
      WHERE e.id = x AND e.game_id = p_game_id
        AND e.render_status = 'completed' AND e.moderation_status = 'clean'
        AND e.author_id IS DISTINCT FROM v_uid
    )
  ) THEN RETURN jsonb_build_object('status', 'invalid_ballot'); END IF;

  -- Idempotent replace: clear the prior ballot, then lay down the new roses.
  DELETE FROM public.dream_off_votes WHERE game_id = p_game_id AND voter_id = v_uid;
  INSERT INTO public.dream_off_votes (game_id, voter_id, entry_id, rose_index)
    SELECT p_game_id, v_uid, x.entry, (x.ord - 1)::smallint
    FROM unnest(p_entry_ids) WITH ORDINALITY AS x(entry, ord);

  UPDATE public.dream_off_players SET voted_at = now()
    WHERE game_id = p_game_id AND user_id = v_uid;
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (p_game_id, v_uid, 'voted');

  PERFORM public.maybe_advance_dream_off(p_game_id, false, 'vote');
  RETURN jsonb_build_object('status', 'ok', 'roses', v_n);
END;
$$;
GRANT EXECUTE ON FUNCTION public.cast_votes(uuid, uuid[]) TO authenticated;

COMMIT;

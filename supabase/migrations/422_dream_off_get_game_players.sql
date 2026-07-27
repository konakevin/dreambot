-- 422_dream_off_get_game_players.sql (2026-07-26)
--
-- Dream Off — the lobby / submission roster read. get_game_players returns the
-- members of a game (name + avatar + acted flags) so the Room can show who's in
-- and who still owes a dream. Members-only (non-members get []). This is NOT a
-- blindness leak: membership + submitted/voted PARTICIPATION is fine to show; the
-- gallery RPC still hides entry AUTHORSHIP and vote TARGETS until results.
--
-- SECURITY DEFINER so it can read users.avatar_url/display_name across the
-- column-level grants. Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.get_game_players(p_game_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_out jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.dream_off_players
    WHERE game_id = p_game_id AND user_id = v_uid
  ) THEN
    RETURN '[]'::jsonb;   -- non-members never see the roster
  END IF;
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'user_id', p.user_id,
           'name', COALESCE(u.display_name, u.username),
           'avatar_url', u.avatar_url,
           'submitted', p.submitted_at IS NOT NULL,
           'voted', p.voted_at IS NOT NULL,
           'is_owner', p.joined_via = 'owner'
         ) ORDER BY p.created_at), '[]'::jsonb) INTO v_out
    FROM public.dream_off_players p
    JOIN public.users u ON u.id = p.user_id
    WHERE p.game_id = p_game_id AND p.status IN ('active', 'pending');
  RETURN v_out;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_game_players(uuid) TO authenticated;

COMMIT;

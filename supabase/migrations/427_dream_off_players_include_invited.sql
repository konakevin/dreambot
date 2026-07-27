-- 427_dream_off_players_include_invited.sql (2026-07-27)
--
-- Dream Off — surface PENDING INVITES in the lobby. Previously get_game_players
-- returned only accepted players (active/pending), so inviting a friend produced
-- no visible change until they accepted. Now it also returns 'invited' rows +
-- each player's `status`, so the lobby can show invited friends as dimmed
-- "waiting to accept" avatars (and the owner gets immediate feedback that the
-- invite landed). Accepted players sort first, invited after. Re-runnable.

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
           'status', p.status,
           'submitted', p.submitted_at IS NOT NULL,
           'voted', p.voted_at IS NOT NULL,
           'is_owner', p.joined_via = 'owner'
         ) ORDER BY (p.status = 'invited'), p.created_at), '[]'::jsonb) INTO v_out
    FROM public.dream_off_players p
    JOIN public.users u ON u.id = p.user_id
    WHERE p.game_id = p_game_id AND p.status IN ('active', 'pending', 'invited');
  RETURN v_out;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_game_players(uuid) TO authenticated;

COMMIT;

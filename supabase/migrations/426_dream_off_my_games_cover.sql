-- 426_dream_off_my_games_cover.sql (2026-07-27)
--
-- Dream Off — the hub redesign shows "Your Dream Offs" as a photo grid: finished
-- games display their WINNING dream as the tile image. get_my_games gains a
-- `cover_image` = the winner entry's permanent game_image_ref for terminal games
-- (results); NULL for in-progress games (the client renders a branded placeholder
-- tile + a status badge instead). No new RPC name → the client compiles + reads
-- the field before/after this applies (null until then). Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.get_my_games()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_out jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'id', d.id, 'topic', d.topic, 'phase', d.phase,
           'phase_expires_at', d.phase_expires_at,
           'is_owner', d.owner_id = v_uid,
           'my_status', p.status,
           'my_submitted', p.submitted_at IS NOT NULL,
           'my_voted', p.voted_at IS NOT NULL,
           'player_count', (SELECT count(*) FROM public.dream_off_players pp
                            WHERE pp.game_id = d.id AND pp.status IN ('active', 'pending')),
           'cover_image', (SELECT e.game_image_ref
                           FROM public.dream_off_superlatives s
                           JOIN public.dream_off_entries e ON e.id = s.entry_id
                           WHERE s.game_id = d.id AND s.key = 'winner'
                           LIMIT 1),
           'updated_at', d.updated_at
         ) ORDER BY d.updated_at DESC), '[]'::jsonb) INTO v_out
    FROM public.dream_off_players p
    JOIN public.dream_offs d ON d.id = p.game_id
    WHERE p.user_id = v_uid AND p.status IN ('active', 'pending', 'invited');
  RETURN v_out;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_my_games() TO authenticated;

COMMIT;

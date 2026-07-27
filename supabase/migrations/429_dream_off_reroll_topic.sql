-- 429_dream_off_reroll_topic.sql (2026-07-27)
--
-- Dream Off — let the owner RE-ROLL the dream seed in the lobby before locking it
-- in (Kevin 2026-07-27). The seed is dealt at random from the chosen pack; if the
-- owner doesn't vibe with it, they can spin a new one — but ONLY in setup. Pressing
-- "Start" advances the phase, and deal_topic/reroll_topic both refuse outside
-- phase='setup', so the seed is frozen the instant dreaming can begin (players
-- can't submit until the submission phase). The lock is server-enforced, not UI.
--
-- Three parts:
--   1. dream_offs.pack_key — remember which pack the seed was dealt from, so a
--      re-roll stays WITHIN that pack (Epic stays epic) instead of drifting across
--      the category. NULL for surprise (any pack) and custom (owner-authored).
--   2. deal_topic — now records pack_key when it deals.
--   3. reroll_topic(game) — owner+setup gated; refuses custom topics; re-deals from
--      the stored pack via deal_topic. get_game_room now returns topic_source so the
--      client can hide the re-roll affordance for custom games.
-- Re-runnable.

BEGIN;

ALTER TABLE public.dream_offs
  ADD COLUMN IF NOT EXISTS pack_key text;

-- deal_topic: same behaviour as migration 421, plus it now stamps pack_key so a
-- later re-roll knows which pack to draw from.
CREATE OR REPLACE FUNCTION public.deal_topic(p_game_id uuid, p_pack text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_category text;
  v_topic text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT pack_category INTO v_category
  FROM public.dream_offs
  WHERE id = p_game_id AND owner_id = v_uid AND phase = 'setup';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'dream_off: not your game, or not in setup';
  END IF;
  -- Draw from an ACTIVE, IN-SEASON pack (per the catalog) that offers this
  -- category. A specific p_pack (pack pick) or any qualifying pack (surprise).
  SELECT t.topic_text INTO v_topic
  FROM public.dream_off_topics t
  JOIN public.dream_off_packs p ON p.key = t.pack
  WHERE t.is_active
    AND t.category = v_category
    AND p.is_active
    AND (v_category = 'scene' AND p.has_scene OR v_category = 'cast' AND p.has_cast)
    AND (p_pack IS NULL OR t.pack = p_pack)
    AND (p.season_start IS NULL OR current_date >= p.season_start)
    AND (p.season_end   IS NULL OR current_date <= p.season_end)
  ORDER BY random()
  LIMIT 1;
  IF v_topic IS NULL THEN RAISE EXCEPTION 'dream_off: no topics available'; END IF;
  UPDATE public.dream_offs
    SET topic = v_topic,
        topic_source = CASE WHEN p_pack IS NULL THEN 'surprise' ELSE 'pack' END,
        pack_key = p_pack,
        updated_at = now()
    WHERE id = p_game_id;
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (p_game_id, v_uid, 'topic_dealt');
  RETURN jsonb_build_object('topic', v_topic);
END;
$$;
GRANT EXECUTE ON FUNCTION public.deal_topic(uuid, text) TO authenticated;

-- reroll_topic: owner-only, setup-only, non-custom. Re-deals from the pack the
-- game was created with (NULL pack_key = surprise → any qualifying pack), reusing
-- deal_topic so the draw rules + phase gate stay in ONE place.
CREATE OR REPLACE FUNCTION public.reroll_topic(p_game_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_source text;
  v_pack text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT topic_source, pack_key INTO v_source, v_pack
  FROM public.dream_offs
  WHERE id = p_game_id AND owner_id = v_uid AND phase = 'setup';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'dream_off: not your game, or not in setup';
  END IF;
  -- A custom topic is owner-authored — there's no pack to re-roll from.
  IF v_source = 'custom' THEN
    RAISE EXCEPTION 'dream_off: cannot reroll a custom topic';
  END IF;
  RETURN public.deal_topic(p_game_id, v_pack);
END;
$$;
GRANT EXECUTE ON FUNCTION public.reroll_topic(uuid) TO authenticated;

-- get_game_room: expose topic_source so the client hides re-roll for custom games.
CREATE OR REPLACE FUNCTION public.get_game_room(p_game_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_game record;
  v_my record;
  v_member boolean;
  v_players int;
  v_entries int;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT * INTO v_game FROM public.dream_offs WHERE id = p_game_id;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT * INTO v_my FROM public.dream_off_players WHERE game_id = p_game_id AND user_id = v_uid;
  v_member := FOUND AND v_my.status IN ('active', 'pending', 'invited');
  -- Non-members may only peek at a finished (shareable) game.
  IF NOT v_member AND v_game.phase NOT IN ('results', 'no_contest', 'cancelled') THEN
    RETURN jsonb_build_object(
      'status', 'not_member', 'phase', v_game.phase, 'topic', v_game.topic,
      'pack_category', v_game.pack_category, 'cast_mode', v_game.cast_mode);
  END IF;

  SELECT count(*) INTO v_players FROM public.dream_off_players
    WHERE game_id = p_game_id AND status IN ('active', 'pending');
  SELECT count(*) INTO v_entries FROM public.dream_off_entries
    WHERE game_id = p_game_id AND render_status = 'completed' AND moderation_status = 'clean';

  RETURN jsonb_build_object(
    'status', 'ok',
    'id', v_game.id,
    'topic', v_game.topic,
    'topic_source', v_game.topic_source,
    'pack_category', v_game.pack_category,
    'cast_mode', v_game.cast_mode,
    'phase', v_game.phase,
    'phase_expires_at', v_game.phase_expires_at,
    'is_owner', v_game.owner_id = v_uid,
    'owner_name', (SELECT COALESCE(display_name, username) FROM public.users WHERE id = v_game.owner_id),
    'invite_code', CASE WHEN v_game.owner_id = v_uid THEN v_game.invite_code END,
    'join_approval', v_game.join_approval,
    'player_count', v_players,
    'entry_count', v_entries,
    'my_status', COALESCE(v_my.status, 'spectator'),
    'my_submitted', COALESCE(v_my.submitted_at IS NOT NULL, false),
    'my_voted', COALESCE(v_my.voted_at IS NOT NULL, false)
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_game_room(uuid) TO authenticated;

COMMIT;

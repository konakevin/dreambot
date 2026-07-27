-- 420_dream_off_pack_category.sql (2026-07-26)
--
-- Dream Off — pairs with the client create flow. A game is now bound to a topic
-- CATEGORY and (for cast games) a CAST MODE, both frozen on the game row:
--   • pack_category 'scene' — faceless-subject topics; the player never appears.
--   • pack_category 'cast'  — the player(s) are the subject; the stored topic is
--     the BARE scenario ("a battle-worn knight"). The "you as ___" / "you and your
--     +1 as ___" wording is applied CLIENT-SIDE from cast_mode at display time, so
--     the deck stays number-flexible (migration 417 model note).
--   • cast_mode 'single' | 'couple' — only meaningful when pack_category='cast'.
--
-- deal_topic now filters the deck by the game's category (417 added the column +
-- the (category, pack) index). create_game accepts + validates the pair, and
-- get_game_room returns them so the Room/entry screen can word cast topics.
--
-- create_game gains two params (a signature change): DROP the old 6-arg, then
-- CREATE OR REPLACE the new 8-arg — so a fresh apply drops 403's version and a
-- RE-RUN just replaces the 8-arg (idempotent; a plain CREATE would 42723 on the
-- second pass). deal_topic keeps its (uuid,text) signature (DROP+CREATE, same
-- sig). Born dark like the rest. Re-runnable.

BEGIN;

-- ── columns ───────────────────────────────────────────────────────────────────
ALTER TABLE public.dream_offs
  ADD COLUMN IF NOT EXISTS pack_category text NOT NULL DEFAULT 'scene'
    CHECK (pack_category IN ('scene', 'cast')),
  ADD COLUMN IF NOT EXISTS cast_mode text
    CHECK (cast_mode IN ('single', 'couple'));

-- A cast game must name its mode; a scene game must not carry one.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'dream_offs_cast_mode_coherent'
  ) THEN
    ALTER TABLE public.dream_offs
      ADD CONSTRAINT dream_offs_cast_mode_coherent CHECK (
        (pack_category = 'cast'  AND cast_mode IS NOT NULL) OR
        (pack_category = 'scene' AND cast_mode IS NULL)
      );
  END IF;
END $$;

-- ── create_game: now takes (pack_category, cast_mode) ─────────────────────────
DROP FUNCTION IF EXISTS public.create_game(text, text, text, integer, boolean, jsonb);
CREATE OR REPLACE FUNCTION public.create_game(
  p_topic         text,
  p_topic_source  text,
  p_tier_key      text    DEFAULT 'standard',
  p_max_players   integer DEFAULT 12,
  p_join_approval boolean DEFAULT false,
  p_settings      jsonb   DEFAULT '{}'::jsonb,
  p_pack_category text    DEFAULT 'scene',
  p_cast_mode     text    DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_enabled boolean;
  v_code text;
  v_game_id uuid;
  v_cast_mode text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT dream_off_enabled INTO v_enabled FROM public.engine_config WHERE id = 1;
  IF NOT COALESCE(v_enabled, false) THEN RAISE EXCEPTION 'dream_off: disabled'; END IF;
  IF p_topic_source NOT IN ('pack', 'surprise', 'custom') THEN
    RAISE EXCEPTION 'dream_off: bad topic_source';
  END IF;
  IF p_pack_category NOT IN ('scene', 'cast') THEN
    RAISE EXCEPTION 'dream_off: bad pack_category';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.dream_off_tiers WHERE key = p_tier_key AND is_active) THEN
    RAISE EXCEPTION 'dream_off: invalid tier';
  END IF;

  -- Normalize the (category, mode) pair: cast requires a mode (default single);
  -- scene never carries one. Keeps the coherence CHECK happy regardless of input.
  IF p_pack_category = 'cast' THEN
    v_cast_mode := COALESCE(p_cast_mode, 'single');
    IF v_cast_mode NOT IN ('single', 'couple') THEN
      RAISE EXCEPTION 'dream_off: bad cast_mode';
    END IF;
  ELSE
    v_cast_mode := NULL;
  END IF;

  v_code := public.dream_off_gen_invite_code();
  INSERT INTO public.dream_offs
    (owner_id, topic, topic_source, tier_key, invite_code, max_players, join_approval,
     settings, pack_category, cast_mode)
    VALUES (v_uid, p_topic, p_topic_source, p_tier_key, v_code,
            greatest(2, least(50, p_max_players)), p_join_approval,
            COALESCE(p_settings, '{}'::jsonb), p_pack_category, v_cast_mode)
    RETURNING id INTO v_game_id;
  INSERT INTO public.dream_off_players (game_id, user_id, status, joined_via)
    VALUES (v_game_id, v_uid, 'active', 'owner');
  PERFORM public.dream_off_setup_pot(v_game_id, p_tier_key);
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (v_game_id, v_uid, 'created');
  RETURN jsonb_build_object('game_id', v_game_id, 'invite_code', v_code);
END;
$$;
GRANT EXECUTE ON FUNCTION
  public.create_game(text, text, text, integer, boolean, jsonb, text, text)
  TO authenticated;

-- ── deal_topic: filter the deck by the game's frozen category ─────────────────
DROP FUNCTION IF EXISTS public.deal_topic(uuid, text);
CREATE FUNCTION public.deal_topic(p_game_id uuid, p_pack text DEFAULT NULL)
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
  -- v1: uniform random from the active (in-season) deck for THIS category; the
  -- per-group no-repeat shuffle-bag is a fast-follow (DREAM_OFF_PLAN §10).
  SELECT topic_text INTO v_topic
  FROM public.dream_off_topics
  WHERE is_active
    AND category = v_category
    AND (p_pack IS NULL OR pack = p_pack)
    AND (season_start IS NULL OR current_date >= season_start)
    AND (season_end IS NULL OR current_date <= season_end)
  ORDER BY random()
  LIMIT 1;
  IF v_topic IS NULL THEN RAISE EXCEPTION 'dream_off: no topics available'; END IF;
  UPDATE public.dream_offs
    SET topic = v_topic,
        topic_source = CASE WHEN p_pack IS NULL THEN 'surprise' ELSE 'pack' END,
        updated_at = now()
    WHERE id = p_game_id;
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (p_game_id, v_uid, 'topic_dealt');
  RETURN jsonb_build_object('topic', v_topic);
END;
$$;
GRANT EXECUTE ON FUNCTION public.deal_topic(uuid, text) TO authenticated;

-- ── get_game_room: surface category + cast_mode for topic wording ─────────────
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

-- 430_dream_off_invite_code_collision_guard.sql (2026-07-27)
--
-- Dream Off — guard the (astronomically rare) invite-code collision race (Kevin
-- 2026-07-27). dream_off_gen_invite_code() SELECT-checks a fresh code, but there's
-- a tiny window between that check and create_game's INSERT where a concurrent
-- create could grab the same code. The invite_code UNIQUE constraint would then
-- fail the INSERT with unique_violation (23505) and error the user instead of
-- silently repicking. Fix: wrap the code-gen + dream_offs INSERT in a retry loop
-- that catches unique_violation and draws a new code (up to 8 tries, then RAISE).
--
-- (We do NOT recycle codes — 810k of a 4-char space is effectively infinite; if we
-- ever approach it we just bump the code one char. Kevin's call.) Re-runnable.

BEGIN;

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
  v_attempt int;
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

  -- Insert the game with a freshly-drawn invite code. gen_invite_code already
  -- avoids known-taken codes; this loop closes the check-then-insert race — if a
  -- concurrent create grabbed the same code first, the UNIQUE constraint fires
  -- (23505) and we simply draw another. 8 tries is astronomically more than
  -- enough (each draw is ~1-in-810k against only the in-flight codes).
  FOR v_attempt IN 1..8 LOOP
    v_code := public.dream_off_gen_invite_code();
    BEGIN
      INSERT INTO public.dream_offs
        (owner_id, topic, topic_source, tier_key, invite_code, max_players, join_approval,
         settings, pack_category, cast_mode)
        VALUES (v_uid, p_topic, p_topic_source, p_tier_key, v_code,
                greatest(2, least(50, p_max_players)), p_join_approval,
                COALESCE(p_settings, '{}'::jsonb), p_pack_category, v_cast_mode)
        RETURNING id INTO v_game_id;
      EXIT;  -- inserted cleanly
    EXCEPTION WHEN unique_violation THEN
      IF v_attempt >= 8 THEN
        RAISE EXCEPTION 'dream_off: could not allocate a unique invite code';
      END IF;
      -- else: loop, draw a new code, try again
    END;
  END LOOP;

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

COMMIT;

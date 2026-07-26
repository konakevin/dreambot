-- 403_dream_off_create.sql (2026-07-26)
--
-- Dream Off — Step 1 cont. (DREAM_OFF_BUILD_PLAN.md §1 A5). The "create a game"
-- RPCs: a server-side invite-code generator, the topic-sanitize trigger, the
-- economy pot setup, and create_game / deal_topic. All gate on the
-- dream_off_enabled kill-switch, so nothing runs until the flag is flipped.
--
-- Topic safety: dream_offs.topic gets a BEFORE INSERT/UPDATE trigger that runs
-- the shared sanitize_user_text (NFKC + control/zero-width/bidi strip + injection
-- neutralize, migration 279) and rejects a slur-blocked topic (text_is_blocked,
-- migration 276) — so an unsanitized topic can never reach storage / an LLM /
-- the public landing page. (The SightEngine text-moderation pass for custom
-- topics is an edge-fn concern layered on later.)
--
-- Re-runnable (CREATE OR REPLACE / IF NOT EXISTS).

BEGIN;

-- ── Invite code: 10 chars from a Crockford-ish alphabet (no ambiguous glyphs) ──
CREATE OR REPLACE FUNCTION public.dream_off_gen_invite_code()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTVWXYZ23456789'; -- no I/L/O/U/0/1
  v_code text;
  v_bytes bytea;
  v_try int := 0;
  i int;
BEGIN
  LOOP
    v_code := '';
    v_bytes := gen_random_bytes(10);
    FOR i IN 0..9 LOOP
      v_code := v_code || substr(v_alphabet, 1 + (get_byte(v_bytes, i) % length(v_alphabet)), 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.dream_offs WHERE invite_code = v_code);
    v_try := v_try + 1;
    IF v_try > 8 THEN RAISE EXCEPTION 'dream_off: invite code generation failed'; END IF;
  END LOOP;
  RETURN v_code;
END;
$$;

-- ── Topic sanitize + slur-block trigger on dream_offs.topic ───────────────────
CREATE OR REPLACE FUNCTION public.dream_off_clean_topic()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  NEW.topic := public.sanitize_user_text(NEW.topic);
  IF NEW.topic IS NULL OR btrim(NEW.topic) = '' THEN
    RAISE EXCEPTION 'dream_off: empty topic';
  END IF;
  IF public.text_is_blocked(NEW.topic) THEN
    RAISE EXCEPTION 'dream_off: topic blocked';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_dream_off_clean_topic ON public.dream_offs;
CREATE TRIGGER trg_dream_off_clean_topic
  BEFORE INSERT OR UPDATE OF topic ON public.dream_offs
  FOR EACH ROW EXECUTE FUNCTION public.dream_off_clean_topic();

-- ── Pot setup: freeze the tier's slot_price onto a new escrow row (economy seam) ──
CREATE OR REPLACE FUNCTION public.dream_off_setup_pot(p_game_id uuid, p_tier_key text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_price int;
BEGIN
  SELECT slot_price INTO v_price FROM public.dream_off_tiers WHERE key = p_tier_key;
  IF v_price IS NULL THEN RAISE EXCEPTION 'dream_off: unknown tier %', p_tier_key; END IF;
  INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price)
    VALUES (p_game_id, p_tier_key, v_price)
    ON CONFLICT (game_id) DO NOTHING; -- idempotent
END;
$$;

-- ── create_game: the owner starts a game (auth + flag gated) ──────────────────
CREATE OR REPLACE FUNCTION public.create_game(
  p_topic         text,
  p_topic_source  text,
  p_tier_key      text    DEFAULT 'standard',
  p_max_players   integer DEFAULT 12,
  p_join_approval boolean DEFAULT false,
  p_settings      jsonb   DEFAULT '{}'::jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_enabled boolean;
  v_code text;
  v_game_id uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT dream_off_enabled INTO v_enabled FROM public.engine_config WHERE id = 1;
  IF NOT COALESCE(v_enabled, false) THEN RAISE EXCEPTION 'dream_off: disabled'; END IF;
  IF p_topic_source NOT IN ('pack', 'surprise', 'custom') THEN
    RAISE EXCEPTION 'dream_off: bad topic_source';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.dream_off_tiers WHERE key = p_tier_key AND is_active) THEN
    RAISE EXCEPTION 'dream_off: invalid tier';
  END IF;

  v_code := public.dream_off_gen_invite_code();
  INSERT INTO public.dream_offs
    (owner_id, topic, topic_source, tier_key, invite_code, max_players, join_approval, settings)
    VALUES (v_uid, p_topic, p_topic_source, p_tier_key, v_code,
            greatest(2, least(50, p_max_players)), p_join_approval, COALESCE(p_settings, '{}'::jsonb))
    RETURNING id INTO v_game_id;
  INSERT INTO public.dream_off_players (game_id, user_id, status, joined_via)
    VALUES (v_game_id, v_uid, 'active', 'owner');
  PERFORM public.dream_off_setup_pot(v_game_id, p_tier_key);
  INSERT INTO public.dream_off_events (game_id, actor_id, kind) VALUES (v_game_id, v_uid, 'created');
  RETURN jsonb_build_object('game_id', v_game_id, 'invite_code', v_code);
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_game(text, text, text, integer, boolean, jsonb) TO authenticated;

-- ── deal_topic: owner pulls a topic from the deck (setup only) ────────────────
CREATE OR REPLACE FUNCTION public.deal_topic(p_game_id uuid, p_pack text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_topic text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.dream_offs WHERE id = p_game_id AND owner_id = v_uid AND phase = 'setup'
  ) THEN
    RAISE EXCEPTION 'dream_off: not your game, or not in setup';
  END IF;
  -- v1: uniform random from the active (in-season) deck; the per-group no-repeat
  -- shuffle-bag is a fast-follow (DREAM_OFF_PLAN §10).
  SELECT topic_text INTO v_topic
  FROM public.dream_off_topics
  WHERE is_active
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

COMMIT;

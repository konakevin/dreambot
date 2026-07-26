-- 410_dream_off_reads.sql (2026-07-26)
--
-- Dream Off — Step 2 cont. (DREAM_OFF_BUILD_PLAN.md §1 A12). The BLINDING read
-- layer. The mechanics tables are deny-all RLS (400) — a raw PostgREST select
-- returns []. These SECURITY DEFINER RPCs are the ONLY read path, and each one
-- enforces the phase-blindness rules in SQL so authorship + tallies stay hidden
-- until the reveal:
--   • submission: you see only YOUR OWN entry; nobody else's.
--   • voting: all entries, AUTHOR HIDDEN, in a per-viewer deterministic shuffle,
--     with NO rose tallies (only which ones YOU roses'd) — blind voting.
--   • results/no_contest/cancelled: authors + rose counts + superlatives revealed
--     (spectators with the link may read this — the shareable archive).
--
-- get_game_invite_preview is anon-safe (topic/owner/count/phase only — never any
-- entry/vote), for the logged-out landing page. Re-runnable.

BEGIN;

-- ── get_game_room: header + the viewer's own state ────────────────────────────
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
    RETURN jsonb_build_object('status', 'not_member', 'phase', v_game.phase, 'topic', v_game.topic);
  END IF;

  SELECT count(*) INTO v_players FROM public.dream_off_players
    WHERE game_id = p_game_id AND status IN ('active', 'pending');
  SELECT count(*) INTO v_entries FROM public.dream_off_entries
    WHERE game_id = p_game_id AND render_status = 'completed' AND moderation_status = 'clean';

  RETURN jsonb_build_object(
    'status', 'ok',
    'id', v_game.id,
    'topic', v_game.topic,
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

-- ── get_game_gallery: phase-blind entry list (the blindness core) ─────────────
CREATE OR REPLACE FUNCTION public.get_game_gallery(p_game_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_game record;
  v_member boolean;
  v_out jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT * INTO v_game FROM public.dream_offs WHERE id = p_game_id;
  IF NOT FOUND THEN RETURN '[]'::jsonb; END IF;
  SELECT true INTO v_member FROM public.dream_off_players
    WHERE game_id = p_game_id AND user_id = v_uid AND status IN ('active', 'pending', 'invited');
  v_member := COALESCE(v_member, false);
  IF NOT v_member AND v_game.phase NOT IN ('results', 'no_contest', 'cancelled') THEN
    RETURN '[]'::jsonb;   -- non-members never see live entries
  END IF;

  IF v_game.phase = 'submission' THEN
    -- Only your own entry is visible while people are still making theirs.
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
             'entry_id', e.id, 'image', e.game_image_ref, 'is_mine', true,
             'render_status', e.render_status)), '[]'::jsonb)
      INTO v_out FROM public.dream_off_entries e
      WHERE e.game_id = p_game_id AND e.author_id = v_uid;

  ELSIF v_game.phase = 'voting' THEN
    -- All clean entries, AUTHOR HIDDEN, per-viewer shuffle, NO tallies — only which
    -- ones the viewer roses'd. is_mine lets the UI grey out the self entry.
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
             'entry_id', e.id, 'image', e.game_image_ref,
             'is_mine', e.author_id = v_uid,
             'roses_by_me', EXISTS (SELECT 1 FROM public.dream_off_votes v
                                    WHERE v.entry_id = e.id AND v.voter_id = v_uid)
           ) ORDER BY md5(e.blind_order_seed::text || v_uid::text)), '[]'::jsonb)
      INTO v_out FROM public.dream_off_entries e
      WHERE e.game_id = p_game_id AND e.render_status = 'completed' AND e.moderation_status = 'clean';

  ELSE
    -- Reveal: authors + rose counts + superlative, ranked.
    SELECT COALESCE(jsonb_agg(x.obj ORDER BY x.roses DESC, x.completed_at ASC), '[]'::jsonb) INTO v_out
      FROM (
        SELECT jsonb_build_object(
                 'entry_id', e.id, 'image', e.game_image_ref,
                 'author_id', e.author_id, 'author_name', e.author_name_snapshot,
                 'rose_count', count(v.entry_id),
                 'superlative', (SELECT key FROM public.dream_off_superlatives s
                                 WHERE s.game_id = p_game_id AND s.entry_id = e.id LIMIT 1)
               ) AS obj,
               count(v.entry_id) AS roses, e.completed_at
          FROM public.dream_off_entries e
          LEFT JOIN public.dream_off_votes v ON v.entry_id = e.id
          WHERE e.game_id = p_game_id AND e.render_status = 'completed' AND e.moderation_status = 'clean'
          GROUP BY e.id
      ) x;
  END IF;

  RETURN v_out;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_game_gallery(uuid) TO authenticated;

-- ── get_my_ballot: the viewer's own votes ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_ballot(p_game_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_ids jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  SELECT COALESCE(jsonb_agg(entry_id), '[]'::jsonb) INTO v_ids
    FROM public.dream_off_votes WHERE game_id = p_game_id AND voter_id = v_uid;
  RETURN jsonb_build_object('roses_max', 2, 'entry_ids', v_ids);
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_my_ballot(uuid) TO authenticated;

-- ── get_game_activity: the event feed (member-only) ───────────────────────────
CREATE OR REPLACE FUNCTION public.get_game_activity(p_game_id uuid, p_limit int DEFAULT 40)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid(); v_out jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.dream_off_players
                 WHERE game_id = p_game_id AND user_id = v_uid) THEN
    RETURN '[]'::jsonb;
  END IF;
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'kind', kind,
           'actor_name', COALESCE(actor_name_snapshot,
                          (SELECT COALESCE(display_name, username) FROM public.users WHERE id = actor_id)),
           'at', created_at) ORDER BY created_at DESC), '[]'::jsonb)
    INTO v_out FROM (
      SELECT * FROM public.dream_off_events WHERE game_id = p_game_id
      ORDER BY created_at DESC LIMIT LEAST(GREATEST(p_limit, 1), 200)
    ) e;
  RETURN v_out;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_game_activity(uuid, int) TO authenticated;

-- ── get_game_results: the shareable podium (terminal phases; spectator-safe) ───
CREATE OR REPLACE FUNCTION public.get_game_results(p_game_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_game record; v_podium jsonb;
BEGIN
  SELECT * INTO v_game FROM public.dream_offs WHERE id = p_game_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_game.phase NOT IN ('results', 'no_contest', 'cancelled') THEN
    RETURN jsonb_build_object('status', 'not_ready', 'phase', v_game.phase);
  END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'key', s.key, 'entry_id', s.entry_id, 'rose_count', s.rose_count,
           'image', e.game_image_ref,
           'author_id', e.author_id, 'author_name', e.author_name_snapshot
         ) ORDER BY CASE s.key WHEN 'winner' THEN 0 WHEN 'runner_up' THEN 1 ELSE 2 END), '[]'::jsonb)
    INTO v_podium
    FROM public.dream_off_superlatives s
    JOIN public.dream_off_entries e ON e.id = s.entry_id
    WHERE s.game_id = p_game_id;

  RETURN jsonb_build_object(
    'status', 'ok', 'phase', v_game.phase, 'topic', v_game.topic,
    'owner_name', (SELECT COALESCE(display_name, username) FROM public.users WHERE id = v_game.owner_id),
    'podium', v_podium
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_game_results(uuid) TO authenticated, anon;

-- ── get_my_games: the hub list (games I own or joined) ────────────────────────
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
           'updated_at', d.updated_at
         ) ORDER BY d.updated_at DESC), '[]'::jsonb) INTO v_out
    FROM public.dream_off_players p
    JOIN public.dream_offs d ON d.id = p.game_id
    WHERE p.user_id = v_uid AND p.status IN ('active', 'pending', 'invited');
  RETURN v_out;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_my_games() TO authenticated;

-- ── get_game_invite_preview: anon-safe landing-page card (NO entries/votes) ────
CREATE OR REPLACE FUNCTION public.get_game_invite_preview(p_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_game record; v_players int;
BEGIN
  SELECT * INTO v_game FROM public.dream_offs WHERE invite_code = p_code;
  IF NOT FOUND THEN RETURN jsonb_build_object('status', 'not_found'); END IF;
  SELECT count(*) INTO v_players FROM public.dream_off_players
    WHERE game_id = v_game.id AND status IN ('active', 'pending');
  RETURN jsonb_build_object(
    'status', 'ok',
    'topic', v_game.topic,
    'phase', v_game.phase,
    'owner_name', (SELECT COALESCE(display_name, username) FROM public.users WHERE id = v_game.owner_id),
    'player_count', v_players,
    'max_players', v_game.max_players,
    'joinable', v_game.invite_revoked_at IS NULL
                AND v_game.phase IN ('setup', 'submission')
                AND v_players < v_game.max_players
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_game_invite_preview(text) TO authenticated, anon;

COMMIT;

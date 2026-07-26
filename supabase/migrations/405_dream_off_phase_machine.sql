-- 405_dream_off_phase_machine.sql (2026-07-26)
--
-- Dream Off — Step 1 cont. (DREAM_OFF_BUILD_PLAN.md §1 A8). The heart: the single
-- guarded funnel that advances a game's phase, the idempotent tally, and the
-- owner-triggered advance. "Always resolves, never rots": every advance runs
-- under a per-game advisory lock + a status-guarded UPDATE, so concurrent
-- triggers (all-done / owner / deadline) collapse to one transition. Resolves on
-- partial turnout; a <2-entry submission diverts to a default win / no_contest.
--
-- The pot settlement (refund the escrow at results/cancel) is wired into this
-- funnel by a LATER economy migration (CREATE OR REPLACE adds the PERFORM
-- dream_off_settle_pot call) — it doesn't exist yet, so it's omitted here.
--
-- Re-runnable.

BEGIN;

-- ── tally_results: winner + runner_up + dark_horse (idempotent) ───────────────
CREATE OR REPLACE FUNCTION public.tally_results(p_game_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  -- Idempotent: once a winner row exists, a re-tally is a no-op.
  IF EXISTS (SELECT 1 FROM public.dream_off_superlatives WHERE game_id = p_game_id AND key = 'winner') THEN
    RETURN;
  END IF;

  INSERT INTO public.dream_off_superlatives (game_id, key, entry_id, rose_count)
  WITH tallies AS (
    SELECT e.id AS entry_id, e.completed_at, count(v.entry_id) AS roses
    FROM public.dream_off_entries e
    LEFT JOIN public.dream_off_votes v ON v.entry_id = e.id
    WHERE e.game_id = p_game_id
      AND e.render_status = 'completed' AND e.moderation_status = 'clean'
    GROUP BY e.id, e.completed_at
  ),
  ranked AS (
    -- Deterministic tiebreak: roses desc, then earliest submit, then entry id.
    SELECT entry_id, roses,
           row_number() OVER (ORDER BY roses DESC, completed_at ASC, entry_id ASC) AS rn
    FROM tallies
  ),
  pc AS (
    SELECT count(*) AS n FROM public.dream_off_players
    WHERE game_id = p_game_id AND status IN ('active', 'pending')
  )
  SELECT p_game_id,
         CASE r.rn WHEN 1 THEN 'winner' WHEN 2 THEN 'runner_up' WHEN 3 THEN 'dark_horse' END,
         r.entry_id, r.roses
  FROM ranked r CROSS JOIN pc
  WHERE r.rn = 1                              -- winner always (even a 1-entry win)
     OR (pc.n >= 4 AND r.rn IN (2, 3));       -- extra superlatives only at 4+ players

  INSERT INTO public.dream_off_events (game_id, kind) VALUES (p_game_id, 'revealed');
END;
$$;

-- ── maybe_advance_dream_off: the ONLY writer of dream_offs.phase ───────────────
CREATE OR REPLACE FUNCTION public.maybe_advance_dream_off(
  p_game_id uuid, p_force boolean, p_reason text
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_phase text;
  v_exp timestamptz;
  v_hours int;
  v_active int;      -- roster members who count (active + pending)
  v_submitted int;   -- members who submitted
  v_voted int;       -- members who voted
  v_entries int;     -- clean completed entries
  v_new text := NULL;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('dream_off_advance:' || p_game_id::text));
  SELECT phase, phase_expires_at INTO v_phase, v_exp
    FROM public.dream_offs WHERE id = p_game_id FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT COALESCE(dream_off_deadline_hours, 24) INTO v_hours FROM public.engine_config WHERE id = 1;

  IF v_phase = 'setup' THEN
    IF p_force THEN
      UPDATE public.dream_offs
        SET phase = 'submission', phase_expires_at = now() + make_interval(hours => v_hours), updated_at = now()
        WHERE id = p_game_id AND phase = 'setup';
      v_new := 'submission';
    END IF;

  ELSIF v_phase = 'submission' THEN
    SELECT count(*) FILTER (WHERE status IN ('active', 'pending')),
           count(*) FILTER (WHERE status IN ('active', 'pending') AND submitted_at IS NOT NULL)
      INTO v_active, v_submitted
      FROM public.dream_off_players WHERE game_id = p_game_id;
    SELECT count(*) INTO v_entries FROM public.dream_off_entries
      WHERE game_id = p_game_id AND render_status = 'completed' AND moderation_status = 'clean';

    IF p_force OR (v_active > 0 AND v_submitted >= v_active) OR (v_exp IS NOT NULL AND now() >= v_exp) THEN
      IF v_entries >= 2 THEN
        UPDATE public.dream_offs
          SET phase = 'voting', phase_expires_at = now() + make_interval(hours => v_hours), updated_at = now()
          WHERE id = p_game_id AND phase = 'submission';
        v_new := 'voting';
        INSERT INTO public.dream_off_events (game_id, kind) VALUES (p_game_id, 'advanced');
        INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
          SELECT user_id, NULL, 'dream_off_voting_open', p_game_id
          FROM public.dream_off_players WHERE game_id = p_game_id AND status IN ('active', 'pending');
      ELSIF v_entries = 1 THEN
        UPDATE public.dream_offs SET phase = 'results', phase_expires_at = NULL, updated_at = now()
          WHERE id = p_game_id AND phase = 'submission';
        v_new := 'results';
        PERFORM public.tally_results(p_game_id);
        INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
          SELECT user_id, NULL, 'dream_off_results', p_game_id
          FROM public.dream_off_players WHERE game_id = p_game_id AND status IN ('active', 'pending');
      ELSE
        UPDATE public.dream_offs SET phase = 'no_contest', phase_expires_at = NULL, updated_at = now()
          WHERE id = p_game_id AND phase = 'submission';
        v_new := 'no_contest';
      END IF;
    END IF;

  ELSIF v_phase = 'voting' THEN
    -- All ROSTER members vote (submitters + non-submitting spectators) — decision 8.
    SELECT count(*) FILTER (WHERE status IN ('active', 'pending')),
           count(*) FILTER (WHERE status IN ('active', 'pending') AND voted_at IS NOT NULL)
      INTO v_active, v_voted
      FROM public.dream_off_players WHERE game_id = p_game_id;
    IF p_force OR (v_active > 0 AND v_voted >= v_active) OR (v_exp IS NOT NULL AND now() >= v_exp) THEN
      UPDATE public.dream_offs SET phase = 'results', phase_expires_at = NULL, updated_at = now()
        WHERE id = p_game_id AND phase = 'voting';
      v_new := 'results';
      PERFORM public.tally_results(p_game_id);
      INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
        SELECT user_id, NULL, 'dream_off_results', p_game_id
        FROM public.dream_off_players WHERE game_id = p_game_id AND status IN ('active', 'pending');
    END IF;
  END IF;

  RETURN COALESCE(v_new, v_phase);
END;
$$;

-- ── advance_phase: owner-triggered early advance (thin guarded wrapper) ────────
CREATE OR REPLACE FUNCTION public.advance_phase(p_game_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'dream_off: not authenticated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.dream_offs WHERE id = p_game_id AND owner_id = v_uid) THEN
    RAISE EXCEPTION 'dream_off: not your game';
  END IF;
  RETURN public.maybe_advance_dream_off(p_game_id, true, 'owner');
END;
$$;
GRANT EXECUTE ON FUNCTION public.advance_phase(uuid) TO authenticated;
-- maybe_advance_dream_off / tally_results are internal (called by advance_phase,
-- cast_votes, the render-attach seam, and the cron) — NOT granted to clients.

COMMIT;

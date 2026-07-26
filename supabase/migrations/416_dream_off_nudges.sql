-- 416_dream_off_nudges.sql (2026-07-26)
--
-- Dream Off — backend polish (DREAM_OFF_REMAINING_WORK.md §3.3). The "come back
-- and play" heartbeat for an async game: dream_off_send_nudges() nudges players
-- who haven't acted as a phase deadline APPROACHES —
--   • submission closing soon → 'dream_off_your_turn' to active players with no
--     entry yet ("everyone's waiting on you"),
--   • voting closing soon → 'dream_off_nudge' to active players who haven't voted.
--
-- Fires at most ONCE per player per phase (dedup via NOT EXISTS on the same
-- notification type + game), only inside the nudge window before the deadline
-- (so nobody gets pinged the instant a game starts). Gated on dream_off_enabled
-- (no-op while dark). Push copy already exists (send-push); these RESPECT the
-- noise gates (not in isAlwaysPushType). pg_cron every 30 min. Re-runnable.

BEGIN;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dream_off_nudge_window_hours integer NOT NULL DEFAULT 6;

CREATE OR REPLACE FUNCTION public.dream_off_send_nudges()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_enabled boolean;
  v_window  integer;
  v_sent    integer := 0;
  v_n       integer;
BEGIN
  SELECT dream_off_enabled, COALESCE(dream_off_nudge_window_hours, 6)
    INTO v_enabled, v_window FROM public.engine_config WHERE id = 1;
  IF NOT COALESCE(v_enabled, false) THEN RETURN 0; END IF;

  -- Submission closing soon → "your turn" to active players without an entry.
  INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
  SELECT p.user_id, NULL, 'dream_off_your_turn', d.id
    FROM public.dream_offs d
    JOIN public.dream_off_players p ON p.game_id = d.id
    WHERE d.phase = 'submission'
      AND d.phase_expires_at IS NOT NULL
      AND d.phase_expires_at > now()
      AND d.phase_expires_at <= now() + make_interval(hours => v_window)
      AND p.status = 'active'
      AND p.submitted_at IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.notifications n
        WHERE n.recipient_id = p.user_id AND n.type = 'dream_off_your_turn' AND n.reference_id = d.id
      );
  GET DIAGNOSTICS v_n = ROW_COUNT;
  v_sent := v_sent + v_n;

  -- Voting closing soon → "nudge" to active players who haven't voted.
  INSERT INTO public.notifications (recipient_id, actor_id, type, reference_id)
  SELECT p.user_id, NULL, 'dream_off_nudge', d.id
    FROM public.dream_offs d
    JOIN public.dream_off_players p ON p.game_id = d.id
    WHERE d.phase = 'voting'
      AND d.phase_expires_at IS NOT NULL
      AND d.phase_expires_at > now()
      AND d.phase_expires_at <= now() + make_interval(hours => v_window)
      AND p.status = 'active'
      AND p.voted_at IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.notifications n
        WHERE n.recipient_id = p.user_id AND n.type = 'dream_off_nudge' AND n.reference_id = d.id
      );
  GET DIAGNOSTICS v_n = ROW_COUNT;
  v_sent := v_sent + v_n;

  RETURN v_sent;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.dream_off_send_nudges() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dream_off_send_nudges() TO service_role;

-- Schedule the nudge sweep (guarded; upserts by jobname).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'dream-off-nudges',
      '*/30 * * * *',
      $cron$SELECT public.dream_off_send_nudges();$cron$
    );
  END IF;
END $$;

COMMIT;

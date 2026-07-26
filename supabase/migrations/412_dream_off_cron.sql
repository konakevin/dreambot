-- 412_dream_off_cron.sql (2026-07-26)
--
-- Dream Off — Step 2 cont. (DREAM_OFF_BUILD_PLAN.md §1 A14). The deadline sweep:
-- advance_expired_dream_offs — a pg_cron minute job that funnels every game past
-- its phase_expires_at through maybe_advance_dream_off (the deadline branch inside
-- resolves it: submission→voting/results/no_contest, voting→results). This is what
-- makes the game "always resolve, never rot" even when nobody acts. + a
-- dream_off_stuck_count monitor helper.
--
-- Safety: gates on dream_off_enabled (no-ops while the feature is dark), bounded
-- LIMIT + FOR UPDATE SKIP LOCKED (no thundering herd, two overlapping cron runs
-- never fight over a row). Re-runnable (cron.schedule upserts by jobname).

BEGIN;

-- ── advance_expired_dream_offs: resolve every overdue game ─────────────────────
CREATE OR REPLACE FUNCTION public.advance_expired_dream_offs()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_enabled boolean;
  v_id uuid;
  v_count int := 0;
BEGIN
  SELECT dream_off_enabled INTO v_enabled FROM public.engine_config WHERE id = 1;
  IF NOT COALESCE(v_enabled, false) THEN RETURN 0; END IF;

  FOR v_id IN
    SELECT id FROM public.dream_offs
    WHERE phase IN ('submission', 'voting')
      AND phase_expires_at IS NOT NULL AND now() >= phase_expires_at
    ORDER BY phase_expires_at
    LIMIT 200
    FOR UPDATE SKIP LOCKED
  LOOP
    PERFORM public.maybe_advance_dream_off(v_id, false, 'deadline');
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.advance_expired_dream_offs() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.advance_expired_dream_offs() TO service_role;

-- ── dream_off_stuck_count: monitor canary (overdue games + unsettled pots) ─────
CREATE OR REPLACE FUNCTION public.dream_off_stuck_count()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'overdue_games', (
      SELECT count(*) FROM public.dream_offs
      WHERE phase IN ('submission', 'voting')
        AND phase_expires_at IS NOT NULL
        AND now() >= phase_expires_at + interval '5 minutes'   -- cron should have caught these
    ),
    'unsettled_pots', (
      SELECT count(*) FROM public.dream_off_pot p
      JOIN public.dream_offs d ON d.id = p.game_id
      WHERE d.phase IN ('results', 'no_contest', 'cancelled') AND p.status <> 'settled'
    )
  );
$$;
REVOKE EXECUTE ON FUNCTION public.dream_off_stuck_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dream_off_stuck_count() TO service_role;

-- ── Schedule the minute sweep (guarded; upserts by jobname) ────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'dream-off-advance-expired',
      '* * * * *',
      $cron$SELECT public.advance_expired_dream_offs();$cron$
    );
  END IF;
END $$;

COMMIT;

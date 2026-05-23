-- 178_bot_schedules_jitter_and_failure_cap.sql
-- Two upgrades to the DB-driven dispatcher:
--   1. Per-day jitter (±15 min) on each bot's slot so clusters don't repeat
--      forever (gothbot+steambot+tinybot were stuck at 03:40-44 UTC every cycle).
--   2. consecutive_failures counter + 5-failure auto-deactivate so a broken
--      bot can't burn Replicate credits indefinitely.

ALTER TABLE public.bot_schedules
  ADD COLUMN consecutive_failures int NOT NULL DEFAULT 0,
  ADD COLUMN last_failure_at      timestamptz,
  ADD COLUMN last_failure_reason  text;

-- ─────────────────────────────────────────────────────────────────────────────
-- compute_bot_next_due — REPLACED to add deterministic-per-day jitter.
-- Same signature, same trigger refs, drop-in replacement.
--
-- Jitter formula: deterministic pseudo-random ±15 min based on
-- (phase_seed, day_of_year, slot_index). Same bot lands at a different
-- minute each day, but the value is reproducible from the inputs (so the
-- same bot has the same next_due_at if you call compute() twice the same day).

CREATE OR REPLACE FUNCTION public.compute_bot_next_due(
  p_phase_seed int,
  p_posts_per_day int,
  p_min_lead_seconds int DEFAULT 60
) RETURNS timestamptz AS $$
DECLARE
  slot_interval_min int;
  start_min int;
  today_midnight timestamptz;
  required_after timestamptz;
  candidate timestamptz;
  best_slot timestamptz;
  i int;
  doy int;
  jitter_min int;
  jitter_range constant int := 15;
BEGIN
  slot_interval_min := 1440 / p_posts_per_day;
  start_min := p_phase_seed % slot_interval_min;
  today_midnight := date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  required_after := now() + make_interval(secs => p_min_lead_seconds);
  doy := EXTRACT(DOY FROM now() AT TIME ZONE 'UTC')::int;
  best_slot := NULL;

  FOR i IN 0..p_posts_per_day - 1 LOOP
    -- Deterministic-per-day jitter in [-jitter_range, +jitter_range] minutes.
    jitter_min := ((p_phase_seed * 31 + doy * 17 + i * 7) % (2 * jitter_range + 1)) - jitter_range;
    candidate := today_midnight + make_interval(mins => start_min + i * slot_interval_min + jitter_min);
    IF candidate >= required_after AND (best_slot IS NULL OR candidate < best_slot) THEN
      best_slot := candidate;
    END IF;
  END LOOP;

  IF best_slot IS NULL THEN
    -- Tomorrow's first slot — recompute jitter for tomorrow's doy.
    doy := EXTRACT(DOY FROM (now() + interval '1 day') AT TIME ZONE 'UTC')::int;
    jitter_min := ((p_phase_seed * 31 + doy * 17) % (2 * jitter_range + 1)) - jitter_range;
    best_slot := today_midnight + interval '1 day' + make_interval(mins => start_min + jitter_min);
    WHILE best_slot < required_after LOOP
      best_slot := best_slot + make_interval(mins => slot_interval_min);
    END LOOP;
  END IF;

  RETURN best_slot;
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER;

-- ─────────────────────────────────────────────────────────────────────────────
-- Apply jitter to the 17 existing rows. (Existing next_due_at values were set
-- by the pre-jitter compute() — re-running rebalance recomputes with jitter.)
SELECT public.rebalance_bot_schedules(60);

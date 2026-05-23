-- 178a_bot_schedules_jitter_formula_fix.sql
-- Fix a math bug in 178: the jitter formula multiplied phase_seed by 31, but
-- the modulus is also 31 (= 2*jitter_range + 1), so (phase_seed * 31) % 31 = 0
-- for every bot. The phase_seed term silently dropped out — every bot at the
-- same slot on the same day got the same jitter, meaning clusters shifted
-- together but never broke apart.
--
-- Fix: replace the three multipliers with values coprime to 31 (7, 13, 11)
-- so phase_seed, doy, and slot_index each contribute independently to the
-- output. Verified spot-check: gothbot/steambot/tinybot now get different
-- jitter values each day.

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
    -- Multipliers (7, 13, 11) are all coprime to 31 so phase_seed / doy /
    -- slot_index each contribute independently. Range: [-15, +15] minutes.
    jitter_min := ((p_phase_seed * 7 + doy * 13 + i * 11) % (2 * jitter_range + 1)) - jitter_range;
    candidate := today_midnight + make_interval(mins => start_min + i * slot_interval_min + jitter_min);
    IF candidate >= required_after AND (best_slot IS NULL OR candidate < best_slot) THEN
      best_slot := candidate;
    END IF;
  END LOOP;

  IF best_slot IS NULL THEN
    doy := EXTRACT(DOY FROM (now() + interval '1 day') AT TIME ZONE 'UTC')::int;
    jitter_min := ((p_phase_seed * 7 + doy * 13) % (2 * jitter_range + 1)) - jitter_range;
    best_slot := today_midnight + interval '1 day' + make_interval(mins => start_min + jitter_min);
    WHILE best_slot < required_after LOOP
      best_slot := best_slot + make_interval(mins => slot_interval_min);
    END LOOP;
  END IF;

  RETURN best_slot;
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER;

-- Re-jitter all 17 current rows with the fixed formula.
SELECT public.rebalance_bot_schedules(60);

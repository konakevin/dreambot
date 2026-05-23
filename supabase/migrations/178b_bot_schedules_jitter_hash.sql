-- 178b_bot_schedules_jitter_hash.sql
-- Final jitter polish: swap the linear-arithmetic formula (178a) for
-- Postgres's hashtext() so the per-(bot, day, slot) jitter values are
-- statistically uncorrelated.
--
-- Why: 178a's `((phase_seed * 7 + doy * 13 + i * 11) % 31) - 15` worked but
-- produced quantized day-to-day shifts (every bot's jitter changed by the
-- same +13 or -18 each day because `doy * 13 mod 31` is a global shift).
-- Bots with naturally-close `phase_seed mod slot_interval` values
-- (mangabot=64 / earthbot=66, brickbot=120 / chibibot=115) stayed clustered
-- day after day, just at different absolute times.
--
-- hashtext() produces values where small input changes yield uncorrelated
-- outputs — exactly what we want for jitter.

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
    -- hashtext returns a signed int; abs() handles negatives. Concatenated
    -- input ensures (phase_seed, doy, slot_index) each independently affect
    -- the output bits.
    jitter_min := (abs(hashtext(p_phase_seed::text || ':' || doy::text || ':' || i::text)) % (2 * jitter_range + 1)) - jitter_range;
    candidate := today_midnight + make_interval(mins => start_min + i * slot_interval_min + jitter_min);
    IF candidate >= required_after AND (best_slot IS NULL OR candidate < best_slot) THEN
      best_slot := candidate;
    END IF;
  END LOOP;

  IF best_slot IS NULL THEN
    doy := EXTRACT(DOY FROM (now() + interval '1 day') AT TIME ZONE 'UTC')::int;
    jitter_min := (abs(hashtext(p_phase_seed::text || ':' || doy::text || ':0')) % (2 * jitter_range + 1)) - jitter_range;
    best_slot := today_midnight + interval '1 day' + make_interval(mins => start_min + jitter_min);
    WHILE best_slot < required_after LOOP
      best_slot := best_slot + make_interval(mins => slot_interval_min);
    END LOOP;
  END IF;

  RETURN best_slot;
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER;

-- Re-jitter all 17 current rows with the new formula.
SELECT public.rebalance_bot_schedules(60);

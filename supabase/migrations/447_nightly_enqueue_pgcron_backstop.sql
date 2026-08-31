-- 447_nightly_enqueue_pgcron_backstop.sql
-- Supabase-native BACKSTOP for the nightly-dream ENQUEUE, independent of GitHub
-- Actions' scheduled cron.
--
-- WHY (incident 2026-08-27): the nightly enqueue runs ONLY from a GitHub Actions
-- hourly cron. GitHub silently dropped nearly every scheduled run that day (the
-- hourly nightly cron fired 1x instead of ~24x; the 5-min queue-sync fired 2x).
-- Event-triggered runs (push/PR) still worked, so it was GitHub deprioritising
-- SCHEDULED workflows, not an outage. The single run that fired (04:26 UTC) was
-- before the Americas' local 4am window (~08:00-13:00 UTC), so 15 of 16 eligible
-- users (all in US timezones) got NO nightly dream. A paid feature went dark with
-- no redundancy and no alarm.
--
-- FIX: a pure-Postgres enqueue that pg_cron runs hourly on Supabase's own
-- (reliable) scheduler. It mirrors scripts/nightly-dreams.js + nightlyTimezone.js:
-- each eligible user is enqueued on the first run at/after their LOCAL 4am, keyed
-- per-local-day so it's exactly one dream per local night. Fully idempotent
-- (ON CONFLICT (dedup_key) DO NOTHING — the non-partial unique index from mig 259),
-- so it runs REDUNDANTLY alongside the GitHub cron and can never double-send.
-- Reuses is_dream_eligible() (migs 257/262) so eligibility stays a single source
-- of truth. Reminders stay on the GitHub cron (daily, non-critical); this backstop
-- is dreams-only.
--
-- Run in the Supabase dashboard SQL editor.

CREATE OR REPLACE FUNCTION public.enqueue_nightly_dreams(p_dry_run boolean DEFAULT false)
RETURNS TABLE(r_user_id uuid, r_dedup_key text, r_outcome text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  rec        record;
  v_tz_valid boolean;
  v_local    timestamp;   -- wall-clock time in the user's zone
  v_hour     int;
  v_day      date;
  v_due      boolean;
  v_key      text;
  v_inserted int;
BEGIN
  -- Cohort MUST match scripts/nightly-dreams.js exactly, or the backstop enqueues
  -- users the JS path skips (verified 2026-08-27: querying is_dream_eligible alone
  -- pulled in 2 subscribed-but-never-onboarded users with NO recipe row → dreams
  -- with nothing to personalize). The JS gate is: has a user_recipes row (INNER),
  -- not a bot, onboarding done, ai_enabled. onboarding/ai_enabled default ON in
  -- engine_config; hardcoded here (a disabled flag would only make us stricter,
  -- never over-enqueue).
  FOR rec IN
    SELECT u.id, u.timezone
    FROM public.user_recipes ur
    JOIN public.users u ON u.id = ur.user_id
    WHERE u.is_bot = false
      AND ur.onboarding_completed = true
      AND ur.ai_enabled = true
      AND public.is_dream_eligible(u.id)
  LOOP
    -- Timezone-aware "is it their local night yet?" + per-local-day dedup key.
    -- Invalid/unknown IANA name → fall back to fire at/after 08:00 UTC, keyed on
    -- the UTC day (mirrors nightlyTimezone.js). >= target (not ==) so a skipped
    -- hour is caught by the next run instead of losing the whole day.
    v_tz_valid := rec.timezone IS NOT NULL
      AND EXISTS (SELECT 1 FROM pg_catalog.pg_timezone_names z WHERE z.name = rec.timezone);

    IF v_tz_valid THEN
      v_local := now() AT TIME ZONE rec.timezone;
      v_hour  := extract(hour FROM v_local)::int;
      v_day   := v_local::date;
      v_due   := v_hour >= 4;
    ELSE
      v_hour  := extract(hour FROM (now() AT TIME ZONE 'UTC'))::int;
      v_day   := (now() AT TIME ZONE 'UTC')::date;
      v_due   := v_hour >= 8;
    END IF;

    IF NOT v_due THEN
      CONTINUE;  -- before their local target hour → not this run
    END IF;

    v_key := 'nightly:' || rec.id::text || ':' || to_char(v_day, 'YYYY-MM-DD');

    IF p_dry_run THEN
      r_user_id  := rec.id;
      r_dedup_key := v_key;
      r_outcome  := CASE
        WHEN EXISTS (SELECT 1 FROM public.dream_queue q WHERE q.dedup_key = v_key)
        THEN 'would_skip_dedup' ELSE 'would_enqueue' END;
      RETURN NEXT;
    ELSE
      -- Same column set the JS enqueue uses (weight is set by the table
      -- default/trigger, identical to scripts/nightly-dreams.js).
      INSERT INTO public.dream_queue (source, user_id, status, payload, dedup_key)
      VALUES ('nightly', rec.id, 'queued', '{}'::jsonb, v_key)
      ON CONFLICT (dedup_key) DO NOTHING;
      GET DIAGNOSTICS v_inserted = ROW_COUNT;
      r_user_id  := rec.id;
      r_dedup_key := v_key;
      r_outcome  := CASE WHEN v_inserted > 0 THEN 'enqueued' ELSE 'skipped_dedup' END;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$;

-- Callable as an RPC by the service role (for dry-run testing + ops).
GRANT EXECUTE ON FUNCTION public.enqueue_nightly_dreams(boolean) TO service_role;

-- Schedule hourly on Supabase pg_cron (reliable), at :17 past to offset from the
-- GitHub cron (:00) + the worker crons. Idempotent unschedule-then-schedule so this
-- migration can be re-run safely.
SELECT cron.unschedule('nightly-enqueue-backstop')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'nightly-enqueue-backstop');

SELECT cron.schedule(
  'nightly-enqueue-backstop',
  '17 * * * *',
  $cron$ SELECT public.enqueue_nightly_dreams(false); $cron$
);

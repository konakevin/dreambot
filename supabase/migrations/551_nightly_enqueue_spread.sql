-- 551_nightly_enqueue_spread.sql — start a time zone's nightly jobs a few seconds apart, 2026-09-23.
-- NIGHTLY_ROBUSTNESS_PLAN.md item 3 (Kevin: "with 3 and 6").
--
-- WHY. Users are enqueued at their local 4am, so a whole time zone lands in one insert, and the worker claims
-- every job whose created_at has passed at the same instant — the 10:18 UTC Denver burst (Kevin + 3 couple-heavy
-- users) that hit the Fly swap cliff every night. The swap capacity gate (549/550) makes that burst safe; this
-- makes it cheap: staggered starts mean fewer swaps waiting on a slot, fewer capacity retries, and heavy slots
-- left free for people using Create at 4am local.
--
-- RULE (mirrors scripts/lib/nightlySpread.js exactly, locked by __tests__/lib/nightlySpread.test.ts):
--   job i of n starts at now + i * step, step = min(spacing_s, max_spread_min * 60 / (n - 1)) seconds.
--   spacing 0 = off (every job at now — the old behaviour). A 5-user cohort spreads over 2 minutes; a cohort of
--   hundreds never spreads wider than max_spread_min.
--
-- The function below is 447's enqueue_nightly_dreams verbatim except that it now COLLECTS the due users first and
-- inserts them in a second pass with the staggered created_at. Cohort, due rule, dedup key, dry run and return
-- rows are unchanged.
--
-- ROLLBACK (instant, no deploy): UPDATE public.engine_config SET nightly_enqueue_spacing_s = 0 WHERE id = 1;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_enqueue_spacing_s integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS nightly_enqueue_max_spread_min integer NOT NULL DEFAULT 60;

COMMENT ON COLUMN public.engine_config.nightly_enqueue_spacing_s IS
  'Seconds between the starts of one hour''s nightly jobs (created_at stagger). 0 = all at once (old behaviour).';
COMMENT ON COLUMN public.engine_config.nightly_enqueue_max_spread_min IS
  'The widest one hour''s nightly jobs may spread (minutes); spacing shrinks to fit a large cohort.';

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
  v_users    uuid[] := '{}';
  v_keys     text[] := '{}';
  v_n        int;
  v_spacing  numeric;
  v_spread   numeric;
  v_step_s   numeric;
  v_now      timestamptz := now();
  i          int;
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
    ELSIF EXISTS (SELECT 1 FROM public.dream_queue q WHERE q.dedup_key = v_key) THEN
      r_user_id  := rec.id;
      r_dedup_key := v_key;
      r_outcome  := 'skipped_dedup';
      RETURN NEXT;
    ELSE
      v_users := v_users || rec.id;
      v_keys  := v_keys || v_key;
    END IF;
  END LOOP;

  IF p_dry_run THEN
    RETURN;
  END IF;

  -- SPREAD (item 3): job i starts at now + i * step; step = min(spacing, max_spread / (n - 1)).
  v_n := coalesce(array_length(v_users, 1), 0);
  SELECT greatest(coalesce(ec.nightly_enqueue_spacing_s, 30), 0),
         greatest(coalesce(ec.nightly_enqueue_max_spread_min, 60), 0) * 60
    INTO v_spacing, v_spread
    FROM public.engine_config ec WHERE ec.id = 1;
  v_spacing := coalesce(v_spacing, 30);
  v_spread := coalesce(v_spread, 3600);
  v_step_s := CASE
    WHEN v_spacing <= 0 OR v_n <= 1 THEN 0
    ELSE least(v_spacing, v_spread / (v_n - 1))
  END;

  FOR i IN 1 .. v_n LOOP
    -- Same column set the JS enqueue uses (weight is set by the table
    -- default/trigger, identical to scripts/nightly-dreams.js), plus the stagger.
    INSERT INTO public.dream_queue (source, user_id, status, payload, dedup_key, created_at)
    VALUES ('nightly', v_users[i], 'queued', '{}'::jsonb, v_keys[i],
            v_now + make_interval(secs => (i - 1) * v_step_s))
    ON CONFLICT (dedup_key) DO NOTHING;
    GET DIAGNOSTICS v_inserted = ROW_COUNT;
    r_user_id  := v_users[i];
    r_dedup_key := v_keys[i];
    r_outcome  := CASE WHEN v_inserted > 0 THEN 'enqueued' ELSE 'skipped_dedup' END;
    RETURN NEXT;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.enqueue_nightly_dreams(boolean) TO service_role;

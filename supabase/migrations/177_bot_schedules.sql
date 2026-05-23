-- 177_bot_schedules.sql
-- DB-driven bot scheduling. One row per bot owns its cadence (posts_per_day +
-- active flag). next_due_at is maintained automatically by triggers:
--   * advance_bot_next_due fires when last_posted_at changes (dispatcher wrote a
--     successful post) — recomputes THIS bot's next slot.
--   * rebalance_on_config_change fires when posts_per_day or active changes —
--     also recomputes THIS bot's next slot.
-- Both triggers call compute_bot_next_due() which returns the canonical
-- slot-grid answer (each bot's slots are deterministic from phase_seed +
-- posts_per_day + UTC midnight, so no fleet coordination needed).
-- Initial seed below calls rebalance_bot_schedules(900) — 15-min lead so the
-- first dispatcher tick post-cutover doesn't see a burst of 17 due-now bots.

CREATE TABLE public.bot_schedules (
  bot_name       text PRIMARY KEY,
  posts_per_day  int NOT NULL DEFAULT 2 CHECK (posts_per_day > 0 AND posts_per_day <= 96),
  active         boolean NOT NULL DEFAULT true,
  last_posted_at timestamptz,
  next_due_at    timestamptz,
  phase_seed     int NOT NULL CHECK (phase_seed >= 0 AND phase_seed < 1440),
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX bot_schedules_due_idx
  ON public.bot_schedules (next_due_at)
  WHERE active;

ALTER TABLE public.bot_schedules ENABLE ROW LEVEL SECURITY;
-- No policies: service_role bypasses RLS via key. anon/authenticated denied.

-- ─────────────────────────────────────────────────────────────────────────────
-- compute_bot_next_due — canonical slot-grid answer for one bot.
-- Each bot's slots are: (phase_seed mod slot_interval) + k * slot_interval
-- minutes after UTC midnight, for k in 0..posts_per_day-1. Returns the next
-- slot >= now() + min_lead_seconds.

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
BEGIN
  slot_interval_min := 1440 / p_posts_per_day;
  start_min := p_phase_seed % slot_interval_min;
  today_midnight := date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  required_after := now() + make_interval(secs => p_min_lead_seconds);
  best_slot := NULL;

  FOR i IN 0..p_posts_per_day - 1 LOOP
    candidate := today_midnight + make_interval(mins => start_min + i * slot_interval_min);
    IF candidate >= required_after AND (best_slot IS NULL OR candidate < best_slot) THEN
      best_slot := candidate;
    END IF;
  END LOOP;

  IF best_slot IS NULL THEN
    best_slot := today_midnight + interval '1 day' + make_interval(mins => start_min);
    WHILE best_slot < required_after LOOP
      best_slot := best_slot + make_interval(mins => slot_interval_min);
    END LOOP;
  END IF;

  RETURN best_slot;
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER;

-- ─────────────────────────────────────────────────────────────────────────────
-- advance_bot_next_due — BEFORE UPDATE trigger fn. Recomputes THIS bot's
-- next_due_at using the canonical slot grid (lead = 60s default).

CREATE OR REPLACE FUNCTION public.advance_bot_next_due()
RETURNS trigger AS $$
BEGIN
  IF NEW.active THEN
    NEW.next_due_at := public.compute_bot_next_due(NEW.phase_seed, NEW.posts_per_day);
  ELSE
    NEW.next_due_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ─────────────────────────────────────────────────────────────────────────────
-- touch_updated_at — bumps updated_at on every UPDATE.

CREATE OR REPLACE FUNCTION public.bot_schedules_touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ─────────────────────────────────────────────────────────────────────────────
-- Triggers — names chosen so PG's alphabetical-fire order doesn't matter
-- (every BEFORE UPDATE trigger here is idempotent and mutates a different
-- NEW column).

CREATE TRIGGER trg_bot_schedules_advance_on_post
  BEFORE UPDATE ON public.bot_schedules
  FOR EACH ROW
  WHEN (NEW.last_posted_at IS DISTINCT FROM OLD.last_posted_at)
  EXECUTE FUNCTION public.advance_bot_next_due();

CREATE TRIGGER trg_bot_schedules_advance_on_config
  BEFORE UPDATE ON public.bot_schedules
  FOR EACH ROW
  WHEN (NEW.posts_per_day IS DISTINCT FROM OLD.posts_per_day
        OR NEW.active IS DISTINCT FROM OLD.active
        OR NEW.phase_seed IS DISTINCT FROM OLD.phase_seed)
  EXECUTE FUNCTION public.advance_bot_next_due();

CREATE TRIGGER trg_bot_schedules_touch_updated_at
  BEFORE UPDATE ON public.bot_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.bot_schedules_touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- rebalance_bot_schedules — recomputes next_due_at for ALL active bots.
-- Callable from SQL for ad-hoc fleet-wide reset (e.g., after manually editing
-- many phase_seeds). Migration calls it below with 15-min lead.

CREATE OR REPLACE FUNCTION public.rebalance_bot_schedules(
  p_min_lead_seconds int DEFAULT 60
) RETURNS void AS $$
DECLARE
  bot RECORD;
  new_due timestamptz;
BEGIN
  FOR bot IN SELECT bot_name, phase_seed, posts_per_day FROM public.bot_schedules WHERE active LOOP
    new_due := public.compute_bot_next_due(bot.phase_seed, bot.posts_per_day, p_min_lead_seconds);
    -- Direct next_due_at update doesn't fire either advance trigger (their
    -- WHEN clauses watch other columns) — safe from recursion.
    UPDATE public.bot_schedules SET next_due_at = new_due WHERE bot_name = bot.bot_name;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed all 17 bots at posts_per_day=2, active=true. phase_seed values are
-- md5(bot_name) first 32 bits mod 1440 (deterministic, computed in Node so
-- they survive PG hash-version changes).

INSERT INTO public.bot_schedules (bot_name, posts_per_day, active, phase_seed) VALUES
  ('bloombot',  2, true, 1134),
  ('brickbot',  2, true, 840),
  ('chibibot',  2, true, 835),
  ('dinobot',   2, true, 1229),
  ('dragonbot', 2, true, 637),
  ('earthbot',  2, true, 1146),
  ('faebot',    2, true, 864),
  ('gothbot',   2, true, 580),
  ('mangabot',  2, true, 424),
  ('mechbot',   2, true, 1166),
  ('pixelbot',  2, true, 1208),
  ('retrobot',  2, true, 672),
  ('starbot',   2, true, 617),
  ('steambot',  2, true, 941),
  ('tinybot',   2, true, 944),
  ('toybot',    2, true, 366),
  ('yumbot',    2, true, 301);

-- Initial rebalance with 15-min lead so the first dispatcher tick post-cutover
-- doesn't see a backlog of 17 due-now bots — they fan out across the next 24h.
SELECT public.rebalance_bot_schedules(900);

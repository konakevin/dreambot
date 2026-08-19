-- 437_holiday_dreams.sql — Holiday Dreams foundation (HOLIDAY_DREAMS_PLAN.md).
-- Ships DARK: engine_config.holidays_enabled starts FALSE and every catalog row
-- is_active=FALSE, so nothing fires until we flip Halloween on at go-live. Even if
-- flipped, an empty pool degrades to a normal nightly (N2). Run in the dashboard
-- SQL editor, then regenerate types/database.ts.

-- ── 1. Widen the scene-type pool CHECK to include 'holiday' (L5: brief ACCESS
--    EXCLUSIVE lock; do this BEFORE any holiday seeding). ──────────────────────
ALTER TABLE public.dual_scenarios DROP CONSTRAINT IF EXISTS dual_scenarios_pool_check;
ALTER TABLE public.dual_scenarios
  ADD CONSTRAINT dual_scenarios_pool_check
  CHECK (pool IN ('goofy', 'elegant', 'active', 'holiday'));

ALTER TABLE public.single_scenarios DROP CONSTRAINT IF EXISTS single_scenarios_pool_check;
ALTER TABLE public.single_scenarios
  ADD CONSTRAINT single_scenarios_pool_check
  CHECK (pool IN ('goofy', 'elegant', 'active', 'holiday'));

-- ── 2. The holidays catalog (peak-rule + window_days model, §3.5). ────────────
CREATE TABLE IF NOT EXISTS public.holidays (
  key            text PRIMARY KEY,
  display_name   text NOT NULL,
  emoji          text NOT NULL,
  peak_rule      text NOT NULL DEFAULT 'fixed'
                   CHECK (peak_rule IN ('fixed', 'nth_weekday', 'easter')),
  peak_month     int,   -- fixed/nth_weekday (NULL for easter)
  peak_day       int,   -- fixed
  peak_nth       int,   -- nth_weekday (e.g. 4)
  peak_weekday   int,   -- nth_weekday (0=Sun..6=Sat)
  window_days    int  NOT NULL,
  ramp_start_pct int  NOT NULL DEFAULT 30,
  peak_pct       int  NOT NULL DEFAULT 80,
  peak_lead_days int  NOT NULL DEFAULT 7,
  final_pct      int  NOT NULL DEFAULT 100,
  final_days     int  NOT NULL DEFAULT 3,
  is_active      boolean NOT NULL DEFAULT false,  -- per-holiday gate; flip on at each launch
  sort_order     int  NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS holidays_read_all ON public.holidays;
CREATE POLICY holidays_read_all ON public.holidays FOR SELECT USING (true);
GRANT SELECT ON public.holidays TO anon, authenticated;

-- Seed the 8-holiday roadmap (§9), all is_active=false until each ships.
INSERT INTO public.holidays
  (key, display_name, emoji, peak_rule, peak_month, peak_day, peak_nth, peak_weekday,
   window_days, ramp_start_pct, peak_pct, peak_lead_days, final_pct, final_days, sort_order)
VALUES
  ('halloween',    'Halloween',     '🎃', 'fixed',       10, 31, NULL, NULL, 46, 30, 80, 7, 100, 3, 1),
  ('christmas',    'Christmas',     '🎄', 'fixed',       12, 25, NULL, NULL, 24, 30, 80, 7, 100, 3, 2),
  ('thanksgiving', 'Thanksgiving',  '🦃', 'nth_weekday', 11, NULL, 4,   4,   12, 50, 80, 4, 100, 2, 3),
  ('new_years',    'New Year''s',   '🎉', 'fixed',        1,  1, NULL, NULL,  5, 60, 80, 2, 100, 1, 4),
  ('valentines',   'Valentine''s',  '💘', 'fixed',        2, 14, NULL, NULL,  7, 50, 80, 3, 100, 1, 5),
  ('st_patricks',  'St. Patrick''s','☘️', 'fixed',        3, 17, NULL, NULL,  7, 50, 80, 3, 100, 1, 6),
  ('easter',       'Easter',        '🐰', 'easter',    NULL, NULL, NULL, NULL, 14, 40, 80, 4, 100, 2, 7),
  ('july_4th',     '4th of July',   '🎆', 'fixed',        7,  4, NULL, NULL,  7, 50, 80, 3, 100, 1, 8)
ON CONFLICT (key) DO NOTHING;

-- ── 3. The scene-only pool (§3.5b) — no face-swap constraints. ────────────────
CREATE TABLE IF NOT EXISTS public.holiday_scenes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday    text NOT NULL,   -- == holidays.key / category
  scene      text NOT NULL,
  tone       text,
  medium_key text,
  medium_ban text,
  disabled   boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_holiday_scenes_holiday
  ON public.holiday_scenes (holiday) WHERE disabled = false;
ALTER TABLE public.holiday_scenes ENABLE ROW LEVEL SECURITY;
-- No public policy: only the service role (render) reads it; service role bypasses RLS.

-- ── 4. Per-user opt-out (§3.6) — JSONB array of disabled holiday keys. ─────────
-- user_recipes is RLS row-level (no migration-278 column grants), so no GRANT needed.
ALTER TABLE public.user_recipes
  ADD COLUMN IF NOT EXISTS holiday_optouts jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ── 5. Master kill switch (§3.5) — start FALSE (dark). ────────────────────────
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS holidays_enabled boolean NOT NULL DEFAULT true;
UPDATE public.engine_config SET holidays_enabled = false WHERE id = 1;

-- ── 6. The 🎃 marker on the dream (§5, L4/N3). uploads uses migration-278
--    column-level grants → a new column is invisible until granted. ───────────
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS holiday text;
GRANT SELECT (holiday) ON public.uploads TO anon, authenticated;
-- (No UPDATE grant: only the render/service role writes the marker.)

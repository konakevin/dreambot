-- 438_holiday_seasons_flat_ramp.sql — Holiday Dreams pacing overhaul.
-- Two changes to the intensity model (HOLIDAY_DREAMS_PLAN.md):
--   1. Add `ramp_style`: 'ramp' (climbs to a peak day, e.g. Halloween) vs 'flat'
--      (a steady low ambient presence over a window, no ramp — e.g. the Fall season).
--   2. Much GENTLER percentages — a "fun background echo," never a takeover. And
--      SPLIT Halloween into a Fall SEASON (Sept, flat) + Halloween (Oct, ramp) whose
--      windows OVERLAP in early October so users get a mix.
-- Windows may now overlap (fall × halloween); the render mixes all active seasons
-- weighted by their pct (no more "soonest-peak wins"). Still dark until launch.

-- ── 1. ramp_style column ──────────────────────────────────────────────────────
ALTER TABLE public.holidays
  ADD COLUMN IF NOT EXISTS ramp_style text NOT NULL DEFAULT 'ramp'
    CHECK (ramp_style IN ('ramp', 'flat'));

-- Gentler defaults for any future rows (each row still sets its own).
ALTER TABLE public.holidays ALTER COLUMN ramp_start_pct SET DEFAULT 6;
ALTER TABLE public.holidays ALTER COLUMN peak_pct       SET DEFAULT 25;
ALTER TABLE public.holidays ALTER COLUMN final_pct      SET DEFAULT 35;
ALTER TABLE public.holidays ALTER COLUMN final_days     SET DEFAULT 1;

-- ── 2. The Fall season (flat, ambient, Sept 1 → Oct 7). ───────────────────────
-- "peak" 10/07 is just the window END for a flat season (window = end - window_days);
-- ramp_style='flat' → a constant `peak_pct` across the whole window, no ramp/surge.
INSERT INTO public.holidays
  (key, display_name, emoji, ramp_style, peak_rule, peak_month, peak_day,
   window_days, ramp_start_pct, peak_pct, peak_lead_days, final_pct, final_days,
   is_active, sort_order)
VALUES
  ('fall', 'Fall', '🍂', 'flat', 'fixed', 10, 7, 36, 10, 10, 0, 10, 0, false, 0)
ON CONFLICT (key) DO NOTHING;

-- ── 3. Gentle-ify + retime the ramped holidays. ───────────────────────────────
-- Halloween now runs OCTOBER (window_days 30 → opens Oct 1), overlapping Fall's
-- tail (Oct 1-7), ramping to a gentle peak with a small nudge on the night itself.
UPDATE public.holidays SET
  ramp_style = 'ramp', window_days = 30,
  ramp_start_pct = 6, peak_pct = 25, peak_lead_days = 7, final_pct = 35, final_days = 1
WHERE key = 'halloween';

-- The other (dark) ramped holidays: same gentle background-echo levels. Windows
-- and peak rules unchanged; only the intensity drops from the old 30/80/100.
UPDATE public.holidays SET
  ramp_style = 'ramp', ramp_start_pct = 6, peak_pct = 25, final_pct = 35, final_days = 1
WHERE key IN ('christmas', 'thanksgiving', 'new_years', 'valentines', 'st_patricks', 'easter', 'july_4th');

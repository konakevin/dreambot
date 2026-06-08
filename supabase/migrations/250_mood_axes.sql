-- 250_mood_axes.sql — DB-driven onboarding mood sliders (ADMIN_CONFIG_PLAN.md Phase 4).
--
-- The 4 mood sliders (copy, labels, hints, order, default) were hardcoded in
-- components/onboarding/MoodSlidersStep.tsx — a client-gated bite point. This table
-- makes the slider COPY / ORDER / ACTIVE / DEFAULT admin-tunable from the dashboard.
--
-- IMPORTANT: the `key` is a CONTRACT with the engine — chaosTier reads
-- moods.peaceful_chaotic and sceneEngine reads moods.realistic_surreal. You may
-- relabel / reorder / re-default an axis freely, but DO NOT deactivate or rename
-- peaceful_chaotic or realistic_surreal (the engine reads them by key). The client
-- ignores any DB key that isn't one of the 4 known MoodAxes keys.
--
-- Run in the dashboard SQL editor. Idempotent.

CREATE TABLE IF NOT EXISTS public.mood_axes (
  key           text PRIMARY KEY,   -- MoodAxes key (engine contract — do not rename)
  title         text NOT NULL,
  description   text,
  left_label    text NOT NULL,
  right_label   text NOT NULL,
  left_hint     text,
  right_hint    text,
  default_value real    NOT NULL DEFAULT 0.5,
  sort_order    integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true
);

-- Public-read config (the onboarding client reads it; writes are dashboard/service
-- role only). Matches the bot_seeds / nightly_seeds RLS pattern — fixes the
-- "RLS disabled in public" advisor on the bare table.
ALTER TABLE public.mood_axes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read mood_axes" ON public.mood_axes;
CREATE POLICY "Anyone can read mood_axes" ON public.mood_axes FOR SELECT USING (true);

-- Seed the 4 current axes (verbatim from MoodSlidersStep.tsx + vibeProfile defaults).
INSERT INTO public.mood_axes
  (key, title, description, left_label, right_label, left_hint, right_hint, default_value, sort_order)
VALUES
  ('peaceful_chaotic', 'Energy', 'Soft mornings… or chaos at midnight.', 'Calm', 'Wild', 'Still water, soft light', 'Thunder, motion, fire', 0.5, 1),
  ('cute_terrifying', 'Tone', 'Warm light or creeping shadows.', 'Cozy', 'Eerie', 'Cozy, friendly, safe', 'Moody, haunting, uneasy', 0.3, 2),
  ('minimal_maximal', 'Detail', 'Minimal… or packed edge to edge.', 'Spare', 'Lush', 'One subject, one mood', 'Every inch packed', 0.5, 3),
  ('realistic_surreal', 'Reality', 'Almost real… or dream-logic weird.', 'Grounded', 'Surreal', 'Could be a photo', 'Impossible physics', 0.5, 4)
ON CONFLICT (key) DO NOTHING;

-- get_mood_axes() — active axes, ordered. Public (onboarding runs pre-auth-complete).
CREATE OR REPLACE FUNCTION public.get_mood_axes()
RETURNS TABLE (
  key text, title text, description text, left_label text, right_label text,
  left_hint text, right_hint text, default_value real, sort_order integer
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT key, title, description, left_label, right_label, left_hint, right_hint,
         default_value, sort_order
  FROM public.mood_axes
  WHERE is_active = true
  ORDER BY sort_order, key;
$$;

GRANT EXECUTE ON FUNCTION public.get_mood_axes() TO authenticated, anon;

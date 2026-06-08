-- 255_sparkle_packs.sql — make the sparkle economy DB-tunable (ADMIN_CONFIG_PLAN.md).
--
-- Pack sizes were duplicated in constants/sparklePacks.ts (UI) AND a hardcoded map
-- in the revenuecat-webhook (granting). This table is the single source of truth:
-- the store UI reads it (constants stay as offline fallback) and the webhook grants
-- from it. The Pro monthly bundle moves onto engine_config (yearly = 12× monthly).
--
-- Product IDs are the App Store Connect identifiers — they're the join key, not
-- editable here (Apple reserves them). Sizes/labels/icons/order ARE editable.
--
-- Public-read config (matches bot_seeds/mood_axes). Run in the dashboard. Idempotent.

CREATE TABLE IF NOT EXISTS public.sparkle_packs (
  product_id text PRIMARY KEY,          -- App Store Connect product identifier
  sparkles   integer NOT NULL,
  label      text NOT NULL,
  icon       text NOT NULL,             -- Ionicons name
  sort_order integer NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true
);

ALTER TABLE public.sparkle_packs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read sparkle_packs" ON public.sparkle_packs;
CREATE POLICY "Anyone can read sparkle_packs" ON public.sparkle_packs FOR SELECT USING (true);

-- Seed the 5 current packs (verbatim from constants/sparklePacks.ts, locked 2026-05-18).
INSERT INTO public.sparkle_packs (product_id, sparkles, label, icon, sort_order) VALUES
  ('com.konakevin.radorbad.sparkles.15_v2',  15,  'Impulse',    'sparkles-outline', 1),
  ('com.konakevin.radorbad.sparkles.40_v2',  40,  'Starter',    'star',             2),
  ('com.konakevin.radorbad.sparkles.90_v2',  90,  'Popular',    'sparkles',         3),
  ('com.konakevin.radorbad.sparkles.200_v2', 200, 'Best Value', 'diamond',          4),
  ('com.konakevin.radorbad.sparkles.500_v2', 500, 'Whale',      'rocket',           5)
ON CONFLICT (product_id) DO NOTHING;

-- Pro monthly sparkle bundle (yearly = 12× this). Webhook grants from here.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS pro_monthly_sparkle_bundle integer NOT NULL DEFAULT 75;

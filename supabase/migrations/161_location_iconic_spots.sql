-- 161 — location iconic spots
--
-- DB-driven curated pool of postcard-worthy iconic OUTDOOR LANDSCAPE
-- anchors per location. Replaces the encyclopedic scene_clusters.ts
-- pool that was producing chapel interiors, blacksmith forges, and
-- abandoned military bunkers as Hawaii "scene anchors".
--
-- Used by nightly-dreams (and eventually first-dream) to ground each
-- render in a known-iconic feature of the user's location, instead of
-- letting Sonnet improvise or pulling from low-quality auto-generated
-- pools.
--
-- Curation flow:
--   1. node scripts/gen-iconic-spots.js --location <name>  → inserts ~5-15 candidates
--   2. Visual review of resulting renders
--   3. Mark bad entries: UPDATE location_iconic_spots SET quality_tier='B' WHERE id=...
--   4. Edge function only picks quality_tier IN ('S','A')
--
-- Scoped to Hawaii first as the proof-of-pattern. Once renders land
-- consistently, run gen for the other 89 locations.

CREATE TABLE public.location_iconic_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_key text NOT NULL,
  spot_text text NOT NULL,
  spot_kind text NOT NULL DEFAULT 'vista',  -- 'vista' | 'closeup' | 'atmospheric' | 'panorama'
  quality_tier text NOT NULL DEFAULT 'A',   -- 'S'=banger, 'A'=good (default), 'B'=skip/inactive
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (location_key, spot_text)
);

CREATE INDEX idx_location_iconic_spots_lookup
  ON public.location_iconic_spots (location_key, quality_tier)
  WHERE is_active = true;

ALTER TABLE public.location_iconic_spots ENABLE ROW LEVEL SECURITY;
-- Service-role-only — no user-facing reads needed (Edge Function reads
-- via service-role client).

-- Hawaii proof-of-pattern seed (5 PURE PILLARS — no time/weather/light
-- language; those are axes rolled at render time). Generated 2026-05-09.
INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier) VALUES
  ('hawaii', 'Nā Pali Coast emerald cliffs and Pacific surf', 'vista', 'A'),
  ('hawaii', 'Haleakalā volcanic crater with cinder cones', 'panorama', 'A'),
  ('hawaii', 'Waimea Canyon red rock gorge and ridges', 'vista', 'A'),
  ('hawaii', 'Waikīkī Beach with Diamond Head volcanic cone', 'vista', 'A'),
  ('hawaii', 'Hānauma Bay coral reef and turquoise lagoon', 'vista', 'A');

NOTIFY pgrst, 'reload schema';

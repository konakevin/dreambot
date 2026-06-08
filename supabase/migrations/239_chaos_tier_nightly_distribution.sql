-- Chaos-tier-gated nightly dream type distribution (2026-06-07).
--
-- Kevin's nightly distribution spec — three tiers driven by the user's
-- onboarding chaos slider (vibe_profile.moods.peaceful_chaotic, 0..1):
--
--   TIER         | embodied | embodied mediums       | extra models
--   ------------ | -------- | ---------------------- | ----------------------------
--   low (<0.4)   | 0%       | —                      | (none beyond base list)
--   mid (0.4..0.7)| 10%     | lego, pixels           | + flux-2-pro
--   high (≥0.7)  | 15%     | lego, pixels, handcrafted | + flux-2-pro, flux-2-flex, flux-2-max
--
-- Overall distribution across all users (independent of chaos tier):
--   70% face-swap (60% dual / 20% self / 20% +1; falls back to 100% self when no +1)
--   30% scene-territory — within: chaos-gated embodied roll, then 50/50 pure_scene vs epic_tiny
--   No cast at all → 100% scene-territory, same chaos-gated split (no face-swap, no epic_tiny).
--
-- All knobs SQL-tunable on engine_config (id=1 singleton).

ALTER TABLE engine_config
  ADD COLUMN IF NOT EXISTS chaos_low_threshold NUMERIC(4,3) NOT NULL DEFAULT 0.400,
  ADD COLUMN IF NOT EXISTS chaos_high_threshold NUMERIC(4,3) NOT NULL DEFAULT 0.700,
  -- Embodied rate WITHIN the scene-territory (not of all dreams). Multiplied
  -- by the scene-portion share (30%) at decision time. So a within-scene
  -- rate of 0.33 yields ~10% of all dreams for users with cast.
  ADD COLUMN IF NOT EXISTS scene_embodied_rate_low NUMERIC(4,3) NOT NULL DEFAULT 0.000,
  ADD COLUMN IF NOT EXISTS scene_embodied_rate_mid NUMERIC(4,3) NOT NULL DEFAULT 0.333,
  ADD COLUMN IF NOT EXISTS scene_embodied_rate_high NUMERIC(4,3) NOT NULL DEFAULT 0.500,
  -- Embodied medium subsets per chaos tier. Mid gets lego + pixels only
  -- (handcrafted is "softer / weirder" — gated to high). High adds handcrafted.
  ADD COLUMN IF NOT EXISTS embodied_mediums_mid TEXT[] NOT NULL DEFAULT ARRAY['lego', 'pixels'],
  ADD COLUMN IF NOT EXISTS embodied_mediums_high TEXT[] NOT NULL DEFAULT ARRAY['lego', 'pixels', 'handcrafted'],
  -- High-chaos extra models (flux-2 family — "weirder" renders). Added to
  -- the medium's allowed_models at pick time for HIGH chaos users only.
  ADD COLUMN IF NOT EXISTS extra_models_mid TEXT[] NOT NULL DEFAULT ARRAY['black-forest-labs/flux-2-pro'],
  ADD COLUMN IF NOT EXISTS extra_models_high TEXT[] NOT NULL DEFAULT ARRAY[
    'black-forest-labs/flux-2-pro',
    'black-forest-labs/flux-2-flex',
    'black-forest-labs/flux-2-max'
  ],
  -- Overall face-swap share (tunable if Kevin wants to shift later).
  ADD COLUMN IF NOT EXISTS face_swap_share NUMERIC(4,3) NOT NULL DEFAULT 0.700,
  ADD COLUMN IF NOT EXISTS face_swap_dual_rate NUMERIC(4,3) NOT NULL DEFAULT 0.600,
  ADD COLUMN IF NOT EXISTS face_swap_self_rate NUMERIC(4,3) NOT NULL DEFAULT 0.200;
  -- face_swap_plus_one_rate is implied = 1 - dual - self = 0.200.

-- 362_dream_art_nightly_config.sql
--
-- Nightly support for Dream Art (character-embodied) mediums (2026-07-10).
-- NOTE (2026-07-11, migration 363): dream_art_mediums is now VESTIGIAL — the
-- Dream Art pool derives from per-medium flags (character_render_mode='embodied'
-- && is_dream_eligible) and this column is no longer read. dream_art_share
-- remains the live roll knob (set to 0.30 by 363).
--
-- Dream Art mediums (kawaii / fairytale / storybook) DRAW the user AS a
-- character in the style, instead of pasting their real face. Previously nightly
-- could only (a) face-swap the user, or (b) render scene-only embodied scenery
-- (lego/pixels) with no person. This adds a new nightly dream type, "dream_art",
-- that casts the user into an embodied medium and draws them as the character
-- (chaosTier.ts + dreamStyles.ts + the nightly non-face-swap character brief).
--
-- These two engine_config knobs make the roll rate + curated medium list
-- dashboard-tunable (same DB-driven-config ethos as the face_swap_* knobs):
--   • dream_art_share    — fraction of the has-cast nightly roll that becomes a
--                          Dream Art (draw-you-as-a-character) dream.
--   • dream_art_mediums  — curated list of embodied mediums the user can be
--                          drawn AS in nightly.
-- Until this migration is applied, chaosTier.ts falls back to its DEFAULT_CONFIG
-- (0.15 and {kawaii,fairytale,storybook}); after applying, add both columns to
-- the fetchChaosConfig() SELECT to make them live-tunable.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dream_art_share double precision NOT NULL DEFAULT 0.15,
  ADD COLUMN IF NOT EXISTS dream_art_mediums text[] NOT NULL
    DEFAULT ARRAY['kawaii', 'fairytale', 'storybook']::text[];

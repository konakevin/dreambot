-- 139 — Add is_scene_only + nightly_skip columns to dream_mediums.
--
-- Background: Phase 1 audit (memory/project_medium_flags_audit.md) found
-- that:
--   - is_scene_only never existed as a column (despite CLAUDE.md claims).
--     The rollDream() algorithm has no way to say "never include a
--     character" — for media like real_astro (NASA astrophotography),
--     a 50% character roll would render an astronaut inside the Hubble shot.
--   - nightly_skip never existed either. Today the only "ban from nightly"
--     mechanism is a hardcoded inline Set at nightly-dreams/index.ts:216
--     (NIGHTLY_BANNED_MEDIUMS = new Set(['photography'])). This column
--     replaces that with DB-driven config.
--
-- After this migration:
--   - rollDream() reads medium.isSceneOnly and forces includeCharacter=false
--   - nightly-dreams/index.ts reads medium.nightlySkip and excludes those
--     mediums from the eligible pool

ALTER TABLE public.dream_mediums
  ADD COLUMN is_scene_only boolean NOT NULL DEFAULT false,
  ADD COLUMN nightly_skip  boolean NOT NULL DEFAULT false;

-- Mutex constraint: a medium can't be both scene-only AND character-only.
-- Catches future bad inserts at the DB level.
ALTER TABLE public.dream_mediums
  ADD CONSTRAINT dream_mediums_scene_xor_character
  CHECK (NOT (is_scene_only AND is_character_only));

-- Backfill known scene-only medium: real_astro is bot-only NASA-grade
-- astrophotography. People in deep-space shots are visually wrong.
UPDATE public.dream_mediums
   SET is_scene_only = true
 WHERE key = 'real_astro';

-- Backfill known nightly-skip medium: photography ruins the nightly
-- aesthetic (per Kevin 2026-04-30 — produces literal photoreal renders
-- that read as "AI photoshop collage" with imaginative scene elements).
-- Still resolvable via force_medium for QA.
UPDATE public.dream_mediums
   SET nightly_skip = true
 WHERE key = 'photography';

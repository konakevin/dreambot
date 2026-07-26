-- 417_dream_off_topic_category.sql (2026-07-26)
--
-- Dream Off — topic model (DREAM_OFF_REMAINING_WORK.md §3.4 rework). A theme
-- (pack) can exist in TWO categories, seeded separately with a fundamentally
-- different composition:
--   • 'scene' — a faceless subject (an object / place / creature / moment); the
--     scene IS the star, the player never appears.
--   • 'cast'  — the player(s) ARE the subject (face-swapped in); stored as a BARE
--     number-flexible scenario so the game's single/couple setting can prefix it
--     ("you as ___" / "you and your +1 as ___") at deal time.
--
-- Most themes ship in BOTH categories (cute/cursed/chaotic/epic/glam/hot_summer/
-- anime/movies/video_games/scifi/era); Roast is cast-only, Worlds is scene-only.
-- deal_topic filters by (chosen theme(s), category) — that wiring lands with the
-- create flow. Re-runnable.

BEGIN;

ALTER TABLE public.dream_off_topics
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'scene'
    CHECK (category IN ('scene', 'cast'));

-- deal hot path: active topics for a (category, pack).
CREATE INDEX IF NOT EXISTS idx_dream_off_topics_cat_pack
  ON public.dream_off_topics (category, pack) WHERE is_active;

COMMIT;

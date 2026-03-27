-- Migration 010: add music, sports, art categories; rename memes → funny
-- The category column uses a PostgreSQL enum type, so we ALTER TYPE (not check constraints).

-- 1. Add new enum values (do NOT add 'funny' here — it comes from renaming 'memes' below)
ALTER TYPE public.category ADD VALUE IF NOT EXISTS 'music';
ALTER TYPE public.category ADD VALUE IF NOT EXISTS 'sports';
ALTER TYPE public.category ADD VALUE IF NOT EXISTS 'art';

-- 2. Rename memes → funny in the enum type.
--    PostgreSQL automatically updates all stored rows that had 'memes' to 'funny'.
ALTER TYPE public.category RENAME VALUE 'memes' TO 'funny';

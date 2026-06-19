-- 300_rename_high_fantasy_vibe.sql
--
-- Rename the High Fantasy vibe's display label to just "Fantasy" (Kevin). Key
-- stays 'high_fantasy' (no dreams reference it yet, but renaming the key buys
-- nothing). Description + directive unchanged. Applied live; this captures it for
-- a fresh DB.

UPDATE public.dream_vibes SET label = 'Fantasy' WHERE key = 'high_fantasy';

-- Migration 021: Drop character sheet infrastructure
--
-- The character sheet feature (CLOUT, GRIND, TASTE, EDGE, JUDGE, VARIETY stats,
-- class assignment, alignment labels) was shelved before launch. We're removing
-- the DB infrastructure that supported it so it doesn't add overhead to every
-- vote insert.
--
-- What's removed:
--   - handle_vote_affinity trigger on votes table (fired on every vote,
--     looped over post categories, wrote to user_category_affinity)
--   - user_category_affinity table (tracked per-user rad/bad vote counts
--     per category — only used by the character sheet CRITIC + alignment stats)
--
-- The shelved code (CharacterSheet.tsx, lib/characterSheet.ts,
-- hooks/useCharacterStats.ts) remains in the codebase with a comment
-- explaining why it was paused.

-- Drop the trigger first, then the function, then the table
DROP TRIGGER  IF EXISTS trg_vote_affinity             ON public.votes;
DROP TRIGGER  IF EXISTS handle_vote_affinity_trigger  ON public.votes;
DROP TRIGGER  IF EXISTS on_vote_update_affinity        ON public.votes;
DROP FUNCTION IF EXISTS public.handle_vote_affinity() CASCADE;
DROP TABLE    IF EXISTS public.user_category_affinity;

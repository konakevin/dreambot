-- 546: stamp the emitted prompt's WORD COUNT on every bot run.
--
-- WHY THIS COLUMN EXISTS
-- The single strongest finding of the Sept-2026 new-paths push (playbook lesson
-- 54) is that a render's grade correlates with how long its emitted prompt was.
-- Measured on PixelBot `observatory-tower`, 15 renders, one round, same pools and
-- models: the 8 shortest prompts (235-278 words) averaged 4.51 and the 7 longest
-- (289-339) averaged 3.87, with every prompt >= 323 words grading 3.0-3.6.
--
-- That finding is currently EXPENSIVE to reproduce and impossible to reproduce on
-- failures, because prompt length has to be reconstructed from two different
-- places with two different caps:
--   * a DELIVERED render's full prompt lives on `uploads.ai_prompt`, reachable
--     only by joining bot_run_log.image_url -> uploads;
--   * a FAILED render writes NO uploads row, so its only copy is
--     `bot_run_log.prompt_preview`, capped at 2000 chars (~312 words). Every
--     prompt longer than that reads as exactly 312, which is why the question
--     "do longer prompts trip Replicate's content filter more often?" could not
--     be answered for FarmBot `apiary-beekeeping` (3 E005 in 26 runs) at all:
--     its delivered prompts run 476-613 words, so the cap truncates ALL of them
--     to the same number and the comparison carries no information.
--
-- An integer stamped at emit time fixes both: it is exact, it survives failure,
-- and it makes the length/quality question one GROUP BY away on any bot or path.
--
-- It also guards against over-generalising lesson 54. The 323-word cliff is NOT
-- a portable constant — FarmBot's prompts are nearly twice that (median 578) and
-- its paths grade 3.8-4.4. What appears to generalise is the negative SLOPE
-- within a single path, and only per-path data can show that.
--
-- Cheap by construction: one smallint-range integer per run, no backfill (older
-- rows stay NULL and read as "unknown", which is honest), nothing on a hot path.

ALTER TABLE public.bot_run_log
  ADD COLUMN IF NOT EXISTS prompt_words integer;

COMMENT ON COLUMN public.bot_run_log.prompt_words IS
  'Word count of the final emitted Flux prompt, stamped at render time by '
  'scripts/lib/botEngine.js. Exact on both success and failure, unlike '
  'prompt_preview (capped) and uploads.ai_prompt (absent on failures). '
  'NULL for rows written before migration 546. See playbook lesson 54.';

-- Length-vs-outcome questions are always filtered by bot and path, so index that
-- shape rather than the column alone. Partial: a NULL prompt_words answers
-- nothing, and excluding the pre-546 backlog keeps the index small.
CREATE INDEX IF NOT EXISTS bot_run_log_prompt_words_idx
  ON public.bot_run_log (bot_name, path, prompt_words)
  WHERE prompt_words IS NOT NULL;

-- NOTE: `bot_run_log` is service-role-only (bots write it; no client reads it),
-- so unlike `users` / `uploads` this needs no column-level GRANT. Confirmed
-- against migration 278's column-grant list, which does not include this table.

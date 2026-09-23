-- 545: bot_run_log.sonnet_truncated — make silent prompt truncation MEASURABLE.
--
-- WHY. `botEngine.callClaude()` wrote every bot brief with a hardcoded
-- `maxTokens: 400`. A brief that ran past it came back with
-- `stop_reason: 'max_tokens'`, cut off MID-WORD, and the tail of the Flux prompt
-- — normally the output-order block carrying the path's closing instructions —
-- was silently deleted. Nothing logged it, nothing stamped it, and no render
-- failed, so it went unnoticed for months: measured 2026-09-22 across 1,496 live
-- bot renders at 6.7% fleet-wide and 21.4% on FarmBot (a live public bot).
--
-- The budget is fixed in code (`BRIEF_MAX_TOKENS`), and the API now warns on
-- `stop_reason`. This column is the durable half: a console warning is lost the
-- moment the cron run ends, so without it a future recurrence is invisible again.
-- With it, "did any path truncate this week" is one query:
--
--   SELECT bot, path, count(*) FILTER (WHERE sonnet_truncated) AS truncated,
--          count(*) AS runs
--   FROM public.bot_run_log
--   WHERE created_at > now() - interval '7 days'
--   GROUP BY bot, path HAVING count(*) FILTER (WHERE sonnet_truncated) > 0
--   ORDER BY truncated DESC;
--
-- Nullable with no default: rows written before this migration are genuinely
-- unknown, not false, and NULL says so honestly. Writes come from the service
-- role (bot scripts), so no column-level grant is needed here — `bot_run_log` is
-- not client-read (the migration-278 column-grant rule applies to `users` and
-- `uploads`, not to this table).

ALTER TABLE public.bot_run_log
  ADD COLUMN IF NOT EXISTS sonnet_truncated boolean;

COMMENT ON COLUMN public.bot_run_log.sonnet_truncated IS
  'True when the brief-writing LLM call returned stop_reason=max_tokens, i.e. the Flux prompt was cut off mid-word and its tail silently lost. NULL for rows written before migration 545. See BRIEF_MAX_TOKENS in scripts/lib/botEngine.js.';

-- Partial index: the interesting rows are the rare true ones, so index only those.
CREATE INDEX IF NOT EXISTS bot_run_log_sonnet_truncated_idx
  ON public.bot_run_log (created_at DESC)
  WHERE sonnet_truncated;

-- 226_bot_run_log_source.sql
--
-- Add `source` column to bot_run_log so the dispatcher's path-level
-- shuffle-bag cycle math (botEngine.js getCycledUsedPaths /
-- getRecentPaths) can filter to ONLY dispatcher fires — iter-bot and
-- qa-matrix test runs no longer pollute production cycle state.
--
-- Background: bot_run_log had no source column. Every entry-point
-- (dispatch-bots.js → run-bot.js, iter-bot.js, qa-bot-model-matrix.js)
-- wrote rows with status='ok' indistinguishable from one another. The
-- cycle algorithm reads bot_run_log to determine "which paths have
-- fired in the current cycle" — so a 20-render iter-bot test batch
-- on one path would consume that many cycle slots in the dispatcher's
-- view, breaking round-robin until the cycle naturally wrapped.
--
-- Backfill: old rows default to 'dispatcher' so existing cycle state
-- is preserved (the path-level cycle math will read them as if they
-- were production fires, which historically is approximately true).
-- New rows from iter-bot.js + qa-bot-model-matrix.js will set
-- source='iter-bot' / 'qa-matrix' and be excluded from cycle reads.

ALTER TABLE public.bot_run_log
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'dispatcher';

-- Backfill any pre-existing rows missing the column (DEFAULT above
-- handles it, but explicit for clarity).
UPDATE public.bot_run_log SET source = 'dispatcher' WHERE source IS NULL;

-- Index for the cycle reads: (bot_name, source, created_at DESC) so
-- getCycledUsedPaths' "last N successful dispatcher rows" query stays
-- index-only. The existing bot_run_log_by_bot_idx (bot_name, created_at)
-- can't satisfy the new source filter alone — keep both indexes; query
-- planner picks the more selective one per call.
CREATE INDEX IF NOT EXISTS bot_run_log_by_bot_source_idx
  ON public.bot_run_log (bot_name, source, created_at DESC)
  WHERE status = 'ok';

-- Source values used by current callers:
--   'dispatcher' — scripts/run-bot.js (called by dispatch-bots.js cron)
--   'iter-bot'   — scripts/iter-bot.js (dev iteration batches)
--   'qa-matrix'  — scripts/qa-bot-model-matrix.js (HTML matrix test;
--                  shells out to iter-bot so inherits 'iter-bot' by
--                  default — qa-matrix can override if it wants its
--                  own source tag)
--
-- The cycle math (botEngine.js getCycledUsedPaths + getRecentPaths)
-- filters .eq('source', 'dispatcher') so non-production renders are
-- ignored. Other observability queries (cost-per-bot, failure rate,
-- per-day-volume) can either ignore source or filter on it as needed.

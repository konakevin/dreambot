-- 283_bot_path_cycle.sql (2026-06-18)
--
-- Persisted shuffle-bag state for bot PATH cycling.
--
-- WHY: the old path cycle (botEngine getCycledUsedPaths) reconstructed the bag
-- every run from `position = (all-time dispatcher post count) % cycleSize`. That
-- broke whenever a bot's path roster changed: the all-time count spans every
-- past (smaller, and partly now-removed) path set, so the modulo never realigns
-- to a clean "exhaust all current paths, then reshuffle." Result: long-tenured
-- paths got over-served and freshly-added paths starved — faebot's
-- `fae-natural-village` sat at 0 dispatcher posts ever; gothbot's 5 newest paths
-- at exactly 1 each, while its oldest had 327. (Bots with stable rosters cycled
-- fine — proving roster-change was the cause, not a per-bot defect.)
--
-- MODEL (mirrors the proven bot_dedup seed shuffle-bag): ONE row per path the
-- DISPATCHER has posted in the CURRENT cycle. The engine picks only from current
-- paths NOT present here; when every current path has a row the cycle is
-- complete and ALL rows for that bot are deleted, starting a fresh reshuffled
-- cycle. Roster-change robust: a newly-added path is simply absent (eligible
-- immediately); a removed path's stale row never matches a current path and is
-- ignored (then wiped at the next reset). Recorded ONLY after a successful
-- dispatcher post (failed renders don't burn a cycle slot); iter-bot / qa-matrix
-- runs never touch this table, so testing can't pollute the production cycle.

CREATE TABLE IF NOT EXISTS public.bot_path_cycle (
  bot_name   TEXT NOT NULL,
  path       TEXT NOT NULL,
  posted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (bot_name, path)
);

CREATE INDEX IF NOT EXISTS bot_path_cycle_by_bot_idx
  ON public.bot_path_cycle (bot_name);

-- Service-role writes only (infra; no app/client access). No policies = deny
-- all for anon/authenticated; the service role bypasses RLS.
ALTER TABLE public.bot_path_cycle ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.bot_path_cycle IS
  'Persisted shuffle-bag for bot path cycling: one row per path the dispatcher posted in the current cycle. Cleared (all rows for a bot deleted) when the bot exhausts all current paths, starting a fresh reshuffled cycle. Roster-change robust. Replaces count%cycleSize (botEngine getCycledUsedPaths). Migration 283, 2026-06-18.';

-- Migration 125: Add `model` column to bot_run_log
--
-- Stores the Replicate model that rendered each bot dream (e.g.
-- 'black-forest-labs/flux-1.1-pro' or 'sdxl'). Lets us query "which engine
-- rendered this render" without cross-referencing stdout logs.
--
-- Written by runBot() in scripts/lib/botEngine.js on every render.

ALTER TABLE public.bot_run_log
  ADD COLUMN IF NOT EXISTS model text;

COMMENT ON COLUMN public.bot_run_log.model IS
  'Replicate model string that rendered this bot dream (e.g. "black-forest-labs/flux-1.1-pro", "sdxl", "black-forest-labs/flux-dev"). Null for renders before this column was added.';

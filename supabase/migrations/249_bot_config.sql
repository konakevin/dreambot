-- 249_bot_config.sql — admin-tunable per-bot dials (ADMIN_CONFIG_PLAN.md Phase 5).
--
-- A bot's CADENCE (bot_schedules) and SEEDS (bot_seeds) are already DB-driven, but
-- its creative DIALS — model lineup, medium/vibe locks, chaos/polish toggles — live
-- in scripts/bots/<bot>/index.js (code). This table lets an admin override those
-- dials from the dashboard with no code change. The bot engine overlays this row on
-- the code config at run time: a NULL column / missing row = pure code behavior, so
-- this is fully backwards-compatible.
--
-- NOT here (stays code, by design): paths, pools, archetype templates, medium-style
-- prose, lookRegister pools — creative source modules, not dials.
--
-- Read only by the bot scripts via the service-role client (RLS-locked, no public
-- policy). Run in the dashboard SQL editor. Idempotent.

CREATE TABLE IF NOT EXISTS public.bot_config (
  bot_name                text PRIMARY KEY,
  allowed_models          text[],    -- NULL → bot.allowedModels (code)
  mediums                 text[],    -- NULL → bot.mediums (code)
  vibes                   text[],    -- NULL → bot.vibes (code)
  chaos_enabled           boolean,   -- FALSE disables the chaos layer; NULL/TRUE → code
  two_pass_polish_enabled boolean,   -- toggles bot.twoPassPolish.enabled; NULL → code
  overrides               jsonb,     -- reserved escape hatch (not yet wired)
  updated_at              timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.bot_config IS
  'Per-bot creative dials that override scripts/bots/<bot>/index.js at run time. NULL column / missing row = pure code behavior. Read by the bot scripts (service role). Paths/pools/archetypes stay code.';

-- Service-role-only: bots read this server-side; no client/anon access.
ALTER TABLE public.bot_config ENABLE ROW LEVEL SECURITY;

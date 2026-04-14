-- Migration 110: Split dream_templates into two separate tables
--
-- bot_seeds — bot-specific seeds with lifecycle tracking (used_at, generation, auto-regen)
-- nightly_seeds — slotted templates for user nightly dreams (8 pools × 100 each)
--
-- The old dream_templates table held both, leading to accidental cross-deletion.
-- Two tables make it impossible to contaminate one with operations on the other.

BEGIN;

-- ── 1. Create bot_seeds table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bot_seeds (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category   text NOT NULL,
  template   text NOT NULL,
  disabled   boolean NOT NULL DEFAULT false,
  used_at    timestamptz,
  generation integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bot_seeds_category ON public.bot_seeds(category);
CREATE INDEX IF NOT EXISTS idx_bot_seeds_unused ON public.bot_seeds(category, disabled) WHERE used_at IS NULL AND disabled = false;

ALTER TABLE public.bot_seeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read bot_seeds" ON public.bot_seeds FOR SELECT USING (true);

-- ── 2. Create nightly_seeds table ────────────────────────────────────────
-- No used_at tracking — seeds are permanent, random pick every time.
-- With 100 seeds per pool and 1 dream/night, repeats are rare and look
-- different anyway because medium + vibe + cast vary each time.
CREATE TABLE IF NOT EXISTS public.nightly_seeds (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category   text NOT NULL,
  template   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nightly_seeds_category ON public.nightly_seeds(category);

ALTER TABLE public.nightly_seeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read nightly_seeds" ON public.nightly_seeds FOR SELECT USING (true);

-- ── 3. No data migration ─────────────────────────────────────────────────
-- Bot seeds will be regenerated via scripts/generate-bot-seeds.js
-- Nightly seeds will be generated fresh via scripts/generate-nightly-seeds.js (new 8-pool slotted system)
-- dream_templates kept temporarily until both new tables are verified populated.

COMMIT;

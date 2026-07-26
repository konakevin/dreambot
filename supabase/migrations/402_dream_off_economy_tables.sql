-- 402_dream_off_economy_tables.sql (2026-07-26)
--
-- Dream Off — Step 1 cont. (DREAM_OFF_BUILD_PLAN.md §1 A2 + A4, economy). The
-- money schema: the model-TIER catalog + the per-game escrow POT + its
-- append-only LEDGER, plus the economy engine_config knobs. All-new tables →
-- zero live-table risk; the funding RPCs (fund/donate/submit/settle) land later.
--
-- Escrow model: the pot is a REAL account — sparkles move IN up front (owner
-- pre-fund / member donate) and renders DRAW DOWN. It needs its own ledger
-- because the user-side sparkle_transactions unique index forbids two same-sign
-- rows per (user, reference_id), which a pooled multi-debit game would violate.
--
-- Fairness: a game freezes a tier's model set + slot_price at setup so an admin
-- retuning dream_off_tiers can't change an in-flight game. v1 ships STANDARD only
-- (the 8 STANDARD_MODEL_IDS, all 1 sparkle); premium is schema-ready but inactive.
--
-- pot + ledger get deny-all RLS (service-role only). dream_off_tiers is a
-- read-only catalog (the client shows tier price/models). Re-runnable.

BEGIN;

-- ── Economy knobs (additive engine_config columns) ────────────────────────────
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS dream_off_prize_enabled        boolean NOT NULL DEFAULT false, -- prize pot OFF in v1
  ADD COLUMN IF NOT EXISTS dream_off_donations_enabled    boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dream_off_donation_max_per_day integer NOT NULL DEFAULT 200,
  ADD COLUMN IF NOT EXISTS dream_off_max_prefund_slots     integer NOT NULL DEFAULT 20;
-- Seed the donation cap from the live gift cap (decision 24), then it drifts free.
UPDATE public.engine_config SET dream_off_donation_max_per_day = gift_max_per_day WHERE id = 1;

-- ── dream_off_tiers: the model-tier catalog (read-only; frozen onto the pot) ───
CREATE TABLE IF NOT EXISTS public.dream_off_tiers (
  key        text PRIMARY KEY,               -- 'standard' | 'premium'
  label      text NOT NULL,
  model_ids  text[] NOT NULL,                -- the allowed set for entries in this tier
  slot_price integer NOT NULL CHECK (slot_price > 0),
  is_active  boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 100,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.dream_off_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dream_off_tiers_select ON public.dream_off_tiers;
CREATE POLICY dream_off_tiers_select ON public.dream_off_tiers FOR SELECT USING (true); -- catalog is public-read; writes = service role

-- v1: STANDARD only (the 8 STANDARD_MODEL_IDS, all 1 sparkle → inherently
-- cost-flat + quality-comparable). premium row is schema-ready but INACTIVE with
-- an empty set (the exact premium model set is deferred, DREAM_OFF_PLAN §10).
INSERT INTO public.dream_off_tiers (key, label, model_ids, slot_price, is_active, sort_order) VALUES
  ('standard', 'Standard', ARRAY[
     'black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-2-pro', 'google/gemini-2-image',
     'black-forest-labs/flux-dev', 'black-forest-labs/flux-2-dev', 'black-forest-labs/flux-krea-dev',
     'black-forest-labs/flux-schnell', 'xai/grok-imagine-image'
   ], 1, true, 10),
  ('premium', 'Premium', ARRAY[]::text[], 2, false, 20)
ON CONFLICT (key) DO NOTHING;

-- ── dream_off_pot: per-game escrow account (deny-all RLS; decoupled game_id) ───
CREATE TABLE IF NOT EXISTS public.dream_off_pot (
  game_id       uuid PRIMARY KEY,                                  -- == dream_offs.id; NO FK (decoupled seam)
  tier_key      text NOT NULL REFERENCES public.dream_off_tiers(key),
  slot_price    integer NOT NULL CHECK (slot_price > 0),           -- FROZEN from the tier at setup
  balance       integer NOT NULL DEFAULT 0 CHECK (balance >= 0),   -- live escrow, never negative
  funded_slots  integer NOT NULL DEFAULT 0 CHECK (funded_slots >= 0),
  prize_balance integer NOT NULL DEFAULT 0 CHECK (prize_balance >= 0), -- gated OFF in v1
  status        text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'settling', 'settled')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.dream_off_pot ENABLE ROW LEVEL SECURITY;

-- ── dream_off_pot_ledger: append-only audit of every pot movement (deny-all) ──
CREATE TABLE IF NOT EXISTS public.dream_off_pot_ledger (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id       uuid NOT NULL,
  kind          text NOT NULL
                  CHECK (kind IN ('fund', 'donate', 'spend', 'refund', 'prize_grant', 'prize_reclaim')),
  amount        integer NOT NULL,             -- SIGNED (+credit to pot, -debit from pot)
  balance_after integer NOT NULL,
  reference_id  uuid,                          -- funder-slot ref / entry job_id / refund ref (idempotency key)
  entry_id      uuid,                          -- set on 'spend'/'refund'
  actor_id      uuid,                          -- funder/donor/entrant (pro-rata refunds + provenance)
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (game_id, kind, reference_id)         -- hard idempotency backstop (no double fund/spend/refund)
);
CREATE INDEX IF NOT EXISTS idx_dream_off_pot_ledger_game ON public.dream_off_pot_ledger (game_id);
ALTER TABLE public.dream_off_pot_ledger ENABLE ROW LEVEL SECURITY;

COMMIT;

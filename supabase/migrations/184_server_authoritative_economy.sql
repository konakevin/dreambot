-- Migration 184: server-authoritative sparkle economy + DB-driven model catalog
--
-- Goal: change sparkle prices and add/adjust user-selectable AI models WITHOUT
-- shipping a new client build. Today the model catalog + costs live in the
-- client bundle (constants/imageModels.ts) and the charge happens client-side,
-- so any price/model change needs an app build.
--
-- This migration introduces:
--   1. image_models — the single source of truth for the model catalog + costs.
--      Read by the client picker (via get_image_models) and the server charge.
--   2. charge_sparkles — an IDEMPOTENT dream charge keyed on the jobId. Because
--      it dedupes on reference_id, the client and the server can both attempt
--      the charge and it happens exactly once — making the move to a
--      server-side charge safe across old/new client builds, and fixing the
--      latent double-charge risk on queue/worker retries.
--
-- The client's constants/imageModels.ts is kept as an offline fallback, so the
-- app always has a catalog even before the RPC resolves.

-- ───────────────────────────────────────────────────────────────────────
-- 1. image_models catalog
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.image_models (
  id text PRIMARY KEY,                         -- e.g. 'black-forest-labs/flux-1.1-pro'
  label text NOT NULL,                         -- display name in the picker
  family text NOT NULL,                        -- 'flux-1' | 'flux-2' | 'openai' | 'google' | 'internal'
  sparkle_cost integer NOT NULL DEFAULT 1,     -- what a render with this model costs the user
  cost_cents integer NOT NULL DEFAULT 5,       -- our estimated API cost (logging/reconciliation)
  description text NOT NULL DEFAULT '',         -- one-liner shown under the picker option
  is_default boolean NOT NULL DEFAULT false,   -- the recommended/anchor model
  is_active boolean NOT NULL DEFAULT true,     -- shown in the user-facing picker
  sort_order integer NOT NULL DEFAULT 100,     -- ordering within a family
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.image_models ENABLE ROW LEVEL SECURITY;

-- Catalog is public read (the picker needs it pre-auth on some screens); writes
-- are service-role/admin only (no write policy → clients are denied; service
-- role bypasses RLS).
DROP POLICY IF EXISTS image_models_select ON public.image_models;
CREATE POLICY image_models_select ON public.image_models FOR SELECT USING (true);

-- Seed from the current constants/imageModels.ts + modelPricing.ts values.
-- Picker-visible models (is_active=true):
INSERT INTO public.image_models (id, label, family, sparkle_cost, cost_cents, description, is_default, is_active, sort_order) VALUES
  ('black-forest-labs/flux-schnell',       'Flux 1 Schnell',     'flux-1', 1, 1,  'Fastest render — under 15 seconds.',            false, true, 10),
  ('black-forest-labs/flux-krea-dev',      'Flux Krea',          'flux-1', 1, 1,  'Artistic diffusion — natural aesthetic.',       false, true, 20),
  ('black-forest-labs/flux-dev',           'Flux 1 Dev',         'flux-1', 1, 3,  'Open-weight Flux 1 — artistic, expressive.',    false, true, 30),
  ('black-forest-labs/flux-1.1-pro',       'Flux 1.1 Pro',       'flux-1', 1, 4,  'Recommended — fast, balanced, reliable quality.', true,  true, 40),
  ('black-forest-labs/flux-1.1-pro-ultra', 'Flux 1.1 Pro Ultra', 'flux-1', 2, 6,  'Photoreal 2K — raw mode, natural aesthetics.',  false, true, 50),
  ('black-forest-labs/flux-2-dev',         'Flux 2 Dev',         'flux-2', 1, 3,  'Flux 2 open-weight — improved fidelity, low cost.', false, true, 60),
  ('black-forest-labs/flux-2-pro',         'Flux 2 Pro',         'flux-2', 1, 3,  'Flux 2 — strong quality, balanced cost.',       false, true, 70),
  ('black-forest-labs/flux-2-flex',        'Flux 2 Flex',        'flux-2', 2, 6,  'Flux 2 high-detail tier — slower, richer renders.', false, true, 80),
  ('black-forest-labs/flux-2-max',         'Flux 2 Max',         'flux-2', 3, 7,  'Flux 2 flagship — top prompt fidelity & style.', false, true, 90),
  ('openai/gpt-image-1',                   'GPT Image 1',        'openai', 3, 7,  'High-fidelity, photoreal output.',              false, true, 100),
  ('openai/gpt-image-2',                   'GPT Image 2',        'openai', 2, 6,  'Strong prompt fidelity, excellent in-image text.', false, true, 110),
  ('google/gemini-2-image',                'Nano Banana',        'google', 1, 4,  'Fast and vivid — punchy color, crisp detail.',  false, true, 120),
  ('google/gemini-3-image-preview',        'Nano Banana Pro',    'google', 5, 13, 'Flagship quality — accurate text + fine detail.', false, true, 130),
  -- Internal models (never shown in the picker, present so the server charge +
  -- cost logging can price them):
  ('black-forest-labs/flux-kontext-pro',   'Kontext Pro',        'internal', 1, 4, '', false, false, 900),
  ('black-forest-labs/flux-kontext-max',   'Kontext Max',        'internal', 2, 5, '', false, false, 910),
  ('sdxl',                                 'SDXL',               'internal', 1, 2, '', false, false, 920)
ON CONFLICT (id) DO NOTHING;

-- RPC: the picker reads active models, ordered. SECURITY DEFINER so the public
-- SELECT works uniformly; returns only picker-visible rows.
CREATE OR REPLACE FUNCTION public.get_image_models()
RETURNS SETOF public.image_models
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT * FROM public.image_models WHERE is_active = true ORDER BY sort_order, label;
$$;

GRANT EXECUTE ON FUNCTION public.get_image_models() TO anon, authenticated, service_role;

-- ───────────────────────────────────────────────────────────────────────
-- 2. charge_sparkles — idempotent dream charge keyed on reference_id (jobId)
-- ───────────────────────────────────────────────────────────────────────
-- Returns: 'charged' | 'already_charged' | 'insufficient'.
--   - 'already_charged' when a spend (amount < 0) already exists for this
--     reference_id — so the client AND the server can both attempt the charge
--     for the same jobId and it happens exactly once (safe rollout + retry-safe).
--   - 'insufficient' when balance < amount (no charge made).
CREATE OR REPLACE FUNCTION public.charge_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid
)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_existing integer;
  v_balance integer;
BEGIN
  -- Auth: clients can only charge their own sparkles. Service role bypasses.
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot charge sparkles for a different user';
  END IF;

  IF p_reference_id IS NULL THEN
    RAISE EXCEPTION 'charge_sparkles requires a reference_id for idempotency';
  END IF;

  IF p_amount <= 0 THEN
    RETURN 'charged'; -- nothing to charge (free render)
  END IF;

  -- Bypass the users freeze trigger for the balance update below.
  PERFORM set_config('app.bypass_user_freeze', 'true', true);

  -- Lock the user row so the idempotency check + deduct are atomic.
  SELECT sparkle_balance INTO v_balance FROM public.users WHERE id = p_user_id FOR UPDATE;

  -- Idempotency: already a debit recorded for this jobId → do not charge again.
  SELECT count(*) INTO v_existing
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id AND reference_id = p_reference_id AND amount < 0;

  IF v_existing > 0 THEN
    RETURN 'already_charged';
  END IF;

  IF v_balance < p_amount THEN
    RETURN 'insufficient';
  END IF;

  UPDATE public.users SET sparkle_balance = sparkle_balance - p_amount WHERE id = p_user_id;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id)
    VALUES (p_user_id, -p_amount, p_reason, p_reference_id);

  RETURN 'charged';
END;
$$;

GRANT EXECUTE ON FUNCTION public.charge_sparkles(uuid, integer, text, uuid) TO authenticated, service_role;

COMMENT ON TABLE public.image_models IS
  'Single source of truth for the user-facing AI image-model catalog + sparkle/API costs. Read by the client picker (get_image_models) and the server-side charge (generate-dream). Change a price or add a model here — no client build or deploy required. constants/imageModels.ts is the offline fallback.';
COMMENT ON FUNCTION public.charge_sparkles IS
  'Idempotent dream charge keyed on reference_id (jobId). Returns charged / already_charged / insufficient. Idempotency lets the client and server both attempt the charge for one jobId with no double-charge, and makes worker retries safe.';

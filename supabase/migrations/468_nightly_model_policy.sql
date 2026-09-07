-- NIGHTLY_MODEL_POLICY_PLAN.md (Kevin 2026-09-07): ONE table decides which image model nightly renders on,
-- per surface, and how the cascade falls back. Seeded with TODAY'S effective behaviour (plan §3) so flipping
-- the mode changes nothing until the rows are edited; Kevin's final rows (flux-1.1-pro primary everywhere,
-- random backup from gemini-2-image / flux-2-pro / seedream-4 / grok-imagine-image / flux-dev) are a row
-- edit after the shadow night.
--
-- engine_config.model_policy_mode: 'off' (legacy picker, default) | 'shadow' (legacy renders, the policy
-- resolver runs beside it and stamps policy_shadow:<site>:match|diff) | 'on' (the policy decides).

CREATE TABLE IF NOT EXISTS public.nightly_model_policy (
  surface         text PRIMARY KEY
                  CHECK (surface IN ('couple', 'solo', 'solo_rebuild', 'scene')),
  primary_models  text[] NOT NULL
                  CHECK (cardinality(primary_models) >= 1),
  fallback_models text[] NOT NULL DEFAULT '{}',
  notes           text,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.nightly_model_policy IS
  'Nightly render-model policy per surface (NIGHTLY_MODEL_POLICY_PLAN.md). primary_models: attempt 1 draws uniformly; fallback_models: attempt >= 2 draws uniformly (empty = same model again). The ONLY place nightly model choice lives once engine_config.model_policy_mode = on.';

ALTER TABLE public.nightly_model_policy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nightly_model_policy_read ON public.nightly_model_policy;
CREATE POLICY nightly_model_policy_read ON public.nightly_model_policy
  FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.nightly_model_policy TO authenticated;

-- Seed = today's effective behaviour (computed from the live medium sets + the code's rules, plan §1/§3).
INSERT INTO public.nightly_model_policy (surface, primary_models, fallback_models, notes) VALUES
  ('couple',       ARRAY['black-forest-labs/flux-1.1-pro'],                                 ARRAY[]::text[], 'legacy-equivalent seed 2026-09-07: every couple first-picks 1.1-pro (flex clamped to it); retry = same model'),
  ('solo',         ARRAY['black-forest-labs/flux-1.1-pro','black-forest-labs/flux-2-flex'], ARRAY[]::text[], 'legacy-equivalent seed 2026-09-07: solos draw 1.1-pro or flex'),
  ('solo_rebuild', ARRAY['black-forest-labs/flux-2-flex'],                                  ARRAY[]::text[], 'legacy-equivalent seed 2026-09-07: engine_config.solo_rebuild_model (F2)'),
  ('scene',        ARRAY['black-forest-labs/flux-1.1-pro'],                                 ARRAY[]::text[], 'legacy-equivalent seed 2026-09-07: scene gate ∩ ≤2✦ pool = 1.1-pro only')
ON CONFLICT (surface) DO NOTHING;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS model_policy_mode text NOT NULL DEFAULT 'off'
  CHECK (model_policy_mode IN ('off', 'shadow', 'on'));

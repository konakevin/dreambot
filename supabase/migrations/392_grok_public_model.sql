-- 392_grok_public_model.sql
-- Add xAI Grok (grok-imagine-image) as a PUBLIC, user-facing image model in the
-- Create-screen picker, and enable it for every style in DreamSmart.
--
-- Scope: UI / Create only. Grok is deliberately NOT added to any nightly model
-- pool (the hardcoded FACE_SWAP_MODELS rotation or per-medium allowed_models /
-- scene_eligible_models), and nightly-dreams carries no XAI_API_KEY — so nightly
-- dreams can never roll Grok. DreamSmart's smart_dream_models is a create-mode-
-- only field the nightly path never reads.
--
-- Text-to-image only: the generate-dream / restyle-photo guards re-point Grok to
-- flux-kontext-pro on input-image modes (restyle / reimagine / DLT-with-image).
--
-- Pure DATA (no DDL) — no image_models schema change, so types/database.ts is
-- unaffected. Idempotent + safe to re-run.

-- 1. Catalog row — public (is_active), DreamBot-mode enabled, 1 sparkle (~$0.02).
INSERT INTO public.image_models
  (id, label, family, sparkle_cost, cost_cents, description, is_default, is_active, sort_order, dreambot_enabled)
VALUES
  ('xai/grok-imagine-image', 'Grok Imagine', 'xai', 1, 2,
   'xAI Grok — fast, vivid, imaginative renders.', false, true, 200, true)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  family = EXCLUDED.family,
  sparkle_cost = EXCLUDED.sparkle_cost,
  cost_cents = EXCLUDED.cost_cents,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  dreambot_enabled = EXCLUDED.dreambot_enabled,
  updated_at = now();

-- 2. DreamSmart: enable Grok for EVERY style that has a curated smart set.
--    (Styles with no smart_dream_models are fail-open — all models allowed —
--     so Grok already works there.)
UPDATE public.dream_mediums
SET client_meta = jsonb_set(
      client_meta,
      '{smart_dream_models}',
      (client_meta->'smart_dream_models') || '["xai/grok-imagine-image"]'::jsonb
    )
WHERE client_meta ? 'smart_dream_models'
  AND jsonb_typeof(client_meta->'smart_dream_models') = 'array'
  AND NOT (client_meta->'smart_dream_models' @> '["xai/grok-imagine-image"]');

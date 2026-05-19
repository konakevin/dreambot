-- 174_users_pro_mode_flux_model_drop_check.sql
--
-- Drop the CHECK constraint on users.pro_mode_flux_model.
--
-- Migration 149 added a CHECK constraint allowing only 4 Flux model IDs
-- (flux-dev, flux-1.1-pro, flux-2-dev, flux-2-pro). The Advanced Mode
-- picker now offers 13 models across 3 providers (Replicate Flux 1+2,
-- OpenAI GPT Image 1/2, Google Gemini Nano Banana 2/Pro). The constraint
-- now blocks every new model with `violates check constraint
-- "users_pro_mode_flux_model_check"`.
--
-- The canonical model list is `constants/imageModels.ts` (client-side
-- catalog) + `_shared/modelPricing.ts` (server-side cost authority).
-- Both are maintained in lockstep when adding models — a DB CHECK
-- constraint here would just be a third copy that drifts out of sync.
-- Drop it. Validation is now client-side via the catalog selection UI;
-- bad writes from API misuse would result in render failure at dispatch
-- time, not user-facing data corruption.
--
-- Column name kept (pro_mode_flux_model) for back-compat despite no
-- longer being Flux-specific.

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_pro_mode_flux_model_check;

COMMENT ON COLUMN public.users.pro_mode_flux_model IS
  'User-selected image model for Advanced Mode renders (Create-screen toggle that sends the user prompt verbatim to the model). Values come from constants/imageModels.ts. Default black-forest-labs/flux-1.1-pro. Settings → Advanced Mode.';

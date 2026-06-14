-- 267_image_models_dreambot_enabled.sql
-- Per-model flag for whether a model is offered in the DreamBot-mode model
-- picker (the face-swap engine). Direct mode (raw prompt, no swap) keeps the
-- full catalog. This is the lever to "weed out" a model from face-swap dreams
-- without a deploy — flip the flag in the dashboard.
--
-- Seeded from the 2026-06-13 dual face-swap model audit: every active model
-- does a clean face swap EXCEPT flux-schnell, which produces broken
-- pasted-cutout collages on stylized mediums + the weakest faces on photoreal.
-- So flux-schnell is hidden in DreamBot mode but stays available in Direct mode.
--
-- get_image_models() RETURNS SETOF public.image_models, so the new column flows
-- through the RPC automatically — no function change needed. is_active is left
-- true (the model is still a valid Direct-mode choice).

ALTER TABLE public.image_models
  ADD COLUMN IF NOT EXISTS dreambot_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.image_models.dreambot_enabled IS
  'When false, the model is hidden from the DreamBot-mode (face-swap) picker but still available in Direct mode. Set false to weed a model out of face-swap dreams with no deploy.';

UPDATE public.image_models
  SET dreambot_enabled = false
  WHERE id = 'black-forest-labs/flux-schnell';

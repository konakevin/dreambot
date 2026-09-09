-- 486_farmbot_lock_flux2flex.sql
--
-- FarmBot locked to flux-2-flex only (Kevin 2026-09-08) — his favorite in
-- both the controlled model head-to-head and the real production
-- confirmation batch. Narrows the dream_mediums.allowed_models row for
-- farmbot_cozy_neutral (widened in migration 485) down to just this one
-- model, matching bot.allowedModels in scripts/bots/farmbot/index.js.
UPDATE public.dream_mediums
SET allowed_models = ARRAY['black-forest-labs/flux-2-flex']
WHERE key = 'farmbot_cozy_neutral';

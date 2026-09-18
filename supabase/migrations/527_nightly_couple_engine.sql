-- 527_nightly_couple_engine.sql — 2026-09-18. FLUX COUPLE LAB (Kevin: "make a switch in the engine, leave what's there
-- currently as the live production engine"). 'production' = today's couple composer; 'experimental' = the lab composer
-- (_shared/coupleComposerX.ts), reached in QA through force_couple_engine. Promotion = flipping this row (no deploy).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_couple_engine text NOT NULL DEFAULT 'production';
ALTER TABLE public.engine_config DROP CONSTRAINT IF EXISTS engine_config_nightly_couple_engine_chk;
ALTER TABLE public.engine_config
  ADD CONSTRAINT engine_config_nightly_couple_engine_chk
  CHECK (nightly_couple_engine IN ('production', 'experimental'));
COMMENT ON COLUMN public.engine_config.nightly_couple_engine IS
  'Nightly couple prompt composer: production (assembleCharacterPrompt) or experimental (coupleComposerX, FLUX COUPLE LAB 2026-09-18). QA overrides per request with force_couple_engine.';

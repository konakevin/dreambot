-- 572_outfit_scene_fit.sql — outfits that fit the place (CREATE_OUTFIT_PLAN.md phase 9), 2026-09-28.
--
-- Kevin: "the nightly/create engines like to add weird clothes to people in renders - it will add a colored cuff
-- to their pants, overly formal outfits at the beach". Root cause (michele's feed + 300 delivered prompts):
--   1. the phase 8 fashion roll picked a named look from the cast's genders alone, never the place ("At the
--      Beach!" got a disco look: sequins and platform heels);
--   2. our accent colour and "print, otherwise a trim" pattern landed as cuffs, collars and gloves;
--   3. the brief asked for spectacle ("follow it exactly", "STAND OUT") instead of the place;
--   4. the user's own place words ("beach", "golf", "whales") never counted.
--
-- Scene fit: looks filtered by the render's setting (sceneSetting.ts), no colour trims or cuffs, the brief dresses
-- for the place first (July's "what real people actually wear there", elevated). Both switches OFF. Create is on
-- for create_outfit_preview_user_ids (Kevin) while off. Nightly flips only on Kevin's word (restore point).
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET create_outfit_scene_fit = false, nightly_outfit_scene_fit = false WHERE id = 1;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS create_outfit_scene_fit boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nightly_outfit_scene_fit boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.engine_config.create_outfit_scene_fit IS
  'Create outfits fit the place: looks filtered by setting, no colour trims/cuffs, place-first brief (mig 572, CREATE_OUTFIT_PLAN.md phase 9).';
COMMENT ON COLUMN public.engine_config.nightly_outfit_scene_fit IS
  'Nightly outfits fit the place: looks filtered by setting, place-first brief (mig 572). Flip only on Kevin''s word.';

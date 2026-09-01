-- 451_female_hair_variation_pct.sql
-- NIGHTLY female-hairstyle variation (2026-08-31).
--
-- A cast member's hair is a single static clause from their photo description,
-- so every nightly render gives a woman the exact same hairdo. This adds a
-- live-tunable knob: the % chance that a FEMALE cast member's hair is re-styled
-- (color + approximate length + bangs + natural coily texture all PRESERVED —
-- only the styling varies), biased to the scene register (elegant → updos/glam,
-- active → ponytails/braids). Male hair is never touched. Nightly-only: the paid
-- Create path never applies it.
--
-- Read by _shared/engineConfig.ts → threaded into the nightly slot pipeline
-- (_shared/characterSlotPrompt.ts → _shared/femaleHairVariation.ts).
--
-- Ships at 0 (inert) so the deploy changes nothing; flip to 75 (Kevin's target,
-- 2026-08-31) after QA:  UPDATE public.engine_config SET female_hair_variation_pct = 75;
--
-- Run in the Supabase dashboard SQL editor.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS female_hair_variation_pct numeric NOT NULL DEFAULT 0;

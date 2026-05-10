-- 160 — Dream-eligible curation
--
-- Decouples "what users can pick in the create screen" from "what nightly
-- auto-rolls". The create screen continues to show all is_active mediums/vibes;
-- the nightly engine picks ONLY from is_dream_eligible=true.
--
-- This lets us curate quality at the auto-gen layer without hiding options
-- from manual creation. Onboarding's medium/vibe selection screens become
-- redundant — see follow-up commit that strips them.

ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS is_dream_eligible boolean NOT NULL DEFAULT false;

ALTER TABLE public.dream_vibes
  ADD COLUMN IF NOT EXISTS is_dream_eligible boolean NOT NULL DEFAULT false;

-- Curated dream-eligible mediums (Kevin 2026-05-09)
-- 8 natural-render face-swap-compatible + 2 embodied (lego, vinyl)
UPDATE public.dream_mediums
SET is_dream_eligible = true
WHERE key IN (
  'canvas',
  'render',
  'watercolor',
  'pencil',
  'illustration',
  'storybook',
  'fairytale',
  'anime',
  'lego',
  'vinyl'
);

-- Curated dream-eligible vibes — all active EXCEPT coquette
-- coquette is banned because it forces female-coded rendering even on male
-- subjects, breaking gender preservation
UPDATE public.dream_vibes
SET is_dream_eligible = true
WHERE is_active = true AND key != 'coquette';

NOTIFY pgrst, 'reload schema';

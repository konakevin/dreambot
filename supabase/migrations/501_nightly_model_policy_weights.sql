-- 501_nightly_model_policy_weights.sql — weighted model roll (Kevin 2026-09-12: "since these three models have been
-- approved, we just roll between them at different percentages — weight flux 1.1pro higher, but it's still a random
-- roll"). primary_weights / fallback_weights are parallel to primary_models / fallback_models (same length; a missing
-- or shorter array means equal weights, so existing rows keep today's uniform behaviour). The resolver rolls a
-- weighted pick among the non-banned primaries on attempt 1 and among the fallbacks on a retry; the LOOK is then
-- rolled from nightly_look_approvals for the model that won (a dual dream and a single dream draw from different
-- model × look pools). Still inert while engine_config.model_policy_mode = shadow.
ALTER TABLE public.nightly_model_policy
  ADD COLUMN IF NOT EXISTS primary_weights numeric[] NOT NULL DEFAULT '{}'::numeric[],
  ADD COLUMN IF NOT EXISTS fallback_weights numeric[] NOT NULL DEFAULT '{}'::numeric[];

-- Starting split for the three approved models (Kevin tunes from the dashboard): couples and solos roll
-- flux-1.1-pro 50 % · gemini-2-image 25 % · grok-imagine-image 25 %; a retry draws from the other two + flux-2-pro.
UPDATE public.nightly_model_policy SET
  primary_models  = ARRAY['black-forest-labs/flux-1.1-pro','google/gemini-2-image','xai/grok-imagine-image']::text[],
  primary_weights = ARRAY[50, 25, 25]::numeric[],
  fallback_models = ARRAY['google/gemini-2-image','xai/grok-imagine-image','black-forest-labs/flux-2-pro']::text[],
  fallback_weights = ARRAY[45, 45, 10]::numeric[],
  notes = 'Kevin 2026-09-12: weighted roll among the three matrix-approved models; looks roll from approvals for the winner (mig 498/499). Tune weights here, no deploy.',
  updated_at = now()
WHERE surface IN ('couple', 'solo');
UPDATE public.nightly_model_policy SET
  primary_models = ARRAY['black-forest-labs/flux-1.1-pro','google/gemini-2-image','xai/grok-imagine-image']::text[],
  primary_weights = ARRAY[50, 25, 25]::numeric[],
  notes = 'Scene-only renders (no cast): same weighted roll; any active look is allowed (no swap constraint).',
  updated_at = now()
WHERE surface = 'scene';
-- solo_rebuild stays flux-2-flex (the F2 rebuild model) until the rebuild path is revisited with the looks.

-- 212_dream_mediums_add_native_provider_models.sql
--
-- Adds the 4 models that were missing from every dream_medium's
-- allowed_models array:
--   google/gemini-2-image                  (Nano Banana — native Gemini)
--   openai/gpt-image-2                     (GPT Image 2 — native OpenAI)
--   black-forest-labs/flux-2-flex          (Flux 2 Flex)
--   black-forest-labs/flux-2-max           (Flux 2 Max)
--
-- Why: when these models were enabled in ALL_ENABLED_AI_MODELS
-- (scripts/lib/imageModels.js), the per-bot allowedModels arrays were
-- updated to include them — but dream_mediums.allowed_models was never
-- updated. The bot engine picker (scripts/lib/modelPicker.js) intersects
-- bot.allowedModels with the medium's allowed_models, so any model
-- absent from the medium list was silently excluded for every bot.
--
-- The 12h bot-upload audit on 2026-05-31 showed Banana + GPT-2 at 0%
-- post-distribution (and Flux 2 Flex + Flux 2 Max barely picked) —
-- this is why. The bot-level audit work was correct; the medium-level
-- backstop was just stale.
--
-- This migration:
--   - APPENDS the 4 missing models to every medium that ALREADY has a
--     non-empty allowed_models list (24 mediums).
--   - EXCEPTION: hyperreal stays pinned to flux-1.1-pro-ultra alone.
--     Ultra renders at 4MP for photoreal fidelity; the other 4 models
--     render at 1K or 1024×1536 — adding them would lose the resolution
--     justification. This is the only intentional single-model pin.
--   - Leaves the 48 mediums with NULL/empty allowed_models alone — they
--     already fall through to bot.allowedModels (no per-medium gating).
--
-- Idempotent: ON CONFLICT-style array deduplication via array(SELECT DISTINCT…)
-- so re-running this migration is a no-op.

UPDATE public.dream_mediums
SET allowed_models = (
  SELECT ARRAY(
    SELECT DISTINCT unnest(
      allowed_models || ARRAY[
        'google/gemini-2-image',
        'openai/gpt-image-2',
        'black-forest-labs/flux-2-flex',
        'black-forest-labs/flux-2-max'
      ]::text[]
    )
  )
)
WHERE allowed_models IS NOT NULL
  AND array_length(allowed_models, 1) > 0
  AND key <> 'hyperreal';

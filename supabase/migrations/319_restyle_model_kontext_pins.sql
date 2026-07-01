-- Migration 319: move the 6 Real Face restyle pins off Nano Banana 2 → Kontext.
--
-- Context (2026-07-01): migration 294 pinned the 6 Real Face restyle mediums
-- (pencil, comics, illustration, storybook, watercolor, canvas) to
-- google/gemini-2-image (Nano Banana 2) via client_meta.restyle_model. NB2
-- silently REFUSES style-transfer edits — it returns a lightly reprocessed
-- copy of the source photo (verified by direct API reproduction across
-- prompt/config/modality variants; NB Pro and Kontext restyle the same
-- image + prompt correctly). Every restyle on these mediums shipped a
-- photo-copy.
--
-- The restyle model is now a USER CHOICE on the Create screen
-- (components/RestyleModelPicker.tsx): Kontext (default, 1✦) or Nano Banana
-- Pro (5✦), sent as force_model and priced per model by enqueue-dream. These
-- pins remain only as the FALLBACK for requests without a force_model (older
-- clients) — point them at Kontext so that fallback actually restyles.
--
-- LEGO / Vinyl are untouched: they use client_meta.restyle_models (the
-- flux-dev rebuild pool, migration 301), not restyle_model.
--
-- APPLIED TO PROD via service-role PostgREST on 2026-07-01 (data-only change;
-- this file is the record).

UPDATE public.dream_mediums
SET client_meta = coalesce(client_meta, '{}'::jsonb)
  || '{"restyle_model": "black-forest-labs/flux-kontext-pro"}'::jsonb
WHERE key IN ('pencil', 'comics', 'illustration', 'storybook', 'watercolor', 'canvas')
  AND client_meta->>'restyle_model' = 'google/gemini-2-image';

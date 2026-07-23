-- 395_canvas_gemini3_fragment_override.sql
--
-- Per-model flux_fragment override for canvas + Nano Banana Pro
-- (google/gemini-3-image-preview). NB Pro literalizes canvas's surface nouns
-- ("oil painting on stretched canvas", "canvas weave texture") and renders a
-- photograph of a physical canvas on a wooden easel instead of making the whole
-- image an oil painting (2026-07-23, confirmed on the dual render). The override
-- is a technique-only, frame-filling fragment with NO object nouns.
--
-- Read by _shared/dreamStyles.ts (ResolvedMedium.fluxFragmentByModel) and applied
-- in generate-dream ONLY for the model forced on that render — every other model
-- keeps the base canvas.flux_fragment untouched, so this cannot regress them
-- (gemini-2 / gpt / flux all render canvas correctly today and are unaffected).
-- Already applied live via service-role on 2026-07-23; this file is the record.
--
-- Idempotent: merges the one model key into any existing flux_fragment_by_model.

UPDATE public.dream_mediums
SET client_meta = jsonb_set(
      COALESCE(client_meta, '{}'::jsonb),
      '{flux_fragment_by_model}',
      COALESCE(client_meta -> 'flux_fragment_by_model', '{}'::jsonb)
        || jsonb_build_object(
             'google/gemini-3-image-preview',
             'the entire image is one continuous oil painting, thick visible brushstrokes and palette-knife texture across every surface, heavy impasto paint ridges catching the light, rich saturated oil pigments, classical chiaroscuro lighting, luminous glazed layers, painterly rendering filling the whole frame edge to edge'
           )
    )
WHERE key = 'canvas';

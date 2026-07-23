-- 394_dreamsmart_flux11_all_styles.sql
--
-- Enable Flux 1.1 Pro + Flux 1.1 Pro Ultra for EVERY active style's DreamSmart
-- set. Regrade decision (2026-07-23, DREAMSMART_MODEL_VALIDATION.md): the self
-- face-swap matrix (scripts/model-matrix-swap.js) across all 20 active styles
-- showed both durable Flux 1.1 models render every style acceptably, so they were
-- previously excluded too aggressively (photography-only per the original
-- SMART_DREAM_PLAN grading). Both are ≤2✦ (1✦ / 2✦), so they're nightly-eligible.
--
-- Idempotent: only appends the two ids where missing (jsonb set-union), preserving
-- existing membership + smart_dream_default. Already applied live via service-role
-- on 2026-07-23; this file is the source of record.
--
-- Membership is a SET (order-independent); the create-screen auto-select is
-- MODEL_DISPLAY_ORDER-first, not array-order. No edge redeploy needed — the
-- coercion reads client_meta at request time.

UPDATE public.dream_mediums AS m
SET client_meta = jsonb_set(
      COALESCE(m.client_meta, '{}'::jsonb),
      '{smart_dream_models}',
      (
        -- existing set ∪ {flux-1.1-pro, flux-1.1-pro-ultra}, de-duplicated,
        -- existing order preserved then the two ids appended if absent.
        SELECT to_jsonb(array_agg(DISTINCT val ORDER BY ord))
        FROM (
          SELECT val, MIN(ord) AS ord
          FROM (
            SELECT elem AS val, idx AS ord
            FROM jsonb_array_elements_text(
                   COALESCE(m.client_meta -> 'smart_dream_models', '[]'::jsonb)
                 ) WITH ORDINALITY AS t(elem, idx)
            UNION ALL
            SELECT * FROM (VALUES
              ('black-forest-labs/flux-1.1-pro', 1000000),
              ('black-forest-labs/flux-1.1-pro-ultra', 1000001)
            ) AS extra(elem, idx)
          ) unioned
          GROUP BY val
        ) deduped
      )
    )
WHERE m.is_active = true
  AND m.client_meta ? 'smart_dream_models';

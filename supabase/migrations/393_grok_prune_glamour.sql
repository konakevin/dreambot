-- 393_grok_prune_glamour.sql
-- Grok single-char face-swap STYLE MATRIX (2026-07-22): rendered Kevin into all
-- 20 user-facing styles on Grok and graded style fidelity. Grok faithfully
-- recreates 19/20 — all 8 dream-art (embodied) styles + 11 of 12 real-face.
--
-- Two misses pruned (Kevin's review):
--   * glamour        — Grok renders a sharp photoreal portrait, ignoring the
--                      soft-focus dreamy-glamour grade.
--   * double_exposure — the Grok result was ugly (poor blend).
-- (Kevin reviewed film_noir + pop_art — also auto-grader-flagged — and KEPT
--  them; he liked those renders.)
--
-- Prune Grok from these styles' DreamSmart sets. smart_dream_models is shared,
-- so this removes Grok in BOTH the Create picker and nightly. Pure DATA (no DDL).
-- Idempotent. Net after mig 392 + this: Grok in 18/20 styles.

UPDATE public.dream_mediums
SET client_meta = jsonb_set(
      client_meta,
      '{smart_dream_models}',
      COALESCE(
        (SELECT jsonb_agg(m)
         FROM jsonb_array_elements_text(client_meta->'smart_dream_models') AS m
         WHERE m <> 'xai/grok-imagine-image'),
        '[]'::jsonb
      )
    )
WHERE key IN ('glamour', 'double_exposure')
  AND client_meta->'smart_dream_models' @> '["xai/grok-imagine-image"]';

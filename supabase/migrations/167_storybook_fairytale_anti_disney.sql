-- 167 — Rewrite face_swap_flux_fragment for fairytale + storybook to anchor
-- in European storybook plate tradition (where adult faces are the norm)
-- instead of Disney character design (where chibi/princess proportions are
-- the norm). ONLY the face-swap override is updated — the regular
-- flux_fragment keeps its Disney-positive wording for non-face-swap renders.
--
-- WHY: dual face-swap renders were producing Disney-princess oversized eyes
-- on female characters even with "NOT Disney princess eyes" in the override.
-- Diffusion models like Flux process the WHOLE prompt as positive tokens —
-- "NOT Disney" still activates the "Disney" concept. The fix is to remove
-- Disney-positive anchors entirely from the face-swap path and replace them
-- with European storybook illustration anchors (Arthur Rackham / Edmund
-- Dulac / NC Wyeth tradition). Anatomy constraints are phrased POSITIVELY
-- ("anatomically correct facial proportions, normal-sized eyes with visible
-- eyelids") instead of as negatives. See ChatGPT consultation 2026-05-10.

-- ── Fairytale (face-swap override only) ──────────────────────────────
UPDATE public.dream_mediums SET
  face_swap_flux_fragment = 'hand-drawn 2D fairy tale illustration in classic European storybook plate style, ink linework with watercolor wash, painterly hand-painted backgrounds, flowing organic linework, warm golden hour lighting, rich warm color palette, strictly 2D illustration (not 3D CGI, not photoreal), adult characters with anatomically correct facial proportions, realistic head and skull structure, normal-sized eyes with visible eyelids, natural brow shape, subtle facial features, clean readable faces designed for portrait-style clarity'
WHERE key = 'fairytale';

-- ── Storybook (face-swap override only) ──────────────────────────────
UPDATE public.dream_mediums SET
  face_swap_flux_fragment = 'picture book illustration, watercolor and gouache techniques, visible brush texture, soft hand-drawn linework, printed page quality, cozy intimate feeling, warm golden color palette, painterly lighting, strictly 2D illustration (not 3D CGI, not photoreal), adult characters with natural realistic facial anatomy, normal-sized eyes with visible eyelids, subtle facial features, clean readable faces for face-swap compatibility'
WHERE key = 'storybook';

NOTIFY pgrst, 'reload schema';

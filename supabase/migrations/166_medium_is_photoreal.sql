-- 166 — is_photoreal flag on dream_mediums
--
-- Photoreal mediums (hyperreal / render / photography) keep face_swaps=true
-- so users can manually pick them in the create flow, but they should NOT
-- be auto-rolled by nightly for character renders — face-swapping a real
-- person's face onto a generic photoreal subject produces uncanny composites.
-- Stylized mediums (watercolor / anime / canvas / etc.) handle face swaps
-- cleanly because the medium hides seam artifacts.
--
-- The nightly picker now uses the 'dream_eligible_face_swap' resolver mode
-- which filters: is_dream_eligible=true AND face_swaps=true AND is_photoreal=false.

ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS is_photoreal boolean NOT NULL DEFAULT false;

UPDATE public.dream_mediums SET is_photoreal = true WHERE key IN ('hyperreal', 'render', 'photography');

NOTIFY pgrst, 'reload schema';

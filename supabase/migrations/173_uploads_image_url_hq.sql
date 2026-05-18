-- 173_uploads_image_url_hq.sql
--
-- Add `image_url_hq` to uploads — caches the 4K Real-ESRGAN upscale of
-- the original render so subsequent long-press downloads can return the
-- HQ version instantly (no re-upscale).
--
-- Population is on-demand: the `upscale-image` Edge Function runs Real-
-- ESRGAN 4× the first time a Pro user requests HQ download of a post,
-- writes the resulting URL here. Subsequent requests for the same post
-- short-circuit and download directly.
--
-- Nullable + indexed on (image_url_hq IS NULL) so the lookup path is
-- "exists yet?" — fast partial index, no full-table scan.

ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS image_url_hq TEXT,
  ADD COLUMN IF NOT EXISTS image_url_hq_generated_at TIMESTAMPTZ;

COMMENT ON COLUMN public.uploads.image_url_hq IS
  '4K upscaled version of image_url. Populated on-demand by upscale-image Edge Function when a Pro user long-presses to save. NULL until first upscale request.';

-- Partial index — only rows that have been upscaled. Used by analytics
-- and to find candidates for re-upscale if we ever change models.
CREATE INDEX IF NOT EXISTS uploads_image_url_hq_present_idx
  ON public.uploads (id)
  WHERE image_url_hq IS NOT NULL;

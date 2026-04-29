-- Perceptual hash column for visual-duplicate detection.
-- SHA-256 (output_hash, migration 132) misses the yan-ops/face_swap bug
-- because returned bytes vary slightly per call (different JPEG
-- re-encoding) but pixels are visually identical. aHash 64-bit
-- fingerprint stored as 16-char hex catches it via Hamming-distance
-- comparison in the Edge Function.
--
-- output_hash kept for cryptographic byte-identity audit; output_phash
-- is the active duplicate-detection field.

ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS output_phash text;

CREATE INDEX IF NOT EXISTS idx_uploads_user_phash_recent
  ON public.uploads(user_id, created_at DESC)
  WHERE output_phash IS NOT NULL;

-- output_hash on uploads — used to detect duplicate face-swap outputs
-- (rare yan-ops/face_swap warm-container leak that returns the same bytes
-- across different prediction IDs). Edge Function hashes the persisted
-- bytes and queries this index before insert; on hit, retries the face
-- swap with a fresh source perturbation.

ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS output_hash text;

-- Compound index: scoped lookups per user, only rows with a hash.
-- Most queries are "give me this user's uploads in the last 24h that
-- match a hash" — index supports that fast.
CREATE INDEX IF NOT EXISTS idx_uploads_user_hash_recent
  ON public.uploads(user_id, output_hash, created_at DESC)
  WHERE output_hash IS NOT NULL;

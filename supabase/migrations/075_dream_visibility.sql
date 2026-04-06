-- Add visibility column to uploads for public/private dream support.
-- Public dreams appear in the feed; private dreams are saved to My Dreams only.

ALTER TABLE uploads
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public';

-- Index for My Dreams queries (user's own dreams)
CREATE INDEX IF NOT EXISTS idx_uploads_user_dreams
  ON uploads (user_id, created_at DESC);

-- Set is_ai_generated default to true (everything is AI now)
ALTER TABLE uploads ALTER COLUMN is_ai_generated SET DEFAULT true;

-- Set media_type default to 'image' (video was removed)
ALTER TABLE uploads ALTER COLUMN media_type SET DEFAULT 'image';

-- Set categories default to ['art']
ALTER TABLE uploads ALTER COLUMN categories SET DEFAULT ARRAY['art']::text[];

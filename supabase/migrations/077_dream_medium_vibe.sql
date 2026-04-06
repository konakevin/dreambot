-- Add medium and vibe tracking to uploads.
-- Stores the resolved medium/vibe key used to generate each dream.

ALTER TABLE uploads ADD COLUMN IF NOT EXISTS dream_medium text;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS dream_vibe text;

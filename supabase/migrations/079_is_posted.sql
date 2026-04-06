-- Add is_posted to separate "on my profile" from "in the feed"
-- is_posted = true: visible on your public profile grid, friends can see
-- is_active = true: pushed into the algorithmic home feed
-- Both false = private (My Dreams only)

ALTER TABLE uploads ADD COLUMN IF NOT EXISTS is_posted boolean NOT NULL DEFAULT false;

-- Backfill: existing active posts are posted
UPDATE uploads SET is_posted = true WHERE is_active = true;

-- Allow users to update their own uploads (needed for post/unpost toggle)
CREATE POLICY "Users can update their own uploads"
  ON public.uploads FOR UPDATE
  USING (auth.uid() = user_id);

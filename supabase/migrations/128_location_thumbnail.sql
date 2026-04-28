-- Add thumbnail_url column for location picker cover images
ALTER TABLE public.location_cards
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

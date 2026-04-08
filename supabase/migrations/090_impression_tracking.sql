-- Phase 4: Impression tracking for engagement RATE calculation.
-- Records when a post is viewed (on-screen for >1 second).
-- Denormalizes to view_count on uploads for fast feed scoring.

-- Impressions table (one row per user per post, upserted)
CREATE TABLE IF NOT EXISTS public.post_impressions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  upload_id  uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  view_count integer NOT NULL DEFAULT 1,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, upload_id)
);

CREATE INDEX IF NOT EXISTS idx_post_impressions_upload ON public.post_impressions(upload_id);
CREATE INDEX IF NOT EXISTS idx_post_impressions_user ON public.post_impressions(user_id, last_seen DESC);

-- Enable RLS
ALTER TABLE public.post_impressions ENABLE ROW LEVEL SECURITY;

-- Users can insert/update their own impressions
CREATE POLICY "Users can insert own impressions"
  ON public.post_impressions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own impressions"
  ON public.post_impressions FOR UPDATE
  USING (auth.uid() = user_id);

-- Add view_count to uploads
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

-- RPC to record an impression (upsert + increment denormalized count)
CREATE OR REPLACE FUNCTION public.record_impression(p_user_id uuid, p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existed boolean;
BEGIN
  -- Upsert the impression row
  INSERT INTO public.post_impressions (user_id, upload_id)
  VALUES (p_user_id, p_upload_id)
  ON CONFLICT (user_id, upload_id)
  DO UPDATE SET
    view_count = public.post_impressions.view_count + 1,
    last_seen = now();

  -- Check if this was a new impression (first view by this user)
  -- Only increment uploads.view_count on first view to get unique viewer count
  GET DIAGNOSTICS v_existed = ROW_COUNT;
  IF v_existed = 1 THEN
    -- Use xmax = 0 trick: if xmax is 0, the row was inserted (not updated)
    IF EXISTS (
      SELECT 1 FROM public.post_impressions
      WHERE user_id = p_user_id AND upload_id = p_upload_id AND view_count = 1
    ) THEN
      UPDATE public.uploads SET view_count = view_count + 1 WHERE id = p_upload_id;
    END IF;
  END IF;
END;
$$;

-- Phase 2: Denormalize share_count and save_count onto uploads.
-- These columns feed the engagement velocity scoring in get_feed.

-- Add columns
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS share_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS save_count integer NOT NULL DEFAULT 0;

-- Backfill share_count from existing post_shares
UPDATE public.uploads u
SET share_count = sub.cnt
FROM (
  SELECT upload_id, COUNT(*)::integer AS cnt
  FROM public.post_shares
  GROUP BY upload_id
) sub
WHERE u.id = sub.upload_id;

-- Backfill save_count from existing favorites
UPDATE public.uploads u
SET save_count = sub.cnt
FROM (
  SELECT upload_id, COUNT(*)::integer AS cnt
  FROM public.favorites
  GROUP BY upload_id
) sub
WHERE u.id = sub.upload_id;

-- Trigger: share_count
CREATE OR REPLACE FUNCTION public.update_share_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE uploads SET share_count = share_count + 1 WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE uploads SET share_count = share_count - 1 WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_share_count ON public.post_shares;
CREATE TRIGGER trg_share_count
  AFTER INSERT OR DELETE ON public.post_shares
  FOR EACH ROW EXECUTE FUNCTION public.update_share_count();

-- Trigger: save_count
CREATE OR REPLACE FUNCTION public.update_save_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE uploads SET save_count = save_count + 1 WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE uploads SET save_count = save_count - 1 WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_save_count ON public.favorites;
CREATE TRIGGER trg_save_count
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_save_count();

-- Fix like_count trigger — add SECURITY DEFINER so it bypasses RLS.
-- The original trigger was running as the caller and failing silently
-- when the UPDATE RLS policy on uploads was missing.

CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE uploads SET like_count = like_count + 1 WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE uploads SET like_count = like_count - 1 WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_like_count ON likes;
CREATE TRIGGER trg_like_count
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- Full-text search on uploads for post/photo search.
-- Combines ai_prompt, caption, dream_medium, and dream_vibe into a single tsvector.

ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS search_tsv tsvector;

-- Backfill existing rows
UPDATE public.uploads
SET search_tsv = to_tsvector('english',
  COALESCE(ai_prompt, '') || ' ' ||
  COALESCE(caption, '') || ' ' ||
  COALESCE(dream_medium, '') || ' ' ||
  COALESCE(dream_vibe, '')
);

-- GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_uploads_search_tsv
  ON public.uploads USING gin (search_tsv);

-- Auto-update trigger on insert/update
CREATE OR REPLACE FUNCTION uploads_search_tsv_trigger()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_tsv := to_tsvector('english',
    COALESCE(NEW.ai_prompt, '') || ' ' ||
    COALESCE(NEW.caption, '') || ' ' ||
    COALESCE(NEW.dream_medium, '') || ' ' ||
    COALESCE(NEW.dream_vibe, '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_uploads_search_tsv
  BEFORE INSERT OR UPDATE OF ai_prompt, caption, dream_medium, dream_vibe
  ON public.uploads
  FOR EACH ROW
  EXECUTE FUNCTION uploads_search_tsv_trigger();

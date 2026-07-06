-- 331: Hashtags (HASHTAGS_PLAN.md)
--
-- Tappable #tags in post captions → /hashtag/[tag] page of matching public
-- posts. Join table + write-time extraction from uploads.description (the
-- user-visible caption column — uploads.caption holds prompt text, NOT the
-- caption the user sees).
--
-- The table only ever contains PUBLIC posts: the sync trigger prunes all rows
-- the moment a post goes private and re-inserts on re-post, so tag-page
-- queries, header counts, and search_hashtags counts are all accurate with no
-- read-time is_public filtering and no private-tag leakage.
--
-- Client writes are impossible (SELECT-only grants); the trigger is
-- SECURITY DEFINER so a normal user's uploads UPDATE can maintain the rows.

-- ── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE public.post_hashtags (
  upload_id  uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  tag        text NOT NULL,                     -- normalized: lowercase, no '#'
  -- Copy of the post time so tag pages order reverse-chron without a join.
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (upload_id, tag)
);

CREATE INDEX post_hashtags_tag_idx ON public.post_hashtags (tag, created_at DESC);

ALTER TABLE public.post_hashtags ENABLE ROW LEVEL SECURITY;

CREATE POLICY post_hashtags_read ON public.post_hashtags
  FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON public.post_hashtags TO anon, authenticated;

-- ── Extraction ───────────────────────────────────────────────────────────────

-- First 10 distinct tags, in caption order. Lowercased, 2-30 chars of
-- [a-z0-9_] (no unicode v1 — matches the client-side regex in lib/hashtags.ts).
-- The 10-tag cap keeps a pasted tag-wall from bloating the table.
CREATE OR REPLACE FUNCTION public.extract_hashtags(p_text text)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(array_agg(tag ORDER BY first_ord), '{}'::text[])
  FROM (
    SELECT tag, min(ord) AS first_ord
    FROM (
      SELECT m[1] AS tag, row_number() OVER () AS ord
      FROM regexp_matches(lower(coalesce(p_text, '')), '#([a-z0-9_]{2,30})', 'g') AS m
    ) raw
    GROUP BY tag
    ORDER BY min(ord)
    LIMIT 10
  ) deduped
$$;

-- ── Sync trigger ─────────────────────────────────────────────────────────────

-- Diff-syncs post_hashtags to the current description on every relevant
-- uploads write. Private/unposted → empty tag set → all rows pruned; going
-- public (newPost sets description + is_public together) → rows inserted with
-- created_at = posted_at. Cheap on the hot INSERT path (renders insert
-- private, description-null rows → the DELETE is a no-op PK lookup).
CREATE OR REPLACE FUNCTION public.sync_post_hashtags()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tags text[];
BEGIN
  IF NEW.is_public IS TRUE THEN
    v_tags := public.extract_hashtags(NEW.description);
  ELSE
    v_tags := '{}'::text[];
  END IF;

  DELETE FROM public.post_hashtags
  WHERE upload_id = NEW.id
    AND NOT (tag = ANY (v_tags));

  INSERT INTO public.post_hashtags (upload_id, tag, created_at)
  SELECT NEW.id, t, COALESCE(NEW.posted_at, now())
  FROM unnest(v_tags) AS t
  ON CONFLICT (upload_id, tag) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_post_hashtags_trigger
  AFTER INSERT OR UPDATE OF description, is_public, posted_at
  ON public.uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_post_hashtags();

-- ── Search RPC ───────────────────────────────────────────────────────────────

-- Tag prefix search with post counts for the Top-tab search "Tags" section.
-- Strips any '#'/junk from the prefix server-side so the client can pass the
-- raw query. Empty prefix returns the top tags (harmless; the client gates on
-- 2+ chars anyway).
CREATE OR REPLACE FUNCTION public.search_hashtags(p_prefix text, p_limit int DEFAULT 10)
RETURNS TABLE (tag text, post_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ph.tag, count(*) AS post_count
  FROM public.post_hashtags ph
  WHERE ph.tag LIKE regexp_replace(lower(coalesce(p_prefix, '')), '[^a-z0-9_]', '', 'g') || '%'
  GROUP BY ph.tag
  ORDER BY count(*) DESC, ph.tag ASC
  LIMIT LEAST(GREATEST(coalesce(p_limit, 10), 1), 50)
$$;

GRANT EXECUTE ON FUNCTION public.search_hashtags(text, int) TO anon, authenticated;

-- ── Backfill ─────────────────────────────────────────────────────────────────

-- Index existing public captions (idempotent — safe to re-run).
INSERT INTO public.post_hashtags (upload_id, tag, created_at)
SELECT u.id, t, COALESCE(u.posted_at, u.created_at, now())
FROM public.uploads u
CROSS JOIN LATERAL unnest(public.extract_hashtags(u.description)) AS t
WHERE u.is_public IS TRUE
  AND u.description LIKE '%#%'
ON CONFLICT (upload_id, tag) DO NOTHING;

-- Migration 011: multi-category support + Art category
-- Replaces the single `category` text column with a `categories text[]` array.
-- Posts can now belong to one or more categories.

-- 1. Add the new array column (default empty, filled from existing category data below)
ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS categories text[] NOT NULL DEFAULT '{}';

-- 2. Migrate all existing rows: copy category → categories
UPDATE public.uploads
  SET categories = ARRAY[category]
  WHERE categories = '{}' AND category IS NOT NULL;

-- 3. GIN index for fast containment queries (WHERE 'food' = ANY(categories))
CREATE INDEX IF NOT EXISTS uploads_categories_gin
  ON public.uploads USING GIN (categories);

-- 4. Drop the view that depends on category, drop the column, recreate the view
DROP VIEW IF EXISTS public.uploads_with_score;

ALTER TABLE public.uploads
  DROP COLUMN IF EXISTS category;

-- Convert user_category_affinity.category from the enum to plain text,
-- then drop the now-unused enum type
ALTER TABLE public.user_category_affinity
  ALTER COLUMN category TYPE text USING category::text;

DROP TYPE IF EXISTS public.category;

CREATE VIEW public.uploads_with_score AS
  SELECT
    *,
    CASE
      WHEN total_votes = 0 THEN NULL
      ELSE ROUND((rad_votes::decimal / total_votes) * 100, 1)
    END AS hotness_score
  FROM public.uploads
  WHERE is_active = true AND (is_approved = true OR is_approved IS NULL);

-- 5. Recreate get_feed to return categories text[] instead of category text
DROP FUNCTION IF EXISTS public.get_feed(uuid, integer);

CREATE FUNCTION public.get_feed(p_user_id uuid, p_limit integer DEFAULT 50)
RETURNS TABLE(
  id            uuid,
  user_id       uuid,
  categories    text[],
  image_url     text,
  media_type    text,
  thumbnail_url text,
  width         integer,
  height        integer,
  caption       text,
  created_at    timestamptz,
  total_votes   integer,
  rad_votes     integer,
  bad_votes     integer,
  username      text,
  feed_score    double precision
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    up.id,
    up.user_id,
    up.categories,
    up.image_url,
    up.media_type,
    up.thumbnail_url,
    up.width,
    up.height,
    up.caption,
    up.created_at,
    up.total_votes,
    up.rad_votes,
    up.bad_votes,
    u.username,
    (
      COALESCE(up.wilson_score, 0) * 0.6 +
      CASE WHEN follows.following_id IS NOT NULL THEN 0.3 ELSE 0.0 END +
      EXTRACT(EPOCH FROM (now() - up.created_at)) * -0.00001
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows
    ON follows.follower_id = p_user_id
    AND follows.following_id = up.user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
  ORDER BY feed_score DESC
  LIMIT p_limit;
$$;

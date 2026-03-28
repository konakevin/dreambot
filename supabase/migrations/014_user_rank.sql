-- Migration 014: User rank badge
-- Adds rad_score + user_rank to users table.
-- A trigger fires after each vote and recalculates the upload owner's rank.
--
-- Rank tiers (based on weighted average wilson_score across qualifying posts):
--   LEGENDARY  >= 0.85
--   RAD        >= 0.70
--   SOLID      >= 0.55
--   MID        >= 0.45
--   BAD        >= 0.30
--   CURSED     <  0.30
--
-- Qualification rules:
--   - Post must have total_votes >= 5
--   - User must have >= 3 qualifying posts; otherwise NULL (unranked)
-- Weight = total_votes so high-engagement posts count more.

-- 1. Add columns
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS rad_score float,
  ADD COLUMN IF NOT EXISTS user_rank  text;

-- 2. Trigger function
CREATE OR REPLACE FUNCTION public.update_user_rank()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_owner_id     uuid;
  v_score        float;
  v_post_count   integer;
  v_rank         text;
BEGIN
  -- Identify the upload's owner
  SELECT user_id INTO v_owner_id
  FROM public.uploads
  WHERE id = NEW.upload_id;

  IF v_owner_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Weighted average wilson_score over qualifying posts (>= 5 votes)
  SELECT
    SUM(wilson_score * total_votes) / NULLIF(SUM(total_votes), 0),
    COUNT(*)
  INTO v_score, v_post_count
  FROM public.uploads
  WHERE
    user_id     = v_owner_id
    AND is_active   = true
    AND total_votes >= 5
    AND wilson_score IS NOT NULL;

  -- Need at least 3 qualifying posts for a rank
  IF v_post_count < 3 THEN
    UPDATE public.users
    SET rad_score = v_score, user_rank = NULL
    WHERE id = v_owner_id;
    RETURN NEW;
  END IF;

  -- Derive tier
  v_rank := CASE
    WHEN v_score >= 0.85 THEN 'LEGENDARY'
    WHEN v_score >= 0.70 THEN 'RAD'
    WHEN v_score >= 0.55 THEN 'SOLID'
    WHEN v_score >= 0.45 THEN 'MID'
    WHEN v_score >= 0.30 THEN 'BAD'
    ELSE 'CURSED'
  END;

  UPDATE public.users
  SET rad_score = v_score, user_rank = v_rank
  WHERE id = v_owner_id;

  RETURN NEW;
END;
$$;

-- 3. Attach trigger to votes table
DROP TRIGGER IF EXISTS trg_update_user_rank ON public.votes;
CREATE TRIGGER trg_update_user_rank
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_rank();

-- 4. Update get_feed to return user_rank
-- (must DROP first — Postgres can't change return types in-place)
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
  user_rank     text,
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
    u.user_rank,
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
  LEFT JOIN public.votes v
    ON v.upload_id = up.id
    AND v.voter_id = p_user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND v.upload_id IS NULL
  ORDER BY feed_score DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer) TO authenticated;

-- 5. Backfill existing users
-- Re-use the same logic as the trigger function
DO $$
DECLARE
  r RECORD;
  v_score      float;
  v_post_count integer;
  v_rank       text;
BEGIN
  FOR r IN SELECT id FROM public.users LOOP
    SELECT
      SUM(wilson_score * total_votes) / NULLIF(SUM(total_votes), 0),
      COUNT(*)
    INTO v_score, v_post_count
    FROM public.uploads
    WHERE
      user_id     = r.id
      AND is_active   = true
      AND total_votes >= 5
      AND wilson_score IS NOT NULL;

    IF v_post_count >= 3 THEN
      v_rank := CASE
        WHEN v_score >= 0.85 THEN 'LEGENDARY'
        WHEN v_score >= 0.70 THEN 'RAD'
        WHEN v_score >= 0.55 THEN 'SOLID'
        WHEN v_score >= 0.45 THEN 'MID'
        WHEN v_score >= 0.30 THEN 'BAD'
        ELSE 'CURSED'
      END;
    ELSE
      v_rank := NULL;
    END IF;

    UPDATE public.users
    SET rad_score = v_score, user_rank = v_rank
    WHERE id = r.id;
  END LOOP;
END;
$$;

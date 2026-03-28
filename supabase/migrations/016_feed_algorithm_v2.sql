-- Migration 016: Feed algorithm v2
--
-- Old algorithm (broken):
--   wilson_score * 0.6 + follows * 0.3 + age_seconds * -0.00001
--   Problem: wilson_score dominated everything. Posts between 0.65–0.90
--   wilson score all look identical. No randomness = same feed forever.
--
-- New algorithm — 5 independent signals, each normalized to [0,1]:
--
--   QUALITY    (30%) — wilson score (rad quality of the post)
--   FRESHNESS  (25%) — gravity decay: 1/(age_hours+2)^1.8, normalized
--                       new posts rise naturally, decay accelerates over days
--   ENGAGEMENT (20%) — log-scaled total votes, capped at 1M
--                       popular/trending content surfaces without dominating
--   SOCIAL     (15%) — bonus when viewer follows the poster
--   NOISE      (10%) — deterministic per-(user,post) hash
--                       guarantees feed variety; stable across refreshes
--                       but different for every user
--
-- Total max score = 1.0. Feed sorted DESC so highest score shows first.
--
-- Why this works better:
--   - Quality is only 30%, so a 0.70 and 0.90 wilson post differ by 0.06
--     instead of 0.24 — other signals create real separation
--   - Freshness uses proper gravity (like HN/Reddit), not a linear penalty
--   - 10% noise means two similarly-scored posts appear in different order
--     for different users
--   - Engagement rewards trending posts independently of their quality score

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
      -- QUALITY (30%): wilson score, [0,1]
      COALESCE(up.wilson_score, 0.5) * 0.30

      -- FRESHNESS (25%): gravity decay normalized to [0,1]
      -- 1/(age_hours+2)^1.8 / max_at_age_0 where max = 1/(2^1.8) ≈ 0.2871
      + (
          1.0 / POWER(
            GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0,
            1.8
          ) / 0.2871
        ) * 0.25

      -- ENGAGEMENT (20%): log-scaled votes, capped at 1M
      + (LN(1.0 + up.total_votes) / LN(1.0 + 1000000.0)) * 0.20

      -- SOCIAL (15%): following bonus
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.15 ELSE 0.0 END

      -- NOISE (10%): deterministic per-(viewer,post) randomness
      + ((ABS(HASHTEXT(p_user_id::text || up.id::text)) % 1000)::float / 1000.0) * 0.10
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows
    ON follows.follower_id  = p_user_id
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

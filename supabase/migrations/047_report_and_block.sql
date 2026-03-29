-- Migration 047: Report + Block features (required for App Store)

-- ── 1. Block table ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.blocked_users (
  blocker_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON blocked_users(blocker_id);

ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own blocks" ON blocked_users;
CREATE POLICY "Users can manage own blocks" ON blocked_users
  FOR ALL USING (blocker_id = auth.uid());

-- ── 2. Reports table (may already exist from migration 001) ─────────────────

CREATE TABLE IF NOT EXISTS public.reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reported_user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  upload_id   uuid REFERENCES public.uploads(id) ON DELETE CASCADE,
  comment_id  uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  reason      text NOT NULL,
  details     text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create reports" ON reports;
CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own reports" ON reports;
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (reporter_id = auth.uid());

-- ── 3. Filter blocked users from feeds ──────────────────────────────────────
-- Update get_feed to exclude posts from blocked users

DROP FUNCTION IF EXISTS public.get_feed(uuid, integer, double precision);

CREATE FUNCTION public.get_feed(
  p_user_id uuid,
  p_limit   integer DEFAULT 50,
  p_seed    double precision DEFAULT 0.0
)
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
  avatar_url    text,
  comment_count integer,
  feed_score    double precision
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  WITH user_prefs AS (
    SELECT preferred_categories FROM users WHERE id = p_user_id
  ),
  user_blocks AS (
    SELECT blocked_id FROM blocked_users WHERE blocker_id = p_user_id
  )
  SELECT
    up.id, up.user_id, up.categories, up.image_url, up.media_type,
    up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
    up.total_votes, up.rad_votes, up.bad_votes,
    u.username, u.user_rank, u.avatar_url,
    up.comment_count,
    (
      COALESCE(up.wilson_score, 0.5) * 0.30
      + (1.0 / POWER(GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0, 1.8) / 0.2871) * 0.25
      + (LN(1.0 + up.total_votes) / LN(1.0 + 1000000.0)) * 0.20
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.15 ELSE 0.0 END
      + ((ABS(HASHTEXT(p_user_id::text || up.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows ON follows.follower_id = p_user_id AND follows.following_id = up.user_id
  LEFT JOIN public.votes v ON v.upload_id = up.id AND v.voter_id = p_user_id
  CROSS JOIN user_prefs
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND v.upload_id IS NULL
    AND (user_prefs.preferred_categories IS NULL OR up.categories && user_prefs.preferred_categories)
    AND up.user_id NOT IN (SELECT blocked_id FROM user_blocks)
  ORDER BY feed_score DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, double precision) TO authenticated;

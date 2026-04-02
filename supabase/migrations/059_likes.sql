-- Migration 059: Separate likes from saves
-- likes = heart button (new), favorites = bookmark/save (existing)

-- ── Likes table ─────────────────────────────────────────────────────────────
CREATE TABLE public.likes (
  id         uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  upload_id  uuid REFERENCES public.uploads(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, upload_id)
);

CREATE INDEX likes_user_id_idx ON public.likes(user_id);
CREATE INDEX likes_upload_id_idx ON public.likes(upload_id);

-- RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes"
  ON public.likes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON public.likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ── like_count column on uploads ────────────────────────────────────────────
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS like_count integer NOT NULL DEFAULT 0;

-- ── Trigger to maintain like_count ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
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

CREATE TRIGGER trg_like_count
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- ── Update get_feed to include like_count ───────────────────────────────────
DROP FUNCTION IF EXISTS public.get_feed(uuid, integer, integer, double precision);

CREATE FUNCTION public.get_feed(
  p_user_id uuid,
  p_limit   integer DEFAULT 20,
  p_offset  integer DEFAULT 0,
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
  avatar_url    text,
  comment_count integer,
  like_count    integer,
  feed_score    double precision
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  WITH user_blocks AS (
    SELECT blocked_id FROM blocked_users WHERE blocker_id = p_user_id
  ),
  user_reports AS (
    SELECT upload_id FROM reports WHERE reporter_id = p_user_id AND upload_id IS NOT NULL
  )
  SELECT
    up.id, up.user_id, up.categories, up.image_url, up.media_type,
    up.thumbnail_url, up.width, up.height, up.caption, up.created_at,
    up.total_votes, up.rad_votes, up.bad_votes,
    u.username, u.avatar_url,
    up.comment_count,
    up.like_count,
    (
      (1.0 / POWER(GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0, 1.8) / 0.2871) * 0.35
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.25 ELSE 0.0 END
      + (LN(1.0 + up.comment_count) / LN(1.0 + 1000.0)) * 0.15
      + (LN(1.0 + up.total_votes) / LN(1.0 + 1000000.0)) * 0.15
      + ((ABS(HASHTEXT(p_user_id::text || up.id::text || p_seed::text)) % 1000)::float / 1000.0) * 0.10
    ) AS feed_score
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  LEFT JOIN public.follows follows ON follows.follower_id = p_user_id AND follows.following_id = up.user_id
  WHERE up.is_active = true
    AND up.user_id != p_user_id
    AND (up.is_moderated = false OR up.is_approved = true)
    AND up.user_id NOT IN (SELECT blocked_id FROM user_blocks)
    AND up.id NOT IN (SELECT upload_id FROM user_reports)
  ORDER BY feed_score DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, integer, double precision) TO authenticated;

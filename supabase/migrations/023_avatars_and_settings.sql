-- Migration 023: Avatar storage bucket + delete account RPC + feed avatar
--
-- 1. Create avatars storage bucket (public)
-- 2. RLS policies: users upload/update their own folder, anyone can read
-- 3. Update get_public_profile to return avatar_url
-- 4. Update get_feed to return avatar_url
-- 5. delete_own_account RPC for account self-deletion

-- ── 0. Drop functions whose return types are changing ────────────────────────
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);
DROP FUNCTION IF EXISTS public.get_feed(uuid, integer);

-- ── 1. Avatars bucket ────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Users can upload their own avatar (folder = their user ID)
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Avatars are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- ── 2. Update get_public_profile to return avatar_url ────────────────────────
CREATE OR REPLACE FUNCTION public.get_public_profile(p_user_id uuid)
RETURNS TABLE (
  id             uuid,
  username       text,
  user_rank      text,
  rad_score      float,
  avatar_url     text,
  post_count     bigint,
  follower_count bigint,
  following_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER AS $$
  SELECT
    u.id,
    u.username,
    u.user_rank,
    u.rad_score,
    u.avatar_url,
    (
      SELECT COUNT(*)
      FROM public.uploads up
      WHERE up.user_id = u.id
        AND up.is_active = true
    ) AS post_count,
    (
      SELECT COUNT(*)
      FROM public.follows f
      WHERE f.following_id = u.id
    ) AS follower_count,
    (
      SELECT COUNT(*)
      FROM public.follows f
      WHERE f.follower_id = u.id
    ) AS following_count
  FROM public.users u
  WHERE u.id = p_user_id;
$$;

-- ── 3. Update get_feed to return avatar_url ──────────────────────────────────
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
  avatar_url    text,
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
    u.avatar_url,
    (
      COALESCE(up.wilson_score, 0.5) * 0.30
      + (
          1.0 / POWER(
            GREATEST(EXTRACT(EPOCH FROM (now() - up.created_at)) / 3600.0, 0.0) + 2.0,
            1.8
          ) / 0.2871
        ) * 0.25
      + (LN(1.0 + up.total_votes) / LN(1.0 + 1000000.0)) * 0.20
      + CASE WHEN follows.following_id IS NOT NULL THEN 0.15 ELSE 0.0 END
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

-- ── 4. Delete own account RPC ────────────────────────────────────────────────
-- SECURITY DEFINER so it can delete from auth.users.
-- public.users ON DELETE CASCADE handles uploads, votes, follows, etc.
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

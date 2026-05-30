-- 207: display_name + bio columns on users + extend get_public_profile.
--
-- Profile-screen overhaul (2026-05-29) wants an Instagram-style hybrid layout:
-- big avatar left, stats inline right, display name + @handle + bio stacked
-- beneath. The DB has the @handle (`username`) + avatar; missing the
-- editable display-name + bio.
--
-- Two text columns, both nullable. Length caps mirror the IG/TikTok product
-- conventions:
--   display_name → 50 chars (TikTok cap; IG is 30, Twitter 50, Threads 30)
--   bio          → 160 chars (IG cap; Twitter 160; TikTok 80; short = better)
--
-- The existing `freeze_user_columns_on_update` trigger (migration 151)
-- protects economic/identity columns (sparkle_balance, pro_subscription,
-- is_admin, etc.) but allows clients to UPDATE everything else on their
-- own row — so these new columns are user-writable out of the box.
-- No new RLS policy needed.
--
-- The get_public_profile RPC (latest in 116) is recreated to return the
-- two new fields so the public profile screen can render them.

BEGIN;

-- ── 1. Schema additions ───────────────────────────────────────────────────────

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS bio text;

ALTER TABLE public.users
  ADD CONSTRAINT users_display_name_length_check CHECK (
    display_name IS NULL OR char_length(display_name) <= 50
  );

ALTER TABLE public.users
  ADD CONSTRAINT users_bio_length_check CHECK (
    bio IS NULL OR char_length(bio) <= 160
  );

COMMENT ON COLUMN public.users.display_name IS
  'Optional human-readable name shown as the profile hero. NULL → UI falls back to @username.';
COMMENT ON COLUMN public.users.bio IS
  'Optional one- or two-line bio shown beneath the @handle on profiles.';

-- ── 2. get_public_profile — recreated to expose display_name + bio ────────────
-- Same body as the migration-116 version, plus the two new fields. Drop
-- + recreate because RETURNS-TABLE columns are part of the function
-- signature; CREATE OR REPLACE alone errors when the shape changes.

DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE FUNCTION public.get_public_profile(p_user_id uuid)
RETURNS TABLE (
  id              uuid,
  username        text,
  display_name    text,
  bio             text,
  avatar_url      text,
  is_public       boolean,
  post_count      bigint,
  follower_count  bigint,
  following_count bigint,
  is_following    boolean,
  has_request     boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    u.id,
    u.username,
    u.display_name,
    u.bio,
    u.avatar_url,
    u.is_public,
    (SELECT COUNT(*) FROM public.uploads up
     WHERE up.user_id = u.id AND up.is_public = true) AS post_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.following_id = u.id) AS follower_count,
    (SELECT COUNT(*) FROM public.follows f WHERE f.follower_id = u.id) AS following_count,
    EXISTS (
      SELECT 1 FROM public.follows
      WHERE follower_id = auth.uid() AND following_id = u.id
    ) AS is_following,
    EXISTS (
      SELECT 1 FROM public.follow_requests
      WHERE requester_id = auth.uid() AND target_id = u.id
    ) AS has_request
  FROM public.users u
  WHERE u.id = p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = p_user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = p_user_id)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated, anon;

COMMIT;

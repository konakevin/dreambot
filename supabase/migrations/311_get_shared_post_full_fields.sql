-- 311: expand get_shared_post(id) to return the FULL set of fields the in-app
-- DreamCard needs, so a PRIVATE dream shared by direct link renders correctly
-- IN THE APP (not just on the website). 2026-06-25.
--
-- Migration 309 returned only 6 columns — enough for the web share page (a
-- single static card). But when a recipient who has the app installed taps the
-- universal link (applinks:dreambotapp.com), iOS opens the link INSIDE the app
-- → app/photo/[id] → useUserContextFeed, which reads the target through the
-- authenticated session. RLS blocks a private post for a non-owner, so the
-- screen fell to the "Oops" view. useUserContextFeed now falls back to this RPC
-- when the direct read is RLS-blocked, and maps the row with mapRpcToDreamPost
-- (flat shape: username/avatar at top level) — so it must return every field
-- that mapper reads, or the card shows a broken timestamp / missing image.
--
-- Same unlisted-by-UUID model + same guards as 309. RETURNS TABLE signature
-- changes, so we DROP then CREATE (CREATE OR REPLACE can't change return type).

DROP FUNCTION IF EXISTS public.get_shared_post(uuid);

CREATE FUNCTION public.get_shared_post(p_id uuid)
RETURNS TABLE (
  id                uuid,
  user_id           uuid,
  image_url         text,
  image_url_hq      text,
  image_url_display text,
  thumbhash         text,
  caption           text,
  created_at        timestamptz,
  comment_count     integer,
  like_count        integer,
  dream_medium      text,
  dream_vibe        text,
  model             text,
  is_public         boolean,
  posted_at         timestamptz,
  description       text,
  username          text,
  avatar_url        text,
  allow_reposts     boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    up.id,
    up.user_id,
    up.image_url,
    up.image_url_hq,
    up.image_url_display,
    up.thumbhash,
    up.caption,
    up.created_at,
    up.comment_count,
    up.like_count,
    up.dream_medium,
    up.dream_vibe,
    up.model,
    up.is_public,
    up.posted_at,
    up.description,
    us.username,
    us.avatar_url,
    us.allow_reposts
  FROM public.uploads up
  JOIN public.users us ON us.id = up.user_id
  WHERE up.id = p_id
    AND up.posted_at IS NOT NULL
    AND (up.is_moderated = false OR up.is_approved = true)
    AND us.is_public = true
    AND NOT EXISTS (
      SELECT 1
      FROM public.blocked_users b
      WHERE (b.blocker_id = up.user_id AND b.blocked_id = auth.uid())
         OR (b.blocker_id = auth.uid()  AND b.blocked_id = up.user_id)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_post(uuid) TO anon, authenticated;

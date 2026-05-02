-- Migration 143: get_bot_thumbnails — only return posts the bot actually
-- posted to the feed (is_public = true).
--
-- BUG (introduced in 135): the RPC returned the 3 most-recent uploads per
-- bot regardless of visibility. iter-bot test renders that weren't --post-ed
-- end up in the uploads table with is_public=false; they showed as phantom
-- thumbnails on the Settings → Bots and onboarding Meet-the-bots screens
-- even though they don't appear on the bot's profile (which filters by
-- is_public=true via useUserPosts).
--
-- Fix: mirror the same is_public filter in the subquery.

CREATE OR REPLACE FUNCTION public.get_bot_thumbnails(
  p_per_bot integer DEFAULT 3
)
RETURNS TABLE (
  bot_user_id uuid,
  thumbnail_urls text[]
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    u.id AS bot_user_id,
    COALESCE(
      ARRAY(
        SELECT up.image_url
        FROM public.uploads up
        WHERE up.user_id = u.id
          AND up.image_url IS NOT NULL
          AND up.is_public = true
        ORDER BY up.created_at DESC
        LIMIT p_per_bot
      ),
      '{}'::text[]
    ) AS thumbnail_urls
  FROM public.users u
  WHERE u.is_bot = true;
$$;

GRANT EXECUTE ON FUNCTION public.get_bot_thumbnails(integer) TO authenticated, service_role;

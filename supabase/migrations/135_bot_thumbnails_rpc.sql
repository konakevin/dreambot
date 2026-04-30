-- Migration 135: get_bot_thumbnails RPC for the Meet-the-bots onboarding screen
--
-- Returns the most recent N image URLs per bot in a single round trip.
-- Avoids the alternative — N sequential queries (one per bot) — which on a
-- 21-bot roster meant ~5s of waterfall on cold mobile networks.
--
-- The screen renders 3 thumbnails per bot row. We return up to `p_per_bot`
-- urls (default 3) for each user_id where users.is_bot = true.

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
        ORDER BY up.created_at DESC
        LIMIT p_per_bot
      ),
      '{}'::text[]
    ) AS thumbnail_urls
  FROM public.users u
  WHERE u.is_bot = true;
$$;

GRANT EXECUTE ON FUNCTION public.get_bot_thumbnails(integer) TO authenticated, service_role;

COMMENT ON FUNCTION public.get_bot_thumbnails IS
  'Batched bot thumbnail fetch for the Meet-the-bots onboarding screen. Returns up to p_per_bot most-recent image URLs per bot user. One round trip vs N — material on slow networks.';

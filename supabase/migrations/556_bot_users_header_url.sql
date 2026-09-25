-- 556_bot_users_header_url.sql — get_bot_users() also returns each bot's header, 2026-09-25.
--
-- The app loads the bot list on almost every screen (useBotUsers). Returning each
-- bot's Dreamscape header URL (migration 554) here lets the app prefetch all the
-- bot headers into the image cache while idle, so opening a bot's profile shows
-- its header instantly instead of downloading it on first visit (Kevin 2026-09-25:
-- "they are a bit delayed loading in the first time").
--
-- Body is the live migration-477 definition verbatim plus the trailing
-- header_url column. RETURNS TABLE changes shape, so DROP first (42P13). Older app
-- builds read the rows by column name, so the extra column is harmless to them.
-- This is an RPC (no PostgREST embed), so it can't trip the embed-ambiguity rule.
DROP FUNCTION IF EXISTS public.get_bot_users();

CREATE FUNCTION public.get_bot_users()
RETURNS TABLE(id uuid, username text, avatar_url text, is_public boolean, header_url text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.id, u.username, u.avatar_url, u.is_public, u.header_url
  FROM public.users u
  WHERE u.is_bot = true
    AND (
      u.is_public = true
      OR (
        u.is_public = false
        AND auth.uid() = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'::uuid
        AND EXISTS (
          SELECT 1 FROM public.follows f
          WHERE f.follower_id = auth.uid() AND f.following_id = u.id
        )
      )
    )
  ORDER BY u.username;
$$;

GRANT EXECUTE ON FUNCTION public.get_bot_users() TO anon, authenticated;

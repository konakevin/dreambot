-- 477: get_bot_users() also returns is_public — lets the client tell a
-- PRIVATE admin-only bot (AlphaBot, FarmBot) apart from a normal public bot
-- in the Bots tab, so it can offer a "View Profile" affordance instead of
-- the normal live per-bot feed (which is always empty for a private bot —
-- it has zero is_public=true posts by definition). See BOT_DARK_LAUNCH_PLAN.md
-- + migration 339 (the admin+follows carve-out this function already has).
--
-- Changing the RETURNS TABLE shape requires DROP FUNCTION first (42P13).
DROP FUNCTION IF EXISTS public.get_bot_users();

CREATE FUNCTION public.get_bot_users()
RETURNS TABLE(id uuid, username text, avatar_url text, is_public boolean)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.id, u.username, u.avatar_url, u.is_public
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

-- 339: AlphaBot — surface the private proving-ground bot to the supreme admin only
--
-- AlphaBot (users.is_public=false, is_bot=true) is the sandbox where new bot
-- paths render before promotion (ALPHABOT.md). Privacy is follower-gated by
-- the migration-116 uploads RLS; the ONLY follower is the supreme admin.
-- get_bot_users filters is_public=true (migration 303), which correctly hides
-- AlphaBot from everyone's Bots pills — including the supreme admin. This adds
-- a least-privilege exception: private bots appear ONLY for the supreme admin,
-- and ONLY if they follow them (so a future private bot stays hidden until
-- explicitly followed).
--
-- Supreme-admin id matches lib/superAdmin.ts SUPREME_ADMIN_USER_ID.

CREATE OR REPLACE FUNCTION public.get_bot_users()
RETURNS TABLE(id uuid, username text, avatar_url text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.id, u.username, u.avatar_url
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

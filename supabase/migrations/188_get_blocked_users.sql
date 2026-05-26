-- ============================================================
-- 188 — Blocking, Phase 3: blocked-users management RPC
-- ============================================================
-- Backs the new Settings > Blocked Users screen. Returns the list of users
-- the CURRENT user has blocked (auth.uid()), most-recent first. Unblock reuses
-- the existing row-delete path (useToggleBlock) — RLS already allows a user to
-- DELETE their own blocked_users rows.
-- ============================================================

DROP FUNCTION IF EXISTS public.get_blocked_users();
CREATE FUNCTION public.get_blocked_users()
RETURNS TABLE(
  user_id    uuid,
  username   text,
  avatar_url text,
  blocked_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT u.id, u.username, u.avatar_url, b.created_at
  FROM public.blocked_users b
  JOIN public.users u ON u.id = b.blocked_id
  WHERE b.blocker_id = auth.uid()
  ORDER BY b.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_blocked_users() TO authenticated, service_role;

-- 313_user_ban.sql
-- Global admin user ban (App Store Guideline 1.2 — "eject the user who provided
-- the offending content"). Per-user block already exists (blocked_users); this
-- is an admin-only GLOBAL ban used by the admin Reports tool (migration 314):
-- it hides ALL the user's content app-wide AND locks them out of auth.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_banned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS banned_at timestamptz,
  ADD COLUMN IF NOT EXISTS banned_by uuid REFERENCES public.users(id) ON DELETE SET NULL;

-- is_banned is admin-internal: the client never reads it directly (the ban is
-- enforced at the auth layer + by hiding content), so it is deliberately NOT
-- granted to anon/authenticated (column-level grants, migration 278). The admin
-- RPCs below read it via SECURITY DEFINER.

-- ── admin_ban_user ──────────────────────────────────────────────────────────
-- 1) mark banned, 2) hide every one of their uploads from public feeds via the
-- existing is_moderated gate (migration 126 — owner still sees them on their own
-- profile), 3) lock them out of auth (GoTrue blocks login / token refresh while
-- banned_until is in the future). force_model-style QA bypass not needed here.
CREATE OR REPLACE FUNCTION public.admin_ban_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Cannot ban an admin';
  END IF;

  UPDATE public.users
     SET is_banned = true, banned_at = now(), banned_by = auth.uid()
   WHERE id = p_user_id;

  UPDATE public.uploads
     SET is_moderated = true
   WHERE user_id = p_user_id;

  UPDATE auth.users
     SET banned_until = 'infinity'
   WHERE id = p_user_id;
END;
$$;

-- ── admin_unban_user ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_unban_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.users
     SET is_banned = false, banned_at = NULL, banned_by = NULL
   WHERE id = p_user_id;

  -- Restore their posts to public feeds. NOTE: this also un-hides any post that
  -- was individually hidden via a report; re-hide individually if needed (rare —
  -- unbanning is uncommon).
  UPDATE public.uploads
     SET is_moderated = false
   WHERE user_id = p_user_id;

  UPDATE auth.users
     SET banned_until = NULL
   WHERE id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_ban_user(uuid)   TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_unban_user(uuid) TO authenticated;

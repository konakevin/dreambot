-- 445: announcements — never show a "what's new" sheet to brand-new users.
--
-- A "New X!" announcement is confusing to someone who just signed up, because
-- for them nothing is new — X was always part of the app. Gate: a user only
-- sees an announcement if their account existed BEFORE the announcement was
-- published, i.e. users.created_at < announcements.starts_at.
--
-- existing_users_only DEFAULTS TRUE (the correct default for a what's-new
-- system). Set it FALSE for the rare announcement genuinely meant for everyone,
-- including brand-new signups (in practice that content usually belongs in
-- onboarding instead).

ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS existing_users_only boolean NOT NULL DEFAULT true;

-- SECURITY DEFINER read of the CALLER's signup time. public.users carries RLS +
-- column-level grants (migration 278); a definer fn reads created_at cleanly
-- without widening any grant, keeps the policy expression simple, and is STABLE
-- so the planner can cache it per row. auth.uid() still resolves to the caller
-- inside a SECURITY DEFINER function (it reads the request JWT, not the owner).
CREATE OR REPLACE FUNCTION public.account_created_before(ts timestamptz)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT u.created_at FROM public.users u WHERE u.id = auth.uid()) < ts,
    false  -- no user row / unknown → hide (safe default)
  )
$$;

REVOKE ALL ON FUNCTION public.account_created_before(timestamptz) FROM public;
GRANT EXECUTE ON FUNCTION public.account_created_before(timestamptz) TO authenticated;

-- Re-create the read policy with the new-user gate appended. (Original policy
-- from migration 333: is_active + live time window.)
DROP POLICY IF EXISTS announcements_read ON public.announcements;
CREATE POLICY announcements_read ON public.announcements
  FOR SELECT TO authenticated
  USING (
    is_active
    AND starts_at <= now()
    AND (ends_at IS NULL OR ends_at > now())
    AND (NOT existing_users_only OR public.account_created_before(starts_at))
  );

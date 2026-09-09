-- 484: announcements — enforce "only ever one active announcement at a
-- time" (Kevin 2026-09-08) as a real DB constraint, not operational
-- discipline. Immediate trigger: I manually deactivated the stale "We
-- redecorated" locations announcement by hand right before activating
-- FarmBot's — a constraint makes that step impossible to skip by accident,
-- instead of relying on remembering to do it.

-- At most one row can have is_active = true at any moment. A unique index
-- on a constant expression, scoped by a WHERE clause, is the standard
-- Postgres pattern for "at most one row matching a condition" — every
-- is_active=true row collides on the same index key (true), so a second
-- one can never be inserted/updated in.
CREATE UNIQUE INDEX announcements_only_one_active
  ON public.announcements ((true))
  WHERE is_active;

-- Ops convenience + safety net: launching a new announcement now genuinely
-- means "deactivate whatever's currently active, then activate this one" —
-- two ordered steps, or the constraint above rejects a same-transaction
-- attempt to activate #2 while #1 is still active. Wrap both in one
-- atomic call so every future launch (including scripts/announce-*.js) goes
-- through here instead of hand-rolling the two-step dance. SECURITY DEFINER
-- + no grants to authenticated/anon — authoring stays dashboard/service-role
-- only per the migration-333 comment; this is an ops helper, not a client RPC.
CREATE OR REPLACE FUNCTION public.activate_announcement(p_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.announcements SET is_active = false WHERE is_active AND id <> p_id;
  UPDATE public.announcements SET is_active = true, starts_at = now() WHERE id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.activate_announcement(text) FROM public;

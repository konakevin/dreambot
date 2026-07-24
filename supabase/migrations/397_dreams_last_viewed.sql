-- 397_dreams_last_viewed.sql
--
-- The "new dreams since last viewed" signal (the companion promised in
-- migration 396's comment). Mirrors the inbox-viewed model (migration 223):
-- a per-user server-clock timestamp + a mark RPC + a count RPC.
--
-- Why server-side (not a client timestamp): the unseen set is
-- `uploads.created_at > last_dreams_view_at`, and `created_at` is stamped by
-- the DB clock. Marking with a client `Date.now()` would misfire under phone
-- clock skew — so we stamp `now()` on the server, exactly like mark_inbox_viewed.
--
-- Surfaces this drives (client): a red dot on the Profile tab + the Dreams
-- sub-tab, and a per-tile "New" marker in the Dreams album. Manual (user-made)
-- dreams no longer hit the inbox (migration 396), so this is their "something
-- new" signal.

-- 1. The column. NOT NULL DEFAULT now() so EXISTING users are treated as having
--    "seen everything as of this migration" (no retroactive flood of their whole
--    back-catalogue as New), and new users start from signup.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS last_dreams_view_at timestamptz NOT NULL DEFAULT now();

-- 2. No column GRANT — deliberately. users uses column-level GRANTs (migrations
--    278/280), so this column is invisible/un-writable to the client by default,
--    which is exactly what we want: it's only ever read/written through the two
--    SECURITY DEFINER RPCs below (they bypass column grants), never a direct
--    client SELECT/PATCH. Withholding the grant keeps a per-user private
--    timestamp from leaking on every profile read. If future client code needs to
--    read it directly, add `GRANT SELECT (last_dreams_view_at) ... TO authenticated`
--    then (the column-grant footgun: it's silently invisible until you do).

-- 3. mark_dreams_viewed — advance the mark to the server's now() and RETURN the
--    PREVIOUS value. The caller uses that previous value as the "session
--    baseline" for the per-tile New markers (tiles newer than it), while the
--    advanced value clears the unseen count. Gated to the caller's own row.
CREATE OR REPLACE FUNCTION public.mark_dreams_viewed(p_user_id uuid)
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prev timestamptz;
BEGIN
  IF p_user_id IS NULL OR p_user_id <> auth.uid() THEN
    RETURN NULL;
  END IF;
  SELECT last_dreams_view_at INTO prev FROM public.users WHERE id = p_user_id;
  UPDATE public.users SET last_dreams_view_at = now() WHERE id = p_user_id;
  RETURN prev;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_dreams_viewed(uuid) TO authenticated;

-- 4. get_unseen_dreams_count — count of the caller's dream renders that landed
--    in the Dreams album since they last viewed it. Mirrors the album query
--    (useMyDreams): the caller's own uploads, not folded into an album
--    (album_ref_count = 0), created after the mark. Gated to the caller's own
--    row (returns 0 for any other id under the SECURITY DEFINER context).
CREATE OR REPLACE FUNCTION public.get_unseen_dreams_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN p_user_id = auth.uid() THEN (
      SELECT count(*)::int
      FROM public.uploads u
      WHERE u.user_id = p_user_id
        AND u.is_ai_generated = true
        AND u.album_ref_count = 0
        AND u.created_at > (SELECT last_dreams_view_at FROM public.users WHERE id = p_user_id)
    )
    ELSE 0
  END;
$$;

GRANT EXECUTE ON FUNCTION public.get_unseen_dreams_count(uuid) TO authenticated;

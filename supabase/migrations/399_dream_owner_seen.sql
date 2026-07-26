-- 399_dream_owner_seen.sql
--
-- Per-dream "the owner already witnessed this" marker, so a dream the user MADE
-- and SAW (watched the reveal) or POSTED does not red-dot them as a "new/unseen"
-- album dream. Only dreams that landed WITHOUT the owner witnessing them (a
-- nightly dream, or a create dream they queued and left before the reveal) stay
-- unseen. Companion to migration 397's last_dreams_view_at model.
--
-- Before: get_unseen_dreams_count counted every own dream with
-- created_at > last_dreams_view_at, so your own just-made dream flagged you as
-- "new" until you opened the album (Kevin 2026-07-25). Now a per-dream flag
-- excludes witnessed/posted dreams precisely, with no false-clearing of an
-- earlier unseen nightly (which a single-watermark bump would have caused).

-- 1. The marker. NULL = not yet witnessed by the owner.
ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS owner_seen_at timestamptz;

-- 2. Column-level SELECT grant (uploads uses column-level grants, migrations
--    278/281): the client reads owner_seen_at to gate the per-tile "New" pill so
--    it stays consistent with the dot. Not sensitive (a timestamp). Writes go
--    only through the definer RPC below, so no UPDATE grant is given.
GRANT SELECT (owner_seen_at) ON public.uploads TO authenticated;

-- 3. mark_dream_seen — the owner marks one of their OWN dreams as witnessed.
--    Idempotent (only stamps when currently NULL), owner-scoped. Called client-
--    side from the reveal screens + on publish.
CREATE OR REPLACE FUNCTION public.mark_dream_seen(p_upload_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.uploads
  SET owner_seen_at = now()
  WHERE id = p_upload_id
    AND user_id = auth.uid()
    AND owner_seen_at IS NULL;
$$;

GRANT EXECUTE ON FUNCTION public.mark_dream_seen(uuid) TO authenticated;

-- 4. get_unseen_dreams_count — now excludes dreams the owner already witnessed.
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
        AND u.owner_seen_at IS NULL
        AND u.created_at > (SELECT last_dreams_view_at FROM public.users WHERE id = p_user_id)
    )
    ELSE 0
  END;
$$;

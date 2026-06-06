-- 229_cancel_pending_download_push.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Cancel a pending `download_ready` push when the user has already acted on
-- it in the app — either by tapping the inbox row (which navigates to the
-- photo screen and auto-saves) or by completing any saveHd download path
-- before the push debounce drain fires.
--
-- The bug: migration 204's push debounce holds a row in pending_push_groups
-- for 30-90s before draining. A fast user can see the in-app inbox
-- notification, download the HD, and leave the app within seconds — and
-- then get a stale push notification 60s later for a download they already
-- completed.
--
-- The fix: a client-callable RPC that deletes the queue row scoped to
-- (auth.uid(), 'download:' || p_upload_id) — the exact group_key shape
-- migration 225 settled on. Idempotent (DELETE of a row that may not
-- exist) so callers can fire-and-forget.
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.cancel_pending_download_push(p_upload_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  -- Unauthenticated callers (shouldn't happen — anon doesn't reach this) get
  -- a silent no-op. Authenticated callers can only cancel THEIR OWN queued
  -- pushes — the WHERE clause is auth.uid()-scoped, so a malicious client
  -- can't cancel someone else's pushes by guessing upload IDs.
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  DELETE FROM public.pending_push_groups
   WHERE recipient_id = v_user_id
     AND group_key = 'download:' || p_upload_id::text;
END;
$$;

COMMENT ON FUNCTION public.cancel_pending_download_push(UUID) IS
  'Cancel a pending download_ready push for the calling user + upload. Idempotent. Migration 229.';

GRANT EXECUTE ON FUNCTION public.cancel_pending_download_push(UUID) TO authenticated;

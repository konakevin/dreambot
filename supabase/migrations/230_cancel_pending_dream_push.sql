-- 230_cancel_pending_dream_push.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Sibling of migration 229's cancel_pending_download_push for the
-- `dream_generated` notification group_key prefix ('dream:' — see
-- migration 201). Cancels a queued push when the user has already seen
-- the dream in-app.
--
-- The bug: a user who taps "Queue This" on the loading screen flips
-- dream_jobs.notify_on_complete=true (migration 191) so the completion
-- notification IS inserted. They then tab back in, see the loading
-- screen reconnect (the recent fix), navigate to the reveal screen,
-- post the dream — and a few seconds later get a push notification
-- saying "your dream is ready" for a dream they've already seen and
-- shared. The reconnect path correctly delivers the in-app reveal but
-- doesn't clear the queued push.
--
-- Fix: same shape as 229's download-push cancel. Authenticated client
-- calls this RPC when the reveal screen mounts and again after the
-- post action — either is enough to clear the row, but firing both is
-- belt-and-suspenders.
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.cancel_pending_dream_push(p_upload_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Same auth.uid()-scoped DELETE shape as cancel_pending_download_push;
  -- only the group_key prefix changes ('dream:' instead of 'download:'),
  -- matching the group_key formula in migration 201.
  DELETE FROM public.pending_push_groups
   WHERE recipient_id = v_user_id
     AND group_key = 'dream:' || p_upload_id::text;
END;
$$;

COMMENT ON FUNCTION public.cancel_pending_dream_push(UUID) IS
  'Cancel a pending dream_generated push for the calling user + upload. Idempotent. Sibling of cancel_pending_download_push from migration 229.';

GRANT EXECUTE ON FUNCTION public.cancel_pending_dream_push(UUID) TO authenticated;

-- Migration 191: only notify when the user ISN'T actively waiting
--
-- Two completion notifications were firing even when the user sat and watched
-- the result come back:
--   1. 'dream_generated' — sent on every completed generate-dream/restyle-photo
--      (gated on jobId, but the loading screen ALWAYS sends a jobId, so a user
--      who waited on the loading screen still got pinged).
--   2. 'download_ready' — sent to every upscale requester, including one who
--      kept the modal open and got the HD auto-saved in front of them.
--
-- Fix = opt-in: default to NO notification (the user is watching), and only
-- enable it when the user explicitly LEAVES — taps "Queue This" on the loading
-- screen, or "Dismiss" / times out on the upscale modal.

-- ── Dreams: opt-in notify flag on the job, set by "Queue This" ──────────────
ALTER TABLE public.dream_jobs
  ADD COLUMN IF NOT EXISTS notify_on_complete boolean NOT NULL DEFAULT false;

-- Client can't write dream_jobs (RLS: read-own + service-only writes), so a
-- SECURITY DEFINER RPC flips the flag for the caller's own in-flight job.
CREATE OR REPLACE FUNCTION public.request_dream_notification(p_job_id uuid)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
  UPDATE public.dream_jobs
    SET notify_on_complete = true
    WHERE id = p_job_id AND user_id = auth.uid();
$$;
GRANT EXECUTE ON FUNCTION public.request_dream_notification(uuid) TO authenticated, service_role;

-- ── Upscale: requests default to suppressed; "Dismiss"/timeout re-enables ──
-- upscale-image now inserts upscale_requests with notified_at = now() (already
-- "notified" = suppressed). The completion notify loop only pings rows where
-- notified_at IS NULL, so a waiting user is skipped. This RPC clears it (back
-- to NULL) for the caller when they leave, so they DO get pinged on completion.
CREATE OR REPLACE FUNCTION public.allow_upscale_notify(p_upload_id uuid)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
  UPDATE public.upscale_requests
    SET notified_at = NULL
    WHERE upload_id = p_upload_id AND user_id = auth.uid();
$$;
GRANT EXECUTE ON FUNCTION public.allow_upscale_notify(uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.request_dream_notification IS
  'Opt a queued dream into a dream_generated notification (set by the loading screen Queue button). Default is no notification — a user who waits on the loading screen is not pinged.';
COMMENT ON FUNCTION public.allow_upscale_notify IS
  'Re-enable the download_ready notification for the caller when they leave the upscale modal (dismiss/timeout). Requesters default to suppressed so a user who watches the HD land in the modal is not also pinged.';

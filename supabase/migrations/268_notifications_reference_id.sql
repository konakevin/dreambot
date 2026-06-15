-- 268_notifications_reference_id.sql — add a generic "what is this notification
-- about" reference so a failed-dream toast/inbox can RETRY the exact job.
--
-- Background: dream_failed notifications carry no pointer back to the job, and
-- the full render request is already persisted as `payload` on dream_queue /
-- dream_jobs (keyed by the job UUID). This column lets the in-app failure toast
-- (which reads the realtime row, reference_id included) re-enqueue that exact
-- failed job verbatim — reproducing the prompt/model/medium/vibe/photo combo.
--
-- Nullable; only the dream_failed insert sites set it (= jobId) for now. Other
-- notification types keep it null. No get_inbox change is needed: the inbox
-- already exposes `subtype` (used to gate the Retry button), and the retry
-- endpoint resolves the most-recent failed job when no id is supplied.
--
-- Run in the dashboard SQL editor.

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS reference_id uuid;

COMMENT ON COLUMN public.notifications.reference_id IS
  'Generic entity reference for the notification. For dream_failed this is the failed dream job id (dream_queue/dream_jobs.id) so the dream can be retried from its stored payload.';

-- 182_upscale_on_demand.sql
-- On-demand HD upscale (no auto-upscale). See UPSCALE_QUEUE_PLAN.md.
--
-- Two tables:
--   upscale_jobs     — ONE row per upload = the work unit. Enables atomic
--                      dedup (only one Replicate run per upload) + the
--                      stuck-job sweep. PK on upload_id.
--   upscale_requests — ONE row per (upload, requesting user) = the notify
--                      list. Multiple users can request the same upload; the
--                      upscale runs once and every requester is notified.
--
-- Both are service-role only (the request-upscale Edge Function + sweep touch
-- them; the client never reads them — it watches uploads.image_url_hq via
-- realtime). RLS enabled with no policies = authenticated users get nothing,
-- service role bypasses.

CREATE TABLE IF NOT EXISTS public.upscale_jobs (
  upload_id   uuid PRIMARY KEY REFERENCES public.uploads(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'processing', -- processing | completed | failed | dead
  attempts    int  NOT NULL DEFAULT 0,
  last_error  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Sweep lookup: find stuck 'processing' jobs by age.
CREATE INDEX IF NOT EXISTS idx_upscale_jobs_status_updated
  ON public.upscale_jobs (status, updated_at);

CREATE TABLE IF NOT EXISTS public.upscale_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id   uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notified_at timestamptz,            -- set when the user has been told it's ready/failed
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- On completion we notify all not-yet-notified requesters for an upload.
CREATE INDEX IF NOT EXISTS idx_upscale_requests_upload
  ON public.upscale_requests (upload_id);
CREATE INDEX IF NOT EXISTS idx_upscale_requests_pending
  ON public.upscale_requests (upload_id) WHERE notified_at IS NULL;

ALTER TABLE public.upscale_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upscale_requests ENABLE ROW LEVEL SECURITY;
-- No policies: service-role only (it bypasses RLS). Clients never read these.

-- Atomic claim used by request-upscale: insert-or-reclaim a job for an upload.
-- Returns the upload_id ONLY to the caller that should KICK the upscale:
--   • brand-new upload (insert), OR
--   • a previously failed job, OR
--   • a 'processing' job that's gone stale (isolate died > p_stale_minutes ago).
-- Concurrent callers for the same fresh upload: one inserts (kicks), the other
-- conflicts and the WHERE is false (just-set processing) → returns nothing →
-- does NOT kick. One Replicate run per upload.
CREATE OR REPLACE FUNCTION public.claim_upscale_job(p_upload_id uuid, p_stale_minutes int DEFAULT 5)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.upscale_jobs (upload_id, status, attempts, updated_at)
  VALUES (p_upload_id, 'processing', 1, now())
  ON CONFLICT (upload_id) DO UPDATE
    SET status = 'processing',
        attempts = public.upscale_jobs.attempts + 1,
        updated_at = now()
    WHERE public.upscale_jobs.status IN ('failed')
       OR (public.upscale_jobs.status = 'processing'
           AND public.upscale_jobs.updated_at < now() - make_interval(mins => p_stale_minutes))
  RETURNING upload_id;
$$;

-- Add the 'download_ready' notification type (on-demand HD upscale finished).
-- Reproduces the current allowed set (migration 134) + the new type.
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'dream_failed',
    'post_like', 'post_fuse', 'post_twin',
    'post_milestone', 'comment',  -- legacy types kept for old rows
    'download_ready'              -- on-demand HD upscale ready (2026-05-25)
  ));

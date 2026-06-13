-- 263_dream_jobs_retry.sql — let user-initiated dreams retry on a hard render
-- death, the way nightly dreams already do.
--
-- generate-dream renders inline; when the Edge Function dies (504/546/OOM) the
-- job sat in 'processing' until refund-stuck-jobs refunded it — no re-attempt.
-- These two columns let the sweeper REPLAY a dead render:
--   * payload       — the original request body, so generate-dream can be
--                     re-invoked verbatim (it reuses the same job_id, and the
--                     charge is idempotent on job_id, so no double-charge).
--   * attempt_count — bounds the retries; the sweeper re-dispatches up to 3 times
--                     then refunds + marks timeout (today's behavior).
-- Run in the dashboard SQL editor.

ALTER TABLE public.dream_jobs
  ADD COLUMN IF NOT EXISTS payload jsonb,
  ADD COLUMN IF NOT EXISTS attempt_count integer NOT NULL DEFAULT 0;

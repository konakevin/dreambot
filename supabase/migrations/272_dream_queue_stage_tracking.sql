-- Migration 272: render stage breadcrumbs that survive a hard isolate kill.
--
-- The render functions catch + log graceful failures richly (ai_generation_log
-- status='failed' + dream_jobs.error). But a HARD isolate kill — the 546
-- WORKER_RESOURCE_LIMIT, an OOM, a gateway recycle — terminates the isolate
-- before any catch runs, so NONE of that logging happens. The job just sits
-- in_progress until the worker's stale-recovery sweep re-queues it, and we lose
-- all evidence of WHICH STAGE died.
--
-- Fix: stamp the render's progress into dream_queue (the row created at enqueue,
-- which outlives the killed isolate) BEFORE each risky step. After a hard kill,
-- `current_stage` tells us exactly where it died — Sonnet? Flux? face-swap?
-- The worker's stale-recovery reads this stage to fire the Sentry event the
-- dead isolate never could.
--
-- Also: link ai_generation_log rows to the job UUID so the forensics RPC
-- (migration 273) can stitch the audit row to a specific render exactly, rather
-- than by fuzzy user_id + time proximity.
--
-- Additive only. Rollback-safe.

-- ── 1. dream_queue stage breadcrumbs ───────────────────────────────────────
ALTER TABLE public.dream_queue
  ADD COLUMN IF NOT EXISTS current_stage   text,
  ADD COLUMN IF NOT EXISTS stage_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS model           text;

COMMENT ON COLUMN public.dream_queue.current_stage IS
  'Last pipeline stage the render reached, stamped BEFORE each risky step so it survives a hard isolate kill (546/OOM). One of: claimed, resolve, sonnet_brief, flux_render, face_swap, upload, persist.';
COMMENT ON COLUMN public.dream_queue.stage_updated_at IS
  'When current_stage was last set — shows how long the render sat in the stage that killed it.';
COMMENT ON COLUMN public.dream_queue.model IS
  'AI model chosen for this render, recorded as soon as it is picked so a hard kill (which skips ai_generation_log) still records which model was running.';

-- ── 2. link the audit log to the job UUID ──────────────────────────────────
ALTER TABLE public.ai_generation_log
  ADD COLUMN IF NOT EXISTS job_id uuid;

COMMENT ON COLUMN public.ai_generation_log.job_id IS
  'dream_queue.id / dream_jobs.id this generation belongs to (= sparkle ledger reference_id = failure-notification reference_id). Lets dream_forensics() stitch the audit row to an exact render. NULL for legacy rows + pure-synchronous renders without a job.';

CREATE INDEX IF NOT EXISTS idx_ai_gen_log_job ON public.ai_generation_log(job_id)
  WHERE job_id IS NOT NULL;

-- 520: mark QA renders in ai_generation_log so spend can be split from production.
--
-- WHY. Measured 2026-09-16 over the log's full 30-day retention: 5,072 renders costing
-- $212.77, of which 4,339 renders / $174.21 — 82% of the bill — were OUR OWN testing on
-- Kevin's account, not user traffic. Real production is ~733 renders and ~$38/month. That
-- ratio is fine (QA spend is a choice, not a leak) but it is invisible: every "what are we
-- spending on renders" question currently returns a number dominated by whatever matrix
-- was run that week, and the only way to separate them was "exclude Kevin's user_id",
-- which is wrong in both directions — it drops his genuine personal dreams and it would
-- miss QA run on any other account.
--
-- WHAT COUNTS AS QA is derived, not declared: _shared/qaRequest.ts treats a render as QA
-- when its request carried any `force_*` / `qa_*` flag, because those are worker-token
-- gated and production never sets them. The handful production DOES set (force_place on
-- the first-dream path, persist, queue_job_id, first_dream, strict_face_swap) are
-- allow-listed there. A future force_* flag is therefore counted automatically, with no
-- edit here and nothing to remember.
--
-- NOT backfilled by this migration: the flag cannot be reconstructed for rows written
-- before the writers set it, so history stays false and the split is only meaningful from
-- the deploy forward. Tonight's known QA batches are backfilled separately by caption,
-- where the evidence is unambiguous.

ALTER TABLE public.ai_generation_log
  ADD COLUMN IF NOT EXISTS is_qa boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.ai_generation_log.is_qa IS
  'TRUE when the render came from a QA/eval request (any force_*/qa_* flag except the ones production sets). Set by _shared/qaRequest.ts via insertGenerationLog. Use it to separate testing spend from user spend; rows before migration 520 are false regardless of origin.';

-- Spend queries are "sum cost over a window, split by is_qa", so the window column leads.
CREATE INDEX IF NOT EXISTS ai_generation_log_created_is_qa_idx
  ON public.ai_generation_log (created_at DESC, is_qa);

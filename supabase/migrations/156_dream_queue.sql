-- 156 — dream_queue: async generation pipeline backbone.
--
-- See QUEUE_WORKERS_REFACTOR.md for the full architecture rationale.
--
-- Workflow:
--   1. Lightweight enqueue Edge Function (e.g. generate-first-dream) builds
--      the persona/medium/vibe/brief payload, INSERTs a queued row, returns
--      `{dreamId, status: 'queued'}` to the client in <500 ms.
--   2. dream-queue-worker (cron-triggered, every 15s) atomically claims one
--      row via SELECT ... FOR UPDATE SKIP LOCKED, runs Sonnet/Flux/face-swap
--      at its own pace (no 2 s CPU pressure), updates status as it goes.
--   3. Client subscribes to Realtime on this table filtered by id=dreamId,
--      sees status='in_progress' → 'completed' → renders the upload row.
--   4. Failed jobs auto-retry with exponential backoff (1m / 5m / 30m).
--      After 5 attempts they land in 'dead_letter' for human review.
--
-- This decouples user-facing latency from heavy generation work and
-- lets us recover gracefully from Replicate cold starts, transient
-- Anthropic 429s, and Supabase WORKER_RESOURCE_LIMIT errors that the
-- Phase 2 fanout couldn't fix on its own.

CREATE TABLE public.dream_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,

  -- Which pipeline this job belongs to. Worker dispatches by this.
  source text NOT NULL CHECK (source IN ('first_dream', 'nightly', 'create', 'dlt')),

  -- All inputs the worker needs to render: persona, medium_key, vibe_key,
  -- sonnet_brief (pre-built at enqueue time), compositionMode, cast (URLs
  -- only, no description), userPlace, userThing, etc. Schema is per-source
  -- — validated by the worker's dispatcher, not by the DB.
  payload jsonb NOT NULL,

  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'in_progress', 'completed', 'failed', 'dead_letter')),

  attempt_count integer NOT NULL DEFAULT 0,

  -- Set on success — points to the rendered row in uploads.
  upload_id uuid REFERENCES public.uploads (id) ON DELETE SET NULL,

  -- Worker isolate identifier (set when claiming) — useful for stale-job
  -- detection. Format: '<region>:<short-uuid>'.
  worker_id text,

  -- Last error message, truncated to 1000 chars by the worker on failure.
  last_error text,

  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Worker query: SELECT ... WHERE status = 'queued' ORDER BY created_at LIMIT 1
-- FOR UPDATE SKIP LOCKED. The partial index keeps it tiny and fast even
-- as the table grows over time (completed/failed/dead_letter rows are
-- excluded from the index).
CREATE INDEX idx_dream_queue_pending
  ON public.dream_queue (created_at)
  WHERE status IN ('queued', 'in_progress');

-- User's queue history — for the client's "your dream is generating" UI
-- to find their most recent pending job.
CREATE INDEX idx_dream_queue_user_status
  ON public.dream_queue (user_id, status, created_at DESC);

-- Stale-job recovery query: SELECT ... WHERE status = 'in_progress'
-- AND started_at < now() - interval '5 minutes'.
CREATE INDEX idx_dream_queue_stale
  ON public.dream_queue (started_at)
  WHERE status = 'in_progress';

-- Dead-letter monitoring: for the daily summary job.
CREATE INDEX idx_dream_queue_dead_letter
  ON public.dream_queue (created_at DESC)
  WHERE status = 'dead_letter';

-- ── RLS — users read their own queue rows; service role does the writes ──

ALTER TABLE public.dream_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read their own dream_queue rows"
  ON public.dream_queue
  FOR SELECT
  USING (user_id = auth.uid());

-- INSERTs come exclusively from Edge Functions running with service role.
-- UPDATEs come exclusively from the worker. No user-facing INSERT/UPDATE/
-- DELETE policy — service role bypasses RLS.

-- ── Realtime publication ────────────────────────────────────────────────
-- Enables the client to subscribe to status changes for their dream.
-- Filtered subscriptions (id=dreamId or user_id=auth.uid()) work via the
-- standard Supabase Realtime channel API.

ALTER PUBLICATION supabase_realtime ADD TABLE public.dream_queue;

-- 259 — make dream_queue.dedup_key onConflict-targetable (fix nightly enqueue crash)
--
-- Root cause (2026-06-12): the subscription/sparkle audit (commit 4d1841c4, "L8")
-- changed the nightly enqueue from a plain INSERT to
--   .upsert(rows, { onConflict: 'dedup_key', ignoreDuplicates: true })
-- to gracefully absorb a race collision instead of failing the whole batch. But
-- migration 192 created dedup_key's unique index as a PARTIAL index:
--   CREATE UNIQUE INDEX idx_dream_queue_dedup ON dream_queue (dedup_key)
--   WHERE dedup_key IS NOT NULL;
-- PostgREST's onConflict('dedup_key') emits `ON CONFLICT (dedup_key)` WITHOUT the
-- partial predicate, so Postgres can't infer the partial index →
--   42P10 "there is no unique or exclusion constraint matching the ON CONFLICT
--   specification"
-- → the entire nightly enqueue aborted and NO jobs were created for anyone
-- (the GitHub Actions cron failed on its first run after the audit).
--
-- Fix the SCHEMA (not the code): replace the partial unique index with a plain
-- (non-partial) unique index on dedup_key. Semantics are identical for our use:
-- Postgres treats NULLs as DISTINCT in a unique index by default, so multiple
-- NULL dedup_keys (non-nightly jobs) are still allowed; non-null keys stay unique
-- (per-user-per-day idempotency preserved). The only difference: a plain unique
-- index IS inferable by onConflict('dedup_key'), so the audit's resilient upsert
-- works as intended. The existing partial index already guaranteed non-null
-- uniqueness, so no duplicate rows can exist to block the new index.

DROP INDEX IF EXISTS public.idx_dream_queue_dedup;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dream_queue_dedup
  ON public.dream_queue (dedup_key);

COMMENT ON COLUMN public.dream_queue.dedup_key IS
  'Idempotency key, unique when set (NULLs allowed/distinct for non-nightly jobs). Enqueuer format e.g. nightly:<user_id>:<UTC-date>. Non-partial unique index (migration 259) so onConflict can target it.';

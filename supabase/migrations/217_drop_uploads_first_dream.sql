-- Migration 217: drop uploads.first_dream column + index
--
-- The `uploads.first_dream` boolean (added in migration 141) was set ONLY
-- by the dream-queue-worker's first_dream dispatcher
-- (supabase/functions/dream-queue-worker/dispatchers/firstDream.ts), which
-- was removed 2026-06-02 with the experimental generate-first-dream
-- engine rip-out. No UI surface reads it. Onboarding's first dream now
-- routes through the production nightly-dreams engine with force_cast_role
-- + force_face_swap_eligible (see RevealStep.tsx + memory:
-- project_first_dream_via_nightly_engine).
--
-- NOT touched:
--   • users.first_dream_completed_at — still the one-shot onboarding
--     guard (separate concept, in active use)
--   • dream_queue.source CHECK constraint — 'first_dream' enum value
--     kept for back-compat with pre-2026-06-02 dead-letter rows. Old
--     rows now hit the worker's default switch branch and dead-letter
--     cleanly via 'unknown_source:first_dream'. Stripping the enum
--     value would require DELETEing those rows first, which is more
--     destructive than leaving the harmless vestigial value alone.
--
-- Rollback: revert this migration to restore the column + index. Engine
-- code revert restores the dispatcher's writer. Per-render flag data is
-- non-recoverable (all rows reset to default false on column re-add).

drop index if exists public.idx_uploads_first_dream;
alter table public.uploads drop column if exists first_dream;

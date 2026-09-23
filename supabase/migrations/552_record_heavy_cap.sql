-- 552_record_heavy_cap.sql — record the heavy render cap that has been live since the 09-21 load test, 2026-09-23.
-- NIGHTLY_ROBUSTNESS_PLAN.md item 5 (config hygiene).
--
-- WHY. dream_queue_max_concurrent_heavy has been 3 in production since it was set BY HAND during the 2026-09-21
-- Create load test, with no migration: the repo said 15 (column default, migration 265) and the code fallback said
-- 10 (the July "~10 swaps per machine" rule). Both are wrong for the swap service we measured: 3+ couples swapping
-- at once failed 31% of the time on 2 machines. This migration makes the repo match production. No behaviour
-- change: the live value is already 3.
--
-- HOW THE CAP RELATES TO FLY NOW. Since the swap capacity gate (549/550) the heavy cap no longer decides how many
-- swaps hit Fly at once (the gate does, via fly_dual_swap_slots). It decides how many heavy renders run, and every
-- one of them may need a swap slot. A render that cannot get a slot within swap_gate_max_wait_ms re-queues
-- (nightly) or degrades (Create), so the useful ceiling is
--     heavy cap <= fly_dual_swap_slots * (1 + swap_gate_max_wait_ms / typical swap time ~25 s)
-- = 2 * (1 + 45/25) = 5.6 today. heavyCapCeiling in scripts/lib/nightlySwapHealth.js computes it; the dream-queue monitor flags a
-- cap above it. To scale: `fly scale count N` FIRST, then raise fly_dual_swap_slots, then the heavy cap
-- (QUEUE_WORKERS_REFACTOR.md runbook).
--
-- ROLLBACK: none needed (no behaviour change). The cap stays live-tunable on the engine_config row.

UPDATE public.engine_config SET dream_queue_max_concurrent_heavy = 3 WHERE id = 1;

ALTER TABLE public.engine_config ALTER COLUMN dream_queue_max_concurrent_heavy SET DEFAULT 3;

COMMENT ON COLUMN public.engine_config.dream_queue_max_concurrent_heavy IS
  'Max heavy (face-swap-likely) renders in progress at once. Bounded by the Fly swap slots: <= fly_dual_swap_slots * (1 + swap_gate_max_wait_ms / ~25 s). Scale Fly first, then fly_dual_swap_slots, then this (migration 552).';

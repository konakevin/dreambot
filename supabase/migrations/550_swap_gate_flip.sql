-- 550_swap_gate_flip.sql — switch on the swap capacity gate and the nightly capacity retry, 2026-09-23.
-- NIGHTLY_ROBUSTNESS_PLAN.md items 1 + 2 (Kevin: "start with 1 and 2"); built and deployed inert in migration 549.
--
--   swap_gate_enabled = true          dual swaps wait for a free Fly slot (2 slots, 1 reserved for Create)
--   nightly_swap_capacity_retries = 2 a queued nightly couple whose swap failed for CAPACITY goes back to the
--                                     queue (backoff 1m / 5m) on its first two attempts instead of shipping a
--                                     solo; from the third attempt the old degrade applies so a dream always ships
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET swap_gate_enabled = false, nightly_swap_capacity_retries = 0 WHERE id = 1;

UPDATE public.engine_config
   SET swap_gate_enabled = true,
       nightly_swap_capacity_retries = 2
 WHERE id = 1;

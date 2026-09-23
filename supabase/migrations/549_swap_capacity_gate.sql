-- 549_swap_capacity_gate.sql — make the nightly run wait for swap capacity instead of failing over, 2026-09-23.
-- NIGHTLY_ROBUSTNESS_PLAN.md items 1 + 2 (Kevin: "start with 1 and 2").
--
-- MEASURED (21 nights): every dual-swap failure on the Fly face-swap service happened when 3+ couples started in
-- the same minute (1-2 at once: 0 errors / 32; 3-4 at once: 8 errors / 26, 42% shipped as a solo). The nightly
-- enqueue puts each time zone's users in ONE insert, so the 10:18 UTC Denver burst hit that cliff nightly. Nothing
-- coordinated the Fly service, a swap error was never retried, and a solo counted as "completed".
--
-- THIS MIGRATION
--   1. Disables the couple pose "both with arms spread wide and open as if taking in a vast view" (action_poses
--      3508, DUAL_ACTIONS_DYNAMIC). Probe of Kevin's 09-23 dream: exact replay 3/7 held; the same replay with a
--      neutral pose 8/8; with the vibe swapped instead 3/8. (The code array drops it too.)
--   2. swap_slot_leases + acquire_swap_slot / release_swap_slot: a counting semaphore for Fly dual swaps
--      (_shared/swapCapacityGate.ts). Leases expire so a crashed render frees its slot. Service role only.
--   3. Settings, all INERT on apply:
--        swap_gate_enabled                 false → flip after the deploy is verified (migration 550)
--        fly_dual_swap_slots               2     safe concurrent swaps (1-2 at once = 0 errors measured)
--        fly_dual_swap_interactive_reserve 1     slots only Create may take (a user is watching)
--        swap_gate_max_wait_ms             45000 longest a swap waits for a slot
--        nightly_swap_capacity_retries     0     queue attempts on which a capacity failure re-queues the nightly
--                                                job instead of shipping a solo (flip to 2 with the gate)
--
-- ROLLBACK (instant, no deploy):
--   UPDATE public.engine_config SET swap_gate_enabled = false, nightly_swap_capacity_retries = 0 WHERE id = 1;
--   UPDATE public.action_poses SET disabled = false WHERE id = 3508;

UPDATE public.action_poses SET disabled = true WHERE id = 3508;

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS swap_gate_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fly_dual_swap_slots integer NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS fly_dual_swap_interactive_reserve integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS swap_gate_max_wait_ms integer NOT NULL DEFAULT 45000,
  ADD COLUMN IF NOT EXISTS nightly_swap_capacity_retries integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.engine_config.swap_gate_enabled IS
  'Dual swaps wait for a free Fly slot (acquire_swap_slot) instead of piling onto the service. false = un-gated.';
COMMENT ON COLUMN public.engine_config.fly_dual_swap_slots IS
  'Concurrent dual swaps the Fly face-swap-dual service handles cleanly (2 machines x soft_limit 1). Scale Fly first, then raise.';
COMMENT ON COLUMN public.engine_config.fly_dual_swap_interactive_reserve IS
  'Of fly_dual_swap_slots, how many only INTERACTIVE (Create) swaps may take. Batch (nightly) always gets at least 1.';
COMMENT ON COLUMN public.engine_config.swap_gate_max_wait_ms IS
  'Longest a dual swap waits for a slot before giving up with swap_capacity_busy.';
COMMENT ON COLUMN public.engine_config.nightly_swap_capacity_retries IS
  'Nightly couple: on queue attempts below this, a CAPACITY swap failure re-queues the job (backoff) instead of shipping a solo. 0 = off.';

CREATE TABLE IF NOT EXISTS public.swap_slot_leases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holder text,
  priority text NOT NULL CHECK (priority IN ('interactive', 'batch')),
  acquired_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
ALTER TABLE public.swap_slot_leases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.swap_slot_leases FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.acquire_swap_slot(p_holder text, p_priority text, p_ttl_ms integer)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_slots integer;
  v_reserve integer;
  v_limit integer;
  v_active integer;
  v_id uuid;
BEGIN
  -- One writer at a time, so two concurrent callers can never both see the last free slot.
  PERFORM pg_advisory_xact_lock(hashtext('public.swap_slot_leases'));
  DELETE FROM public.swap_slot_leases WHERE expires_at < now();

  SELECT COALESCE(ec.fly_dual_swap_slots, 2), COALESCE(ec.fly_dual_swap_interactive_reserve, 1)
    INTO v_slots, v_reserve
    FROM public.engine_config ec WHERE ec.id = 1;
  v_slots := GREATEST(COALESCE(v_slots, 2), 1);
  v_reserve := GREATEST(COALESCE(v_reserve, 1), 0);
  v_limit := CASE WHEN p_priority = 'interactive' THEN v_slots ELSE GREATEST(v_slots - v_reserve, 1) END;

  SELECT count(*) INTO v_active FROM public.swap_slot_leases;
  IF v_active >= v_limit THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.swap_slot_leases (holder, priority, expires_at)
  VALUES (
    left(p_holder, 120),
    CASE WHEN p_priority = 'interactive' THEN 'interactive' ELSE 'batch' END,
    now() + make_interval(secs => GREATEST(LEAST(COALESCE(p_ttl_ms, 120000), 300000), 5000) / 1000.0)
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END
$$;

CREATE OR REPLACE FUNCTION public.release_swap_slot(p_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  DELETE FROM public.swap_slot_leases WHERE id = p_id;
$$;

REVOKE ALL ON FUNCTION public.acquire_swap_slot(text, text, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_swap_slot(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.acquire_swap_slot(text, text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_swap_slot(uuid) TO service_role;

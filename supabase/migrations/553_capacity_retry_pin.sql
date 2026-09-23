-- 553_capacity_retry_pin.sql — a nightly couple sent back to the queue for swap capacity comes back as the SAME
-- couple, 2026-09-23. NIGHTLY_ROBUSTNESS_PLAN.md (Kevin: "why not do all the not started items?").
--
-- WHY. Since 549/550 a nightly couple whose swap cannot get Fly capacity fails RETRYABLY (SwapCapacityRetryError) and
-- the worker re-queues it with backoff. But the next attempt re-rolled the whole dream, so about half the time it
-- came back a SOLO: the outcome the retry exists to prevent (seen live in the 09-23 worker test: couple → busy →
-- retry → solo). Now the failed attempt records { cast_role: 'dual', partner_id } on its own queue row; the worker
-- already forwards the payload to the render, which keeps the couple type and the same +1 and re-rolls the rest.
--
-- record_capacity_retry_pin merges that into dream_queue.payload in ONE statement (no read-modify-write race), and
-- only while the job is still in_progress (a job another claim already finished is left alone). Returns whether a
-- row was updated. Service role only.
--
-- ROLLBACK: harmless to leave; the render ignores the pin when engine_config.nightly_swap_capacity_retries = 0
-- (no capacity retries happen at all). To stop pinning while keeping retries, deploy nightly-dreams without the pin.

CREATE OR REPLACE FUNCTION public.record_capacity_retry_pin(p_job_id uuid, p_partner_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_n int;
BEGIN
  UPDATE public.dream_queue q
     SET payload = coalesce(q.payload, '{}'::jsonb)
                   || jsonb_build_object(
                        'capacity_retry',
                        jsonb_build_object('cast_role', 'dual', 'partner_id', p_partner_id)
                      )
   WHERE q.id = p_job_id
     AND q.status = 'in_progress';
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN v_n > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.record_capacity_retry_pin(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_capacity_retry_pin(uuid, text) TO service_role;

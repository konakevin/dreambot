-- 413_dream_off_fail_entry.sql (2026-07-26)
--
-- Dream Off — Stage B support (DREAM_OFF_BUILD_PLAN.md §1, edge dead-letter seam).
-- dream_off_fail_entry: the entry-lifecycle terminal for a NON-NSFW render failure
-- (the render dead-lettered after exhausting retries, or its isolate hard-died).
-- Symmetric with dream_off_forfeit_entry (406) but keeps moderation_status='clean'
-- (it wasn't moderated out — the render just failed), so a "failed" entry reads
-- differently from a "forfeited" one while both are excluded from the tally/gallery.
--
-- Marks the entry render_status='failed', pot-aware refunds it (dream_off_refund_entry:
-- restore the escrow slot, else refund_sparkles the self-payer), then funnels through
-- maybe_advance (a dead entry can unblock a deadline/all-submitted advance). Keeping
-- this in the DB (vs the edge) keeps the entry-state transition atomic + dbspec-locked.
--
-- SERVICE-ROLE only (called by the worker / render dead-letter path). Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.dream_off_fail_entry(
  p_game_id uuid, p_entry_job_id uuid
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.dream_off_entries
    SET render_status = 'failed'
    WHERE game_id = p_game_id AND payment_reference = p_entry_job_id;
  IF NOT FOUND THEN RETURN; END IF;   -- nothing to fail (unknown job) — no-op

  PERFORM public.dream_off_refund_entry(p_game_id, p_entry_job_id);
  PERFORM public.maybe_advance_dream_off(p_game_id, false, 'entry_failed');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.dream_off_fail_entry(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dream_off_fail_entry(uuid, uuid) TO service_role;

COMMIT;

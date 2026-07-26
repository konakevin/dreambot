-- 406_dream_off_entry_seam.sql (2026-07-26)
--
-- Dream Off — Step 1 cont. (DREAM_OFF_BUILD_PLAN.md §1 A7). The entry LIFECYCLE
-- seam: the service-role RPCs the render path calls around a game entry's dream.
-- These are the bridge between the shared dream_queue/generate-dream render and
-- the game's own entry/phase/economy state.
--
-- Identity contract (locked here): an entry's dream_queue job_id is stored in
-- dream_off_entries.payment_reference. That SAME uuid is the pot-ledger
-- reference_id for a pot 'spend'/'refund' AND the charge_sparkles/refund_sparkles
-- reference_id for a self-paid entry — one id threads render + payment, so every
-- seam below correlates an entry by (game_id, payment_reference = job_id).
--
-- All four are SERVICE-ROLE ONLY (REVOKE FROM PUBLIC + GRANT service_role) — they
-- are invoked by the dream-off-submit / generate-dream / worker edge functions
-- with the service key, never by a client. SECURITY DEFINER + search_path=''.
--
-- Dependencies: the entry/player/event tables (400), the pot + ledger (402), the
-- phase machine maybe_advance_dream_off (405), refund_sparkles (unmodified, 278).
-- Re-runnable.

BEGIN;

-- ── dream_off_create_entry: seed/redo the pending entry a render will fill ─────
-- Called by dream_off_submit_entry (economy, A10) after the funding decision, to
-- create the entry row the render targets. ON CONFLICT redo lets a player re-roll
-- a failed/forfeited entry while submission is still open (one row per player).
CREATE OR REPLACE FUNCTION public.dream_off_create_entry(
  p_game_id uuid, p_author_id uuid, p_entry_job_id uuid
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_phase text;
  v_name  text;
  v_entry_id uuid;
BEGIN
  SELECT phase INTO v_phase FROM public.dream_offs WHERE id = p_game_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: game not found'; END IF;
  IF v_phase <> 'submission' THEN RAISE EXCEPTION 'dream_off: not accepting entries'; END IF;

  -- Must be a seated member (active/pending) — defense in depth behind the submit gate.
  IF NOT EXISTS (
    SELECT 1 FROM public.dream_off_players
    WHERE game_id = p_game_id AND user_id = p_author_id AND status IN ('active', 'pending')
  ) THEN
    RAISE EXCEPTION 'dream_off: not a member of this game';
  END IF;

  SELECT COALESCE(display_name, username, 'Someone') INTO v_name
    FROM public.users WHERE id = p_author_id;

  INSERT INTO public.dream_off_entries
    (game_id, author_id, author_name_snapshot, payment_reference, render_status, moderation_status)
  VALUES
    (p_game_id, p_author_id, COALESCE(v_name, 'Someone'), p_entry_job_id, 'rendering', 'clean')
  ON CONFLICT (game_id, author_id) DO UPDATE
    SET payment_reference = EXCLUDED.payment_reference,
        render_status     = 'rendering',
        moderation_status = 'clean',
        upload_id         = NULL,
        game_image_ref    = NULL,
        completed_at      = NULL
  RETURNING id INTO v_entry_id;

  RETURN v_entry_id;
END;
$$;

-- ── dream_off_attach_render: the render finished — attach it + advance ─────────
-- generate-dream's dream_off completion hook calls this after persisting the
-- upload. Marks the entry completed, records the player's submission, then funnels
-- through the guarded phase machine (which may flip submission→voting/results).
CREATE OR REPLACE FUNCTION public.dream_off_attach_render(
  p_game_id uuid, p_entry_job_id uuid, p_upload_id uuid, p_game_image_ref text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_author uuid;
  v_name   text;
BEGIN
  UPDATE public.dream_off_entries
    SET render_status = 'completed',
        upload_id      = p_upload_id,
        game_image_ref = p_game_image_ref,
        completed_at   = now()
    WHERE game_id = p_game_id AND payment_reference = p_entry_job_id
    RETURNING author_id, author_name_snapshot INTO v_author, v_name;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: entry not found for job %', p_entry_job_id; END IF;

  -- Record the submission on the player row (drives the "all submitted" gate).
  IF v_author IS NOT NULL THEN
    UPDATE public.dream_off_players
      SET submitted_at = COALESCE(submitted_at, now())
      WHERE game_id = p_game_id AND user_id = v_author;
  END IF;
  INSERT INTO public.dream_off_events (game_id, actor_id, actor_name_snapshot, kind)
    VALUES (p_game_id, v_author, v_name, 'submitted');

  PERFORM public.maybe_advance_dream_off(p_game_id, false, 'entry_complete');
END;
$$;

-- ── dream_off_refund_entry: pot-aware refund of one entry's cost ───────────────
-- If the entry was pot-funded (a 'spend' ledger row exists for this job_id),
-- restore the slot into the escrow balance; otherwise the entrant self-paid, so
-- refund_sparkles them (actual-recorded-spend only, idempotent). Both idempotent.
CREATE OR REPLACE FUNCTION public.dream_off_refund_entry(
  p_game_id uuid, p_entry_job_id uuid
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_entry_id uuid;
  v_author   uuid;
  v_spend    integer;   -- signed pot debit for this entry (negative), if pot-funded
  v_refund   integer;
  v_bal      integer;
BEGIN
  SELECT id, author_id INTO v_entry_id, v_author
    FROM public.dream_off_entries
    WHERE game_id = p_game_id AND payment_reference = p_entry_job_id;
  IF NOT FOUND THEN RETURN; END IF;   -- nothing to refund

  SELECT amount INTO v_spend
    FROM public.dream_off_pot_ledger
    WHERE game_id = p_game_id AND kind = 'spend' AND reference_id = p_entry_job_id;

  IF FOUND THEN
    -- Pot-funded: credit the slot back to the escrow (idempotent on the unique key).
    v_refund := -v_spend;
    SELECT balance INTO v_bal FROM public.dream_off_pot WHERE game_id = p_game_id FOR UPDATE;
    INSERT INTO public.dream_off_pot_ledger
      (game_id, kind, amount, balance_after, reference_id, entry_id, actor_id)
    VALUES
      (p_game_id, 'refund', v_refund, v_bal + v_refund, p_entry_job_id, v_entry_id, v_author)
    ON CONFLICT (game_id, kind, reference_id) DO NOTHING;
    IF FOUND THEN
      UPDATE public.dream_off_pot
        SET balance = balance + v_refund, updated_at = now()
        WHERE game_id = p_game_id;
    END IF;
  ELSIF v_author IS NOT NULL THEN
    -- Self-paid: refund the entrant's own sparkles for this job (actual spend only).
    PERFORM public.refund_sparkles(v_author, 0, 'refund:dream_off_entry', p_entry_job_id);
  END IF;
END;
$$;

-- ── dream_off_forfeit_entry: moderation forfeit (NSFW) → drop + refund ─────────
-- generate-dream's completion hook calls this instead of attach_render when the
-- render moderates out. Kevin's decision: NSFW forfeit REFUNDS (kinder + consistent
-- with the create dead-letter). The entry is marked failed/forfeit so it never
-- counts toward the tally or gallery; the player may re-roll while submission is open.
CREATE OR REPLACE FUNCTION public.dream_off_forfeit_entry(
  p_game_id uuid, p_entry_job_id uuid
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.dream_off_entries
    SET render_status = 'failed', moderation_status = 'forfeit_nsfw'
    WHERE game_id = p_game_id AND payment_reference = p_entry_job_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: entry not found for job %', p_entry_job_id; END IF;

  PERFORM public.dream_off_refund_entry(p_game_id, p_entry_job_id);
  -- A forfeit can unblock a deadline/all-submitted advance — funnel through the machine.
  PERFORM public.maybe_advance_dream_off(p_game_id, false, 'forfeit');
END;
$$;

-- ── Service-role only: revoke the default PUBLIC execute, grant service_role ────
REVOKE EXECUTE ON FUNCTION public.dream_off_create_entry(uuid, uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.dream_off_attach_render(uuid, uuid, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.dream_off_refund_entry(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.dream_off_forfeit_entry(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dream_off_create_entry(uuid, uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.dream_off_attach_render(uuid, uuid, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.dream_off_refund_entry(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.dream_off_forfeit_entry(uuid, uuid) TO service_role;

COMMIT;

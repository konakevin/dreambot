-- 408_dream_off_submit.sql (2026-07-26)
--
-- Dream Off — Step 2 cont. (DREAM_OFF_BUILD_PLAN.md §1 A10, economy). The SUBMIT
-- linchpin: dream_off_submit_entry — the atomic funding decision the dream-off-submit
-- edge function calls (after it authenticates the JWT) to pay for + seed one entry
-- before kicking its render.
--
-- Funding decision (ATOMIC, under the per-pot row lock):
--   • pot has balance ≥ frozen slot_price → draw down the escrow ('spend' ledger,
--     reference_id = the render job_id), so the OWNER's prefund covers the entry.
--   • otherwise the entrant self-pays via charge_sparkles(reference_id = job_id);
--     insufficient → return without creating an entry (no half-charged state).
-- Then create the entry (dream_off_create_entry) keyed by that same job_id, so the
-- render-attach + refund seams (406) correlate payment ↔ render by one id.
--
-- Tier gate 1: the chosen model must be in the game's frozen tier's model set
-- (generate-dream re-checks as gate 2). Money-safety: server-computed price from
-- the pot, idempotent on the job_id (retry can't double-charge or double-debit),
-- one paid entry per player (a completed/rendering entry blocks a second charge).
--
-- SERVICE-ROLE ONLY (the edge fn calls it post-auth, passing the trusted user id).
-- Re-runnable.

BEGIN;

CREATE OR REPLACE FUNCTION public.dream_off_submit_entry(
  p_game_id uuid, p_user_id uuid, p_entry_job_id uuid, p_model_id text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_enabled  boolean;
  v_game     record;
  v_models   text[];
  v_existing record;
  v_pot      record;
  v_funding  text;
  v_charge   text;
  v_entry_id uuid;
BEGIN
  SELECT dream_off_enabled INTO v_enabled FROM public.engine_config WHERE id = 1;
  IF NOT COALESCE(v_enabled, false) THEN RETURN jsonb_build_object('status', 'disabled'); END IF;

  SELECT id, phase, tier_key INTO v_game FROM public.dream_offs WHERE id = p_game_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: game not found'; END IF;
  IF v_game.phase <> 'submission' THEN RETURN jsonb_build_object('status', 'closed'); END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.dream_off_players
    WHERE game_id = p_game_id AND user_id = p_user_id AND status IN ('active', 'pending')
  ) THEN RAISE EXCEPTION 'dream_off: not a member of this game'; END IF;

  -- Tier gate 1: the model must be in the game's frozen tier's active set.
  SELECT model_ids INTO v_models
    FROM public.dream_off_tiers WHERE key = v_game.tier_key AND is_active;
  IF v_models IS NULL OR NOT (p_model_id = ANY (v_models)) THEN
    RETURN jsonb_build_object('status', 'model_not_allowed');
  END IF;

  -- One paid entry per player: a live (rendering/completed) entry under a DIFFERENT
  -- job blocks a second charge; the SAME job is an idempotent retry (fall through).
  SELECT render_status, payment_reference INTO v_existing
    FROM public.dream_off_entries WHERE game_id = p_game_id AND author_id = p_user_id;
  IF FOUND AND v_existing.render_status IN ('rendering', 'completed')
     AND v_existing.payment_reference IS DISTINCT FROM p_entry_job_id THEN
    RETURN jsonb_build_object('status', 'already_submitted');
  END IF;

  -- Funding decision under the pot lock.
  SELECT * INTO v_pot FROM public.dream_off_pot WHERE game_id = p_game_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'dream_off: pot not found'; END IF;

  IF v_pot.balance >= v_pot.slot_price THEN
    v_funding := 'pot';
  ELSE
    v_charge := public.charge_sparkles(p_user_id, v_pot.slot_price, 'dream_off_entry', p_entry_job_id);
    IF v_charge = 'insufficient' THEN
      RETURN jsonb_build_object('status', 'insufficient', 'price', v_pot.slot_price);
    END IF;
    v_funding := 'self';
  END IF;

  -- Seed/redo the entry (rendering), keyed by the job id.
  v_entry_id := public.dream_off_create_entry(p_game_id, p_user_id, p_entry_job_id);

  -- Draw the escrow down exactly once (idempotent on the ledger unique key).
  IF v_funding = 'pot' THEN
    INSERT INTO public.dream_off_pot_ledger
      (game_id, kind, amount, balance_after, reference_id, entry_id, actor_id)
    VALUES
      (p_game_id, 'spend', -v_pot.slot_price, v_pot.balance - v_pot.slot_price,
       p_entry_job_id, v_entry_id, p_user_id)
    ON CONFLICT (game_id, kind, reference_id) DO NOTHING;
    IF FOUND THEN
      UPDATE public.dream_off_pot SET balance = balance - v_pot.slot_price, updated_at = now()
        WHERE game_id = p_game_id;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'status', 'ok', 'entry_id', v_entry_id, 'job_id', p_entry_job_id, 'funding', v_funding
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.dream_off_submit_entry(uuid, uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dream_off_submit_entry(uuid, uuid, uuid, text) TO service_role;

COMMIT;

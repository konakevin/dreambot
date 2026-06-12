-- Migration 258: make grant_sparkles idempotent + config-driven welcome bonus
--
-- Audit findings (2026-06-11):
--   H1 — The RevenueCat webhook's replay protection was a non-atomic
--        SELECT-then-call in the Edge Function. grant_sparkles itself had NO
--        idempotency on the service-role path, so two CONCURRENT duplicate
--        webhook deliveries (RC retries aggressively) could both pass the
--        SELECT and both grant → double sparkle credit. (reference_id is uuid
--        and RC transaction-ids are text, so dedup must key on `reason`, e.g.
--        'purchase:<txid>' / 'pro_bundle:<txid>' / 'basic_bundle:<txid>'.)
--   H3 — welcome_bonus was hardcoded to 25 inside the RPC, so if an admin ever
--        changed engine_config.welcome_sparkle_bonus, every new user's welcome
--        grant would throw and silently fail.
--
-- Fix (no signature change — callers unchanged):
--   1. Take a per-user FOR UPDATE lock FIRST, so concurrent grants for the same
--      user serialize → the idempotency check is reliable (closes the TOCTOU).
--   2. Idempotency for any non-refund grant: a grant with a given `reason` is
--      applied at most once per user (purchase:/*_bundle:/welcome_bonus reasons
--      are globally unique per user; refund:* stays deduped by reference_id in
--      refund_sparkles, so it's excluded here).
--   3. welcome_bonus amount is validated against engine_config.welcome_sparkle_bonus
--      (COALESCE 25), not a hardcoded literal.
--   4. A partial UNIQUE INDEX on (user_id, reason) for the dedup-able grant
--      reasons is the hard DB backstop even if the RPC is ever bypassed.

CREATE OR REPLACE FUNCTION public.grant_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_is_service_role boolean := current_setting('role', true) = 'service_role';
  v_existing integer;
  v_after integer;
  v_welcome integer;
BEGIN
  -- Serialize all grants for this user. Two concurrent duplicate webhook
  -- deliveries now block on this lock, so the second sees the first's row and
  -- skips below (TOCTOU fix). Also bypass the user-column freeze trigger.
  PERFORM set_config('app.bypass_user_freeze', 'true', true);
  PERFORM 1 FROM public.users WHERE id = p_user_id FOR UPDATE;

  IF NOT v_is_service_role THEN
    IF p_user_id IS DISTINCT FROM auth.uid() THEN
      RAISE EXCEPTION 'Unauthorized: cannot grant sparkles to a different user';
    END IF;
    IF p_reason <> 'welcome_bonus' THEN
      RAISE EXCEPTION 'Unauthorized: only welcome_bonus may be granted by clients';
    END IF;
    -- H3: honor the admin-tunable config instead of a hardcoded 25.
    SELECT COALESCE((SELECT welcome_sparkle_bonus FROM public.engine_config WHERE id = 1), 25)
      INTO v_welcome;
    IF p_amount <> v_welcome THEN
      RAISE EXCEPTION 'welcome_bonus must equal the configured welcome_sparkle_bonus (got %, expected %)',
        p_amount, v_welcome;
    END IF;
  END IF;

  -- Idempotency (H1): a non-refund grant with this exact reason is applied at
  -- most once per user. refund:* reasons are deduped by reference_id elsewhere.
  IF p_reason NOT LIKE 'refund:%' THEN
    SELECT count(*) INTO v_existing
    FROM public.sparkle_transactions
    WHERE user_id = p_user_id AND reason = p_reason;
    IF v_existing > 0 THEN
      RETURN;
    END IF;
  END IF;

  UPDATE public.users SET sparkle_balance = sparkle_balance + p_amount
    WHERE id = p_user_id RETURNING sparkle_balance INTO v_after;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, balance_after)
    VALUES (p_user_id, p_amount, p_reason, v_after);
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_sparkles(uuid, integer, text) TO authenticated, service_role;

-- Hard DB backstop: even if grant_sparkles is ever bypassed, the same dedup-able
-- grant reason can't be inserted twice for a user. Guarded so a pre-existing
-- historical duplicate surfaces as a NOTICE (investigate + dedupe) rather than
-- aborting the whole migration.
DO $$
BEGIN
  CREATE UNIQUE INDEX IF NOT EXISTS ux_sparkle_tx_grant_reason
    ON public.sparkle_transactions (user_id, reason)
    WHERE reason LIKE 'purchase:%'
       OR reason LIKE 'pro_bundle:%'
       OR reason LIKE 'basic_bundle:%'
       OR reason = 'welcome_bonus';
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'ux_sparkle_tx_grant_reason NOT created: existing duplicate grant rows — dedupe then re-run.';
END $$;

COMMENT ON FUNCTION public.grant_sparkles IS
  'Idempotent sparkle grant. Per-user FOR UPDATE + reason-dedup makes concurrent duplicate webhook deliveries safe (migration 258). welcome_bonus amount validated against engine_config.welcome_sparkle_bonus.';

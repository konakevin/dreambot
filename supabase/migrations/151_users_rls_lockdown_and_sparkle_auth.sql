-- Migration 151: Lock down economic columns on `users` + auth-gate the
-- sparkle RPCs.
--
-- Background (audit 2026-05-08):
--  - The UPDATE policy from migration 001 (`users for update using
--    (auth.uid() = id)`) has no WITH CHECK and no column-level guard.
--    A client can PATCH their own user row and flip `pro_subscription`,
--    `sparkle_balance`, `is_admin`, etc., bypassing the webhook + RPC.
--  - `grant_sparkles`, `spend_sparkles`, and `refund_sparkles` are all
--    granted to `authenticated` and accept arbitrary `p_user_id`. Any
--    logged-in user can grant themselves (or anyone) unlimited sparkles
--    or spend victims' balances by passing a different uuid.
--
-- Fixes:
--  1. Add `freeze_user_columns_on_update()` trigger that prevents client
--     UPDATEs from touching: `is_admin`, `sparkle_balance`,
--     `pro_subscription`, `pro_subscription_expires_at`, `id`, `email`,
--     `created_at`. Service-role callers bypass via the role check;
--     SECURITY DEFINER RPCs bypass via a session config var.
--  2. Auth-gate `spend_sparkles` and `refund_sparkles` so client callers
--     can only act on their own row (`p_user_id = auth.uid()`).
--  3. Tighten `grant_sparkles`: client callers may grant only the
--     one-time `welcome_bonus` to themselves and only if they don't
--     already have one. Service role keeps full access for the webhook
--     and Edge Function refund/grant flows.
--  4. All three RPCs set `app.bypass_user_freeze = true` (txn-local) so
--     their UPDATE on `users.sparkle_balance` is allowed by the new
--     freeze trigger.

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- 1. Freeze trigger on public.users
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.freeze_user_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Service role (Edge Functions, scripts using service-role key) keeps
  -- full write access.
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- SECURITY DEFINER sparkle RPCs (spend/grant/refund) set this txn-local
  -- config var before their UPDATE so the freeze doesn't block them.
  IF current_setting('app.bypass_user_freeze', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Frozen economic + identity columns: revert any client-side change.
  IF NEW.is_admin                  IS DISTINCT FROM OLD.is_admin                  THEN NEW.is_admin                  := OLD.is_admin;                  END IF;
  IF NEW.sparkle_balance           IS DISTINCT FROM OLD.sparkle_balance           THEN NEW.sparkle_balance           := OLD.sparkle_balance;           END IF;
  IF NEW.pro_subscription          IS DISTINCT FROM OLD.pro_subscription          THEN NEW.pro_subscription          := OLD.pro_subscription;          END IF;
  IF NEW.pro_subscription_expires_at IS DISTINCT FROM OLD.pro_subscription_expires_at THEN NEW.pro_subscription_expires_at := OLD.pro_subscription_expires_at; END IF;
  IF NEW.id                        IS DISTINCT FROM OLD.id                        THEN NEW.id                        := OLD.id;                        END IF;
  IF NEW.email                     IS DISTINCT FROM OLD.email                     THEN NEW.email                     := OLD.email;                     END IF;
  IF NEW.created_at                IS DISTINCT FROM OLD.created_at                THEN NEW.created_at                := OLD.created_at;                END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_freeze_user_columns ON public.users;
CREATE TRIGGER trg_freeze_user_columns
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.freeze_user_columns_on_update();

-- ───────────────────────────────────────────────────────────────────────
-- 2. Harden spend_sparkles
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.spend_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_balance integer;
BEGIN
  -- Auth: clients can only spend their own sparkles. Service role bypasses.
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot spend sparkles for a different user';
  END IF;

  -- Bypass the freeze trigger for the balance update we're about to do.
  PERFORM set_config('app.bypass_user_freeze', 'true', true);

  -- Lock the row
  SELECT sparkle_balance INTO v_balance FROM public.users WHERE id = p_user_id FOR UPDATE;
  IF v_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE public.users SET sparkle_balance = sparkle_balance - p_amount WHERE id = p_user_id;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id)
    VALUES (p_user_id, -p_amount, p_reason, p_reference_id);

  RETURN true;
END;
$$;

-- ───────────────────────────────────────────────────────────────────────
-- 3. Harden grant_sparkles
-- ───────────────────────────────────────────────────────────────────────
-- Client callers (authenticated): can only grant the one-time
-- 'welcome_bonus' to themselves, exactly 25 sparkles, idempotent (skips
-- if a welcome_bonus transaction already exists). Service role can
-- grant anything to anyone (used by the webhook for Pro bundles, and
-- by Edge Functions for in-flow grants).
CREATE OR REPLACE FUNCTION public.grant_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_service_role boolean := current_setting('role', true) = 'service_role';
  v_existing integer;
BEGIN
  IF NOT v_is_service_role THEN
    -- Authenticated callers: enforce welcome-bonus-only contract.
    IF p_user_id IS DISTINCT FROM auth.uid() THEN
      RAISE EXCEPTION 'Unauthorized: cannot grant sparkles to a different user';
    END IF;
    IF p_reason <> 'welcome_bonus' THEN
      RAISE EXCEPTION 'Unauthorized: only welcome_bonus may be granted by clients';
    END IF;
    IF p_amount <> 25 THEN
      RAISE EXCEPTION 'Unauthorized: welcome_bonus is fixed at 25 sparkles';
    END IF;

    -- Idempotency: skip if welcome bonus already granted.
    SELECT count(*) INTO v_existing
    FROM public.sparkle_transactions
    WHERE user_id = p_user_id
      AND reason = 'welcome_bonus';
    IF v_existing > 0 THEN
      RETURN;
    END IF;
  END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);

  UPDATE public.users SET sparkle_balance = sparkle_balance + p_amount WHERE id = p_user_id;
  INSERT INTO public.sparkle_transactions (user_id, amount, reason)
    VALUES (p_user_id, p_amount, p_reason);
END;
$$;

-- ───────────────────────────────────────────────────────────────────────
-- 4. Harden refund_sparkles
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.refund_sparkles(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing integer;
BEGIN
  IF current_setting('role', true) <> 'service_role'
     AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot refund sparkles for a different user';
  END IF;

  -- Idempotency: skip if we already refunded this job
  SELECT count(*) INTO v_existing
  FROM public.sparkle_transactions
  WHERE user_id = p_user_id
    AND reference_id = p_reference_id
    AND reason LIKE 'refund:%';

  IF v_existing > 0 THEN
    RETURN false;
  END IF;

  PERFORM set_config('app.bypass_user_freeze', 'true', true);

  -- Lock the user row so balance update + transaction insert are atomic
  PERFORM 1 FROM public.users WHERE id = p_user_id FOR UPDATE;

  UPDATE public.users
    SET sparkle_balance = sparkle_balance + p_amount
    WHERE id = p_user_id;

  INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id)
    VALUES (p_user_id, p_amount, p_reason, p_reference_id);

  RETURN true;
END;
$$;

-- Re-grant execute (CREATE OR REPLACE preserves grants but be explicit)
GRANT EXECUTE ON FUNCTION public.spend_sparkles(uuid, integer, text, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.grant_sparkles(uuid, integer, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.refund_sparkles(uuid, integer, text, uuid) TO authenticated, service_role;

COMMIT;

COMMENT ON FUNCTION public.freeze_user_columns_on_update IS
  'Reverts client UPDATEs to economic + identity columns on users (is_admin, sparkle_balance, pro_subscription, pro_subscription_expires_at, id, email, created_at). Bypassed by service role and by SECURITY DEFINER sparkle RPCs that set app.bypass_user_freeze=true.';
COMMENT ON FUNCTION public.spend_sparkles IS
  'Spend sparkles atomically. Authenticated callers can only spend their own; service role bypasses the auth check.';
COMMENT ON FUNCTION public.grant_sparkles IS
  'Grant sparkles. Authenticated callers may only grant a one-time 25-sparkle welcome_bonus to themselves (idempotent). Service role may grant any amount/reason to any user (used by revenuecat-webhook + Edge Function refunds).';
COMMENT ON FUNCTION public.refund_sparkles IS
  'Idempotent refund tied to a job/upload reference_id. Authenticated callers can only refund their own; service role bypasses.';

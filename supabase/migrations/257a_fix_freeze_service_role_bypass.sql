-- 257a_fix_freeze_service_role_bypass.sql — HOTFIX for a regression in 257.
--
-- Migration 257 re-created freeze_user_columns_on_update() to add the two new
-- basic_subscription columns to the frozen set, but the rewrite ACCIDENTALLY
-- DROPPED the service-role bypass that migration 151 had at the top of the
-- function:
--
--     IF current_setting('role', true) = 'service_role' THEN RETURN NEW; END IF;
--
-- Without it, the BEFORE-UPDATE trigger reverts EVERY write to the frozen
-- columns — including legitimate service-role writes from the revenuecat-webhook
-- (which sets pro_subscription / basic_subscription / *_expires_at). Net effect:
-- subscription purchases silently fail to flip the entitlement. (The audit test
-- in proSubscriptionAudit.test.ts didn't catch it because it asserts against
-- migration 151's text, which still has the bypass.)
--
-- This re-creates the function with BOTH bypasses + all nine frozen columns
-- (the original seven + the two Basic columns). Run in the dashboard SQL editor.

CREATE OR REPLACE FUNCTION public.freeze_user_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Service role (Edge Functions incl. revenuecat-webhook, scripts using the
  -- service-role key) keeps full write access. THIS is what lets the webhook
  -- flip pro_subscription / basic_subscription.
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- SECURITY DEFINER sparkle RPCs (spend/grant/refund) set this txn-local
  -- config var before their UPDATE so the freeze doesn't block them.
  IF current_setting('app.bypass_user_freeze', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Frozen economic + identity columns: revert any client-side change.
  IF NEW.is_admin                      IS DISTINCT FROM OLD.is_admin                      THEN NEW.is_admin                      := OLD.is_admin;                      END IF;
  IF NEW.sparkle_balance               IS DISTINCT FROM OLD.sparkle_balance               THEN NEW.sparkle_balance               := OLD.sparkle_balance;               END IF;
  IF NEW.pro_subscription              IS DISTINCT FROM OLD.pro_subscription              THEN NEW.pro_subscription              := OLD.pro_subscription;              END IF;
  IF NEW.pro_subscription_expires_at   IS DISTINCT FROM OLD.pro_subscription_expires_at   THEN NEW.pro_subscription_expires_at   := OLD.pro_subscription_expires_at;   END IF;
  IF NEW.basic_subscription            IS DISTINCT FROM OLD.basic_subscription            THEN NEW.basic_subscription            := OLD.basic_subscription;            END IF;
  IF NEW.basic_subscription_expires_at IS DISTINCT FROM OLD.basic_subscription_expires_at THEN NEW.basic_subscription_expires_at := OLD.basic_subscription_expires_at; END IF;
  IF NEW.id                            IS DISTINCT FROM OLD.id                            THEN NEW.id                            := OLD.id;                            END IF;
  IF NEW.email                         IS DISTINCT FROM OLD.email                         THEN NEW.email                         := OLD.email;                         END IF;
  IF NEW.created_at                    IS DISTINCT FROM OLD.created_at                    THEN NEW.created_at                    := OLD.created_at;                    END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.freeze_user_columns_on_update IS
  'Reverts client UPDATEs to economic + identity columns on users (is_admin, sparkle_balance, pro_subscription[_expires_at], basic_subscription[_expires_at], id, email, created_at). Bypassed by the service role (Edge Functions/webhook) and by SECURITY DEFINER sparkle RPCs that set app.bypass_user_freeze=true.';

-- 454_freeze_newer_economic_columns.sql (2026-09-03, audit L1)
--
-- Belt-and-suspenders: add the NEWER economic columns to the users freeze trigger.
-- The 2026-09-03 audit (S2) claimed a client could PATCH basic_subscription_will_renew;
-- verification showed that's a FALSE POSITIVE — none of these columns appear in any
-- GRANT UPDATE list, so the column-grant model already blocks client writes. But the
-- freeze trigger is the documented second layer for economic columns, and these five
-- were only single-layered:
--
--   pro_subscription_will_renew    (mig 215) — cancellation signal, gates reminders
--   basic_subscription_will_renew  (mig 385) — same, Basic tier
--   pro_subscription_period        (mig 452) — monthly/yearly stamp, reconcile input
--   basic_subscription_period      (mig 452) — same, Basic tier
--   pro_trial_started_at           — the trial anchor (clearing it would re-arm a trial)
--
-- Full function re-created (CREATE OR REPLACE keeps trigger binding + grants), copied
-- verbatim from 257a with the five additions. BOTH bypasses preserved (the 257
-- regression lesson: dropping the service-role bypass silently broke webhook
-- entitlement flips).
--
-- Run in the Supabase dashboard SQL editor.

CREATE OR REPLACE FUNCTION public.freeze_user_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Service role (Edge Functions incl. revenuecat-webhook, scripts using the
  -- service-role key) keeps full write access.
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
  -- Audit-453 additions:
  IF NEW.pro_subscription_will_renew   IS DISTINCT FROM OLD.pro_subscription_will_renew   THEN NEW.pro_subscription_will_renew   := OLD.pro_subscription_will_renew;   END IF;
  IF NEW.basic_subscription_will_renew IS DISTINCT FROM OLD.basic_subscription_will_renew THEN NEW.basic_subscription_will_renew := OLD.basic_subscription_will_renew; END IF;
  IF NEW.pro_subscription_period       IS DISTINCT FROM OLD.pro_subscription_period       THEN NEW.pro_subscription_period       := OLD.pro_subscription_period;       END IF;
  IF NEW.basic_subscription_period     IS DISTINCT FROM OLD.basic_subscription_period     THEN NEW.basic_subscription_period     := OLD.basic_subscription_period;     END IF;
  IF NEW.pro_trial_started_at          IS DISTINCT FROM OLD.pro_trial_started_at          THEN NEW.pro_trial_started_at          := OLD.pro_trial_started_at;          END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.freeze_user_columns_on_update IS
  'Reverts client UPDATEs to economic + identity columns on users (is_admin, sparkle_balance, pro/basic subscription flags + expiries + will_renew + period, pro_trial_started_at, id, email, created_at). Bypassed by the service role and by SECURITY DEFINER sparkle RPCs that set app.bypass_user_freeze=true.';

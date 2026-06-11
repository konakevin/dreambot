-- 257_dreambot_basic.sql — DreamBot Basic subscription tier (DB foundation).
--
-- DreamBot Basic ($4.99/mo, $39.99/yr) sits between Free and Pro: it re-enables
-- NIGHTLY DREAMS + a light sparkle top-up (20/mo) + HD downloads (20/mo). It has
-- NO intro trial of its own — the existing 14-day Pro/nightly trial window
-- (users.pro_trial_started_at, surfaced by is_pro_active) already covers every
-- new account, so a 2nd trial would double-dip.
--
-- Mirrors the Pro pattern (migrations 150 / 151 / 176 / 248):
--   1. users.basic_subscription + basic_subscription_expires_at (mirror pro cols).
--   2. Extend freeze_user_columns_on_update() so only the service-role webhook can
--      set them (clients can't self-grant Basic).
--   3. is_basic_active(uid) — paid + unexpired (NO trial component).
--   4. is_dream_eligible(uid) = is_pro_active(uid) OR is_basic_active(uid) — the NEW
--      authoritative "should this user get nightly dreams" gate (pro OR trial OR
--      basic). is_pro_active already folds in the 14-day trial.
--   5. engine_config: basic_monthly_sparkle_bundle (20) + basic_hd_downloads_per_month (20).
--
-- The revenuecat-webhook grants the monthly bundle via
-- grant_sparkles(uid, N, 'basic_bundle:<txid>') — service_role bypasses the
-- welcome-bonus-only client guard in grant_sparkles (migration 151).
--
-- search_path = '' on all functions; run in the dashboard SQL editor (DDL).

-- ── 1. users columns (mirror pro_subscription / 150) ───────────────────

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS basic_subscription boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS basic_subscription_expires_at timestamptz;

COMMENT ON COLUMN public.users.basic_subscription IS
  'DreamBot Basic tier active flag. Written ONLY by the revenuecat-webhook (service role); frozen from client writes by freeze_user_columns_on_update.';
COMMENT ON COLUMN public.users.basic_subscription_expires_at IS
  'When the current DreamBot Basic period ends (set by the webhook). NULL while never-subscribed.';

-- ── 2. Extend the column-freeze trigger (mirror migration 151) ─────────
-- MUST list every currently-frozen column + the two new Basic columns, or a
-- CREATE OR REPLACE would silently drop protection on the omitted ones.

CREATE OR REPLACE FUNCTION public.freeze_user_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- SECURITY DEFINER RPCs that legitimately touch these columns set this
  -- txn-local config var before their UPDATE so the freeze doesn't block them.
  IF current_setting('app.bypass_user_freeze', true) = 'true' THEN
    RETURN NEW;
  END IF;

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
  'Reverts client UPDATEs to economic + identity columns on users (is_admin, sparkle_balance, pro_subscription[_expires_at], basic_subscription[_expires_at], id, email, created_at). Bypassed by service role and by SECURITY DEFINER sparkle RPCs that set app.bypass_user_freeze=true.';

-- (trigger trg_freeze_user_columns from migration 151 already binds this fn;
--  CREATE OR REPLACE keeps the existing binding — no need to re-create it.)

-- ── 3. is_basic_active(uid) — paid + unexpired, NO trial ───────────────

CREATE OR REPLACE FUNCTION public.is_basic_active(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = p_user_id
      AND u.basic_subscription = true
      AND (u.basic_subscription_expires_at IS NULL
           OR u.basic_subscription_expires_at > now())
  );
$$;

COMMENT ON FUNCTION public.is_basic_active(uuid) IS
  'Does this user have an active (paid, unexpired) DreamBot Basic subscription RIGHT NOW? No trial component — the free trial is the Pro-trial window (see is_pro_active).';

GRANT EXECUTE ON FUNCTION public.is_basic_active(uuid) TO authenticated;

-- ── 4. is_dream_eligible(uid) — the nightly gate (pro OR trial OR basic) ─

CREATE OR REPLACE FUNCTION public.is_dream_eligible(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  -- is_pro_active already covers paid-Pro OR the 14-day trial window.
  SELECT public.is_pro_active(p_user_id) OR public.is_basic_active(p_user_id);
$$;

COMMENT ON FUNCTION public.is_dream_eligible(uuid) IS
  'Single source of truth: should this user receive NIGHTLY DREAMS right now? True for Pro (paid OR within trial) OR Basic (paid). Used by nightly-dreams + dream-queue-worker. If both tiers are active, Pro perks still apply via is_pro_active.';

GRANT EXECUTE ON FUNCTION public.is_dream_eligible(uuid) TO authenticated;

-- ── 5. engine_config — Basic perk amounts (admin-tunable, no deploy) ───

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS basic_monthly_sparkle_bundle integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS basic_hd_downloads_per_month integer NOT NULL DEFAULT 20;

COMMENT ON COLUMN public.engine_config.basic_monthly_sparkle_bundle IS
  'Sparkles granted to a DreamBot Basic subscriber on purchase + each monthly renewal (default 20; yearly grants 12×). Read by revenuecat-webhook.';
COMMENT ON COLUMN public.engine_config.basic_hd_downloads_per_month IS
  'Monthly HD-download cap for DreamBot Basic (default 20; Pro = 100). Read by upscale-image + the client save gate.';

-- Backfill the singleton row (id=1) to the defaults if NULL (defensive).
UPDATE public.engine_config
SET basic_monthly_sparkle_bundle = COALESCE(basic_monthly_sparkle_bundle, 20),
    basic_hd_downloads_per_month = COALESCE(basic_hd_downloads_per_month, 20)
WHERE id = 1;

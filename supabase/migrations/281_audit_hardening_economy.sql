-- 281_audit_hardening_economy.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Adversarial-audit follow-up (2026-06-18). Closes the findings the /audit
-- red-team surfaced after the 278/279/280 pass:
--
--   HIGH  users write-lockdown: a client could PATCH its own row to set
--         pro_trial_started_at (NOT in the freeze list) → re-arm a 14-day
--         trial → free perpetual Pro across all three runtimes. Fix is twofold:
--         (1) freeze the column, and (2) convert users to DEFAULT-DENY UPDATE
--         (revoke table UPDATE, grant only the genuinely client-editable
--         columns) — same pattern 278 used for uploads, so a future
--         is_pro_active input column can't be forgotten again.
--   MED   first_dream one-per-account was a check-then-insert with a RANDOM
--         dedup_key → the unique index was inert → parallel requests = N free
--         heavy renders. Add a partial unique index keyed on user_id.
--   MED   comment_likes had no insert rate limit (the one notification-fanout
--         table the 278 H8 sweep missed) → like/unlike loop spams a victim.
--   LOW   push_tokens policy had no WITH CHECK → a client could INSERT a token
--         row with someone else's user_id (push-target hijack).
--   LOW   like_count decrement had no floor → clamp at 0.
-- ─────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════
-- HIGH — users UPDATE lockdown (freeze + default-deny column grant)
-- ═══════════════════════════════════════════════════════════════════════════
-- (1) Defense-in-depth: freeze the two trial/renewal columns the previous list
--     forgot. Legitimate writes are service-role (webhook) or the signup
--     INSERT trigger — never a client UPDATE — so freezing breaks nothing.
CREATE OR REPLACE FUNCTION public.freeze_user_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF current_setting('app.bypass_user_freeze', true) = 'true' THEN
    RETURN NEW;
  END IF;

  IF NEW.is_admin                      IS DISTINCT FROM OLD.is_admin                      THEN NEW.is_admin                      := OLD.is_admin;                      END IF;
  IF NEW.sparkle_balance               IS DISTINCT FROM OLD.sparkle_balance               THEN NEW.sparkle_balance               := OLD.sparkle_balance;               END IF;
  IF NEW.pro_subscription              IS DISTINCT FROM OLD.pro_subscription              THEN NEW.pro_subscription              := OLD.pro_subscription;              END IF;
  IF NEW.pro_subscription_expires_at   IS DISTINCT FROM OLD.pro_subscription_expires_at   THEN NEW.pro_subscription_expires_at   := OLD.pro_subscription_expires_at;   END IF;
  IF NEW.pro_subscription_will_renew   IS DISTINCT FROM OLD.pro_subscription_will_renew   THEN NEW.pro_subscription_will_renew   := OLD.pro_subscription_will_renew;   END IF;
  IF NEW.pro_trial_started_at          IS DISTINCT FROM OLD.pro_trial_started_at          THEN NEW.pro_trial_started_at          := OLD.pro_trial_started_at;          END IF;
  IF NEW.basic_subscription            IS DISTINCT FROM OLD.basic_subscription            THEN NEW.basic_subscription            := OLD.basic_subscription;            END IF;
  IF NEW.basic_subscription_expires_at IS DISTINCT FROM OLD.basic_subscription_expires_at THEN NEW.basic_subscription_expires_at := OLD.basic_subscription_expires_at; END IF;
  IF NEW.id                            IS DISTINCT FROM OLD.id                            THEN NEW.id                            := OLD.id;                            END IF;
  IF NEW.email                         IS DISTINCT FROM OLD.email                         THEN NEW.email                         := OLD.email;                         END IF;
  IF NEW.created_at                    IS DISTINCT FROM OLD.created_at                    THEN NEW.created_at                    := OLD.created_at;                    END IF;

  RETURN NEW;
END;
$$;

-- (2) Default-deny: revoke the Supabase-default table-wide UPDATE and grant only
--     the columns the client legitimately edits via direct PostgREST. Everything
--     else (sparkle_balance, is_admin, pro_*/basic_*, email, id, created_at,
--     last_active_at/last_inbox_view_at — those last two are written by the
--     SECURITY DEFINER touch RPCs, which bypass the grant) is now hard-blocked,
--     not just trigger-reverted. NOTE: a NEW client-editable user column needs an
--     explicit GRANT UPDATE here (same footgun as the 278 uploads grant).
REVOKE UPDATE ON public.users FROM anon, authenticated;
GRANT UPDATE (
  display_name, bio, avatar_url, username, username_confirmed,
  is_public, allow_reposts, dreams_private_only, has_ai_recipe, pro_mode_flux_model
) ON public.users TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- MED — first_dream: make one-per-account ATOMIC
-- ═══════════════════════════════════════════════════════════════════════════
-- The enqueue guard was a SELECT count() then INSERT with a random dedup_key, so
-- two parallel requests both passed. The actual exploit is parallel requests
-- each creating an ACTIVE (queued/in_progress) first_dream → so a partial unique
-- index scoped to the ACTIVE states is the race backstop: the 2nd concurrent
-- insert raises 23505, which enqueue-dream now treats as "already claimed". We
-- DON'T include 'completed' here — a dev/account can legitimately have several
-- historical completed first_dreams from re-onboarding, and the enqueue count
-- guard (which counts completed too) already blocks re-claiming after success;
-- the index only needs to stop the parallel-active race.
-- First collapse any pre-existing duplicate ACTIVE rows (keep newest) so the
-- index can build — those duplicates are exactly the race this closes.
UPDATE public.dream_queue d
  SET status = 'failed'
WHERE d.source = 'first_dream'
  AND d.status IN ('queued', 'in_progress')
  AND d.id NOT IN (
    SELECT DISTINCT ON (user_id) id
    FROM public.dream_queue
    WHERE source = 'first_dream' AND status IN ('queued', 'in_progress')
    ORDER BY user_id, created_at DESC
  );

CREATE UNIQUE INDEX IF NOT EXISTS ux_dream_queue_active_first_dream
  ON public.dream_queue (user_id)
  WHERE source = 'first_dream' AND status IN ('queued', 'in_progress');


-- ═══════════════════════════════════════════════════════════════════════════
-- MED — rate-limit comment_likes inserts (parity with likes/post_reposts)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_created
  ON public.comment_likes (user_id, created_at);

DROP TRIGGER IF EXISTS trg_rate_limit_comment_likes ON public.comment_likes;
CREATE TRIGGER trg_rate_limit_comment_likes
  BEFORE INSERT ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_insert_rate_limit('60', '1 minute', 'user_id');


-- ═══════════════════════════════════════════════════════════════════════════
-- LOW — push_tokens: add WITH CHECK so a client can't register a token under
--       another user's id (push-target hijack)
-- ═══════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can manage own tokens" ON public.push_tokens;
CREATE POLICY "Users can manage own tokens" ON public.push_tokens
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ═══════════════════════════════════════════════════════════════════════════
-- LOW — clamp like_count so a decrement can't go negative
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.update_like_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.uploads SET like_count = like_count + 1 WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.uploads SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Migration 109: RLS WITH CHECK hardening + record_impression auth validation
--
-- Fixes from the April 2026 re-audit:
--  1. Five tables had UPDATE policies with USING but no WITH CHECK clause,
--     allowing users to SELECT a row they own and then mutate foreign keys
--     (e.g. change user_id on their own comment, accept their own friend
--     request by flipping status).
--  2. record_impression is SECURITY DEFINER and did not validate that
--     p_user_id == auth.uid(), so a malicious client could pollute another
--     user's seen-post penalties by flooding impressions for their user_id.
--  3. friendships and notifications need freeze triggers so direct client
--     UPDATEs can only touch safe columns (for friendships: nothing;
--     for notifications: only seen_at).

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- 1. comments — add WITH CHECK to existing UPDATE policy
-- ───────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Freeze identity/parent columns so clients can only edit body
CREATE OR REPLACE FUNCTION public.freeze_comment_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF NEW.user_id     IS DISTINCT FROM OLD.user_id     THEN NEW.user_id     := OLD.user_id;     END IF;
  IF NEW.upload_id   IS DISTINCT FROM OLD.upload_id   THEN NEW.upload_id   := OLD.upload_id;   END IF;
  IF NEW.parent_id   IS DISTINCT FROM OLD.parent_id   THEN NEW.parent_id   := OLD.parent_id;   END IF;
  IF NEW.created_at  IS DISTINCT FROM OLD.created_at  THEN NEW.created_at  := OLD.created_at;  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_freeze_comment_columns ON public.comments;
CREATE TRIGGER trg_freeze_comment_columns
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.freeze_comment_columns_on_update();

-- ───────────────────────────────────────────────────────────────────────
-- 2. friendships — lock down direct UPDATE entirely
-- Clients must use send_friend_request / respond_friend_request / remove_friend
-- RPCs (all SECURITY DEFINER). Direct UPDATE from a client is pointless and
-- historically let users bypass the rate limit by flipping status themselves.
-- ───────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can update friendships they're part of" ON public.friendships;
CREATE POLICY "Users can update friendships they're part of"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_a OR auth.uid() = user_b)
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- Freeze every column — clients cannot change anything via direct UPDATE.
-- Service role (RPCs) bypasses this.
CREATE OR REPLACE FUNCTION public.freeze_friendship_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF NEW.user_a     IS DISTINCT FROM OLD.user_a     THEN NEW.user_a     := OLD.user_a;     END IF;
  IF NEW.user_b     IS DISTINCT FROM OLD.user_b     THEN NEW.user_b     := OLD.user_b;     END IF;
  IF NEW.status     IS DISTINCT FROM OLD.status     THEN NEW.status     := OLD.status;     END IF;
  IF NEW.requester  IS DISTINCT FROM OLD.requester  THEN NEW.requester  := OLD.requester;  END IF;
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN NEW.created_at := OLD.created_at; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_freeze_friendship_columns ON public.friendships;
CREATE TRIGGER trg_freeze_friendship_columns
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION public.freeze_friendship_columns_on_update();

-- ───────────────────────────────────────────────────────────────────────
-- 3. notifications — allow only seen_at to be changed (mark as read)
-- ───────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE OR REPLACE FUNCTION public.freeze_notification_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;
  -- Clients can only update seen_at. Everything else is frozen.
  IF NEW.recipient_id IS DISTINCT FROM OLD.recipient_id THEN NEW.recipient_id := OLD.recipient_id; END IF;
  IF NEW.actor_id     IS DISTINCT FROM OLD.actor_id     THEN NEW.actor_id     := OLD.actor_id;     END IF;
  IF NEW.type         IS DISTINCT FROM OLD.type         THEN NEW.type         := OLD.type;         END IF;
  IF NEW.upload_id    IS DISTINCT FROM OLD.upload_id    THEN NEW.upload_id    := OLD.upload_id;    END IF;
  IF NEW.comment_id   IS DISTINCT FROM OLD.comment_id   THEN NEW.comment_id   := OLD.comment_id;   END IF;
  IF NEW.body         IS DISTINCT FROM OLD.body         THEN NEW.body         := OLD.body;         END IF;
  IF NEW.created_at   IS DISTINCT FROM OLD.created_at   THEN NEW.created_at   := OLD.created_at;   END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_freeze_notification_columns ON public.notifications;
CREATE TRIGGER trg_freeze_notification_columns
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.freeze_notification_columns_on_update();

-- ───────────────────────────────────────────────────────────────────────
-- 4. user_recipes — add WITH CHECK
-- ───────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can update own recipe" ON public.user_recipes;
CREATE POLICY "Users can update own recipe"
  ON public.user_recipes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Freeze user_id (all other columns are user-editable onboarding data)
CREATE OR REPLACE FUNCTION public.freeze_user_recipe_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN NEW.user_id := OLD.user_id; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_freeze_user_recipe_columns ON public.user_recipes;
CREATE TRIGGER trg_freeze_user_recipe_columns
  BEFORE UPDATE ON public.user_recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.freeze_user_recipe_columns_on_update();

-- ───────────────────────────────────────────────────────────────────────
-- 5. uploads — add WITH CHECK for defense-in-depth alongside existing
-- freeze trigger from migration 108
-- ───────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can update their own uploads" ON public.uploads;
CREATE POLICY "Users can update their own uploads"
  ON public.uploads FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────
-- 6. record_impression — validate p_user_id against auth.uid()
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.record_impression(p_user_id uuid, p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_was_insert boolean;
BEGIN
  -- Reject cross-user impression abuse. Allow service_role (nightly crons) to bypass.
  IF current_setting('role', true) != 'service_role'
     AND (auth.uid() IS NULL OR p_user_id IS DISTINCT FROM auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: p_user_id must match auth.uid()';
  END IF;

  INSERT INTO public.post_impressions (user_id, upload_id)
  VALUES (p_user_id, p_upload_id)
  ON CONFLICT (user_id, upload_id)
  DO UPDATE SET
    view_count = public.post_impressions.view_count + 1,
    last_seen = now()
  RETURNING (xmax = 0) INTO v_was_insert;

  IF v_was_insert THEN
    UPDATE public.uploads SET view_count = view_count + 1 WHERE id = p_upload_id;
  END IF;
END;
$$;

COMMIT;

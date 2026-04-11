-- Migration 108: Lock down uploads RLS and clean up vestigial moderation columns
--
-- Background:
--  - SightEngine image moderation was removed in April 2026.
--  - is_moderated/is_approved columns are now vestigial — never written for user uploads.
--  - The feed filter (is_moderated = false OR is_approved = true) currently lets
--    unmoderated client uploads through, which is fine, but the columns are confusing.
--  - The existing UPDATE policy from migration 079 has no WITH CHECK clause, so
--    a malicious client can flip is_approved / is_moderated / user_id / image_url
--    on their own uploads via direct PostgREST PATCH.
--
-- Fixes:
--  1. Auto-approve client uploads on insert (Flux's built-in NSFW filter is the gate;
--     there is no separate image moderation pipeline anymore).
--  2. Add an UPDATE trigger that freezes is_approved, is_moderated, user_id, image_url,
--     is_ai_generated, ai_prompt, dream_medium, dream_vibe, fuse_of from client edits.
--     Service-role callers (Edge Functions) bypass the freeze.
--  3. Backfill any historical client uploads that are still is_approved = false.

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- 1. Auto-approve client uploads on insert
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.enforce_moderation_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Service role callers (Edge Functions, nightly-dreams) keep whatever they set.
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;
  -- Client uploads are auto-approved (no separate image moderation pipeline;
  -- Flux's built-in NSFW filter handles generation safety).
  NEW.is_approved := true;
  NEW.is_moderated := true;
  RETURN NEW;
END;
$$;

-- ───────────────────────────────────────────────────────────────────────
-- 2. Freeze sensitive columns from client UPDATEs
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.freeze_upload_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Service role bypass
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Frozen columns: client cannot change these
  IF NEW.is_approved      IS DISTINCT FROM OLD.is_approved     THEN NEW.is_approved      := OLD.is_approved;     END IF;
  IF NEW.is_moderated     IS DISTINCT FROM OLD.is_moderated    THEN NEW.is_moderated     := OLD.is_moderated;    END IF;
  IF NEW.user_id          IS DISTINCT FROM OLD.user_id         THEN NEW.user_id          := OLD.user_id;         END IF;
  IF NEW.image_url        IS DISTINCT FROM OLD.image_url       THEN NEW.image_url        := OLD.image_url;       END IF;
  IF NEW.is_ai_generated  IS DISTINCT FROM OLD.is_ai_generated THEN NEW.is_ai_generated  := OLD.is_ai_generated; END IF;
  IF NEW.ai_prompt        IS DISTINCT FROM OLD.ai_prompt       THEN NEW.ai_prompt        := OLD.ai_prompt;       END IF;
  IF NEW.dream_medium     IS DISTINCT FROM OLD.dream_medium    THEN NEW.dream_medium     := OLD.dream_medium;    END IF;
  IF NEW.dream_vibe       IS DISTINCT FROM OLD.dream_vibe      THEN NEW.dream_vibe       := OLD.dream_vibe;      END IF;
  IF NEW.fuse_of          IS DISTINCT FROM OLD.fuse_of         THEN NEW.fuse_of          := OLD.fuse_of;         END IF;
  IF NEW.bot_message      IS DISTINCT FROM OLD.bot_message     THEN NEW.bot_message      := OLD.bot_message;     END IF;
  IF NEW.from_wish        IS DISTINCT FROM OLD.from_wish       THEN NEW.from_wish        := OLD.from_wish;       END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_freeze_upload_columns ON public.uploads;
CREATE TRIGGER trg_freeze_upload_columns
  BEFORE UPDATE ON public.uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.freeze_upload_columns_on_update();

-- ───────────────────────────────────────────────────────────────────────
-- 3. Backfill historical client uploads
-- ───────────────────────────────────────────────────────────────────────
UPDATE public.uploads
SET is_approved = true, is_moderated = true
WHERE is_approved = false OR is_moderated = false;

COMMIT;

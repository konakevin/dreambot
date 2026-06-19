-- 291_drop_wish_feature.sql — rip out the dead Dream Wish feature (schema side).
--
-- Dream Wish was removed in code on 2026-06-07 (DreamWishSheet/WishSparkle + the
-- nightly wish path), but its columns were left vestigial: nothing writes them and
-- no active code reads them. Drop them. Two columns have live dependencies that must
-- be rebuilt FIRST (a function body referencing a dropped column is fine until it
-- runs, but we rebuild before dropping to keep the schema self-consistent — same
-- ordering as migration 253's twin/fuse rip-out):
--
--   • uploads.from_wish — written by finalize_nightly_upload() and frozen by
--     freeze_upload_columns_on_update(). The nightly dispatcher already calls
--     finalize_nightly_upload with only p_upload_id + p_bot_message (it stopped
--     passing a wish on 2026-06-07), so dropping the 3rd param is caller-safe.
--   • user_recipes.dream_wish / wish_modifiers / wish_recipient_ids — no function
--     or trigger references them; pure drop.
--
-- NOT touched (deliberately): the 'dream_wish' NOTIFICATION CATEGORY string in the
-- notification-routing functions (mig 254 et al.) — that's vocabulary that routes
-- any historical notification rows, not wish schema. Leaving it costs nothing and
-- removing it would re-route old rows through the ELSE branch.
--
-- Run in the dashboard SQL editor.

-- ── 1. Rebuild finalize_nightly_upload WITHOUT p_from_wish (signature change → DROP first) ──
DROP FUNCTION IF EXISTS public.finalize_nightly_upload(uuid, text, text);

CREATE OR REPLACE FUNCTION public.finalize_nightly_upload(
  p_upload_id uuid,
  p_bot_message text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  ALTER TABLE public.uploads DISABLE TRIGGER trg_freeze_upload_columns;

  UPDATE public.uploads
  SET bot_message = p_bot_message
  WHERE id = p_upload_id;

  ALTER TABLE public.uploads ENABLE TRIGGER trg_freeze_upload_columns;
END;
$$;

-- ── 2. Rebuild freeze_upload_columns_on_update WITHOUT the from_wish freeze line ──
CREATE OR REPLACE FUNCTION public.freeze_upload_columns_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.is_approved      IS DISTINCT FROM OLD.is_approved     THEN NEW.is_approved      := OLD.is_approved;     END IF;
  IF NEW.is_moderated     IS DISTINCT FROM OLD.is_moderated    THEN NEW.is_moderated     := OLD.is_moderated;    END IF;
  IF NEW.user_id          IS DISTINCT FROM OLD.user_id         THEN NEW.user_id          := OLD.user_id;         END IF;
  IF NEW.image_url        IS DISTINCT FROM OLD.image_url       THEN NEW.image_url        := OLD.image_url;       END IF;
  IF NEW.is_ai_generated  IS DISTINCT FROM OLD.is_ai_generated THEN NEW.is_ai_generated  := OLD.is_ai_generated; END IF;
  IF NEW.ai_prompt        IS DISTINCT FROM OLD.ai_prompt       THEN NEW.ai_prompt        := OLD.ai_prompt;       END IF;
  IF NEW.dream_medium     IS DISTINCT FROM OLD.dream_medium    THEN NEW.dream_medium     := OLD.dream_medium;    END IF;
  IF NEW.dream_vibe       IS DISTINCT FROM OLD.dream_vibe      THEN NEW.dream_vibe       := OLD.dream_vibe;      END IF;
  IF NEW.bot_message      IS DISTINCT FROM OLD.bot_message     THEN NEW.bot_message      := OLD.bot_message;     END IF;

  IF OLD.posted_at IS NOT NULL AND NEW.posted_at IS DISTINCT FROM OLD.posted_at THEN
    NEW.posted_at := OLD.posted_at;
  END IF;

  RETURN NEW;
END;
$$;

-- ── 3. Drop the dead wish columns ──────────────────────────────────────────────
ALTER TABLE public.uploads       DROP COLUMN IF EXISTS from_wish;
ALTER TABLE public.user_recipes  DROP COLUMN IF EXISTS dream_wish;
ALTER TABLE public.user_recipes  DROP COLUMN IF EXISTS wish_modifiers;
ALTER TABLE public.user_recipes  DROP COLUMN IF EXISTS wish_recipient_ids;

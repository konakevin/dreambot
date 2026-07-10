-- 357_fix_comment_counts_search_path.sql
--
-- Restore the search_path pin on the update_comment_counts() trigger (Architect
-- audit A3, 2026-07-10). Migration 087 pinned `SET search_path = ''` on this
-- SECURITY DEFINER function; migration 286 then redefined it via CREATE OR
-- REPLACE (to add the GREATEST()-floor on decrements) WITHOUT re-declaring the
-- SET clause — and CREATE OR REPLACE replaces the whole definition, config
-- params included, so the pin was silently dropped. This left the sole
-- SECURITY DEFINER trigger in the schema without a pinned path (every other one
-- pins it; see 356's sync_upload_media_count as the template).
--
-- Low real-world risk (Supabase anon/authenticated hold no CREATE on `public`,
-- so no attacker can plant a shadowing object), but it's a defense-in-depth
-- invariant worth restoring codebase-wide.
--
-- The BODY is copied VERBATIM from migration 286 — same INSERT/DELETE branches,
-- same GREATEST(count-1, 0) floors, same reply_count handling, same
-- RETURN COALESCE(NEW, OLD). The ONLY changes vs 286 are: (1) `SET search_path
-- = ''` on the function, and (2) tables schema-qualified to public.* (required
-- once the path is empty). Counting behavior is UNCHANGED — comment_count had
-- ZERO drift in the 2026-07-08 live audit and must keep counting identically.
CREATE OR REPLACE FUNCTION public.update_comment_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.uploads SET comment_count = comment_count + 1 WHERE id = NEW.upload_id;
    IF NEW.parent_id IS NOT NULL THEN
      UPDATE public.comments SET reply_count = reply_count + 1 WHERE id = NEW.parent_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.uploads SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.upload_id;
    IF OLD.parent_id IS NOT NULL THEN
      UPDATE public.comments SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.parent_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 288_reports_sanitize_reason_only.sql
--
-- HOTFIX for migration 285. 285's reports branch in clean_user_text_columns()
-- referenced NEW.details, but the LIVE public.reports table has NO `details`
-- column (the repo's 047 file declares reporter_user_id/comment_id/details, but
-- those were never applied to the live DB — migration drift). A BEFORE INSERT
-- trigger that references a non-existent field raises "record \"new\" has no
-- field \"details\"" on EVERY report insert, which broke content reporting in
-- production the moment 285 was applied.
--
-- Fix: sanitize only `reason` (the one user-text column the app actually writes,
-- per hooks/useReport.ts — reporter_id + reason + upload_id). Redefines the
-- shared cleaner preserving every other branch verbatim.
CREATE OR REPLACE FUNCTION public.clean_user_text_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'users' THEN
    NEW.display_name := public.sanitize_user_text(NEW.display_name);
    NEW.bio := public.sanitize_user_text(NEW.bio);
    NEW.username := public.sanitize_user_text(NEW.username);
  ELSIF TG_TABLE_NAME = 'comments' THEN
    NEW.body := public.sanitize_user_text(NEW.body);
  ELSIF TG_TABLE_NAME = 'uploads' THEN
    NEW.description := public.sanitize_user_text(NEW.description);
    IF NEW.description IS NOT NULL AND public.text_is_blocked(NEW.description) THEN
      NEW.description := NULL;
    END IF;
  ELSIF TG_TABLE_NAME = 'reports' THEN
    NEW.reason := public.sanitize_user_text(NEW.reason);
  END IF;
  RETURN NEW;
END;
$$;

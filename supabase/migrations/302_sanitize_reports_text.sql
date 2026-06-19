-- 302_sanitize_reports_text.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Extend the migration-279 stored-text sanitizer to the `reports` table.
--
-- `reports.reason` + `reports.details` are free-text, user-supplied, written via
-- direct PostgREST (the in-app report sheet INSERTs the row). Migration 279
-- cleaned users/comments/uploads but NOT reports, so a reporter could embed
-- control/zero-width/bidi payloads or prompt-injection-shaped text that an admin
-- review surface (or any LLM-assisted triage) would render/read raw. Low blast
-- radius (RLS: a reporter only sees their own reports; the website never reads
-- this table) — but it's the last free-text PostgREST sink left unsanitized, so
-- close it for parity with every other stored user-text column.
--
-- Same NFKC + control/zero-width/bidi-strip + whitespace-collapse cleaner; just
-- adds a `reports` branch to clean_user_text_columns() and the BEFORE trigger.
-- `reason` is NOT NULL — sanitize_user_text() returns a cleaned (never null)
-- string for non-null input, so the constraint still holds.
-- ─────────────────────────────────────────────────────────────────────────

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
    NEW.details := public.sanitize_user_text(NEW.details);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_clean_user_text ON public.reports;
CREATE TRIGGER trg_clean_user_text
  BEFORE INSERT OR UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.clean_user_text_columns();

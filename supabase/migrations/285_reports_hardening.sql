-- 285_reports_hardening.sql
--
-- Hardens public.reports (flagged by the Architect audit, 2026-06-18). Three gaps:
--   1. No insert rate limit → a script could flood reports (admin-queue spam).
--   2. reason/details were NOT covered by the migration-279 sanitize trigger, so
--      stored control / zero-width / bidi / injection-shaped text landed raw (an
--      admin-view spoofing + stored-XSS surface; reports aren't shown to other
--      users, so this is admin-facing, but still untrusted text stored unclean).
--   3. No index on reporter_id (the feed NOT-IN filter + the new rate-limit
--      count() both scan by reporter_id).

-- ── 1. Rate limit: 20 reports / minute / reporter ──────────────────────────
-- A human reports a handful per session; this only stops scripted floods.
-- Reuses the generic enforce_insert_rate_limit() limiter from migration 194.
CREATE INDEX IF NOT EXISTS idx_reports_reporter_created
  ON public.reports (reporter_id, created_at);

DROP TRIGGER IF EXISTS trg_rate_limit_reports ON public.reports;
CREATE TRIGGER trg_rate_limit_reports
  BEFORE INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_insert_rate_limit('20', '1 minute', 'reporter_id');

-- ── 2. Sanitize reason + details on write ──────────────────────────────────
-- Extend the shared cleaner (migration 279) with a reports branch, then attach
-- the trigger. Redefines the whole function (CREATE OR REPLACE) preserving every
-- existing branch verbatim + adding 'reports'.
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

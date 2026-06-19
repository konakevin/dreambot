-- 289_reports_schema_reconcile.sql
--
-- Reconcile the reports table drift + fix report-a-user/comment (broken in prod).
--
-- Migration 047 was only PARTIALLY applied by hand: its blocked_users CREATE ran,
-- but its reports upgrade got skipped. So the LIVE reports table is the original
-- 6-column version {id, reporter_id, upload_id(NOT NULL), reason, created_at,
-- resolved} and LACKS reported_user_id / comment_id / details. That broke the
-- "Report a user/comment" flow: the client (app/user/[userId].tsx) calls
-- report({ reason, reportedUserId }), but the live table can't store the target
-- AND upload_id is NOT NULL, so a post-less report is rejected. Reporting a POST
-- worked; reporting a USER or COMMENT silently failed — a UGC-safety gap.
--
-- Bring live in line with the intended schema. All additive + idempotent (safe on
-- live, a no-op on a fresh-from-repo DB where 047 already created these).

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS reported_user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS details text;

-- A user/comment report has no upload — upload_id must be nullable.
ALTER TABLE public.reports ALTER COLUMN upload_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reports_reported_user
  ON public.reports(reported_user_id) WHERE reported_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reports_comment
  ON public.reports(comment_id) WHERE comment_id IS NOT NULL;

-- Now that `details` exists, restore its sanitization (migration 288 dropped it
-- because the column was missing on live). Redefine the shared cleaner with
-- reason + details, preserving every other branch verbatim.
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

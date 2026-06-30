-- 315_report_notifications.sql
-- Notify admins in real time when a content report is filed (App Store 1.2 — so
-- the developer can act within 24h). Reuses the notifications -> send-push
-- pipeline (migrations 196/204): inserting a notifications row pushes it to the
-- recipient's device. Each admin (except the reporter, so an admin reporting
-- doesn't ping themselves) gets a 'report' notification that the client routes
-- to the admin Reports screen.

-- ── 1. Allow the new 'report' notification type ─────────────────────────────
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'follow_request', 'follow_accepted',
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'dream_failed',
    'post_like', 'post_repost',
    'post_milestone', 'comment_like',
    'comment',
    'download_ready',
    'report'
  ));

-- ── 2. Fan a new report out to every admin (except the reporter) ────────────
CREATE OR REPLACE FUNCTION public.notify_admins_on_report()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, group_key, body)
  SELECT a.id, NEW.reporter_id, 'report', NEW.upload_id, NEW.comment_id,
         'report:' || NEW.id::text, NEW.reason
  FROM public.users a
  WHERE a.is_admin = true
    AND a.id <> NEW.reporter_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_on_report ON public.reports;
CREATE TRIGGER trg_notify_admins_on_report
  AFTER INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_on_report();

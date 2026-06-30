-- 314_reports_admin_review.sql
-- Admin moderation tooling (App Store Guideline 1.2 — the developer must act on
-- objectionable-content reports within 24h: remove the content + eject the user).
-- Adds report status tracking + admin-only SECURITY DEFINER RPCs to list reports
-- (enriched with their target) and act on them. The reports RLS stays
-- reporter-only (migration 047); admins read/write exclusively via these RPCs.
-- Depends on migration 313 (users.is_banned).

-- ── 1. Report status state machine ──────────────────────────────────────────
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'actioned', 'dismissed')),
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by uuid REFERENCES public.users(id) ON DELETE SET NULL;

-- The admin queue + the report-monitor cron both scan open reports by age.
CREATE INDEX IF NOT EXISTS idx_reports_status_created
  ON public.reports(status, created_at DESC);

-- ── 2. admin_list_reports — enriched queue for the admin Reports screen ──────
-- One row per report with a preview of its target (post thumbnail + owner /
-- comment text + author / reported user). SECURITY DEFINER bypasses the
-- reporter-only RLS; admin-guarded. p_status: 'open' | 'actioned' | 'dismissed'
-- | 'all'.
CREATE OR REPLACE FUNCTION public.admin_list_reports(
  p_status text DEFAULT 'open',
  p_limit  integer DEFAULT 100
)
RETURNS TABLE (
  id                 uuid,
  reason             text,
  details            text,
  status             text,
  created_at         timestamptz,
  reporter_id        uuid,
  reporter_username  text,
  target_kind        text,    -- 'post' | 'comment' | 'user'
  upload_id          uuid,
  upload_image_url   text,
  comment_id         uuid,
  comment_body       text,
  target_user_id     uuid,
  target_username    text,
  target_user_banned boolean
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    r.id,
    r.reason,
    r.details,
    r.status,
    r.created_at,
    r.reporter_id,
    rep.username,
    CASE
      WHEN r.comment_id IS NOT NULL THEN 'comment'
      WHEN r.upload_id  IS NOT NULL THEN 'post'
      ELSE 'user'
    END,
    r.upload_id,
    COALESCE(up.image_url_display, up.image_url),
    r.comment_id,
    cm.body,
    COALESCE(r.reported_user_id, up.user_id, cm.user_id),
    tu.username,
    tu.is_banned
  FROM public.reports r
  LEFT JOIN public.users    rep ON rep.id = r.reporter_id
  LEFT JOIN public.uploads  up  ON up.id  = r.upload_id
  LEFT JOIN public.comments cm  ON cm.id  = r.comment_id
  LEFT JOIN public.users    tu  ON tu.id  = COALESCE(r.reported_user_id, up.user_id, cm.user_id)
  WHERE (p_status = 'all' OR r.status = p_status)
  ORDER BY r.created_at DESC
  LIMIT GREATEST(p_limit, 1);
END;
$$;

-- ── 3. admin_resolve_report — mark a report actioned / dismissed ─────────────
CREATE OR REPLACE FUNCTION public.admin_resolve_report(
  p_report_id uuid,
  p_status    text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF p_status NOT IN ('open', 'actioned', 'dismissed') THEN
    RAISE EXCEPTION 'Invalid status: %', p_status;
  END IF;

  UPDATE public.reports
     SET status = p_status,
         resolved_at = CASE WHEN p_status = 'open' THEN NULL ELSE now() END,
         resolved_by = CASE WHEN p_status = 'open' THEN NULL ELSE auth.uid() END
   WHERE id = p_report_id;
END;
$$;

-- ── 4. admin_hide_upload — hide a post from public feeds (keeps it on owner's
-- profile via the migration-126 gate). Lighter than admin_delete_upload (099). ─
CREATE OR REPLACE FUNCTION public.admin_hide_upload(p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.uploads SET is_moderated = true WHERE id = p_upload_id;
END;
$$;

-- ── 5. admin_delete_comment — parallel to admin_delete_upload (099) ──────────
CREATE OR REPLACE FUNCTION public.admin_delete_comment(p_comment_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  DELETE FROM public.comments WHERE id = p_comment_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_reports(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_resolve_report(uuid, text)  TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_hide_upload(uuid)           TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_comment(uuid)        TO authenticated;

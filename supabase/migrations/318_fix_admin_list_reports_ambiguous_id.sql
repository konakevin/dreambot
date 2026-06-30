-- 318_fix_admin_list_reports_ambiguous_id.sql
-- Fix: the admin Reports screen always errored with "Couldn't load reports".
--
-- admin_list_reports (migration 314) is RETURNS TABLE(id uuid, ...). Inside a
-- plpgsql RETURNS TABLE function those output columns are in scope as variables,
-- so the admin guard `WHERE id = auth.uid()` was AMBIGUOUS between the `id`
-- output variable and public.users.id — Postgres 42702 ("column reference \"id\"
-- is ambiguous"). It threw before returning any rows, so the screen showed the
-- error state even with reports present. The sibling admin_* functions have the
-- same guard but no `id` output column, so only this one broke.
--
-- Fix: qualify the guard (u.id / u.is_admin). Body otherwise identical to 314.

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
  target_kind        text,
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
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = true) THEN
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

GRANT EXECUTE ON FUNCTION public.admin_list_reports(text, integer) TO authenticated;

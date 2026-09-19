-- 534_quarantine_removes_membership_and_inbox_rows.sql — 2026-09-19. Kevin: "tapping the purple x button should
-- effectively delete a post from the site, but not from the backend/db so we can use it later for information."
--
-- admin_quarantine_upload() kept the row (quarantined_at + is_public=false) but left two things pointing at it:
--   • its album memberships (upload_media rows where it is the SOURCE) — the slide stayed in every album;
--   • its inbox rows (notifications.upload_id) — dead rows that opened on "That post is gone".
-- A hard delete removes both via FK cascade; quarantine now mirrors that while keeping uploads + ai_generation_log
-- intact for pool analysis. Deleting a member row fires the existing heal trigger (mig 367): the album re-fronts its
-- cover, and an emptied album host is deleted (empty albums cannot exist). Signature unchanged.
CREATE OR REPLACE FUNCTION public.admin_quarantine_upload(
  p_upload_id uuid,
  p_reason    text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.uploads
     SET quarantined_at    = now(),
         quarantine_reason = COALESCE(p_reason, 'bad_render'),
         is_public         = false
   WHERE id = p_upload_id;
  -- Off the site: out of every album it was composed into (heal trigger re-fronts / dissolves) …
  DELETE FROM public.upload_media WHERE source_upload_id = p_upload_id;
  -- … and out of every inbox (likes / comments / "your dream is ready" rows about it).
  DELETE FROM public.notifications WHERE upload_id = p_upload_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_quarantine_upload(uuid, text) TO authenticated;

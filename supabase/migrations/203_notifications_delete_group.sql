-- 203_notifications_delete_group.sql
--
-- Notifications Phase 1.5 — completes the per-group write path.
--
-- mark_group_seen (202) handles read; this adds the delete counterpart so the
-- rewritten inbox UI can support per-group delete + bulk-select-and-delete on
-- the grouped cards. Scoped to the recipient — users can only delete their
-- own notifications.

CREATE OR REPLACE FUNCTION public.delete_group(
  p_user_id   uuid,
  p_group_key text
) RETURNS void
LANGUAGE sql SECURITY DEFINER
SET search_path = ''
AS $$
  DELETE FROM public.notifications
   WHERE recipient_id = p_user_id
     AND group_key    = p_group_key;
$$;

GRANT EXECUTE ON FUNCTION public.delete_group(uuid, text) TO authenticated;

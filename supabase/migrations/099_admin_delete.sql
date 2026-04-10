-- Admin delete RPC — allows admins to delete any post (bypasses RLS)

CREATE OR REPLACE FUNCTION public.admin_delete_upload(p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  DELETE FROM public.uploads WHERE id = p_upload_id;
END;
$$;

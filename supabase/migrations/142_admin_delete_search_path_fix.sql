-- 142 — Fix admin_delete_upload search_path so DELETE triggers resolve.
--
-- Bug (2026-05-01): admin tried to delete a bot's post via the profile UI;
-- got `42P01 relation "uploads" does not exist`. PostgreSQL error code
-- 42P01 = undefined_table.
--
-- Root cause: migration 099 set `SET search_path = ''` on the SECURITY
-- DEFINER function. The function body itself fully qualifies every name
-- (`public.users`, `public.uploads`), so the DELETE statement runs fine.
-- BUT any AFTER-DELETE triggers fired by the cascade / FK / audit
-- machinery inherit the empty search_path. If ANY of those trigger
-- functions reference unqualified `uploads` (or any other public schema
-- object), they fail to resolve it under empty search_path.
--
-- Fix: change to `SET search_path = public, pg_temp`. This is still the
-- recommended secure setting for SECURITY DEFINER (prevents schema-
-- spoofing attacks via custom user schemas) while letting trigger chains
-- resolve unqualified references correctly.
--
-- See: https://www.postgresql.org/docs/current/sql-createfunction.html
--      "Writing SECURITY DEFINER functions safely"

CREATE OR REPLACE FUNCTION public.admin_delete_upload(p_upload_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
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

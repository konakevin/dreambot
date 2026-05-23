-- 179_list_my_upload_paths.sql
-- Helper RPC for storage cleanup before account deletion.
--
-- Problem: delete_own_account() (migration 023) cascades DB deletes via FK,
-- which removes the uploads ROW but leaves the actual JPEG/PNG in storage
-- orphaned forever. Same for the HQ Pro variant. Multiplied across every
-- account deletion since launch, this is a meaningful storage leak.
--
-- Fix: this RPC returns every storage path (both base + HQ) owned by the
-- caller. The client calls it BEFORE delete_own_account(), removes all
-- those storage files, then runs the account delete. If the client crashes
-- mid-cleanup, the next account that gets deleted is unaffected — this
-- helper is idempotent and side-effect-free.
--
-- The path-extraction regex matches Supabase Storage public URLs:
--   https://<project>.supabase.co/storage/v1/object/public/uploads/<path>
-- and returns just the `<path>` portion (what `storage.from('uploads')
-- .remove([paths])` expects).

CREATE OR REPLACE FUNCTION public.list_my_upload_paths()
RETURNS text[]
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT array_agg(p)
  FROM (
    SELECT DISTINCT regexp_replace(image_url,    '^.*/uploads/', '') AS p
    FROM public.uploads
    WHERE user_id = auth.uid() AND image_url IS NOT NULL AND image_url <> ''
    UNION
    SELECT DISTINCT regexp_replace(image_url_hq, '^.*/uploads/', '') AS p
    FROM public.uploads
    WHERE user_id = auth.uid() AND image_url_hq IS NOT NULL AND image_url_hq <> ''
  ) paths;
$$;

GRANT EXECUTE ON FUNCTION public.list_my_upload_paths() TO authenticated;

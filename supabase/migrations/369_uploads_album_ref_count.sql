-- 369_uploads_album_ref_count.sql (2026-07-11)
--
-- A dream that's been composed into an album should LEAVE the Dreams album —
-- it lives inside its album now, not as a loose unposted tile (Kevin
-- 2026-07-11: "confusing to still have the single images show in the private
-- album after they've been posted in an album"). Deleting the album returns
-- them (their reference count drops to 0).
--
-- uploads.album_ref_count = how many albums reference this dream (count of
-- upload_media rows with source_upload_id = this id). Trigger-maintained;
-- client-READABLE (uploads SELECT is table-wide) but never client-WRITABLE
-- (deliberately NOT added to the migration-278 GRANT UPDATE list, like
-- media_count). The Dreams album filters album_ref_count = 0.
--
-- Reclaim rule: albums aren't editable after posting — the only way to get an
-- image back is to DELETE the album. When that drops a dream's ref count to 0,
-- it returns to the Dreams album AT THE TOP (created_at bumped), as if all its
-- images had just been set back to private (Kevin 2026-07-11).

BEGIN;

ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS album_ref_count smallint NOT NULL DEFAULT 0;

-- SECURITY DEFINER + pinned search_path (the counter-trigger lesson).
CREATE OR REPLACE FUNCTION public.sync_album_ref_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_source uuid := COALESCE(NEW.source_upload_id, OLD.source_upload_id);
  v_count  int;
BEGIN
  IF v_source IS NOT NULL THEN
    SELECT count(*) INTO v_count
    FROM public.upload_media m WHERE m.source_upload_id = v_source;
    UPDATE public.uploads u
      SET album_ref_count = v_count,
          -- Last album released this dream → float it to the top of Dreams.
          -- (Harmless no-op if the dream itself is the one being deleted.)
          created_at = CASE
            WHEN TG_OP = 'DELETE' AND v_count = 0 THEN now()
            ELSE created_at
          END
      WHERE u.id = v_source;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- source_upload_id is set once at insert and never updated, so INSERT/DELETE
-- covers every membership change (album published, member/album deleted).
DROP TRIGGER IF EXISTS trg_sync_album_ref_count ON public.upload_media;
CREATE TRIGGER trg_sync_album_ref_count
  AFTER INSERT OR DELETE ON public.upload_media
  FOR EACH ROW EXECUTE FUNCTION public.sync_album_ref_count();

-- Backfill existing referenced dreams.
UPDATE public.uploads u
  SET album_ref_count = (
    SELECT count(*) FROM public.upload_media m WHERE m.source_upload_id = u.id
  )
  WHERE EXISTS (SELECT 1 FROM public.upload_media m WHERE m.source_upload_id = u.id);

COMMIT;

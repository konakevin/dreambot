-- 568_uploads_bucket_own_folder_select.sql — stop any signed-in user from listing the whole
-- `uploads` bucket (audit 2026-09-27, S3 critical). 2026-09-27.
--
-- Policy "uploads readable via API" (migration 365) let every authenticated user SELECT
-- every object in `uploads`, so `POST /storage/v1/object/list/uploads {"prefix":"<uid>/"}`
-- enumerated anyone's files: ~16k PRIVATE dreams, plus the `temp/<uid>/` face crops and
-- perturbed cast-photo copies the swap pipeline leaves there. Once listed, the public
-- bucket serves each file by URL.
--
-- Replaced with: you can read (list / download / remove, which Storage also checks
-- against SELECT) only your own top-level folder `<uid>/...`, matching the existing own-
-- folder DELETE policy. Public URLs (/object/public/uploads/...) do not go through these
-- policies, so every image in the app and on the website keeps loading. The app's own
-- storage calls on this bucket are remove() of its own files (hooks/useDeletePost.ts) and
-- list(<uid>) during account deletion (app/settings/index.tsx) — both inside the own folder.
-- `temp/` is readable by nobody through the API now (the server uses the service key).

DROP POLICY IF EXISTS "uploads readable via API" ON storage.objects;

DROP POLICY IF EXISTS "uploads own folder readable" ON storage.objects;
CREATE POLICY "uploads own folder readable"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'uploads'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

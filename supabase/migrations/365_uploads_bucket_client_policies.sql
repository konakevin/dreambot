-- 365_uploads_bucket_client_policies.sql (2026-07-11)
--
-- The `uploads` storage bucket had NO RLS policies for authenticated users —
-- every object was only ever written by the render pipeline (service role,
-- bypasses RLS). Two client features have been silently broken by this:
--
--   1. Gallery publish (immutable snapshot, 2026-07-10): publishGallery
--      storage.copy()s each source image to `<uid>/gallery/...` AS THE USER.
--      Copy = SELECT on source + INSERT on destination; with no policies both
--      are denied, and storage masks the denial as "Object not found" → every
--      multi-image post failed with "Failed to post" (Kevin 2026-07-11).
--   2. Post-delete storage cleanup: useDeletePost fire-and-forgets
--      storage.remove() as the user — no DELETE policy → silent no-op → every
--      user-deleted post leaked its files.
--
-- Scopes (tight on write, own-folder on delete):
--   SELECT  — whole uploads bucket. It's a PUBLIC bucket (served via public
--             URLs with no RLS anyway); this just lets API ops (copy source
--             read / download) see what the CDN already serves.
--   INSERT  — ONLY into the user's own `<uid>/gallery/` prefix. The pipeline's
--             render paths (`<uid>/<ts>.png`, `<uid>/hq/...`) stay
--             service-role-only, so clients can't forge "renders".
--   DELETE  — the user's own `<uid>/...` folder (their files: renders they own,
--             gallery copies). Matches what the app already assumes works.

CREATE POLICY "uploads readable via API"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'uploads');

CREATE POLICY "users can copy into own gallery folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (storage.foldername(name))[2] = 'gallery'
  );

CREATE POLICY "users can delete own upload files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

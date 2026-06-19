-- Migration 292: PRIVATE bucket for user cast face photos.
--
-- WHY: cast face photos (self / plus_one / pet) currently live in the PUBLIC
-- `avatars` bucket at `<userId>/cast-<role>-<ts>.jpg`, so anyone with the exact
-- (unguessable) URL can fetch a user's face photo. They're never exposed in any
-- public API/feed, so it's "public-but-obscure" rather than browsable — but the
-- privacy note promises they're never displayed publicly, so we move them to a
-- PRIVATE bucket and serve them only via short-lived signed URLs (minted
-- server-side for the face-swap render + describe-photo, client-side for the
-- owner's own thumbnail display).
--
-- The `avatars` bucket STAYS public — profile avatars (`<userId>/avatar.jpg`) and
-- bot avatars are shown across the feed and must remain publicly readable. Only
-- the cast photos move here.
--
-- Access model: owner-only (folder = auth.uid()). The authed owner can SELECT
-- their own files (so the client can mint signed URLs for their own thumbnails);
-- the service role (Edge Functions) bypasses RLS and mints signed URLs for the
-- render pipeline. No anon read, no cross-user read. 8 MB cap carried over from
-- migration 277 so a modified client can't bloat storage.

-- ── 1. Private bucket ────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('cast-photos', 'cast-photos', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- ── 2. Owner-only RLS on storage.objects (scoped to this bucket) ─────────────
-- Re-runnable: drop first so the migration can be re-applied safely.
DROP POLICY IF EXISTS "cast-photos owner insert" ON storage.objects;
DROP POLICY IF EXISTS "cast-photos owner select" ON storage.objects;
DROP POLICY IF EXISTS "cast-photos owner update" ON storage.objects;
DROP POLICY IF EXISTS "cast-photos owner delete" ON storage.objects;

CREATE POLICY "cast-photos owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cast-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND coalesce((metadata->>'size')::bigint, 0) <= 8388608  -- 8 MiB
  );

CREATE POLICY "cast-photos owner select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cast-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "cast-photos owner update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cast-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "cast-photos owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cast-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 322 — Storage upload validation on the USER-UPLOADED buckets (2026-07-01
-- audit, S/#7). Neither user-facing selfie bucket capped file size or restricted
-- MIME type, so an authenticated client could push an oversized or non-image
-- blob. Add a size cap + an image-only MIME allow-list.
--
-- SCOPE: only the two buckets a CLIENT writes to — `avatars` and `cast-photos`
-- (both take a phone selfie, resized client-side). We deliberately do NOT touch
-- `uploads` (server-written rendered dreams + multi-MB HD PNGs — a limit there
-- risks breaking renders for no user-facing gain) or `location-thumbnails`
-- (server-fetched). iOS selfies can arrive as HEIC/HEIF, so those are allowed
-- alongside jpeg/png/webp; 15 MB is generous for a resized phone photo.

UPDATE storage.buckets
SET
  file_size_limit = 15728640, -- 15 MB
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'
  ]
WHERE id IN ('avatars', 'cast-photos');

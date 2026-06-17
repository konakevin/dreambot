-- Migration 277: enforce the 8MB photo-upload cap SERVER-SIDE.
--
-- User photos (dream-cast + profile) upload to the `avatars` bucket. The 8MB cap
-- was CLIENT-ONLY (hooks/useAvatarUpload.ts) → a modified client could push
-- arbitrarily large objects into Storage. Recreate the avatar INSERT policy
-- (migration 023) with the size check folded in, so the cap can't be bypassed.
--
-- The expensive vision path (describe-photo) is already rate-limited (10/min,
-- migration 228); this closes the raw-storage-bloat gap. Lenient on a missing
-- size (coalesce→0 passes) — Supabase sets object size automatically, so a real
-- oversized upload always carries a size and is blocked; the folder=auth.uid()
-- gate still bounds a crafted no-size object.

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND coalesce((metadata->>'size')::bigint, 0) <= 8388608  -- 8 MiB
  );

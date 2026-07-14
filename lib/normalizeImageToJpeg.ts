/**
 * Normalize a picker-selected image URI to actual JPEG bytes before upload.
 *
 * Why this exists (audit 2026-05-30): every cast/avatar upload path used
 * to call `supabase.storage.upload(uri, { contentType: 'image/jpeg' })`
 * regardless of what the picker actually returned. iOS Photos hands us
 * JPEG (`expo-image-picker` auto-transcodes HEIC when `quality < 1.0`),
 * so most uploads worked. But anyone picking from the Files app or a
 * screenshot would upload a PNG / WebP / GIF / AVIF with a lying JPEG
 * content-type, and:
 *   - Anthropic Vision sniffs format from bytes — usually OK
 *   - Replicate face-swap models (InsightFace) decode by sniffing too —
 *     usually OK for PNG/WebP, breaks on HEIC and animated GIF
 *   - Sharp display-variant pipeline handles JPEG/PNG/WebP, NOT HEIC
 *   - CDN content-type negotiation gets confused
 *
 * Fix: re-encode every picker output through expo-image-manipulator with
 * `format: JPEG`. That guarantees the bytes match the JPEG label we put on
 * the upload, regardless of source format.
 *
 * Used by: DreamCastStep (cast photos), useAvatarUpload (profile avatar).
 * Photo restyle (Create screen, dreamLikeThis, settings camera) sends
 * bytes straight to the Edge Function rather than uploading to user
 * storage — those don't need this; the Edge Function decodes the source.
 */
import * as ImageManipulator from 'expo-image-manipulator';

const JPEG_QUALITY = 0.9; // 0.9 = near-visually-lossless; ~150-400 KB for a 1024px portrait

/**
 * Normalize a picker URI to a true JPEG URI. Returns a `file://` URI
 * pointing to the transcoded JPEG (safe to fetch + upload). If the
 * input is already a JPEG, this still re-encodes it cheaply at quality
 * 0.9 — that strips any sneaky metadata and guarantees a stable shape
 * for downstream (face-swap, Sharp, Vision).
 *
 * Throws if the manipulator can't decode the source (extremely rare —
 * non-image URIs, corrupt files). Callers should catch and surface to
 * the user as "couldn't read this image — please pick another".
 */
export async function normalizeImageToJpeg(sourceUri: string): Promise<{
  uri: string;
  width: number;
  height: number;
}> {
  const result = await ImageManipulator.manipulateAsync(
    sourceUri,
    [], // no transforms — just transcode
    {
      format: ImageManipulator.SaveFormat.JPEG,
      compress: JPEG_QUALITY,
    }
  );
  return { uri: result.uri, width: result.width, height: result.height };
}

// Avatars display at ≤128px circles (plus the profile hero + the tap-to-view
// modal); 512px is retina-sharp everywhere while staying ~30-50 KB.
const AVATAR_MAX_PX = 512;

/**
 * Like normalizeImageToJpeg, but ALSO downscales to ≤512px for a profile avatar
 * so `avatar_url` can be served DIRECTLY (no Storage image transform — the Pro
 * plan meters those at only 100/cycle; see project_image_transform_quota). Do
 * NOT use this for cast photos — those keep full resolution for face-swap
 * quality (they go through normalizeImageToJpeg).
 */
export async function normalizeAvatarToJpeg(sourceUri: string): Promise<{
  uri: string;
  width: number;
  height: number;
}> {
  const result = await ImageManipulator.manipulateAsync(
    sourceUri,
    [{ resize: { width: AVATAR_MAX_PX } }], // aspect preserved; the circle crops
    { format: ImageManipulator.SaveFormat.JPEG, compress: 0.8 }
  );
  return { uri: result.uri, width: result.width, height: result.height };
}

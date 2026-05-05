/**
 * Image URL helpers — generates resized URLs via Supabase Storage transforms.
 *
 * Supabase serves transforms at:
 *   /storage/v1/render/image/public/{bucket}/{path}?width=W&height=H&resize=contain
 *
 * This avoids loading full-res images (1536×2688) for grid thumbnails and avatars.
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;

/** Convert a public storage URL to a resized transform URL */
function transform(
  url: string,
  width: number,
  height?: number,
  mode: 'contain' | 'cover' = 'contain',
  quality?: number
): string {
  // Only transform Supabase Storage URLs
  if (!url.includes(SUPABASE_URL)) return url;

  // Extract the path after /storage/v1/object/public/
  const match = url.match(/\/storage\/v1\/object\/public\/(.+)$/);
  if (!match) return url;

  const params = new URLSearchParams({ width: String(width), resize: mode });
  if (height) params.set('height', String(height));
  if (quality) params.set('quality', String(quality));

  return `${SUPABASE_URL}/storage/v1/render/image/public/${match[1]}?${params.toString()}`;
}

/** Grid thumbnail — 4:5 portrait, 400×500, server-side cropped via mode='cover'.
 *  Matches the 3-col Instagram-style tile aspect (PORTRAIT_RATIO = 5/4) so the
 *  client doesn't download pixels that contentFit="cover" would crop anyway.
 *  ~30% smaller payload than the prior 400×711 source-aspect thumb. */
export function thumbnailUrl(url: string): string {
  return transform(url, 400, 500, 'cover', 80);
}

/** Feed card — 9:16 full-screen. 720px width @ q=82 is plenty for any phone
 *  (largest iPhone is 430pt × 3x = 1290px but no perceptible quality loss
 *  scaling 720 → 1290 with expo-image's contentFit). Original Flux source
 *  is 768×1344 at q=100 — feedImageUrl trades a tiny bit of detail for
 *  ~3× faster initial load over the wire. */
export function feedImageUrl(url: string): string {
  return transform(url, 720, undefined, 'contain', 82);
}

/** Avatar — small circle, 128px is plenty for 64pt × 2x */
export function avatarUrl(url: string): string {
  return transform(url, 128, 128, 'cover', 80);
}

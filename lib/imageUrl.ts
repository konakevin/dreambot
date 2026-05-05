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

/** Grid thumbnail — 9:16 portrait, 400×711 (2-column grid, ~200pt × 2x retina) */
export function thumbnailUrl(url: string): string {
  return transform(url, 400, 711, 'contain', 80);
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

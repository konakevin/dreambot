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
  mode: 'contain' | 'cover' = 'contain'
): string {
  // Only transform Supabase Storage URLs
  if (!url.includes(SUPABASE_URL)) return url;

  // Extract the path after /storage/v1/object/public/
  const match = url.match(/\/storage\/v1\/object\/public\/(.+)$/);
  if (!match) return url;

  const params = new URLSearchParams({ width: String(width), resize: mode });
  if (height) params.set('height', String(height));

  return `${SUPABASE_URL}/storage/v1/render/image/public/${match[1]}?${params.toString()}`;
}

/** Grid thumbnail — 9:16 portrait, 400×711 (2-column grid, ~200pt × 2x retina) */
export function thumbnailUrl(url: string): string {
  return transform(url, 400, 711);
}

/** Feed card — full width but capped at 900px (phone is ~430pt × 2x retina) */
export function feedImageUrl(url: string): string {
  return transform(url, 900);
}

/** Avatar — small circle, 128px is plenty for 64pt × 2x */
export function avatarUrl(url: string): string {
  return transform(url, 128, 128, 'cover');
}

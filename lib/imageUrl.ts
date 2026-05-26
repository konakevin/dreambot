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

  // Extract the path after /storage/v1/object/public/, STOPPING at any query
  // string. Using ([^?]+) (not greedy (.+)) is load-bearing: avatar_url carries
  // a ?v=<ts> cache-buster, and including it would produce a double-`?` URL
  // (…/avatar.jpg?v=123?width=128…) the render endpoint can't parse — it then
  // ignores width/height/resize and serves a zoomed default crop.
  const match = url.match(/\/storage\/v1\/object\/public\/([^?]+)(\?.*)?$/);
  if (!match) return url;

  const params = new URLSearchParams({ width: String(width), resize: mode });
  if (height) params.set('height', String(height));
  if (quality) params.set('quality', String(quality));
  // Preserve the source's ?v= cache-buster so an updated image still
  // invalidates the transform's CDN cache.
  const srcV = new URLSearchParams(match[2] ? match[2].slice(1) : '').get('v');
  if (srcV) params.set('v', srcV);

  return `${SUPABASE_URL}/storage/v1/render/image/public/${match[1]}?${params.toString()}`;
}

/** Grid thumbnail — 4:5 portrait, 400×500, server-side cropped via mode='cover'.
 *  Matches the 3-col Instagram-style tile aspect (PORTRAIT_RATIO = 5/4) so the
 *  client doesn't download pixels that contentFit="cover" would crop anyway.
 *  ~30% smaller payload than the prior 400×711 source-aspect thumb. */
export function thumbnailUrl(url: string): string {
  return transform(url, 400, 500, 'cover', 80);
}

/** Avatar — small circle, 128px is plenty for 64pt × 2x */
export function avatarUrl(url: string): string {
  return transform(url, 128, 128, 'cover', 80);
}

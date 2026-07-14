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
  // Always request WebP. Without this, the transform served the resized image
  // in the SOURCE format (PNG → still ~450KB at 400×500); WebP drops to ~75KB
  // (6× smaller, 30× smaller than the 2MB raw). Safe here: this URL is DISPLAY
  // only — face-swap reads image_url (still the original PNG), and
  // imageLongPress already converts WebP→PNG before saving to Photos
  // (commit 0a1dd0a4). Supabase transform only accepts origin/webp (no jpeg).
  params.set('format', 'webp');
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

/**
 * Grid-TILE image source. Prefers the pre-generated STATIC display variant
 * (`image_url_display` — a ~150KB JPEG built at render time in persistence.ts),
 * so a tile costs ZERO Storage Image Transformations. The Pro plan includes only
 * 100 transforms/cycle and the app blew ~16,000 by transforming every tile's
 * ORIGINAL on display (2026-07-12 spend-cap lockout). Falls back to a server
 * transform ONLY for an image with no variant (a best-effort decode/upload miss,
 * or content predating the variant). expo-image downscales the variant to the
 * tile size client-side — egress has ample headroom; the transform quota does not.
 */
export function tileImageUrl(displayUrl: string | null | undefined, originalUrl: string): string {
  return displayUrl ?? thumbnailUrl(originalUrl);
}

/**
 * Avatar source — served DIRECTLY, no Storage image transform. Avatars are
 * uploaded pre-resized to ≤512px (normalizeAvatarToJpeg) and bot avatars are
 * already small, so a passthrough is retina-sharp at every circle size while
 * costing ZERO transform quota (the Pro plan includes only 100/cycle — see
 * project_image_transform_quota). expo-image downscales client-side. The
 * `?v=` cache-buster rides on avatar_url itself, so "change photo" still busts.
 * (Legacy full-res avatars uploaded before the resize serve at full res until
 * re-uploaded — fine: only ~30, cached, egress has ample headroom.)
 */
export function avatarUrl(url: string): string {
  return url;
}

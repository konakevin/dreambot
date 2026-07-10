/**
 * publishGallery — compose a multi-image "gallery" post (migration 356) from
 * images the user already owns (their generated dreams). Decisions (2026-07-09):
 * source = own dreams; immutable; cover = first selected.
 *
 * Flow (host stays private until fully built, so the feed never sees a
 * half-assembled gallery):
 *   1. INSERT a new host uploads row (is_public=false), cover columns copied
 *      from the first selected image.
 *   2. INSERT upload_media rows for every selected image (position 0..N-1). The
 *      DB trigger sets uploads.media_count.
 *   3. UPDATE the host → is_public=true, posted_at=now, description  (publish).
 *
 * Returns the new host upload id. The selected source dreams are untouched.
 */
import { supabase } from '@/lib/supabase';
import type { GalleryImage } from '@/components/DreamCard';

export interface GallerySourceImage extends GalleryImage {
  /** carried through for the cover's caption/medium, optional */
  caption?: string | null;
  dream_medium?: string | null;
  dream_vibe?: string | null;
}

export async function publishGallery(opts: {
  userId: string;
  images: GallerySourceImage[]; // in display order; [0] is the cover
  description?: string | null;
}): Promise<{ uploadId: string }> {
  const { userId, images } = opts;
  if (images.length < 2) throw new Error('a gallery needs at least 2 images');
  const cover = images[0];

  // 1. host row (private until step 3)
  const hostRow = {
    user_id: userId,
    image_url: cover.url,
    image_url_display: cover.display ?? null,
    image_url_hq: cover.hq ?? null,
    thumbhash: cover.thumbhash ?? null,
    width: cover.width ?? 768,
    height: cover.height ?? 1664,
    caption: cover.caption ?? null,
    dream_medium: cover.dream_medium ?? null,
    dream_vibe: cover.dream_vibe ?? null,
    is_public: false,
  };
  const { data: host, error: hostErr } = await supabase
    .from('uploads')
    .insert(hostRow as unknown as typeof hostRow & Record<string, unknown>)
    .select('id')
    .single();
  if (hostErr) throw hostErr;
  const uploadId = host.id as string;

  // 2. media rows (trigger sets media_count)
  const mediaRows = images.map((img, i) => ({
    upload_id: uploadId,
    position: i,
    image_url: img.url,
    image_url_display: img.display ?? null,
    image_url_hq: img.hq ?? null,
    thumbhash: img.thumbhash ?? null,
    width: img.width ?? null,
    height: img.height ?? null,
  }));
  const { error: mediaErr } = await supabase.from('upload_media').insert(mediaRows);
  if (mediaErr) {
    // roll back the orphan host so a failed publish leaves nothing behind
    await supabase.from('uploads').delete().eq('id', uploadId);
    throw mediaErr;
  }

  // 3. publish
  const { error: pubErr } = await supabase
    .from('uploads')
    .update({
      is_public: true,
      posted_at: new Date().toISOString(),
      description: opts.description?.trim() || null,
    })
    .eq('id', uploadId)
    .eq('user_id', userId);
  if (pubErr) throw pubErr;

  return { uploadId };
}

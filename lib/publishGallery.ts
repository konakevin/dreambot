/**
 * publishGallery — compose a multi-image "gallery" post (migration 356) from
 * images the user already owns (their generated dreams).
 *
 * MODEL: a gallery is a REFERENCE, not a copy (migration 367, 2026-07-11). Each
 * upload_media row points at its SOURCE dream via source_upload_id and REUSES
 * that dream's existing storage URLs — no files are copied. Publish is two
 * inserts, instant. Consistency is enforced entirely in the DB:
 *   • FK ON DELETE CASCADE — deleting a source dream removes it from the album.
 *   • heal trigger — re-fronts the cover / dissolves an emptied album.
 *   • visibility is read-time (RLS + get_feed) — a member whose source went
 *     private drops out of the album reversibly; re-showing it brings it back.
 * So the album is a live "window" into the user's dreams, not a frozen snapshot.
 */
import { supabase } from '@/lib/supabase';
import type { GalleryImage } from '@/components/DreamCard';

export interface GallerySourceImage extends GalleryImage {
  /** the SOURCE dream's id — the reference anchor (migration 367). */
  id: string;
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

  // 1. host row (private until step 3) — cover reuses the source dream's URLs.
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

  // 2. membership rows — reference each source dream (source_upload_id) and
  //    reuse its URLs so every read path (get_feed media jsonb, carousel) is
  //    unchanged. The DB trigger sets uploads.media_count.
  const mediaRows = images.map((img, i) => ({
    upload_id: uploadId,
    source_upload_id: img.id,
    position: i,
    image_url: img.url,
    image_url_display: img.display ?? null,
    image_url_hq: img.hq ?? null,
    thumbhash: img.thumbhash ?? null,
    width: img.width ?? null,
    height: img.height ?? null,
  }));
  const { error: mediaErr } = await supabase
    .from('upload_media')
    .insert(mediaRows as unknown as (typeof mediaRows)[number][] & Record<string, unknown>[]);
  if (mediaErr) {
    await supabase.from('uploads').delete().eq('id', uploadId); // cascades media rows
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
  if (pubErr) {
    await supabase.from('uploads').delete().eq('id', uploadId);
    throw pubErr;
  }

  return { uploadId };
}

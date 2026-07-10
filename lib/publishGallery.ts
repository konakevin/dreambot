/**
 * publishGallery — compose a multi-image "gallery" post (migration 356) from
 * images the user already owns (their generated dreams).
 *
 * MODEL: a gallery is an IMMUTABLE SNAPSHOT (2026-07-10). It COPIES each source
 * image's storage object into its own files (server-side storage.copy — no
 * re-download), so the gallery is fully decoupled from the source dreams'
 * lifecycle: deleting / hiding a source dream can't break the gallery, and
 * deleting the gallery can't touch the sources. The source dreams stay in the
 * library untouched.
 *
 * Flow (host stays private until fully built, so the feed never sees a
 * half-assembled gallery):
 *   1. COPY every image's storage object(s) to gallery-owned paths.
 *   2. INSERT the host uploads row (is_public=false), cover = the copied [0].
 *   3. INSERT upload_media rows for the copies (position 0..N-1). The DB trigger
 *      sets uploads.media_count.
 *   4. UPDATE the host → is_public=true, posted_at=now, description  (publish).
 */
import { supabase } from '@/lib/supabase';
import type { GalleryImage } from '@/components/DreamCard';

export interface GallerySourceImage extends GalleryImage {
  /** carried through for the cover's caption/medium, optional */
  caption?: string | null;
  dream_medium?: string | null;
  dream_vibe?: string | null;
}

const BUCKET = 'uploads';
const PUBLIC_MARKER = '/object/public/uploads/';

/** public URL → path within the uploads bucket (null if it isn't one). */
function bucketPath(publicUrl: string): string | null {
  const i = publicUrl.indexOf(PUBLIC_MARKER);
  if (i < 0) return null;
  return decodeURIComponent(publicUrl.slice(i + PUBLIC_MARKER.length).split('?')[0]);
}

function extOf(path: string): string {
  const m = path.match(/\.([a-z0-9]+)$/i);
  return m ? m[1] : 'jpg';
}

/** Copy a source object to destPath; returns the new public URL. Pass-through
 *  (returns the original) if the URL isn't a bucket object. Records destPath in
 *  `created` so a failed publish can clean up the copies it made. */
async function copyObject(
  publicUrl: string | null | undefined,
  destPath: string,
  created: string[]
): Promise<string | null> {
  if (!publicUrl) return null;
  const src = bucketPath(publicUrl);
  if (!src) return publicUrl;
  const { error } = await supabase.storage.from(BUCKET).copy(src, destPath);
  if (error) throw error;
  created.push(destPath);
  return supabase.storage.from(BUCKET).getPublicUrl(destPath).data.publicUrl;
}

export async function publishGallery(opts: {
  userId: string;
  images: GallerySourceImage[]; // in display order; [0] is the cover
  description?: string | null;
}): Promise<{ uploadId: string }> {
  const { userId, images } = opts;
  if (images.length < 2) throw new Error('a gallery needs at least 2 images');

  const created: string[] = []; // gallery-owned storage paths, for rollback
  const ts = Date.now();

  const cleanupStorage = async () => {
    if (created.length) await supabase.storage.from(BUCKET).remove(created);
  };

  try {
    // 1. copy each image's storage to gallery-owned files
    const copied = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const base = `${userId}/gallery/${ts}-${i}`;
      copied.push({
        ...img,
        url: (await copyObject(
          img.url,
          `${base}.${extOf(bucketPath(img.url) ?? img.url)}`,
          created
        ))!,
        display: await copyObject(img.display, `${base}.display.jpg`, created),
        hq: await copyObject(img.hq, `${base}.hq.png`, created),
      });
    }
    const cover = copied[0];

    // 2. host row (private until step 4)
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

    // 3. media rows (trigger sets media_count)
    const mediaRows = copied.map((img, i) => ({
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
      await supabase.from('uploads').delete().eq('id', uploadId); // cascades media rows
      throw mediaErr;
    }

    // 4. publish
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
  } catch (err) {
    await cleanupStorage(); // remove any copies we made before failing
    throw err;
  }
}

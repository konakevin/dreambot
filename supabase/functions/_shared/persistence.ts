/**
 * Storage persistence — downloads the Replicate temp URL + uploads to
 * Supabase Storage, returning the permanent public URL. Used by all three
 * pipelines.
 *
 * Detects PNG vs JPEG from magic bytes so the content-type matches.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function persistToStorage(
  tempUrl: string,
  userId: string,
  supabase: SupabaseClient
): Promise<string> {
  const resp = await fetch(tempUrl);
  if (!resp.ok) throw new Error(`Failed to download image: ${resp.status}`);
  const buf = await resp.arrayBuffer();

  // Detect actual image format from magic bytes
  const bytes = new Uint8Array(buf.slice(0, 4));
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const contentType = isPng ? 'image/png' : 'image/jpeg';

  const fileName = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, buf, { contentType });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

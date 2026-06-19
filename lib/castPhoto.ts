/**
 * Cast-photo source resolution (client side).
 *
 * Cast face photos live in the PRIVATE `cast-photos` bucket (migration 292),
 * stored on `DreamCastMember.storage_path`. The owner can read their own files
 * (RLS owner-SELECT), so the client mints short-lived signed URLs on demand for
 * thumbnail display + the one-time describe-photo call.
 *
 * Legacy members carry a public `thumb_url` and no `storage_path` — handled as a
 * passthrough so this is safe before the public files are migrated.
 */

import { supabase } from '@/lib/supabase';
import type { DreamCastMember } from '@/types/vibeProfile';

const CAST_BUCKET = 'cast-photos';
const SIGNED_TTL_SECONDS = 3600;

/** True when the member has a usable face photo (private path OR legacy URL). */
export function castHasPhoto(m: Pick<DreamCastMember, 'thumb_url' | 'storage_path'>): boolean {
  return !!m.storage_path || (typeof m.thumb_url === 'string' && m.thumb_url.startsWith('http'));
}

/** Mint a fresh signed URL for a private cast path. Returns null on failure. */
export async function castSignedUrl(
  storagePath: string,
  ttl = SIGNED_TTL_SECONDS
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(CAST_BUCKET)
    .createSignedUrl(storagePath, ttl);
  if (error || !data?.signedUrl) {
    if (__DEV__) console.warn('[castPhoto] signed URL failed for', storagePath, error?.message);
    return null;
  }
  return data.signedUrl;
}

/**
 * A fetchable URL for display / describe — a signed URL for a private member, or
 * the legacy public `thumb_url`. Returns null if neither is available.
 */
export async function castDisplayUrl(
  m: Pick<DreamCastMember, 'thumb_url' | 'storage_path'>
): Promise<string | null> {
  if (m.storage_path) return castSignedUrl(m.storage_path);
  return m.thumb_url && m.thumb_url.startsWith('http') ? m.thumb_url : null;
}

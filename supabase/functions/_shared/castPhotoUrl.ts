/**
 * Cast-photo source resolution (Edge side).
 *
 * Cast face photos live in the PRIVATE `cast-photos` bucket (migration 292),
 * stored on `dream_cast[].storage_path`. The render + describe pipelines need a
 * fetchable HTTPS URL (Replicate / Fly / Haiku vision fetch it server-to-server),
 * so we mint a short-lived signed URL on demand.
 *
 * DESIGN — hydrate early: every downstream consumer (brief builders, prompt
 * compiler, gender routing, the faceSwap/dispatch choke points) already decides
 * "is this cast usable?" by checking `thumb_url.startsWith('http')`. Rather than
 * teach all of them about storage paths, we resolve ONCE right after the cast is
 * loaded from the recipe — copying a fresh signed URL into `thumb_url` — so all
 * existing logic works unchanged.
 *
 * Legacy members (un-migrated, still pointing at a public `avatars` URL) carry a
 * real http `thumb_url` and no `storage_path`; hydration is a no-op for them, so
 * this is safe to roll out before the public files are migrated.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

const CAST_BUCKET = 'cast-photos';
// 1h: far longer than any single render (RENDER_TIMEOUT_MS = 120s) yet short
// enough that a leaked URL expires quickly.
const SIGNED_TTL_SECONDS = 3600;

interface CastSourceLike {
  thumb_url?: string;
  storage_path?: string;
}

/** True when the value is already a fetchable URL (http(s) or an inline data URI). */
function isFetchableUrl(v: string | undefined): boolean {
  if (typeof v !== 'string') return false;
  return v.startsWith('http') || v.startsWith('data:');
}

/**
 * A cast member has a usable face source when it has EITHER a private
 * `storage_path` (resolved to a signed URL at render time) OR a legacy public
 * `thumb_url`. Use this in place of bare `thumb_url.startsWith('http')` gates at
 * sites that run BEFORE hydration.
 */
export function castHasSource(m: CastSourceLike): boolean {
  return !!m.storage_path || isFetchableUrl(m.thumb_url);
}

/**
 * Hydrate each member's `thumb_url` into a fetchable URL. Members that already
 * have an http/data `thumb_url` are left as-is; members with a `storage_path`
 * get a fresh signed URL. Returns shallow COPIES (never mutates the recipe
 * objects — a signed URL must never be persisted back, it expires).
 *
 * Best-effort per member: a failed signing leaves the member's `thumb_url`
 * unchanged (downstream "no usable source" handling then degrades to solo,
 * exactly as it does today for a deleted photo).
 */
export async function hydrateCastSources<T extends CastSourceLike>(
  cast: T[],
  supabase: SupabaseClient
): Promise<T[]> {
  return Promise.all(
    cast.map(async (m) => {
      if (isFetchableUrl(m.thumb_url)) return m;
      if (!m.storage_path) return m;
      const { data, error } = await supabase.storage
        .from(CAST_BUCKET)
        .createSignedUrl(m.storage_path, SIGNED_TTL_SECONDS);
      if (error || !data || !data.signedUrl) {
        console.warn(
          `[castPhoto] signed URL failed for ${m.storage_path}: ${error ? error.message : 'no url'}`
        );
        return m;
      }
      return { ...m, thumb_url: data.signedUrl };
    })
  );
}

/**
 * Resolve a single cast source value (a `storage_path` or a legacy http URL) to
 * a fetchable URL. For the describe-vision path that reads one member directly.
 */
export async function resolveCastSource(
  m: CastSourceLike,
  supabase: SupabaseClient
): Promise<string | null> {
  if (isFetchableUrl(m.thumb_url)) return m.thumb_url as string;
  if (!m.storage_path) return null;
  const { data, error } = await supabase.storage
    .from(CAST_BUCKET)
    .createSignedUrl(m.storage_path, SIGNED_TTL_SECONDS);
  if (error || !data || !data.signedUrl) return null;
  return data.signedUrl;
}

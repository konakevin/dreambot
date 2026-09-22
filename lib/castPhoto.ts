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

/**
 * SIGNED URLS ARE CACHED BY PATH, and the reason is latency, not request count.
 *
 * Every call mints a URL carrying a FRESH token, so the string differs each time even
 * for the same file. That costs twice over on the Create screen's cast chip, where an
 * avatar mounts the moment the prompt resolves to someone: a network round trip to mint
 * the URL, and then a full image download, because expo-image caches by URL and has
 * never seen this one. Typing "Steph" lit her face roughly a second later — and did it
 * again on every mount, since the URL never repeated (Kevin, 2026-09-22: "there's a bit
 * of lag from the time i type 'steph' and it triggers it's her and the little cast
 * thumbnail renders, it feels delayed by about 0.5-1 second").
 *
 * Caching makes the URL STABLE, which is what actually lets the image cache hit.
 *
 * REFRESH MARGIN: some of these URLs are handed to the SERVER (describe-photo, the
 * first-dream render) and fetched there, minutes later. Retiring an entry a quarter of
 * an hour before it actually expires means a cached URL always has real life left in
 * it, whoever ends up fetching it.
 */
const REFRESH_MARGIN_MS = 15 * 60 * 1000;
const signedCache = new Map<string, { url: string; expiresAt: number }>();
/** In-flight mints, so two avatars mounting on the same keystroke make ONE request. */
const signedInFlight = new Map<string, Promise<string | null>>();

/**
 * The cached URL for a path, or null. Synchronous ON PURPOSE: a component can seed its
 * state with this on the first render and paint a warm face immediately, instead of
 * showing an empty ring for a frame while an effect resolves a value it already has.
 */
export function cachedCastUrl(storagePath?: string | null): string | null {
  if (!storagePath) return null;
  const hit = signedCache.get(storagePath);
  return hit && hit.expiresAt > Date.now() ? hit.url : null;
}

/** Drop everything. For sign-out: the next user must not inherit these. */
export function clearCastUrlCache(): void {
  signedCache.clear();
  signedInFlight.clear();
}

/** True when the member has a usable face photo (private path OR legacy URL). */
export function castHasPhoto(m: Pick<DreamCastMember, 'thumb_url' | 'storage_path'>): boolean {
  return !!m.storage_path || (typeof m.thumb_url === 'string' && m.thumb_url.startsWith('http'));
}

/** A signed URL for a private cast path, cached by path. Returns null on failure. */
export async function castSignedUrl(
  storagePath: string,
  ttl = SIGNED_TTL_SECONDS
): Promise<string | null> {
  const cached = cachedCastUrl(storagePath);
  if (cached) return cached;
  const pending = signedInFlight.get(storagePath);
  if (pending) return pending;

  const request = (async () => {
    const { data, error } = await supabase.storage
      .from(CAST_BUCKET)
      .createSignedUrl(storagePath, ttl);
    if (error || !data?.signedUrl) {
      if (__DEV__) console.warn('[castPhoto] signed URL failed for', storagePath, error?.message);
      return null;
    }
    // A failure is deliberately NOT cached: it is usually a transient network error, and
    // remembering it would leave that face blank for the rest of the session.
    signedCache.set(storagePath, {
      url: data.signedUrl,
      expiresAt: Date.now() + ttl * 1000 - REFRESH_MARGIN_MS,
    });
    return data.signedUrl;
  })().finally(() => signedInFlight.delete(storagePath));

  signedInFlight.set(storagePath, request);
  return request;
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

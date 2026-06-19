/**
 * Constant-time string equality for auth-token / shared-secret comparison.
 *
 * A plain `a === b` short-circuits at the first differing byte, so the time it
 * takes leaks how many leading bytes matched — a timing side-channel. For
 * high-entropy random secrets this is largely theoretical over a network, but
 * secret comparison should be constant-time as a matter of hygiene. Mirrors the
 * helper already used in revenuecat-webhook (kept dependency-free for Deno edge).
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

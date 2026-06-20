/**
 * First-dream cast-readiness predicate (client).
 *
 * The onboarding cutoff must not kick off the first dream until the cast photos
 * the user uploaded have actually landed — otherwise it enqueues a faceless
 * scene-only dream (the cast-upload race). This is the gate the cutoff polls on.
 *
 * `isCastMemberUsable` MUST stay in lockstep with the server-side `usable()` in
 * supabase/functions/_shared/firstDreamTiers.ts (which decides whether to add a
 * face-swap tier). They live in different runtimes (RN bundle vs Deno edge) so
 * the code can't be shared — `__tests__/lib/firstDreamReady.test.ts` locks them
 * to the same truth table to catch drift.
 */

import type { DreamCastMember } from '@/types/vibeProfile';

/**
 * A cast member is USABLE for a face swap when it carries a private storage_path
 * (resolved to a signed URL at render time) OR a legacy public http thumb_url.
 * A member mid-upload (no storage_path yet) or with only a local file:// URI is
 * NOT usable.
 */
export function isCastMemberUsable(
  m: Pick<DreamCastMember, 'storage_path' | 'thumb_url'>
): boolean {
  return !!m.storage_path || (typeof m.thumb_url === 'string' && m.thumb_url.startsWith('http'));
}

/**
 * Is the cast READY to kick off the first dream? An EMPTY cast is ready — the
 * user chose no cast, so a scene-only first dream is the intended result, not a
 * race. Otherwise every member the user added must be usable.
 */
export function isCastReadyForKickoff(
  cast: Pick<DreamCastMember, 'storage_path' | 'thumb_url'>[] | undefined
): boolean {
  if (!Array.isArray(cast) || cast.length === 0) return true;
  return cast.every(isCastMemberUsable);
}

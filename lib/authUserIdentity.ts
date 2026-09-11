import type { AuthChangeEvent, User } from '@supabase/supabase-js';

/**
 * Decide which `User` object the auth store should publish after an auth event.
 *
 * supabase-js refreshes the access token roughly every 58 minutes (and on foreground
 * once the token has expired) and delivers a NEW `session.user` object with the SAME
 * identity. Publishing that new reference re-fires every `useEffect([user])` in the
 * app: the Bots tab prewarm alone fanned out ~19 concurrent get_feed RPCs on every
 * refresh (found in the API logs 2026-09-09 — a burst every 58 min from an idle app).
 *
 * Keep the previous reference while the user id is unchanged, EXCEPT on USER_UPDATED,
 * the one event whose payload (email, metadata) legitimately changed. Sign-in as a
 * different user, sign-out, or the first session always pass the new value through.
 */
export function resolveStableUser(
  prev: User | null,
  next: User | null,
  event: AuthChangeEvent
): User | null {
  if (!prev || !next) return next;
  if (prev.id !== next.id) return next;
  if (event === 'USER_UPDATED') return next;
  return prev;
}

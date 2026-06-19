/**
 * Unit tests for hasViewedSinceCreated (_shared/notify.ts).
 *
 * The universal "I already saw this" push gate. Because pushes fire on a
 * 30s-2min debounce (migration 204) rather than synchronously on insert, the
 * user can open their inbox and view a notification BEFORE its banner goes out.
 * The sibling gate only covers grouped notifications (it ignores the current
 * row's own view-state), so singletons (dream-ready, comment, friend request,
 * first like) slipped through and pushed after being viewed — Kevin's bug.
 *
 * Rule: if the inbox was opened at/after this notification was created, the user
 * has seen it → skip the banner.
 */

import { hasViewedSinceCreated } from '@engine/notify';

const NOW = Date.UTC(2026, 5, 5, 12, 0, 0);
const at = (offsetMs: number) => new Date(NOW + offsetMs).toISOString();

describe('hasViewedSinceCreated — suppress push once the inbox has been viewed', () => {
  it('suppresses when the inbox was opened AFTER the notification was created', () => {
    // Notification at T-10s, inbox opened at T-2s → seen → skip.
    expect(hasViewedSinceCreated({ createdAt: at(-10_000), lastInboxViewedAt: at(-2_000) })).toBe(
      true
    );
  });

  it('suppresses when the inbox view exactly equals the created time (boundary)', () => {
    expect(hasViewedSinceCreated({ createdAt: at(0), lastInboxViewedAt: at(0) })).toBe(true);
  });

  it('does NOT suppress when the notification is NEWER than the last inbox view', () => {
    // Viewed at T-30s, then a fresh notification at T-1s → genuinely new → push.
    expect(hasViewedSinceCreated({ createdAt: at(-1_000), lastInboxViewedAt: at(-30_000) })).toBe(
      false
    );
  });

  it('does NOT suppress when the user has never opened the inbox', () => {
    expect(hasViewedSinceCreated({ createdAt: at(-5_000), lastInboxViewedAt: null })).toBe(false);
    expect(hasViewedSinceCreated({ createdAt: at(-5_000), lastInboxViewedAt: undefined })).toBe(
      false
    );
  });

  it('does NOT suppress when createdAt is missing (fail-open → deliver)', () => {
    expect(hasViewedSinceCreated({ createdAt: null, lastInboxViewedAt: at(0) })).toBe(false);
    expect(hasViewedSinceCreated({ createdAt: undefined, lastInboxViewedAt: at(0) })).toBe(false);
  });

  it('does NOT suppress on malformed timestamps (parse fail → deliver)', () => {
    expect(hasViewedSinceCreated({ createdAt: 'not-a-date', lastInboxViewedAt: at(0) })).toBe(
      false
    );
    expect(hasViewedSinceCreated({ createdAt: at(-5_000), lastInboxViewedAt: 'nope' })).toBe(false);
  });
});

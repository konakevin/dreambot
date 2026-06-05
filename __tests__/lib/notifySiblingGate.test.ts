/**
 * Unit tests for hasSeenSibling (_shared/notify.ts).
 *
 * Guards the migration-225 sibling-acknowledged gate. Kevin's rule, verbatim:
 *
 *   "I had already clicked in and seen the notification for it, once that
 *    happens, no more push notification needs to happen."
 *
 * send-push uses this helper to decide whether to fire an OS banner. The
 * notification row is still inserted into the inbox; only the OS push is
 * suppressed when the user has already acknowledged a sibling.
 *
 * Acknowledgement comes from two sources:
 *   1. anySiblingSeen=true — any sibling's seen_at is non-null (push-tap path
 *      mark-seen, legacy mark_group_seen). Definite acknowledgement.
 *   2. last_inbox_view_at >= oldest sibling's created_at — user opened the
 *      inbox AFTER an earlier sibling existed (implicit acknowledgement).
 */

import { hasSeenSibling } from '@engine/notify';

const NOW = Date.UTC(2026, 5, 5, 12, 0, 0);
const at = (offsetMs: number) => new Date(NOW + offsetMs).toISOString();

describe('hasSeenSibling — push suppression on prior acknowledgement', () => {
  describe('anySiblingSeen branch (definite ack)', () => {
    it('suppresses when a sibling was explicitly marked seen', () => {
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: at(-5_000),
          anySiblingSeen: true,
          lastInboxViewedAt: null,
        })
      ).toBe(true);
    });

    it('suppresses even without an oldestSiblingCreatedAt (seen flag wins)', () => {
      // Defensive — seen flag is authoritative regardless of timestamps.
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: null,
          anySiblingSeen: true,
          lastInboxViewedAt: null,
        })
      ).toBe(true);
    });
  });

  describe('view-time branch (implicit ack via inbox open)', () => {
    it('suppresses when inbox was viewed AFTER an earlier sibling existed', () => {
      // Sibling1 created at t=-10s. User opened inbox at t=-2s. New sibling
      // is firing now — user has implicitly acknowledged this group.
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: at(-10_000),
          anySiblingSeen: false,
          lastInboxViewedAt: at(-2_000),
        })
      ).toBe(true);
    });

    it('suppresses when last_inbox_view_at exactly equals oldest sibling created_at', () => {
      // Boundary case: ">= ", not ">"  — equal timestamps still count.
      const t = at(-5_000);
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: t,
          anySiblingSeen: false,
          lastInboxViewedAt: t,
        })
      ).toBe(true);
    });

    it('does NOT suppress when inbox was viewed BEFORE the oldest sibling existed', () => {
      // Sibling created at t=-2s but user's last inbox view was earlier
      // (t=-10s). User has never seen anything in this group.
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: at(-2_000),
          anySiblingSeen: false,
          lastInboxViewedAt: at(-10_000),
        })
      ).toBe(false);
    });

    it('does NOT suppress when there are no siblings (oldestSiblingCreatedAt null)', () => {
      // First notification in a brand-new group — nothing to acknowledge.
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: null,
          anySiblingSeen: false,
          lastInboxViewedAt: at(-30_000),
        })
      ).toBe(false);
    });

    it('does NOT suppress when user has never opened the inbox', () => {
      // last_inbox_view_at NULL — view-time check can't fire.
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: at(-5_000),
          anySiblingSeen: false,
          lastInboxViewedAt: null,
        })
      ).toBe(false);
    });
  });

  describe('defensive handling of malformed timestamps', () => {
    it('does NOT suppress when oldestSiblingCreatedAt is malformed', () => {
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: 'not-a-date',
          anySiblingSeen: false,
          lastInboxViewedAt: at(-1_000),
        })
      ).toBe(false);
    });

    it('does NOT suppress when lastInboxViewedAt is malformed', () => {
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: at(-1_000),
          anySiblingSeen: false,
          lastInboxViewedAt: 'not-a-date',
        })
      ).toBe(false);
    });

    it('handles undefined like null (no suppression)', () => {
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: undefined,
          anySiblingSeen: false,
          lastInboxViewedAt: undefined,
        })
      ).toBe(false);
    });
  });

  describe('the exact scenario Kevin reported', () => {
    it('suppresses the second download_ready push after the first was tapped', () => {
      // t=0: notification1 (download_ready) inserted, push1 fires.
      // t=2s: Kevin taps push1 → markInboxViewed → last_inbox_view_at=t=2s.
      // t=10s: notification2 (download_ready, SAME upload, same group_key
      //        after migration 225) inserted → trigger fires send-push.
      // send-push queries siblings: notification1 created at t=0.
      // Decision: last_inbox_view_at (t=2s) >= oldest sibling (t=0) → SKIP.
      const t0 = at(0);
      expect(
        hasSeenSibling({
          oldestSiblingCreatedAt: t0,
          anySiblingSeen: false, // mark_inbox_viewed doesn't touch per-row seen_at
          lastInboxViewedAt: at(2_000),
        })
      ).toBe(true);
    });
  });
});

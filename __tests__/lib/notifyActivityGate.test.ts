/**
 * Unit tests for shouldSkipForActivity (_shared/notify.ts).
 *
 * Guards the migration-224 activity gate: send-push SKIPS the Expo POST when
 * the recipient's users.last_active_at is within the threshold (default 30s).
 * The notification row is still inserted; only the OS banner is suppressed.
 *
 * This is the regression Kevin called out ("getting push notifications while
 * in DreamBot app"). If someone tweaks the threshold or breaks the null
 * handling, these tests fail loudly.
 */

import { shouldSkipForActivity } from '@engine/notify';

// Fixed clock so every test reads from the same "now". Pick a future-ish
// timestamp so we're not in 1970 land if any future Date math is added.
const NOW = Date.UTC(2026, 5, 5, 12, 0, 0); // 2026-06-05 12:00:00 UTC
const secondsAgo = (s: number) => new Date(NOW - s * 1000).toISOString();
const secondsAhead = (s: number) => new Date(NOW + s * 1000).toISOString();

describe('shouldSkipForActivity — push suppression when recipient is active', () => {
  it('skips when last activity was 1s ago (well inside the 30s window)', () => {
    expect(shouldSkipForActivity({ lastActiveAt: secondsAgo(1), now: NOW })).toBe(true);
  });

  it('skips when last activity was 29s ago (just inside the window)', () => {
    expect(shouldSkipForActivity({ lastActiveAt: secondsAgo(29), now: NOW })).toBe(true);
  });

  it('does NOT skip exactly at the 30s boundary (open interval)', () => {
    // strictly-less-than threshold: 30000ms ago is NOT < 30000ms.
    expect(shouldSkipForActivity({ lastActiveAt: secondsAgo(30), now: NOW })).toBe(false);
  });

  it('does NOT skip when last activity was 31s ago (just outside)', () => {
    expect(shouldSkipForActivity({ lastActiveAt: secondsAgo(31), now: NOW })).toBe(false);
  });

  it('does NOT skip when last activity was 5 minutes ago', () => {
    expect(shouldSkipForActivity({ lastActiveAt: secondsAgo(300), now: NOW })).toBe(false);
  });

  it('does NOT skip when last_active_at is null (user has no heartbeat)', () => {
    // A fresh signup hasn't touched last_active_at yet — they should still get pushes.
    expect(shouldSkipForActivity({ lastActiveAt: null, now: NOW })).toBe(false);
  });

  it('does NOT skip when last_active_at is undefined', () => {
    expect(shouldSkipForActivity({ lastActiveAt: undefined, now: NOW })).toBe(false);
  });

  it('does NOT skip when last_active_at is the empty string', () => {
    expect(shouldSkipForActivity({ lastActiveAt: '', now: NOW })).toBe(false);
  });

  it('does NOT skip when last_active_at is malformed (parse → NaN)', () => {
    // Defensive: a corrupted column shouldn't silently suppress pushes.
    expect(shouldSkipForActivity({ lastActiveAt: 'not-a-date', now: NOW })).toBe(false);
  });

  it('skips when last_active_at is in the FUTURE (clock skew)', () => {
    // Treated as "very recent" — would suppress. This is the conservative
    // choice: a slightly-off clock between client + server shouldn't double-fire.
    expect(shouldSkipForActivity({ lastActiveAt: secondsAhead(5), now: NOW })).toBe(true);
  });

  it('respects a custom thresholdMs (tighter window)', () => {
    // 10s threshold: 9s ago is inside, 11s ago is outside.
    expect(
      shouldSkipForActivity({ lastActiveAt: secondsAgo(9), now: NOW, thresholdMs: 10_000 })
    ).toBe(true);
    expect(
      shouldSkipForActivity({ lastActiveAt: secondsAgo(11), now: NOW, thresholdMs: 10_000 })
    ).toBe(false);
  });

  it('respects a custom thresholdMs (looser window)', () => {
    // 5min threshold: 4min ago is inside, 6min ago is outside.
    expect(
      shouldSkipForActivity({ lastActiveAt: secondsAgo(240), now: NOW, thresholdMs: 300_000 })
    ).toBe(true);
    expect(
      shouldSkipForActivity({ lastActiveAt: secondsAgo(360), now: NOW, thresholdMs: 300_000 })
    ).toBe(false);
  });

  it('threshold of 0 → never skip (effectively disabled)', () => {
    expect(shouldSkipForActivity({ lastActiveAt: secondsAgo(0), now: NOW, thresholdMs: 0 })).toBe(
      false
    );
  });
});

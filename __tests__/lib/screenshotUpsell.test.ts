/**
 * Tests the pure decision function behind the screenshot upsell.
 * Mounting the listener requires the native expo-screen-capture
 * module + a real device, but the gate logic — who sees the modal,
 * who doesn't — is just a function and can be exercised exhaustively
 * here.
 */

import { shouldShowScreenshotUpsell } from '@/lib/screenshotUpsellGate';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NOW = 1_700_000_000_000; // arbitrary fixed "now"

const baseInputs = {
  isPro: false,
  isAdmin: false,
  currentUserId: 'me',
  postOwnerId: 'someone-else',
  firedThisSession: false,
  lastDismissedAt: null as number | null,
  now: NOW,
};

describe('shouldShowScreenshotUpsell', () => {
  it('shows the upsell for a free user looking at someone elses post', () => {
    expect(shouldShowScreenshotUpsell(baseInputs)).toBe(true);
  });

  it('silent for Pro users (they already have unlimited HQ saves)', () => {
    expect(shouldShowScreenshotUpsell({ ...baseInputs, isPro: true })).toBe(false);
  });

  it('silent for admins (admin bypass everywhere)', () => {
    expect(shouldShowScreenshotUpsell({ ...baseInputs, isAdmin: true })).toBe(false);
  });

  it('silent on the users own post', () => {
    expect(
      shouldShowScreenshotUpsell({ ...baseInputs, currentUserId: 'me', postOwnerId: 'me' })
    ).toBe(false);
  });

  it('silent if no post is currently visible (postOwnerId is null)', () => {
    expect(shouldShowScreenshotUpsell({ ...baseInputs, postOwnerId: null })).toBe(false);
  });

  it('silent if already fired this session', () => {
    expect(shouldShowScreenshotUpsell({ ...baseInputs, firedThisSession: true })).toBe(false);
  });

  it('silent if dismissed within the 7-day cooldown', () => {
    // dismissed 3 days ago — still inside cooldown
    expect(
      shouldShowScreenshotUpsell({
        ...baseInputs,
        lastDismissedAt: NOW - 3 * MS_PER_DAY,
      })
    ).toBe(false);
  });

  it('shows the upsell once the 7-day cooldown elapses', () => {
    // dismissed 8 days ago — cooldown expired
    expect(
      shouldShowScreenshotUpsell({
        ...baseInputs,
        lastDismissedAt: NOW - 8 * MS_PER_DAY,
      })
    ).toBe(true);
  });

  it('shows even when not signed in (currentUserId null) — bot post counts', () => {
    // shouldn't happen in practice (listener mounted under auth) but
    // fall through cleanly if it does
    expect(
      shouldShowScreenshotUpsell({ ...baseInputs, currentUserId: null, postOwnerId: 'bot' })
    ).toBe(true);
  });

  it('Pro overrides everything else (even own post stays silent — same outcome)', () => {
    expect(
      shouldShowScreenshotUpsell({
        ...baseInputs,
        isPro: true,
        postOwnerId: 'me',
        currentUserId: 'me',
      })
    ).toBe(false);
  });
});

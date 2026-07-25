/**
 * Unit tests for isAlwaysPushType (_shared/notify.ts).
 *
 * Nightly dreams are a once-a-day PAID deliverable and must ALWAYS fire their
 * push — send-push exempts them from the three in-app "noise suppression" gates
 * (activity / viewed-since-created / seen-sibling), each of which returns 200
 * with no failure logged. Those gates silently ate nightly pushes while
 * monitoring showed zero errors (root-caused 2026-07-25). This locks the exact
 * scope of the exemption so it can't drift — a regression here means paid
 * nightly pushes could be silently suppressed again.
 */

import { isAlwaysPushType } from '@engine/notify';

describe('isAlwaysPushType', () => {
  it('exempts a nightly dream ready (explicit subtype)', () => {
    expect(isAlwaysPushType({ type: 'dream_generated', subtype: 'nightly' })).toBe(true);
  });

  it('exempts a LEGACY nightly dream ready (NULL/undefined subtype)', () => {
    // Pre-migration-398 rows have a NULL subtype but are still nightly — they
    // must be treated as always-push, never as manual.
    expect(isAlwaysPushType({ type: 'dream_generated', subtype: null })).toBe(true);
    expect(isAlwaysPushType({ type: 'dream_generated', subtype: undefined })).toBe(true);
  });

  it('exempts a nightly dream failure (goodwill-sparkle notice)', () => {
    expect(isAlwaysPushType({ type: 'dream_failed', subtype: 'nightly_failed' })).toBe(true);
  });

  it('does NOT exempt a manual (Create-flow, queued-and-left) dream — the dock covers it', () => {
    expect(isAlwaysPushType({ type: 'dream_generated', subtype: 'manual' })).toBe(false);
  });

  it('does NOT exempt a manual dream failure', () => {
    // A non-nightly failed dream keeps the gates (the retry/refund flow signals
    // it), so only nightly_failed is exempt.
    expect(isAlwaysPushType({ type: 'dream_failed', subtype: null })).toBe(false);
    expect(isAlwaysPushType({ type: 'dream_failed', subtype: 'manual' })).toBe(false);
  });

  it('does NOT exempt ordinary social notifications', () => {
    for (const type of ['post_like', 'comment', 'post_mention', 'follow_request', 'sparkle_gift']) {
      expect(isAlwaysPushType({ type, subtype: null })).toBe(false);
    }
  });

  it('does NOT exempt subscription reminders (they have their own send cadence)', () => {
    expect(isAlwaysPushType({ type: 'trial_reminder', subtype: '3day' })).toBe(false);
    expect(isAlwaysPushType({ type: 'pro_reminder', subtype: 'paid_last_night' })).toBe(false);
  });
});

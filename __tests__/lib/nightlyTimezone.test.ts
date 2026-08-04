/**
 * Unit tests for scripts/lib/nightlyTimezone.js — the decision the hourly nightly
 * cron uses to fire each user's dream during THEIR ~4am, deduped on their local day.
 *
 * Guarantees under test:
 *   1. A user is enqueued only on the tick where it's the target local hour for them.
 *   2. DST is correct (same local 4am maps to different UTC across the year).
 *   3. The idempotency dayKey is the user's LOCAL day (rolls across the date line).
 *   4. No / invalid timezone falls back to a single 08:00 UTC fire (nobody dropped).
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  nightlyDelivery,
  localParts,
  DEFAULT_TARGET_LOCAL_HOUR,
  FALLBACK_UTC_HOUR,
} = require('../../scripts/lib/nightlyTimezone');

const at = (iso: string) => new Date(iso);

describe('nightlyDelivery — local-hour firing', () => {
  it('fires for Los Angeles when it is 4am there (summer / PDT = UTC-7)', () => {
    // 2026-08-04 11:00Z → LA 04:00 PDT
    const r = nightlyDelivery('America/Los_Angeles', at('2026-08-04T11:00:00Z'));
    expect(r).toEqual({ shouldEnqueue: true, dayKey: '2026-08-04', mode: 'local' });
  });

  it('does NOT fire for Los Angeles on a non-4am tick', () => {
    // 2026-08-04 12:00Z → LA 05:00 PDT
    expect(nightlyDelivery('America/Los_Angeles', at('2026-08-04T12:00:00Z')).shouldEnqueue).toBe(
      false
    );
  });

  it('handles DST: same local 4am fires an hour later in UTC in winter (PST = UTC-8)', () => {
    // Winter: 2026-01-15 12:00Z → LA 04:00 PST (vs 11:00Z in summer)
    const winter = nightlyDelivery('America/Los_Angeles', at('2026-01-15T12:00:00Z'));
    expect(winter.shouldEnqueue).toBe(true);
    // and the summer UTC hour (11:00Z) is NOT 4am in winter
    expect(nightlyDelivery('America/Los_Angeles', at('2026-01-15T11:00:00Z')).shouldEnqueue).toBe(
      false
    );
  });

  it('fires for Tokyo (UTC+9) at its own 4am, with the local day rolled forward', () => {
    // 2026-08-04 19:00Z → Tokyo 04:00 next local day (2026-08-05)
    const r = nightlyDelivery('Asia/Tokyo', at('2026-08-04T19:00:00Z'));
    expect(r).toEqual({ shouldEnqueue: true, dayKey: '2026-08-05', mode: 'local' });
  });

  it('does not fire the same user twice: only ONE UTC hour per day hits their local 4am', () => {
    const tz = 'America/New_York';
    let hits = 0;
    for (let h = 0; h < 24; h++) {
      const iso = `2026-08-04T${String(h).padStart(2, '0')}:00:00Z`;
      if (nightlyDelivery(tz, at(iso)).shouldEnqueue) hits++;
    }
    expect(hits).toBe(1);
  });

  it('uses the target hour override', () => {
    // London BST (UTC+1) at 22:00Z = 23:00 local
    const r = nightlyDelivery('Europe/London', at('2026-08-04T22:00:00Z'), { targetLocalHour: 23 });
    expect(r.shouldEnqueue).toBe(true);
  });
});

describe('nightlyDelivery — fallback (no/invalid timezone)', () => {
  it('null timezone fires only at 08:00 UTC, keyed on the UTC day', () => {
    expect(nightlyDelivery(null, at('2026-08-04T08:00:00Z'))).toEqual({
      shouldEnqueue: true,
      dayKey: '2026-08-04',
      mode: 'fallback',
    });
    expect(nightlyDelivery(null, at('2026-08-04T07:00:00Z')).shouldEnqueue).toBe(false);
  });

  it('an invalid IANA name falls back (never throws, never drops the user)', () => {
    const r = nightlyDelivery('Not/ARealZone', at('2026-08-04T08:00:00Z'));
    expect(r.mode).toBe('fallback');
    expect(r.shouldEnqueue).toBe(true);
  });

  it('empty string is treated as no timezone', () => {
    expect(nightlyDelivery('', at('2026-08-04T08:00:00Z')).mode).toBe('fallback');
  });
});

describe('localParts', () => {
  it('returns null for an invalid zone (so callers use the fallback)', () => {
    expect(localParts('Bogus/Zone', at('2026-08-04T08:00:00Z'))).toBeNull();
  });
  it('computes 0-23 hours (no midnight "24" quirk)', () => {
    // Midnight UTC in UTC zone → hour 0
    expect(localParts('UTC', at('2026-08-04T00:00:00Z'))).toEqual({
      hour: 0,
      dayKey: '2026-08-04',
    });
  });
});

describe('constants', () => {
  it('defaults: 4am local target, 08:00 UTC fallback', () => {
    expect(DEFAULT_TARGET_LOCAL_HOUR).toBe(4);
    expect(FALLBACK_UTC_HOUR).toBe(8);
  });
});

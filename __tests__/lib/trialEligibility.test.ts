/**
 * Locks the anti-farm trial decision (TRIAL_FARMING_PREVENTION.md, Anchor A):
 * an already-trialed DEVICE gets no second free trial + no welcome bonus, a
 * fresh device gets both AND sets its bit, and any DeviceCheck failure FAILS
 * OPEN (a real new user is never blocked on an attestation gap). If someone
 * later inverts the fail-open posture or drops the bit-set, CI goes red.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { decideTrial } = require('@engine/trialEligibility');

describe('decideTrial', () => {
  it('already-trialed device: no trial, no welcome, does not touch the bit', () => {
    expect(decideTrial({ kind: 'already_trialed' })).toEqual({
      grantTrial: false,
      grantWelcome: false,
      setDeviceBit: false,
      reason: 'device_already_trialed',
    });
  });

  it('fresh device: grants trial + welcome AND sets the bit', () => {
    expect(decideTrial({ kind: 'fresh_device' })).toEqual({
      grantTrial: true,
      grantWelcome: true,
      setDeviceBit: true,
      reason: 'fresh_device',
    });
  });

  it('no token: FAILS OPEN (grants) but does NOT burn the bit', () => {
    const d = decideTrial({ kind: 'no_token' });
    expect(d.grantTrial).toBe(true);
    expect(d.grantWelcome).toBe(true);
    expect(d.setDeviceBit).toBe(false);
    expect(d.reason).toBe('fail_open_no_token');
  });

  it('apple error: FAILS OPEN but does NOT burn the bit (device can claim later)', () => {
    const d = decideTrial({ kind: 'apple_error' });
    expect(d.grantTrial).toBe(true);
    expect(d.setDeviceBit).toBe(false);
    expect(d.reason).toBe('fail_open_apple_error');
  });

  it('the bit is set ONLY on a genuine fresh-device grant', () => {
    const kinds = ['already_trialed', 'fresh_device', 'no_token', 'apple_error'] as const;
    const setters = kinds.filter((k) => decideTrial({ kind: k }).setDeviceBit);
    expect(setters).toEqual(['fresh_device']);
  });
});

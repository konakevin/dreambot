/**
 * trialEligibility — the PURE decision for whether a NEW account gets the free
 * Pro trial + 25-sparkle welcome bonus, given the device's Apple DeviceCheck
 * signal. Server-side only; the DeviceCheck bit is authoritative (stored on
 * Apple's servers, read/written via our .p8 key) so a modified client cannot
 * grant itself a fresh trial by faking a response.
 *
 * ANTI-FARM (TRIAL_FARMING_PREVENTION.md, Anchor A): a trial+bonus is keyed to
 * the ACCOUNT, so a throwaway email = a fresh trial. DeviceCheck bit0 = "this
 * physical device already consumed its free trial" — it survives app deletion,
 * account deletion, and factory reset, so the same phone can't re-farm with a
 * new email. Denial is SOFT: an already-trialed device can still use the app and
 * still subscribe; it just doesn't get a second FREE trial.
 *
 * FAIL-OPEN: a device with no token (simulator, older OS) or a transient Apple
 * error is treated as first-time — we never block a real new user on an
 * attestation gap. Flip to fail-closed only after the attested population is
 * trusted (rollout note in TRIAL_FARMING_PREVENTION.md §5).
 *
 * Pure + deterministic → fully unit-testable. No I/O, no top-level `?.`.
 */

export type DeviceTrialSignal =
  | { kind: 'no_token' } // client produced no DeviceCheck token → fail open
  | { kind: 'apple_error' } // DeviceCheck query itself failed → fail open
  | { kind: 'fresh_device' } // bit0 NOT set → first trial on this device
  | { kind: 'already_trialed' }; // bit0 set → this device already trialed

export interface TrialDecision {
  /** Stamp pro_trial_started_at (start the 14-day trial). */
  grantTrial: boolean;
  /** Grant the one-time 25-sparkle welcome bonus. */
  grantWelcome: boolean;
  /** Set DeviceCheck bit0 now — ONLY when granting a genuine fresh-device trial,
   *  so an already-trialed device stays flagged and a fail-open grant doesn't
   *  burn the bit (a real device that errored once can still claim later). */
  setDeviceBit: boolean;
  /** Stable tag for logging/metrics (watch the fail_open_* rate during rollout). */
  reason: string;
}

export function decideTrial(signal: DeviceTrialSignal): TrialDecision {
  switch (signal.kind) {
    case 'already_trialed':
      return {
        grantTrial: false,
        grantWelcome: false,
        setDeviceBit: false,
        reason: 'device_already_trialed',
      };
    case 'fresh_device':
      return { grantTrial: true, grantWelcome: true, setDeviceBit: true, reason: 'fresh_device' };
    case 'no_token':
      return {
        grantTrial: true,
        grantWelcome: true,
        setDeviceBit: false,
        reason: 'fail_open_no_token',
      };
    case 'apple_error':
      return {
        grantTrial: true,
        grantWelcome: true,
        setDeviceBit: false,
        reason: 'fail_open_apple_error',
      };
  }
}

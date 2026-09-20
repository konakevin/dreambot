/**
 * The welcome badge's trial term. Only the WORDING is in play here: `engine_config.pro_trial_days` stays in
 * days because three runtimes compute expiry from it, so weeks are derived, never stored.
 */
import { trialTerm } from '@/constants/proPlan';

describe('trialTerm', () => {
  it('says WEEKS when the configured length divides evenly', () => {
    expect(trialTerm(14)).toBe('2 WEEKS FREE');
    expect(trialTerm(7)).toBe('1 WEEK FREE');
    expect(trialTerm(21)).toBe('3 WEEKS FREE');
  });

  it('falls back to DAYS rather than rounding a lie', () => {
    // retuning the config to 10 must not advertise "1 WEEK"
    expect(trialTerm(10)).toBe('10 DAYS FREE');
    expect(trialTerm(3)).toBe('3 DAYS FREE');
    expect(trialTerm(1)).toBe('1 DAY FREE');
  });

  it('never renders a negative or fractional term', () => {
    expect(trialTerm(0)).toBe('0 DAYS FREE');
    expect(trialTerm(-5)).toBe('0 DAYS FREE');
    expect(trialTerm(13.6)).toBe('2 WEEKS FREE');
  });

  it('tracks the live config — it is a function of the value, never a hardcoded string', () => {
    for (const d of [7, 14, 28, 70]) {
      expect(trialTerm(d)).toBe(`${d / 7} WEEKS FREE`.replace('1 WEEKS', '1 WEEK'));
    }
  });
});

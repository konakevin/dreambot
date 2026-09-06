/** dualStances.ts — couple body-language variety; every stance must survive the beat validator verbatim. */
import { DUAL_STANCES, DUAL_STANCES_GEOMETRY, pickDualStance } from '@engine/dualStances';
import { validateActionBeat } from '@engine/actionSafety';

describe('DUAL_STANCES', () => {
  it('has a real spread of body language (≥ 7 same-plane stances, unique keys)', () => {
    expect(DUAL_STANCES.length).toBeGreaterThanOrEqual(7);
    expect(new Set(DUAL_STANCES.map((s) => s.key)).size).toBe(DUAL_STANCES.length);
  });
  it.each(DUAL_STANCES.map((s) => [s.key, s.text]))(
    'stance "%s" passes the couple beat validator verbatim (so an echoed stance still ships)',
    (_key, text) => expect(validateActionBeat(text as string, 2)).toEqual({ ok: true })
  );
  it('covers seated, height-contrast, walking and hands-free variety', () => {
    expect(DUAL_STANCES.some((s) => s.seated)).toBe(true);
    // geometry-changing stances are PARKED for 1.1-pro (batch 2: 4/4 degraded), never rolled
    expect(DUAL_STANCES.some((s) => s.heightContrast)).toBe(false);
    expect(DUAL_STANCES_GEOMETRY.some((s) => s.heightContrast)).toBe(true);
    expect(DUAL_STANCES_GEOMETRY.every((g) => !DUAL_STANCES.some((s) => s.key === g.key))).toBe(
      true
    );
    expect(DUAL_STANCES_GEOMETRY.some((s) => /walking/.test(s.text))).toBe(true); // parked (batch 3: 2/2 degraded)
    expect(DUAL_STANCES.some((s) => /nothing held/.test(s.text))).toBe(true);
    expect(DUAL_STANCES_GEOMETRY.some((s) => s.key === 'show_and_tell')).toBe(true); // parked: objects held up occlude faces
  });
  it('pickDualStance is uniform over the list', () => {
    expect(pickDualStance(() => 0).key).toBe(DUAL_STANCES[0].key);
    expect(pickDualStance(() => 0.999).key).toBe(DUAL_STANCES[DUAL_STANCES.length - 1].key);
  });
});

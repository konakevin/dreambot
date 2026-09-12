/** dualStances.ts — couple body-language variety; every stance must survive the beat validator verbatim. */
import {
  DUAL_STANCES,
  DUAL_STANCES_GEOMETRY,
  DUAL_STANCES_WIDE,
  pickDualStance,
} from '@engine/dualStances';
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

describe('register-owned stances (2026-09-08)', () => {
  it('pickDualStance draws from the caller list when given, and from the generic set when it is empty', () => {
    const custom = [
      { key: 'a', text: 'a' },
      { key: 'b', text: 'b' },
    ];
    expect(pickDualStance(() => 0.6, custom).key).toBe('b');
    expect(pickDualStance(() => 0, custom).key).toBe('a');
    expect(pickDualStance(() => 0, []).key).toBe(DUAL_STANCES[0].key);
  });
});

describe('DUAL_STANCES_WIDE (looks path, 2026-09-12)', () => {
  it('has at least 7 same-plane stances with unique keys, none shared with the generic set', () => {
    expect(DUAL_STANCES_WIDE.length).toBeGreaterThanOrEqual(7);
    expect(new Set(DUAL_STANCES_WIDE.map((s) => s.key)).size).toBe(DUAL_STANCES_WIDE.length);
    expect(DUAL_STANCES_WIDE.every((w) => !DUAL_STANCES.some((s) => s.key === w.key))).toBe(true);
    expect(DUAL_STANCES_WIDE.some((s) => s.heightContrast)).toBe(false);
  });
  it.each(DUAL_STANCES_WIDE.map((s) => [s.key, s.text]))(
    'wide stance "%s" passes the couple beat validator verbatim',
    (_key, text) => expect(validateActionBeat(text as string, 2)).toEqual({ ok: true })
  );
  it('every wide stance names the lower body or the full figure, and none the torso stances that crop the frame', () => {
    const lower = /knees|boot|feet|ankles|steps|bench|path|rail/;
    expect(DUAL_STANCES_WIDE.every((s) => lower.test(s.text))).toBe(true);
    expect(
      DUAL_STANCES_WIDE.every((s) => !/pockets|arms folded|arms crossed|perched/.test(s.text))
    ).toBe(true);
    expect(DUAL_STANCES_WIDE.some((s) => s.seated)).toBe(true);
    expect(DUAL_STANCES_WIDE.some((s) => /nothing held/.test(s.text))).toBe(true);
  });
});

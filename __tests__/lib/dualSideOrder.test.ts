/**
 * dualSideOrder — randomize which dual-cast member appears on the LEFT vs RIGHT
 * of a couple render (so "self" isn't always on the left).
 *
 * The face-swap pipeline REQUIRES a side-by-side split, but WHICH person is on
 * which side is free to vary — the gender-safe router (dualGenderRouting) pastes
 * each face onto its gender-matching body regardless of the brief's side. These
 * tests pin the three pure pieces:
 *   1. orderDualSides — the actual left/right flip.
 *   2. shouldFlipDualSide — the 50/50 gate (injectable rand for determinism).
 *   3. buildDualGenderFront — the brief's "MAN on the LEFT…" front-load follows
 *      the RESOLVED side, so a flipped render gets the flipped instruction.
 */

import { orderDualSides, shouldFlipDualSide, buildDualGenderFront } from '@engine/dualSideOrder';

describe('orderDualSides', () => {
  it('keeps [first, second] when flip=false', () => {
    expect(orderDualSides('self', 'plus_one', false)).toEqual(['self', 'plus_one']);
  });

  it('swaps to [second, first] when flip=true', () => {
    expect(orderDualSides('self', 'plus_one', true)).toEqual(['plus_one', 'self']);
  });

  it('preserves object identity (no copies)', () => {
    const a = { role: 'self' };
    const b = { role: 'plus_one' };
    const [l, r] = orderDualSides(a, b, true);
    expect(l).toBe(b);
    expect(r).toBe(a);
    expect(orderDualSides(a, b, false)[0]).toBe(a);
  });
});

describe('shouldFlipDualSide', () => {
  it('flips when rand < 0.5', () => {
    expect(shouldFlipDualSide(() => 0)).toBe(true);
    expect(shouldFlipDualSide(() => 0.49)).toBe(true);
  });

  it('does NOT flip when rand >= 0.5', () => {
    expect(shouldFlipDualSide(() => 0.5)).toBe(false);
    expect(shouldFlipDualSide(() => 0.99)).toBe(false);
  });

  it('is exactly 50/50 across a uniform 0..0.999 sweep', () => {
    let flips = 0;
    for (let n = 0; n < 1000; n++) {
      const v = n / 1000; // 0.000 .. 0.999
      if (shouldFlipDualSide(() => v)) flips++;
    }
    expect(flips).toBe(500); // exactly half of [0,1) is < 0.5
  });
});

describe('buildDualGenderFront', () => {
  it('male-left / female-right (the default order)', () => {
    expect(buildDualGenderFront('male', 'female')).toBe('MAN on the LEFT, WOMAN on the RIGHT, ');
  });

  it('female-left / male-right (the FLIPPED order → flipped instruction)', () => {
    expect(buildDualGenderFront('female', 'male')).toBe('WOMAN on the LEFT, MAN on the RIGHT, ');
  });

  it('same-sex couples read correctly', () => {
    expect(buildDualGenderFront('male', 'male')).toBe('MAN on the LEFT, MAN on the RIGHT, ');
    expect(buildDualGenderFront('female', 'female')).toBe(
      'WOMAN on the LEFT, WOMAN on the RIGHT, '
    );
  });

  it('returns empty when EITHER gender is unknown (no front-load, no guess)', () => {
    expect(buildDualGenderFront(null, 'female')).toBe('');
    expect(buildDualGenderFront('male', undefined)).toBe('');
    expect(buildDualGenderFront(null, null)).toBe('');
  });
});

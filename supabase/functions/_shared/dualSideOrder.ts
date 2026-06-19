/**
 * dualSideOrder — pure helpers for randomizing which dual-cast member appears on
 * the LEFT vs RIGHT of a couple render.
 *
 * The face-swap pipeline crops the frame in half and swaps each side, so the
 * composition MUST be side-by-side — but WHICH person is on which side is free to
 * vary. Historically `cast[0]` (self) was hard-pinned to the LEFT in the brief, so
 * the same person was always on the same side. Flipping the cast order ~50% of the
 * time fixes that. It's safe: the gender-safe router (dualGenderRouting) pastes
 * each face onto its gender-matching body based on the DETECTED render, so it
 * follows whichever side Sonnet actually placed each person.
 *
 * Pure (no I/O, no Deno URL imports) so it's unit-tested in the fast jest lane.
 */

export type DualGender = 'male' | 'female' | null | undefined;

/**
 * Order a dual-cast pair into `[left, right]`. `flip=true` puts the SECOND member
 * on the left. Identity-preserving (returns the same references).
 */
export function orderDualSides<T>(first: T, second: T, flip: boolean): [T, T] {
  return flip ? [second, first] : [first, second];
}

/**
 * 50/50 decision to flip the dual sides. `rand` is injectable so tests are
 * deterministic; defaults to `Math.random`.
 */
export function shouldFlipDualSide(rand: () => number = Math.random): boolean {
  return rand() < 0.5;
}

/**
 * The "MAN on the LEFT, WOMAN on the RIGHT, " front-load string for the dual
 * brief, built from the RESOLVED left/right genders — so a flipped render gets
 * the flipped instruction. Returns '' when either gender is unknown (never guess
 * a side for an unconfirmed gender).
 */
export function buildDualGenderFront(leftGender: DualGender, rightGender: DualGender): string {
  if (!leftGender || !rightGender) return '';
  const word = (g: DualGender) => (g === 'male' ? 'MAN' : 'WOMAN');
  return `${word(leftGender)} on the LEFT, ${word(rightGender)} on the RIGHT, `;
}

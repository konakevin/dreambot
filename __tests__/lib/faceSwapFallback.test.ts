/**
 * Face-swap model chain ordering.
 *
 * Primary as of 2026-05-30: cdingram. Reverted from yan-ops because
 * yan-ops's "canned-output" bug fired in generate-dream (which had no
 * dup-detect defense) and Kevin's hearted Create dreams collapsed to
 * one identical render. See faceSwap.ts header comment + commit
 * f5a91a49 ("Revert face-swap primary back to cdingram").
 *
 * skipPrimary still exists for the dup-detect retry in nightly-dreams —
 * drops whatever is currently primary (cdingram now) and runs the
 * fallback chain (yan-ops → pikachupichu25). yan-ops kept in the fallback
 * chain so a cold cdingram still has an escape hatch.
 *
 * These tests pin the model-selection logic (faceSwapAttemptOrder). The
 * actual Replicate calls + the skipPrimary threading through dualFaceSwap
 * are covered by deno check (types) + the live API validation.
 */

import { faceSwapAttemptOrder } from '@engine/faceSwap';

describe('faceSwapAttemptOrder — normal chain', () => {
  it('tries cdingram primary first, then yan-ops, then pikachupichu25', () => {
    expect(faceSwapAttemptOrder(false)).toEqual(['cdingram', 'yan-ops', 'pikachupichu25']);
  });

  it('defaults to the full chain when called with no argument', () => {
    expect(faceSwapAttemptOrder()).toEqual(['cdingram', 'yan-ops', 'pikachupichu25']);
    expect(faceSwapAttemptOrder()[0]).toBe('cdingram');
  });
});

describe('faceSwapAttemptOrder — skipPrimary (dup-retry escape)', () => {
  it('drops the cdingram primary entirely', () => {
    expect(faceSwapAttemptOrder(true)).not.toContain('cdingram');
  });

  it('runs yan-ops then pikachupichu25, in that order', () => {
    expect(faceSwapAttemptOrder(true)).toEqual(['yan-ops', 'pikachupichu25']);
  });

  it('still provides two fallback options (so one cold/failing model has a backup)', () => {
    expect(faceSwapAttemptOrder(true)).toHaveLength(2);
  });
});

/**
 * Face-swap dup-retry fallback chain.
 *
 * The yan-ops primary has a "canned-output" bug: it intermittently ignores the
 * target and returns a hardcoded scene with the face swapped on. Re-running
 * yan-ops returns the SAME canned scene, so the dup-detect retry can't escape
 * it. The fix: on a detected duplicate, retry with skipPrimary — which drops
 * yan-ops and runs the fallback models (cdingram → pikachupichu25) instead.
 *
 * These tests pin the model-selection logic (faceSwapAttemptOrder). The actual
 * Replicate calls + the skipPrimary threading through dualFaceSwap are covered
 * by deno check (types) + the live API validation.
 */

import { faceSwapAttemptOrder } from '@engine/faceSwap';

describe('faceSwapAttemptOrder — normal chain', () => {
  it('tries the yan-ops primary first, then both fallbacks in order', () => {
    expect(faceSwapAttemptOrder(false)).toEqual(['yan-ops', 'cdingram', 'pikachupichu25']);
  });

  it('defaults to the full chain when called with no argument', () => {
    expect(faceSwapAttemptOrder()).toEqual(['yan-ops', 'cdingram', 'pikachupichu25']);
    expect(faceSwapAttemptOrder()[0]).toBe('yan-ops');
  });
});

describe('faceSwapAttemptOrder — skipPrimary (dup-retry escape)', () => {
  it('drops the yan-ops primary entirely', () => {
    expect(faceSwapAttemptOrder(true)).not.toContain('yan-ops');
  });

  it('runs cdingram then pikachupichu25, in that order', () => {
    expect(faceSwapAttemptOrder(true)).toEqual(['cdingram', 'pikachupichu25']);
  });

  it('still provides two fallback options (so one cold/failing model has a backup)', () => {
    expect(faceSwapAttemptOrder(true)).toHaveLength(2);
  });
});

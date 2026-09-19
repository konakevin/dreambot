import { isDeterministicNoFace } from '@engine/faceSwapNoFace';

describe('isDeterministicNoFace', () => {
  it('every provider said no_face → deterministic (stop retrying the identical chain)', () => {
    expect(
      isDeterministicNoFace(
        'Face swap empty output (pikachupichu25: no face found) [providers: cdingram:no_face → yan-ops:no_face → pikachupichu25:no_face]'
      )
    ).toBe(true);
  });
  it('a timeout or platform error anywhere in the chain is NOT deterministic (a retry may succeed)', () => {
    expect(
      isDeterministicNoFace(
        'Face swap timed out [providers: cdingram:no_face → yan-ops:timeout → pikachupichu25:no_face]'
      )
    ).toBe(false);
    expect(isDeterministicNoFace('Replicate 503 [providers: cdingram:err → yan-ops:no_face]')).toBe(
      false
    );
  });
  it('a lone provider with no breadcrumb still counts by its message', () => {
    expect(isDeterministicNoFace('Face swap empty output (cdingram: no face found)')).toBe(true);
    expect(isDeterministicNoFace('Face swap deadline exceeded (cdingram)')).toBe(false);
  });
  it('is false for nothing', () => {
    expect(isDeterministicNoFace(null)).toBe(false);
    expect(isDeterministicNoFace('')).toBe(false);
  });
});

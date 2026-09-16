/**
 * The onboarding first-dream loader's copy.
 *
 * Two failure modes this guards, both of which read as "broken" to a first-time
 * user: a single ~60s render showing one fixed sentence, and a full cascade (dual →
 * self → self_retry → scene, four renders back to back) showing that SAME sentence
 * for minutes. Kevin hit the first one; the second is worse and invisible until it
 * happens to a real user.
 */
import {
  firstDreamSubtext,
  FIRST_DREAM_OPENER,
  FALLBACK_RETRY,
  FALLBACK_CLOSER,
  FALLBACK_SCENE,
} from '@/lib/firstDreamLoadingCopy';

const pooled = { early: 'EARLY', render: 'RENDER', faceSwap: 'SWAP' };
const at = (tierIndex: number, tierName: string | null, stage: string | null = null) =>
  firstDreamSubtext({ status: 'in_progress', stage, tierIndex, tierName }, pooled);

describe('the opening line', () => {
  it('greets on the very first tier', () => {
    expect(at(0, 'dual')).toBe(FIRST_DREAM_OPENER);
  });

  it('still greets a cast-less user whose FIRST tier is the scene', () => {
    // 'scene' at index 0 is what someone with no cast photos gets straight away.
    // Telling them we are "setting the scene" INSTEAD would announce a retreat
    // that never happened.
    expect(at(0, 'scene')).toBe(FIRST_DREAM_OPENER);
  });
});

describe('falling back through the cascade', () => {
  it('first fallback reads as another attempt, not a failure', () => {
    expect(at(1, 'self')).toBe(FALLBACK_RETRY);
  });

  it('later fallbacks imply progress', () => {
    expect(at(2, 'self_retry')).toBe(FALLBACK_CLOSER);
  });

  it('landing on the scene tier says so', () => {
    expect(at(3, 'scene')).toBe(FALLBACK_SCENE);
  });

  it('a short cascade (no +1) still reads right', () => {
    // self / self_retry / scene — the scene tier is index 2 here, not 3.
    expect(at(1, 'self_retry')).toBe(FALLBACK_RETRY);
    expect(at(2, 'scene')).toBe(FALLBACK_SCENE);
  });

  it('never blames the user or admits a failure', () => {
    const lines = [FIRST_DREAM_OPENER, FALLBACK_RETRY, FALLBACK_CLOSER, FALLBACK_SCENE];
    for (const l of lines) {
      expect(l.toLowerCase()).not.toMatch(/fail|error|sorry|problem|couldn|unable|wrong|bad/);
    }
  });
});

describe('movement WITHIN one render', () => {
  it('hands over to the render pool once pixels start', () => {
    expect(at(0, 'dual', 'flux_render')).toBe('RENDER');
  });

  it('uses the face-swap pool while casting the user in', () => {
    expect(at(0, 'dual', 'face_swap')).toBe('SWAP');
  });

  it('a fallback tier gets the SAME movement after its opening line', () => {
    // The fallback line explains the restart; it must not then freeze for another
    // 60 seconds, which is the exact bug being fixed.
    expect(at(2, 'self_retry', 'flux_render')).toBe('RENDER');
    expect(at(2, 'self_retry', 'face_swap')).toBe('SWAP');
  });

  it('treats claimed/resolve as still opening', () => {
    expect(at(1, 'self', 'claimed')).toBe(FALLBACK_RETRY);
    expect(at(1, 'self', 'resolve')).toBe(FALLBACK_RETRY);
  });
});

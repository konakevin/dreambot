/**
 * Tests for classifyDreamWeight — the per-weight concurrency-cap classifier used
 * by enqueue-dream. HEAVY = face-swap-likely (Fly.io dual-swap service, bounded);
 * LIGHT = plain text + restyle (no swap, wide cap). Bias to HEAVY when unsure.
 */

import { classifyDreamWeight } from '@engine/dreamQueueWeight';
import { DEFAULT_RELATIONSHIP_WORDS, DEFAULT_PET_WORDS } from '@engine/selfInsertDetector';

const CFG = {
  relationshipWords: DEFAULT_RELATIONSHIP_WORDS,
  petWords: DEFAULT_PET_WORDS,
  selfRefRegex: null,
};
const castOf = (n: number) => ({
  vibe_profile: { dream_cast: Array.from({ length: n }, () => ({})) },
});

describe('classifyDreamWeight', () => {
  it('photo for a NEW scene = heavy (face swap)', () => {
    expect(
      classifyDreamWeight(
        { input_image: 'data:image/jpeg;base64,x', photo_style: 'new_scene' },
        CFG
      )
    ).toBe('heavy');
    expect(
      classifyDreamWeight(
        { input_image: 'data:image/jpeg;base64,x', photo_style: 'reimagine' },
        CFG
      )
    ).toBe('heavy');
  });

  it('photo restyle = light (Kontext, no swap)', () => {
    expect(
      classifyDreamWeight({ input_image: 'data:image/jpeg;base64,x', photo_style: 'restyle' }, CFG)
    ).toBe('light');
  });

  it('forced cast role = heavy', () => {
    expect(classifyDreamWeight({ force_cast_role: 'self' }, CFG)).toBe('heavy');
    expect(classifyDreamWeight({ force_cast_role: 'plus_one', hint: 'a quiet meadow' }, CFG)).toBe(
      'heavy'
    );
  });

  it('self-referential prompt WITH a cast = heavy', () => {
    expect(classifyDreamWeight({ ...castOf(1), hint: 'put me in the rain' }, CFG)).toBe('heavy');
  });

  it('cast present + empty hint = heavy (will pull the user in)', () => {
    expect(classifyDreamWeight({ ...castOf(2), hint: '' }, CFG)).toBe('heavy');
    expect(classifyDreamWeight(castOf(1), CFG)).toBe('heavy'); // no hint at all
  });

  it('self-referential prompt WITHOUT a cast = light (no one to swap in)', () => {
    expect(classifyDreamWeight({ hint: 'put me in the rain' }, CFG)).toBe('light');
  });

  it('plain text scene = light', () => {
    expect(classifyDreamWeight({ hint: 'a serene mountain lake at dawn' }, CFG)).toBe('light');
  });

  it('cast present but a NON-self descriptive prompt = light', () => {
    expect(
      classifyDreamWeight({ ...castOf(1), hint: 'a dragon soaring over a volcano' }, CFG)
    ).toBe('light');
  });
});

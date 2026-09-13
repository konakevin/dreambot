/** wardrobeSides.ts — the dual swap's second signal: pure prompt / parser / mapping helpers (2026-09-12). */
import {
  buildWardrobeSidesPrompt,
  parseWardrobeSidesReply,
  sidesToGenders,
  outfitForProbe,
  asGender,
  sideCheckModeOf,
} from '@engine/wardrobeSides';

describe('parseWardrobeSidesReply', () => {
  it.each([
    ['LEFT|RIGHT', 'left'],
    ['RIGHT|LEFT', 'right'],
    [' left | right ', 'left'],
    ['Left|Right.', 'left'],
  ])('"%s" → %s', (raw, want) => expect(parseWardrobeSidesReply(raw)).toBe(want));
  it.each([
    ['UNSURE|UNSURE'],
    ['LEFT|UNSURE'],
    ['LEFT|LEFT'],
    ['RIGHT|RIGHT'],
    ['LEFT'],
    [''],
    ['LEFT or RIGHT|RIGHT'],
    ['I need to analyze the outfits described and match them to the people in the image.'],
  ])('"%s" → null (unsure, same side, a refusal, or not two clean fields)', (raw) =>
    expect(parseWardrobeSidesReply(raw)).toBeNull()
  );
});

describe('buildWardrobeSidesPrompt + outfitForProbe', () => {
  it('is a closed-set, justification-free probe that names both outfits', () => {
    const p = buildWardrobeSidesPrompt(
      'a burnt-orange quarter-zip pullover',
      'a sage-green track jacket'
    );
    expect(p).toContain('Outfit A: a burnt-orange quarter-zip pullover.');
    expect(p).toContain('Outfit B: a sage-green track jacket.');
    expect(p).toMatch(/LEFT, RIGHT or UNSURE/);
    expect(p).not.toMatch(/because|explain|why/i);
  });
  it('outfitForProbe strips newlines, quotes and pipes and caps at 140 chars', () => {
    const o = outfitForProbe('a "long"\ncoat | with ' + 'x'.repeat(200));
    expect(o.length).toBeLessThanOrEqual(140);
    expect(o).not.toMatch(/[|"\n]/);
    expect(o.startsWith('a long coat with')).toBe(true);
  });
});

describe('sidesToGenders / asGender / sideCheckModeOf', () => {
  it('maps Outfit A (the prompt-LEFT cast member) on the LEFT to the cast order, on the RIGHT to the flipped order', () => {
    expect(sidesToGenders('left', 'male', 'female')).toEqual({ left: 'male', right: 'female' });
    expect(sidesToGenders('right', 'male', 'female')).toEqual({ left: 'female', right: 'male' });
  });
  it('asGender narrows; sideCheckModeOf never yields enforce by accident', () => {
    expect(asGender('male')).toBe('male');
    expect(asGender('woman')).toBeNull();
    expect(asGender(null)).toBeNull();
    expect(sideCheckModeOf('enforce')).toBe('enforce');
    expect(sideCheckModeOf('shadow')).toBe('shadow');
    expect(sideCheckModeOf('on')).toBe('off');
    expect(sideCheckModeOf(undefined)).toBe('off');
  });
});

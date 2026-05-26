/**
 * dualGenderRouting — the fix for the dual face-swap gender swap. Verifies that
 * sources are routed by GENDER (not position), so a Flux left/right flip on a
 * mixed-gender couple can't put a face on the wrong-gender body — while
 * same-sex / unknown pairs skip the (costly) vision call entirely, and any
 * classifier failure falls back to positional without breaking the render.
 */

// Mock the Haiku vision call so we control the rendered-image classification.
jest.mock('@engine/vision', () => ({
  classifyDualGenders: jest.fn(),
}));

import { classifyDualGenders } from '@engine/vision';
import { routeDualSwapByGender, genderFromLock } from '@engine/dualGenderRouting';

const mockClassify = classifyDualGenders as jest.Mock;

const MALE = { sourceUrl: 'https://img/kevin.jpg', gender: 'male' as const };
const FEMALE = { sourceUrl: 'https://img/wife.jpg', gender: 'female' as const };
const TOKEN = 'tok';

beforeEach(() => mockClassify.mockReset());

describe('genderFromLock', () => {
  it('reads MALE / FEMALE from the castResolver lock sentences', () => {
    expect(genderFromLock('MALE character. Masculine features...')).toBe('male');
    expect(genderFromLock('FEMALE character. Feminine features...')).toBe('female');
  });
  it('checks FEMALE before MALE (FEMALE contains the substring MALE)', () => {
    expect(genderFromLock('FEMALE character.')).toBe('female');
  });
  it('returns null for missing / unrecognized locks', () => {
    expect(genderFromLock(null)).toBeNull();
    expect(genderFromLock(undefined)).toBeNull();
    expect(genderFromLock('a person')).toBeNull();
  });
});

describe('routeDualSwapByGender — same-sex / unknown (no vision call)', () => {
  it('keeps positional for two males and never calls the classifier', async () => {
    const r = await routeDualSwapByGender(MALE, { ...MALE, sourceUrl: 'b' }, 'render', TOKEN);
    expect(r.routing).toBe('positional-samesex');
    expect(r.leftSource).toBe(MALE.sourceUrl);
    expect(r.rightSource).toBe('b');
    expect(mockClassify).not.toHaveBeenCalled();
  });

  it('keeps positional when a gender is unknown', async () => {
    const r = await routeDualSwapByGender(MALE, { sourceUrl: 'b', gender: null }, 'render', TOKEN);
    expect(r.routing).toBe('positional-samesex');
    expect(mockClassify).not.toHaveBeenCalled();
  });
});

describe('routeDualSwapByGender — mixed gender (classifies + routes)', () => {
  it('keeps positional when Flux honored the prompt order', async () => {
    // a = intended LEFT = male; render shows male on the left → confirmed.
    mockClassify.mockResolvedValue({ left: 'male', right: 'female' });
    const r = await routeDualSwapByGender(MALE, FEMALE, 'render', TOKEN);
    expect(r.routing).toBe('confirmed');
    expect(r.leftSource).toBe(MALE.sourceUrl);
    expect(r.rightSource).toBe(FEMALE.sourceUrl);
  });

  it('SWAPS sources when Flux flipped L/R (the gender-swap fix)', async () => {
    // a = intended LEFT = male, but the render put the FEMALE on the left.
    // The male face must go to the right (male) body; female to the left.
    mockClassify.mockResolvedValue({ left: 'female', right: 'male' });
    const r = await routeDualSwapByGender(MALE, FEMALE, 'render', TOKEN);
    expect(r.routing).toBe('corrected-flip');
    expect(r.leftSource).toBe(FEMALE.sourceUrl); // female face on the (left) female body
    expect(r.rightSource).toBe(MALE.sourceUrl); // male face on the (right) male body
  });

  it('infers the left from the right when only the right reads', async () => {
    mockClassify.mockResolvedValue({ left: null, right: 'male' });
    const r = await routeDualSwapByGender(MALE, FEMALE, 'render', TOKEN);
    // right=male → left body is female → female source left.
    expect(r.routing).toBe('corrected-flip');
    expect(r.leftSource).toBe(FEMALE.sourceUrl);
  });

  it('falls back to positional (unread) when the classifier reads nothing', async () => {
    mockClassify.mockResolvedValue({ left: null, right: null });
    const r = await routeDualSwapByGender(MALE, FEMALE, 'render', TOKEN);
    expect(r.routing).toBe('unread');
    expect(r.leftSource).toBe(MALE.sourceUrl);
    expect(r.rightSource).toBe(FEMALE.sourceUrl);
  });

  it('fails safe to positional when the vision call throws', async () => {
    mockClassify.mockRejectedValue(new Error('vision down'));
    const r = await routeDualSwapByGender(MALE, FEMALE, 'render', TOKEN);
    expect(r.routing).toBe('classify-failed');
    expect(r.leftSource).toBe(MALE.sourceUrl);
    expect(r.rightSource).toBe(FEMALE.sourceUrl);
  });
});

/**
 * dualGenderRouting — the GUARANTEE that a dual face-swap never pastes a face
 * onto the wrong-gender body (Kevin 2026-06-16: "impossible to fuck up …
 * correct gender 100% of the time").
 *
 * The invariant under test: a cast face is placed on a body ONLY when that
 * body's gender is confirmed to match. Anything we can't confirm — clustered
 * couple read as one face, unreadable genders, a same-gender-collision render,
 * or a vision error — returns mode:'single' with a gender-SAFE source, so the
 * caller degrades (re-render / cascade / single swap) instead of risking a
 * wrong-gender or both-faces-on-one-person paste.
 */

// Mock the vision call so we control what the rendered image "reads" as.
jest.mock('@engine/vision', () => ({
  classifyDualGenders: jest.fn(),
}));

import { classifyDualGenders } from '@engine/vision';
import { routeDualSwapByGender, genderFromLock } from '@engine/dualGenderRouting';

const mockClassify = classifyDualGenders as jest.Mock;

const MALE = { sourceUrl: 'https://img/kevin.jpg', gender: 'male' as const, role: 'plus_one' };
const FEMALE = { sourceUrl: 'https://img/wife.jpg', gender: 'female' as const, role: 'self' };
const TOKEN = 'tok';

// Helper: build the enriched classifier return.
const read = (
  left: 'male' | 'female' | null,
  right: 'male' | 'female' | null,
  twoDistinctFaces: boolean,
  faceCount: number | null = twoDistinctFaces ? 2 : 1
) => ({ left, right, faceCount, twoDistinctFaces });

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

describe('routeDualSwapByGender — mixed gender, two distinct faces → confirmed dual', () => {
  it('keeps positional when the render honored the prompt order', async () => {
    // a = intended LEFT = female(self); render shows female on the left → confirmed.
    mockClassify.mockResolvedValue(read('female', 'male', true));
    const r = await routeDualSwapByGender(FEMALE, MALE, 'render', TOKEN);
    expect(r.mode).toBe('dual');
    expect(r.routing).toBe('dual-confirmed');
    expect(r.leftSource).toBe(FEMALE.sourceUrl); // female face on the female body
    expect(r.rightSource).toBe(MALE.sourceUrl); // male face on the male body
  });

  it('SWAPS sources when the render flipped L/R (the core gender-swap fix)', async () => {
    // a = intended LEFT = female, but the render put the MALE on the left.
    mockClassify.mockResolvedValue(read('male', 'female', true));
    const r = await routeDualSwapByGender(FEMALE, MALE, 'render', TOKEN);
    expect(r.mode).toBe('dual');
    expect(r.routing).toBe('dual-corrected-flip');
    expect(r.leftSource).toBe(MALE.sourceUrl); // male face on the (left) male body
    expect(r.rightSource).toBe(FEMALE.sourceUrl); // female face on the (right) female body
  });
});

describe('routeDualSwapByGender — UNCONFIRMED → never dual, gender-safe single', () => {
  it('collision (render made TWO same-gender bodies) → single-swap the MATCHING gender, not a wrong paste', async () => {
    // Mixed cast (self=F, +1=M) but the render produced two MALE bodies. There
    // is no female body → paste ONLY the male cast member (gender-correct).
    mockClassify.mockResolvedValue(read('male', 'male', true));
    const r = await routeDualSwapByGender(FEMALE, MALE, 'render', TOKEN);
    expect(r.mode).toBe('single');
    expect(r.routing).toBe('single-collision-male');
    expect(r.singleSource).toBe(MALE.sourceUrl); // the male body gets the male face
    expect(r.genderMatched).toBe(true);
  });

  it('clustered couple read as ONE face → single, never the 55/55 both-on-one paste', async () => {
    // Only one face is clearly visible (the dominant, central man). twoDistinctFaces=false.
    mockClassify.mockResolvedValue(read('male', null, false, 1));
    const r = await routeDualSwapByGender(FEMALE, MALE, 'render', TOKEN);
    expect(r.mode).toBe('single');
    expect(r.routing).toBe('single-one-face-male');
    expect(r.singleSource).toBe(MALE.sourceUrl); // the visible male body gets the male face
    expect(r.genderMatched).toBe(true);
  });

  it('mixed cast but genders unreadable → single self, NOT a blind positional dual', async () => {
    mockClassify.mockResolvedValue(read(null, null, false, null));
    const r = await routeDualSwapByGender(FEMALE, MALE, 'render', TOKEN);
    expect(r.mode).toBe('single');
    expect(r.genderMatched).toBe(false);
    expect(r.singleSource).toBe(FEMALE.sourceUrl); // self (role:'self') is the safe default
  });

  it('TWO faces but only one side reads → single self (NOT a gender-matched single onto the unread face)', async () => {
    // faceCount=2 (two people present) but the right side is unreadable. A single
    // swap targets the dominant face, which could be the unread (maybe female)
    // one → we must NOT claim a male match. Degrade to self; caller cascades.
    mockClassify.mockResolvedValue(read('male', null, false, 2));
    const r = await routeDualSwapByGender(FEMALE, MALE, 'render', TOKEN);
    expect(r.mode).toBe('single');
    expect(r.genderMatched).toBe(false); // honest: we can't guarantee the target face
    expect(r.singleSource).toBe(FEMALE.sourceUrl); // self
  });

  it('vision throws → single self, never a blind dual', async () => {
    mockClassify.mockRejectedValue(new Error('vision down'));
    const r = await routeDualSwapByGender(FEMALE, MALE, 'render', TOKEN);
    expect(r.mode).toBe('single');
    expect(r.routing).toBe('single-classify-error');
    expect(r.singleSource).toBe(FEMALE.sourceUrl); // self
  });
});

describe('routeDualSwapByGender — same-sex cast (gender cannot be wrong)', () => {
  it('two males, two distinct faces → positional dual (no gender risk)', async () => {
    const MALE_B = { sourceUrl: 'https://img/bro.jpg', gender: 'male' as const, role: 'plus_one' };
    mockClassify.mockResolvedValue(read('male', 'male', true));
    const r = await routeDualSwapByGender(MALE, MALE_B, 'render', TOKEN);
    expect(r.mode).toBe('dual');
    expect(r.routing).toBe('dual-samesex-positional');
    expect(r.leftSource).toBe(MALE.sourceUrl);
    expect(r.rightSource).toBe(MALE_B.sourceUrl);
  });

  it('same-sex but clustered into one face → single (avoids both-on-one)', async () => {
    const MALE_B = { sourceUrl: 'https://img/bro.jpg', gender: 'male' as const, role: 'plus_one' };
    mockClassify.mockResolvedValue(read('male', null, false, 1));
    const r = await routeDualSwapByGender(MALE, MALE_B, 'render', TOKEN);
    expect(r.mode).toBe('single');
  });
});

describe('the invariant — a confirmed dual ALWAYS matches gender side', () => {
  it('male source is on the male-read side in every dual outcome', async () => {
    for (const layout of [read('male', 'female', true), read('female', 'male', true)]) {
      mockClassify.mockResolvedValue(layout);
      const r = await routeDualSwapByGender(FEMALE, MALE, 'render', TOKEN);
      expect(r.mode).toBe('dual');
      // The male face goes wherever the male body was read.
      const maleOnLeft = layout.left === 'male';
      expect(maleOnLeft ? r.leftSource : r.rightSource).toBe(MALE.sourceUrl);
      expect(maleOnLeft ? r.rightSource : r.leftSource).toBe(FEMALE.sourceUrl);
    }
  });
});

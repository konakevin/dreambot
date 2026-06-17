/**
 * Face-swap gender lock — end-to-end-ish unit coverage of the unification fix.
 *
 * The bug: a male cast photo rendered onto a FEMALE body on nightly single-cast
 * dreams, because (a) the explicit gender was dropped before the slot pipeline
 * and (b) the single-cast prompt had no shouted gender lock (only dual did).
 *
 * These tests prove the fix at the two builders:
 *   1. castResolver (create flow) — explicit gender → strong, positive lock.
 *   2. characterSlotPrompt (nightly slot pipeline) — explicit gender beats
 *      adversarial prose AND the single-cast prompt now SHOUTS the gender lock.
 */

// characterSlotPrompt imports ./llm.ts (network). Mock it so the module loads.
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import { resolveCastForPrompt } from '@engine/castResolver';
import { resolveIdentity, assembleCharacterPrompt } from '@engine/characterSlotPrompt';

// ── castResolver (create flow) ─────────────────────────────────────────────
describe('castResolver.resolveCastForPrompt — gender lock', () => {
  const base = { thumb_url: 'https://img/x.jpg', description: 'some description with a person' };

  it('explicit male → MALE gender lock + gender field', () => {
    const [r] = resolveCastForPrompt([{ role: 'self', gender: 'male', ...base }], {
      characterRenderMode: 'natural',
      key: 'storybook',
    });
    expect(r.gender).toBe('male');
    expect(r.genderLock).toMatch(/^MALE character/);
  });

  it('explicit female → FEMALE gender lock + gender field', () => {
    const [r] = resolveCastForPrompt([{ role: 'plus_one', gender: 'female', ...base }], {
      characterRenderMode: 'natural',
      key: 'storybook',
    });
    expect(r.gender).toBe('female');
    expect(r.genderLock).toMatch(/^FEMALE character/);
  });

  it('explicit male wins over female prose (the bug case)', () => {
    const [r] = resolveCastForPrompt(
      [
        {
          role: 'self',
          gender: 'male',
          thumb_url: 'https://img/x.jpg',
          description: 'a lovely woman in a dress',
        },
      ],
      { characterRenderMode: 'natural', key: 'watercolor' }
    );
    expect(r.gender).toBe('male');
    expect(r.genderLock).toMatch(/^MALE character/);
  });

  it('pet → no gender lock', () => {
    const [r] = resolveCastForPrompt(
      [{ role: 'pet', thumb_url: 'https://img/dog.jpg', description: 'a golden retriever' }],
      { characterRenderMode: 'natural', key: 'storybook' }
    );
    expect(r.gender).toBeNull();
    expect(r.genderLock).toBeNull();
  });

  it('the lock dropped the leaky "do not feminize" phrasing', () => {
    const [r] = resolveCastForPrompt([{ role: 'self', gender: 'male', ...base }], {
      characterRenderMode: 'natural',
      key: 'storybook',
    });
    expect((r.genderLock ?? '').toLowerCase()).not.toContain('feminize');
  });
});

// ── characterSlotPrompt (nightly slot pipeline) ─────────────────────────────
describe('characterSlotPrompt.resolveIdentity — explicit gender authority', () => {
  it('explicit male beats adversarial "woman" prose', () => {
    const id = resolveIdentity({
      role: 'self',
      promptDesc: 'a woman with long flowing hair in a floral dress',
      gender: 'male',
    });
    expect(id.castGender).toBe('male');
    expect(id.gender).toBe('man');
  });

  it('explicit female beats adversarial "man" prose', () => {
    const id = resolveIdentity({
      role: 'plus_one',
      promptDesc: 'a man with a full beard',
      gender: 'female',
    });
    expect(id.castGender).toBe('female');
    expect(id.gender).toBe('woman');
  });

  it('falls back to prose when no explicit gender', () => {
    const id = resolveIdentity({ role: 'self', promptDesc: 'a man in his late 30s' });
    expect(id.castGender).toBe('male');
    expect(id.gender).toBe('man');
  });
});

describe('characterSlotPrompt.assembleCharacterPrompt — single-cast shouted lock', () => {
  const singleSlots = {
    scene_description: 'a sunlit beach',
    wardrobe: 'aloha shirt',
    mood: 'peaceful',
    props: 'a flower lei',
  };
  const inputFor = (member: {
    role: string;
    promptDesc: string;
    gender?: 'male' | 'female' | null;
  }) => ({
    cast: [member],
    iconicAnchor: 'Waikiki Beach',
    userPlace: null,
    timeAxis: 'golden hour',
    weatherAxis: 'clear skies',
    phenomenaAxis: '',
    mediumFluxFragment: 'watercolor painting',
    vibeDirective: 'peaceful',
    avoidList: '',
    action: null,
  });

  it('male cast → prompt SHOUTS the male lock at the front', () => {
    const out = assembleCharacterPrompt(
      singleSlots,
      inputFor({ role: 'self', promptDesc: 'a man, 38, full beard', gender: 'male' })
    );
    expect(out).toMatch(/^a MALE man/);
    expect(out.toLowerCase()).toContain('masculine');
  });

  it('female cast → prompt SHOUTS the female lock at the front', () => {
    const out = assembleCharacterPrompt(
      singleSlots,
      inputFor({ role: 'plus_one', promptDesc: 'a woman, 38, wavy hair', gender: 'female' })
    );
    expect(out).toMatch(/^a FEMALE woman/);
  });

  it('explicit male + adversarial "woman" prose → still locks MALE (the exact failure)', () => {
    const out = assembleCharacterPrompt(
      singleSlots,
      inputFor({
        role: 'self',
        promptDesc: 'a beautiful woman in a floral sundress',
        gender: 'male',
      })
    );
    expect(out).toMatch(/^a MALE man/);
    expect(out).not.toMatch(/FEMALE woman/);
    // The identity block also reads "a man", not "a woman".
    expect(out).toContain('CHARACTER: a man');
  });
});

// ── DUAL slot-pipeline pose contract (the nightly PRIMARY path) ──────────────
// Regression guard for the per-face-composite consolidation (2026-06-16): the
// nightly slot pipeline must emit the SHARED dualSwapContract tokens + must NOT
// re-introduce the obsolete fixed-55/55-crop locks. This is the slot-pipeline
// analog of expressionRule.test.ts's coverage of the Create dual brief.
describe('characterSlotPrompt.assembleCharacterPrompt — DUAL pose contract', () => {
  const dualSlots = {
    scene_description: 'a sunlit beach',
    left_wardrobe: 'aloha shirt',
    right_wardrobe: 'a flowing sundress',
    mood: 'peaceful',
    props: 'a flower lei',
  };
  const dualInput = (over: Partial<{ cast: unknown[]; action: string | null }> = {}) => ({
    cast: [
      { role: 'self', promptDesc: 'a man, 38, full beard', gender: 'male' as const },
      { role: 'plus_one', promptDesc: 'a woman, 36, wavy hair', gender: 'female' as const },
    ],
    iconicAnchor: 'Waikiki Beach',
    userPlace: null,
    timeAxis: 'golden hour',
    weatherAxis: 'clear skies',
    phenomenaAxis: '',
    mediumFluxFragment: 'watercolor painting',
    vibeDirective: 'peaceful',
    avoidList: '',
    action: null,
    ...over,
  });

  it('emits the shared pose contract (faces visible, distinct heads, free interaction)', () => {
    const out = assembleCharacterPrompt(dualSlots, dualInput());
    expect(out).toMatch(/both faces clearly visible/i);
    expect(out).toMatch(/two distinct heads/i);
    expect(out).toMatch(/natural interaction/i);
  });

  it('DROPS the obsolete fixed-crop locks (the per-face-composite regression guard)', () => {
    const out = assembleCharacterPrompt(dualSlots, dualInput());
    expect(out).not.toMatch(/same vertical height/i);
    expect(out).not.toMatch(/heads at the same level/i);
    expect(out).not.toMatch(/side by side/i);
    expect(out).not.toMatch(/frontal couple portrait/i);
  });

  it('still SHOUTS the per-side gender lock (quality + same-sex L/R bias)', () => {
    const out = assembleCharacterPrompt(dualSlots, dualInput());
    expect(out).toMatch(/MAN on the LEFT, WOMAN on the RIGHT/);
  });

  it('the user action flows into the dual prompt unsuppressed (dynamic poses)', () => {
    const out = assembleCharacterPrompt(
      dualSlots,
      dualInput({ action: 'one giving the other a piggyback ride' })
    );
    expect(out).toMatch(/piggyback/i);
  });

  it('same-sex cast → adds the soft side-lean tiebreaker', () => {
    const out = assembleCharacterPrompt(
      dualSlots,
      dualInput({
        cast: [
          { role: 'self', promptDesc: 'a man, 38, full beard', gender: 'male' as const },
          { role: 'brother', promptDesc: 'a man, 34, short hair', gender: 'male' as const },
        ],
      })
    );
    expect(out).toMatch(/leaning slightly left/i);
    expect(out).toContain('brother');
  });

  it('mixed-gender cast → NO soft lean (per-face gender resolves identity → full freedom)', () => {
    const out = assembleCharacterPrompt(dualSlots, dualInput());
    expect(out).not.toMatch(/leaning slightly left/i);
  });
});

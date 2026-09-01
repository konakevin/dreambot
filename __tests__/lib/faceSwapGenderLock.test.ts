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
import {
  resolveIdentity,
  assembleCharacterPrompt,
  skinToneAdjective,
} from '@engine/characterSlotPrompt';

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

// ── Skin-tone race lock (michele partner race-swapped to dark, 2026-08-31) ──
// A trailing ", light peachy skin tone" descriptor was steamrolled by the
// jewel-tone illustration face-swap override; the fix attaches the tone to the
// subject noun ("a fair-skinned man") where a heavy medium prior can't drop it.
describe('characterSlotPrompt.skinToneAdjective — race lock', () => {
  it('maps describer skin vocabulary to a noun-attached tone adjective', () => {
    expect(skinToneAdjective('light peachy skin tone')).toBe('fair-skinned');
    expect(skinToneAdjective('fair peachy skin tone')).toBe('fair-skinned');
    expect(skinToneAdjective('pale porcelain skin')).toBe('fair-skinned');
    expect(skinToneAdjective('warm olive skin')).toBe('olive-skinned');
    expect(skinToneAdjective('light brown skin')).toBe('tan-skinned');
    expect(skinToneAdjective('warm brown skin')).toBe('brown-skinned');
    expect(skinToneAdjective('deep brown skin')).toBe('dark-skinned');
    expect(skinToneAdjective('rich ebony skin')).toBe('dark-skinned');
    expect(skinToneAdjective(null)).toBeNull();
    expect(skinToneAdjective('')).toBeNull();
  });

  it('locks the tone onto the subject noun in the assembled prompt', () => {
    const out = assembleCharacterPrompt(
      {
        scene_description: 'a Milanese rooftop',
        wardrobe: 'silk suit',
        mood: 'elegant',
        props: 'champagne',
      },
      {
        cast: [
          {
            role: 'self',
            promptDesc: 'a man, 64, White-blonde hair',
            physicalSummary: 'clean-shaven, White-blonde hair, light peachy skin tone, average',
            gender: 'male',
            age: 64,
          },
        ],
        iconicAnchor: 'Milan',
        userPlace: null,
        timeAxis: 'golden hour',
        weatherAxis: 'clear',
        phenomenaAxis: '',
        mediumFluxFragment: 'crisp ink illustration with jewel-tone colors',
        vibeDirective: 'elegant',
        avoidList: '',
        action: null,
      }
    );
    expect(out).toContain('fair-skinned man');
  });
});

// ── Female-only hair variation gating (nightly) ─────────────────────────────
// The hair re-styling must fire for FEMALE cast only; male hair stays static.
describe('characterSlotPrompt — female-only hair variation', () => {
  const slots = {
    scene_description: 'a rooftop',
    wardrobe: 'a gown',
    mood: 'elegant',
    props: 'champagne',
  };
  const inputFor = (gender: 'male' | 'female', hair: string) => ({
    cast: [
      {
        role: 'self',
        promptDesc: `a ${gender === 'male' ? 'man' : 'woman'}`,
        physicalSummary: hair,
        gender,
      },
    ],
    iconicAnchor: 'Milan',
    userPlace: null,
    timeAxis: 'golden hour',
    weatherAxis: 'clear',
    phenomenaAxis: '',
    mediumFluxFragment: 'editorial photo',
    vibeDirective: 'elegant',
    avoidList: '',
    action: null,
    femaleHairVariationPct: 100, // always vary (nightly path)
    sceneRegister: 'elegant' as const,
  });

  it('FEMALE cast → hair is re-styled (not the static clause)', () => {
    const out = assembleCharacterPrompt(
      slots,
      inputFor('female', 'long blonde hair, average build')
    );
    // varied → a styling verb follows the hair, so "long blonde hair, wearing" never appears
    expect(out).not.toContain('long blonde hair, wearing');
    expect(out).toMatch(/long blonde hair (worn|in|styled|swept|half-up|gathered|tucked|with)/);
  });

  it('MALE cast → hair untouched even with pct=100', () => {
    const out = assembleCharacterPrompt(slots, inputFor('male', 'short brown hair, average build'));
    expect(out).toContain('short brown hair, wearing');
  });
});

// ── Race/ethnicity anchor (RACE_FIDELITY_PLAN.md) ───────────────────────────
// The cast's broad race bucket must lead the subject noun so it beats a location
// ethnicity prior ("set in china" → local). Ethnicity WINS over a (possibly
// mis-captured) skin-tone read; null ethnicity falls back to skin tone (no regression).
describe('characterSlotPrompt — race/ethnicity anchor', () => {
  const slots = {
    scene_description: 'a Tianzifang alleyway',
    wardrobe: 'a jacket',
    mood: 'candid',
    props: 'a map',
  };
  const inputWith = (member: Record<string, unknown>) => ({
    cast: [member],
    iconicAnchor: 'Tianzifang shikumen alleyway',
    userPlace: null,
    timeAxis: 'day',
    weatherAxis: 'clear',
    phenomenaAxis: '',
    mediumFluxFragment: 'comic-book illustration',
    vibeDirective: 'candid',
    avoidList: '',
    action: null,
  });

  it('ethnicity anchor leads the subject noun and BEATS a mis-captured skin tone', () => {
    // The exact bug: white +1 the describer read as "warm medium" → rendered Asian.
    const out = assembleCharacterPrompt(
      slots,
      inputWith({
        role: 'self',
        promptDesc: 'a man',
        gender: 'male',
        physicalSummary: 'chestnut brown hair, warm medium skin tone, athletic build',
        ethnicity: 'White',
      })
    );
    expect(out).toContain('a White man');
    expect(out).not.toContain('tan-skinned man'); // tone adjective must be suppressed by the ethnicity anchor
    // ...but the full skin-tone CLAUSE is still passed alongside the race (Kevin).
    expect(out).toContain('warm medium skin tone');
  });

  it('each bucket renders its adjective on the subject noun', () => {
    const b = (eth: string) =>
      assembleCharacterPrompt(
        slots,
        inputWith({
          role: 'self',
          promptDesc: 'a woman',
          gender: 'female',
          physicalSummary: 'dark hair, medium skin tone, average build',
          ethnicity: eth,
        })
      );
    expect(b('Black')).toContain('a Black woman');
    expect(b('East Asian')).toContain('a East Asian woman');
    expect(b('South Asian')).toContain('a South Asian woman');
    expect(b('Middle Eastern')).toContain('a Middle Eastern woman');
    expect(b('Hispanic/Latino')).toContain('a Hispanic woman'); // slash + gendered term normalized
  });

  it('null ethnicity falls back to the skin-tone anchor (no regression)', () => {
    const out = assembleCharacterPrompt(
      slots,
      inputWith({
        role: 'self',
        promptDesc: 'a woman',
        gender: 'female',
        physicalSummary: 'blonde hair, fair peachy skin tone, average build',
        ethnicity: null,
      })
    );
    expect(out).toContain('a fair-skinned woman');
  });

  it('unrecognized ethnicity → no bad anchor, falls back to skin tone', () => {
    const out = assembleCharacterPrompt(
      slots,
      inputWith({
        role: 'self',
        promptDesc: 'a man',
        gender: 'male',
        physicalSummary: 'brown hair, olive skin, average build',
        ethnicity: 'Klingon',
      })
    );
    expect(out).not.toContain('a Klingon');
    expect(out).toContain('a olive-skinned man');
  });

  it('applies the anchor to BOTH people in a dual render', () => {
    const out = assembleCharacterPrompt(
      {
        scene_description: 'a Kyoto lane',
        left_wardrobe: 'a kimono',
        right_wardrobe: 'a jacket',
        mood: 'candid',
        props: 'lanterns',
      },
      {
        cast: [
          {
            role: 'self',
            promptDesc: 'a woman',
            gender: 'female',
            physicalSummary: 'braided hair, deep brown skin, average',
            ethnicity: 'Black',
          },
          {
            role: 'plus_one',
            promptDesc: 'a man',
            gender: 'male',
            physicalSummary: 'chestnut hair, warm medium skin, athletic',
            ethnicity: 'White',
          },
        ],
        iconicAnchor: 'Kyoto',
        userPlace: null,
        timeAxis: 'day',
        weatherAxis: 'clear',
        phenomenaAxis: '',
        mediumFluxFragment: 'comic-book illustration',
        vibeDirective: 'candid',
        avoidList: '',
        action: null,
      }
    );
    expect(out).toContain('a Black woman');
    expect(out).toContain('a White man');
  });
});

// ── Hair-color anchor (full character preservation, RACE_FIDELITY_PLAN.md) ──
// Hair color drifts dark under a scene/medium prior when it's only a buried
// token; restating it early on the subject holds it. Positive-only (no negations).
describe('characterSlotPrompt — hair-color anchor', () => {
  const slots = {
    scene_description: "a Xi'an city wall",
    wardrobe: 'a jacket',
    mood: 'candid',
    props: 'a map',
  };
  const inp = (m: Record<string, unknown>) => ({
    cast: [m],
    iconicAnchor: "Xi'an",
    userPlace: null,
    timeAxis: 'day',
    weatherAxis: 'clear',
    phenomenaAxis: '',
    mediumFluxFragment: 'comic-book illustration',
    vibeDirective: 'candid',
    avoidList: '',
    action: null,
  });

  it('restates the hair color early on the subject noun', () => {
    const out = assembleCharacterPrompt(
      slots,
      inp({
        role: 'self',
        promptDesc: 'a man',
        gender: 'male',
        physicalSummary: 'chestnut brown hair swept back, warm medium skin tone, athletic build',
        ethnicity: 'White',
      })
    );
    expect(out).toContain('a White man with chestnut brown hair'); // early anchor, right after race
    expect(out).toContain('warm medium skin tone'); // skin clause still present
  });

  it('black-haired cast anchors "black hair" positively (no negation leak)', () => {
    const out = assembleCharacterPrompt(
      slots,
      inp({
        role: 'self',
        promptDesc: 'a woman',
        gender: 'female',
        physicalSummary: 'black hair, fair skin, average build',
        ethnicity: 'East Asian',
      })
    );
    expect(out).toContain('with black hair');
    expect(out).not.toContain('not black');
  });

  it('no color word → no hair anchor (no crash)', () => {
    const out = assembleCharacterPrompt(
      slots,
      inp({
        role: 'self',
        promptDesc: 'a man',
        gender: 'male',
        physicalSummary: 'bald, olive skin, average build',
        ethnicity: null,
      })
    );
    expect(out).toContain('CHARACTER: a'); // still builds cleanly
    expect(out).not.toContain('with  hair');
  });
});

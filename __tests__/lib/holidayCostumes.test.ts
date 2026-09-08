/**
 * holidayCostumes.ts — the HOLIDAY COSTUME POOL + the slot pipeline's costume LOCK (Kevin 2026-09-08).
 * Locks: every attire is swap-safe (no occlusion / face / eye / pronoun words, no hair change) and passes
 * the slot validator verbatim; the roll is one pick per cast member in cast order with distinct keys and
 * the gender's variant; the lock overwrites the wardrobe slot(s) VERBATIM whatever Sonnet wrote.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import {
  HALLOWEEN_COSTUMES,
  HOLIDAY_COSTUMES,
  rollHolidayCostumes,
  costumeStamp,
} from '@engine/holidayCostumes';
import {
  validateSlots,
  applyCostumeLock,
  runCharacterSlotPipeline,
} from '@engine/characterSlotPrompt';
import type { CharacterSlotPipelineInput } from '@engine/characterSlotPrompt';
import { callSonnet } from '@engine/llm';

// Mirror of scripts/lib/holidayPoolLint.js FACE_OCCLUSION (§6.1) — the seed-side rule for attire.
const OCCLUSION =
  /\b(?:mask|masked|domino mask|face[- ]?paint(?:ed)?|facepaint|painted face|fangs?|prosthetic|veil(?:ed)?|balaclava|niqab|burqa|full[- ]face|welding helmet|sunglasses|goggles over|hood(?:ed)?\s+up|hood\s+(?:over|covering)|hood\s+drawn)\b/i;
// Identity-preserving: a costume never recolours / restyles the cast member's own hair.
const HAIR_CHANGE =
  /\b(?:blonde?|brunette|redhead|red hair|black hair|white hair|grey hair|gray hair|dyed|wig|bald|shaved head|white streak)\b/i;

const variants: Array<[string, string, string]> = [];
for (const c of HALLOWEEN_COSTUMES) {
  variants.push([c.key, 'female', c.female.attire], [c.key, 'male', c.male.attire]);
}

describe('halloween costume pool', () => {
  it('has a real spread: ≥ 24 costumes, unique keys, every vibe represented, labels on both variants', () => {
    expect(HALLOWEEN_COSTUMES.length).toBeGreaterThanOrEqual(24);
    expect(new Set(HALLOWEEN_COSTUMES.map((c) => c.key)).size).toBe(HALLOWEEN_COSTUMES.length);
    for (const v of ['fun', 'sexy', 'cool', 'scary', 'classic'] as const) {
      expect(HALLOWEEN_COSTUMES.some((c) => c.vibe === v)).toBe(true);
    }
    for (const c of HALLOWEEN_COSTUMES) {
      expect(c.female.label.length).toBeGreaterThan(2);
      expect(c.male.label.length).toBeGreaterThan(2);
    }
    expect(HOLIDAY_COSTUMES.halloween).toBe(HALLOWEEN_COSTUMES);
  });
  it.each(variants)(
    '%s (%s) attire is swap-safe and passes the slot validator verbatim',
    (_k, _g, attire) => {
      expect(OCCLUSION.test(attire)).toBe(false);
      expect(HAIR_CHANGE.test(attire)).toBe(false);
      expect(attire.split(/\s+/).length).toBeLessThanOrEqual(32);
      expect(
        validateSlots({
          scene_description: 'a lantern-lit barn',
          wardrobe: attire,
          mood: 'festive',
          props: '',
        })
      ).toEqual([]);
    }
  );
});

describe('rollHolidayCostumes', () => {
  const couple = [
    { role: 'plus_one', gender: 'female' },
    { role: 'self', gender: 'male' },
  ];
  it('one pick per cast member in cast order, distinct keys, the gender variant', () => {
    const picks = rollHolidayCostumes('halloween', couple, () => 0);
    expect(picks).not.toBeNull();
    expect(picks!.map((p) => p.role)).toEqual(['plus_one', 'self']);
    expect(picks![0].key).not.toBe(picks![1].key);
    expect(picks![0].attire).toBe(HALLOWEEN_COSTUMES[0].female.attire);
    expect(picks![0].label).toBe(HALLOWEEN_COSTUMES[0].female.label);
    // rng 0 twice: the second draw skips the used key → the next costume's MALE variant
    expect(picks![1].attire).toBe(HALLOWEEN_COSTUMES[1].male.attire);
  });
  it('forced keys pin a member (QA), unknown gender still gets a variant, unknown holiday → null', () => {
    const picks = rollHolidayCostumes('halloween', couple, () => 0, ['ghost_pirate', 'moon_witch']);
    expect(picks!.map((p) => p.key)).toEqual(['ghost_pirate', 'moon_witch']);
    expect(picks![0].attire).toBe(
      HALLOWEEN_COSTUMES.find((c) => c.key === 'ghost_pirate')!.female.attire
    );
    const solo = rollHolidayCostumes('halloween', [{ role: 'self', gender: null }], () => 0.99);
    expect(solo!.length).toBe(1);
    expect(solo![0].attire.length).toBeGreaterThan(10);
    expect(rollHolidayCostumes('arbor_day', couple)).toBeNull();
    expect(rollHolidayCostumes('halloween', [])).toBeNull();
  });
  it('costumeStamp is costume:<key>/<key> in cast order', () => {
    const picks = rollHolidayCostumes('halloween', couple, () => 0, [
      'deco_devil',
      'fallen_angel',
    ])!;
    expect(costumeStamp(picks)).toBe('costume:deco_devil/fallen_angel');
  });
});

const input = (extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
  cast: [
    {
      role: 'plus_one',
      promptDesc: 'a woman, 43, with a full head of dark brown hair',
      gender: 'female',
    },
    { role: 'self', promptDesc: 'a man, 43, with a full head of brown hair', gender: 'male' },
  ],
  iconicAnchor: 'a lantern-lit barn costume party',
  userPlace: null,
  setAtOverride: 'a lantern-lit barn costume party',
  timeAxis: 'night',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: 'a witch-hat headband',
  realWorldLocation: false,
  mediumFluxFragment: 'gouache illustration',
  vibeDirective: 'festive',
  avoidList: '',
  action: null,
  promptStyle: 'subject_first',
  ...extra,
});
const sonnetDual = {
  scene_description: 'a barn strung with orange lights, a cider cauldron on a trestle table',
  left_wardrobe: 'a cozy sweater with a witch-hat headband',
  right_wardrobe: 'a plaid flannel and jeans',
  mood: 'festive',
  props: '',
};

describe('costume lock in the slot pipeline', () => {
  it('applyCostumeLock overwrites the wardrobe slot(s) and nothing else', () => {
    const lock = ['LEFT COSTUME', 'RIGHT COSTUME'];
    expect(applyCostumeLock(sonnetDual, lock)).toEqual({
      ...sonnetDual,
      left_wardrobe: 'LEFT COSTUME',
      right_wardrobe: 'RIGHT COSTUME',
    });
    expect(
      applyCostumeLock({ scene_description: 's', wardrobe: 'w', mood: 'm', props: '' }, ['SOLO'])
    ).toEqual({ scene_description: 's', wardrobe: 'SOLO', mood: 'm', props: '' });
  });
  it('the lock lands verbatim in the prompt whatever Sonnet wrote, is briefed to Sonnet, and stamps costume_lock', async () => {
    (callSonnet as jest.Mock).mockResolvedValue({
      text: JSON.stringify(sonnetDual),
      rawResponse: '{}',
    });
    const lock = [
      HALLOWEEN_COSTUMES.find((c) => c.key === 'victorian_vampire')!.female.attire,
      HALLOWEEN_COSTUMES.find((c) => c.key === 'mad_scientist')!.male.attire,
    ];
    const r = await runCharacterSlotPipeline(input({ costumeLock: lock }), 'no-key');
    expect(r.fallbackReasons).toContain('costume_lock');
    expect('left_wardrobe' in r.slots && r.slots.left_wardrobe).toBe(lock[0]);
    expect('right_wardrobe' in r.slots && r.slots.right_wardrobe).toBe(lock[1]);
    expect(r.assembledPrompt).toContain(lock[0]);
    expect(r.assembledPrompt).toContain(lock[1]);
    expect(r.assembledPrompt).not.toContain('witch-hat headband');
    expect(r.briefUsed).toContain('HOLIDAY COSTUME LOCK');
    expect(r.briefUsed).toContain(`LEFT wears EXACTLY: "${lock[0]}"`);
  });
  it('a lock whose length does not match the cast is ignored (no stamp, Sonnet wardrobe kept)', async () => {
    (callSonnet as jest.Mock).mockResolvedValue({
      text: JSON.stringify(sonnetDual),
      rawResponse: '{}',
    });
    const r = await runCharacterSlotPipeline(input({ costumeLock: ['ONLY ONE'] }), 'no-key');
    expect(r.fallbackReasons).not.toContain('costume_lock');
    expect(r.assembledPrompt).toContain('witch-hat headband');
    expect(r.briefUsed).not.toContain('HOLIDAY COSTUME LOCK');
  });
});

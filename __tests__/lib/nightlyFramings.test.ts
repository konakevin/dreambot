/**
 * FRAMING AXIS (2026-09-12, pools/nightly_framings.ts): authored composition recipes (distance + device + camera +
 * placement) rolled on the looks path. Locks: pool hygiene (short, unique, no scene-dominance / face words), the
 * distance mapping is byte-identical to the old frame roll, the clause lands in the composer's framing line for
 * both surfaces, seated recipes drop "standing", force_framing pins a recipe, and no clause is a legacy-path change.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import { COUPLE_FRAMINGS, SOLO_FRAMINGS } from '@engine/pools/nightly_framings';
import {
  frameFields,
  fieldsForFrame,
  rollFrame,
  rollFraming,
  looksSlotInputFields,
  LOOKS_COUPLE_PROMPT_STYLE,
  LOOKS_SOLO_FRAMING_IN_ANCHOR,
  LOOKS_HAIR_ECHO,
  looksCouplePromptStyle,
  reassembleForModel,
  isFluxCoupleAlbum,
  LOOKS_FLUX_COUPLE_ALBUM_SKELETON,
} from '@engine/nightlyLooksPath';
import { assembleCharacterPrompt } from '@engine/characterSlotPrompt';
import type {
  CharacterSlotPipelineInput,
  DualSlots,
  SingleSlots,
} from '@engine/characterSlotPrompt';
import { parseQaFlags } from '@engine/nightlyQaFlags';

const BANNED =
  /\b(fills?|filling the frame|dominant|dominates|rich|layered|face|faces|eyes|smile|looking at|gazing)\b/i;

describe('nightly_framings pools', () => {
  it.each([
    ['couple', COUPLE_FRAMINGS],
    ['solo', SOLO_FRAMINGS],
  ])(
    '%s: ≥ 12 recipes, unique keys, ≤ 26 words, positive weights, no dominance / face words',
    (_s, pool) => {
      expect(pool.length).toBeGreaterThanOrEqual(12);
      expect(new Set(pool.map((r) => r.key)).size).toBe(pool.length);
      for (const r of pool) {
        expect(r.text.split(/\s+/).length).toBeLessThanOrEqual(26);
        expect(r.weight).toBeGreaterThan(0);
        expect(r.text).not.toMatch(BANNED);
      }
    }
  );
  it('covers full figure, a framing device, an off-centre placement, a low camera and a seated recipe on both surfaces', () => {
    for (const pool of [COUPLE_FRAMINGS, SOLO_FRAMINGS]) {
      expect(pool.some((r) => /full figure/.test(r.text))).toBe(true);
      expect(pool.some((r) => /archway|doorway|window|trellis|foliage/.test(r.text))).toBe(true);
      expect(
        pool.some((r) => /off centre|one third|off to one side|left of centre/.test(r.text))
      ).toBe(true);
      expect(pool.some((r) => /camera slightly low|camera low|waist height/.test(r.text))).toBe(
        true
      );
      expect(pool.some((r) => r.seated)).toBe(true);
    }
    // about a third of the couple weight is full figure (the posts' share)
    const total = COUPLE_FRAMINGS.reduce((a, r) => a + r.weight, 0);
    const full = COUPLE_FRAMINGS.filter((r) => r.distance === 'full_figure').reduce(
      (a, r) => a + r.weight,
      0
    );
    expect(full / total).toBeGreaterThanOrEqual(0.25);
    expect(full / total).toBeLessThanOrEqual(0.45);
  });
});

describe('rollFraming / frameFields', () => {
  it('rolls by weight (rng 0 → first recipe, rng ~1 → last) and pins a forced key; unknown key rolls', () => {
    expect(rollFraming('couple', () => 0).recipe.key).toBe(COUPLE_FRAMINGS[0].key);
    expect(rollFraming('couple', () => 0.9999).recipe.key).toBe(
      COUPLE_FRAMINGS[COUPLE_FRAMINGS.length - 1].key
    );
    const pinned = rollFraming('solo', () => 0, 'waist_table');
    expect(pinned).toEqual({
      recipe: SOLO_FRAMINGS.find((r) => r.key === 'waist_table'),
      forced: true,
    });
    expect(rollFraming('solo', () => 0, 'no_such').forced).toBe(false);
  });
  it('the distance mapping is the old frame roll, byte-identical', () => {
    expect(fieldsForFrame('couple', 'waist_up')).toEqual({
      wideFraming: false,
      soloComposition: null,
      dualComposition: 'waist_up',
      frameInterest: 'close',
      frameStamp: 'frame:couple:waist_up',
    });
    expect(fieldsForFrame('couple', 'full_figure')).toMatchObject({
      wideFraming: true,
      dualComposition: 'full_figure',
      frameInterest: 'wide',
    });
    expect(fieldsForFrame('solo', 'enviro_wide')).toEqual({
      wideFraming: true,
      soloComposition: 'enviro_wide',
      dualComposition: null,
      frameInterest: 'wide',
      frameStamp: 'frame:solo:enviro_wide',
    });
  });
  it('frameFields carries the clause, the seated flag and both stamps; looksSlotInputFields forwards force_framing', () => {
    const f = frameFields('couple', () => 0, 'thigh_table');
    expect(f).toMatchObject({
      framingClause: expect.stringMatching(/seated at a table/),
      framingSeated: true,
      frameStamp: 'frame:couple:mid_thigh',
      framingStamp: 'framing:thigh_table:forced',
    });
    const o = { vibeFragment: 'x', vibePosition: 'early' as const };
    const fields = looksSlotInputFields(o, null, true, 'solo', () => 0.5, null, 'strict', 'tq_low');
    expect(fields.framingStamp).toBe('framing:tq_low:forced');
    expect(fields.framingClause).toMatch(/camera slightly low/);
    expect(fields.soloComposition).toBe('three_quarter');
  });
  it('every couple recipe rolls to a valid couple frame and every solo recipe to a valid solo frame', () => {
    for (const r of COUPLE_FRAMINGS)
      expect(['full_figure', 'knees_up', 'mid_thigh', 'waist_up']).toContain(r.distance);
    for (const r of SOLO_FRAMINGS)
      expect(['enviro_wide', 'three_quarter', 'waist_up']).toContain(r.distance);
  });
});

// ── composer placement ──
const coupleInput = (
  extra: Partial<CharacterSlotPipelineInput> = {}
): CharacterSlotPipelineInput => ({
  cast: [
    { role: 'plus_one', promptDesc: 'a woman, 43', gender: 'female', physicalSummary: null },
    { role: 'self', promptDesc: 'a man, 43', gender: 'male', physicalSummary: null },
  ],
  iconicAnchor: 'Sunflower labyrinth at dusk',
  userPlace: null,
  setAtOverride: 'Sunflower labyrinth at dusk',
  timeAxis: 'dusk',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: 'a cream knit sweater',
  realWorldLocation: false,
  mediumFluxFragment: 'watercolor painting',
  vibeDirective: 'calm',
  avoidList: '',
  action: 'both leaning on the fence, a clear gap between them',
  promptStyle: 'subject_first',
  ...extra,
});
const dualSlots: DualSlots = {
  scene_description: 'golden stalks',
  left_wardrobe: 'a plaid flannel',
  right_wardrobe: 'a cream sweater',
  mood: 'calm',
  props: '',
};
const soloSlots: SingleSlots = {
  scene_description: 'golden stalks',
  wardrobe: 'a plaid flannel',
  mood: 'calm',
  props: '',
};

describe('assembleCharacterPrompt — framingClause', () => {
  it('couple: the clause replaces the fixed distance line; the face clause and gap line stay; seated drops "standing"', () => {
    const base = assembleCharacterPrompt(dualSlots, coupleInput({ wideFraming: true }));
    expect(base).toContain(
      'from the knees up in a three-quarter length composition with generous open space'
    );
    const clause = COUPLE_FRAMINGS.find((r) => r.key === 'full_arch')!.text;
    const p = assembleCharacterPrompt(
      dualSlots,
      coupleInput({ wideFraming: true, framingClause: clause })
    );
    expect(p).toContain(
      `two people standing side by side ${clause} at Sunflower labyrinth at dusk`
    );
    expect(p).not.toContain('generous open space');
    expect(p).toContain(
      'both facing the camera with large clearly visible faces and a clear gap between their heads'
    );
    expect(p).toContain('a clear gap between their two heads');
    const seated = assembleCharacterPrompt(
      dualSlots,
      coupleInput({
        framingClause: COUPLE_FRAMINGS.find((r) => r.key === 'knees_bench')!.text,
        framingSeated: true,
      })
    );
    expect(seated).toContain('two people seated side by side from the knees up, seated on a bench');
  });
  it('solo: the clause replaces the first framing line for every distance; the face + integration lines stay', () => {
    const clause = SOLO_FRAMINGS.find((r) => r.key === 'full_arch')!.text;
    for (const soloComposition of ['enviro_wide', 'three_quarter', 'waist_up', null] as const) {
      const input = {
        ...coupleInput({ soloComposition, framingClause: clause, lookNeutralFraming: true }),
        cast: [coupleInput().cast[1]],
      };
      const p = assembleCharacterPrompt(soloSlots, input);
      expect(p).toContain(clause);
      expect(p).not.toContain('standing prominent in the foreground third');
      expect(p).not.toContain('generous open space around them showing the scene');
      expect(p).toMatch(/face (unobstructed and clearly visible|large enough to read)/);
    }
  });
  it('no clause → byte-identical to before on both surfaces', () => {
    const a = assembleCharacterPrompt(dualSlots, coupleInput({ wideFraming: true }));
    expect(
      assembleCharacterPrompt(dualSlots, coupleInput({ wideFraming: true, framingClause: null }))
    ).toBe(a);
    const soloIn = {
      ...coupleInput({ soloComposition: 'three_quarter' as const }),
      cast: [coupleInput().cast[1]],
    };
    expect(assembleCharacterPrompt(soloSlots, { ...soloIn, framingClause: undefined })).toBe(
      assembleCharacterPrompt(soloSlots, soloIn)
    );
  });
});

describe('parseQaFlags — force_framing', () => {
  it('string → key, else null', () => {
    expect(parseQaFlags({}).force_framing).toBeNull();
    expect(parseQaFlags({ force_framing: 'full_arch' }).force_framing).toBe('full_arch');
    expect(parseQaFlags({ force_framing: 3 }).force_framing).toBeNull();
  });
});

describe('framing overlay share + swap-safe subset (1.2.0-parity, 2026-09-12)', () => {
  it('pct 0 / force none → plain frame roll, framing:none, no clause; pct 100 → always a recipe', () => {
    const none = frameFields('couple', () => 0.2, null, { pct: 0 });
    expect(none).toMatchObject({
      framingClause: null,
      framingSeated: false,
      framingStamp: 'framing:none',
    });
    expect(none.frameStamp).toMatch(/^frame:couple:/);
    expect(frameFields('solo', () => 0.2, 'none').framingStamp).toBe('framing:none');
    expect(frameFields('solo', () => 0.99, null, { pct: 100 }).framingClause).toBeTruthy();
    // a forced key ignores the share
    expect(frameFields('couple', () => 0.99, 'knees_third', { pct: 0 }).framingStamp).toBe(
      'framing:knees_third:forced'
    );
  });
  it('flux couples never frame full-figure: no full recipe and no full_figure plain roll; other models unchanged (2026-09-13)', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const r = rollFraming(
        'couple',
        () => (i % 100) / 100,
        null,
        'black-forest-labs/flux-1.1-pro'
      );
      expect(r.recipe.distance).not.toBe('full_figure');
      expect(r.recipe.swapSafe).not.toBe(false);
      seen.add(rollFrame('couple', () => (i % 100) / 100, 'black-forest-labs/flux-1.1-pro'));
    }
    expect(seen.has('full_figure')).toBe(false);
    expect(seen.has('knees_up')).toBe(true);
    const others = new Set<string>();
    for (let i = 0; i < 100; i++)
      others.add(rollFrame('couple', () => i / 100, 'google/gemini-2-image'));
    expect(others.has('full_figure')).toBe(true);
    expect(rollFrame('solo', () => 0.01, 'black-forest-labs/flux-1.1-pro')).toBe(
      rollFrame('solo', () => 0.01)
    );
  });

  it('flux couples roll only swap-safe recipes; other models and solos roll the whole pool', () => {
    const unsafe = new Set(COUPLE_FRAMINGS.filter((r) => r.swapSafe === false).map((r) => r.key));
    expect(unsafe.size).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < 100; i++) {
      const k = rollFraming('couple', () => i / 100, null, 'black-forest-labs/flux-1.1-pro').recipe
        .key;
      expect(unsafe.has(k)).toBe(false);
    }
    const gem = new Set(
      Array.from(
        { length: 100 },
        (_, i) => rollFraming('couple', () => i / 100, null, 'google/gemini-2-image').recipe.key
      )
    );
    expect([...gem].some((k) => unsafe.has(k))).toBe(true);
    expect(SOLO_FRAMINGS.every((r) => r.swapSafe !== false)).toBe(true);
  });
  it('looksSlotInputFields forwards the share + model and the photo-prior switch', () => {
    const o = { vibeFragment: 'x', vibePosition: 'early' as const };
    const off = looksSlotInputFields(
      o,
      null,
      true,
      'couple',
      () => 0.9,
      null,
      'strict',
      null,
      false,
      { pct: 0 }
    );
    expect(off.framingStamp).toBe('framing:none');
    expect(off).not.toHaveProperty('photoPriors');
    const on = looksSlotInputFields(
      o,
      null,
      true,
      'couple',
      () => 0.1,
      null,
      'strict',
      null,
      true,
      { pct: 100, model: 'black-forest-labs/flux-1.1-pro' }
    );
    expect(on.photoPriors).toBe(true);
    expect(
      COUPLE_FRAMINGS.find((r) => r.key === on.framingStamp.replace(/^framing:/, ''))!.swapSafe
    ).not.toBe(false);
  });
});

describe('composer — photo-prior line + layered-depth suffix (looks path only)', () => {
  it('photoPriors adds the photograph-free editorial line to both integration lines; off = byte-identical', () => {
    const base = assembleCharacterPrompt(dualSlots, coupleInput({ lookNeutralFraming: true }));
    const on = assembleCharacterPrompt(
      dualSlots,
      coupleInput({ lookNeutralFraming: true, photoPriors: true })
    );
    expect(base).not.toContain('editorial feel');
    // the couple subject-first order has no framingBlock; check the solo line
    const soloIn = {
      ...coupleInput({ lookNeutralFraming: true, photoPriors: true }),
      cast: [coupleInput().cast[1]],
    };
    const solo = assembleCharacterPrompt(soloSlots, soloIn);
    expect(solo).toContain(
      'a relaxed warm editorial feel, filmic colour, rendered in the same medium'
    );
    expect(solo).not.toContain('photograph');
    expect(
      assembleCharacterPrompt(
        dualSlots,
        coupleInput({ lookNeutralFraming: true, photoPriors: false })
      )
    ).toBe(base);
    expect(on).toContain('foreground midground background stacked top to bottom, layered depth');
  });
  it('the layered-depth suffix rides the subject-first couple prompt only under lookNeutralFraming', () => {
    expect(assembleCharacterPrompt(dualSlots, coupleInput({ lookNeutralFraming: true }))).toContain(
      'layered depth'
    );
    expect(assembleCharacterPrompt(dualSlots, coupleInput({}))).not.toContain('layered depth');
  });
});

describe('couple anchor proportions on the looks path (parity loop round 3)', () => {
  it('looks path: "clearly visible faces at a natural size, natural head-to-body proportions"; legacy keeps "large"', () => {
    const looks = assembleCharacterPrompt(dualSlots, coupleInput({ lookNeutralFraming: true }));
    expect(looks).toContain(
      'clearly visible faces at a natural size, natural head-to-body proportions'
    );
    expect(looks).not.toContain('large clearly visible faces');
    expect(looks).toContain(
      'a clear gap between their heads, each head on its own side of the frame'
    );
    const legacy = assembleCharacterPrompt(dualSlots, coupleInput({}));
    expect(legacy).toContain('large clearly visible faces');
    expect(legacy).not.toContain('head-to-body');
  });
});

/** Round 15 (2026-09-13): looks-path couples assemble in the 1.2.0 LEGACY order — pose before the identity blocks,
 *  framing restatement after them, the full scene paragraph last — with the framing recipe riding the anchor. */
describe('looks-path couples in the 1.2.0 (legacy) prompt order — parity loop round 15', () => {
  const clause = COUPLE_FRAMINGS.find((r) => r.key === 'full_arch')!.text;
  const slots: DualSlots = {
    ...dualSlots,
    scene_description:
      'golden stalks sway under a violet sky, a scarecrow in a straw hat leans at the hedge, lanterns on poles',
  };
  it('the constant is legacy; the pose precedes the identities, the restatement follows them, the scene comes last', () => {
    expect(LOOKS_COUPLE_PROMPT_STYLE).toBe('legacy');
    const p = assembleCharacterPrompt(
      slots,
      coupleInput({
        promptStyle: LOOKS_COUPLE_PROMPT_STYLE,
        lookNeutralFraming: true,
        framingClause: clause,
        dualComposition: 'full_figure',
        wideFraming: true,
      })
    );
    const at = (needle: string) => {
      const i = p.indexOf(needle);
      expect(i).toBeGreaterThanOrEqual(0);
      return i;
    };
    expect(p).toContain(`two people together, ${clause}, NOT a tight face close-up`);
    expect(at('an ENVIRONMENTAL TWO-SHOT')).toBeLessThan(at('both leaning on the fence'));
    expect(at('both leaning on the fence')).toBeLessThan(at('LEFT side of frame'));
    expect(at('RIGHT side of frame')).toBeLessThan(
      at('both shown in full figure from head to shoes')
    );
    expect(at('both shown in full figure from head to shoes')).toBeLessThan(
      p.lastIndexOf('a scarecrow in a straw hat')
    );
    expect(p).toContain('foreground midground background stacked top to bottom, layered depth');
    expect(p).not.toContain('generous open space around them showing the scene at');
  });
  it('the production (legacy, no clause, no full-figure) couple prompt stays byte-identical', () => {
    const p = assembleCharacterPrompt(slots, coupleInput({ promptStyle: 'legacy' }));
    expect(p).toContain(
      'an ENVIRONMENTAL TWO-SHOT of two people together, shown from at least mid-thigh in a three-quarter length composition with the setting sweeping clearly around and above them at a natural editorial distance, NOT a tight face close-up'
    );
    expect(p).toContain(
      'both shown from the knees up in a three-quarter length composition, fully visible, generous open space around them showing the scene'
    );
    expect(
      assembleCharacterPrompt(
        slots,
        coupleInput({ promptStyle: 'legacy', framingClause: null, dualComposition: null })
      )
    ).toBe(p);
  });
});

/** Round 16 (2026-09-13): the solo distance line rides the anchor BEFORE the face-visibility clause (looks path). */
describe('solo distance line inside the anchor — parity loop round 16', () => {
  const soloIn = (extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
    ...coupleInput({ lookNeutralFraming: true, ...extra }),
    cast: [coupleInput().cast[1]],
  });
  const FACE =
    'face clearly visible and turned naturally toward the viewer at an easy three-quarter angle';
  it('the constant is on and looksSlotInputFields forwards it for solos only', () => {
    expect(LOOKS_SOLO_FRAMING_IN_ANCHOR).toBe(true);
    const solo = looksSlotInputFields(
      { vibeFragment: 'v', vibePosition: 'early' },
      null,
      true,
      'solo'
    );
    const couple = looksSlotInputFields(
      { vibeFragment: 'v', vibePosition: 'early' },
      null,
      true,
      'couple'
    );
    expect(solo.framingInAnchor).toBe(true);
    expect(couple.framingInAnchor).toBeUndefined();
  });
  it('a recipe clause lands between "the clear subject of the scene" and the face clause, and leaves the late block', () => {
    const clause = SOLO_FRAMINGS.find((r) => r.key === 'full_arch')!.text;
    const p = assembleCharacterPrompt(
      soloSlots,
      soloIn({ framingClause: clause, framingInAnchor: true, soloComposition: 'three_quarter' })
    );
    expect(p).toContain(`the clear subject of the scene, ${clause}, ${FACE}`);
    expect(p.indexOf(clause)).toBe(p.lastIndexOf(clause));
    expect(p.indexOf(clause)).toBeLessThan(p.indexOf('CHARACTER:'));
    expect(p).toContain('face unobstructed and clearly visible to the viewer');
  });
  it('no recipe → the composition default rides the anchor (waist-up without the fill cue); enviro_wide keeps its subject line', () => {
    const waist = assembleCharacterPrompt(
      soloSlots,
      soloIn({ framingInAnchor: true, soloComposition: 'waist_up', framingClause: null })
    );
    expect(waist).toContain(
      `the clear subject of the scene, shown from the waist up, the dressed set within arm's reach beside and behind them, ${FACE}`
    );
    expect(waist).not.toContain('filling the frame');
    const wide = assembleCharacterPrompt(
      soloSlots,
      soloIn({ framingInAnchor: true, soloComposition: 'enviro_wide', framingClause: null })
    );
    expect(wide).toContain(
      `the clear subject of the scene, full figure visible, standing prominent in the foreground third of a sweeping environment, ${FACE}`
    );
    expect(wide).toContain(
      'the person is the unmistakable subject, face large enough to read clearly'
    );
    const knees = assembleCharacterPrompt(
      soloSlots,
      soloIn({ framingInAnchor: true, soloComposition: null, framingClause: null })
    );
    expect(knees).toContain(
      `the clear subject of the scene, shown from the knees up in a three-quarter length composition, fully visible, generous open space around them showing the scene, ${FACE}`
    );
  });
  it('off → byte-identical to the round-15 prompt; the legacy (production) solo never carries it', () => {
    const clause = SOLO_FRAMINGS.find((r) => r.key === 'full_arch')!.text;
    const a = assembleCharacterPrompt(soloSlots, soloIn({ framingClause: clause }));
    expect(
      assembleCharacterPrompt(soloSlots, soloIn({ framingClause: clause, framingInAnchor: false }))
    ).toBe(a);
    expect(a).toContain(`the clear subject of the scene, ${FACE}`);
    const legacy = assembleCharacterPrompt(soloSlots, {
      ...soloIn({ framingInAnchor: true, lookNeutralFraming: false }),
    });
    expect(legacy).toContain(
      'the clear subject of a candid cinematic photograph, face clearly visible'
    );
  });
});

/** Round 17 (2026-09-13): hair-colour echo in the position-1 gender lock (looks path, flag). */
describe('hair-colour echo in the gender lock — parity loop round 17', () => {
  const cast = [
    {
      role: 'plus_one' as const,
      promptDesc: 'a woman, 43',
      gender: 'female' as const,
      physicalSummary:
        'White woman, dark brown hair with caramel highlights, 43 years old, average build, warm golden tan skin',
    },
    {
      role: 'self' as const,
      promptDesc: 'a man, 43',
      gender: 'male' as const,
      physicalSummary:
        'White man, brown hair swept back from the forehead, short trimmed chestnut beard, 43 years old, average build, warm medium skin',
    },
  ];
  it('the flag is on (round 17) and looksSlotInputFields forwards it on both surfaces', () => {
    expect(LOOKS_HAIR_ECHO).toBe(true);
    const f = looksSlotInputFields(
      { vibeFragment: 'v', vibePosition: 'early' },
      null,
      true,
      'solo'
    );
    expect(f.hairEcho).toBe(true);
    const c = looksSlotInputFields(
      { vibeFragment: 'v', vibePosition: 'early' },
      null,
      true,
      'couple'
    );
    expect(c.hairEcho).toBe(true);
  });
  it('couple: "DARK BROWN-HAIRED WOMAN on the LEFT, BROWN-HAIRED MAN on the RIGHT"; off = byte-identical', () => {
    const on = assembleCharacterPrompt(dualSlots, coupleInput({ cast, hairEcho: true }));
    expect(
      on.startsWith('DARK BROWN-HAIRED WOMAN on the LEFT, BROWN-HAIRED MAN on the RIGHT, ')
    ).toBe(true);
    const off = assembleCharacterPrompt(dualSlots, coupleInput({ cast }));
    expect(off.startsWith('WOMAN on the LEFT, MAN on the RIGHT, ')).toBe(true);
    expect(assembleCharacterPrompt(dualSlots, coupleInput({ cast, hairEcho: false }))).toBe(off);
  });
  it('solo: "a BROWN-HAIRED MALE man —"; an auburn-haired woman gets "an"; bald or 55+ cast are left to the senior echo', () => {
    const man = assembleCharacterPrompt(soloSlots, {
      ...coupleInput({ hairEcho: true, lookNeutralFraming: true }),
      cast: [cast[1]],
    });
    expect(man.startsWith('a BROWN-HAIRED MALE man — masculine face')).toBe(true);
    const auburn = assembleCharacterPrompt(soloSlots, {
      ...coupleInput({ hairEcho: true, lookNeutralFraming: true }),
      cast: [{ ...cast[0], physicalSummary: 'White woman, auburn hair in a bob, 38 years old' }],
    });
    expect(auburn.startsWith('an AUBURN-HAIRED FEMALE woman — feminine face')).toBe(true);
    const bald = assembleCharacterPrompt(soloSlots, {
      ...coupleInput({ hairEcho: true, lookNeutralFraming: true }),
      cast: [{ ...cast[1], physicalSummary: 'White man, bald with grey stubble, 43 years old' }],
    });
    expect(bald.startsWith('a MALE man — masculine face')).toBe(true);
    const senior = assembleCharacterPrompt(
      dualSlots,
      coupleInput({
        cast: [
          cast[0],
          {
            ...cast[1],
            promptDesc: 'a man, 74',
            age: 74,
            physicalSummary: 'White man, white hair, 74 years old, average build',
          },
        ],
        hairEcho: true,
      })
    );
    expect(senior).toContain('WHITE-HAIRED OLDER MAN on the RIGHT');
    expect(senior).not.toContain('WHITE-HAIRED OLDER WHITE-HAIRED');
  });
});

/** Round 18 (2026-09-13): couple prompt order per model. */
describe('looksCouplePromptStyle — parity loop round 18', () => {
  it('with the album skeleton on, flux couples take the LEGACY order (pose before the identities); others subject-first', () => {
    expect(LOOKS_FLUX_COUPLE_ALBUM_SKELETON).toBe(true);
    expect(looksCouplePromptStyle('black-forest-labs/flux-1.1-pro')).toBe('legacy');
    expect(looksCouplePromptStyle('black-forest-labs/flux-2-flex')).toBe('legacy');
    expect(looksCouplePromptStyle('google/gemini-2-image')).toBe('subject_first');
    expect(looksCouplePromptStyle('xai/grok-imagine-image')).toBe('subject_first');
    expect(looksCouplePromptStyle(null)).toBe('subject_first');
  });
});

/** Round 19 (2026-09-13): a couple re-render that crosses the flux ↔ others order boundary re-assembles the slots. */
describe('reassembleForModel — parity loop round 19', () => {
  const pick = (model: string) => ({
    model,
    look: {
      key: 'nightly_x',
      label: 'x',
      family: 'legacy',
      fragment: 'x scene',
      swapFragment: 'x swap',
      directive: null,
      weight: 1,
      active: true,
    },
    fragment: 'x swap fragment',
    stamps: [`policy:couple:2:${model.split('/').pop()}`],
  });
  it('legacy (flux) → gemini re-assembles subject-first with the new fragment and stamps the reroll', () => {
    const input = coupleInput({
      promptStyle: 'legacy',
      lookNeutralFraming: true,
      mediumFluxFragment: 'old fragment',
    });
    const re = reassembleForModel(dualSlots, input, pick('google/gemini-2-image'));
    expect(re).not.toBeNull();
    expect(re!.input.promptStyle).toBe('subject_first');
    expect(re!.prompt).toContain('x swap fragment');
    expect(re!.prompt).not.toContain('ENVIRONMENTAL TWO-SHOT');
    expect(re!.prompt).toBe(assembleCharacterPrompt(dualSlots, re!.input));
    expect(re!.stamps).toEqual(['couple_prompt_style:subject_first:reroll']);
  });
  it('same order (subject-first → flux with the album skeleton on, gemini → grok) and solos return null', () => {
    expect(
      reassembleForModel(
        dualSlots,
        coupleInput({ promptStyle: 'legacy' }),
        pick('black-forest-labs/flux-2-flex')
      )
    ).toBeNull();
    expect(
      reassembleForModel(
        dualSlots,
        coupleInput({ promptStyle: 'subject_first' }),
        pick('xai/grok-imagine-image')
      )
    ).toBeNull();
    const solo = { ...coupleInput({ promptStyle: 'legacy' }), cast: [coupleInput().cast[1]] };
    expect(reassembleForModel(soloSlots, solo, pick('google/gemini-2-image'))).toBeNull();
  });
});

/** 2026-09-13: flux couples on the looks path render with the 1.2.0 album skeleton. */
describe('flux couple album skeleton', () => {
  it('isFluxCoupleAlbum: flux couples only', () => {
    expect(isFluxCoupleAlbum('couple', 'black-forest-labs/flux-1.1-pro')).toBe(true);
    expect(isFluxCoupleAlbum('solo', 'black-forest-labs/flux-1.1-pro')).toBe(false);
    expect(isFluxCoupleAlbum('couple', 'google/gemini-2-image')).toBe(false);
    expect(isFluxCoupleAlbum('couple', null)).toBe(false);
  });
  it('looksSlotInputFields(albumCouple): no vibe fragment, plain brief, mid-thigh, scene after the pose, hair echo, stamps', () => {
    const f = looksSlotInputFields(
      { vibeFragment: 'aurora glow everywhere', vibePosition: 'early' },
      null,
      true,
      'couple',
      () => 0.5,
      { timeAxis: 'dusk', weatherAxis: 'clear', phenomenaAxis: '' },
      'strict',
      null,
      true,
      { pct: 40, model: 'black-forest-labs/flux-1.1-pro', albumCouple: true }
    );
    expect(f.vibeFragment).toBeNull();
    expect(f.vibeFragmentPosition).toBeNull();
    expect(f.lookNeutralFraming).toBe(false);
    expect(f.richBrief).toBeUndefined();
    expect(f.framingClause).toBeNull();
    expect(f.dualComposition).toBeNull();
    expect(f.wideFraming).toBe(false);
    expect(f.coupleSceneAfterAction).toBe(true);
    expect(f.hairEcho).toBe(true);
    expect(f.timeAxis).toBe('dusk');
    expect(f.frameStamp).toBe('frame:couple:mid_thigh');
    expect(f.framingStamp).toBe('couple_skeleton:album_legacy');
  });
  it('the composer puts the scene AFTER the pose with the 1.2.0 anchor and no early fragment; production is byte-identical', () => {
    const slots: DualSlots = {
      ...dualSlots,
      scene_description: 'golden stalks sway under a violet sky, a scarecrow leans at the hedge',
    };
    const album = assembleCharacterPrompt(
      slots,
      coupleInput({
        promptStyle: 'subject_first',
        coupleSceneAfterAction: true,
        lookNeutralFraming: false,
        vibeFragment: 'aurora glow everywhere',
        vibeFragmentPosition: 'early',
      })
    );
    const at = (n: string) => {
      const i = album.indexOf(n);
      expect(i).toBeGreaterThanOrEqual(0);
      return i;
    };
    expect(album).toContain(
      'two people standing side by side from mid-thigh up at Sunflower labyrinth at dusk, both facing the camera with large clearly visible faces'
    );
    expect(at('LEFT side of frame')).toBeLessThan(at('both leaning on the fence'));
    expect(at('both leaning on the fence')).toBeLessThan(at('a scarecrow leans at the hedge'));
    expect(at('a scarecrow leans at the hedge')).toBeLessThan(
      at('a clear gap between their two heads')
    );
    expect(album).not.toContain('aurora glow everywhere');
    expect(album).not.toContain('layered depth');
    const prod = assembleCharacterPrompt(slots, coupleInput({ promptStyle: 'subject_first' }));
    expect(
      assembleCharacterPrompt(
        slots,
        coupleInput({ promptStyle: 'subject_first', coupleSceneAfterAction: false })
      )
    ).toBe(prod);
    expect(prod.indexOf('a scarecrow leans at the hedge')).toBeLessThan(
      prod.indexOf('LEFT side of frame')
    );
  });
});

/** Flux parity arm H: a symmetric stance inside the couple anchor. */
import { DUAL_STANCES_FLUX_ANCHOR } from '@engine/dualStances';
describe('anchor stance for flux couples (arm H)', () => {
  it('the anchor list is the mid-shot symmetric five', () => {
    expect(DUAL_STANCES_FLUX_ANCHOR.map((s) => s.key).sort()).toEqual(
      ['hands_free', 'leaning_back', 'perched_edge', 'rail_pair', 'seated_together'].sort()
    );
  });
  it('the composer puts the stance inside the anchor (word ~55) and keeps the 1.2.0 face clause; off = unchanged', () => {
    const st = DUAL_STANCES_FLUX_ANCHOR.find((s) => s.key === 'rail_pair')!;
    const p = assembleCharacterPrompt(
      dualSlots,
      coupleInput({
        promptStyle: 'subject_first',
        coupleSceneAfterAction: true,
        lookNeutralFraming: false,
        anchorStance: st.text,
        framingSeated: true,
      })
    );
    expect(p).toContain(
      `two people at Sunflower labyrinth at dusk, ${st.text}, both facing the camera with large clearly visible faces`
    );
    expect(p.indexOf(st.text)).toBeLessThan(p.indexOf('LEFT side of frame'));
    expect(p.split(/\s+/).slice(0, 60).join(' ')).toContain('railing or fence');
    const off = assembleCharacterPrompt(
      dualSlots,
      coupleInput({
        promptStyle: 'subject_first',
        coupleSceneAfterAction: true,
        lookNeutralFraming: false,
      })
    );
    expect(off).toContain(
      'two people standing side by side from mid-thigh up at Sunflower labyrinth at dusk'
    );
  });
});

/** Flux parity arm I: positive-only framing language on the legacy couple prompt. */
describe('positive framing (no negated close-up / portrait tokens) — arm I', () => {
  it('drops "close-up", "portrait" and the never-clauses from the flux couple prompt; production is byte-identical', () => {
    const on = assembleCharacterPrompt(
      dualSlots,
      coupleInput({ promptStyle: 'legacy', coupleSceneAfterAction: true, positiveFraming: true })
    );
    expect(on).not.toMatch(/close-up|portrait|never/i);
    expect(on).toContain(
      'their faces a normal-sized part of the frame with the setting open around them'
    );
    expect(on).toContain('an editorial cinematic photograph feel, relaxed and candid');
    const prod = assembleCharacterPrompt(dualSlots, coupleInput({ promptStyle: 'legacy' }));
    expect(prod).toContain('NOT a tight face close-up');
    expect(prod).toContain('rather than a stiff studio couple portrait');
    expect(
      assembleCharacterPrompt(
        dualSlots,
        coupleInput({ promptStyle: 'legacy', positiveFraming: false })
      )
    ).toBe(prod);
  });
});

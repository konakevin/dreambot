/**
 * OUTFIT PLAN in the slot brief + pipeline (CREATE_OUTFIT_PLAN.md, phase 3).
 *
 * What this locks:
 *   - the plan replaces the one shared palette + cut ("SPLIT it between them") with one line per person;
 *   - the scene sets the garment TYPE and dress level for both (no gown next to a jacket);
 *   - the user's own words are exempt from PLAIN_CLOTHES in THEIR field only;
 *   - Sonnet dropping the user's words is a named violation → retry → code writes them in;
 *   - a holiday costume lock still wins; without a plan nothing changes (the golden fixture covers bytes).
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import {
  buildSlotBrief,
  runCharacterSlotPipeline,
  validateSlots,
  salvageSlots,
  describeViolations,
  type CharacterSlotPipelineInput,
  type DualSlots,
} from '@engine/characterSlotPrompt';
import {
  planOutfits,
  renderOutfitPlanLines,
  missingUserOutfit,
  userOutfitPhrase,
  allowedByUser,
  type OutfitPlan,
  type PersonOutfitPlan,
  type UserOutfitSpec,
} from '@engine/outfitPlan';
import { callSonnet, type SonnetResult } from '@engine/llm';

const mockSonnet = callSonnet as jest.MockedFunction<typeof callSonnet>;
const sonnetReply = (slots: object): SonnetResult => ({
  text: JSON.stringify(slots),
  brief: '',
  rawResponse: JSON.stringify(slots),
  modelUsed: 'test',
  retries: 0,
  fellBackToSecondary: false,
});
beforeEach(() => mockSonnet.mockReset());

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const spec = (s: Partial<UserOutfitSpec>): UserOutfitSpec => ({
  garment: null,
  colour: null,
  colourImplied: false,
  pattern: null,
  ...s,
});
const person = (p: Partial<PersonOutfitPlan>): PersonOutfitPlan => ({
  role: 'self',
  garment: null,
  colour: { lead: 'cobalt blue', accent: null },
  colourSource: 'roll',
  avoidColours: [],
  pattern: null,
  patternSource: null,
  patternAsTrim: false,
  silhouette: 'sleek and close-fitting, cut sharp to the body',
  ...p,
});

// LEFT = the wife (plus_one), RIGHT = the user (self): the order a 50% flip produces.
const input = (extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
  cast: [
    { role: 'plus_one', promptDesc: 'a woman, 35, long brown hair', gender: 'female' },
    { role: 'self', promptDesc: 'a man, 38, short dark hair', gender: 'male' },
  ],
  iconicAnchor: null,
  userPlace: 'a person and a companion at a beach club',
  setAtOverride: 'a white-sand beach club at golden hour',
  timeAxis: 'golden hour',
  weatherAxis: 'clear',
  phenomenaAxis: '',
  wardrobeAnchor: null,
  mediumFluxFragment: 'a cinematic photograph',
  vibeDirective: 'warm',
  avoidList: '',
  activityWardrobe: true,
  action: 'standing side by side at the rail',
  ...extra,
});
const coupleSlots = (left: string, right: string): DualSlots => ({
  scene_description: 'a beach club deck with rattan loungers and lanterns',
  left_wardrobe: left,
  right_wardrobe: right,
  mood: 'warm',
  props: '',
});

const redBikiniPlan = (): OutfitPlan =>
  planOutfits(
    ['plus_one', 'self'],
    { independentPct: 0, separateCutPct: 0, patternPct: 0 },
    { plus_one: spec({ garment: 'bikini', colour: 'red' }) },
    seeded(1)
  );

describe('renderOutfitPlanLines', () => {
  const sides = [
    { role: 'plus_one', label: 'LEFT', gender: 'female' as const },
    { role: 'self', label: 'RIGHT', gender: 'male' as const },
  ];

  it('coordinated: one colour each, and each is told never to wear the other’s', () => {
    const plan: OutfitPlan = {
      colourMode: 'coordinated',
      cutMode: 'shared',
      people: [
        person({
          role: 'plus_one',
          colour: { lead: 'soft coral', accent: null },
          avoidColours: ['ice blue'],
        }),
        person({
          role: 'self',
          colour: { lead: 'ice blue', accent: null },
          avoidColours: ['soft coral'],
        }),
      ],
    };
    const text = renderOutfitPlanLines(plan, sides);
    expect(text).toContain('- LEFT (the woman): Colour: soft coral is their colour');
    expect(text).toContain("NEVER wear ice blue (RIGHT's colour)");
    expect(text).toContain('- RIGHT (the man): Colour: ice blue is their colour');
    expect(text).toContain("NEVER wear soft coral (LEFT's colour)");
    expect(text).toContain('Pattern: none, solid colour.');
  });

  it('independent: lead + accent, a pattern with its print-or-trim escape hatch', () => {
    const plan: OutfitPlan = {
      colourMode: 'independent',
      cutMode: 'separate',
      people: [
        person({
          role: 'plus_one',
          colour: { lead: 'blush pink', accent: 'cornflower blue' },
          pattern: 'a crisp gingham check',
          patternSource: 'roll',
        }),
        person({ role: 'self', colour: { lead: 'forest green', accent: 'burnt orange' } }),
      ],
    };
    const text = renderOutfitPlanLines(plan, sides);
    expect(text).toContain('lead with blush pink, accent with cornflower blue');
    expect(text).toContain(
      'Pattern: a crisp gingham check, as a print where the garment can carry one, otherwise as a trim or accent piece.'
    );
  });

  it('the user’s own request: their words, their colour, our pattern only as TRIM, and THEIR shape (no rolled silhouette)', () => {
    const plan: OutfitPlan = {
      colourMode: 'coordinated',
      cutMode: 'shared',
      people: [
        person({
          role: 'plus_one',
          garment: 'bikini',
          colour: { lead: 'red', accent: null },
          colourSource: 'user',
          pattern: 'playful polka dots',
          patternSource: 'roll',
          patternAsTrim: true,
        }),
        person({
          role: 'self',
          garment: 'Detroit Lions jersey',
          colour: null,
          colourSource: 'implied',
        }),
      ],
    };
    const text = renderOutfitPlanLines(plan, sides);
    expect(text).toContain(
      'LEFT (the woman): wears the user\'s own request, "bikini". Keep those words.'
    );
    expect(text).toContain('Colour: red, exactly as asked.');
    expect(text).toContain('Trim: playful polka dots, as a trim or accent only.');
    // a garment the user named keeps its own cut: a rolled silhouette turned a bikini into bikini + shorts
    expect(text.split('\n')[0]).not.toContain('Silhouette:');
    expect(text).toContain("Colour: the garment's own known colours. Do not recolour it.");
  });
});

describe('buildSlotBrief with an outfit plan', () => {
  it('replaces the shared palette, the one cut and "a different GARMENT" with a line per person', () => {
    const b = buildSlotBrief(input({ outfitPlan: redBikiniPlan() }));
    expect(b).not.toContain('PALETTE for this render');
    expect(b).not.toContain('SPLIT it between them');
    expect(b).not.toContain('pick a different GARMENT');
    expect(b).toContain('The plan for each person. Follow it exactly:');
    expect(b).toContain('- LEFT (the woman): wears the user\'s own request, "bikini"');
    expect(b).toMatch(/- RIGHT \(the man\): Colour: .* is their colour/);
    expect(b).toContain(
      'The scene sets ONE garment type and dress level for the pair, dressed per person'
    );
    expect(b).toContain('Two women at a gala both wear gowns');
    expect(b).toContain('Follow the RIGHT line of the wardrobe plan above.');
    expect(b).toContain('DRESS THEM FOR WHAT THEY ARE DOING: "standing side by side at the rail"');
  });

  it('the user’s own clothing wins over the basics ban and the traveler rule', () => {
    const b = buildSlotBrief(input({ outfitPlan: redBikiniPlan() }));
    expect(b).toContain(
      "For anyone the plan does not dress in the user's own words: NEVER everyday basics"
    );
    expect(b).toContain('Clothing the user asked for in the plan always wins over this rule.');
  });

  it('with nobody dressed by the user, the basics ban applies to both and the traveler rule is unchanged', () => {
    const plan = planOutfits(['plus_one', 'self'], undefined, {}, seeded(2));
    const b = buildSlotBrief(input({ outfitPlan: plan }));
    expect(b).toContain('\nNEVER everyday basics');
    expect(b).not.toContain('always wins over this rule');
  });

  it('a holiday costume lock still wins over the plan', () => {
    const b = buildSlotBrief(
      input({
        outfitPlan: redBikiniPlan(),
        costumeLock: ['a vampire cape', 'a mad scientist coat'],
      })
    );
    expect(b).toContain('HOLIDAY COSTUME LOCK');
    expect(b).not.toContain('The plan for each person');
  });

  it('without a plan, the brief is the one Create sends today', () => {
    const b = buildSlotBrief(input());
    expect(b).toContain('PALETTE for this render');
    expect(b).toContain('SPLIT it between them');
    expect(b).not.toContain('The plan for each person');
  });
});

describe('the user’s words are exempt from PLAIN_CLOTHES — in their own field only', () => {
  const slots = coupleSlots('slim indigo jeans and a white t-shirt', 'jeans and a tee');
  const allow = { left_wardrobe: ['jeans and t-shirts'] };

  it('validateSlots flags only the field the user did not ask for', () => {
    expect(validateSlots(slots)).toEqual(['plain_clothes(jeans, t-shirt, tee)']);
    expect(validateSlots(slots, allow)).toEqual(['plain_clothes(jeans, tee)']);
    expect(
      validateSlots(slots, {
        left_wardrobe: ['jeans and t-shirts'],
        right_wardrobe: ['jeans and t-shirts'],
      })
    ).toEqual([]);
  });

  it('describeViolations and salvageSlots agree', () => {
    expect(describeViolations(slots, allow)).not.toContain('in left_wardrobe');
    expect(describeViolations(slots, allow)).toContain('in right_wardrobe');
    const fb = coupleSlots('FALLBACK', 'FALLBACK');
    const { slots: out, replaced } = salvageSlots(slots, fb, allow);
    expect(replaced).toEqual(['right_wardrobe']);
    expect((out as DualSlots).left_wardrobe).toBe('slim indigo jeans and a white t-shirt');
  });

  it('allowedByUser understands tee / t-shirt and jeans / denim', () => {
    expect(allowedByUser('tee', ['jeans and t-shirts'])).toBe(true);
    expect(allowedByUser('jeans', ['denim'])).toBe(true);
    expect(allowedByUser('hoodie', ['jeans and t-shirts'])).toBe(false);
  });
});

describe('missingUserOutfit — did Sonnet keep what the user asked for?', () => {
  it.each([
    [{ garment: 'bikini', colour: 'red' }, 'a red triangle bikini with gold rings', []],
    [{ garment: 'bikini', colour: 'red' }, 'a scarlet triangle bikini', []],
    [{ garment: 'bikini', colour: 'red' }, 'a coral triangle bikini', ['"red"']],
    [{ garment: 'suit', colour: 'navy' }, 'a cobalt three-piece suit', ['"navy"']],
    [{ garment: 'dress', colour: 'green' }, 'an emerald silk charmeuse gown', []],
    [{ garment: 'shorts', colour: 'green' }, 'emerald swim trunks', []],
    [{ garment: 'bikini', colour: 'red' }, 'a red one-piece swimsuit', ['"bikini"']],
    [{ garment: 'jeans and t-shirts' }, 'dark selvedge denim and a crisp white tee', []],
    [
      { garment: 'jeans and t-shirts' },
      'wide-leg linen trousers and a silk blouse',
      ['"jeans"', '"t-shirts"'],
    ],
    [{ garment: 'fancy Hats' }, 'an ivory sheath and a wide-brim picture hat', []],
    [
      { garment: 'Detroit lions cheerleading outfit' },
      'a Lions cheer uniform in Honolulu blue',
      [],
    ],
    [{ garment: 'shorts', pattern: 'with flowers' }, 'emerald floral board shorts', []],
    [{ garment: 'shorts', pattern: 'with flowers' }, 'emerald striped board shorts', ['"flowers"']],
    [{ garment: 'dresses with banners' }, 'a white lawn dress with a sash', []],
    [{ garment: 'space suits' }, 'a sleek petrol-blue pressure suit', []],
    [{ garment: 'tux' }, 'a midnight tuxedo with a satin lapel', []],
  ])('%j in "%s" → %j', (asked, wardrobe, missing) => {
    const p = person({
      garment: asked.garment ?? null,
      colour: asked.colour ? { lead: asked.colour, accent: null } : { lead: 'navy', accent: null },
      colourSource: asked.colour ? 'user' : 'roll',
      pattern: 'pattern' in asked ? asked.pattern! : null,
      patternSource: 'pattern' in asked ? 'user' : null,
    });
    expect(missingUserOutfit(wardrobe, p)).toEqual(missing);
  });

  it('a garment of only generic words ("clothes") has nothing to check or write in', () => {
    const p = person({ garment: 'clothes' });
    expect(missingUserOutfit('a moss green sweatshirt and acid-wash jeans', p)).toEqual([]);
    expect(userOutfitPhrase(p)).toBeNull();
    expect(
      userOutfitPhrase(
        person({ garment: 'outfit', colour: { lead: 'red', accent: null }, colourSource: 'user' })
      )
    ).toBe('red outfit');
  });

  it('a person the user did not dress has nothing to miss', () => {
    expect(missingUserOutfit('anything at all', person({}))).toEqual([]);
  });
});

describe('userOutfitPhrase — the code-written fallback', () => {
  it.each([
    [{ garment: 'bikini', colour: 'red' }, 'red bikini'],
    [
      { garment: 'bikini', colour: 'red', trim: 'playful polka dots' },
      'red bikini, with playful polka dots trim',
    ],
    [{ garment: 'shorts', colour: 'green', pattern: 'with flowers' }, 'green shorts with flowers'],
    [{ garment: 'suit', pattern: 'pinstripes' }, 'suit in pinstripes'],
    [{ garment: 'jeans and t-shirts' }, 'jeans and t-shirts'],
  ])('%j → %s', (a, phrase) => {
    const p = person({
      garment: a.garment,
      colour: 'colour' in a ? { lead: a.colour!, accent: null } : { lead: 'navy', accent: null },
      colourSource: 'colour' in a ? 'user' : 'roll',
      pattern: 'pattern' in a ? a.pattern! : 'trim' in a ? a.trim! : null,
      patternSource: 'pattern' in a ? 'user' : 'trim' in a ? 'roll' : null,
      patternAsTrim: 'trim' in a,
    });
    expect(userOutfitPhrase(p)).toBe(phrase);
  });

  it('nothing asked → no phrase', () => expect(userOutfitPhrase(person({}))).toBeNull());
});

describe('runCharacterSlotPipeline with an outfit plan', () => {
  it('Sonnet keeps the user’s words first time: stamped kept, no retry', async () => {
    mockSonnet.mockResolvedValue(
      sonnetReply(
        coupleSlots(
          'a red triangle bikini with a sheer sarong',
          'sky blue linen resort shirt and tailored shorts'
        )
      )
    );
    const r = await runCharacterSlotPipeline(input({ outfitPlan: redBikiniPlan() }), 'k');
    expect(r.retries).toBe(0);
    expect(r.fallbackReasons).toEqual(
      expect.arrayContaining([
        'outfit_colour:coordinated',
        'outfit_cut:shared',
        'outfit_lock:LEFT:kept',
      ])
    );
    expect((r.slots as DualSlots).left_wardrobe).toBe('a red triangle bikini with a sheer sarong');
  });

  it('Sonnet drops "red": a named violation, a retry that names it, then kept → stamped retried', async () => {
    mockSonnet
      .mockResolvedValueOnce(sonnetReply(coupleSlots('a coral bikini', 'a sky blue resort shirt')))
      .mockResolvedValueOnce(sonnetReply(coupleSlots('a red bikini', 'a sky blue resort shirt')));
    const r = await runCharacterSlotPipeline(input({ outfitPlan: redBikiniPlan() }), 'k');
    expect(r.fallbackReasons).toContain('slot_violations_attempt_1:outfit_lock(LEFT:"red")');
    expect(r.fallbackReasons).toContain('outfit_lock:LEFT:retried');
    expect(mockSonnet.mock.calls[1][0]).toContain(
      `- outfit_lock: left_wardrobe dropped "red", which the user asked for. Keep the user's exact words in left_wardrobe.`
    );
    expect((r.slots as DualSlots).left_wardrobe).toBe('a red bikini');
  });

  it('Sonnet drops it twice: code writes the user’s request in, and keeps Sonnet’s other fields', async () => {
    mockSonnet.mockResolvedValue(
      sonnetReply(coupleSlots('a coral bikini', 'a sky blue resort shirt'))
    );
    const r = await runCharacterSlotPipeline(input({ outfitPlan: redBikiniPlan() }), 'k');
    expect(r.fallbackReasons).toContain('outfit_lock:LEFT:code_applied');
    expect(r.fallbackReasons.some((f) => f.startsWith('character_slot_fallback_used'))).toBe(false);
    const slots = r.slots as DualSlots;
    expect(slots.left_wardrobe).toBe('red bikini');
    expect(slots.right_wardrobe).toBe('a sky blue resort shirt');
    expect(slots.scene_description).toContain('beach club deck');
  });

  it('"me and Steph in jeans and t-shirts" is honored, not rewritten', async () => {
    const plan = planOutfits(
      ['plus_one', 'self'],
      undefined,
      {
        plus_one: spec({ garment: 'jeans and t-shirts' }),
        self: spec({ garment: 'jeans and t-shirts' }),
      },
      seeded(4)
    );
    mockSonnet.mockResolvedValue(
      sonnetReply(
        coupleSlots('high-rise jeans and a cropped t-shirt', 'straight jeans and a boxy tee')
      )
    );
    const r = await runCharacterSlotPipeline(input({ outfitPlan: plan }), 'k');
    expect(r.retries).toBe(0);
    expect(r.fallbackReasons.some((f) => f.includes('plain_clothes'))).toBe(false);
    expect((r.slots as DualSlots).right_wardrobe).toBe('straight jeans and a boxy tee');
  });

  it('without a plan: no outfit stamps, and plain clothes are still rejected exactly as today', async () => {
    mockSonnet.mockResolvedValue(sonnetReply(coupleSlots('jeans and a t-shirt', 'a linen suit')));
    const r = await runCharacterSlotPipeline(input(), 'k');
    expect(r.fallbackReasons.some((f) => f.startsWith('outfit_'))).toBe(false);
    expect(r.fallbackReasons).toContain('slot_violations_attempt_1:plain_clothes(jeans, t-shirt)');
  });
});

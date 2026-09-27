/**
 * Outfits phase 8 (2026-09-26/27, CREATE_OUTFIT_PLAN.md) — the engine fixes around the outfit work:
 *   - rolled SCENE DETAILS no longer contradict the prompt (rain on "golden hour", a cobblestone street in a
 *     forest, "stepping through puddles" on someone drawing a bow),
 *   - a Sonnet prompt cut off at max_tokens loses its unfinished clause ("..., quiet lethal tension, no"),
 *   - "me and my husband" can no longer cast a starred +1 of the other gender,
 *   - nightly's garment axis is opt-in per request and prints one line per person when set.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import { expandScene, hasActionInPrompt } from '@engine/sceneExpander';
import { trimTruncatedPrompt } from '@engine/promptCompiler';
import {
  relationshipGender,
  partnerForRelationship,
  type RosterPartner,
} from '@engine/partnerRoll';
import { parseQaFlags } from '@engine/nightlyQaFlags';
import {
  assembleCharacterPrompt,
  buildSlotBrief,
  type CharacterSlotPipelineInput,
} from '@engine/characterSlotPrompt';
import { rollFashion } from '@engine/outfitPlan';

describe('scene details respect the prompt', () => {
  const expand = (userPrompt: string, userId = 'u') =>
    expandScene({
      userPrompt,
      userId,
      mediumKey: 'canvas',
      vibeKey: 'cinematic',
      hasCharacter: true,
    }).expansion;

  it('a wild setting never gets a built surface (street, beams, marble, frosted glass, neon)', () => {
    for (let i = 0; i < 60; i++) {
      const e = expand(`Steph as a huntress deep in a fantasy forest ${i}`, `u${i}`);
      expect(e).not.toMatch(/cobblestone|street|metal beams|marble floor|frosted glass|neon/i);
    }
  });

  it('golden hour / sunshine never gets rain, puddles or storm lines', () => {
    for (let i = 0; i < 60; i++) {
      const e = expand(`me on a rooftop at golden hour ${i}`, `v${i}`);
      expect(e).not.toMatch(/\b(rain|raindrops|puddles?|wet|storm|snow)\b/i);
    }
  });

  it('a prompt that already has an action gets no rolled motion detail', () => {
    const ACTIONS =
      /coat whipping|raindrops streaking|hand gripping|hair caught mid-motion|stepping through|breath visible|fingers brushing|fabric billowing/i;
    for (let i = 0; i < 40; i++) {
      expect(expand(`Steph drawing a bow in action ${i}`, `w${i}`)).not.toMatch(ACTIONS);
    }
  });

  it('action detection is a verb list, not "-ing"', () => {
    expect(hasActionInPrompt('drinking margaritas on a beach')).toBe(true);
    expect(hasActionInPrompt('a bowhuntress in action')).toBe(true);
    expect(hasActionInPrompt('a building in the morning wearing clothing')).toBe(false);
  });
});

describe('trimTruncatedPrompt', () => {
  it('drops the unfinished last clause', () => {
    expect(trimTruncatedPrompt('oil painting, a forest, quiet lethal tension, no')).toBe(
      'oil painting, a forest, quiet lethal tension'
    );
  });
  it('keeps a prompt with no comma', () => {
    expect(trimTruncatedPrompt('  a single clause  ')).toBe('a single clause');
  });
});

describe('a relationship word picks the +1 gender', () => {
  const p = (over: Partial<RosterPartner>): RosterPartner => ({
    id: over.id ?? 'x',
    description: 'a person',
    thumb_url: 'https://example.invalid/p.jpg',
    relationship: 'friend',
    ...over,
  });
  const LIB = [
    p({ id: 'daughter', gender: 'female', relationship: 'friend' }),
    p({ id: 'husband', gender: 'male', relationship: 'partner' }),
    p({ id: 'brother', gender: 'male', relationship: 'friend' }),
  ];

  it('reads one gendered relationship; none or both kinds is no signal', () => {
    expect(relationshipGender('Show me and my husband by Niagara Falls')).toEqual({
      word: 'husband',
      gender: 'male',
      spouse: true,
    });
    expect(relationshipGender('me and mom drinking margaritas')).toMatchObject({
      gender: 'female',
    });
    expect(relationshipGender('me and my wife and her dad')).toBeNull();
    expect(relationshipGender('me and Steph at the beach')).toBeNull();
  });

  it('a woman starred for "my husband" is replaced by the male partner', () => {
    expect(
      partnerForRelationship('Show me and my husband by Niagara Falls', 'female', LIB, null)
    ).toEqual({
      partner: LIB[1],
      stamp: 'cast_relationship_gender:husband:swapped',
    });
  });

  it('a family word prefers a family member (friend) over the spouse', () => {
    expect(
      partnerForRelationship('me and my brother fishing', 'female', LIB, null)!.partner!.id
    ).toBe('brother');
  });

  it('nothing to do when the default already fits or its gender is unknown', () => {
    expect(partnerForRelationship('me and my husband', 'male', LIB, null)).toBeNull();
    expect(partnerForRelationship('me and my husband', null, LIB, null)).toBeNull();
  });

  it('no fitting roster member → keep the default, stamp the mismatch', () => {
    expect(partnerForRelationship('me and my husband', 'female', [LIB[0]], null)).toEqual({
      partner: null,
      stamp: 'cast_relationship_gender:husband:kept_mismatch',
    });
  });
});

describe('nightly garment axis', () => {
  it('force_garment_roll is tri-state', () => {
    expect(parseQaFlags({}).force_garment_roll).toBeNull();
    expect(parseQaFlags({ force_garment_roll: true }).force_garment_roll).toBe(true);
    expect(parseQaFlags({ force_garment_roll: false }).force_garment_roll).toBe(false);
    expect(parseQaFlags({ force_garment_roll: 'yes' }).force_garment_roll).toBeNull();
  });

  const input = (): CharacterSlotPipelineInput => ({
    cast: [
      { role: 'plus_one', promptDesc: 'a woman, 38', gender: 'female' },
      { role: 'self', promptDesc: 'a man, 43', gender: 'male' },
    ],
    iconicAnchor: 'a pumpkin patch at dusk',
    userPlace: null,
    timeAxis: '',
    weatherAxis: '',
    phenomenaAxis: '',
    wardrobeAnchor:
      'Cream wool sweater, tweed vest in grey check, charcoal jeans, weathered leather boots.',
    realWorldLocation: false,
    mediumFluxFragment: 'a photograph',
    vibeDirective: 'warm',
    avoidList: '',
  });

  it('set: one line per person, the anchor demoted to inspiration, the gear escape', () => {
    const looks = rollFashion(['plus_one', 'self'], { plus_one: 'female', self: 'male' });
    const brief = buildSlotBrief({ ...input(), fashionLooks: looks });
    expect(brief).toMatch(/- LEFT \(the woman\): Garment: .+ Look: .+/);
    expect(brief).toMatch(/- RIGHT \(the man\): Look: .+/);
    expect(brief).toContain(
      'Borrow only its colours, textures and accessories, never its garments'
    );
    expect(brief).toContain('If the activity has its own clothing');
    expect(brief).not.toContain('WARDROBE REGISTER for this render');
  });

  it('unset or all-empty: the brief is what it was', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.42);
    try {
      const before = buildSlotBrief(input());
      expect(buildSlotBrief({ ...input(), fashionLooks: null })).toBe(before);
      expect(buildSlotBrief({ ...input(), fashionLooks: [null, null] })).toBe(before);
    } finally {
      spy.mockRestore();
    }
  });

  it('a holiday costume lock still wins over the looks', () => {
    const looks = rollFashion(['plus_one', 'self'], { plus_one: 'female', self: 'male' });
    const brief = buildSlotBrief({
      ...input(),
      fashionLooks: looks,
      costumeLock: ['a witch costume', 'a vampire costume'],
    });
    expect(brief).toContain('HOLIDAY COSTUME LOCK');
    expect(brief).not.toMatch(/Look: /);
  });
});

describe('nightly solo outfit early (mig 565)', () => {
  const solo = (): CharacterSlotPipelineInput => ({
    cast: [{ role: 'plus_one', promptDesc: 'a woman, 38', gender: 'female' }],
    iconicAnchor: 'Sag Harbor Cove waterfront',
    userPlace: null,
    timeAxis: '',
    weatherAxis: '',
    phenomenaAxis: '',
    wardrobeAnchor: null,
    realWorldLocation: true,
    mediumFluxFragment: 'grounded semi-realistic comic-book illustration',
    vibeDirective: 'hushed',
    avoidList: '',
  });
  const slots = {
    scene_description: 'mooring field in dense silver fog',
    wardrobe: 'ivory wrap-top ballet dress, soft layered blush tulle skirt.',
    mood: 'hushed',
    props: '',
  };

  it('puts the wardrobe right after the medium, before the scene, and only once', () => {
    const p = assembleCharacterPrompt(slots, { ...solo(), soloOutfitEarly: true });
    const med = p.indexOf('comic-book illustration');
    const wear = p.indexOf('wearing ivory wrap-top ballet dress');
    expect(wear).toBeGreaterThan(med);
    expect(wear).toBeLessThan(p.indexOf('set at Sag Harbor'));
    expect(p.split('ballet dress').length - 1).toBe(1);
    expect(p).not.toContain('tulle skirt.,');
  });

  it('off: the prompt is exactly the old one', () => {
    expect(assembleCharacterPrompt(slots, { ...solo(), soloOutfitEarly: false })).toBe(
      assembleCharacterPrompt(slots, solo())
    );
  });

  it('force_solo_outfit_early is tri-state', () => {
    expect(parseQaFlags({}).force_solo_outfit_early).toBeNull();
    expect(parseQaFlags({ force_solo_outfit_early: true }).force_solo_outfit_early).toBe(true);
    expect(parseQaFlags({ force_solo_outfit_early: false }).force_solo_outfit_early).toBe(false);
  });
});

/**
 * OUTFIT SPEC (CREATE_OUTFIT_PLAN.md, phase 2) — reading what the user asked each person to wear.
 *
 * The contract that matters: it may COPY the user, never invent for them; it strips face occluders by code;
 * and it is fail-open (a paid render must never be blocked or changed by a failed read).
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import {
  mentionsClothing,
  stripOccluders,
  buildOutfitSpecBrief,
  parseOutfitSpecReply,
  extractOutfitSpec,
  outfitSpecStamps,
  type OutfitPerson,
} from '@engine/outfitSpec';
import { callSonnet, type SonnetResult } from '@engine/llm';

const mockSonnet = callSonnet as jest.MockedFunction<typeof callSonnet>;
const reply = (text: string): void => {
  const r: SonnetResult = {
    text,
    brief: '',
    rawResponse: text,
    modelUsed: 'test',
    retries: 0,
    fellBackToSecondary: false,
  };
  mockSonnet.mockResolvedValue(r);
};
beforeEach(() => mockSonnet.mockReset());

const ME_M: OutfitPerson = { role: 'self', label: 'the user', gender: 'male' };
const ME_F: OutfitPerson = { role: 'self', label: 'the user', gender: 'female' };
const WIFE: OutfitPerson = { role: 'plus_one', label: "the user's wife", gender: 'female' };
const STEPH: OutfitPerson = { role: 'plus_one', label: 'Steph', gender: 'female' };

describe('mentionsClothing — the prefilter', () => {
  it.each([
    'Show me and my wife on a beach. She is wearing a pink bikini',
    'Me and Tiffany at the Kentucky Derby wearing fancy Hats!',
    'Show me in a red bikini at the beach',
    'Me and Steph in jeans and t-shirts at a bbq',
    "Imagine me wearing the 80's hairstyle, makeup and clothes",
    'Us in matching Christmas sweaters',
    'me in a tux',
    'Me and Brittany dressed up to nines at a Fashion Show',
  ])('fires on: %s', (p) => expect(mentionsClothing(p)).toBe(true));

  it.each([
    'Me and Steph snowboarding',
    'Me and my husband at the beach',
    'Show me hiking in Yosemite at sunrise',
    'a dragon over a castle',
    '',
  ])('stays quiet on: %s', (p) => expect(mentionsClothing(p)).toBe(false));

  it('handles null', () => expect(mentionsClothing(null)).toBe(false));
});

describe('stripOccluders — the face swap needs the face', () => {
  it.each([
    ['bikini and sunglasses', 'bikini', ['sunglasses']],
    ['sunglasses', null, ['sunglasses']],
    ['level 3 helmet', null, ['helmet']],
    ['Detroit Lions jersey with shades', 'Detroit Lions jersey', ['shades']],
    ['a ball gown and a masquerade mask', 'a ball gown and a masquerade', ['mask']],
    ['hoodie with the hood up', 'hoodie', ['hood up']],
    ['regency gown', 'regency gown', []],
  ])('%s → %s', (input, garment, dropped) => {
    const r = stripOccluders(input);
    expect(r.dropped).toEqual(dropped);
    if (garment === null) expect(r.garment).toBeNull();
    else expect(r.garment).toBe(garment);
  });

  it('null in, null out', () =>
    expect(stripOccluders(null)).toEqual({ garment: null, dropped: [] }));
});

describe('buildOutfitSpecBrief', () => {
  it('carries the prompt verbatim and a legend of who is who', () => {
    const b = buildOutfitSpecBrief('Show me and my wife on a beach', [ME_M, WIFE]);
    expect(b).toContain('REQUEST: "Show me and my wife on a beach"');
    expect(b).toMatch(/PERSON A: the user themself .* A man\./);
    expect(b).toMatch(/PERSON B: the user's wife .* A woman\./);
    expect(b).toContain('B_GARMENT:');
    expect(b).toContain('UNASSIGNED:');
    expect(b).toMatch(/Never invent/);
  });

  it('a solo brief has no person B and no UNASSIGNED line', () => {
    const b = buildOutfitSpecBrief('Show me in a bikini', [ME_F]);
    expect(b).toContain('A_GARMENT:');
    expect(b).not.toContain('B_GARMENT:');
    expect(b).not.toContain('UNASSIGNED');
  });
});

describe('parseOutfitSpecReply', () => {
  const beach =
    "Show me and my wife on a beach. She is wearing a pink bikini and I'm wearing green shorts with flowers.";

  it('reads a per-person request onto the right roles', () => {
    const r = parseOutfitSpecReply(
      `A_GARMENT: shorts
A_COLOUR: green
A_PATTERN: with flowers
B_GARMENT: bikini
B_COLOUR: pink
B_PATTERN: NONE
UNASSIGNED: NONE`,
      [ME_M, WIFE],
      beach
    );
    expect(r.byRole.self).toEqual({
      garment: 'shorts',
      colour: 'green',
      colourImplied: false,
      pattern: 'with flowers',
    });
    expect(r.byRole.plus_one).toEqual({
      garment: 'bikini',
      colour: 'pink',
      colourImplied: false,
      pattern: null,
    });
    expect(r.unassigned).toBeNull();
    expect(r.rejectedInventions).toEqual([]);
  });

  it('IMPLIED colours ride a garment (a team jersey keeps its colours)', () => {
    const r = parseOutfitSpecReply(
      'A_GARMENT: Detroit Lions jersey\nA_COLOUR: IMPLIED\nA_PATTERN: NONE',
      [ME_F],
      'Show me wearing a Detroit lions jersey at the game'
    );
    expect(r.byRole.self).toEqual({
      garment: 'Detroit Lions jersey',
      colour: null,
      colourImplied: true,
      pattern: null,
    });
  });

  it('IMPLIED with no garment means nothing', () => {
    const r = parseOutfitSpecReply(
      'A_GARMENT: NONE\nA_COLOUR: IMPLIED\nA_PATTERN: NONE',
      [ME_F],
      'me'
    );
    expect(r.byRole.self).toBeUndefined();
  });

  it('an all-NONE reply produces no spec', () => {
    const r = parseOutfitSpecReply(
      'A_GARMENT: NONE\nA_COLOUR: NONE\nA_PATTERN: NONE\nB_GARMENT: none\nB_COLOUR: n/a\nB_PATTERN: -\nUNASSIGNED: NONE',
      [ME_F, STEPH],
      'Me and Steph dressed up to the nines'
    );
    expect(r.byRole).toEqual({});
  });

  it('REFUSES an invented outfit — every value must share a word with what the user typed', () => {
    const r = parseOutfitSpecReply(
      'A_GARMENT: tailored linen suit\nA_COLOUR: navy\nA_PATTERN: pinstripe',
      [ME_M],
      'Show me at a rooftop bar in Manhattan'
    );
    expect(r.byRole.self).toBeUndefined();
    expect(r.rejectedInventions.sort()).toEqual(['navy', 'pinstripe', 'tailored linen suit']);
  });

  it('keeps plurals and singulars matching ("hat" vs "Hats")', () => {
    const r = parseOutfitSpecReply(
      'A_GARMENT: fancy hat\nA_COLOUR: NONE\nA_PATTERN: NONE\nB_GARMENT: fancy hat\nB_COLOUR: NONE\nB_PATTERN: NONE\nUNASSIGNED: NONE',
      [ME_F, STEPH],
      'Me and Steph at the Kentucky Derby wearing fancy Hats!'
    );
    expect(r.byRole.self.garment).toBe('fancy hat');
    expect(r.byRole.plus_one.garment).toBe('fancy hat');
  });

  it('strips occluders by code and records them', () => {
    const r = parseOutfitSpecReply(
      'A_GARMENT: bikini and sunglasses\nA_COLOUR: NONE\nA_PATTERN: NONE',
      [STEPH],
      'Show Stephie in a sexy bikini on the beach with sunglasses'
    );
    expect(r.byRole.plus_one.garment).toBe('bikini');
    expect(r.droppedOccluders).toEqual({ plus_one: ['sunglasses'] });
  });

  it('drops possessives and quotes, tolerates markdown labels and chatter', () => {
    const r = parseOutfitSpecReply(
      'Sure! Here you go:\n**A_GARMENT**: "her grey hoodie"\n**A_COLOUR**: grey.\nA_PATTERN: NONE',
      [ME_M],
      'Me in my grey hoodie at a coffee shop'
    );
    expect(r.byRole.self).toEqual({
      garment: 'grey hoodie',
      colour: 'grey',
      colourImplied: false,
      pattern: null,
    });
  });

  it('carries an UNASSIGNED phrase without locking it to anyone', () => {
    const r = parseOutfitSpecReply(
      'A_GARMENT: NONE\nA_COLOUR: NONE\nA_PATTERN: NONE\nB_GARMENT: NONE\nB_COLOUR: NONE\nB_PATTERN: NONE\nUNASSIGNED: one in a red dress',
      [ME_F, STEPH],
      'Me and Steph at brunch, one in a red dress'
    );
    expect(r.byRole).toEqual({});
    expect(r.unassigned).toBe('one in a red dress');
  });

  it('missing lines mean nothing was asked', () => {
    const r = parseOutfitSpecReply('A_GARMENT: tux', [ME_M, STEPH], 'me in a tux and Steph too');
    expect(r.byRole.self.garment).toBe('tux');
    expect(r.byRole.plus_one).toBeUndefined();
  });
});

describe('extractOutfitSpec — fail-open', () => {
  it('skips the call when the prompt names no clothing', async () => {
    const r = await extractOutfitSpec('Me and Steph snowboarding', [ME_M, STEPH], 'key');
    expect(r.source).toBe('skipped');
    expect(mockSonnet).not.toHaveBeenCalled();
  });

  it('skips without a key', async () => {
    const r = await extractOutfitSpec('me in a red bikini', [ME_F], undefined);
    expect(r.source).toBe('skipped');
  });

  it('a thrown call becomes source=error, never a throw', async () => {
    mockSonnet.mockRejectedValue(new Error('529 overloaded'));
    const r = await extractOutfitSpec('me in a red bikini', [ME_F], 'key');
    expect(r).toEqual({ source: 'error', result: null, error: '529 overloaded' });
  });

  it('reads a reply', async () => {
    reply('A_GARMENT: bikini\nA_COLOUR: red\nA_PATTERN: NONE');
    const r = await extractOutfitSpec('Show me in a red bikini at the beach', [ME_F], 'key');
    expect(r.source).toBe('read');
    expect(r.result && r.result.byRole.self).toEqual({
      garment: 'bikini',
      colour: 'red',
      colourImplied: false,
      pattern: null,
    });
  });
});

describe('outfitSpecStamps', () => {
  it('stamps none / partial / full, occluders, unassigned and refused inventions', () => {
    expect(outfitSpecStamps({ source: 'skipped', result: null }, 2)).toEqual(['outfit_spec:none']);
    expect(outfitSpecStamps({ source: 'error', result: null, error: 'boom' }, 2)).toEqual([
      'outfit_spec:fallback:boom',
    ]);
    const partial = parseOutfitSpecReply(
      'A_GARMENT: bikini and sunglasses\nA_COLOUR: NONE\nA_PATTERN: NONE\nB_GARMENT: NONE\nB_COLOUR: navy\nB_PATTERN: NONE\nUNASSIGNED: NONE',
      [ME_F, STEPH],
      'Me in a bikini and sunglasses and Steph at the pool'
    );
    expect(outfitSpecStamps({ source: 'read', result: partial }, 2)).toEqual([
      'outfit_spec:partial',
      'outfit_occluder_dropped:self:sunglasses',
      'outfit_spec_rejected:1',
    ]);
  });
});

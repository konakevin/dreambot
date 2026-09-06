/**
 * actionSafety.ts — the swap-safe envelope validator shared by Option B (locationActionBeat)
 * and scene-first actions (SCENE_FIRST_ACTION_PLAN.md).
 *
 * Locks: (1) parity with scripts/lib/posePoolLint.js (the seed scanner's proximity trio)
 * and with the regexes Option B has run in production; (2) scene-fit beats pass; (3) every
 * swap-breaking class is rejected with a named reason so the fallback stamp is diagnosable.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import {
  validateActionBeat,
  normalizeActionBeat,
  depronounActionBeat,
  UNSAFE_WORDS,
  TOO_ENERGETIC,
  DUAL_PROXIMITY_VIOLATION,
  DUAL_PROXIMITY_MITIGATED,
  DUAL_PROXIMITY_ALLOW,
} from '@engine/actionSafety';
import * as optionB from '@engine/locationActionBeat';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const lint = require('../../scripts/lib/posePoolLint.js');

describe('actionSafety — parity with the node seed scanner + Option B', () => {
  it('dual proximity trio is byte-identical to scripts/lib/posePoolLint.js', () => {
    expect(DUAL_PROXIMITY_VIOLATION.source).toBe(lint.VIOLATION.source);
    expect(DUAL_PROXIMITY_MITIGATED.source).toBe(lint.MITIGATED.source);
    expect(DUAL_PROXIMITY_ALLOW.source).toBe(lint.ALLOW.source);
  });
  it('Option B still exports its beat generator (it now imports the shared regexes)', () => {
    expect(typeof optionB.generateLocationActionBeat).toBe('function');
    expect(UNSAFE_WORDS.test('a witch mask')).toBe(true);
    expect(TOO_ENERGETIC.test('arms raised overhead')).toBe(true);
  });
});

const GOOD_SOLO = [
  'stirring a bubbling green cauldron with a long wooden spoon, one hand steadying the rim',
  'lifting a carved jack-o-lantern with both hands at chest height, candlelight flickering on the sleeves',
  'trailing fingertips through tall meadow grass at hip height',
  'sitting on the porch step with a mug cradled in both hands, a plaid blanket over the knees',
  'clapping along to the live music, shoulders loose and swaying',
];
const GOOD_DUAL = [
  'one handing a candy pail across a clear gap, the other holding a glowing lantern at hip height',
  "standing a comfortable arm's length apart, one leafing through a glowing grimoire, the other lifting a potion bottle to chest level",
  'both leaning back against a fence with a clear gap between them, arms hanging naturally at their sides',
  'one stirring the cauldron, the other a step apart sorting glowing potion bottles on the shelf',
];

describe('validateActionBeat — scene-fit beats pass', () => {
  it.each(GOOD_SOLO)('solo ok: %s', (b) => expect(validateActionBeat(b, 1)).toEqual({ ok: true }));
  it.each(GOOD_DUAL)('dual ok: %s', (b) => expect(validateActionBeat(b, 2)).toEqual({ ok: true }));
});

describe('validateActionBeat — every swap-breaking class is rejected with a reason', () => {
  const cases: Array<[string, 1 | 2, string]> = [
    ['pulling a witch mask down over the brow', 1, 'unsafe_word'],
    ['hood up against the wind, hands in pockets', 1, 'unsafe_word'],
    ['taking a selfie with the pumpkins', 1, 'unsafe_word'],
    ['one kissing the other on the porch', 2, 'unsafe_word'],
    ['jumping into a pile of leaves', 1, 'too_energetic'],
    ['arms raised overhead in triumph', 1, 'too_energetic'],
    ['facing each other over the cauldron, hands on the rim', 2, 'direction'],
    ['looking at the moon from the hayride', 1, 'direction'],
    ['seen from behind walking up the porch steps', 1, 'direction'],
    ['she stirs the cauldron while the other reads', 2, 'pronoun'],
    ['standing close together on the hayride wagon, arms linked', 2, 'proximity'],
    ['leaning into each other on the hay bale', 2, 'proximity'],
    ['shoulder to shoulder at the candy counter', 2, 'proximity'],
    ['chin tilted upward toward the enormous moon, hands clasped at the waist', 1, 'gaze'],
    ['one with head tilted slightly down in quiet thought, the other a step apart', 2, 'gaze'],
    ['consulting an open pocket watch with measured attention', 1, 'gaze'],
    [
      'tracing a glowing line of ancient text, reading the open manuscript at chest level',
      1,
      'gaze',
    ],
    ['studying the carved pumpkin towers above, fingers resting at the sides', 1, 'gaze'],
    [
      'holds an open grimoire at chest level, one hand pressing the spine, the other tracing a glowing diagram',
      1,
      'gaze',
    ],
    ['turning the page of a spellbook resting on the lectern', 1, 'gaze'],
    [
      'standing motionless between two potted orange trees, a folded letter held at hip level',
      1,
      'passive',
    ],
    [
      'one hand pressing a crumpled ticket to the counter, shoulders slumped, waiting with patient resignation',
      1,
      'passive',
    ],
    [
      'one stirs the cauldron with a long spoon while lifting the iron lid and steadying the pot, the other a step apart pours a green potion from a tall bottle into small jars on the crooked shelf under the herbs and candles by the door of the old cottage near the moonlit gate while a black cat watches from the sill above the basin',
      2,
      'too_long',
    ],
    [
      'lifting a carved pumpkin onto the wall with both hands while a lantern swings from one wrist and leaves scatter across the wet stone path under the moon',
      1,
      'too_long',
    ],
    ['ok', 1, 'length'],
    ['', 2, 'length'],
  ];
  it.each(cases)('rejects "%s" (cast %i) → %s', (b, n, reason) =>
    expect(validateActionBeat(b, n)).toEqual({ ok: false, reason })
  );
  it('a 30-word couple beat passes (per-cast cap)', () => {
    expect(
      validateActionBeat(
        'The man carefully lifts a glowing jack-o-lantern from the ottoman, the woman arranges tall tapered candles into the silver candelabra a comfortable distance away from the mantel',
        2
      )
    ).toEqual({ ok: true });
  });
  it('couples may sit too (2026-09-06 stance variety)', () => {
    expect(
      validateActionBeat(
        'sitting together on hay bales with mugs of cider, a clear gap between them',
        2
      )
    ).toEqual({ ok: true });
  });
  it('allows a solo to sit', () => {
    expect(
      validateActionBeat('sitting on a hay bale with a mug of cider in both hands', 1)
    ).toEqual({ ok: true });
  });
  it('proximity to an OBJECT is not a proximity violation', () => {
    expect(
      validateActionBeat(
        'one standing close to the bonfire warming both hands, the other a step apart with a lantern',
        2
      )
    ).toEqual({ ok: true });
  });
});

describe('depronounActionBeat', () => {
  it('rewrites pronouns to gendered role nouns so the beat survives the validator', () => {
    const out = depronounActionBeat('She lifts the lantern while he steadies his hat at her side');
    expect(out).toBe(
      "the woman lifts the lantern while the man steadies the man's hat at the woman's side"
    );
    expect(validateActionBeat(out, 2)).toEqual({ ok: true });
  });
  it('leaves words that merely contain pronoun letters alone', () => {
    expect(depronounActionBeat('the hearth sheds warm light on the shelf')).toBe(
      'the hearth sheds warm light on the shelf'
    );
  });
});

describe('normalizeActionBeat', () => {
  it('takes the first line, strips quotes and collapses whitespace', () => {
    expect(normalizeActionBeat('"stirring   the cauldron"\nsecond line')).toBe(
      'stirring the cauldron'
    );
  });
});

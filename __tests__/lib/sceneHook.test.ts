/**
 * Scene hook — unit locks for the background-drowning fix (2026-09-02).
 *
 * buildSceneHook distills a scene_description into a short location appositive
 * that rides the EARLY "set at <location>" slot of face-swap prompts (the tail-
 * positioned scene_description gets attention-starved; see sceneHook.ts).
 *
 * This is heuristic string surgery on the most safety-critical prompt in the
 * app, so every step is locked: clause splitting, location-restatement
 * filtering, the dominance-cue ban (the 2026-06-19 dual-swap footgun), the
 * word cap, and end-to-end composition on the REAL prompts from Kevin's
 * hearted plain-background dreams.
 */

import {
  buildSceneHook,
  splitClauses,
  significantWords,
  clauseRestatesLocation,
  hasDominanceCue,
  capWords,
  MAX_HOOK_WORDS,
  MAX_HOOK_CLAUSES,
} from '@engine/sceneHook';

// Real scene_descriptions from the hearted plain-background dreams.
const SEOUL_LOC = 'Seoul Lotte World Tower elliptical glass crown';
const SEOUL_SCENE =
  'Seoul Lotte World Tower elliptical glass crown observation deck, amber-copper light fracturing across curved glass panels, anvil thunderhead rising beyond the financial district, synchronized emergency strobes pulsing blue and red reflections across every mirrored surface below.';
const ATHENS_LOC = 'Tower of the Winds octagonal marble clock Athens';
const ATHENS_SCENE =
  'Octagonal marble Tower of the Winds, Athens, bathed in amber-rose scirocco haze; ancient carved friezes softened by Saharan dust veil; enormous amber moon lifting over rooftops, warm dusk light pooling on worn limestone steps.';

describe('significantWords', () => {
  it('lowercases and drops short glue words', () => {
    expect(significantWords('The Tower of the Winds at Dusk')).toEqual(['tower', 'winds', 'dusk']);
  });
  it('empty input → empty list', () => {
    expect(significantWords('')).toEqual([]);
    expect(significantWords('a of at')).toEqual([]);
  });
});

describe('splitClauses', () => {
  it('splits on comma, semicolon, and period; trims; drops empties', () => {
    expect(splitClauses('one, two; three. four,, ')).toEqual(['one', 'two', 'three', 'four']);
  });
  it('splits on em/en dashes and colons (live bug: a location restatement hid inside an em-dash clause)', () => {
    expect(
      splitClauses('golden hour — symmetrical stone terraces – reflecting pond: still water')
    ).toEqual(['golden hour', 'symmetrical stone terraces', 'reflecting pond', 'still water']);
  });
  it('does not split hyphenated words', () => {
    expect(splitClauses('rain-slicked stonework under amber-rose haze')).toEqual([
      'rain-slicked stonework under amber-rose haze',
    ]);
  });
  it('empty input → no clauses', () => {
    expect(splitClauses('')).toEqual([]);
  });
});

describe('buildSceneHook — em-dash restatement regression (Bicton live bug)', () => {
  it('filters a location restatement that leads an em-dash clause', () => {
    const hook = buildSceneHook(
      "Bicton's Italian Garden at golden hour — symmetrical stone terraces descending to a reflecting pond, mist drifting over clipped hedges",
      "Bicton's Italian Garden formal terraces and pond"
    );
    expect(hook).not.toMatch(/Bicton/);
    expect(hook.length).toBeGreaterThan(0);
  });
});

describe('clauseRestatesLocation', () => {
  it('flags a clause that mostly repeats the location name', () => {
    expect(
      clauseRestatesLocation(
        'Seoul Lotte World Tower elliptical glass crown observation deck',
        SEOUL_LOC
      )
    ).toBe(true);
  });
  it('passes a clause about the scene, not the location name', () => {
    expect(
      clauseRestatesLocation('anvil thunderhead rising beyond the financial district', SEOUL_LOC)
    ).toBe(false);
  });
  it('a clause with no significant words counts as a restatement (nothing to promote)', () => {
    expect(clauseRestatesLocation('at of an', SEOUL_LOC)).toBe(true);
  });
  it('empty location → nothing can restate it', () => {
    expect(clauseRestatesLocation('golden light over the water', '')).toBe(false);
  });
});

describe('hasDominanceCue — the 2026-06-19 dual-swap footgun words', () => {
  it.each([
    'the scene fills the background',
    'rich environmental detail',
    'layered depth everywhere',
    'a dominant skyline',
    'sprawling cityscape',
    'light filling the frame',
  ])('bans: %s', (c) => {
    expect(hasDominanceCue(c)).toBe(true);
  });
  it.each([
    'anvil thunderhead rising beyond the financial district',
    'enormous amber moon lifting over rooftops',
    'warm dusk light pooling on worn limestone steps',
  ])('allows: %s', (c) => {
    expect(hasDominanceCue(c)).toBe(false);
  });
});

describe('capWords', () => {
  it(`caps at ${MAX_HOOK_WORDS} whole words`, () => {
    const long = Array.from({ length: 30 }, (_, i) => `w${i}`).join(' ');
    const capped = capWords(long);
    expect(capped.split(' ')).toHaveLength(MAX_HOOK_WORDS);
    expect(capped.startsWith('w0 w1')).toBe(true);
  });
  it('leaves short phrases untouched', () => {
    expect(capWords('three word phrase')).toBe('three word phrase');
  });
});

describe('buildSceneHook — end to end on the real failure cases', () => {
  it('Seoul: skips the location-restating deck clause, promotes the storm + light', () => {
    const hook = buildSceneHook(SEOUL_SCENE, SEOUL_LOC);
    expect(hook).toContain('amber-copper light fracturing across curved glass panels');
    expect(hook).toContain('anvil thunderhead');
    expect(hook).not.toContain('observation deck'); // restatement clause skipped
    expect(hook.split(/\s+/).length).toBeLessThanOrEqual(MAX_HOOK_WORDS);
  });

  it('Athens: promotes the haze/friezes, skips the tower-name clause', () => {
    const hook = buildSceneHook(ATHENS_SCENE, ATHENS_LOC);
    expect(hook).not.toMatch(/Tower of the Winds/i); // restatement skipped
    expect(hook).toContain('amber-rose scirocco haze');
    expect(hook.split(/\s+/).length).toBeLessThanOrEqual(MAX_HOOK_WORDS);
  });

  it(`takes at most ${MAX_HOOK_CLAUSES} clauses`, () => {
    const hook = buildSceneHook('red lanterns, gold rooftops, blue mist, green hills', 'Nowhere');
    // 2 clauses only
    expect(hook).toBe('red lanterns, gold rooftops');
  });

  it('never carries a dominance cue into the early window', () => {
    const hook = buildSceneHook(
      'a skyline that fills the background, quiet lantern-lit alley, misty harbor',
      'Hong Kong'
    );
    expect(hook).toBe('quiet lantern-lit alley, misty harbor');
    expect(hasDominanceCue(hook)).toBe(false);
  });

  it('empty scene → empty hook (caller emits bare "set at <location>")', () => {
    expect(buildSceneHook('', SEOUL_LOC)).toBe('');
  });

  it('scene that ONLY restates the location → empty hook', () => {
    expect(buildSceneHook('Seoul Lotte World Tower glass crown.', SEOUL_LOC)).toBe('');
  });

  it('empty location still yields a hook from the scene', () => {
    const hook = buildSceneHook('golden mist over rice terraces, distant thunder', '');
    expect(hook).toBe('golden mist over rice terraces, distant thunder');
  });
});

import { settingClauseOf } from '@engine/sceneHook';

describe('settingClauseOf — scenario set-at diet (the Tiffany camel render)', () => {
  it('takes only the setting from a choreography-heavy seed', () => {
    expect(
      settingClauseOf(
        'Desert dunes at sunrise, a colossal friendly camel sitting behind them absolutely enormous smiling; she holds sunglasses at chest height grinning wide, he stands one fist low at hip smirking bold at camera.'
      )
    ).toBe('Desert dunes at sunrise');
  });
  it('keeps a compact setting clause whole', () => {
    expect(
      settingClauseOf('Rooftop terrace above a glittering city skyline, fireworks overhead')
    ).toBe('Rooftop terrace above a glittering city skyline');
  });
  it('caps at 12 words', () => {
    const long = Array.from({ length: 20 }, (_, i) => `w${i}`).join(' ');
    expect(settingClauseOf(long).split(' ')).toHaveLength(12);
  });
  it('empty → empty', () => {
    expect(settingClauseOf('')).toBe('');
  });
});

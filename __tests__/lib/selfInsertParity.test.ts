/**
 * Parity lock: lib/selfInsertDetect.ts (the RN client mirror that drives the
 * Create screen's live face-swap indicator) must agree with the engine's
 * _shared/selfInsertDetector.ts on every prompt — otherwise the indicator
 * lies about whether a dream will cast real faces. If this fails, someone
 * changed one module's detection logic or word lists without the other.
 */

import {
  detectSelfInsert,
  DEFAULT_RELATIONSHIP_WORDS,
  DEFAULT_PET_WORDS,
  DEFAULT_NAME_STOP_WORDS,
  MIN_CAST_NAME_LENGTH,
} from '@engine/selfInsertDetector';
import {
  detectCastRoles,
  detectCastRefs,
  DEFAULT_RELATIONSHIP_WORDS as CLIENT_REL_WORDS,
  DEFAULT_PET_WORDS as CLIENT_PET_WORDS,
  DEFAULT_NAME_STOP_WORDS as CLIENT_STOP_WORDS,
  MIN_CAST_NAME_LENGTH as CLIENT_MIN_NAME,
} from '../../lib/selfInsertDetect';

const PROMPTS = [
  // self
  'me flying over the city',
  'put me in a castle',
  'make me a superhero',
  'I am walking on the beach',
  "I'm dancing in the rain",
  'a selfie at the eiffel tower',
  'my face carved into a mountain',
  'my childhood home in autumn',
  // plus_one
  'my wife at a bbq',
  'my wife and I dancing',
  'my boyfriend surfing a wave',
  'my plus one and me at prom',
  'my best friend on a rollercoaster',
  // pet
  'my dog catching a frisbee',
  'my cat as a wizard',
  'me and my dog camping',
  // none / imperatives
  'show me a castle',
  'give me some dragons',
  'let me see a sunset over the ocean',
  'a lighthouse in a storm',
  'two dragons fighting over treasure',
  'metallic robot in a junkyard',
  // tricky
  'show me in a spacesuit',
  'show me as a pirate',
  'the memes were funny', // "me" inside a word must not match
  '',
  '   ',
  // over-eager "my" catch-all regressions (2026-07-01) — 'my childhood home'
  // above also covers the no-longer-self generic possessive
  'My',
  'My annoying car in the sun',
  'a diamond mine at dusk',
  // standalone plus-one jargon
  'me and +1 at the beach',
  'plus one on a rooftop in tokyo',
  'me and my plus 1 at a wedding',
  '5+1 dragons flying in formation',
  // descriptor words between "my" and the noun
  'my sexy wife in hawaii',
  'my absolutely gorgeous girlfriend at sunset',
  'my fluffy dog on a surfboard',
  'my beautiful long hair flowing',
  // couple construction + garbled "and" (2026-07-10) — must agree in BOTH runtimes
  'me and my wife at the beach',
  'show me an my wife at the beach',
  'me an the wife at the beach',
  "me 'n the wife",
  'me ’n the wife',
  'me n the wife at sunset',
  'me & my wife',
  'me + my wife',
  'me nd my wife',
  'me an my beautiful wife',
  'a photo of me an my wife on a boat',
  'the wife and me at the beach',
  'my husband & me',
  'our daughter n me at the park',
  'me and my wife and my dog',
  // couple false-positives — the connector guard must agree it did NOT fire
  'show me a photo of my wife',
  'show me an apple',
  'show me an hour with the dragons',
  'the wife at the beach',
  'men and my wife dancing',
  'someone and my wife',
  'me and my dog',
  'my dog and me hiking',
  'me and a castle',
  // cast names — the prompts below run against the CAST fixture too
  'me and Steph at the beach',
  'Steph and me on a rooftop',
  'steph and i in paris',
  'Steph at the beach',
  'me and steph and my dog',
  'me and Dawn at the beach',
  'a walk at dawn by the river',
  'me and Bo at the park',
  'me and Taylor in the rain',
  'me and The Eiffel Tower',
];

/** A roster with the shapes that actually bite: a normal name, a name that is also
 *  scenery (Dawn), one below the length floor (Bo), and one that IS a relationship
 *  word (Mom) and must therefore never match as a name. */
const CAST = [
  { id: 'p1', name: 'Steph' },
  { id: 'p2', name: 'Dawn' },
  { id: 'p3', name: 'Bo' },
  { id: 'p4', name: 'Mom' },
];

describe('client detector parity with engine selfInsertDetector', () => {
  it('default word lists are identical', () => {
    expect(CLIENT_REL_WORDS).toBe(DEFAULT_RELATIONSHIP_WORDS);
    expect(CLIENT_PET_WORDS).toBe(DEFAULT_PET_WORDS);
    expect(CLIENT_STOP_WORDS).toBe(DEFAULT_NAME_STOP_WORDS);
    expect(CLIENT_MIN_NAME).toBe(MIN_CAST_NAME_LENGTH);
  });

  it.each(PROMPTS)('agrees with the engine on: "%s"', (prompt) => {
    const engine = detectSelfInsert(prompt);
    const client = detectCastRoles(prompt);
    expect(client.size > 0).toBe(engine.isSelfInsert);
    expect([...client].sort()).toEqual([...engine.referencedRoles].sort());
  });

  it.each(PROMPTS)('agrees under admin word-list overrides on: "%s"', (prompt) => {
    const words = {
      relationshipWords: 'wife|husband|sidekick',
      petWords: 'dog|axolotl',
      selfRefRegex: "\\b(I|I'm|myself|yours truly)\\b",
    };
    const engine = detectSelfInsert(prompt, words);
    const client = detectCastRoles(prompt, words);
    expect([...client].sort()).toEqual([...engine.referencedRoles].sort());
  });

  // The client resolves a name to show that person's FACE on the Create screen before
  // the user spends anything, and the engine resolves it to actually cast them. If the
  // two ever disagree, the preview becomes a lie — the exact failure this file exists
  // to prevent, now for people as well as roles.
  it.each(PROMPTS)('agrees on WHICH cast member is named in: "%s"', (prompt) => {
    const engine = detectSelfInsert(prompt, { castNames: CAST });
    const client = detectCastRefs(prompt, { castNames: CAST });
    expect([...client.roles].sort()).toEqual([...engine.referencedRoles].sort());
    expect(client.matchedPartnerId).toBe(engine.matchedPartnerId);
    expect(client.unmatchedName).toBe(engine.unmatchedName);
  });
});

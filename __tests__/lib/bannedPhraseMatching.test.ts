/**
 * Locks the banned-phrase matcher against BOTH directions of failure.
 *
 * The old check was `text.toLowerCase().includes(phrase)` — a raw substring test
 * with no notion of word edges — so ordinary on-brief words that happen to
 * contain a banned string killed the render outright:
 *
 *   "harvestman"  contains  "man "   (a real arachnid, entirely on-brief)
 *   "personally"  contains  "person"
 *   "personality" contains  "person"
 *
 * Measured on DinoBot `amber-forest`: 3 of 16 renders (19%) died at
 * `banned-phrase-check` on correct content. It was near-impossible to diagnose —
 * nothing was logged about what matched, the abort happens before model
 * selection so `bot_run_log` stamped the wrong model, and a brief-only probe
 * could not reproduce it because it depends which pool entry rolled.
 *
 * Both directions matter, which is why they are both asserted here:
 *   - UNDER-BLOCKING would put a human in a render on a no-humans bot, the
 *     single worst content failure these bots have.
 *   - OVER-BLOCKING silently throws away correct renders, which is what was
 *     actually happening.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { findBannedPhrase } = require('../../scripts/lib/botEngine');

/** DinoBot's real list, verbatim — including the hand-rolled `'man '` entry. */
const DINO_BANS = [
  'human',
  'person',
  'people',
  'man ',
  'woman',
  'child',
  'hunter',
  'explorer',
  'scientist',
  'ranger',
  'tourist',
];

describe('findBannedPhrase — must not kill correct renders', () => {
  it('is exported from botEngine', () => {
    expect(typeof findBannedPhrase).toBe('function');
  });

  // THE REGRESSION. Each of these cost a real render.
  const mustPass: [string, string][] = [
    ['harvestman', 'a harvestman picking its way across the litter'],
    ['personally', 'the grove personally shaped by decades of wind'],
    ['personality', 'a trunk with the personality of an old animal'],
    // same class, not yet observed but the identical mechanism
    ['humanoid-free compound', 'the resin flowed over a mandible and hardened'],
    ['manganese', 'manganese staining dark across the rock face'],
    ['childlike is caught, but mantle is not', 'a mantle of moss over the boulder'],
  ];

  it.each(mustPass)('allows on-brief text: %s', (_label: string, text: string) => {
    const hit = findBannedPhrase(text, DINO_BANS);
    expect(hit).toBeNull();
  });

  // THE POINT OF THE LIST. These must still be caught.
  const mustBlock: [string, string][] = [
    ['a bare "man"', 'a man stands at the tree-line'],
    ['plural', 'two men walking'.replace('men', 'man s')], // 'man s' -> inflection form
    ['human', 'a human figure in the distance'],
    ['humans plural', 'humans crossing the ridge'],
    ['person', 'a person crouched by the water'],
    ['persons', 'several persons on the ridge'],
    ['people', 'people gathered under the tree'],
    ['child', 'a child running ahead'],
    ['children — the inflection case', 'children running ahead of the herd'],
    ['woman', 'a woman beside the nest'],
    ['scientist', 'a scientist taking notes'],
    ['tourist', 'tourists photographing the herd'],
  ];

  it.each(mustBlock)('still blocks: %s', (_label: string, text: string) => {
    const hit = findBannedPhrase(text, DINO_BANS);
    expect(hit).not.toBeNull();
  });

  it('reports the phrase, the literal match and surrounding context', () => {
    // Context is what makes a failure diagnosable at all — the old code logged
    // nothing, so a killed render left no trace of its cause.
    const hit = findBannedPhrase(
      'deep litter, a person crouched by the water, ferns above',
      DINO_BANS
    );
    expect(hit.phrase).toBe('person');
    expect(hit.matched.toLowerCase()).toBe('person');
    expect(hit.context).toContain('crouched');
  });

  it('is case-insensitive', () => {
    expect(findBannedPhrase('A Person here', DINO_BANS)).not.toBeNull();
    expect(findBannedPhrase('A HARVESTMAN here', DINO_BANS)).toBeNull();
  });

  it('handles an empty or missing list without throwing', () => {
    expect(findBannedPhrase('anything at all', [])).toBeNull();
    expect(findBannedPhrase('anything at all', undefined)).toBeNull();
    expect(findBannedPhrase('', DINO_BANS)).toBeNull();
  });

  it('treats a list entry with a trailing space the same as without', () => {
    // 'man ' was the hand-rolled way of faking a word boundary; real boundaries
    // make it unnecessary, and the two spellings must now behave identically.
    const withSpace = findBannedPhrase('a man stands there', ['man ']);
    const without = findBannedPhrase('a man stands there', ['man']);
    expect(withSpace).not.toBeNull();
    expect(without).not.toBeNull();
    expect(findBannedPhrase('a harvestman there', ['man '])).toBeNull();
  });

  it('does not let a regex metacharacter in a ban entry throw', () => {
    expect(() => findBannedPhrase('some text (here)', ['(here)', 'a+b'])).not.toThrow();
    expect(findBannedPhrase('some text (here)', ['(here)'])).not.toBeNull();
  });
});

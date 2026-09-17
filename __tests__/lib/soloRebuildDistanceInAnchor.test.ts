/**
 * A rebuilt single carries its distance line where flux-1.1-pro obeys it — in the ANCHOR, before the
 * face clause — not in the tail framing block ~1,400 characters in.
 *
 * Kevin, 2026-09-17, on three rebuilt singles in a row: "another huge face from this batch, completely
 * boring, can't see any background". Every one of those prompts DID say "shown from the knees up in a
 * three-quarter length composition" — at character ~1430. The round-16 fixed-seed probe measured it: the
 * same clause anywhere after the identity block left every seed a waist-up portrait; riding the anchor
 * before the face clause, all three seeds opened to knees-up shots with the scene visible.
 *
 * This is a BEHAVIOURAL lock on the assembled prompt, not a source grep: it asserts the ORDER of the
 * clauses in the string the model actually receives.
 */
import { assembleSoloFallbackFromDual } from '@engine/characterSlotPrompt';

const dualSlots = {
  scene_description: 'a rain-slick quarry gate under indigo washes',
  left_wardrobe: 'a charcoal doublet with riveted pauldrons',
  right_wardrobe: 'a wine-red velvet gown',
  mood: 'quiet awe',
  props: 'an iron lantern',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const dualInput = {
  cast: [
    {
      role: 'self',
      gender: 'male',
      castGender: 'male',
      age: 46,
      ethnicity: 'White',
      promptDesc: 'a man with a full head of light brown hair and a medium chestnut beard',
      identity: 'a White man with a full head of light brown hair, 46 years old',
    },
    {
      role: 'plus_one',
      gender: 'female',
      castGender: 'female',
      age: 38,
      ethnicity: 'White',
      promptDesc: 'a woman with long chestnut curls',
      identity: 'a White woman with long chestnut curls, 38 years old',
    },
  ],
  userPlace: 'Tombe Issoire quarry gate',
  mediumFluxFragment: 'transparent aquarelle over a faint graphite drawing',
  action: 'both leaning on the gate with a clear gap between their heads',
  promptStyle: 'subject_first',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const DISTANCE = 'shown from the knees up in a three-quarter length composition';

describe.each([
  ['lookNeutralFraming ON (nightly minimal, all surfaces)', { lookNeutralFraming: true }],
  ['lookNeutralFraming OFF (the Create rebuild twin)', {}],
])('the rebuilt single puts its distance line in the anchor — %s', (_label, extra) => {
  const prompt = assembleSoloFallbackFromDual(dualSlots, { ...dualInput, ...extra }, 0);

  it('carries the three-quarter distance clause at all', () => {
    expect(prompt).toContain(DISTANCE);
  });

  it('places it BEFORE the face-visibility clause (the position flux obeys)', () => {
    const distanceAt = prompt.indexOf(DISTANCE);
    const faceAt = prompt.indexOf('face clearly visible');
    expect(faceAt).toBeGreaterThan(-1);
    expect(distanceAt).toBeGreaterThan(-1);
    expect(distanceAt).toBeLessThan(faceAt);
  });

  it('and BEFORE the identity block — not ~1,400 characters in', () => {
    const distanceAt = prompt.indexOf(DISTANCE);
    const characterAt = prompt.indexOf('CHARACTER:');
    expect(characterAt).toBeGreaterThan(-1);
    expect(distanceAt).toBeLessThan(characterAt);
    expect(distanceAt).toBeLessThan(700);
  });

  it('is a solo of the SELF member — the partner and the couple action are gone', () => {
    expect(prompt).toContain('ONE person alone');
    expect(prompt).not.toContain('velvet gown');
    expect(prompt).not.toContain('clear gap between their heads');
  });
});

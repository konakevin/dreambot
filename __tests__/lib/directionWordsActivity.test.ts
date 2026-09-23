/**
 * ACTIVITY NAMES ARE NOT A GAZE (2026-09-23).
 *
 * The slot validator bans eye-direction words ("watching", "gazing") because they turn a face away from the lens or
 * lock two faces on each other. But "whale watching" names the outing, so a user's "Summer and I are whale
 * watching" failed both Sonnet attempts and the scene was swapped for the generic fallback (3 of 3 in the outfit
 * harness). Locks: the activity names pass, the real eye-direction phrases still fail, and the action-beat filter
 * (actionSafety DIRECTION_WORDS) agrees with the slot validator on every case.
 */
import { validateSlots } from '@engine/characterSlotPrompt';
import { DIRECTION_WORDS } from '@engine/actionSafety';

const coupleIn = (scene: string) => ({
  scene_description: scene,
  left_wardrobe: 'a coral linen sailing jacket with brass buttons over navy wide-leg trousers',
  right_wardrobe: 'a sea-green silk wrap dress with a white rope belt',
  mood: 'bright and breezy',
  props: '',
});
const gazeViolations = (scene: string) =>
  validateSlots(coupleIn(scene)).filter((v) => v === 'watching-staring' || v === 'gazing');

const ACTIVITIES = [
  'a whale watching boat rocking on a bright bay',
  'the bow of a whale-watching tour off the Maui coast',
  'bird watching in a golden marsh at dawn',
  'a star gazing night in the high desert',
  'stargazing on a rooftop under the Milky Way',
  'people watching at a Parisian sidewalk cafe',
  'a dolphin watching cruise at sunset',
];

const GAZES = [
  'the couple watching the sunset over the harbor',
  'both watching whales breach off the bow',
  'gazing at the stars from a desert camp',
  'staring into a crackling campfire',
  'observing the city lights from a balcony',
  'peering over the edge of the canyon',
];

describe('the slot validator', () => {
  it.each(ACTIVITIES)('lets the activity name through: %s', (scene) => {
    expect(gazeViolations(scene)).toEqual([]);
  });

  it.each(GAZES)('still rejects a real gaze: %s', (scene) => {
    expect(gazeViolations(scene).length).toBeGreaterThan(0);
  });
});

describe('the action-beat filter agrees with the slot validator', () => {
  it.each([...ACTIVITIES, ...GAZES])('%s', (text) => {
    expect(DIRECTION_WORDS.test(text)).toBe(gazeViolations(text).length > 0);
  });
});

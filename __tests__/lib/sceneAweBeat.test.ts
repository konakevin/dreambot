/**
 * Tests for rollSceneAweBeat — scene-only nightly L4 awe/moment beat.
 *
 * Locks the gating invariants so the pure-scene brief never gets an
 * out-of-place spectacle (a meteor shower on an overcast day, a moonrise at
 * noon, any beat inside an intimate café) and so no beat ever smuggles in a
 * person or animal (the pure-scene HARD BANS).
 */

import { rollSceneAweBeat } from '@engine/sceneAweBeat';

const first = () => 0; // picks the first eligible beat
const last = () => 0.9999; // picks the last eligible beat

// Exhaustively collect every beat the roller can emit for a given time/weather
// by sweeping the rand across the eligible range.
function allBeatsFor(time: string, weather: string, intimate = false): string[] {
  const out = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const beat = rollSceneAweBeat(time, weather, intimate, () => i / 200);
    if (beat) out.add(beat);
  }
  return [...out];
}

describe('rollSceneAweBeat', () => {
  it('returns null for intimate / interior scenes', () => {
    expect(rollSceneAweBeat('golden hour', 'clear skies', true, first)).toBeNull();
    expect(rollSceneAweBeat('starry midnight', 'clear', true, last)).toBeNull();
  });

  it('night beats never appear during the day and vice versa', () => {
    const day = allBeatsFor('bright midday sun', 'clear skies');
    expect(day.length).toBeGreaterThan(0);
    expect(day.some((b) => /moon|meteor|milky way|aurora|comet|lantern|fireworks/i.test(b))).toBe(
      false
    );

    const night = allBeatsFor('starry midnight', 'clear night');
    expect(night.length).toBeGreaterThan(0);
    expect(night.some((b) => /rainbow|blossom|eclipse/i.test(b))).toBe(false);
  });

  it('clear-sky beats are excluded under stormy / overcast weather', () => {
    const stormyNight = allBeatsFor('midnight', 'heavy overcast storm');
    // celestial beats need a clear sky — gone; weather-agnostic ones survive
    expect(stormyNight.some((b) => /moon|meteor|milky way|aurora|comet/i.test(b))).toBe(false);
    expect(stormyNight.some((b) => /lantern|fireworks/i.test(b))).toBe(true);
  });

  it('a clear night can produce a celestial spectacle', () => {
    const night = allBeatsFor('starry midnight', 'crisp clear');
    expect(night.some((b) => /moon|meteor|milky way|aurora|comet/i.test(b))).toBe(true);
  });

  it('NO beat ever contains a person or animal (pure-scene HARD BANS)', () => {
    const everything = [
      ...allBeatsFor('bright midday', 'clear'),
      ...allBeatsFor('starry midnight', 'clear'),
      ...allBeatsFor('midnight', 'stormy overcast'),
    ];
    expect(everything.length).toBeGreaterThan(0);
    const forbidden =
      /\b(person|people|man|woman|figure|traveler|crowd|bird|animal|creature|deer|whale|dog|cat|horse)\b/i;
    everything.forEach((b) => expect(b).not.toMatch(forbidden));
  });

  it('is deterministic given a fixed rand', () => {
    const a = rollSceneAweBeat('starry midnight', 'clear', false, first);
    const b = rollSceneAweBeat('starry midnight', 'clear', false, first);
    expect(a).toBe(b);
    expect(a).not.toBeNull();
  });
});

/**
 * Scene awe / moment beat (scene-only nightly L4).
 *
 * A rolled, transient "the scene is HAPPENING" spectacle layered onto a
 * pure-scene render so the place feels caught at a rare, unforgettable moment
 * (an enormous moonrise, a meteor shower, a double rainbow) instead of a flat
 * stock postcard. Modeled on nightly's Option B location-action beat, but for
 * a no-cast scene.
 *
 * HARD design constraints — the pure-scene brief was previously pulled into
 * hallucinated collages (lone figures, tapestries, narrative lines) by a
 * "JAW-DROPPING" framing; see nightly-dreams/index.ts ~2240. So the beat is:
 *  - a SKY / CELESTIAL / discrete EVENT only — never fog/mist/haze/god-rays
 *    (those are WEATHER's job; the brief's ATMOSPHERIC RULE forbids adding them),
 *  - never people, never animals (the pure-scene HARD BANS),
 *  - a BACKGROUND accent — the locked place stays the dominant subject,
 *  - gated: night-only beats need a night TIME; clear-sky beats need non-stormy
 *    WEATHER; skipped entirely for intimate / interior scenes.
 *
 * This module only PICKS an eligible beat. The roll probability + mutual
 * exclusivity with the PHENOMENON axis live in the caller so a scene never
 * gets more than one "extra" beyond its base axes.
 */

interface AweBeat {
  text: string;
  when: 'night' | 'day' | 'any';
  needsClearSky?: boolean;
}

const AWE_BEATS: AweBeat[] = [
  {
    text: 'an enormous full moon cresting the horizon, impossibly large and luminous, silvering the whole scene',
    when: 'night',
    needsClearSky: true,
  },
  {
    text: 'a brilliant meteor shower streaking across a star-blazing sky',
    when: 'night',
    needsClearSky: true,
  },
  {
    text: 'the Milky Way blazing in a vast luminous arc overhead',
    when: 'night',
    needsClearSky: true,
  },
  {
    text: 'shimmering aurora rippling in green and violet ribbons across the sky',
    when: 'night',
    needsClearSky: true,
  },
  {
    text: 'a bright comet trailing a long luminous tail across the night sky',
    when: 'night',
    needsClearSky: true,
  },
  {
    text: 'hundreds of glowing paper lanterns drifting up into the evening sky',
    when: 'night',
  },
  {
    text: 'distant fireworks blooming in brilliant color across the sky',
    when: 'night',
  },
  {
    text: 'a vivid double rainbow arcing across the sky',
    when: 'day',
  },
  {
    text: 'a swirling storm of blossom petals carried through the air on the breeze',
    when: 'day',
  },
  {
    text: 'a total solar eclipse, the sun a dark disk ringed by a glowing corona',
    when: 'day',
    needsClearSky: true,
  },
];

const NIGHT_RE = /night|dusk|twilight|evening|midnight|nocturn|moonlit|starr|after dark|blue hour/i;
const UNCLEAR_RE = /storm|overcast|rain|fog|mist|snow|cloud|downpour|squall|drizzle|blizzard|haze/i;

/**
 * Picks one eligible awe beat for the rolled TIME + WEATHER, or null when none
 * fit (intimate scene, or the time/sky rules exclude every beat). Caller owns
 * the probability + exclusivity with PHENOMENON.
 */
export function rollSceneAweBeat(
  timeAxis: string,
  weatherAxis: string,
  isIntimateScene: boolean,
  rand: () => number
): string | null {
  if (isIntimateScene) return null;
  const isNight = NIGHT_RE.test(timeAxis);
  const clearSky = !UNCLEAR_RE.test(weatherAxis);
  const eligible = AWE_BEATS.filter((b) => {
    if (b.when === 'night' && !isNight) return false;
    if (b.when === 'day' && isNight) return false;
    if (b.needsClearSky && !clearSky) return false;
    return true;
  });
  if (eligible.length === 0) return null;
  return eligible[Math.floor(rand() * eligible.length)].text;
}

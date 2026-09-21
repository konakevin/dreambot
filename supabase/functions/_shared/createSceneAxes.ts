// createSceneAxes.ts — give CREATE dreams a time of day and a weather condition.
//
// THE GAP (Kevin, 2026-09-21). generate-dream passes `timeAxis: ''`, `weatherAxis: ''` and
// `phenomenaAxis: ''` — literally empty strings — while nightly-dreams rolls real values from
// per-biome pools. So every Create dream of the same prompt is lit the same way, and the brief
// prints "- TIME:" followed by nothing. After three passes at wardrobe variety this was the largest
// remaining reason two dreams of one prompt look alike: clothing is a detail, light is the whole
// frame.
//
// WHY CREATE CANNOT REUSE NIGHTLY'S POOLS. Nightly rolls a LOCATION from a place pool, resolves its
// biome, and draws axes from that biome's own lists — an arctic biome offers arctic weather. Create
// has no biome: the place is whatever the user typed. A blind draw from a biome pool is how you get
// fresh snowfall on a tropical beach.
//
// SO THE ENTRIES ARE CLIMATE-AGNOSTIC BY CONSTRUCTION. Every time below exists everywhere on earth,
// indoors and out; every weather entry reads correctly in snow, desert, city or interior. The brief
// hands these to Sonnet under "ATMOSPHERIC CONDITIONS (weave into scene_description, do NOT
// contradict)", so they are guidance it reconciles with the place, never prompt text — which is what
// makes "just after rain" safe on a street and quietly ignorable inside a jazz club.
//
// PHENOMENA IS DELIBERATELY LEFT EMPTY. It is the most place-specific axis (aurora, fog banks,
// fireflies) and Create's vibe fragment already owns exactly that register — `arcane` supplies
// "drifting motes of magical light, lanterns burning in impossible colors, a soft luminous enchanted
// mist", and the brief tells Sonnet the vibe OWNS the light and weather of the scene. Rolling a
// phenomenon on top would put two authors on one sentence.

/** Times of day. Universal: every place has a dawn, and an interior has the light coming through
 *  its windows at that hour. Ordered dark → light → dark so the pool reads as a day. */
export const CREATE_TIME_AXES = [
  'first light, the place barely awake',
  'early morning, the light still low and clean',
  'mid-morning, bright and open',
  'high midday, the light hard and overhead',
  'mid-afternoon, warm and settled',
  'late afternoon, long raking shadows',
  'golden hour, the light low and amber',
  'blue hour, just after the sun has gone',
  'deep evening, lit by whatever light the place has',
  'full night',
] as const;

/** Conditions that read correctly in ANY climate. Deliberately no snow, no heatwave, no storm —
 *  those are the entries that would fight the user's place. "Just after rain" is the workhorse:
 *  visually distinct (wet, reflective, saturated) and plausible almost everywhere outdoors. */
export const CREATE_WEATHER_AXES = [
  'clear and still',
  'soft overcast, the light flat and even',
  'hazy air softening everything in the distance',
  'just after rain, every surface wet and reflective',
  'a steady breeze moving through the scene',
  'still and heavy, the air thick',
  'broken cloud, light coming and going',
] as const;

export interface CreateSceneAxes {
  timeAxis: string;
  weatherAxis: string;
  /** Always empty for Create — the vibe fragment owns phenomena. See the header. */
  phenomenaAxis: string;
}

/**
 * Roll a time and a weather condition for one Create render.
 *
 * Pure + rng-injected so a test can pin it. Rolled INDEPENDENTLY: the pools multiply to 70
 * combinations, which is what stops a batch of ten renders from sharing a look.
 */
export function rollCreateSceneAxes(rng: () => number = Math.random): CreateSceneAxes {
  const pick = <T>(pool: readonly T[]): T =>
    pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
  return {
    timeAxis: pick(CREATE_TIME_AXES),
    weatherAxis: pick(CREATE_WEATHER_AXES),
    phenomenaAxis: '',
  };
}

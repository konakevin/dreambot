/**
 * Scene Expander — enriches thin V2 user prompts with cinematic detail.
 *
 * Fills gaps the user didn't specify (time, atmosphere, lighting, material, depth, action).
 * Does NOT inject personal seeds (locations, objects) — those are nightly-only.
 * Uses stable seeding from userId + prompt + medium + vibe for reproducibility.
 * Includes repetition suppression to down-weight recently used phrases.
 */

type Entry = { text: string; weight: number };

// ── Expansion Pools (world truth — grounded, stable) ──

const V2_TIME: Entry[] = [
  { text: 'at golden hour', weight: 8 },
  { text: 'at twilight', weight: 8 },
  { text: 'at blue hour just before dawn', weight: 5 },
  { text: 'at midnight under moonlight', weight: 5 },
  { text: 'during a blood-red sunset', weight: 4 },
  { text: 'at the moment between day and night', weight: 5 },
  { text: 'during the last light before a storm', weight: 5 },
  { text: 'under a sky full of stars', weight: 5 },
];

const V2_ATMOSPHERE: Entry[] = [
  { text: 'heavy rain and mist filling the air', weight: 7 },
  { text: 'soft drifting fog', weight: 6 },
  { text: 'embers floating through smoky air', weight: 5 },
  { text: 'thick atmospheric haze catching the light', weight: 6 },
  { text: 'cherry blossom petals drifting on the wind', weight: 4 },
  { text: 'dust motes suspended in shafts of light', weight: 5 },
  { text: 'steam rising from wet surfaces', weight: 5 },
  { text: 'pollen drifting lazily through warm air', weight: 4 },
];

const V2_LIGHTING: Entry[] = [
  { text: 'dramatic rim lighting and long shadows', weight: 7 },
  { text: 'volumetric god rays cutting through haze', weight: 8 },
  { text: 'neon reflections on wet surfaces', weight: 7 },
  { text: 'warm candlelight contrasting cool moonlight', weight: 5 },
  { text: 'soft diffused golden light from above', weight: 6 },
  { text: 'backlit silhouette edge lighting', weight: 5 },
  { text: 'dappled light filtering through leaves', weight: 5 },
  { text: 'lantern light carving a warm pocket in darkness', weight: 5 },
];

const V2_MATERIAL: Entry[] = [
  { text: 'wet cobblestone street with reflective puddles', weight: 7 },
  { text: 'rusted metal beams slick with moisture', weight: 5 },
  { text: 'cracked marble floor with moss in seams', weight: 5 },
  { text: 'dusty velvet surfaces catching the light', weight: 4 },
  { text: 'weathered wood grain with peeling paint', weight: 5 },
  { text: 'polished stone with water stains', weight: 4 },
  { text: 'frosted glass with condensation drips', weight: 5 },
  { text: 'tarnished copper with green patina', weight: 4 },
];

const V2_DEPTH: Entry[] = [
  { text: 'layered depth with foreground framing elements', weight: 8 },
  { text: 'stacked perspective receding from bottom to top', weight: 7 },
  { text: 'puddle reflections doubling the scene below', weight: 5 },
  { text: 'environmental frame formed by architecture', weight: 6 },
  { text: 'foreground texture creating depth parallax', weight: 6 },
  { text: 'atmospheric perspective softening distant elements', weight: 5 },
];

const V2_ACTION: Entry[] = [
  { text: 'coat whipping in the wind', weight: 6 },
  { text: 'raindrops streaking off shoulders', weight: 5 },
  { text: 'hand gripping an object tightly', weight: 5 },
  { text: 'hair caught mid-motion by a gust', weight: 5 },
  { text: 'stepping through shallow puddles', weight: 5 },
  { text: 'breath visible in cold air', weight: 4 },
  { text: 'fingers brushing a surface in passing', weight: 4 },
  { text: 'fabric billowing in motion', weight: 5 },
];

const V2_CAMERA: Entry[] = [
  { text: 'medium shot, 50mm lens, subject centered with headroom', weight: 8 },
  { text: 'three-quarter shot, 50mm lens, towering background above', weight: 7 },
  { text: 'environmental portrait, eye-level, 50mm lens, deep perspective', weight: 7 },
  { text: 'low angle looking up, towering scale, 35mm lens', weight: 6 },
  { text: 'tall environmental portrait, subject in lower third, 35mm lens', weight: 7 },
  { text: 'symmetrical composition, subject centered, balanced framing', weight: 5 },
];

// ── Detection (does the user prompt already specify this?) ──

function hasTimeOfDay(p: string): boolean {
  return /\b(dawn|sunrise|morning|noon|afternoon|sunset|dusk|twilight|night|midnight|golden hour|blue hour)\b/i.test(
    p
  );
}

function hasAtmosphere(p: string): boolean {
  return /\b(rain|snow|fog|mist|wind|storm|haze|smoke|dust|ember|petal|aurora|steam)\b/i.test(p);
}

function hasLighting(p: string): boolean {
  return /\b(neon|candlelight|moonlight|sunlight|backlit|rim light|spotlight|lantern|torch|glow|god ray)\b/i.test(
    p
  );
}

// ── Conflict filters (2026-09-26) ──
// Kevin's "Celtic bowhuntress deep in a fantasy forest ... dramatic golden hour lighting" got "neon
// reflections on wet surfaces, wet cobblestone street" and, on the run without golden hour, "heavy rain and
// mist ... frosted glass with condensation drips ... stepping through shallow puddles" while she was drawing a
// bow. The four gap checks above only ask "did the user already name a time / atmosphere / light / material";
// nothing asked whether a rolled line CONTRADICTS what they did name. These do.

/** A wild, outdoor or otherworldly setting: built-environment lines (streets, beams, marble, neon) never fit. */
const NATURAL_SETTING =
  /\b(forests?|woods|woodlands?|jungles?|rainforests?|beach(es)?|shores?|coasts?|coastline|ocean|seas?|islands?|lagoons?|mountains?|peaks?|alpine|desert|dunes?|meadows?|fields?|prairie|savann?ah?|rivers?|lakes?|waterfalls?|canyons?|caves?|glaciers?|tundra|sky|clouds|outer space|space|orbit|galaxy|countryside|vineyards?|farm|wilderness|swamp|marsh|reef|underwater)\b/i;
/** The user asked for sun or clear light: no rain, puddles, snow or storm lines. */
const SUN_ASKED =
  /\b(sunny|sunlit|sunshine|sun-drenched|sun-soaked|golden hour|clear sk(y|ies)|blue sk(y|ies)|bright day|summer day|heat|tropical)\b/i;
const WET = /\b(rain|raindrops|puddles?|wet|storm|snow|drizzle|condensation)\b/i;
const BUILT =
  /\b(neon|cobblestone|street|metal beams|marble floor|frosted glass|velvet|peeling paint|polished stone|tarnished copper|architecture)\b/i;
/** The user already gave the person something to DO: no rolled motion detail on top ("stepping through
 *  puddles" on someone drawing a bow). A curated verb list, not "-ing": morning, building and clothing are
 *  not actions. */
const ACTION_IN_PROMPT = new RegExp(
  '\\b(in action|mid[- ]\\w+|' +
    [
      'drinking',
      'eating',
      'dancing',
      'running',
      'walking',
      'strolling',
      'riding',
      'playing',
      'swimming',
      'surfing',
      'skiing',
      'snowboarding',
      'hiking',
      'climbing',
      'fighting',
      'shooting',
      'drawing',
      'aiming',
      'wielding',
      'reading',
      'singing',
      'cooking',
      'jumping',
      'leaping',
      'flying',
      'sailing',
      'rowing',
      'paddling',
      'kissing',
      'hugging',
      'holding',
      'laughing',
      'sitting',
      'lying',
      'lounging',
      'relaxing',
      'floating',
      'diving',
      'skating',
      'biking',
      'cycling',
      'driving',
      'racing',
      'golfing',
      'fishing',
      'hunting',
      'exploring',
      'shopping',
      'waltzing',
      'chasing',
      'throwing',
      'catching',
      'kicking',
      'boxing',
      'fencing',
      'writing',
      'working',
      'studying',
      'sleeping',
      'sunbathing',
      'toasting',
      'cheering',
      'celebrating',
      'marching',
      'battling',
      'casting',
      'charging',
      'galloping',
      'sprinting',
      'performing',
      'drumming',
      'strumming',
    ].join('|') +
    ')\\b',
  'i'
);

export function hasActionInPrompt(p: string): boolean {
  return ACTION_IN_PROMPT.test(p);
}

/** The pool minus lines that contradict the prompt. Never empty: if everything conflicts, the whole pool. */
function fitting(pool: Entry[], ctx: { natural: boolean; sunny: boolean }): Entry[] {
  const kept = pool.filter(
    (e) => !(ctx.sunny && WET.test(e.text)) && !(ctx.natural && BUILT.test(e.text))
  );
  return kept.length ? kept : pool;
}

function hasMaterial(p: string): boolean {
  return /\b(cobblestone|marble|metal|velvet|wood|glass|copper|brick|concrete|leather|stone)\b/i.test(
    p
  );
}

// ── Deterministic seeded random ──

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickWeighted(pool: Entry[], rand: () => number): Entry {
  const total = pool.reduce((s, e) => s + e.weight, 0);
  let roll = rand() * total;
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return pool[pool.length - 1];
}

// ── Repetition Suppression ──
// In-memory per Edge Function instance. Resets on cold start.

const recentPhrases = new Map<string, string[]>();

function pickWithMemory(pool: Entry[], rand: () => number, userId: string): Entry {
  const recent = recentPhrases.get(userId) ?? [];
  const adjusted = pool.map((e) => ({
    ...e,
    weight: recent.includes(e.text) ? Math.max(1, Math.round(e.weight * 0.2)) : e.weight,
  }));
  return pickWeighted(adjusted, rand);
}

function recordUsedPhrases(userId: string, phrases: string[]): void {
  const existing = recentPhrases.get(userId) ?? [];
  const updated = [...phrases, ...existing].slice(0, 20);
  recentPhrases.set(userId, updated);
}

// ── Main Export ──

export interface ExpandedScene {
  expansion: string;
  suggestedCamera: string;
  usedPhrases: string[];
}

export function expandScene(input: {
  userPrompt: string;
  userId: string;
  mediumKey: string;
  vibeKey: string;
  hasCharacter: boolean;
}): ExpandedScene {
  const { userPrompt, userId, mediumKey, vibeKey, hasCharacter } = input;
  const lower = userPrompt.toLowerCase();

  // Stable seed from user + prompt + medium + vibe (reproducible, no Date.now())
  const seed = hashString(userId + userPrompt + mediumKey + vibeKey);
  const rand = mulberry32(seed);

  const additions: string[] = [];
  const ctx = { natural: NATURAL_SETTING.test(lower), sunny: SUN_ASKED.test(lower) };

  // Fill gaps only — don't override what user specified. TIME / ATMOSPHERE /
  // LIGHTING are subject-AGNOSTIC mood + light seasoning, safe on any scene —
  // minus any line that contradicts it (no rain on "golden hour", no neon in a forest).
  if (!hasTimeOfDay(lower))
    additions.push(pickWithMemory(fitting(V2_TIME, ctx), rand, userId).text);
  if (!hasAtmosphere(lower))
    additions.push(pickWithMemory(fitting(V2_ATMOSPHERE, ctx), rand, userId).text);
  if (!hasLighting(lower))
    additions.push(pickWithMemory(fitting(V2_LIGHTING, ctx), rand, userId).text);

  // MATERIAL injects competing surfaces / architecture (wet cobblestone street,
  // brick, marble floor) — appropriate when a person stands IN an environment,
  // but for a self-contained subject ("a cat holding a piña colada") it imports
  // a whole generic village and crowds the subject out. Character scenes only,
  // and never in a wild setting (a forest has no cobblestone street).
  if (hasCharacter && !hasMaterial(lower) && !ctx.natural) {
    additions.push(pickWithMemory(fitting(V2_MATERIAL, ctx), rand, userId).text);
  }

  // Depth: full for character scenes (person-in-world wants layered depth);
  // lighter for subject-only scenes so the expansion stays atmospheric seasoning
  // rather than a competing multi-tier environment that buries the subject.
  if (rand() < (hasCharacter ? 0.8 : 0.4)) {
    additions.push(pickWithMemory(fitting(V2_DEPTH, ctx), rand, userId).text);
  }

  // Action: only for character scenes, and only when the user gave them nothing to do.
  if (hasCharacter && !hasActionInPrompt(lower)) {
    additions.push(pickWithMemory(fitting(V2_ACTION, ctx), rand, userId).text);
  }

  const suggestedCamera = pickWeighted(V2_CAMERA, rand).text;

  // Record used phrases for repetition suppression
  recordUsedPhrases(userId, additions);

  return {
    expansion: additions.join(', '),
    suggestedCamera,
    usedPhrases: additions,
  };
}

/**
 * Scene DNA Engine — procedural art director for nightly dreams.
 *
 * Assembles cinematic scene descriptions from weighted modular pools
 * instead of picking from static templates. Combinatorial explosion
 * means millions of unique scenes. Tag-based conflict filtering
 * prevents incoherent combos (underwater + dust storm).
 *
 * Output: a rich scene description that Sonnet turns into a Flux prompt.
 */

// ── Sonnet-generated pools (creative content, high variety) ───────────
// These replace the hand-written inline arrays with 480 Sonnet-generated entries.
import { SETTINGS as GEN_SETTINGS } from './pools/settings.ts';
import { SIGNATURE_DETAILS as GEN_SIGNATURE_DETAILS } from './pools/signature_details.ts';
import { FOREGROUND as GEN_FOREGROUND } from './pools/foreground.ts';
import { MIDGROUND as GEN_MIDGROUND } from './pools/midground.ts';
import { BACKGROUND as GEN_BACKGROUND } from './pools/background.ts';
import { STORY_HOOKS as GEN_STORY_HOOKS } from './pools/story_hooks.ts';
import { ACTIONS_FACESWAP as GEN_ACTIONS_FACESWAP } from './pools/actions_faceswap.ts';
import { ACTIONS_WIDE as GEN_ACTIONS_WIDE } from './pools/actions_wide.ts';

// ── Types ─────────────────────────────────────────────────────────────

type Rarity = 'safe' | 'bold' | 'chaotic';

interface Entry {
  text: string;
  weight: number;
  tags?: string[];
  rarity?: Rarity;
}

interface ConflictRule {
  ifTags: string[];
  notTags: string[];
}

export interface LocationCardData {
  tags: string[];
  visual_palette: string[];
  atmosphere: string[];
  cinematic_phrases: string[];
  fusion_settings: Record<string, string[]>;
}

export interface ObjectCardData {
  tags: string[];
  visual_forms: string[];
  signature_details: string[];
  interaction_modes: string[];
  environment_bindings: string[];
  role_options: string[];
  fusion_forms: Record<string, string[]>;
  soft_presence_forms: string[];
  faceswap_forbidden: string[];
  faceswap_safe_positive: string[];
}

type CompositionMode =
  | 'balanced'
  | 'open_vista'
  | 'layered_depth'
  | 'negative_space'
  | 'low_angle_hero'
  | 'overhead'
  | 'intimate_close';

interface CompositionHint {
  positive: string;
  negative: string;
  banKeywords: string[];
}

const COMPOSITION_HINTS: Record<CompositionMode, CompositionHint> = {
  balanced: {
    positive:
      'stacked depth layers from foreground to sky, keep subject centered with generous headroom and footroom',
    negative: '',
    banKeywords: [],
  },
  open_vista: {
    positive: 'towering open sky, dramatic scale, stacked depth layers, no corridor framing',
    negative: 'no narrow alley, no tunnel corridor, no boxed-in framing',
    banKeywords: [
      'archway',
      'tunnel',
      'corridor',
      'narrow',
      'between two',
      'flanked by',
      'passageway',
    ],
  },
  layered_depth: {
    positive:
      'strong depth layering: foreground at bottom, midground center, background and sky stacked above, rich parallax',
    negative: '',
    banKeywords: [],
  },
  negative_space: {
    positive: 'large negative space above subject, minimal framing elements, clean composition',
    negative: 'no cluttered framing, no dense foreground objects',
    banKeywords: ['cluttered', 'crowded', 'dense foreground'],
  },
  low_angle_hero: {
    positive: 'low angle hero shot, towering scale, sky dominant above subject',
    negative: 'no overhead view, no top-down angle',
    banKeywords: ['overhead', 'top-down', 'aerial'],
  },
  overhead: {
    positive: 'looking straight down, depth into scene below, stacked layers receding downward',
    negative: 'no ground-level perspective, no horizon line',
    banKeywords: ['horizon', 'eye-level'],
  },
  intimate_close: {
    positive: 'tight framing, shallow depth of field, intimate detail, close perspective',
    negative: 'no distant landscape, no establishing shot',
    banKeywords: ['establishing shot', 'panoramic'],
  },
};

const ALLEY_KEYWORDS = [
  'alley',
  'corridor',
  'tunnel',
  'narrow street',
  'passageway',
  'flanked by',
  'between two walls',
  'tree-lined path',
];

interface SceneOptions {
  renderMode: 'natural' | 'embodied' | 'none';
  faceSwapEligible: boolean;
  compositionMode?: CompositionMode;
  includeLocation: boolean;
  includeObject: boolean;
  userPlace?: string;
  userThing?: string;
  locationCard?: LocationCardData;
  objectCard?: ObjectCardData;
  castGender?: 'male' | 'female';
  moodAxis?: {
    peaceful_chaotic: number;
    cute_terrifying: number;
    minimal_maximal: number;
    realistic_surreal: number;
  };
}

// ── Deterministic RNG ─────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Weighted Random Pick ──────────────────────────────────────────────

function pickWeighted(entries: Entry[], rand: () => number): Entry {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  let r = rand() * total;
  for (const e of entries) {
    r -= e.weight;
    if (r <= 0) return e;
  }
  return entries[entries.length - 1];
}

// ── Helpers ───────────────────────────────────────────────────────────

function pickN(arr: string[], n: number, rand: () => number): string[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
}

function pickOne(arr: string[], rand: () => number): string {
  return arr[Math.floor(rand() * arr.length)];
}

function resolveGenre(tags: Set<string>): 'realistic' | 'fantasy' | 'scifi' {
  if (tags.has('fantasy') || tags.has('gothic')) return 'fantasy';
  if (tags.has('space') || tags.has('cyberpunk')) return 'scifi';
  return 'realistic';
}

// ── Conflict Filtering ────────────────────────────────────────────────

function violatesConflicts(
  selectedTags: Set<string>,
  entryTags: string[],
  rules: ConflictRule[]
): boolean {
  const combined = new Set([...selectedTags, ...entryTags]);
  for (const rule of rules) {
    const hasAllIf = rule.ifTags.every((t) => combined.has(t));
    if (!hasAllIf) continue;
    if (rule.notTags.some((t) => combined.has(t))) return true;
  }
  return false;
}

function filterAndPick(
  entries: Entry[],
  selectedTags: Set<string>,
  rules: ConflictRule[],
  rand: () => number,
  allowChaotic: boolean
): Entry {
  const filtered = entries.filter((e) => {
    if (!allowChaotic && e.rarity === 'chaotic') return false;
    const tags = e.tags ?? [];
    return !violatesConflicts(selectedTags, tags, rules);
  });
  const pool = filtered.length > 0 ? filtered : entries.filter((e) => e.rarity !== 'chaotic');
  const chosen = pickWeighted(pool, rand);
  if (chosen.tags) chosen.tags.forEach((t) => selectedTags.add(t));
  return chosen;
}

// ── Conflict Rules ────────────────────────────────────────────────────

const CONFLICT_RULES: ConflictRule[] = [
  { ifTags: ['underwater'], notTags: ['dust', 'fire', 'snow', 'desert'] },
  { ifTags: ['space'], notTags: ['rain', 'forest', 'birds', 'jungle'] },
  { ifTags: ['snow'], notTags: ['tropical', 'desert', 'jungle'] },
  { ifTags: ['desert'], notTags: ['underwater', 'snow', 'rain'] },
  { ifTags: ['interior'], notTags: ['mountains', 'skyline', 'horizon'] },
  { ifTags: ['fire'], notTags: ['underwater', 'snow'] },
];

// ── Curated Pools (small, hand-written — not worth Sonnet generation) ─

const SCALE: Entry[] = [
  { text: 'towering structures dwarf everything in the scene', weight: 7 },
  { text: 'endless landscape stretching to the horizon', weight: 7 },
  { text: 'massive megastructure looming in the distance', weight: 6 },
  { text: 'cathedral-sized ruins half-collapsed and ancient', weight: 6 },
  { text: 'impossibly vast interior space disappearing into shadow', weight: 5 },
  { text: 'colossal natural formations dwarfing all human presence', weight: 6 },
  { text: 'vertiginous height with layers visible far below', weight: 5 },
  { text: 'sweeping panoramic vista in every direction', weight: 6 },
  { text: 'intimate claustrophobic space pressing in from all sides', weight: 4 },
  { text: 'overwhelming sense of depth receding into the distance', weight: 6 },
  { text: 'monumental scale where doorways are ten stories tall', weight: 5 },
  { text: 'dizzying vertical drop visible just beyond the edge', weight: 5 },
  { text: 'landscape so vast the curvature of the planet is visible', weight: 3, rarity: 'bold' },
];

const TIME: Entry[] = [
  { text: 'at golden hour', weight: 8 },
  { text: 'at twilight', weight: 8 },
  { text: 'at sunrise', weight: 6 },
  { text: 'at midnight', weight: 5 },
  { text: 'at blue hour just before dawn', weight: 5 },
  { text: 'during a blood-red sunset', weight: 4 },
  { text: 'during a solar eclipse', weight: 2, rarity: 'bold' },
  { text: 'under a sky full of stars', weight: 5 },
  { text: 'in the dead of winter at high noon with flat white light', weight: 3 },
  { text: 'at the moment between day and night when colors shift', weight: 5 },
  { text: 'during the last light before a storm rolls in', weight: 5 },
  { text: 'at the violet edge of dawn', weight: 4 },
  { text: 'under perpetual overcast sky with no visible sun', weight: 3 },
];

const WEATHER: Entry[] = [
  { text: 'heavy rain and mist', weight: 7, tags: ['rain'] },
  { text: 'soft drifting fog', weight: 6 },
  { text: 'snow blowing sideways in strong wind', weight: 5, tags: ['snow'] },
  { text: 'dust storm rolling through the distance', weight: 4, tags: ['dust', 'desert'] },
  { text: 'embers floating through smoky air', weight: 5, tags: ['fire'] },
  { text: 'calm air filled with glowing fireflies', weight: 5, tags: ['nature'] },
  { text: 'thick atmospheric haze catching the light', weight: 6 },
  { text: 'storm clouds building on the horizon', weight: 5 },
  { text: 'cherry blossom petals drifting on the wind', weight: 4 },
  { text: 'ash falling like snow from a distant eruption', weight: 4, tags: ['fire'] },
  { text: 'gentle drizzle with sun breaking through clouds', weight: 5, tags: ['rain'] },
  { text: 'aurora borealis shimmering overhead', weight: 4, rarity: 'bold' },
  { text: 'pollen and seeds drifting lazily through warm air', weight: 4, tags: ['nature'] },
  { text: 'dense sea fog rolling in from the coast', weight: 5, tags: ['coastal'] },
  { text: 'static electricity crackling in the dry air', weight: 3, tags: ['desert'] },
  { text: 'light snowfall with massive flakes drifting slowly', weight: 5, tags: ['snow'] },
  { text: 'smoke and sparks swirling in updrafts', weight: 4, tags: ['fire'] },
  { text: 'humidity so thick the air is visible', weight: 4, tags: ['tropical'] },
  { text: 'wind carrying sand that catches the light like gold dust', weight: 4, tags: ['desert'] },
];

const LIGHTING: Entry[] = [
  { text: 'dramatic rim lighting and long shadows', weight: 7 },
  { text: 'volumetric god rays cutting through haze', weight: 8 },
  { text: 'neon lighting reflecting on wet surfaces', weight: 7, tags: ['urban'] },
  { text: 'warm candlelight contrasting with cool moonlight', weight: 5 },
  { text: 'storm lightning illuminating the scene in flashes', weight: 4 },
  { text: 'soft diffused golden light from above', weight: 6 },
  { text: 'harsh directional light casting deep shadows', weight: 5 },
  { text: 'bioluminescent glow from natural sources', weight: 4 },
  { text: 'firelight casting dancing warm shadows on every surface', weight: 5, tags: ['fire'] },
  { text: 'cool blue moonlight washing over everything', weight: 5 },
  { text: 'backlit silhouette edge lighting', weight: 5 },
  { text: 'dappled light filtering through leaves', weight: 5, tags: ['nature'] },
  {
    text: 'underwater caustic light patterns rippling across surfaces',
    weight: 4,
    tags: ['underwater'],
  },
  { text: 'dual-tone lighting with warm and cool sides splitting the scene', weight: 5 },
  { text: 'single harsh overhead light creating deep eye sockets and drama', weight: 4 },
  { text: 'lantern light creating a warm pocket in surrounding darkness', weight: 5 },
  { text: 'reflected light bouncing off water onto walls and ceiling', weight: 5 },
  { text: 'shifting colored light from stained glass or prismatic sources', weight: 4 },
  { text: 'stark fluorescent lighting in an otherwise dark space', weight: 4, tags: ['urban'] },
];

const SUBJECT_SCALE_FACESWAP: Entry[] = [
  { text: 'subject fills 25% of the frame height, face clearly visible', weight: 8 },
  { text: 'three-quarter body shot, subject fills 30% of frame, face readable', weight: 7 },
  { text: 'midground subject, visible eyes and mouth, environment still dominant', weight: 6 },
  { text: 'subject framed waist-up with vast environment behind them', weight: 7 },
  { text: 'subject framed three-quarter body, face readable, environment expansive', weight: 6 },
  { text: 'subject in midground framed by foreground elements, face visible', weight: 5 },
];

const CAMERA_FACESWAP: Entry[] = [
  {
    text: 'medium shot, subject readable face, 50mm lens, subject centered with headroom',
    weight: 8,
  },
  {
    text: 'three-quarter shot, face clearly visible, 50mm lens, towering background above subject',
    weight: 7,
  },
  {
    text: 'environmental portrait, eye-level angle, 50mm lens, deep perspective behind subject',
    weight: 7,
  },
  { text: 'medium shot, natural perspective, eye-level, 50mm lens, depth layers', weight: 6 },
  {
    text: 'environmental portrait, subject in lower third, 50mm lens, sky and environment stacked above',
    weight: 6,
  },
];

const CAMERA_WIDE: Entry[] = [
  {
    text: 'tall environmental portrait, full body, character in lower third, towering environment above, 35mm lens, deep perspective',
    weight: 8,
  },
  {
    text: 'looking upward through environment, subject small against towering scale, 35mm lens',
    weight: 6,
  },
  {
    text: 'low angle looking up, towering structures and sky dominating frame, subject at base, 35mm lens',
    weight: 7,
  },
  {
    text: 'deep perspective shot, foreground at bottom sharp, subject in middle, background and sky stacked above, 50mm lens',
    weight: 7,
  },
  {
    text: 'environmental portrait, subject centered, stacked depth layers from ground to sky, 35mm lens',
    weight: 7,
  },
  { text: 'silhouette against towering backdrop, dramatic scale, 35mm lens', weight: 5 },
  {
    text: 'looking down from height into scene below, depth receding downward, 35mm lens',
    weight: 4,
  },
];

const STYLE_PACKS: Entry[] = [
  { text: 'cinematic film still, anamorphic lighting, subtle film grain', weight: 8 },
  { text: 'hyper-detailed digital matte painting, epic environment art', weight: 6 },
  { text: 'dark noir atmosphere, high contrast lighting, moody shadows', weight: 5 },
  { text: 'dreamlike surrealism, soft volumetric glow, painterly realism', weight: 4 },
  { text: 'looks like a frame from a film, storytelling moment, dramatic tension', weight: 6 },
  { text: 'concept art for a blockbuster film, production quality', weight: 5 },
];

const QUALITY_TAGS =
  'foreground midground background stacked top to bottom, layered depth composition, deep perspective, highly detailed environment, atmospheric haze, cinematic lighting';
const QUALITY_TAGS_END = 'no text, no words, no letters, no watermarks, ultra detailed';

// ── Main Export ────────────────────────────────────────────────────────

export function assembleScene(opts: SceneOptions): string {
  const seed = Math.floor(Math.random() * 1_000_000_000);
  const rand = mulberry32(seed);
  const tags = new Set<string>();
  const rules = CONFLICT_RULES;

  // Mood-driven boldness: more surreal/chaotic users get wilder scenes
  const boldChance = opts.moodAxis
    ? 0.15 + opts.moodAxis.realistic_surreal * 0.15 + opts.moodAxis.peaceful_chaotic * 0.1
    : 0.25;
  const allowChaotic = rand() < boldChance * 0.3;

  // When a location card exists, it IS the scene identity — skip GEN_SETTINGS entirely.
  // Scene DNA pools provide texture within the location, not a competing setting.
  const hasLocationAnchor = opts.includeLocation && opts.userPlace && opts.locationCard;
  const setting = hasLocationAnchor
    ? null
    : filterAndPick(GEN_SETTINGS, tags, rules, rand, allowChaotic);
  const scale = filterAndPick(SCALE, tags, rules, rand, allowChaotic);
  const time = filterAndPick(TIME, tags, rules, rand, allowChaotic);
  const weather = filterAndPick(WEATHER, tags, rules, rand, allowChaotic);
  const lighting = filterAndPick(LIGHTING, tags, rules, rand, allowChaotic);
  // Foreground/midground/background — apply composition + location-compatibility filtering
  const compMode = opts.compositionMode || 'balanced';
  const compHint = COMPOSITION_HINTS[compMode];

  // Location-based filtering: penalize scene DNA entries that clash with the location's identity
  const locationTags =
    hasLocationAnchor && opts.locationCard ? new Set(opts.locationCard.tags) : null;

  // Identity killers — hard-ban keywords that override any location's sense of place
  const IDENTITY_KILLERS = [
    'factory',
    'warehouse',
    'bunker',
    'subway',
    'hospital',
    'parking garage',
    'server room',
    'laboratory',
    'office',
    'prison',
    'dungeon',
    'sewer',
    'operating room',
    'sterile',
    'industrial plant',
    'slaughterhouse',
  ];

  function applyLocationFilter(pool: Entry[]): Entry[] {
    if (!locationTags) return pool;
    return pool
      .map((e) => {
        const lower = e.text.toLowerCase();
        // Hard-ban identity killers when location exists
        if (IDENTITY_KILLERS.some((kw) => lower.includes(kw))) {
          return { ...e, weight: 0 };
        }
        // Soft-penalize tag mismatches (0.1x weight)
        const eTags = e.tags ?? [];
        const isIndoor = eTags.includes('interior') || eTags.includes('underground');
        const locIsOutdoor =
          locationTags.has('tropical') ||
          locationTags.has('coastal') ||
          locationTags.has('nature') ||
          locationTags.has('mountain') ||
          locationTags.has('desert');
        if (isIndoor && locIsOutdoor) {
          return { ...e, weight: Math.max(1, Math.round(e.weight * 0.1)) };
        }
        return e;
      })
      .filter((e) => e.weight > 0);
  }

  let fgPool = applyLocationFilter(GEN_FOREGROUND);
  if (compHint.banKeywords.length > 0) {
    fgPool = fgPool.map((e) => {
      const lower = e.text.toLowerCase();
      const penalized = compHint.banKeywords.some((kw) => lower.includes(kw));
      return penalized ? { ...e, weight: Math.max(1, Math.round(e.weight * 0.15)) } : e;
    });
  }
  const foreground = filterAndPick(fgPool, tags, rules, rand, allowChaotic);
  const midground = filterAndPick(
    applyLocationFilter(GEN_MIDGROUND),
    tags,
    rules,
    rand,
    allowChaotic
  );
  const background = filterAndPick(
    applyLocationFilter(GEN_BACKGROUND),
    tags,
    rules,
    rand,
    allowChaotic
  );

  // Story hook
  const storyHook = filterAndPick(GEN_STORY_HOOKS, tags, rules, rand, allowChaotic);

  // Signature detail — rarity-gated
  let signatureText = '';
  const sigRoll = rand();
  if (sigRoll < 0.03 && allowChaotic) {
    signatureText = filterAndPick(GEN_SIGNATURE_DETAILS, tags, rules, rand, true).text;
  } else if (sigRoll < 0.15) {
    const boldSigs = GEN_SIGNATURE_DETAILS.filter((e) => e.rarity !== 'chaotic');
    if (boldSigs.length > 0) signatureText = pickWeighted(boldSigs, rand).text;
  } else if (sigRoll < 0.5) {
    const safeSigs = GEN_SIGNATURE_DETAILS.filter((e) => !e.rarity || e.rarity === 'safe');
    if (safeSigs.length > 0) signatureText = pickWeighted(safeSigs, rand).text;
  }

  // Action — different pools for face-swap vs wide
  const actionPool = opts.faceSwapEligible ? GEN_ACTIONS_FACESWAP : GEN_ACTIONS_WIDE;
  const action = filterAndPick(actionPool, tags, rules, rand, allowChaotic);

  // Subject scale — face-swap only
  const subjectScale = opts.faceSwapEligible
    ? filterAndPick(SUBJECT_SCALE_FACESWAP, tags, rules, rand, allowChaotic)
    : null;

  // Camera — different for face-swap vs wide
  const cameraPool = opts.faceSwapEligible ? CAMERA_FACESWAP : CAMERA_WIDE;
  const camera = filterAndPick(cameraPool, tags, rules, rand, allowChaotic);

  // Style pack
  const style = filterAndPick(STYLE_PACKS, tags, rules, rand, allowChaotic);

  // ── Location as scene identity (not garnish) ──
  // When a location card exists: location name IS the setting, card phrases are primary texture.
  // Scene DNA pools provide compositional variety within the location, not a competing scene.
  const genre = resolveGenre(tags);
  let settingText: string;

  if (opts.includeLocation && opts.userPlace) {
    if (opts.locationCard) {
      const lc = opts.locationCard;
      const genreFusions = lc.fusion_settings && lc.fusion_settings[genre];
      if (rand() < 0.4 && genreFusions && genreFusions.length > 0) {
        // 40% fusion: genre-appropriate interpretation, still anchored to location name
        settingText = opts.userPlace + ' — ' + pickOne(genreFusions, rand);
      } else {
        // 60% card phrases: location name + 3-4 cinematic phrases as scene identity
        const allPhrases = [...lc.cinematic_phrases, ...lc.visual_palette, ...lc.atmosphere];
        const phrases =
          allPhrases.length > 0
            ? pickN(allPhrases, Math.min(4, allPhrases.length), rand).join(', ')
            : '';
        settingText = phrases ? opts.userPlace + ' — ' + phrases : opts.userPlace;
      }
    } else {
      // No card — use location name with the pool setting as texture
      settingText = (setting ? setting.text : '') + ', set in ' + opts.userPlace;
    }
  } else {
    // No location — pure scene DNA
    settingText = setting ? setting.text : 'vast cinematic landscape';
  }

  // ── Object injection via card or fallback ──
  let objectBlock = '';

  if (opts.includeObject && opts.userThing) {
    if (opts.objectCard) {
      const oc = opts.objectCard;
      const softRoll = rand();

      if (softRoll < 0.3 && oc.soft_presence_forms && oc.soft_presence_forms.length > 0) {
        // 30% symbolic: indirect appearance
        objectBlock = pickOne(oc.soft_presence_forms, rand);
      } else {
        // 70% literal: pick genre-appropriate form + role + binding
        const genreForms =
          oc.fusion_forms && oc.fusion_forms[genre] && oc.fusion_forms[genre].length > 0
            ? oc.fusion_forms[genre]
            : oc.visual_forms;
        const form = genreForms.length > 0 ? pickOne(genreForms, rand) : opts.userThing;
        const binding =
          oc.environment_bindings.length > 0 ? pickOne(oc.environment_bindings, rand) : '';
        const role = oc.role_options.length > 0 ? pickOne(oc.role_options, rand) : '';

        // Placement roll: 50% foreground, 35% midground, 15% background
        const placementRoll = rand();
        const placement =
          placementRoll < 0.5 ? 'foreground' : placementRoll < 0.85 ? 'midground' : 'background';

        objectBlock = placement + ' object: ' + form;
        if (binding) objectBlock += ', ' + binding;
        if (role) objectBlock += ', ' + role;

        // Face-swap safety
        if (opts.faceSwapEligible) {
          if (oc.faceswap_safe_positive && oc.faceswap_safe_positive.length > 0) {
            objectBlock += ', ' + pickOne(oc.faceswap_safe_positive, rand);
          }
          if (oc.faceswap_forbidden && oc.faceswap_forbidden.length > 0) {
            objectBlock += ', ' + oc.faceswap_forbidden.join(', ');
          }
        }
      }
    } else {
      objectBlock = opts.userThing + ' prominent in the scene';
    }
  }

  // Build the scene description
  const pieces: string[] = [
    settingText,
    scale.text,
    time.text,
    weather.text,
    lighting.text,
    foreground.text,
    midground.text,
    background.text,
  ];

  if (signatureText) pieces.push(signatureText);
  if (objectBlock) pieces.push(objectBlock);

  if (opts.faceSwapEligible) {
    // Face-swap: controlled DOF, subject scale, anti-wide negatives
    pieces.push(
      'foreground midground background stacked top to bottom, layered depth composition, controlled depth of field, sharp subject, detailed background, atmospheric haze, cinematic lighting, keep subject centered with generous headroom and footroom'
    );
    if (subjectScale) pieces.push(subjectScale.text);
    // Gender reinforcement — prevents medium style from overriding gender
    const genderToken =
      opts.castGender === 'female'
        ? 'adult female, woman, feminine facial structure, not male, not masculine'
        : 'adult male, man, masculine facial structure, not female, not feminine';
    pieces.push(genderToken);
    pieces.push('a lone figure ' + action.text);
    pieces.push(storyHook.text);
    pieces.push(
      'face clearly visible and readable, eyes visible, head facing camera or slight three-quarter angle, balanced lighting across face, face occupies 8 to 15 percent of image height'
    );
    pieces.push(camera.text);
    pieces.push(style.text);
    pieces.push('not a distant silhouette, not tiny subject, subject clearly visible and centered');
    pieces.push(QUALITY_TAGS_END);
  } else {
    // Non-face-swap: deep DOF, environment dominates
    pieces.push(QUALITY_TAGS);
    pieces.push('a lone figure ' + action.text);
    pieces.push(storyHook.text);
    pieces.push(camera.text);
    pieces.push('character prominent but background highly detailed');
    pieces.push(style.text);
    pieces.push(QUALITY_TAGS_END);
  }

  // Inject composition hints (positive + negative)
  if (compHint.positive) pieces.push(compHint.positive);
  if (compHint.negative) pieces.push(compHint.negative);

  // Post-assembly alley detector — if too many corridor keywords, inject override
  const assembled = pieces.join(', ');
  const lower = assembled.toLowerCase();
  const alleyCount = ALLEY_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  if (alleyCount >= 2) {
    return assembled + ', wide open composition with no enclosing side walls, expansive depth';
  }

  return assembled;
}

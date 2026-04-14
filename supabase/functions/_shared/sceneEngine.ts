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

interface SceneOptions {
  renderMode: 'natural' | 'embodied' | 'none';
  faceSwapEligible: boolean;
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

// ── Module Pools ──────────────────────────────────────────────────────

const SETTINGS: Entry[] = [
  // Urban / Cyberpunk
  {
    text: 'rainy neon street market in a futuristic city',
    weight: 8,
    tags: ['urban', 'rain', 'cyberpunk'],
  },
  {
    text: 'neon-soaked back alley in a rain-drenched cyberpunk slum',
    weight: 6,
    tags: ['urban', 'rain', 'cyberpunk'],
  },
  {
    text: 'abandoned underground subway station with graffiti-covered walls',
    weight: 7,
    tags: ['urban', 'interior'],
  },
  { text: 'high rooftop overlooking a futuristic city at dusk', weight: 7, tags: ['urban', 'sky'] },
  { text: 'bustling Tokyo street in early morning golden light', weight: 6, tags: ['urban'] },
  { text: 'massive industrial bridge at night in heavy rain', weight: 6, tags: ['urban', 'rain'] },
  {
    text: 'quiet roadside diner glowing in the rain at night',
    weight: 6,
    tags: ['urban', 'rain', 'cozy'],
  },
  {
    text: 'massive train station with vaulted glass ceiling and steam',
    weight: 6,
    tags: ['urban', 'interior'],
  },
  {
    text: 'abandoned amusement park at night with rusted rides and flickering lights',
    weight: 5,
    tags: ['urban'],
  },
  {
    text: 'underground fight club arena lit by hanging industrial lights',
    weight: 4,
    tags: ['urban', 'interior'],
  },
  {
    text: 'rain-slicked elevated highway cutting through a neon megacity',
    weight: 6,
    tags: ['urban', 'rain', 'cyberpunk'],
  },
  {
    text: 'derelict parking garage with shafts of light piercing through cracked concrete',
    weight: 5,
    tags: ['urban', 'interior'],
  },
  {
    text: 'crowded night market beneath a tangle of power lines and holographic signs',
    weight: 7,
    tags: ['urban', 'cyberpunk'],
  },
  {
    text: 'abandoned rooftop garden overlooking a smog-choked skyline',
    weight: 5,
    tags: ['urban', 'sky', 'nature'],
  },
  {
    text: 'neon-lit underground canal running beneath a futuristic city',
    weight: 5,
    tags: ['urban', 'cyberpunk', 'underground'],
  },
  // Nature / Forest
  {
    text: 'ancient jungle ruins hidden beneath a dense canopy',
    weight: 7,
    tags: ['jungle', 'nature'],
  },
  {
    text: 'dense pine forest at twilight with fog rolling between trees',
    weight: 7,
    tags: ['forest', 'nature'],
  },
  {
    text: 'bamboo forest in heavy fog with shafts of light cutting through',
    weight: 6,
    tags: ['forest', 'nature'],
  },
  { text: 'enormous waterfall cascading into a misty canyon', weight: 6, tags: ['nature', 'epic'] },
  { text: 'vast wheat field under a dramatic approaching storm', weight: 6, tags: ['nature'] },
  {
    text: 'bioluminescent cave system with underground rivers',
    weight: 5,
    tags: ['underground', 'nature'],
  },
  {
    text: 'overgrown post-apocalyptic city reclaimed by nature',
    weight: 7,
    tags: ['urban', 'nature'],
  },
  {
    text: 'ancient colosseum overgrown with wildflowers and vines',
    weight: 6,
    tags: ['nature', 'fantasy'],
  },
  {
    text: 'moss-covered redwood forest with trees taller than skyscrapers',
    weight: 6,
    tags: ['forest', 'nature', 'epic'],
  },
  {
    text: 'misty swamp at dawn with cypress trees draped in hanging moss',
    weight: 5,
    tags: ['nature'],
  },
  {
    text: 'alpine meadow at the edge of a glacial lake reflecting snow-capped peaks',
    weight: 6,
    tags: ['nature', 'mountain'],
  },
  {
    text: 'ancient petrified forest with trees turned to crystal',
    weight: 5,
    tags: ['nature', 'surreal'],
  },
  {
    text: 'tropical lagoon surrounded by volcanic cliffs and jungle',
    weight: 6,
    tags: ['nature', 'tropical', 'coastal'],
  },
  // Fantasy
  {
    text: 'floating islands high above an endless cloud ocean',
    weight: 6,
    tags: ['fantasy', 'sky'],
  },
  {
    text: 'medieval castle courtyard at sunrise with mist rolling through',
    weight: 6,
    tags: ['fantasy'],
  },
  {
    text: 'ancient library with towering shelves reaching into darkness',
    weight: 7,
    tags: ['interior', 'fantasy'],
  },
  {
    text: 'steampunk airship dock above the clouds at golden hour',
    weight: 5,
    tags: ['sky', 'fantasy'],
  },
  {
    text: 'crumbling stone bridge spanning an impossibly deep chasm',
    weight: 5,
    tags: ['fantasy', 'epic'],
  },
  {
    text: 'cliffside monastery perched above a sea of clouds',
    weight: 6,
    tags: ['mountain', 'fantasy'],
  },
  {
    text: 'enormous tree with a city built into its branches',
    weight: 5,
    tags: ['fantasy', 'nature'],
  },
  {
    text: 'dragon graveyard with massive ribcages forming natural arches',
    weight: 5,
    tags: ['fantasy', 'epic'],
  },
  {
    text: 'wizard tower interior with floating books and swirling arcane energy',
    weight: 5,
    tags: ['fantasy', 'interior'],
  },
  {
    text: 'enchanted marketplace where the stalls sell bottled starlight and memories',
    weight: 4,
    tags: ['fantasy'],
    rarity: 'bold',
  },
  {
    text: 'underground dwarven forge with rivers of molten metal and massive anvils',
    weight: 5,
    tags: ['fantasy', 'underground', 'fire'],
  },
  {
    text: 'elven treehouse city connected by rope bridges in a canopy of golden leaves',
    weight: 5,
    tags: ['fantasy', 'nature'],
  },
  // Gothic / Dark
  {
    text: 'massive gothic cathedral interior with towering arches',
    weight: 6,
    tags: ['gothic', 'interior'],
  },
  {
    text: 'haunted Victorian mansion with flickering candlelight in every window',
    weight: 5,
    tags: ['gothic', 'interior'],
  },
  {
    text: 'graveyard on a hilltop with crooked headstones and dead trees',
    weight: 5,
    tags: ['gothic', 'nature'],
  },
  {
    text: 'abandoned asylum with peeling wallpaper and long shadowed corridors',
    weight: 4,
    tags: ['gothic', 'interior'],
  },
  {
    text: 'rain-lashed lighthouse on a rocky cliff above churning black waves',
    weight: 5,
    tags: ['gothic', 'coastal', 'rain'],
  },
  // Snow / Ice
  { text: 'frozen mountain temple carved into a cliffside', weight: 6, tags: ['snow', 'mountain'] },
  { text: 'samurai temple courtyard during heavy snowfall', weight: 5, tags: ['snow', 'fantasy'] },
  {
    text: 'crystalline ice cavern with light refracting through frozen walls',
    weight: 5,
    tags: ['snow', 'underground'],
  },
  {
    text: 'frozen shipwreck locked in a glacier with aurora overhead',
    weight: 5,
    tags: ['snow', 'epic'],
  },
  {
    text: 'abandoned arctic research station half-buried in snowdrifts',
    weight: 5,
    tags: ['snow'],
  },
  // Desert / Wasteland
  {
    text: 'cracked desert highway with rusted wreckage stretching to the horizon',
    weight: 6,
    tags: ['desert'],
  },
  {
    text: 'alien desert planet under twin moons with crystal outcroppings',
    weight: 5,
    tags: ['space', 'desert'],
  },
  {
    text: 'sandstone canyon city carved into towering red cliff walls',
    weight: 6,
    tags: ['desert', 'epic'],
  },
  {
    text: 'sun-bleached ruins of a civilization buried by sand dunes',
    weight: 5,
    tags: ['desert'],
  },
  // Underwater
  {
    text: 'deep underwater ancient city covered in coral and seaweed',
    weight: 5,
    tags: ['underwater'],
  },
  {
    text: 'coral reef city with buildings grown from living coral',
    weight: 4,
    tags: ['underwater'],
    rarity: 'bold',
  },
  {
    text: 'sunken cathedral with shafts of light piercing through the water',
    weight: 5,
    tags: ['underwater'],
  },
  {
    text: 'deep ocean trench with bioluminescent creatures and volcanic vents',
    weight: 4,
    tags: ['underwater'],
    rarity: 'bold',
  },
  // Space / Sci-Fi
  {
    text: 'enormous futuristic spaceport hangar filled with ships',
    weight: 5,
    tags: ['space', 'interior'],
  },
  {
    text: 'futuristic greenhouse dome filled with alien plant life',
    weight: 5,
    tags: ['space', 'interior'],
  },
  {
    text: 'wrecked spacecraft half-buried in an alien jungle',
    weight: 5,
    tags: ['space', 'jungle'],
  },
  {
    text: 'space station observation deck overlooking a nebula',
    weight: 5,
    tags: ['space', 'interior'],
  },
  {
    text: 'terraforming colony on Mars with half-built domes and red dust',
    weight: 5,
    tags: ['space', 'desert'],
  },
  {
    text: 'asteroid mining facility with massive drills and zero-gravity debris',
    weight: 4,
    tags: ['space'],
    rarity: 'bold',
  },
  // Coastal / Water
  { text: 'sun-drenched Mediterranean cliffside village', weight: 6, tags: ['coastal'] },
  {
    text: 'stormy harbor with fishing boats straining at their moorings',
    weight: 5,
    tags: ['coastal', 'rain'],
  },
  {
    text: 'seaside boardwalk at sunset with carnival lights and cotton candy vendors',
    weight: 5,
    tags: ['coastal'],
  },
  // Volcanic / Fire
  { text: 'vast volcanic landscape with rivers of molten lava', weight: 5, tags: ['fire', 'epic'] },
  {
    text: 'obsidian fortress built on the rim of an active volcano',
    weight: 5,
    tags: ['fire', 'fantasy', 'epic'],
  },
  // Surreal
  {
    text: 'surreal landscape where the ground is made of mirrors reflecting an impossible sky',
    weight: 4,
    tags: ['surreal'],
    rarity: 'bold',
  },
  {
    text: 'infinite staircase spiraling through clouds with doors on every landing',
    weight: 4,
    tags: ['surreal', 'sky'],
    rarity: 'bold',
  },
  {
    text: 'field of giant clocks half-melted into the landscape like Dali',
    weight: 3,
    tags: ['surreal'],
    rarity: 'bold',
  },
  // Cozy / Interior
  {
    text: 'cozy bookshop interior with rain streaking the windows and warm lamp light',
    weight: 6,
    tags: ['interior', 'cozy', 'rain'],
  },
  {
    text: 'old jazz club with velvet booths and a single spotlight on an empty stage',
    weight: 5,
    tags: ['interior', 'urban'],
  },
  {
    text: 'dimly lit ramen shop with steam rising from bowls and a neon sign outside',
    weight: 6,
    tags: ['interior', 'urban', 'cozy'],
  },
];

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

const FOREGROUND: Entry[] = [
  { text: 'foreground framed by hanging cables and dripping water', weight: 6, tags: ['urban'] },
  { text: 'foreground filled with mossy stone and broken statues', weight: 6 },
  { text: 'foreground cluttered with abandoned machinery and sparks', weight: 5 },
  { text: 'foreground with lanterns and fabric banners swaying', weight: 6 },
  { text: 'foreground with cracked glass reflecting distorted light', weight: 5 },
  { text: 'foreground framed through a stone archway', weight: 6 },
  { text: 'foreground with gnarled tree roots and fallen leaves', weight: 5, tags: ['nature'] },
  { text: 'foreground with scattered debris and dust particles', weight: 5 },
  { text: 'foreground through a rain-streaked window', weight: 5, tags: ['rain'] },
  { text: 'foreground with wildflowers and tall grass', weight: 5, tags: ['nature'] },
  { text: 'foreground framed by massive stone columns', weight: 6 },
  { text: 'foreground with puddles reflecting the scene above', weight: 6, tags: ['rain'] },
  {
    text: 'foreground with rusted chain-link fence and overgrown weeds',
    weight: 5,
    tags: ['urban'],
  },
  { text: 'foreground framed through a crumbling doorway', weight: 5 },
  { text: 'foreground with glowing mushrooms and ferns', weight: 4, tags: ['nature'] },
  { text: 'foreground with candles melted onto stone ledges', weight: 5 },
  { text: 'foreground with icicles and frost-covered railings', weight: 4, tags: ['snow'] },
  { text: 'foreground with floating dust motes caught in a beam of light', weight: 5 },
  {
    text: 'foreground with tangled vines and hanging flowers',
    weight: 5,
    tags: ['nature', 'tropical'],
  },
  { text: 'foreground with stacked old books and scattered papers', weight: 4, tags: ['interior'] },
];

const MIDGROUND: Entry[] = [
  { text: 'silhouettes moving through the scene', weight: 6 },
  { text: 'ancient staircases leading toward a sealed doorway', weight: 6 },
  { text: 'vendors and stalls crowded with strange objects', weight: 5, tags: ['urban'] },
  { text: 'broken vehicles and scattered debris', weight: 5 },
  { text: 'winding paths disappearing around corners', weight: 5 },
  { text: 'crumbling walls with vines pushing through cracks', weight: 5, tags: ['nature'] },
  { text: 'floating debris suspended in the air', weight: 4, rarity: 'bold' },
  { text: 'other travelers or figures barely visible in the haze', weight: 5 },
  { text: 'bridges and walkways connecting structures', weight: 5 },
  { text: 'steam and smoke drifting across the ground', weight: 5 },
  { text: 'a still body of water reflecting the sky perfectly', weight: 5 },
  { text: 'rows of massive pillars receding into the distance', weight: 5 },
  { text: 'scattered campfires with embers drifting upward', weight: 5, tags: ['fire'] },
  { text: 'a winding river cutting through the landscape', weight: 5, tags: ['nature'] },
  { text: 'cargo containers and crates stacked haphazardly', weight: 4, tags: ['urban'] },
  { text: 'a fallen statue lying on its side in the rubble', weight: 5 },
  { text: 'train tracks curving away into the distance', weight: 4, tags: ['urban'] },
  { text: 'prayer flags or cloth strips fluttering on lines', weight: 4 },
];

const BACKGROUND: Entry[] = [
  { text: 'distant skyline fading into fog', weight: 6, tags: ['skyline'] },
  { text: 'colossal statues barely visible in the mist', weight: 5 },
  { text: 'towering mountains disappearing into clouds', weight: 6, tags: ['mountains'] },
  {
    text: 'giant spaceship silhouette suspended above the horizon',
    weight: 4,
    tags: ['space'],
    rarity: 'bold',
  },
  { text: 'endless ocean reflecting storm clouds', weight: 5, tags: ['coastal'] },
  { text: 'distant city lights twinkling through haze', weight: 6, tags: ['skyline'] },
  { text: 'massive cloud formations reaching to the stratosphere', weight: 5 },
  { text: 'jagged mountain range silhouetted against the sky', weight: 6, tags: ['mountains'] },
  {
    text: 'a second moon or planet visible on the horizon',
    weight: 3,
    tags: ['space'],
    rarity: 'bold',
  },
  { text: 'distant waterfalls cascading off floating islands', weight: 4, rarity: 'bold' },
  { text: 'an approaching wall of storm clouds', weight: 5 },
  { text: 'an enormous ancient structure half-hidden by mist', weight: 5 },
  { text: 'a volcano glowing red on the distant horizon', weight: 4, tags: ['fire'] },
  {
    text: 'dense forest canopy stretching endlessly in every direction',
    weight: 5,
    tags: ['nature'],
  },
  { text: 'a lighthouse beam sweeping through distant fog', weight: 4, tags: ['coastal'] },
  { text: 'an enormous aurora curtain draped across the entire sky', weight: 4, rarity: 'bold' },
  {
    text: 'the curve of a ringworld or megastructure arcing overhead',
    weight: 3,
    tags: ['space'],
    rarity: 'bold',
  },
  { text: 'smoke plumes rising from multiple points across the horizon', weight: 4 },
  { text: 'a massive suspension bridge disappearing into clouds', weight: 5 },
  { text: 'layers of misty valleys descending into blue distance', weight: 5, tags: ['mountains'] },
];

const SIGNATURE_DETAILS: Entry[] = [
  // Safe
  { text: 'tiny paper lanterns drifting upward like embers', weight: 3 },
  { text: 'an ancient vending machine still humming faintly', weight: 3 },
  { text: 'a single red umbrella abandoned on the ground', weight: 3 },
  { text: 'a piano half-submerged and covered in moss', weight: 3 },
  { text: 'flowers growing from cracks in the concrete', weight: 3 },
  { text: "a child's bicycle leaning against a wall untouched for years", weight: 3 },
  { text: "a single pair of shoes left neatly at the water's edge", weight: 3 },
  { text: 'wind chimes made of glass catching the light', weight: 3 },
  { text: 'a handwritten note pinned to a post fluttering in the breeze', weight: 3 },
  { text: 'a cat sitting perfectly still watching from a high ledge', weight: 3 },
  { text: 'a row of prayer candles still burning in the dark', weight: 3 },
  // Bold
  { text: 'a clock with no hands mounted on a crumbling wall', weight: 2, rarity: 'bold' },
  { text: 'glowing koi fish swimming through the air', weight: 2, rarity: 'bold' },
  { text: 'a cracked moon visible between storm clouds', weight: 2, rarity: 'bold' },
  { text: 'birds made of folded paper circling overhead', weight: 2, rarity: 'bold' },
  { text: 'a single spotlight with no visible source', weight: 2, rarity: 'bold' },
  { text: 'a trail of glowing footprints leading into the distance', weight: 2, rarity: 'bold' },
  { text: 'butterflies made of light dissolving into particles', weight: 2, rarity: 'bold' },
  { text: 'a tree growing upside down from the ceiling', weight: 2, rarity: 'bold' },
  { text: 'a doorway standing alone with nothing around it', weight: 2, rarity: 'bold' },
  { text: 'a whale skeleton suspended in midair', weight: 2, rarity: 'bold' },
  { text: 'a staircase that leads down into the sky', weight: 2, rarity: 'bold' },
  {
    text: 'fireflies that leave trails of light like long exposure photography',
    weight: 2,
    rarity: 'bold',
  },
  // Chaotic
  { text: 'upside-down rain falling toward the clouds', weight: 1, rarity: 'chaotic' },
  {
    text: 'a mirror standing upright reflecting a different scene entirely',
    weight: 1,
    rarity: 'chaotic',
  },
  { text: 'snow falling upward from the ground', weight: 1, rarity: 'chaotic' },
  {
    text: 'gravity reversed for a single object floating above the ground',
    weight: 1,
    rarity: 'chaotic',
  },
  { text: 'the shadow of the figure does not match their pose', weight: 1, rarity: 'chaotic' },
];

// EVERY action MUST imply the character faces the camera. No looking away, no back-turned,
// no gazing at the horizon. These are explicitly camera-facing poses.
const ACTIONS_FACESWAP: Entry[] = [
  { text: 'walking toward the camera with a confident stride', weight: 8 },
  { text: 'standing facing the camera with arms crossed', weight: 7 },
  { text: 'leaning against a wall facing the camera', weight: 7 },
  { text: 'holding a glowing object at chest height and looking at the viewer', weight: 6 },
  { text: 'standing with hands in pockets facing the camera', weight: 7 },
  { text: 'looking directly at the camera with a slight smile', weight: 6 },
  { text: 'reading something held at chest height with face tilted toward camera', weight: 5 },
  { text: 'speaking to someone just off-camera to the left', weight: 5 },
  { text: 'turning head toward the camera with a three-quarter front angle', weight: 7 },
  { text: 'standing facing the viewer with wind blowing their hair', weight: 6 },
  { text: 'holding a lantern near waist level and looking at the camera', weight: 5 },
  { text: 'resting one arm on a railing and facing the viewer', weight: 5 },
  { text: 'pausing mid-stride and turning to face the camera', weight: 6 },
  { text: 'sitting and looking up toward the camera', weight: 5 },
];

const ACTIONS_WIDE: Entry[] = [
  { text: 'walking alone through the scene', weight: 7 },
  { text: 'climbing ancient stairs toward a sealed gateway', weight: 6 },
  { text: 'running through the scene holding something', weight: 5 },
  { text: 'standing at the very edge of a precipice', weight: 6 },
  { text: 'kneeling beside a strange glowing object', weight: 5 },
  { text: 'pushing through a crowd or dense environment', weight: 5 },
  { text: 'descending into darkness holding a light source', weight: 5 },
  { text: 'silhouetted against a massive light source', weight: 6 },
  { text: 'drifting weightlessly through the space', weight: 4, rarity: 'bold' },
  { text: 'riding a massive creature through the scene', weight: 4, rarity: 'bold' },
  { text: 'pulling open a massive door or gate', weight: 5 },
  { text: 'wading through shallow water toward something glowing', weight: 5 },
  { text: 'pointing toward something in the far distance', weight: 4 },
  { text: 'carrying a wounded companion through the wreckage', weight: 4, rarity: 'bold' },
  { text: 'balancing on a narrow beam high above the ground', weight: 4 },
  { text: 'planting a flag or marker at the summit', weight: 4 },
];

const STORY_HOOKS: Entry[] = [
  { text: 'the door has just opened for the first time in centuries', weight: 5 },
  { text: 'something massive is approaching from the distance', weight: 5 },
  { text: 'everyone is gone but the lights are still on', weight: 6 },
  { text: 'this is the last safe place before the storm hits', weight: 5 },
  { text: 'an artifact is glowing for the first time', weight: 5 },
  { text: 'the ground is beginning to shake', weight: 4 },
  { text: 'a signal has just been received from somewhere impossible', weight: 4, rarity: 'bold' },
  { text: 'the water is slowly rising', weight: 4 },
  { text: 'dawn is breaking after the longest night', weight: 5 },
  { text: 'something ancient has just woken up', weight: 4, rarity: 'bold' },
  { text: 'the last ship is leaving and there is one seat left', weight: 4 },
  { text: 'the path forward is about to disappear', weight: 4 },
  { text: 'this place should not exist', weight: 3, rarity: 'bold' },
  { text: 'a sound that no one has heard in a thousand years echoes through the space', weight: 4 },
  { text: 'the barrier between worlds is thinning', weight: 3, rarity: 'bold' },
  { text: 'the map says there is nothing here but here it is', weight: 4 },
  {
    text: 'a countdown has started and nobody knows what happens at zero',
    weight: 3,
    rarity: 'bold',
  },
  { text: 'the fire is dying and so is the light', weight: 4 },
  { text: 'they were told never to come here', weight: 5 },
  { text: 'the silence is new and it means something has changed', weight: 4 },
  { text: 'the last person who saw this never came back', weight: 4 },
  { text: 'something is watching from just outside the light', weight: 4 },
  { text: 'the air smells like rain and memory', weight: 3 },
  { text: 'a choice must be made before the sun sets', weight: 4 },
  { text: 'the bridge will only hold for one more crossing', weight: 4 },
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
  { text: 'medium shot, subject readable face, 50mm lens, cinematic framing', weight: 8 },
  { text: 'three-quarter shot, face clearly visible, 45mm lens, background expansive', weight: 7 },
  { text: 'environmental portrait, eye-level angle, 50mm lens', weight: 7 },
  { text: 'medium shot, natural perspective, eye-level, 45mm lens', weight: 6 },
  { text: 'environmental portrait, rule of thirds, 50mm lens', weight: 6 },
];

const CAMERA_WIDE: Entry[] = [
  {
    text: 'wide establishing shot, full body, character small in frame, environment dominates, 24mm lens',
    weight: 8,
  },
  { text: 'ultra wide shot, tiny silhouette against massive environment, 24mm lens', weight: 6 },
  { text: 'low angle wide shot emphasizing towering scale, 24mm lens', weight: 6 },
  { text: 'high angle wide shot showing the entire layout, 28mm lens', weight: 5 },
  { text: 'wide cinematic shot, character placed on rule of thirds, 28mm lens', weight: 7 },
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
  'foreground midground background, layered composition, deep depth of field, highly detailed environment, atmospheric haze, cinematic lighting';
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

  // Pick from Sonnet-generated pools (creative content)
  const setting = filterAndPick(GEN_SETTINGS, tags, rules, rand, allowChaotic);
  const scale = filterAndPick(SCALE, tags, rules, rand, allowChaotic);
  const time = filterAndPick(TIME, tags, rules, rand, allowChaotic);
  const weather = filterAndPick(WEATHER, tags, rules, rand, allowChaotic);
  const lighting = filterAndPick(LIGHTING, tags, rules, rand, allowChaotic);
  const foreground = filterAndPick(GEN_FOREGROUND, tags, rules, rand, allowChaotic);
  const midground = filterAndPick(GEN_MIDGROUND, tags, rules, rand, allowChaotic);
  const background = filterAndPick(GEN_BACKGROUND, tags, rules, rand, allowChaotic);

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
  const actionPool = opts.faceSwapEligible ? GEN_ACTIONS_FACESWAP : ACTIONS_WIDE;
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

  // ── Location injection via card or fallback ──
  const genre = resolveGenre(tags);
  let settingText = setting.text;
  let locationTextureBlock = '';

  if (opts.includeLocation && opts.userPlace) {
    if (opts.locationCard) {
      const lc = opts.locationCard;
      const genreFusions = lc.fusion_settings && lc.fusion_settings[genre];
      if (rand() < 0.4 && genreFusions && genreFusions.length > 0) {
        // 40% fusion: replace setting with random genre-appropriate fusion
        settingText = pickOne(genreFusions, rand);
      } else {
        // 60% seasoning: sprinkle 2-3 cinematic phrases as atmosphere
        const allPhrases = [...lc.cinematic_phrases, ...lc.visual_palette, ...lc.atmosphere];
        if (allPhrases.length > 0) {
          locationTextureBlock =
            'location textures: ' +
            pickN(allPhrases, Math.min(3, allPhrases.length), rand).join(', ');
        }
      }
    } else {
      settingText = settingText + ', set in ' + opts.userPlace;
    }
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

  if (locationTextureBlock) pieces.push(locationTextureBlock);
  if (signatureText) pieces.push(signatureText);
  if (objectBlock) pieces.push(objectBlock);

  if (opts.faceSwapEligible) {
    // Face-swap: controlled DOF, subject scale, anti-wide negatives
    pieces.push(
      'foreground midground background, layered composition, controlled depth of field, sharp subject, detailed background, atmospheric haze, cinematic lighting'
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
    pieces.push('not a distant silhouette, not tiny subject, not wide establishing shot');
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

  return pieces.join(', ');
}

/**
 * Balanced Mix — smart selection helpers for mediums and vibes.
 * Pure functions, no API calls, no UI state coupling.
 * These are one-tap fill helpers, NOT persistent modes.
 */

// ── Medium Buckets (derived from characterRenderMode) ─────────────────

const NATURAL_MEDIUMS = [
  'photography',
  'anime',
  'pencil',
  'comics',
  'neon',
  'shimmer',
  'canvas',
  'watercolor',
  'surreal',
  'gothic',
  'fairytale',
  'coquette',
  'twilight',
];

const EMBODIED_MEDIUMS = [
  'lego',
  'claymation',
  'vinyl',
  'animation',
  'storybook',
  'pixels',
  'vaporwave',
  'handcrafted',
];

const POPULAR_MEDIUMS = [
  'photography',
  'anime',
  'comics',
  'pencil',
  'shimmer',
  'neon',
  'lego',
  'animation',
];

// ── Vibe Roles ────────────────────────────────────────────────────────

const GROUNDING_VIBES = ['cozy', 'peaceful', 'nostalgic', 'minimal'];
const ENERGY_VIBES = ['epic', 'cinematic', 'majestic', 'fierce', 'enchanted'];
const FLAVOR_VIBES = [
  'dreamy',
  'whimsical',
  'mystical',
  'psychedelic',
  'ethereal',
  'chaos',
  'dark',
  'ominous',
  'ancient',
];

const POPULAR_VIBES = [
  'dreamy',
  'epic',
  'cozy',
  'cinematic',
  'enchanted',
  'whimsical',
  'nostalgic',
  'ethereal',
];

// ── Helpers ───────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// ── Balanced Selection ────────────────────────────────────────────────

/**
 * Auto-pick a balanced set of mediums.
 * 2 natural + 2 embodied + 1 wildcard = 5 total.
 * Ensures diversity across render modes.
 */
export function balancedMediums(): string[] {
  const natural = pickN(NATURAL_MEDIUMS, 2);
  const embodied = pickN(EMBODIED_MEDIUMS, 2);
  const remaining = [...NATURAL_MEDIUMS, ...EMBODIED_MEDIUMS].filter(
    (m) => !natural.includes(m) && !embodied.includes(m)
  );
  const wildcard = pickN(remaining, 1);
  return [...natural, ...embodied, ...wildcard];
}

/**
 * Auto-pick a balanced set of vibes.
 * 1 grounding + 2 energy + 1 flavor = 4 total.
 * Ensures emotional coherence without contradiction.
 */
export function balancedVibes(): string[] {
  const grounding = pickN(GROUNDING_VIBES, 1);
  const energy = pickN(ENERGY_VIBES, 2);
  const flavor = pickN(FLAVOR_VIBES, 1);
  return [...grounding, ...energy, ...flavor];
}

// ── Surprise Selection ────────────────────────────────────────────────

/**
 * Random selection weighted toward popular mediums.
 * Picks 5 total.
 */
export function surpriseMediums(): string[] {
  // 60% from popular, 40% from everything else
  const fromPopular = pickN(POPULAR_MEDIUMS, 3);
  const remaining = [...NATURAL_MEDIUMS, ...EMBODIED_MEDIUMS].filter(
    (m) => !fromPopular.includes(m)
  );
  const fromRest = pickN(remaining, 2);
  return [...fromPopular, ...fromRest];
}

/**
 * Random selection weighted toward popular vibes.
 * Picks 4 total.
 */
export function surpriseVibes(): string[] {
  const fromPopular = pickN(POPULAR_VIBES, 3);
  const allVibes = [...GROUNDING_VIBES, ...ENERGY_VIBES, ...FLAVOR_VIBES];
  const remaining = allVibes.filter((v) => !fromPopular.includes(v));
  const fromRest = pickN(remaining, 1);
  return [...fromPopular, ...fromRest];
}

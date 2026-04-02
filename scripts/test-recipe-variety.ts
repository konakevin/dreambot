/**
 * Recipe Engine Variety Test
 *
 * 10 distinct user personas, each built ONLY from UI-achievable choices.
 * Rolls 10 prompts per user and analyzes variety + personality alignment.
 */

import { buildPromptInput, buildRawPrompt } from '../lib/recipeEngine';
import type { Recipe } from '../types/recipe';
import { MOOD_TILES } from '../constants/onboarding';

// ── Helper: compute mood axes from selected mood keys ──────────────────────
function moodAxes(keys: string[]): { energy: number; brightness: number; color_warmth: number } {
  const tiles = MOOD_TILES.filter((m) => keys.includes(m.key));
  if (tiles.length === 0) return { energy: 0.5, brightness: 0.5, color_warmth: 0.5 };
  const energy = tiles.reduce((s, m) => s + m.energy, 0) / tiles.length;
  const brightness = tiles.reduce((s, m) => s + m.brightness, 0) / tiles.length;
  const color_warmth = tiles.reduce((s, m) => s + m.warmth, 0) / tiles.length;
  return { energy, brightness, color_warmth };
}

// Style sliders use toStored: slider 0-1 → stored 0.10-0.90
function toStored(slider: number): number {
  return 0.10 + slider * 0.80;
}

// ── 10 User Profiles (UI-achievable only) ──────────────────────────────────

interface UserProfile {
  name: string;
  description: string;
  moods: string[];
  // Slider positions 0-1 (will be converted via toStored for realism/weirdness/scale)
  realismSlider: number;
  weirdnessSlider: number;
  scaleSlider: number;
  chaosSlider: number; // raw 0-1
  recipe: Omit<Recipe, 'axes'>;
}

const profiles: UserProfile[] = [
  {
    name: 'Grandma Betty',
    description: 'Retired dog lover. Cozy, warm, gentle. Loves animals and nature.',
    moods: ['cozy', 'peaceful', 'nostalgic'],
    realismSlider: 0.3, weirdnessSlider: 0.1, scaleSlider: 0.3, chaosSlider: 0.1,
    recipe: {
      interests: ['animals', 'nature', 'food'],
      color_palettes: ['warm_sunset', 'soft_pastel'],
      personality_tags: ['cozy', 'gentle', 'peaceful'],
      eras: ['victorian', 'retro'],
      settings: ['cozy_indoors', 'village'],
      scene_atmospheres: ['golden_hour', 'sunny_morning'],
      spirit_companion: 'rabbit',
    },
  },
  {
    name: 'Jake the Gamer',
    description: 'College kid. Lives for gaming, anime, and epic moments.',
    moods: ['epic', 'intense', 'playful'],
    realismSlider: 0.2, weirdnessSlider: 0.5, scaleSlider: 0.7, chaosSlider: 0.6,
    recipe: {
      interests: ['gaming', 'geek', 'movies'],
      color_palettes: ['neon', 'dark_bold'],
      personality_tags: ['adventurous', 'bold', 'chaotic'],
      eras: ['synthwave', 'far_future'],
      settings: ['city_streets', 'space'],
      scene_atmospheres: ['starry_midnight', 'stormy_twilight'],
      spirit_companion: 'dragon',
    },
  },
  {
    name: 'Dr. Priya (Sci-Fi Techie)',
    description: 'Software engineer who reads hard sci-fi. Futuristic, dark, cerebral.',
    moods: ['mysterious', 'epic', 'intense'],
    realismSlider: 0.8, weirdnessSlider: 0.6, scaleSlider: 0.8, chaosSlider: 0.3,
    recipe: {
      interests: ['sci_fi', 'space', 'abstract'],
      color_palettes: ['cool_twilight', 'monochrome'],
      personality_tags: ['futuristic', 'mysterious', 'bold'],
      eras: ['far_future', 'modern'],
      settings: ['space', 'otherworldly'],
      scene_atmospheres: ['starry_midnight', 'aurora_night'],
      spirit_companion: 'robot',
    },
  },
  {
    name: 'Luna the Dreamer',
    description: 'Art school student. Soft, ethereal, pastel everything.',
    moods: ['dreamy', 'serene', 'whimsical'],
    realismSlider: 0.0, weirdnessSlider: 0.4, scaleSlider: 0.4, chaosSlider: 0.4,
    recipe: {
      interests: ['abstract', 'whimsical', 'fashion'],
      color_palettes: ['soft_pastel', 'candy'],
      personality_tags: ['dreamy', 'whimsical', 'elegant'],
      eras: ['art_deco', 'victorian'],
      settings: ['otherworldly', 'village'],
      scene_atmospheres: ['foggy_dawn', 'golden_hour'],
      spirit_companion: 'butterfly',
    },
  },
  {
    name: 'Raven (Gothic)',
    description: 'Goth aesthetic. Dark, moody, dramatic. Loves horror and dark beauty.',
    moods: ['moody', 'mysterious', 'dramatic'],
    realismSlider: 0.6, weirdnessSlider: 0.7, scaleSlider: 0.5, chaosSlider: 0.3,
    recipe: {
      interests: ['dark', 'fantasy', 'architecture'],
      color_palettes: ['dark_bold', 'monochrome'],
      personality_tags: ['mysterious', 'edgy', 'fierce'],
      eras: ['medieval', 'victorian'],
      settings: ['underground', 'cozy_indoors'],
      scene_atmospheres: ['stormy_twilight', 'snowy_night'],
      spirit_companion: 'ghost',
    },
  },
  {
    name: 'River (Nature Hippie)',
    description: 'Park ranger. Zen, serene, loves oceans and forests.',
    moods: ['serene', 'peaceful', 'dreamy'],
    realismSlider: 0.7, weirdnessSlider: 0.1, scaleSlider: 0.9, chaosSlider: 0.15,
    recipe: {
      interests: ['nature', 'ocean', 'animals'],
      color_palettes: ['earthy_natural', 'cool_twilight'],
      personality_tags: ['peaceful', 'gentle', 'dreamy'],
      eras: ['ancient', 'prehistoric'],
      settings: ['wild_outdoors', 'mountains', 'underwater'],
      scene_atmospheres: ['sunny_morning', 'foggy_dawn', 'aurora_night'],
      spirit_companion: 'deer',
    },
  },
  {
    name: 'Hiro (Anime Fan)',
    description: 'Anime obsessed. Colorful, playful, Studio Ghibli vibes.',
    moods: ['playful', 'whimsical', 'epic'],
    realismSlider: 0.0, weirdnessSlider: 0.3, scaleSlider: 0.5, chaosSlider: 0.5,
    recipe: {
      interests: ['geek', 'cute', 'fantasy'],
      color_palettes: ['candy', 'neon'],
      personality_tags: ['playful', 'whimsical', 'adventurous'],
      eras: ['modern', 'far_future'],
      settings: ['city_streets', 'otherworldly'],
      scene_atmospheres: ['golden_hour', 'starry_midnight'],
      spirit_companion: 'cat',
    },
  },
  {
    name: 'Zara (Chaos Agent)',
    description: 'Wants maximum surprise. Surreal, high-energy, full chaos.',
    moods: ['intense', 'dramatic', 'epic'],
    realismSlider: 0.5, weirdnessSlider: 1.0, scaleSlider: 0.5, chaosSlider: 1.0,
    recipe: {
      interests: ['abstract', 'whimsical', 'space'],
      color_palettes: ['everything'],
      personality_tags: ['chaotic', 'wild', 'bold'],
      eras: ['steampunk', 'synthwave', 'prehistoric'],
      settings: ['otherworldly', 'space', 'underground'],
      scene_atmospheres: ['stormy_twilight', 'aurora_night'],
      spirit_companion: 'jellyfish',
    },
  },
  {
    name: 'Eloise (Cottagecore)',
    description: 'Vintage romantic. Gardens, tea, Victorian charm.',
    moods: ['cozy', 'nostalgic', 'peaceful'],
    realismSlider: 0.4, weirdnessSlider: 0.0, scaleSlider: 0.3, chaosSlider: 0.1,
    recipe: {
      interests: ['nature', 'food', 'fashion'],
      color_palettes: ['warm_sunset', 'sepia', 'earthy_natural'],
      personality_tags: ['cozy', 'romantic', 'nostalgic', 'elegant'],
      eras: ['victorian', 'retro'],
      settings: ['cozy_indoors', 'village', 'wild_outdoors'],
      scene_atmospheres: ['golden_hour', 'rainy_afternoon'],
      spirit_companion: 'deer',
    },
  },
  {
    name: 'Max (10yo Kid)',
    description: 'Loves Pokémon, dinosaurs, and silly stuff. Bright and playful.',
    moods: ['playful', 'whimsical', 'dreamy'],
    realismSlider: 0.0, weirdnessSlider: 0.5, scaleSlider: 0.4, chaosSlider: 0.7,
    recipe: {
      interests: ['gaming', 'animals', 'cute', 'movies'],
      color_palettes: ['candy', 'neon'],
      personality_tags: ['playful', 'wild', 'adventurous'],
      eras: ['modern', 'far_future', 'prehistoric'],
      settings: ['wild_outdoors', 'otherworldly', 'beach_tropical'],
      scene_atmospheres: ['sunny_morning', 'starry_midnight'],
      spirit_companion: 'dragon',
    },
  },
];

// ── Build full Recipe from profile ─────────────────────────────────────────

function buildRecipe(profile: UserProfile): Recipe {
  const axes = moodAxes(profile.moods);
  return {
    axes: {
      color_warmth: axes.color_warmth,
      complexity: 0.5, // never set by UI
      realism: toStored(profile.realismSlider),
      energy: axes.energy,
      brightness: axes.brightness,
      chaos: profile.chaosSlider,
      weirdness: toStored(profile.weirdnessSlider),
      scale: toStored(profile.scaleSlider),
    },
    ...profile.recipe,
  };
}

// ── Run the test ───────────────────────────────────────────────────────────

const ROLLS_PER_USER = 10;

console.log('═══════════════════════════════════════════════════════════════');
console.log('  RECIPE ENGINE VARIETY TEST — 10 Users × 10 Rolls');
console.log('═══════════════════════════════════════════════════════════════\n');

interface RollStats {
  mediums: Map<string, number>;
  moods: Map<string, number>;
  lightings: Map<string, number>;
  settings: Map<string, number>;
  eras: Map<string, number>;
  actions: Map<string, number>;
  subjects: Map<string, number>;
  hadSubject: number;
  hadAction: number;
  hadSpirit: number;
  interestExpansions: string[];
}

const allUserResults: { name: string; description: string; axes: Record<string, number>; stats: RollStats; prompts: string[] }[] = [];

for (const profile of profiles) {
  const recipe = buildRecipe(profile);
  const stats: RollStats = {
    mediums: new Map(), moods: new Map(), lightings: new Map(),
    settings: new Map(), eras: new Map(), actions: new Map(), subjects: new Map(),
    hadSubject: 0, hadAction: 0, hadSpirit: 0, interestExpansions: [],
  };
  const prompts: string[] = [];

  for (let i = 0; i < ROLLS_PER_USER; i++) {
    const input = buildPromptInput(recipe);
    const prompt = buildRawPrompt(input);
    prompts.push(prompt);

    // Track stats
    stats.mediums.set(input.medium, (stats.mediums.get(input.medium) || 0) + 1);
    stats.moods.set(input.mood, (stats.moods.get(input.mood) || 0) + 1);
    stats.lightings.set(input.lighting, (stats.lightings.get(input.lighting) || 0) + 1);
    stats.settings.set(input.settingKeywords, (stats.settings.get(input.settingKeywords) || 0) + 1);
    stats.eras.set(input.eraKeywords, (stats.eras.get(input.eraKeywords) || 0) + 1);
    if (input.action) {
      stats.hadAction++;
      stats.actions.set(input.action, (stats.actions.get(input.action) || 0) + 1);
    }
    if (input.dreamSubject) {
      stats.hadSubject++;
      stats.subjects.set(input.dreamSubject, (stats.subjects.get(input.dreamSubject) || 0) + 1);
    }
    if (input.spiritAppears) stats.hadSpirit++;
    stats.interestExpansions.push(...input.interests);
  }

  allUserResults.push({
    name: profile.name,
    description: profile.description,
    axes: recipe.axes,
    stats,
    prompts,
  });
}

// ── Report ─────────────────────────────────────────────────────────────────

for (const user of allUserResults) {
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  ${user.name} — "${user.description}"`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Axes: energy=${user.axes.energy.toFixed(2)} bright=${user.axes.brightness.toFixed(2)} warm=${user.axes.color_warmth.toFixed(2)} real=${user.axes.realism.toFixed(2)} weird=${user.axes.weirdness.toFixed(2)} scale=${user.axes.scale.toFixed(2)} chaos=${user.axes.chaos.toFixed(2)}`);
  console.log();

  // Show unique counts
  console.log(`  Unique mediums: ${user.stats.mediums.size}/10`);
  console.log(`  Unique moods: ${user.stats.moods.size}/10`);
  console.log(`  Unique lightings: ${user.stats.lightings.size}/10`);
  console.log(`  Unique settings: ${user.stats.settings.size}/10`);
  console.log(`  Unique eras: ${user.stats.eras.size}/10`);
  console.log(`  Had action: ${user.stats.hadAction}/10`);
  console.log(`  Had subject: ${user.stats.hadSubject}/10`);
  console.log(`  Spirit appeared: ${user.stats.hadSpirit}/10`);
  console.log();

  // Flag repeats (any item appearing 3+ times in 10 rolls is suspicious)
  const repeats: string[] = [];
  for (const [category, map] of [
    ['medium', user.stats.mediums],
    ['mood', user.stats.moods],
    ['lighting', user.stats.lightings],
    ['setting', user.stats.settings],
    ['era', user.stats.eras],
  ] as [string, Map<string, number>][]) {
    for (const [item, count] of map) {
      if (count >= 3) {
        repeats.push(`  ⚠️  ${category} repeated ${count}x: "${item.substring(0, 60)}..."`);
      }
    }
  }
  if (repeats.length > 0) {
    console.log('  REPEAT WARNINGS:');
    repeats.forEach((r) => console.log(r));
  } else {
    console.log('  ✅ No suspicious repeats (nothing appeared 3+ times)');
  }
  console.log();

  // Show interest expansions (were vague interests expanded?)
  const expansions = user.stats.interestExpansions;
  const uniqueExpansions = [...new Set(expansions)];
  console.log(`  Interest samples (${uniqueExpansions.length} unique across ${expansions.length} total):`);
  uniqueExpansions.slice(0, 8).forEach((e) => console.log(`    - ${e}`));
  if (uniqueExpansions.length > 8) console.log(`    ... and ${uniqueExpansions.length - 8} more`);
  console.log();

  // Print 3 sample prompts
  console.log('  SAMPLE PROMPTS:');
  for (let i = 0; i < 3; i++) {
    console.log(`  [${i + 1}] ${user.prompts[i]}`);
    console.log();
  }
}

// ── Cross-User Similarity Check ────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════════');
console.log('  CROSS-USER SIMILARITY ANALYSIS');
console.log('═══════════════════════════════════════════════════════════════\n');

// Check if different users are getting the same mediums
const userMediumSets = allUserResults.map((u) => ({
  name: u.name,
  mediums: new Set(u.stats.mediums.keys()),
}));

for (let i = 0; i < userMediumSets.length; i++) {
  for (let j = i + 1; j < userMediumSets.length; j++) {
    const a = userMediumSets[i];
    const b = userMediumSets[j];
    const overlap = [...a.mediums].filter((m) => b.mediums.has(m));
    const overlapPct = overlap.length / Math.max(a.mediums.size, b.mediums.size);
    if (overlapPct > 0.5) {
      console.log(`  ⚠️  ${a.name} ↔ ${b.name}: ${(overlapPct * 100).toFixed(0)}% medium overlap (${overlap.length} shared)`);
    }
  }
}

// Check mood overlap
const userMoodSets = allUserResults.map((u) => ({
  name: u.name,
  moods: new Set(u.stats.moods.keys()),
}));

for (let i = 0; i < userMoodSets.length; i++) {
  for (let j = i + 1; j < userMoodSets.length; j++) {
    const a = userMoodSets[i];
    const b = userMoodSets[j];
    const overlap = [...a.moods].filter((m) => b.moods.has(m));
    const overlapPct = overlap.length / Math.max(a.moods.size, b.moods.size);
    if (overlapPct > 0.6) {
      console.log(`  ⚠️  ${a.name} ↔ ${b.name}: ${(overlapPct * 100).toFixed(0)}% mood overlap (${overlap.length} shared)`);
    }
  }
}

console.log('\n  (Only showing pairs with >50% medium overlap or >60% mood overlap)');

// Global stats
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  GLOBAL STATS');
console.log('═══════════════════════════════════════════════════════════════\n');

const allMediums = new Set<string>();
const allMoods = new Set<string>();
const allLightings = new Set<string>();
allUserResults.forEach((u) => {
  u.stats.mediums.forEach((_, k) => allMediums.add(k));
  u.stats.moods.forEach((_, k) => allMoods.add(k));
  u.stats.lightings.forEach((_, k) => allLightings.add(k));
});
console.log(`  Total unique mediums used across all users: ${allMediums.size}`);
console.log(`  Total unique moods used across all users: ${allMoods.size}`);
console.log(`  Total unique lightings used across all users: ${allLightings.size}`);
console.log(`  Total prompts generated: ${allUserResults.length * ROLLS_PER_USER}`);

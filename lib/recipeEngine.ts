/**
 * Recipe Engine — translates a user's recipe into layered prompt constraints.
 *
 * Every attribute the user picks MUST change the output. If it doesn't reach
 * the prompt, it shouldn't be in the onboarding.
 *
 * Prompt layers:
 *   1. TECHNIQUE  — medium, palette, weirdness, scale (controls HOW it looks)
 *   2. SUBJECT    — interests, spirit companion (controls WHAT it shows)
 *   3. WORLD      — era, setting (controls WHERE/WHEN)
 *   4. ATMOSPHERE  — mood, personality tags, scene atmosphere (controls HOW IT FEELS)
 */

import type { Recipe } from '@/types/recipe';

// ── TECHNIQUE: Medium Pool ──────────────────────────────────────────────────
// Tagged with axes so the engine filters by rolled values.

interface TaggedOption {
  text: string;
  axes?: Partial<Record<'realism' | 'complexity' | 'energy' | 'color_warmth' | 'brightness', 'high' | 'low'>>;
}

const MEDIUM_POOL: TaggedOption[] = [
  { text: 'ultra-realistic photograph, DSLR, 8K detail', axes: { realism: 'high', complexity: 'high' } },
  { text: 'Pixar-style 3D render, soft rounded shapes, vibrant colors', axes: { realism: 'low', energy: 'low' } },
  { text: 'Studio Ghibli anime watercolor, hand-painted cel animation', axes: { realism: 'low', color_warmth: 'high' } },
  { text: 'adorable chibi kawaii illustration, big sparkly eyes, pastel colors', axes: { realism: 'low', brightness: 'high' } },
  { text: 'oil painting on canvas, visible brushstrokes, impressionist', axes: { realism: 'low', complexity: 'high' } },
  { text: 'papercraft diorama, handmade paper cutouts, miniature', axes: { realism: 'low', brightness: 'high' } },
  { text: 'vintage Disney animation cel, 1950s hand-drawn style', axes: { realism: 'low', color_warmth: 'high' } },
  { text: 'ukiyo-e Japanese woodblock print, flat color, bold outlines', axes: { realism: 'low', complexity: 'low' } },
  { text: 'chalk pastel on black paper, soft edges, dramatic contrast', axes: { brightness: 'low', energy: 'high' } },
  { text: 'claymation stop-motion, visible fingerprint textures in clay', axes: { realism: 'low' } },
  { text: 'retro 1980s airbrush illustration, chrome and gradients', axes: { energy: 'high', color_warmth: 'high' } },
  { text: 'botanical scientific illustration, ink linework with watercolor', axes: { complexity: 'high', energy: 'low' } },
  { text: 'stained glass window, bold black leading, jewel-tone translucent color', axes: { brightness: 'high', complexity: 'high' } },
  { text: 'neon sign art, glowing tube lights on dark brick wall', axes: { brightness: 'low', energy: 'high' } },
  { text: 'low-poly geometric 3D render, faceted surfaces', axes: { realism: 'low', complexity: 'low' } },
  { text: 'pencil sketch with watercolor splashes, loose linework', axes: { realism: 'low', complexity: 'low' } },
  { text: 'fantasy book cover illustration, lush detail, dramatic lighting', axes: { complexity: 'high', energy: 'high' } },
  { text: 'vaporwave digital collage, glitch art, pink and cyan', axes: { realism: 'low', energy: 'high' } },
  { text: 'cross-stitch embroidery on fabric, pixel grid texture', axes: { realism: 'low', complexity: 'low' } },
  { text: 'isometric pixel art, retro game aesthetic, crisp edges', axes: { realism: 'low', complexity: 'low' } },
];

// ── ATMOSPHERE: Mood Pool ───────────────────────────────────────────────────

const MOOD_POOL: TaggedOption[] = [
  { text: 'cozy and intimate', axes: { energy: 'low', color_warmth: 'high' } },
  { text: 'epic and grandiose', axes: { energy: 'high', complexity: 'high' } },
  { text: 'ethereal and dreamlike', axes: { energy: 'low', brightness: 'high' } },
  { text: 'playful and whimsical', axes: { energy: 'low', brightness: 'high' } },
  { text: 'moody and atmospheric', axes: { energy: 'low', brightness: 'low' } },
  { text: 'serene and peaceful', axes: { energy: 'low' } },
  { text: 'chaotic and energetic', axes: { energy: 'high' } },
  { text: 'haunting and melancholic', axes: { brightness: 'low', energy: 'low' } },
  { text: 'luxurious and opulent', axes: { complexity: 'high', color_warmth: 'high' } },
  { text: 'nostalgic and warm', axes: { color_warmth: 'high', energy: 'low' } },
  { text: 'surreal and otherworldly', axes: { energy: 'high' } },
  { text: 'tender and gentle', axes: { energy: 'low', brightness: 'high' } },
];

// ── ATMOSPHERE: Lighting Pool ───────────────────────────────────────────────

const LIGHTING_POOL: TaggedOption[] = [
  { text: 'warm candlelight', axes: { color_warmth: 'high', brightness: 'low' } },
  { text: 'golden hour sunlight', axes: { color_warmth: 'high', brightness: 'high' } },
  { text: 'soft overcast diffused light', axes: { brightness: 'high', energy: 'low' } },
  { text: 'neon city glow', axes: { color_warmth: 'low', brightness: 'low' } },
  { text: 'cool blue moonlight', axes: { color_warmth: 'low', brightness: 'low' } },
  { text: 'dramatic backlight silhouette', axes: { energy: 'high', brightness: 'low' } },
  { text: 'dappled light through leaves', axes: { color_warmth: 'high', brightness: 'high' } },
  { text: 'firelight with dancing shadows', axes: { color_warmth: 'high', brightness: 'low' } },
  { text: 'bioluminescent ambient glow', axes: { color_warmth: 'low', brightness: 'low' } },
  { text: 'aurora borealis light', axes: { color_warmth: 'low', energy: 'high' } },
  { text: 'foggy diffused streetlight', axes: { brightness: 'low', energy: 'low' } },
  { text: 'studio Rembrandt lighting', axes: { energy: 'high', brightness: 'low' } },
];

// ── WORLD: Era keywords ─────────────────────────────────────────────────────

const ERA_KEYWORDS: Record<string, string> = {
  ancient: 'ancient civilization, stone and bronze, weathered ruins',
  medieval: 'medieval fantasy, stone castles, candlelit, hand-forged',
  victorian: 'Victorian era, ornate brass and dark wood, gas lamps, lace',
  retro: 'retro 1950s-70s, mid-century modern, vintage colors, analog',
  modern: 'contemporary modern, clean lines, current day',
  far_future: 'far future sci-fi, holographic, chrome and glass, alien tech',
};

// ── WORLD: Setting keywords ─────────────────────────────────────────────────

const SETTING_KEYWORDS: Record<string, string> = {
  cozy_indoors: 'cozy interior, warm room, furniture, shelves, windows',
  wild_outdoors: 'outdoor wilderness, forests, mountains, open sky, natural landscape',
  city_streets: 'urban cityscape, streets, buildings, signs, architecture',
  otherworldly: 'otherworldly realm, floating islands, impossible geometry, alien landscape',
};

// ── ATMOSPHERE: Scene atmosphere keywords ────────────────────────────────────

const SCENE_ATMOSPHERE_KEYWORDS: Record<string, string> = {
  sunny_morning: 'bright morning sunlight, dew, fresh, long shadows',
  rainy_afternoon: 'rain falling, wet surfaces, reflections in puddles, overcast',
  snowy_night: 'fresh snow, cold blue night, snowflakes, frost on everything',
  foggy_dawn: 'thick fog, pre-dawn grey light, silhouettes emerging from mist',
  stormy_twilight: 'dramatic storm clouds, purple twilight sky, wind, lightning in distance',
  starry_midnight: 'clear night sky full of stars, milky way, deep blue darkness',
  golden_hour: 'golden hour warm light, long shadows, everything glowing amber',
  aurora_night: 'northern lights in sky, green and purple aurora, snow-covered ground',
};

// ── TECHNIQUE: Color palette keywords ───────────────────────────────────────

const PALETTE_KEYWORDS: Record<string, string> = {
  warm_sunset: 'warm golden amber and crimson color palette',
  cool_twilight: 'cool blue purple and lavender color palette',
  earthy_natural: 'earthy green brown and forest tones',
  soft_pastel: 'soft pastel pink lavender and cream tones',
  dark_bold: 'dark dramatic palette with deep blacks and vivid accent colors',
  everything: '',
};

// ── TECHNIQUE: Weirdness modifiers ──────────────────────────────────────────

const WEIRDNESS_MODIFIERS = [
  '', // 0-0.2: normal
  'slightly unusual proportions', // 0.2-0.4
  'dreamlike distortions, things not quite right', // 0.4-0.6
  'surreal impossible geometry, melting forms', // 0.6-0.8
  'full Salvador Dali surrealism, gravity-defying, morphing shapes', // 0.8-1.0
];

// ── TECHNIQUE: Scale modifiers ──────────────────────────────────────────────

const SCALE_MODIFIERS = [
  'extreme macro close-up, tiny details filling the frame', // 0-0.2
  'intimate close-up, shallow depth of field', // 0.2-0.4
  'medium shot, subject fills most of frame', // 0.4-0.6
  'wide shot, subject in environment, context visible', // 0.6-0.8
  'epic vast panoramic vista, tiny subject in enormous landscape', // 0.8-1.0
];

// ── SUBJECT: Actions ────────────────────────────────────────────────────────

const ACTIONS = [
  'tumbling', 'sneaking', 'leaping', 'balancing precariously',
  'wrestling over', 'tiptoeing', 'diving headfirst into',
  'stacking things into a wobbly tower', 'chasing each other',
  'hiding behind', 'dangling upside down from', 'squeezing through a tiny gap',
  'sliding down', 'bouncing off', 'carrying something absurdly oversized',
  'peeking around a corner at', 'caught mid-sneeze near',
  'building a fort out of', 'surfing on top of',
  'having a tug-of-war over', 'catching something falling from above',
  'being startled by a butterfly', 'whispering a secret about',
  'painting a tiny masterpiece of', 'reading a tiny book together',
  'conducting a tiny orchestra', 'trying to open a jar',
  'posing dramatically for no reason', 'napping peacefully on',
  'exploring a hidden passage in',
];

// ── SUBJECT: Scene types ────────────────────────────────────────────────────

const SCENE_TYPES = [
  'unexpected discovery', 'playful chaos', 'cozy comfort',
  'tiny adventure', 'dramatic moment', 'silly mishap',
  'tender moment', 'creative activity', 'celebration',
  'sneaky heist', 'friendly competition', 'rescue mission',
  'quiet contemplation', 'first encounter', 'magical transformation',
];

// ── Engine Utilities ────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWithChaos<T>(preferred: T[], allOptions: T[], chaos: number): T {
  // chaos 0 = always pick from preferred; chaos 1 = 50/50 preferred vs random
  if (preferred.length === 0 || Math.random() < chaos * 0.5) {
    return pick(allOptions);
  }
  return pick(preferred);
}

function rollAxis(value: number): 'high' | 'low' {
  return Math.random() < value ? 'high' : 'low';
}

function getModifierByValue(modifiers: string[], value: number): string {
  const index = Math.min(modifiers.length - 1, Math.floor(value * modifiers.length));
  return modifiers[index];
}

function filterPool(pool: TaggedOption[], rolledAxes: Record<string, 'high' | 'low'>): string {
  const scored = pool.map((opt) => {
    let score = 0;
    if (opt.axes) {
      for (const [axis, val] of Object.entries(opt.axes)) {
        if (rolledAxes[axis] === val) score += 1;
        else score -= 0.5;
      }
    }
    return { text: opt.text, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 5);
  return pick(top).text;
}

// ── Public Interface ────────────────────────────────────────────────────────

export interface PromptInput {
  // TECHNIQUE layer
  medium: string;
  colorKeywords: string;
  weirdnessModifier: string;
  scaleModifier: string;
  // SUBJECT layer
  interests: string[];
  action: string;
  sceneType: string;
  spiritCompanion: string | null;
  spiritAppears: boolean;
  // WORLD layer
  eraKeywords: string;
  settingKeywords: string;
  // ATMOSPHERE layer
  mood: string;
  lighting: string;
  personalityTags: string[];
  sceneAtmosphere: string;
}

export function buildPromptInput(recipe: Recipe): PromptInput {
  const chaos = recipe.axes.chaos;

  // Roll dice on each axis
  const rolled = {
    realism: rollAxis(recipe.axes.realism),
    complexity: rollAxis(recipe.axes.complexity),
    energy: rollAxis(recipe.axes.energy),
    color_warmth: rollAxis(recipe.axes.color_warmth),
    brightness: rollAxis(recipe.axes.brightness),
  };

  // TECHNIQUE layer
  const medium = filterPool(MEDIUM_POOL, rolled);
  const palette = recipe.color_palettes.length > 0 ? pick(recipe.color_palettes) : 'everything';
  const colorKeywords = PALETTE_KEYWORDS[palette] || '';
  const weirdnessModifier = getModifierByValue(WEIRDNESS_MODIFIERS, recipe.axes.weirdness);
  const scaleModifier = getModifierByValue(SCALE_MODIFIERS, recipe.axes.scale);

  // SUBJECT layer
  const sampleCount = Math.min(2, recipe.interests.length);
  const shuffled = [...recipe.interests].sort(() => Math.random() - 0.5);
  const interests = shuffled.slice(0, Math.max(1, sampleCount));
  const action = pick(ACTIONS);
  const sceneType = pick(SCENE_TYPES);
  const spiritCompanion = recipe.spirit_companion;
  const spiritAppears = spiritCompanion !== null && Math.random() < 0.3; // 30% chance

  // WORLD layer
  const allEras = Object.keys(ERA_KEYWORDS);
  const eraKey = recipe.eras.length > 0
    ? pickWithChaos(recipe.eras, allEras, chaos)
    : pick(allEras);
  const eraKeywords = ERA_KEYWORDS[eraKey] || '';

  const allSettings = Object.keys(SETTING_KEYWORDS);
  const settingKey = recipe.settings.length > 0
    ? pickWithChaos(recipe.settings, allSettings, chaos)
    : pick(allSettings);
  const settingKeywords = SETTING_KEYWORDS[settingKey] || '';

  // ATMOSPHERE layer
  const mood = filterPool(MOOD_POOL, rolled);
  const lighting = filterPool(LIGHTING_POOL, rolled);

  const tagCount = Math.min(3, recipe.personality_tags.length);
  const shuffledTags = [...recipe.personality_tags].sort(() => Math.random() - 0.5);
  const personalityTags = shuffledTags.slice(0, Math.max(1, tagCount));

  const allAtmospheres = Object.keys(SCENE_ATMOSPHERE_KEYWORDS);
  const atmosphereKey = recipe.scene_atmospheres.length > 0
    ? pickWithChaos(recipe.scene_atmospheres, allAtmospheres, chaos)
    : pick(allAtmospheres);
  const sceneAtmosphere = SCENE_ATMOSPHERE_KEYWORDS[atmosphereKey] || '';

  return {
    medium, colorKeywords, weirdnessModifier, scaleModifier,
    interests, action, sceneType, spiritCompanion, spiritAppears,
    eraKeywords, settingKeywords,
    mood, lighting, personalityTags, sceneAtmosphere,
  };
}

/**
 * Build a raw prompt string from all layers (used when Haiku is unavailable).
 */
export function buildRawPrompt(input: PromptInput): string {
  const parts: string[] = [];

  // TECHNIQUE first — medium MUST lead
  parts.push(`${input.medium}:`);

  // SUBJECT
  parts.push(`${input.interests.join(' and ')} scene`);
  parts.push(input.action);

  // WORLD
  if (input.eraKeywords) parts.push(input.eraKeywords);
  if (input.settingKeywords) parts.push(input.settingKeywords);

  // ATMOSPHERE
  parts.push(input.mood);
  parts.push(input.lighting);
  if (input.sceneAtmosphere) parts.push(input.sceneAtmosphere);
  if (input.personalityTags.length > 0) parts.push(input.personalityTags.join(', '));

  // TECHNIQUE modifiers
  if (input.colorKeywords) parts.push(input.colorKeywords);
  if (input.weirdnessModifier) parts.push(input.weirdnessModifier);
  parts.push(input.scaleModifier);

  // SIGNATURE — spirit companion cameo
  if (input.spiritAppears && input.spiritCompanion) {
    const companion = input.spiritCompanion.replace(/_/g, ' ');
    parts.push(`a small ${companion} visible somewhere in the scene`);
  }

  parts.push('portrait orientation 9:16 ratio');

  return parts.join(', ');
}

/**
 * Build the system prompt for Haiku to enhance into a Flux prompt.
 */
export function buildHaikuPrompt(input: PromptInput): string {
  return `Write a Flux image generation prompt. Be BRIEF and DIRECT — Flux ignores flowery language.

TECHNIQUE: ${input.medium}
${input.colorKeywords ? `Colors: ${input.colorKeywords}` : ''}
${input.weirdnessModifier ? `Surrealism: ${input.weirdnessModifier}` : ''}
Framing: ${input.scaleModifier}

SUBJECT: ${input.interests.join(' and ')} themed scene
Action: the subject is ${input.action}
Scene type: ${input.sceneType}
${input.spiritAppears && input.spiritCompanion ? `Include a small ${input.spiritCompanion.replace(/_/g, ' ')} somewhere in the background as a recurring motif.` : ''}

WORLD: ${input.eraKeywords}. ${input.settingKeywords}

ATMOSPHERE: ${input.mood}. ${input.lighting}. ${input.sceneAtmosphere}
Personality: ${input.personalityTags.join(', ')}

RULES:
- Start with the medium name. The medium MUST dominate the visual style.
- ONE sentence for the scene with a specific subject and action.
- ONE sentence for environment, lighting, and technical details.
- Max 80 words total. Portrait 9:16 orientation.
- NO poetic language. Direct visual instructions only.

Output ONLY the prompt.`;
}

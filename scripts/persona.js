#!/usr/bin/env node
'use strict';

/**
 * persona.js — Swap Kevin's recipe to a test persona for dream engine testing.
 *
 * Usage:
 *   node scripts/persona.js 1          # Gamer Nerd
 *   node scripts/persona.js 2          # Cottagecore Girl
 *   node scripts/persona.js 3          # Edgy Artist
 *   node scripts/persona.js 4          # Adventure Bro
 *   node scripts/persona.js 5          # Fantasy Romantic
 *   node scripts/persona.js kevin      # Restore Kevin's real recipe
 *   node scripts/persona.js list       # Show all personas
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

// Kevin's real recipe — saved so we can restore it
const KEVIN_RECIPE = {
  axes: { chaos: 0.5, scale: 0.5, energy: 0.6, realism: 0.5, weirdness: 0.3, brightness: 0.25, complexity: 0.5, color_warmth: 0.3 },
  eras: ['prehistoric', 'victorian', 'steampunk', 'retro', 'far_future'],
  settings: ['city_streets', 'village'],
  interests: ['food', 'ocean', 'music'],
  color_palettes: ['everything'],
  personality_tags: ['playful', 'futuristic', 'bold'],
  spirit_companion: 'rabbit',
  scene_atmospheres: ['foggy_dawn', 'sunny_morning'],
  selected_moods: ['cozy', 'dreamy', 'playful', 'nostalgic', 'whimsical'],
};

const PERSONAS = {
  1: {
    name: 'Gamer Nerd',
    recipe: {
      axes: { chaos: 0.6, scale: 0.7, energy: 0.8, realism: 0.4, weirdness: 0.5, brightness: 0.4, complexity: 0.7, color_warmth: 0.4 },
      eras: ['synthwave', 'far_future'],
      settings: ['city_streets', 'space'],
      interests: ['gaming', 'geek', 'sci_fi'],
      color_palettes: ['neon', 'dark_bold'],
      personality_tags: ['bold', 'futuristic', 'fierce'],
      spirit_companion: 'robot',
      scene_atmospheres: ['starry_midnight', 'stormy_twilight'],
      selected_moods: ['epic', 'intense', 'dramatic'],
    },
  },
  2: {
    name: 'Cottagecore Girl',
    recipe: {
      axes: { chaos: 0.3, scale: 0.3, energy: 0.2, realism: 0.6, weirdness: 0.1, brightness: 0.7, complexity: 0.3, color_warmth: 0.8 },
      eras: ['victorian', 'retro'],
      settings: ['cozy_indoors', 'village'],
      interests: ['nature', 'animals', 'food'],
      color_palettes: ['soft_pastel', 'earthy_natural'],
      personality_tags: ['gentle', 'cozy', 'whimsical'],
      spirit_companion: 'deer',
      scene_atmospheres: ['sunny_morning', 'golden_hour'],
      selected_moods: ['cozy', 'peaceful', 'dreamy'],
    },
  },
  3: {
    name: 'Edgy Artist',
    recipe: {
      axes: { chaos: 0.7, scale: 0.5, energy: 0.6, realism: 0.3, weirdness: 0.7, brightness: 0.2, complexity: 0.8, color_warmth: 0.2 },
      eras: ['modern', 'art_deco'],
      settings: ['city_streets', 'underground'],
      interests: ['abstract', 'dark', 'music'],
      color_palettes: ['monochrome', 'dark_bold'],
      personality_tags: ['edgy', 'raw', 'chaotic'],
      spirit_companion: 'ghost',
      scene_atmospheres: ['stormy_twilight', 'starry_midnight'],
      selected_moods: ['mysterious', 'intense', 'moody'],
    },
  },
  4: {
    name: 'Adventure Bro',
    recipe: {
      axes: { chaos: 0.6, scale: 0.8, energy: 0.9, realism: 0.7, weirdness: 0.2, brightness: 0.6, complexity: 0.5, color_warmth: 0.6 },
      eras: ['modern', 'prehistoric'],
      settings: ['wild_outdoors', 'mountains', 'beach_tropical'],
      interests: ['sports', 'travel', 'ocean'],
      color_palettes: ['warm_sunset', 'earthy_natural'],
      personality_tags: ['adventurous', 'bold', 'wild'],
      spirit_companion: 'wolf',
      scene_atmospheres: ['sunny_morning', 'golden_hour'],
      selected_moods: ['epic', 'playful', 'dramatic'],
    },
  },
  5: {
    name: 'Fantasy Romantic',
    recipe: {
      axes: { chaos: 0.4, scale: 0.5, energy: 0.3, realism: 0.2, weirdness: 0.4, brightness: 0.7, complexity: 0.6, color_warmth: 0.7 },
      eras: ['medieval', 'victorian', 'art_deco'],
      settings: ['otherworldly', 'village'],
      interests: ['fantasy', 'cute', 'whimsical'],
      color_palettes: ['soft_pastel', 'candy'],
      personality_tags: ['romantic', 'dreamy', 'elegant'],
      spirit_companion: 'butterfly',
      scene_atmospheres: ['foggy_dawn', 'aurora_night'],
      selected_moods: ['dreamy', 'nostalgic', 'whimsical'],
    },
  },
};

async function main() {
  const arg = process.argv[2];

  if (!arg || arg === 'list') {
    console.log('\nAvailable personas:');
    for (const [id, p] of Object.entries(PERSONAS)) {
      console.log(`  ${id}. ${p.name} — ${p.recipe.interests.join(', ')}`);
    }
    console.log(`  kevin — Restore Kevin's real recipe`);
    console.log(`\nUsage: node scripts/persona.js <number|kevin>\n`);
    return;
  }

  let recipe, name;

  if (arg === 'kevin') {
    recipe = KEVIN_RECIPE;
    name = "Kevin's real recipe";
  } else {
    const persona = PERSONAS[arg];
    if (!persona) {
      console.error(`Unknown persona: ${arg}. Run with "list" to see options.`);
      process.exit(1);
    }
    recipe = persona.recipe;
    name = persona.name;
  }

  const { error } = await supabase
    .from('user_recipes')
    .update({ recipe })
    .eq('user_id', KEVIN_ID);

  if (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }

  console.log(`\n✅ Swapped to: ${name}`);
  console.log(`   Interests: ${recipe.interests.join(', ')}`);
  console.log(`   Moods: ${recipe.selected_moods.join(', ')}`);
  console.log(`   Companion: ${recipe.spirit_companion}`);
  console.log(`\n   Go tap Dream in the app.\n`);
}

main();

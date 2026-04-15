#!/usr/bin/env node
/**
 * Batch generate all 63 location cards + 58 object cards.
 * Runs sequentially to avoid rate limiting.
 *
 * Usage:
 *   node scripts/batch-generate-all-cards.js --locations    # locations only
 *   node scripts/batch-generate-all-cards.js --objects      # objects only
 *   node scripts/batch-generate-all-cards.js                # both
 */

const { execSync } = require('child_process');

const args = process.argv.slice(2);
const doLocations = !args.includes('--objects');
const doObjects = !args.includes('--locations');

const LOCATIONS = [
  // Tropical / Beach
  'hawaii', 'bali', 'maldives', 'caribbean island', 'tahiti', 'costa rica',
  // Mountains / Nature
  'swiss alps', 'patagonia', 'yosemite', 'iceland', 'new zealand', 'norwegian fjords', 'grand canyon',
  'zions national park', 'arches national park',
  // Urban / City
  'tokyo', 'new york city', 'paris', 'london', 'venice', 'dubai', 'hong kong', 'san francisco',
  'los angeles', 'miami', 'salt lake city', 'moab utah',
  // Fantasy / Magical
  'enchanted forest', 'floating sky islands', 'crystal caverns', 'dragons keep', 'fairy tale kingdom', 'ancient elven city',
  // Historical / Ancient
  'ancient egypt', 'roman colosseum', 'machu picchu', 'angkor wat', 'greek isles',
  // Theme Parks / Iconic
  'disneyland', 'hogwarts', 'space station', 'pirate ship', 'sea world', 'aquarium',
  // Dark / Gothic
  'haunted castle', 'victorian london', 'transylvania', 'gothic cathedral',
  // Cozy / Intimate
  'japanese garden', 'tuscan villa', 'cozy mountain cabin', 'parisian cafe',
  // Sci-Fi / Futuristic
  'cyberpunk megacity', 'mars colony', 'underwater city', 'alien planet',
  // Wild / Adventure
  'african safari', 'amazon rainforest',
  // Dreamy / Feminine
  'rose garden palace', 'cherry blossom temple', 'fairy cottage', 'cloud kingdom', 'mermaid lagoon',
];

if (doLocations) {
  console.log(`\n=== GENERATING ${LOCATIONS.length} LOCATION CARDS ===\n`);
  for (let i = 0; i < LOCATIONS.length; i++) {
    const loc = LOCATIONS[i];
    console.log(`\n[${i + 1}/${LOCATIONS.length}] ${loc}`);
    try {
      execSync(`node scripts/generate-full-location-card.js "${loc}"`, {
        stdio: 'inherit',
        timeout: 300000,
      });
    } catch (e) {
      console.error(`❌ Failed: ${loc} — ${e.message}`);
    }
  }
}

if (doObjects) {
  console.log(`\n=== GENERATING OBJECT CARDS ===\n`);
  try {
    execSync('node scripts/generate-full-object-card.js --all', {
      stdio: 'inherit',
      timeout: 1800000, // 30 min for all objects
    });
  } catch (e) {
    console.error(`❌ Object generation failed: ${e.message}`);
  }
}

console.log('\n🎉 All done.');

#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/cozy_coast_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COZY COAST SCENE descriptions for BeachBot's cozy-beach path — coastal villages / huts / lighthouses / cottages. Warm coastal pockets.

Each entry: 15-30 words. One specific cozy coastal scene.

━━━ CATEGORIES ━━━
- Small Mediterranean fishing village at dusk
- Colorful Caribbean coastal town sunset
- Greek whitewashed village with blue domes
- Lighthouse on misty cliff at dawn
- New-England coastal cottage with garden
- Pier café at golden-hour
- Cornish fishing village harbor
- Portuguese Algarve fishing-village
- Italian Cinque-Terre terraced
- Amalfi-coast-style pastel homes
- French Riviera pastel-village
- Croatian Dalmatian-coast stone-village
- Moroccan blue-white coastal town
- Omani fishing-dhow village
- Zanzibar-Stone-Town coastal
- Icelandic lighthouse on lava-coast
- Norwegian-coast fishing village
- Swedish archipelago red-house
- Finnish lighthouse-keeper cottage
- Danish coastal fishing-hut
- Maine lighthouse with attached house
- Cape-Cod grey-shingle cottage
- Martha's-Vineyard coastal house
- Oregon-coast cozy beach-cabin
- Big-Sur highway-cabin
- Santa-Barbara Mediterranean-red
- San-Francisco coastal-painted-ladies
- Baja-California pastel-village
- Tulum tropical-boho-cabana
- Belizean-beach-hut over-water
- Caribbean pastel-beach-shack
- Balinese bungalow on beach
- Thai beach-hut palm-roofed
- Vietnamese beach-stilt-house
- Philippine bamboo-beach-hut
- Maldivian overwater-villa (no people visible)
- Seychellois beach-cottage
- South-African coastal-white cottage
- Australian beach-shack weathered
- Tasmanian lighthouse cottage
- New-Zealand beach-bach
- Cornish-harbor fishing-cottage
- Welsh coastal-pub harbor
- Scottish-isle beach-croft
- Brittany-coast fishing-house

━━━ RULES ━━━
- Warm coastal architecture
- Cozy / inhabited-feel (no humans visible)
- Real coastal styles
- Warm + inviting

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

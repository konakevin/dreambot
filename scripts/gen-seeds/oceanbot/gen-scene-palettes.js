#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for OceanBot — ocean color moods.

Each entry: 10-20 words. One specific ocean palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Turquoise-tropical (turquoise + cream-sand + coral-pink + palm-green)
- Deep-navy (deep-navy + silver-flash + white-foam + shadow-black)
- Bioluminescent-blue (electric-blue + black + silver-highlight)
- Arctic-white (white + ice-blue + silver + pale-grey)
- Moonlit-silver (silver + navy + pearl + shadow)
- Twilight-purple (violet + rose + silver + deep-blue)
- After-sunset-coral (coral + rose-gold + deep-blue + purple)
- Kelp-forest-green (emerald + gold + brown + shadow)
- Blood-sunset-sea (crimson + gold + deep-blue + black)
- Dawn-coastal (peach + cream + pale-blue + sand)
- Jellyfish-pastel (pale-pink + opalescent + ice-blue + pearl)
- Shipwreck-rust (rust + blue-green + sepia + shadow)
- Cenote-freshwater (turquoise + limestone-tan + shadow-emerald)
- Deep-sea-abyss (black + single-red-glow + deep-navy)
- Coral-garden explosive (multi-color + sunlit-blue)
- Shark-shallow (grey + silver + blue + white-foam)
- Aurora-sea (green-purple + silver + deep-blue)
- Starfield-reflected (silver + deep-navy + pearl + black)
- Lightning-storm-sea (charcoal + white-flash + blue)
- Mist-ocean-dawn (pale-peach + cream + faint-blue + mist)
- Bubble-trail-silver (silver + turquoise + pearl + black)
- Sunset-mirror-water (rose-gold + cream + deep-blue-reflection)
- Volcanic-vent-red (crimson + black + deep-blue)
- Ice-cave-blue (pale-blue + white + deep-shadow-blue)
- Night-reef-glow (black + multi-bioluminescent + deep-blue)
- Sand-lagoon (cream-sand + turquoise + coral + palm-green)
- Seaweed-rich (olive-green + brown + gold + blue)
- Reef-spectrum (every color + sunlit-blue + gold-caustic)
- Stormy-grey (pewter + charcoal + single-white-whitecap)
- Polar-morning (white + pale-blue + pink-horizon + silver)

━━━ RULES ━━━
- Ocean-specific palettes
- 3-5 colors per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

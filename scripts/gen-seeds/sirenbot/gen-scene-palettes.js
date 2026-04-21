#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE PALETTE descriptions for SirenBot — overall color mood / grading for high-fantasy warrior renders. Critical anti-cluster axis.

Each entry: 14-28 words. Names dominant colors + shadows + highlights + atmosphere descriptor.

━━━ CATEGORIES TO MIX (fantasy-art-leaning) ━━━
- Golden hour (amber / copper / burnt-orange / peach / honey — warm)
- Moonlit (silver / pale cerulean / frost-white / cold)
- Blood moon (crimson / oxblood / midnight black)
- Forest canopy (emerald / gold-dappled / umber)
- Arcane (amethyst / violet / magenta-spark)
- Desert / sunscorched (ochre / sand / turquoise-sky)
- Stormy (gunmetal / lightning-white / violet-clouds)
- Tundra / frost (pale blue / silver / ice-white)
- Infernal (ember-red / orange / black-smoke)
- Fey dreamscape (rose-gold / mint / lavender / iridescent)
- Underwater bio (bioluminescent blue-teal / white-glow)
- Autumn (russet / gold / fallen-leaf-brown)
- Deathrealm (bone-white / ashen-gray / single-crimson)
- Celestial / aurora (aurora-greens / pinks / violets / starfield)
- Volcanic (black-obsidian / molten-orange)
- Misty grayscale (near-monochrome with color accent)
- Divine (sun-bleached marble / gold-leaf)
- Swamp / bog (toxic-green / sickly-yellow)
- Tavern / intimate (candle-amber / leather-brown)
- Parchment (sepia / ink-black / storybook)
- Twilight (indigo / dusty-rose / lavender)
- Royal (purple / gold / crimson / regal)
- Druidic (earth / moss / stone / root-brown)
- Necropolis (bone / ash / black-candle)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

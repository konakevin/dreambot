#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for TitanBot — mythic color moods. Golden-god, blood-crimson, deep-violet-underworld, dawn-peach-heaven, jade-and-turquoise, sepia-ancient.

Each entry: 10-20 words. One specific mythic palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Golden-god (gold + cream + warm-amber + deep-sky)
- Blood-crimson (crimson + oxblood + bronze + oil-black)
- Deep-violet underworld (violet + silver + plum + shadow-black)
- Dawn-peach heaven (peach + rose-gold + cream + pale-blue)
- Jade-and-turquoise (jade + turquoise + gold + cream)
- Sepia-ancient (burnt-umber + tan + faded-gold + cream)
- Olympus-marble (white + blue-sky + gold + cream)
- Norse-ice (silver + ice-blue + white + amber)
- Egyptian-royal (gold + lapis-blue + kohl-black + ochre)
- Hindu-divine (saffron + peacock + gold + crimson)
- Japanese-imperial (vermilion + white + gold + indigo)
- Chinese-jade-palace (jade + gold + red + cream)
- Aztec-temple (obsidian + turquoise + jade + gold)
- Celtic-forest (emerald + gold + bronze + deep-shadow)
- Underworld-stygian (violet + grey + black + green-ghost)
- African-orisha (ochre + indigo + white + red)
- Slavic-birch (silver-birch + amber + cream + red-kokoshnik)
- Polynesian-sunset (coral + turquoise + gold + cream)
- Mesopotamian-cuneiform (clay-tan + bronze + indigo + cream)
- Native-American-turquoise (turquoise + rust + cream + black)
- Inuit-aurora (green-purple + silver-ice + white + midnight)
- Mayan-royal-jade (jade-green + gold + red + blood)
- Slavic-rushnik (embroidered-red + cream + black + bronze)
- Ragnarok (fire-orange + ice-blue + black + blood)
- Armageddon-cosmic (indigo + gold + flame-red + ash-grey)
- Titan-fall (sunset-gold + storm-grey + blood + bronze)
- Cosmic-dance (multi-color divine palette)
- Hero-journey (amber + shadow + golden-highlight)
- Underworld-descent (violet-to-black gradient palette)
- Elysian-meadow (asphodel-white + gold + pale-blue)
- Creation-dawn (rose-gold + cream + pale-blue + gold-dust)
- Death-goddess (crimson + black + gold-hint + bone-white)

━━━ RULES ━━━
- Mythic palettes
- 3-5 specific colors per entry
- Pantheon-appropriate where named

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

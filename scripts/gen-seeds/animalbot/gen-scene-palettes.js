#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for AnimalBot — overall color moods for wildlife scenes. Palettes should flatter-and-support the animal.

Each entry: 10-20 words. One specific color palette family.

━━━ CATEGORIES ━━━
- Golden-hour wildlife (amber + copper + honey + deep forest shadow)
- Arctic palette (pale blue + silver + white + black-eye-accent)
- Savanna dusk (burnt orange + amber + acacia-black + distant-violet)
- Rainforest emerald (deep green + moss + gold-filtered + shadow-pine)
- Blue-hour predator (cobalt + teal + silver + warm amber rim)
- Storm-chase (charcoal + pewter + distant-amber + dramatic blue)
- Autumn forest (rust + pumpkin + burnt-sienna + pine-shadow)
- Winter-snow-soft (pale blue + white + grey + warm amber rim)
- Desert sunset (terracotta + rose-dust + amber + deep-shadow-plum)
- Heather moor (purple-heather + gold-gorse + green-moss + slate-sky)
- Tropical humid (emerald + canopy-gold + deep-shadow-green + moisture-haze)
- Volcanic twilight (obsidian + lava-orange + ash-grey + warm-horizon)
- Jungle-mist (moss-emerald + pearl-white + shadow-black + gold-filtered)
- Prairie-golden (wheat-gold + sky-cerulean + cloud-white + deep-shadow)
- Alpine-crisp (glacier-blue + slate + snow-white + grass-amber)
- Boreal-northern (spruce-green + snow-white + pale-amber + twilight-indigo)
- Fox-and-fire (red-rust + gold + amber + deep-forest)
- Snow-leopard-silver (pale-grey + silver + ice-blue + warm-rock-amber)

━━━ RULES ━━━
- 3-5 color words per entry
- Palettes that flatter wildlife photography
- Earth-plausible color schemes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

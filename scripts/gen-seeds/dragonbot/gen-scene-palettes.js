#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/scene_palettes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for DragonBot — epic-fantasy color moods.

Each entry: 10-20 words. One specific palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Rich-earth (deep-brown + amber + moss-green + copper-accent)
- Moody-storm (charcoal + pewter + slate-blue + single-amber-break)
- Golden-dusk (amber + copper + warm-blue-shadow + rose-horizon)
- Twilight-mystic (deep-violet + silver + emerald-glow + plum-shadow)
- Fire-and-ash (ember-orange + obsidian-black + ash-grey + blood-red)
- Ice-and-sapphire (pale-blue + silver + deep-cobalt + crystal-white)
- Forest-green (emerald + moss + deep-teal + warm-amber-sunlight)
- Castle-stone (weathered-grey + amber-torchlight + deep-shadow-brown)
- Ancient-gold (sandy-honey + deep-bronze + rust + dusty-ochre)
- Arcane-violet (magenta-violet + deep-indigo + gold + silver-rune)
- LOTR-film (teal-blue + warm-amber + cool-grey-stone + cream)
- Game-of-Thrones (ice-blue + blood-red + grey-stone + gold-house)
- Harry-Potter (deep-plum + gold + emerald + candle-warm)
- Elden-Ring (golden-erdtree-amber + moody-twilight + deep-umber)
- Witcher-dark (charcoal + blood-red + moonlit-silver + pale-green)
- Warhammer-grim (dark-red + bronze + steel-grey + coal-black)
- Dragon-hoard (gold + jewel-red + jewel-green + gem-blue + copper)
- Elven-silver (silver + pale-green + cream + moonstone-white)
- Dwarven-forge (deep-red + black-iron + amber-molten + copper)
- Fae-enchanted (pastel-violet + silver-leaf + soft-rose + gold-sparkle)
- Volcanic (obsidian-black + lava-red + ash-grey + smoke-white)
- Snowy-kingdom (white + pale-blue + cream-stone + amber-window)
- Autumn-fantasy (rust-orange + burnt-gold + deep-forest-green)
- Spring-enchanted (pastel-green + gold-sparkle + rose-blossom + cream)
- Desert-fantasy (sun-gold + terracotta + deep-shadow-plum + cream)
- Underwater-kingdom (deep-teal + pearl-white + amber-glow + silver)
- Necropolis (bone-white + black + purple-shadow + faint-green-glow)
- Goblin-market (warm-orange + brass + deep-shadow + torch-red)
- Skyworld (cloud-white + pale-blue + silver + gold-accent)

━━━ RULES ━━━
- Epic-fantasy color moods
- 3-5 specific color words per entry
- Reference classic fantasy worlds where relevant

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

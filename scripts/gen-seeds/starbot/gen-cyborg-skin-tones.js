#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_skin_tones.json',
  total: 50,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SKIN TONE descriptions for StarBot's cyborg-woman path. Each describes the organic skin visible on the human parts of a half-machine cyborg woman — her face, neck, décolletage, and any exposed organic patches.

Each entry: 10-18 words. A specific skin color with undertone, finish, and texture.

━━━ DISTRIBUTION (follow exactly) ━━━
- 60% ALIEN / SCI-FI skin colors (the majority — this is a space universe)
- 25% HUMAN skin tones (spread across all real-world ethnicities — pale, olive, tan, brown, dark, freckled, weathered)
- 15% HYBRID / IMPOSSIBLE (chrome-flecked, translucent, bioluminescent, color-shifting)

━━━ ALIEN SKIN CATEGORIES (spread widely) ━━━
- Greens: moss, jade, emerald, seafoam, olive-green, forest
- Blues: robin-egg, cobalt, pale sky, deep navy, ice-blue, cerulean
- Purples: lavender, deep plum, violet, wine-purple, amethyst, lilac
- Reds/Oranges: terracotta-red, copper-rust, burnt sienna alien, crimson
- Grays: ash-gray, slate, silver-gray, charcoal, storm-cloud
- Blacks: jet-black velvet, obsidian, void-dark with bioluminescent spots
- Golds/Metallics: pale gold shimmer, bronze-tinted, copper-rose
- Pinks: fuchsia, coral-pink, rose-petal, bubblegum
- Whites: porcelain-white alien, pearl, bone-white, frost-white
- Iridescent: shifting hues, opalescent, prismatic

━━━ WHAT MAKES A GOOD ENTRY ━━━
- Specific enough to render visually distinct from every other entry
- Includes undertone (warm/cool/neutral)
- Includes finish where relevant (matte, glossy, velvety, frosted, shimmer)
- For alien skins, add one visual detail (speckling, micro-scales, veining, frost bloom, bioluminescent freckles)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: base hue + undertone + finish. "Moss-green matte" and "jade-green glossy" are distinct. "Moss-green matte" and "forest-green matte" are too similar.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

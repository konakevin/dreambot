#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_village_scenes.json',
  total: 780,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MULTI-CHARACTER JUNGLE-VILLAGE scenes for ChibiBot's jungle-village path. The pool already has 390 single-creature scenes — your job is to add PAIR + TRIO scenes for character variance.

Pixar / Sanrio / Studio Ghibli / Encanto STYLIZED. NEVER photoreal. Mix baby + adult creatures freely. Cozy rainforest / canopy / mangrove / cloud-forest VILLAGES.

Each entry: 18-28 words.

━━━ COUNT MIX ━━━
~60% PAIR / ~40% TRIO. Force "TWO DISTINCT chibi figures equally prominent" / "TRIO of chibi" / "all three visible" composition language. DIFFERENT species per character.

━━━ VILLAGE TYPES (mix broadly) ━━━
Treehouse village in giant ceiba / Mushroom-house clearing / Vine-bridge village / Jungle-floor market square / Canopy-platform tea-house cluster / Hanging-bottle-house cluster / Mossy log-village / Cloud-forest mist village / Mangrove-root village / Banana-tree market / Hot-spring spa-village / Jungle-stream waterwheel village / Orchid-greenhouse village / Lantern-flower night village / Bamboo-grove hamlet / Riverside hammock-village

━━━ MULTI-SPECIES COMBOS ━━━
Pairs: sloth + macaw / capybara + tiny bird / orangutan + lemur / toucan + frog / gibbon + butterfly / coati + parrot / leaf-frog + dragonfly / mouse-deer + capybara / spider monkey + sloth / kinkajou + bushbaby
Trios: three chibi monkeys / sloth + capybara + macaw / mixed-species canopy gathering / parent jaguar + two cubs

━━━ COZY OVERLAY ━━━
- Architecture: bark-and-thatch huts, mossy roofs, flowering-vine drapes, hanging-fruit-bowl windows, woven-vine railings, glow-mushroom streetlamps
- Warm leaf-green + sun-gold + coral-flower-pink + banana-yellow + sky-mint + window-amber palette
- Sun-dapples through giant leaves, mist drifting, dewdrops, butterflies fluttering
- Village feels LIVED IN — woven-baskets at doors, drying herbs, banana-leaf laundry, fruit-stall crates
- Multi-character RELATIONAL — sharing fruit on a vine-bridge / cuddling in treehouse / gathered around a pool / playing in a stream

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary jungle / NO predator-prey
- NO modern infrastructure
- NO identifiable humans
- NO single-creature entries (multi only)

━━━ DEDUP DIMENSIONS ━━━
UNIQUE village-type + species-combination + activity per entry.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures equally prominent: sloth and capybara on a moss-platform of treehouse village, both blinking sleepy, vine-bridges and lantern-flowers behind"
- "TRIO of chibi spider-monkeys hanging from one vine in a mushroom-house clearing, three round bodies dangling, sun-dapples through giant leaves, three toothy grins"
- "TWO DISTINCT chibi figures: toucan and frog sharing a banana on a hanging-bottle-house porch, both equally prominent, lantern-flowers strung around"
- "TRIO of chibi capybaras soaking in turquoise hot-spring spa-village, three round bodies in a row, bamboo-pipe water flowing, fern-soft towels stacked"
- "TWO DISTINCT chibi figures equally prominent: kinkajou and bushbaby sharing a vine-platform in lantern-flower night village, soft pink+amber glow"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

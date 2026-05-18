#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/castle_biome.json',
  total: 200,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} LUSH GORGEOUS WESTERN-HIGH-FANTASY BIOME entries for DragonBot's castle path. Each entry is a DENSE phrase (30-55 words) describing a RICH, COLORFUL, LIFE-FILLED Western-fantasy landscape — every entry must read as LUSH, NEVER plain or bare, and WESTERN-FANTASY ONLY (LOTR / GoT / Skyrim / Warcraft / Witcher / D&D / Elden-Ring lineage).

⚠️ THE BAR: each biome must feel like a Tolkien-illustrated-edition / Witcher-3-establishing-shot / Skyrim-Whiterun-meadow / LOTR-Shire-Pelennor-Lothlorien fairytale-paradise landscape. Verdant, flower-strewn, blossom-shaded, mirror-laked, sun-dappled. Movie-poster lush concept-art.

⚠️ HARD MANDATE — TACTILE FOREGROUND DETAIL: every entry MUST name 2-3 specific RICH FOREGROUND elements (wildflower-meadow / blossom-grove / fruit-orchard / mirror-lake / ancient oaks / waterfall / lavender-field / rose-garden / hanging-gardens / cascading-vines / wildflower-prairie / mossy-stones / shimmering creek). NEVER bare empty foreground.

🚫 STRICT WESTERN HIGH FANTASY — these are BANNED:
• NO Mediterranean coastline with terraced olive-groves / citron orchards / oleander
• NO date-palms / palm-oases / desert-oasis-with-citron-orchards
• NO bamboo groves / cherry-blossom forests / jacaranda forests / magnolia (Asian-coded)
• NO bougainvillea / lotus blossoms / lily-pond (Mediterranean / Asian)
• NO terraced rice-paddies / tea-fields / Asian gardens
• NO desert flats / arid mesa / red-canyon-with-cacti
• NO real-world ethnic-period codes

✓ USE western-fantasy-canon biomes:
- Verdant Shire-style green hills with wildflowers, daisies, poppies, bluebells
- Ancient oak / birch / cedar / pine / yew forests (no Asian-coded trees)
- LOTR-Lothlorien silver-birch groves with golden leaves
- Witcher-3 alpine meadows with mountain wildflowers
- Skyrim tundra-meadows with white birches + frost-flowers + auroras
- Highland moors with heather and mist
- GoT Northern pine-forests and snowy meadows
- Mountain valleys with cascading waterfalls + glacial lakes
- Coastal sea-cliffs with crashing surf + gnarled cypresses + wildflowers
- Misty marshes / fenlands with willows and reeds
- Magical Lothlorien / Elden-Ring elven groves

━━━ LUSH WESTERN-FANTASY BIOME CATEGORIES (distribute ${n} across):

VERDANT MOUNTAIN VALLEYS (~5):
- vast emerald-green mountain valley carpeted in wildflower-meadows of poppies and bluebells, ancient gnarled oaks dotting the slopes, silver creek winding through, snow-capped peaks rising beyond, Witcher-3-Kaer-Morhen-energy
- verdant alpine valley with cascading wildflower-meadows, hanging-vines draping from rocky outcrops, distant waterfall plunging from a high cliff, painted-gold afternoon light, LOTR-Pelennor-energy
- lush hidden mountain glade with moss-draped ancient cedars, carpets of forget-me-nots and ferns, mirror-lake reflecting surrounding peaks, golden-hour sun beams piercing the canopy
- emerald-green high-meadow with carpets of wild lavender and white daisies, cascading silver streams, ancient stone arches half-claimed by ivy, distant snow-peaks in painted gold
- Witcher-3-Velen-style misty fen valley with reed-marshes, ancient willows, golden-hour mist drifting, distant pine-forested hills

SHIRE-STYLE GREEN HILLS / PASTORAL (~3):
- rolling Shire-style green hills with wildflower-fields stretching to a distant range of low blue mountains, dawn mist drifting through golden poppies and white daisies
- vast pastoral valley with apple orchards in full bloom, white-and-pink blossom-trees on rolling hills, silver stream winding through wildflower-meadows
- bucolic farmland valley with golden wheat-fields rolling toward distant snow-peaks, scattered ancient oaks, dawn-gold horizon

NORTHERN PINE-FOREST / SNOW-MEADOW (~3):
- vast Northern pine-forest with snow-dusted ancient evergreens, frost-flowers carpeting the forest floor, aurora-light filtering through the canopy, GoT-North-energy
- snow-covered alpine meadow with white birches and silver-frost-flowers, mirror-lake at the foot of distant mountains, painted-gold dawn light
- Skyrim-style tundra-meadow with white-and-purple frost-flowers, ancient runic-standing-stones, aurora rippling overhead, distant white-birch grove

COASTAL CLIFFS WITH CRASHING SURF (~3):
- dramatic verdant sea-cliffs plunging into crashing emerald surf, wildflower-meadows carpeting the cliff-tops, gnarled cypress trees silhouetted against painted-gold sunset
- emerald-green coastal headland with rolling wildflower-meadows, ancient gnarled junipers, white seabirds wheeling, crashing waves at the foot of the cliffs
- weathered grey sea-stack cliffs with heather and gorse blooming on top, mist drifting, distant fishing-village coves in the bay below

ANCIENT WESTERN-ELVISH GROVES (~3):
- vast Lothlorien-style silver-birch grove with golden mallorn-leaves drifting on the breeze, ancient gnarled trunks, sun-shafts piercing the canopy, mirror-stream
- enchanted Rivendell-style waterfall-valley with ancient oaks and silver-birches, glowing crystal lanterns hanging in the trees, mist drifting between the leaves
- ancient elven moss-grove with luminous fungi at the base of every trunk, mist-streamers drifting between the trees, golden-hour light filtering through

WILDFLOWER PRAIRIES & MEADOWS (~3):
- endless wildflower-prairie stretching to the horizon, carpets of poppies and bluebonnets and cornflowers, gnarled lone oaks dotted across rolling hills, painted-gold sky
- vast rolling wildflower-meadow in full summer bloom, lavender-and-poppy fields stretching kilometers, weathered standing-stones scattered, painted-gold sunset, Skyrim-energy
- emerald-green high-prairie carpeted in wild daisies and red poppies, ancient barrows and stone-circles, distant herds of grazing white deer

MAGICAL / OTHERWORLDLY WESTERN FANTASY (~2):
- bioluminescent moss-and-fern primeval valley glowing soft blue-and-green at twilight, glowing fungi the size of trees, drifting magical light-particles, ancient stone arches overgrown with luminous vines
- floating Lothlorien-style elven valley with mallorn-trees suspended on glowing mist-clouds, wildflower-meadows carpeting each, cascading waterfalls plunging into the void

LUSH HIGH-FANTASY VALLEY CASCADES (~3):
- vast lush mountain-cascade valley with terraced waterfalls plunging through wildflower-meadows, ancient pines lining the falls, mirror-pools at each tier, painted-gold mist
- still mirror-lake at the foot of an emerald valley, water-lilies and reeds in the shallows, willow-trees draping over the shore, golden-hour
- vast lake reflecting the painted-gold sunset, ancient oaks on islands, water-lilies in the shallows, mist drifting across the still water

EACH entry MUST be:
- 30-55 words
- WESTERN HIGH-FANTASY ONLY (NO Asian, NO Mediterranean, NO Middle-Eastern, NO desert-oasis)
- PURE biome / setting (NO castle mention)
- LUSH and COLORFUL (2-3 specific vegetation / water / flower elements named)
- RICH foreground (tactile detail readable up close)
- Atmospheric (golden hour / dawn / dusk / sun-dappled — never flat noon)
- LOTR / GoT / Skyrim / Witcher / Warcraft / Elden-Ring biome lineage

Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
});

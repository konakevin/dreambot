#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/twilight_village_scenes.json',
  total: 400,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MULTI-CHARACTER TWILIGHT-VILLAGE scenes for ChibiBot's twilight-village path. The pool already has 200 single-creature scenes — your job is to add PAIR + TRIO village scenes for character variance.

Pixar / Sanrio / Studio Ghibli STYLIZED. NEVER photoreal. Mix baby + adult creatures freely. Cozy night / twilight / lantern-lit / firefly-meadow / moonlit VILLAGES.

Each entry: 18-28 words. Twilight palette (deep indigo + violet + WARM-amber lantern-pop). Always READ as twilight/night.

━━━ COUNT MIX ━━━
~60% PAIR / ~40% TRIO. Force "TWO DISTINCT chibi figures equally prominent" / "TRIO of chibi" / "all three visible" composition language. DIFFERENT species per character.

━━━ VILLAGE TYPES (mix broadly) ━━━
Warm-window cottage row under stars / Lantern-lit village square at dusk / Fairy-light-strung village / Firefly-meadow cottage cluster / Moonlit lakeside hamlet / Glow-mushroom village / Observatory-treehouse village / Lantern-festival village / Riverside-firefly village / Sunset-fading-to-stars village / Constellation-pool village / Autumn-twilight village / Lantern-bridge village / Glow-jar-meadow village / Cottage-under-aurora / Bedtime-story village

━━━ MULTI-SPECIES COMBOS ━━━
Pairs: hedgehog + fox / owl + mouse / bunny + raccoon / squirrel + chipmunk / cat + bat / badger + mouse / mole + frog
Trios: three woodland siblings / parent + two young / mixed-species gathering / family of three on a porch

━━━ COZY OVERLAY ━━━
- Architecture: cottages with WARM-amber window-glow, paper-lantern garlands, jam-jar firefly-lanterns, glow-worm streetlamps, smoke-curling-chimneys
- Twilight palette: deep indigo + violet sky + WARM-amber window-glow + lantern-pop + aqua-firefly + milky-silver moon
- Stars / galaxy-bands / soft moon visible
- Village feels LIVED IN — quilted blanket on doorstep, lantern in window, baked-pie cooling on windowsill
- Multi-character RELATIONAL — companions going home together / sharing a lantern / watching the stars together / on a porch swing together

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary night / NO horror / NO menace / NO eerie shadows
- NO storm-night / NO thunder
- NO identifiable humans
- NO single-creature entries (multi only)

━━━ DEDUP DIMENSIONS ━━━
UNIQUE village-type + species-combination + activity per entry.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures equally prominent: hedgehog and fox sharing a glow-jar on a porch swing in lantern-lit village square at dusk, paper-lantern garlands overhead"
- "TRIO of chibi mice siblings carrying tiny lanterns down a fairy-light-strung cobblestone path, all three foregrounded, smoke-curling chimneys behind"
- "TWO DISTINCT chibi figures: owl perched on bunny's head, both watching firefly-meadow village from a moss-covered fence, twilight-amber windows behind"
- "TRIO of chibi raccoons gathered around a constellation-pool, three round bodies blinking up at reflected stars, glow-mushroom streetlamps casting soft amber"
- "TWO DISTINCT chibi figures equally prominent: badger with lantern and mouse with star-chart walking observatory-treehouse village path at midnight, milky-way overhead"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

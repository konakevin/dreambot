#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/fireplace_cabin_scenes.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} FIREPLACE-CABIN scene descriptions for ChibiBot — but these are CONCEPT ART of impossibly cozy cabins, NOT real cabins. Painterly storybook illustration, never photography. 25-45 words each. NO PEOPLE.

━━━ THE LOAD-BEARING RULE ━━━
These cabins do NOT exist as real photographable interiors. They are illustrated concept-art spaces with architectural ambition that no real cabin actually achieves. If the entry could be a Pinterest "cozy cabin" photo of an actual rental, IT IS WRONG.

Every entry MUST include at least ONE architectural-ambition feature:
- Multi-level: sleeping loft above the main floor / mezzanine / split-level / step-down hearth pit / spiral stair to a tower bedroom
- Unexpected vessel: A-frame cabin built around a giant tree-trunk inside / converted-mill cabin with the watermill machinery still visible / boathouse cabin extending over a lake / cliffside cabin half-built into rock / circular yurt-cabin with central hearth / cantilevered cabin perched over a ravine
- Architectural drama: vaulted timber rafters reaching three stories, two-story stone fireplace floor-to-roof, floor-to-rafter window walls, sunken hearth pit ringed by built-in benches, cantilevered loft over the hearth, exposed log purlins crowded with hanging copper kettles + dried herbs

PLUS the FIRE is BIG — roaring, dominant, radiating amber across the entire room. Floor-to-ceiling fireplace, a stack of hearth-stones two stories high, a wood-stove glowing through mica windows, a sunken-pit fire surrounded by a hand-built stone surround.

PLUS density: piled wool throws, sheepskins layered on every chair, leather armchairs worn smooth, copper kettles + cast-iron skillets + pewter mugs on every shelf, antique snowshoes on the wall, embroidered cushions, oil lanterns hanging from every beam, books and herb-bundles wedged into every cranny.

PLUS visible cold-world outside: snow on every window, distant peaks, blizzard, evergreen forest at twilight.

━━━ INTERIOR CATEGORIES (with concept-art ambition baked in) ━━━
- A-frame cabins with three-story timber rafters and a fireplace stack reaching the apex
- Converted watermill cabins with the iron millwheel mechanism still visible inside, fire glowing nearby
- Cliffside cabins half-built into rock, one wall raw stone, fire pit at the rock-edge
- Cantilevered cabins jutting over a ravine, deck visible through floor-to-ceiling glass with snow
- Tower-cabin loft bedrooms above a main great-room, spiral-stair down to the hearth
- Sunken-pit fire rooms with circular stone surround, built-in benches, log-and-axe beam ceiling
- Yurt-style circular cabins with central hearth + smoke-hole, painted timber radiating outward
- Boathouse-cabin interiors with the boat-bay still part of the room, fire glowing on one side
- Two-story stone-fireplace great-rooms with mezzanine library above, ladder-rail
- Treehouse cabins built into the canopy of a snow-laden evergreen, fire flickering in a mason-jar stove
- Norwegian-stavkirke-style cabins with carved-wood beams forming dragon-scale rafters, soapstone stove
- Kazakh yurt + Mongolian ger interiors with fire-pit center, painted geometric beams, wool walls
- Russian dacha + izba with painted-wood interior, tile pechka glowing, samovar on table, mezzanine
- Japanese mountain irori-rooms with sunken hearth, tatami platform, paper shoji to a snow garden
- Lapland kota-cone interiors with central hearth, hanging copper, reindeer hide on every surface
- Alpine-chalet great-rooms with three-story stone-and-timber, mezzanine bookshelves, sleeping-loft
- Dragon-style stavkirke cabins with carved-wood beam ceilings rising into shadow

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. ONE architecturally ambitious feature explicitly named (loft above / vaulted three-story rafters / cantilever / stone-fireplace floor-to-roof / sunken hearth pit / etc.)
2. The fire is BIG and described in detail (roaring birch logs / two-story flames / sparks rising / mica window glowing cherry-red)
3. Concept-art-density of cozy textiles and wooden objects (layered sheepskins, embroidered cushions, copper kettles, oil lanterns)
4. Cold-world outside named (snow on window / distant peaks / blizzard / pine boughs sagging)
5. Anti-photoreal anchor: "painterly", "concept-art-cozy", "Studio Ghibli interior background", "Eyvind Earle warmth", "hand-illustrated"

━━━ HARD BANS ━━━
- NO people / figures / hands / faces (sleeping cat / dog OK)
- NO surreal: NO floating logs, NO levitating fire, NO fantasy creatures
- NO real-Airbnb-rental register — every cabin must have concept-art architectural ambition
- NO modern minimalism (white walls, glass, steel, IKEA) — wood, wool, stone, antique
- NO summer / spring / daytime — winter, dusk/night/blizzard ALWAYS
- The fire MUST be visibly burning bright (never a cold or barely-glowing hearth)

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "A-frame mountain cabin with three-story timber rafters meeting at the apex, two-story floor-to-roof stone fireplace blazing birch logs the size of arms, sleeping loft above with a rolling ladder, leaded windows showing blizzard on snow-laden pines, sheepskins layered on the leather armchair, painterly concept art"
EX-2: "Treehouse cabin built into the canopy of a snow-laden evergreen, mason-jar stove glowing cherry-red on the platform, deck cantilevered over a forty-foot drop, snow piling on the windowsill, copper kettle steaming on the stove-top, hanging brass lanterns, Studio Ghibli storybook illustration"
EX-3: "Cliffside cabin half-built into raw stone, the rear wall living rock, sunken fire-pit ringed with hand-cut stone benches piled with wool throws, fire roaring three feet tall, single floor-to-ceiling glass wall showing blizzard over the gorge, painterly Eyvind Earle warmth"
EX-4: "Russian dacha with two-story painted timber walls, white-tile pechka stove glowing through ornamental grilles, mezzanine bedroom above accessible by carved spiral stair, samovar steaming on the lower table, embroidered linen everywhere, frost-rimmed window framing birch grove at deep twilight, concept-art density"
EX-5: "Mongolian ger interior with central iron stove glowing through its grate, smoke spiraling up to the smoke-hole at the apex, painted geometric beams radiating outward, wool walls layered with hand-loomed rugs, copper kettle on the stove, snow piling visible through the door-flap, painterly storybook"

━━━ OUTPUT ━━━
JSON array of ${n} strings. Dense, comma-rich, concept-art-ambitious. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

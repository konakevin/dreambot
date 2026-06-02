#!/usr/bin/env node
/**
 * One-time append: balance arctic_village_scenes.json with ADULT-creature
 * scenes. Existing 200 entries are 78% baby-creature scenes; target = 314
 * total (~50/50 after append).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_village_scenes.json',
  total: 314,
  append: true,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} ARCTIC-VILLAGE SCENE descriptions for CuddleBot's arctic-village path. The existing pool features baby creatures in most scenes — your job is to add ADULT-creature scenes (and some empty-architecture scenes) to balance.

Cozy snow / ice / aurora / sub-arctic / alpine VILLAGES + LOG-CABINS + IGLOO-CLUSTERS + SNOWY-PINE-COTTAGES. Pixar / Sanrio / Studio Ghibli / Frozen / Polar-Express STYLIZED — never photoreal, never documentary.

Each entry: 18-28 words. ONE specific arctic-village scene with COZY ARCHITECTURE detail.

━━━ ABSOLUTE AGE RULE — NON-NEGOTIABLE ━━━
BANNED creature-words: baby, cub, kit, pup, chick, kitten, puppy, duckling, fawn, joey, calf, piglet, fledgling, nestling, hatchling, juvenile, infant, newborn, tiny.
EVERY creature must be ADULT — mature, weathered, full-grown, elder, patriarch, matriarch, dignified.

━━━ CRITTER MIX RULE ━━━
- ~75% of entries: scene includes ONE adult creature doing village life (peripheral)
- ~25% of entries: PURE architecture, no creature

━━━ VILLAGE TYPES (mix broadly) ━━━
- Snow-cottage town with candy-cane fences — snow-roofed cottages, candy-cane fences, twinkle-string-lights
- Igloo cluster with lantern-paths — round igloos, lantern-poles lining a path between
- Snowy-pine-cottage cluster — cottages tucked under snow-laden pine boughs, lantern-string-lights
- Log-cabin village under aurora — log-cabin cluster on snow-meadow, aurora-violet/teal sky
- Gingerbread-snow-fortress — sweet-shop snow village, gingerbread-trim cottages, frosting-icicles
- Polar-station cottage — cluster of red+white research cottages on snow-platform, brass-trim
- Snowy-mountain hamlet — cottages climbing snowy slope, winding path, church-spire at top
- Frozen-pond skating-village — village around frozen pond, lantern-lit benches, twinkle-lights
- Snow-pine-tunnel village — village along low-arch tunnel of snow-laden boughs, lantern-trail
- Cozy log-cabin row at sunrise — snow-roofed log-cabin row, warm window-glow, smoke from chimneys
- Reindeer-stable hamlet — reindeer-friendly stable + cottage cluster, hay-bales, lantern-glow
- Frost-fair market square — snow-village square with stalls, twinkle-light arches, wooden benches
- Aurora-watching observatory village — telescope-cabin village on snow-cliff overlooking aurora
- Hot-spring snow-cove village — cottages around steaming hot-spring rimmed with snow + ice
- Holiday-twinkle village — Christmas-village with lit garlands on every roof, candy-cane streetlamps

━━━ ADULT ARCTIC CREATURES (when present) ━━━
mature polar bear with weathered coat, arctic fox in winter pelt, snowy owl with golden gaze, bull caribou with crown antlers, reindeer matriarch, walrus patriarch, harbor seal elder, mountain goat scrambling, bighorn sheep with full curl, lynx with tufted ears, wolverine wandering, ermine elder in white coat, mountain hare resting, snow leopard ghost-pale, musk-ox patriarch with shaggy mantle, gyrfalcon perched, ptarmigan in winter plumage, raven with knowing tilt, brown bear elder fishing, alpine marmot guarding, pika gathering grass, frost-spirit ancient, ice-mage with crystal-staff, snow-witch with frost-cloak, aurora-shaman, frost-giant grandmother

━━━ COZY OVERLAY (every entry) ━━━
- Architecture rendered with obsessive cozy detail: snow-roofed log-cabin cottages with WARM-amber window-glow, candy-cane fence-posts, twinkle-string-lights between rooflines, smoke-curling-from-stone-chimneys, paw-prints in snow, pine-bough wreaths on doors, jingle-bell garlands, lantern-poles with golden glow, snowdrift-piled doorsteps
- Pearl-white snow + sky-pink dawn + soft-mint ice + WARM igloo-amber + aurora violet/teal palette
- Soft snowflake-particle drift, soft falling snow, soft rim-light from aurora or lantern
- Village feels LIVED IN — knit-blanket on porch swing, snow-shovel by door, sled parked at cabin, wood-stack covered in fresh snow, baked-pie cooling on windowsill
- Adult creature (when present) doing village life — splitting wood, lighting a lantern, returning home with a satchel, watching the aurora from a porch, walking between cottages

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO Nat-Geo
- NO grim arctic / NO blizzard-survival-horror / NO bleak
- NO blood-on-snow / NO predator-track / NO violence
- NO climate-change-grim / NO melting-cap-sad
- NO identifiable humans
- NO baby creatures
- NO chibi tropes (oversized dewy eyes, blushing, stubby paws)

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
Deduplicate by: village-type + key-architectural-feature + creature-species (or empty) + time-of-day. Vary VILLAGE-TYPE + ADULT-SPECIES + UNIQUE-DETAIL. Scan "ALREADY GENERATED" — those are baby-creature versions; yours use DIFFERENT adult species and DIFFERENT activities.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Mature polar bear paused on snow-cottage town path at sunset, candy-cane fences, twinkle-lights between rooflines, smoke from chimneys"
- "Empty igloo cluster at dawn, round igloos with warm window-glow, lantern-poles lining path, drifting snowflakes"
- "Snowy owl perched on a log-cabin chimney under aurora, log-cabin cluster on snow-meadow, ribbon-aurora violet-teal sky"
- "Reindeer matriarch grazing beside a reindeer-stable hamlet at golden-hour, hay-bales stacked, lantern-glow from cabin windows"
- "Frost-fair market square at twilight, stalls with twinkle-light arches, no creatures, just lantern-glow on snow-cobblestones"
- "Bull caribou crossing a frozen-pond skating-village, lantern-lit benches around the edge, snow-cottages with smoke-from-chimneys"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});

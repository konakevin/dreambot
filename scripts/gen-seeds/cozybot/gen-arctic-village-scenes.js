#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cozybot/seeds/arctic_village_scenes.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ARCTIC-VILLAGE SCENE descriptions for CuddleBot's arctic-village path. Cozy snow / ice / aurora / sub-arctic / alpine VILLAGES + LOG-CABINS + IGLU-CLUSTERS + SNOWY-PINE-COTTAGES that the viewer wants to move into. The ARCHITECTURE and ATMOSPHERE are the hero — not the creatures. Pixar / Sanrio / Studio Ghibli / Frozen / Polar-Express aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 18-28 words. ONE specific arctic-village scene with COZY ARCHITECTURE detail.

━━━ CRITTER RULE — NON-NEGOTIABLE ━━━
EVERY entry MUST include at least one cute baby arctic creature in the scene — polar bear cub leaving paw-prints, fox kit peeking from a snow-burrow, baby penguin chick on a porch, snowy owl perched on a chimney, ermine carrying a tiny bag. The CRITTER + the COZY VILLAGE together = the cute. Architecture alone is not cute — the critter adds the soul. Critter is peripheral (small in frame, not center) but ALWAYS PRESENT.

━━━ VILLAGE TYPES (mix broadly across all entries) ━━━
- Snow-cottage town with candy-cane fences — row of snow-roofed cottages, candy-cane fence-posts, twinkle-string-lights between rooflines
- Igloo cluster with lantern-paths — cluster of round igloos, lantern-poles lining a path between, warm-amber window-glow from each
- Snowy-pine-cottage cluster — cottages tucked under snow-laden pine boughs, lantern-string-lights between trees, smoke-chimneys
- Log-cabin village under aurora — log-cabin cluster on a snow-meadow, aurora-violet/teal sky overhead, warm window-glow
- Gingerbread-snow-fortress — sweet-shop-style snow village with gingerbread-trim cottages, frosting-icicles, candy-cane lampposts
- Polar-station cottage — cluster of cozy red+white research cottages on a snow-platform, brass-trim, lantern-on-roof
- Snowy-mountain hamlet — cottages climbing a snowy slope, winding path, church-spire at top, fir-trees framing
- Frozen-pond skating-village — village around a frozen pond, lantern-lit benches at the edge, twinkle-lights between cottages
- Snow-fort village — kids' snow-block fort village, cute snow-castle, paths with footprints, lantern-poles
- Snow-globe village (perfect dome scene) — viewed-from-outside snow-globe with a tiny cottage, fir trees, drifting snowflakes
- Snow-pine-tunnel village — village along a low-arch tunnel of snow-laden boughs, lantern-trail, soft footprints in snow
- Cozy log-cabin row at sunrise — snow-roofed log-cabin row, warm window-glow, smoke from chimneys, rosy alpenglow on snow
- Reindeer-stable hamlet — reindeer-friendly stable + cottage cluster, hay-bales, lantern-glow, snow-covered roofs
- Frost-fair market square — snow-village square with stalls, twinkle-light arches, wooden-bench seating, pine-bough wreaths
- Aurora-watching observatory village — telescope-cabin village on a snow-cliff overlooking aurora-lit horizon
- Snow-pine-meadow cabin — solitary cabin in a moonlit snow-meadow, fir-trees framing, smoke from chimney, paw-prints in snow
- Hot-spring snow-cove village — cottages around a steaming hot-spring rimmed with snow + ice, lantern-glow, soft warm steam
- Holiday-twinkle village — full-on Christmas-village with lit garlands on every roof, candy-cane streetlamps, snow-paths, sleigh-tracks

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Architecture rendered with obsessive cozy detail: snow-roofed log-cabin cottages with WARM-amber window-glow, candy-cane fence-posts, twinkle-string-lights between rooflines, smoke-curling-from-stone-chimneys, fresh paw-prints in snow, pine-bough wreaths on doors, jingle-bell garlands, lantern-poles with golden glow at every cottage, snowdrift-piled doorsteps
- Pearl-white snow + sky-pink dawn + soft-mint ice + WARM igloo-amber + aurora violet/teal palette
- Soft snowflake-particle drift, soft falling snow, soft rim-light from aurora or lantern
- The village feels LIVED IN — knit-blanket on a porch swing, snow-shovel leaning by a door, sled parked at a cabin, wood-stack covered in fresh snow, baked-pie cooling on a windowsill
- Optional small peripheral creature (polar bear cub, fox kit, penguin chick, reindeer calf, ermine, snowy-owl) doing something cute in the village
- Always WARM-cozy despite cold biome — never grim, never bleak

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO National-Geographic
- NO grim arctic / NO blizzard-survival-horror / NO frozen-desperation
- NO blood-on-snow / NO predator-track / NO violence
- NO climate-change-grim / NO melting-cap-sad
- NO identifiable humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: village-type + key-architectural-feature + time-of-day + creature-vs-empty. Vary VILLAGE-TYPE + LIGHT-CONDITION + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Snow-cottage town at sunset, row of snow-roofed cottages with WARM-amber windows, candy-cane fence-posts, twinkle-string-lights, smoke from chimneys"
- "Empty igloo cluster at dawn, round igloos with warm window-glow, lantern-poles lining a path between, drifting snowflakes, soft pink horizon"
- "Fox kit leaving fresh paw-prints on a snow-pine village street, lantern-string-lights between trees, log-cabin cottages with smoke-from-chimneys"
- "Aurora-watching observatory village at midnight, telescope-cabin cluster on a snow-cliff, ribbon-aurora violet-teal sky overhead, twinkle-lantern between"
- "Frozen-pond skating-village at golden-hour, smooth-mirror ice, lantern-lit benches at the edge, twinkle-lights between snow-cottages"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

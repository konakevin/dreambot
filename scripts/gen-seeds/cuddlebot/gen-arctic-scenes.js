#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/arctic_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SNOWY-ARCTIC SCENE descriptions for CuddleBot's snowy-arctic path. Adorable arctic / sub-arctic / alpine / sea-ice / snow-pine-forest / aurora-night settings where cute baby cold-weather creatures live. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Happy-Feet / baby-Christmas-special aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 15-25 words. ONE specific snowy-arctic scene with HABITAT details + cute interaction hint.

━━━ HABITAT TYPES (mix broadly across all entries) ━━━
- Igloo nursery (round igloo with warm window-glow, knitted-blanket entrance, snow-pile pillows inside)
- Snow-cave den (cozy dug-out cave under a snowdrift, soft fluffy bedding, lantern-glow)
- Ice-floe nursery (floating ice-platform with cuddly nap-pile)
- Snowy pine-forest clearing (snow-laden pine boughs, soft snow-floor, lantern-string-lights between trees)
- Frozen-pond skating-cove (smooth ice surface, snow-banks rimmed with fir-trees, twinkling-lights)
- Aurora-watching cliff (snow-cliff overlooking aurora-lit horizon, cuddly creatures in fluff-pile)
- Snowy mountain ridge at dawn (rosy alpenglow, soft snow drifts, baby-creature pair perched)
- Hot-spring snow-cove (steaming turquoise hot-spring rimmed with snow + ice, a creature pair soaking)
- Reindeer-stable barn (cozy wooden barn, hay + soft straw bedding, warm lantern-glow, snow outside the door)
- Snow-fort village (cute snow-block forts, paths with footprints, lantern-poles, warm window-glow)
- Snow-globe scene (perfect dome-snowfall scene with a tiny cottage, fir trees, drifting snowflakes)
- Snow-pine-tunnel path (low-arch tunnel of snow-laden boughs, lantern-trail, soft footprints in snow)
- Cozy log-cabin (snow-roofed log-cabin with warm window-glow, smoke from chimney, candy-cane fence)
- Frozen waterfall grotto (gentle cascade of icicle-curtains, glow-fish-lantern, snow-floor)
- Northern-lights bay (curving icy bay reflecting aurora colors on calm water)
- Snow-flake meteor shower (snowflakes drifting like stars, baby creatures wonder-eyed)
- Ice-castle play-fort (cute kid-sized ice-castle of snow-blocks, twinkle-light strings, snow-throne)
- Penguin huddle-circle (round huddle of fluff with one peeking out, snow-flurries above)
- Sea-otter kelp-raft (in cold water, otters wrapped in kelp, snow-falling on their fluff)
- Reindeer-sleigh ride (reindeer pair pulling a tiny sleigh on snow, lantern-jingle-bells, fir-trees behind)

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Pearl-white snow + sky-pink dawn + soft-mint ice + warm igloo-amber + aurora violet/teal palette
- Soft snowflake-particle drift, soft falling snow, soft rim-light from aurora or lantern
- Optional cute habitat-details (jingle-bell garlands, twinkle-string-lights, knitted-blankets, snow-pile pillows)
- The scene ANTICIPATES creatures — leave room for cute pair to do something cute (cuddle, peek, watch-aurora, share-scarf, nap)
- Always WARM-cozy despite cold biome — never grim, never bleak

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO National-Geographic
- NO grim arctic / NO blizzard-survival-horror / NO frozen-desperation
- NO blood-on-snow / NO predator-track / NO violence
- NO climate-change-grim / NO melting-cap-sad
- NO identifiable humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: habitat-type + key-feature + time-of-day. "Igloo with glow inside" and "warm-window igloo nursery" are TOO SIMILAR. Vary HABITAT + LIGHT-CONDITION + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Igloo nursery at twilight, warm window-glow, knitted-blanket entrance flap, snow-pile pillows inside, drifting snowflakes outside"
- "Aurora-watching cliff at midnight, snow-cliff overlooking ribbon-aurora horizon, fluff-pile of creatures gazing up, twinkle-lantern between them"
- "Snowy pine-forest clearing at dusk, snow-laden boughs, soft snow-floor, lantern-string-lights between trees, gentle snow drifting"
- "Frozen-pond skating-cove at golden-pink-sunset, smooth-mirror ice, snow-banks rimmed with fir-trees, tiny garland of paper-snowflakes overhead"
- "Cozy log-cabin scene at sunrise, snow-roofed cabin, warm window-glow, smoke from chimney, candy-cane fence, fox-paw prints in fresh snow"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });

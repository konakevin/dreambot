#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} POST-APOCALYPTIC DRAMA entries — 40%-gated subtle events at the ruin scene, NEVER positioning wanderer back-to-camera.

Each 12-20 words. Event + post-apocalyptic aesthetic + frame placement. QUIET, bittersweet, hopeful — NEVER explosion / combat / horror.

VARIETY:
- 18% SUN-SHAFT-THROUGH-RUIN (sun-shaft striking through shattered-ceiling onto wanderer's shoulder / golden-beam through broken-skylight catching dust / amber-shaft from blast-hole)
- 14% DISTANT-FIREFLY-OR-SPORE-CLOUD (firefly-cloud emerging at twilight beyond ruin / drifting bioluminescent-spore-cloud at midground / glow-pollen rising at dusk)
- 12% NATURE-STARTLE (deer startling and freezing in midground / flock-of-birds lifting from ruin / cat sprinting across rail-bed / fox darting through doorway)
- 10% DRIFT-SNOW-OR-SPORE (light-snow drifting through broken-window / drifting-ash settling on shoulder / drift-pollen swirling at midground / petals drifting through ruin)
- 10% RUSTED-MONUMENT-FALLING (creaking sign tipping slowly at midground / wall-section crumbling in distance / vine-snapping with metal-twang / brick-tumbling in deep frame)
- 8% DISTANT-CAMPFIRE-LIGHT (smoke-curl from far-away campfire on horizon / glow of distant fire in valley / lantern-light in distant window)
- 6% RADIO-BURST-OR-MELODY (faint radio-signal crackling from accessory / distant-bell tolling from collapsed-temple / music-box ditty drifting on breeze)
- 6% TIDE-OR-WATER-MOMENT (lapping-tide reaching boots / drip-cascade from broken-pipe / ripple in puddle catching sky)
- 6% FIRST-STARS-OR-AURORA (first-stars appearing through ceiling-gap / aurora-pulse visible through skylight / passing-meteor at deep distance)
- 6% PLANT-BLOOM (single flower-bloom on collapsed-wall / sapling-blossom catching shaft / lotus-floating in flooded-ruin)
- 4% RAIN-START (first-raindrops on rusted-roof beside wanderer / drizzle starting through ceiling-gap / soft-rain on broken-glass)

DO write:
- Sun-shaft striking through shattered-ceiling onto wanderer's shoulder, peach-glow on cheek
- Firefly-cloud emerging at twilight in deep background, pinpoints of green-white light
- Deer startling and freezing in midground concourse, ears alert, vapor-breath
- Light-snow drifting through broken-window beside wanderer with flakes catching light
- Creaking metal-sign tipping slowly in midground with rust-flakes raining down
- Smoke-curl from far-away campfire on horizon, soft-grey against dusk-sky
- First-stars appearing through ceiling-gap above wanderer, faint white pinpoints

DO NOT: drama positioning wanderer back-to-camera. Drama wanderer is FACING AWAY to admire. Combat. Explosions. Zombies. Blood. Photoreal.

Drama enhances quiet ruin atmosphere. Wanderer is INSIDE it engaged, NOT staring out at it.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
